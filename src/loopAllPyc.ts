/// <reference path="../lib/node.d.ts" />
/// <reference path="../lib/async.d.ts" />
import fs = require('fs');
import async = require('async');
import FileWrapper = require('./FileWrapper');
import FileWrapperNode = require('./FileWrapperNode');
import PyCodeObject = require('./PyCodeObject');
import PycFile = require('./PycFile');
import PycParser = require('./PycParser');
import PyInterpreterState = require('./PyInterpreterState');
import StdoutConsole = require('./StdoutConsole');

var sampleDir: string = './sample_pycs';
fs.readdir(sampleDir, function afterReadDir(err: Error, files: string[]){
  if(err){ throw err; }
  async.filter(files, interpret, function displayResults(failedFiles: string[]){
    if(failedFiles.length === 0){
      console.log('All files interpreted');
      return;
    }
    failedFiles.forEach(function(fail, index, failedFiles){
      console.log('Interpreter failed on ' + fail);
    });
  });
});

function interpret(fileName: string, cb): boolean{
  var hasFailed: boolean = false;
  if(fileName.slice(-4) !== '.pyc'){
    return cb(hasFailed);
  }
  fs.readFile(sampleDir + '/' + fileName, function afterRead(err: Error, buffer: NodeBuffer){
    if(err) { throw err; }
    console.log('Interpreting ' + fileName);
    var fw: FileWrapper = new FileWrapperNode(buffer);
    var pyc: PycFile = PycParser.parse(fw);
    //console.log(pyc.stringify());
    try{
      new PyInterpreterState(pyc.getCodeobj(), new StdoutConsole());
    }catch(e){
      hasFailed = true;
    }
    return cb(hasFailed);
  });
}
