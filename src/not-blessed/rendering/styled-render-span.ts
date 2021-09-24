import { IRenderStyle } from "../../typing/render-style";
import { RenderSpan } from "./render-span";
// @ts-ignore
import eaw from "east-asian-width";
import {
  generateColorEscape,
  generateTextStyleEscape,
} from "../../curses/helper";

export class StyledRenderSpan extends RenderSpan {
  style: IRenderStyle;
  text: string;

  constructor(text: string, style: IRenderStyle) {
    super("styled", eaw.str_width(text));
    this.text = text;
    this.style = style;
  }

  getEscapeSeqs(): [string, string] {
    let result = "";
    let ending = "";
    if (this.style.bg) {
      result += generateColorEscape(this.style.bg, "bg");
      ending += generateColorEscape("default", "bg");
    }
    if (this.style.fg) {
      result += generateColorEscape(this.style.fg, "fg");
      ending += generateColorEscape("default", "fg");
    }
    if (this.style.style) {
      if (typeof this.style.style === "string") {
        result += generateTextStyleEscape(this.style.style);
      } else {
        this.style.style.forEach((s) => {
          result += generateTextStyleEscape(s);
        });
      }
    }

    return [result, ending];
  }

  get renderString() {
    if (this.children) {
      return this.getEscapeSeqs().join(
        this.children.map((s) => s.renderString).join("")
      );
    } else {
      return this.getEscapeSeqs().join(this.text);
    }
  }
}
