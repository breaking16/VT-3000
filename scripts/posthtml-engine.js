/* scripts\posthtml-engine.js */
import fs from "fs";
import path from "path";
import { parser as parse } from "posthtml-parser";
import { render } from "posthtml-render";

export function createPostHtmlEngine({ root, aliases = {} }) {
  function resolveAlias(src) {
    for (const key in aliases) {
      if (src.startsWith(key)) {
        return path.resolve(root, src.replace(key, aliases[key]));
      }
    }
    return path.resolve(root, src);
  }

  function read(filePath) {
    return fs.readFileSync(filePath, "utf-8");
  }

  function safeJson(str) {
    if (!str) return {};
    try {
      return JSON.parse(str);
    } catch {
      return {};
    }
  }

  function getByPath(obj, pathStr) {
    return pathStr.split(".").reduce((acc, k) => acc?.[k], obj);
  }

  // replaces [[a]] and [[a.b]] but keeps unresolved markers
  function replaceMarkers(str, ctx) {
    if (typeof str !== "string") return str;
    return str.replace(/\[\[([^\]]+)]]/g, (full, key) => {
      const val = key.includes(".") ? getByPath(ctx, key) : ctx[key];
      return val === undefined || val === null ? full : String(val);
    });
  }

  // walk tree and replace markers in text + attrs
  function applyContextToTree(tree, ctx) {
    function walk(node) {
      if (typeof node === "string") return replaceMarkers(node, ctx);

      if (Array.isArray(node)) return node.map(walk);

      if (node && typeof node === "object") {
        if (node.attrs) {
          for (const k of Object.keys(node.attrs)) {
            node.attrs[k] = replaceMarkers(node.attrs[k], ctx);
          }
        }
        if (node.content) node.content = node.content.map(walk);
        return node;
      }

      return node;
    }
    return walk(tree);
  }

  function parseLocalsFromAttrs(node) {
    const localsRaw = node?.attrs?.locals;
    return safeJson(localsRaw);
  }

  function mergeCtx(parent, own) {
    return { ...(parent || {}), ...(own || {}) };
  }

  function evalIfCondition(conditionRaw, ctx) {
    // expected forms:
    // "'[[active]]' === '[[item.id]]'"
    // "'[[home]]' !== 'true'"
    const cond = replaceMarkers(conditionRaw || "", ctx).trim();

    // normalize:  "left" === "right"
    const m = cond.match(/^['"](.+?)['"]\s*(===|!==)\s*['"](.+?)['"]$/);
    if (!m) return false;

    const left = m[1];
    const op = m[2];
    const right = m[3];

    return op === "===" ? left === right : left !== right;
  }

  async function processHtmlString(html, ctx = {}) {
    const tree = parse(html, { recognizeSelfClosing: true });

    async function transform(nodes, localCtx) {
      if (!Array.isArray(nodes)) return nodes;

      const out = [];

      // IMPORTANT: classic for-loop so we can "consume" <else>
      for (let i = 0; i < nodes.length; i++) {
        const node = nodes[i];

        // text node
        if (typeof node === "string") {
          out.push(replaceMarkers(node, localCtx));
          continue;
        }

        // unknown node
        if (!node || typeof node !== "object") {
          out.push(node);
          continue;
        }

        const tag = node.tag;

        // ⛔️ NEVER render <else> directly (else must be consumed only by <if>)
        if (tag === "else") {
          continue;
        }

        // ---- <layout> ----
        if (tag === "layout") {
          const layoutLocals = parseLocalsFromAttrs(node);
          const ctx2 = mergeCtx(localCtx, layoutLocals);

          const src = node.attrs?.src;
          if (!src) {
            const inner = await transform(node.content || [], ctx2);
            out.push(...inner);
            continue;
          }

          const layoutPath = resolveAlias(src);
          const layoutHtml = read(layoutPath);

          // gather blocks from inside <layout>
          const blocks = {};
          const children = node.content || [];

          for (const ch of children) {
            if (typeof ch === "object" && ch?.tag === "block") {
              const name = ch.attrs?.name;
              if (!name) continue;
              const processedBlockNodes = await transform(ch.content || [], ctx2);
              blocks[name] = processedBlockNodes;
            }
          }

          // parse layout template and replace <slot>
          const layoutTree = parse(layoutHtml, { recognizeSelfClosing: true });

          async function replaceSlots(nodes2) {
            if (!Array.isArray(nodes2)) return nodes2;
            const res = [];

            for (const n of nodes2) {
              if (typeof n === "string") {
                res.push(replaceMarkers(n, ctx2));
                continue;
              }

              if (n && typeof n === "object") {
                if (n.tag === "slot") {
                  const slotName = n.attrs?.name;
                  const fallback = n.content || [];
                  const slotContent =
                    blocks[slotName] ?? (await replaceSlots(fallback));

                  res.push(
                    ...(Array.isArray(slotContent) ? slotContent : [slotContent]),
                  );
                  continue;
                }

                if (n.content) n.content = await replaceSlots(n.content);

                if (n.attrs) {
                  for (const k of Object.keys(n.attrs)) {
                    n.attrs[k] = replaceMarkers(n.attrs[k], ctx2);
                  }
                }

                res.push(n);
                continue;
              }

              res.push(n);
            }

            return res;
          }

          const withSlots = await replaceSlots(layoutTree);

          // now process includes/each/if inside layout result
          const fully = await transform(withSlots, ctx2);
          out.push(...fully);
          continue;
        }

        // ---- <include> ----
        if (tag === "include") {
          const includeLocals = parseLocalsFromAttrs(node);
          const ctx2 = mergeCtx(localCtx, includeLocals);

          const src = node.attrs?.src;
          if (!src) continue;

          const filePath = resolveAlias(src);
          const content = read(filePath);

          const includedTree = parse(content, { recognizeSelfClosing: true });
          const processed = await transform(includedTree, ctx2);
          out.push(...processed);
          continue;
        }

        // ---- <each> ----
        if (tag === "each") {
          const loopRaw = node.attrs?.loop || "item";
          const src = node.attrs?.src;
          const templateNodes = node.content || [];

          let list = [];
          let varName = "item";

          // inline syntax: loop="item in[ {...}, {...} ]"
          const inlineMatch = loopRaw.match(/^(\w+)\s+in\s+([\s\S]+)$/);

          if (inlineMatch) {
            varName = inlineMatch[1];
            try {
              list = JSON.parse(inlineMatch[2]);
            } catch {
              list = [];
            }
          } else if (src) {
            // JSON file syntax
            varName = loopRaw;
            const filePath = resolveAlias(src);
            try {
              list = JSON.parse(read(filePath));
            } catch {
              list = [];
            }
          }

          for (const item of list) {
            const ctx2 = mergeCtx(localCtx, { [varName]: item });
            const cloned = JSON.parse(JSON.stringify(templateNodes));
            const processed = await transform(cloned, ctx2);
            out.push(...processed);
          }

          continue;
        }
        // ---- <if> (else is ALWAYS inside if) ----
        if (tag === "if") {
          const cond = node.attrs?.condition || "";
          const ok = evalIfCondition(cond, localCtx);

          const children = node.content || [];

          let yesNodes = [];
          let elseNodes = [];
          let inElse = false;

          for (const ch of children) {
            if (typeof ch === "object" && ch.tag === "else") {
              inElse = true;
              elseNodes = ch.content || [];
              continue;
            }
            if (!inElse) yesNodes.push(ch);
          }

          const yes = await transform(yesNodes, localCtx);
          const no = await transform(elseNodes, localCtx);

          out.push(...(ok ? yes : no));
          continue;
        }

        // default: recurse children & replace markers in attrs
        if (node.attrs) {
          for (const k of Object.keys(node.attrs)) {
            node.attrs[k] = replaceMarkers(node.attrs[k], localCtx);
          }
        }

        if (node.content) node.content = await transform(node.content, localCtx);
        out.push(node);
      }

      return out;
    }

    const transformed = await transform(tree, ctx);
    const withCtx = applyContextToTree(transformed, ctx); // safety pass
    return render(withCtx);
  }

  return { processHtmlString };
}
