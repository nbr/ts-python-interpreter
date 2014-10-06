interface FileWrapper{
  getInt32(): number;
  getUInt8(): number;
  getFloat(): number;
  getDouble(): number;
  getUtf8(size: number): string;
  connect(cb: () => void);
}
export = FileWrapper;
