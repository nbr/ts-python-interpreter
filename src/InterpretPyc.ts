/// <reference path="../lib/node.d.ts" />
import FileWrapper = require('./FileWrapper');
import FileWrapperNode = require('./FileWrapperNode');
import PycFile = require('./PycFile');
import PycParser = require('./PycParser');
import PyInterpreterState = require('./PyInterpreterState');
import StdoutBrowser = require('./StdoutBrowser');


//Main?
function InterpretPyc(buffer: NodeBuffer, cb: () => void){
  var fw: FileWrapper = new FileWrapperNode(buffer);
  var pyc: PycFile = PycParser.parse(fw);
  console.log(pyc.stringify());
  return new PyInterpreterState(pyc.getCodeobj(), new StdoutBrowser());
  cb();
}

export = InterpretPyc;
