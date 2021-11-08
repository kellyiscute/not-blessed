import { IPoint } from "../../typings/point"

export interface IRect {
  topLeft: IPoint;
  topRight: IPoint;
  bottomLeft: IPoint;
  bottomRight: IPoint;
  width: number;
  height: number;
}

export class Rect implements IRect {
  topLeft: IPoint;
  topRight: IPoint;
  bottomLeft: IPoint;
  bottomRight: IPoint;
  width: number;
  height: number;

  constructor({ topLeft, topRight, bottomRight, bottomLeft, width, height }: IRect) {
    this.topRight = topRight;
    this.topLeft = topLeft;
    this.bottomRight = bottomRight;
    this.bottomLeft = bottomLeft;
    this.width = width;
    this.height = height;
  }

  static fromPoints({ topLeft, bottomRight }: { topLeft: IPoint; bottomRight: IPoint }): Rect {
    return new Rect({
      topLeft: { ...topLeft },
      bottomRight: { ...bottomRight },
      topRight: { x: bottomRight.x, y: topLeft.y },
      bottomLeft: { x: topLeft.x, y: bottomRight.y },
      width: bottomRight.x - topLeft.x,
      height: bottomRight.y - topLeft.y,
    });
  }

  static fromTLWH({ topLeft, width, height }: { topLeft: IPoint; width: number; height: number }) {
    return new Rect({
      width,
      height,
      topLeft: { ...topLeft },
      topRight: { x: topLeft.x + width, y: topLeft.y },
      bottomLeft: { x: topLeft.x, y: topLeft.y + height },
      bottomRight: { x: topLeft.x + width, y: topLeft.y + height },
    });
  }
}
