import { IBorder } from "../../typings/border";
import { ISize } from "../../typings/size";
import { RenderPanel } from "../rendering/render-panel";
import { Widget } from "./widget";

export interface IContainerOptions {
  width?: number;
  height?: number;
  child?: Widget;
  border?: IBorder;
}

export class Container extends Widget {
  width?: number;
  height?: number;
  child?: Widget;
  border?: IBorder;

  constructor(options: IContainerOptions) {
    super();
    this.width = options.width;
    this.height = options.height;
    this.child = options.child;
    this.border = options.border;
  }

  hasSize(): boolean {
    return typeof this.width !== "undefined" && typeof this.height !== "undefined";
  }

  render(parentSize: ISize): RenderPanel {
    let childSize = parentSize;
    if (this.hasSize()) {
      childSize = {
        height: this.height!,
        width: this.width!,
      }
    }
    if (this.border) {
      childSize.height -= 2;
      childSize.width -= 2;
    }
    const child = this.child?.render(childSize);
    const result = new RenderPanel(this.hasSize() ? { height: this.height!, width: this.width! } : parentSize)
    

    return result;
  }
}
