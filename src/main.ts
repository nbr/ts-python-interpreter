/// <reference path="../lib/node.d.ts" />
import fs = require('fs');
import FileWrapper = require('./FileWrapper');
import FileWrapperNode = require('./FileWrapperNode');
import PyCodeObject = require('./PyCodeObject');
import PycFile = require('./PycFile');
import PycParser = require('./PycParser');
import PyInterpreterState = require('./PyInterpreterState');
import StdoutConsole = require('./StdoutConsole');

fs.readFile('./sample_pycs/helloworld2.pyc', function afterRead(err, buffer: NodeBuffer){
  if(err) { throw err; }
  var fw: FileWrapper = new FileWrapperNode(buffer);
  var pyc: PycFile = PycParser.parse(fw);
  console.log(pyc.stringify());
  return new PyInterpreterState(pyc.getCodeobj(), new StdoutConsole());
});
