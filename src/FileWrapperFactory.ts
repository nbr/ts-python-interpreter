/// <reference path="../lib/node.d.ts" />
import FileWrapper = require('./FileWrapper');
import FileWrapperNode = require('./FileWrapperNode');

export function fromString(s: string): FileWrapper{
  var b: NodeBuffer = new Buffer(s,'utf-8');
  return new FileWrapperNode(b);
}
