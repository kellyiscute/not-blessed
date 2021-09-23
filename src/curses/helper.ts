export function isEscape(buffer: Buffer): boolean {
  return buffer[0] === 0x1b;
}

export function isCSI(buffer: Buffer): boolean {
  return isEscape(buffer) && buffer[1] === 0x5b;
}

export function isSS3(buffer: Buffer): boolean {
  return isEscape(buffer) && buffer[1] === 0x4f;
}
