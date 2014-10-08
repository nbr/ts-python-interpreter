import FileWrapper = require('./FileWrapper');
import FileWrapperNode = require('./FileWrapperNode');
import CodeObject = require('./CodeObject');
import PycFile = require('./PycFile');
import PycParser = require('./PycParser');

function InterpretPyc(fs: any, path: string, cb: () => void){
  console.log('path = ' + path);
  var fw: FileWrapper = new FileWrapperNode(path, fs);
  fw.readFile(function afterReadFile(){
    var pyc: PycFile = PycParser.parse(fw);
    console.log(pyc.stringify());
    pyc.interpret();
    cb();
  });
}

export = InterpretPyc;
