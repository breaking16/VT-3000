import fs from "fs";
import path from "path";

const name = process.argv[2];

if (!name) {
  console.error("❌ Page name required: npm run new about");
  process.exit(1);
}

const filePath = path.resolve("src", `${name}.html`);

if (fs.existsSync(filePath)) {
  console.error("❌ Page already exists");
  process.exit(1);
}

const PageName = name.charAt(0).toUpperCase() + name.slice(1);

const tpl = `<template src="@components/templates/main/main.html" locals='{
  "title": "${PageName}",
  "lang": "en",
  "preloader": { "enable": "false", "once": "false" },
  "keywords": "",
  "description": ""
}'>
  <block name="header">
    <include src="@components/layout/header/header.html" locals='{
      "active":"${PageName}",
      "home":"false"
    }'></include>
  </block>

  <block name="main">
    <h1>${PageName}</h1>
  </block>

  <block name="letstalk">
    <include src="@components/custom/letstalk/letstalk.html"></include>
  </block>

  <block name="footer">
    <include src="@components/layout/footer/footer.html"></include>
  </block>
</template>
`;

fs.writeFileSync(filePath, tpl, "utf-8");
console.log(`✅ Page created: ${filePath}`);
