import { ISize } from "../../typings/size";
import { RenderPanel } from "../rendering/render-panel";

export abstract class Widget {
  abstract render(parentSize?: ISize): RenderPanel;
}
