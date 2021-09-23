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

  // this is the actual width that
  // renders on screen, not including
  // control sequences.
  //
  // this can be used to represent a
  // white space with control sequence
  // instead of placing a lot of SP char
  width: number;
  text: string;
  children?: RenderSpan[];
  type: IRenderSpanType;

  constructor(type: IRenderSpanType, widthOrText?: number | string) {
    this.width =
      typeof widthOrText === "string"
        ? eaw.str_width(widthOrText)
        : widthOrText!;
    this.type = type;
    this.text = typeof widthOrText === "string" ? widthOrText : "";
  }

  static transparent(width: number) {
    return new RenderSpan("transparent", width);
  }

  static blankSpace(width: number) {
    return new RenderSpan("blankSpace", width);
  }
}
