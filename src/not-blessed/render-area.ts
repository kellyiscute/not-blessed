import { IPoint } from "../typing/point";
import { ISize } from "../typing/size";

export class RenderArea {
  // if size not set, expands
  // all render areas are rendered at
  // the top left corner of parent
  // unless specified
  size?: ISize;

  // render position relative to parent
  // top left corner if not set
  position?: IPoint;
  children?: RenderArea[];

  get hasSize() {
    return typeof this.size !== "undefined";
  }

  render(parentSize?: ISize) {}
}
