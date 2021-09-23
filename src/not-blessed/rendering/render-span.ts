import { constants } from "../../curses/constants";
// @ts-ignore
import eaw from "east-asian-width";

export type IRenderSpanType =
  | "blankSpace"
  | "transparent"
  | "normal"
  | "styled";

export class RenderSpan {
  // the string that is actually
  // sent to the terminal for rendering
  // generate lazily
  get renderString() {
    switch (this.type) {
      case "normal":
        return this.text;
      case "transparent":
        return `${constants.ESC}[${this.width}C`;
      case "blankSpace":
        "".padStart(this.width);
      default:
        throw Error("invalid render span type");
    }
  }

  get isLeaf() {
    return typeof this.children === "undefined";
  }

  // this is the actual width that
  // renders on screen, not including
  // control sequences.
  //
  // this can be used to represent a
  // white space with control sequence
  // instead of placing a lot of SP char
  width: number;
  text?: string;
  children?: RenderSpan[];
  type: IRenderSpanType;

  /** the second argument can be
   *  width(for transparent or blankSpace)
   *  string(for leaf render span), or
   *  RenderSpan[]
   *
   *  similar to flutter's textspan
   */
  constructor(type: IRenderSpanType, data?: number | string | RenderSpan[]) {
    this.type = type;
    if (typeof data === "number") {
      this.width = data;
    } else if (typeof data === "string") {
      this.width = eaw.str_width(data);
      this.text = data;
    } else if (typeof data === "object") {
      this.children = data;
      this.width = this.children.map((v) => v.width).reduce((i, j) => i + j);
    } else {
      throw Error("invalid data type");
    }
  }

  static transparent(width: number) {
    return new RenderSpan("transparent", width);
  }

  static blankSpace(width: number) {
    return new RenderSpan("blankSpace", width);
  }
}
