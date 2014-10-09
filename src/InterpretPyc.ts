/// <reference path="../lib/node.d.ts" />
import FileWrapper = require('./FileWrapper');
import FileWrapperNode = require('./FileWrapperNode');
import CodeObject = require('./CodeObject');
import PycFile = require('./PycFile');
import PycParser = require('./PycParser');

function InterpretPyc(buffer: NodeBuffer, cb: () => void){
  var fw: FileWrapper = new FileWrapperNode(buffer);
  var pyc: PycFile = PycParser.parse(fw);
  console.log(pyc.stringify());
  pyc.interpret();
  cb();
}

export = InterpretPyc;
