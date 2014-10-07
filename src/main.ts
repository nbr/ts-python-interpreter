import FileWrapper = require('./FileWrapper');
import FileWrapperNode = require('./FileWrapperNode');
import CodeObject = require('./CodeObject');
import PycFile = require('./PycFile');
import PycParser = require('./PycParser');

var fw: FileWrapper = new FileWrapperNode('./sample_pycs/sample.pyc');
fw.connect(function afterConnect(){
  var pyc: PycFile = PycParser.parse(fw);
  console.log(pyc.stringify());
  pyc.interpret();
});
