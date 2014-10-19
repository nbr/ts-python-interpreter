/// <reference path="../lib/node.d.ts" />
import fs = require('fs');
import FileWrapper = require('./FileWrapper');
import FileWrapperNode = require('./FileWrapperNode');
import CodeObject = require('./CodeObject');
import PycFile = require('./PycFile');
import PycParser = require('./PycParser');
import PyEval = require('./PyInterpreterState');

fs.readFile('./sample_pycs/helloworld.pyc', function afterRead(err, buffer: NodeBuffer){
  if(err) { throw err; }
  var fw: FileWrapper = new FileWrapperNode(buffer);
  var pyc: PycFile = PycParser.parse(fw);
  console.log(pyc.stringify());
  return new PyInterpreterState(pyc.codeobj.getValue());
});
