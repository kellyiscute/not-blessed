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
    return "";
  }

  // this is the actual width that
  // renders on screen, not including
  // control sequences.
  //
  // this can be used to represent a
  // white space with control sequence
  // instead of placing a lot of SP char
  width: number;
  type: IRenderSpanType;

  constructor(width: number, type: IRenderSpanType) {
    this.width = width;
    this.type = type;
  }

  static transparent(width: number) {
    return new RenderSpan(width, "transparent");
  }

  static blankSpace(width: number) {
    return new RenderSpan(width, "blankSpace");
  }
}
