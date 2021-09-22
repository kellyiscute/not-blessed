import tty from "tty";
import { constants } from "./constants";


export class Screen {
  stdin: tty.ReadStream;
  stdout: tty.WriteStream;

  constructor(stdin: tty.ReadStream, stdout: tty.WriteStream) {
    this.stdout = stdout;
    this.stdin = stdin;
  }

  clear() {
    this.stdout.write(constants.ESC + "[2J");
  }

  clearFromCur() {
    this.stdout.write(constants.ESC + "[0J");
  }

  clearToBeginningOfScr() {
    this.stdout.write(constants.ESC + "[1J");
  }

  clearLine() {
    this.stdout.write(constants.ESC + "[K");
  }

  clearToBeginningOfLine() {
    this.stdout.write(constants.ESC + "[0K");
  }
}

