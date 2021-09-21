import tty from "tty";
import {constants} from "./constants";

export class Cursor {
  stdin: tty.ReadStream;

  constructor(stdin: tty.ReadStream) {
    this.stdin = stdin;
  }

  home() {
    this.stdin.write(constants.ESC + "[H");
  }
}

