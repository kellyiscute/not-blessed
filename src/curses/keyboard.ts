import EventEmitter from "events";
import tty from "tty";
import { isSS3, isCSI, isEscape } from "./helper";

export declare interface Keyboard {
  on(event: "key", listener: (key: string) => void): this;
}

export class Keyboard extends EventEmitter {
  stdin: tty.ReadStream;
  stdout: tty.WriteStream;

  constructor(stdin: tty.ReadStream, stdout: tty.WriteStream) {
    super();
    this.stdout = stdout;
    this.stdin = stdin;
    this.stdin.on("data", (data) => this._listen(data));
  }

  _listen(data: Buffer) {
    if (!isEscape(data) && data[0] > 31) {
      this.emit("key", data.toString());
      return;
    } else if (!isEscape(data)) {
      this.emit("key", data[0]);
      return;
    }
    if (isSS3(data)) {
      const SS3_KEYS: { [k: string]: string } = {
        P: "F1",
        Q: "F2",
        R: "F3",
        S: "F4",
      };
      this.emit(
        "key",
        SS3_KEYS[String.fromCharCode(data[2])] ?? "Unknown Function Key"
      );
    } else if (isCSI(data)) {
      if (data[2] === 0x31) {
        const CSI_1_KEYS: { [k: string]: string } = {
          0x35: "F5",
          0x37: "F6",
          0x38: "F7",
          0x39: "F8",
        };
        this.emit("key", CSI_1_KEYS[data[3]!] ?? "Unknown Function Key");
      } else if (data[2] === 0x32) {
        const CSI_2_KEYS: { [k: string]: string } = {
          0x7e: "Insert",
          0x30: "F9",
          0x31: "F10",
          0x33: "F11",
          0x34: "F12",
        };
        this.emit("key", CSI_2_KEYS[data[3]!] ?? "Unknown Function Key");
      } else {
        const CSI_SINGLE_KEYS: { [key: number]: String } = {
          0x33: "Delete",
          0x48: "Home",
          0x46: "End",
          0x35: "PageUp",
          0x36: "PageDown",
          0x41: "Up",
          0x42: "Down",
          0x43: "Right",
          0x44: "Left",
        };
        this.emit("key", CSI_SINGLE_KEYS[data[2]]);
      }
    }
  }
}
