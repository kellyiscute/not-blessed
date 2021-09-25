import EventEmitter from "events";
import { IPoint } from "../../typing/point";
import { ISize } from "../../typing/size";
import { RenderSpan } from "./render-span";

export class RenderPanel extends EventEmitter {
  // a 2D panel that will be rendered
  // onto the screen
  // every line is represented by a renderspan
  _panel: RenderSpan[];
  position?: IPoint;
  private _dirty = true;
  children?: RenderPanel[];
  size: ISize;

  set dirty(value: boolean) {
    if (value !== this._dirty) {
      this._dirty = value;
    }
    this.emit("dirty");
  }

  constructor(size: ISize) {
    super();
    this._panel = [];
    this.size = size;
  }

  setSize(size: ISize) {
    this.size = size;
    this.dirty = true;
  }

  setPosition(pos: IPoint) {
    this.position = pos;
    this.dirty = true;
  }

  write(line: number, span: RenderSpan) {
    this._panel[line] = span;
    this.dirty = true;
  }

  render(stillDirty?: boolean): RenderSpan[] {
    let panel = this._panel;
    if (this.children) {
      this.children.forEach((v) => {
        const rendered = v.render();
        const diffUntilLine =
          this.size.height > (v.position?.y ?? 0) + v.size.height
            ? this.size.height
            : (v.position?.y ?? 0) + v.size.height;
        let childLineIndex = 0;
        for (let i = v.position?.y ?? 0; i < diffUntilLine; i++) {
          panel[i] = panel[i].coveredBy(rendered[childLineIndex]);
          childLineIndex++;
        }
      });
    }
    if (!stillDirty) this.dirty = false;
    return panel;
  }
}
