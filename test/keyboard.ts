import { Parser } from "../src/curses";
import { Keyboard } from "../src/curses/keyboard";
import tty from "tty";

const p = new Parser();
const r = new tty.ReadStream(process.stdin.fd);
const w = new tty.WriteStream(process.stdout.fd);
const k = new Keyboard(r, w);

k.on("key", (key) => console.log(key));

r.on("data", (data) => {
  if (data.toString() === "q") {
    process.exit();
  }
});
