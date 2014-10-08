import FileWrapper = require('./FileWrapper');
import FileWrapperNode = require('./FileWrapperNode');
import CodeObject = require('./CodeObject');
import PycFile = require('./PycFile');
import PycParser = require('./PycParser');

function InterpretPyc(fs: any, path: string, cb: () => void){
  var fw: FileWrapper = new FileWrapperNode('./sample_pycs/sample.pyc', fs);
  fw.readFile(function afterReadFile(){
    var pyc: PycFile = PycParser.parse(fw);
    console.log(pyc.stringify());
    pyc.interpret();
    cb();
  });
}

export = InterpretPyc;
