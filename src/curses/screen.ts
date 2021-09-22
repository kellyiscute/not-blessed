import tty from "tty";
import { constants } from "./constants";

export function clear(stdout: tty.WriteStream) {
  stdout.write(constants.ESC + "[2J");
}

export function clearFromCur(stdout: tty.WriteStream) {
  stdout.write(constants.ESC + "[0J");
}

export function clearToBeginningOfScr(stdout: tty.WriteStream) {
  stdout.write(constants.ESC + "[1J");
}

export function clearLine(stdout: tty.WriteStream) {
  stdout.write(constants.ESC + "[K");
}

export function clearToBeginningOfLine(stdout: tty.WriteStream) {
  stdout.write(constants.ESC + "[0K")
}

