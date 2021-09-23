import tty from "tty";

export class Parser {
  constructor() {
    const r = new tty.ReadStream(process.stdin.fd);
    r.setRawMode(true);
  }
}
