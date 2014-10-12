interface FileWrapper{
  getInt32(): number;
  getUInt32(): number;
  getUInt8(): number;
  getUInt16(): number;
  getFloat(): number;
  getDouble(): number;
  getUtf8(size: number): string;
  getSlice(size: number): FileWrapper;
  getBufLength(): number;
  getOffset(): number;
  seek(offset: number);
}
export = FileWrapper;
