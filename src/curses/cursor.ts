import tty from "tty";
import { IPoint } from "../../typing/point";
import { constants } from "./constants";

export class Cursor {
  stdout: tty.WriteStream;

  constructor(stdout: tty.WriteStream) {
    this.stdout = stdout;
  }

  home() {
    this.stdout.write(constants.ESC + "[H");
  }

  moveTo(point: IPoint) {
    this.stdout.write(constants.ESC + `[${point.y};${point.x}H`)
  }

  moveUp(nLine: number) {
    this.stdout.write(constants.ESC + `[${nLine}A`);
  }

  moveDown(nLine: number) {
    this.stdout.write(constants.ESC + `[${nLine}B`);
  }

  moveRight(nLine: number) {
    this.stdout.write(constants.ESC + `[${nLine}C`);
  }

  moveLeft(nLine: number) {
    this.stdout.write(constants.ESC + `[${nLine}D`);
  }

  async getPos(stdin: tty.ReadStream): Promise<IPoint> {
    this.stdout.write(constants.ESC + "[6n");
    return await new Promise((resolve) => {
      stdin.once("data", (data) => {
        const r = /\x1b\[([0-9]*);([0-9]*)/.exec(data.toString("utf8"));
        resolve({ x: Number.parseInt(r![1]), y: Number.parseInt(r![2]) });
      })
    })
  }
}

