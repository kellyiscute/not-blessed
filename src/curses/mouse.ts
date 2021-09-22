import { EventEmitter } from "events";
import tty from "tty";
import { IPoint } from "../../typing/point";
import { constants } from "./constants";

export interface IMouseEvent extends IPoint {
  button: number;
  shift: boolean;
  meta: boolean;
  control: boolean;
  motion: boolean;
}

export declare interface Mouse extends EventEmitter {
  // low level mouse event
  on(event: "mouse", listener: (data: IMouseEvent) => void): this;
  on(event: "mouse_move", listener: (data: IMouseEvent) => void): this;
  on(event: "mouse_down", listener: (data: IMouseEvent) => void): this;
  on(event: "mouse_up", listener: (data: IMouseEvent) => void): this;
  on(event: "wheel_up", listener: (data: IMouseEvent) => void): this;
  on(event: "wheel_down", listener: (data: IMouseEvent) => void): this;
}

export class Mouse extends EventEmitter {
  stdin: tty.ReadStream;
  stdout: tty.WriteStream;

  constructor(stdin: tty.ReadStream, stdout: tty.WriteStream) {
    super();
    this.stdin = stdin;
    this.stdout = stdout;
  }

  enableMouse() {
    this.stdout.write(constants.ESC + "[?1003h");
  }

  disableMouse() {
    this.stdout.write(constants.ESC + "[?1003l");
  }

  listen() {
    this.stdin.on("data", (data) => this._listen(data));
  }

  _listen(data: Buffer) {
    // -------- event constants ---------
    /* Not used
      const BTN1 = 0;
      const BTN2 = 1;
      const BTN3 = 2;
      const RELEASED = 3;
    */
    const SHIFT = 4;
    const META = 8;
    const CONTROL = 16;
    const MOTION = 32;
    const BTN_4_7_INDICATOR = 64;
    const BTN_8_11_INDICATOR = 128;

    // CSI M CbCxCy
    // Cb =    0       0       0         0          0          0        00
    //      btn8-11  btn4-7  motion control_key  meta_key  shift_key  button
    //
    // CSI M @ CxCy
    // @  = 32 + 0 (button 1) + 32 (motion indicator).
    if (data[0] === 0x1b && data[1] === 0x5b && data[2] === 0x4d) {
      const Cb = data[3];
      let button = 3 & Cb;
      if (Cb & BTN_4_7_INDICATOR) {
        button += 4;
      } else if (Cb & BTN_8_11_INDICATOR) {
        button += 8;
      }

      const eventData: IMouseEvent = {
        button,
        x: data[4] as number,
        y: data[5] as number,
        shift: (Cb & SHIFT) != 0,
        meta: (Cb & META) != 0,
        control: (Cb & CONTROL) != 0,
        motion: (Cb & MOTION) === 0,
      };

      if (!eventData.motion) {
        if (eventData.button === 3) {
          this.emit("mouse_up", eventData);
        } else {
          if (eventData.button === 4) {
            this.emit("wheel_up", eventData);
          } else if (eventData.button === 5) {
            this.emit("wheel_down", eventData);
          } else {
            this.emit("mouse_down", eventData);
          }
        }
      } else {
        this.emit("mouse_move", eventData);
      }

      this.emit("mouse", eventData);
    }
  }

  dispose() {
    this.stdin.removeListener("data", this._listen);
  }
}
