/// <reference path="../lib/node.d.ts" />
import FileWrapper = require('./FileWrapper');

class FileWrapperNode implements FileWrapper{
  private buffer: NodeBuffer;
  private offset: number;

  constructor(buffer: NodeBuffer){
    this.buffer = buffer;
    this.offset = 0;
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
  getUInt16(): number{
    return this.readNum(this.buffer.readUInt16LE, 2);
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
  getSlice(size: number): FileWrapper{
    var fw: FileWrapper = new FileWrapperNode(this.buffer.slice(this.offset, this.offset + size));
    this.offset += size;
    return fw;
  }
  getBufLength(): number{
    return this.buffer.length;
  }
  getOffset(): number{
    return this.offset;
  }
  seek(offset: number){
    if(offset < 0 || offset > this.buffer.length - 1){
      throw 'invalid offset';
      return;
    }
    this.offset = offset;
  }
  private readNum(readFunc: ReadFunc, offsetIncrease: number): number{
    var n = readFunc.call(this.buffer, this.offset, true);
    this.offset += offsetIncrease;
    return n;
  }
}
interface ReadFunc{
  (offset: number, noAssert: boolean): number;
}

export = FileWrapperNode;
