/* scripts\online.js */
import qrcode from "qrcode-terminal";
import os from "os";

function getLocalIP() {
  const nets = os.networkInterfaces();
  for (const name of Object.keys(nets)) {
    for (const net of nets[name]) {
      if (net.family === "IPv4" && !net.internal) {
        return net.address;
      }
    }
  }
  return "localhost";
}

const ip = getLocalIP();
const port = 5173;

const url = `http://${ip}:${port}`;
console.log("📱 Open on mobile:");
qrcode.generate(url, { small: true });
console.log(url);
