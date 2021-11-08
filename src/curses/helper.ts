import { ITermTextStyle } from "../typings/render-style";

export function isEscape(buffer: Buffer): boolean {
  return buffer[0] === 0x1b;
}

export function isCSI(buffer: Buffer): boolean {
  return isEscape(buffer) && buffer[1] === 0x5b;
}

export function isSS3(buffer: Buffer): boolean {
  return isEscape(buffer) && buffer[1] === 0x4f;
}

export function generateColorEscape(color: string, type: "fg" | "bg"): string {
  const COLORS: { [c: string]: number } = {
    black: 0,
    red: 1,
    green: 2,
    yellow: 3,
    blue: 4,
    magenta: 5,
    cyan: 6,
    white: 7,
    default: 9,
  };

  return `\x1b[${type === "fg" ? 3 : 4}${COLORS[color]}m`;
}

export function generateTextStyleEscape(style: ITermTextStyle) {
  const STYLES = {
    normal: 0,
    bold: 1,
    faint: 2,
    italic: 3,
    underline: 4,
    blink: 5,
    inverse: 7,
    invisible: 8,
    crossedOut: 9,
  };
  return `\x1b[${STYLES[style]}m`;
}
