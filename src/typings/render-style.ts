export type ITermColor =
  | "black"
  | "red"
  | "green"
  | "green"
  | "yellow"
  | "blue"
  | "magenta"
  | "cyan"
  | "white";

export type ITermTextStyle =
  | "normal"
  | "bold"
  | "faint"
  | "italic"
  | "underline"
  | "blink"
  | "inverse"
  | "crossedOut";

export interface IRenderStyle {
  fg?: ITermColor;
  bg?: ITermColor;
  style?: ITermTextStyle | ITermTextStyle[];
}
