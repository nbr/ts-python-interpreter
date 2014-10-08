import FileWrapper = require('./FileWrapper');

class FileWrapperNode implements FileWrapper{
  private buffer: any;
  private offset: number;
  private path: string;
  private fs: any; //could make an interface for fs requiring it to implement readFile(...)

  constructor(path: string, fs: any){
    this.offset = 0;
    this.path = path;
    this.fs = fs;
  }
  readFile(cb: () => void){
    this.fs.readFile(this.path, this.getAfterReadFile(cb));
  }
  getInt32(): number{
    return this.readNum(this.buffer.readInt32LE, 4);
  }
  getUInt32(): number{
    return this.readNum(this.buffer.readUInt32LE, 4);
  }
  getUInt8(): number{
    return this.readNum(this.buffer.readUInt8, 1);
  }
  getFloat(): number{
    return this.readNum(this.buffer.readFloatLE, 4);
  }
  getDouble(): number{
    return this.readNum(this.buffer.readDoubleLE, 8);
  }
  getUtf8(size: number): string{
    var s: string = this.buffer.toString('utf8', this.offset, this.offset + size);
    this.offset += size;
    return s;
  }
  private readNum(readFunc: ReadFunc, offsetIncrease: number): number{
    var n = readFunc.call(this.buffer, this.offset, true);
    this.offset += offsetIncrease;
    return n;
  }
  private getAfterReadFile(cb){
    var fwn: FileWrapperNode = this;
    return function afterReadFile(err, buffer){
      if (err) { throw err; }
      fwn.buffer = buffer;
      cb();
    };
  }
}
interface ReadFunc{
  (offset: number, noAssert: boolean): number;
}

export = FileWrapperNode;
