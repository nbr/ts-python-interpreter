/// <reference path="../lib/node.d.ts" />
import fs = require('fs');
//import buf = require('buffer');
import FileWrapper = require('./FileWrapper')

class FileWrapperNode implements FileWrapper{
  private buffer; //type? tried buf.Buffer and buf.NodeBuffer
  private offset: number;
  private path: string;

  constructor(path: string){
    this.offset = 0;
    this.path = path;
  }
  connect(cb){
    fs.readFile(this.path, this.getAfterRead(cb));
  }
  getInt32(): number{
    return this.readNum(this.buffer.readInt32LE, 4);
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
  private getAfterRead(cb){
    var fwn: FileWrapperNode = this;
    return function afterRead(err, buffer){
      if (err) { throw err;}
      fwn.buffer = buffer;
      cb();
    };
  }
}
interface ReadFunc{
  (offset: number, noAssert: boolean): number;
}

export = FileWrapperNode;
