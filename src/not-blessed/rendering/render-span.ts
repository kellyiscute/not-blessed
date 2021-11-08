import { constants } from "../../curses/constants";
// @ts-ignore
import eaw from "east-asian-width";
import assert from "assert";
import { StyledRenderSpan } from "./styled-render-span";
import { IRenderStyle } from "../../typings/render-style";

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

  static styled(data: string, style: IRenderStyle) {
    return new StyledRenderSpan(data, style);
  }

  strip(offset: number, side: "left" | "right"): RenderSpan {
    if (this.isLeaf) {
      if (this.type === "styled") {
        let newData = "";
        const chars = this.text!.split("");
        let currentWidth = 0;
        if (side === "left") {
          for (const d of chars) {
            currentWidth += eaw.char_width(d);
            if (currentWidth <= offset) {
              newData += d;
            }
          }
        } else {
          for (let i = chars.length - 1; i > -1; i--) {
            const d = chars[i];
            currentWidth += eaw.char_width(d);
            if (currentWidth <= offset) {
              newData = d + newData;
            }
          }
        }
        return new StyledRenderSpan(newData, {
          ...(this as unknown as StyledRenderSpan).style,
        });
      } else {
        return new RenderSpan(this.type, this.width);
      }
    } else {
      assert(this.children);
      let currentWidth = 0;
      let index = side === "left" ? 0 : this.children.length - 1;
      // strip off all children that exceeds the offset
      while (currentWidth < offset) {
        currentWidth += this.children[index].width;
        index += side === "left" ? 1 : -1;
      }
      // keep the last one because we probably have to
      // cut it in half
      if (index > 0) {
        currentWidth -= this.children[index].width;
        index -= side === "left" ? 1 : -1;
      }
      const children = [];
      children.push(this.children[index].strip(offset - currentWidth, side));
      for (let i = index + 1; i < this.children.length; i++) {
        children.push(this.children[i]);
      }
      return new RenderSpan(this.type, children);
    }
  }

  /**
   * appliedOffset can be negative
   */
  coveredBy(span: RenderSpan, appliedOffset?: number): RenderSpan {
    if (span.type === "transparent") return this;
    if (typeof appliedOffset === "undefined") {
      appliedOffset = 0;
    }

    if (!this.isLeaf) {
      const children: RenderSpan[] = [];
      let totalWidthChecked = 0;
      assert(this.children, "Illegal RenderSpan");

      // TODO: test needed
      for (let i = 0; i < this.children.length; i++) {
        if (totalWidthChecked + this.children[i].width > appliedOffset) {
          totalWidthChecked += this.children[i].width;
          children.push(this.children[i]);
          continue;
        } else if (totalWidthChecked - appliedOffset >= span.width) {
          // the rest are safe
          break;
        } else {
          children.push(
            this.children[i].coveredBy(span, totalWidthChecked - appliedOffset)
          );
        }
      }
      return new RenderSpan("normal", children);
    } else {
      if (span.width >= this.width) {
        // if the covering is larger
        if (appliedOffset === 0) {
          // it is totally covered
          // so it this will disappear
          return span;
        } else if (appliedOffset > 0) {
          // the right part is covered
          return new RenderSpan("normal", [
            span,
            this.strip(Math.abs(appliedOffset), "right"),
          ]);
        } else {
          return new RenderSpan("normal", [
            this.strip(Math.abs(appliedOffset), "left"),
            span,
          ]);
        }
      } else {
        // the middle is covered
        // TODO: this part is possibly written wrong
        return new RenderSpan("normal", [
          this.strip(Math.abs(appliedOffset), "right"),
          span,
          this.strip(span.width + Math.abs(appliedOffset), "left"),
        ]);
      }
    }
  }
}
