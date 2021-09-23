import tty from "tty";
import { Parser } from "../curses";
import { Mouse } from "../curses/mouse";

const r = new tty.ReadStream(process.stdin.fd);
const w = new tty.WriteStream(process.stdout.fd);

new Parser();
const m = new Mouse(r, w);
m.on("mouse", (d) => console.error(d));

m.enableMouse();
m.disableMouse();
m.listen();
console.log("\x1b[?1003h");

r.on("data", (d) => {
  if (d.toString() === "q") {
    process.exit();
  }
});
