import tty from "tty";
import { constants } from "./constants";

export function clear(stdin: tty.ReadStream) {
  stdin.write(constants.ESC + "[2J");
}

export function clearFromCur(stdin: tty.ReadStream) {
  stdin.write(constants.ESC + "[0J");
}

export function clearToBeginningOfScr(stdin: tty.ReadStream) {
  stdin.write(constants.ESC + "[1J");
}

export function clearLine(stdin: tty.ReadStream) {
  stdin.write(constants.ESC + "[K");
}

export function clearToBeginningOfLine(stdin: tty.ReadStream) {
  stdin.write(constants.ESC + "[0K")
}

