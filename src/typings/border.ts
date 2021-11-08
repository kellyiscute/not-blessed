import { ITermColor } from "./render-style";

export interface IBorder {
  color?: ITermColor;
  type?: "single" | "double" | "bold" | "rounded" | "dashed" | "bold-dashed";
}
