/// <reference path="../lib/node.d.ts" />
import fs = require('fs');
import FileWrapper = require('./FileWrapper');
import FileWrapperNode = require('./FileWrapperNode');
import CodeObject = require('./CodeObject');
import PycFile = require('./PycFile');
import PycParser = require('./PycParser');

var fw: FileWrapper = new FileWrapp erNode('./sample_pycs/sample.pyc', fs);
fw.readFile(function afterReadFile(){
  var pyc: PycFile = PycParser.parse(fw);
  console.log(pyc.stringify());
  pyc.interpret();
});
