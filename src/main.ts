import FileWrapper = require('./FileWrapper');
import FileWrapperNode = require('./FileWrapperNode');
import CodeObject = require('./CodeObject');
import PycFile = require('./PycFile');
import PycParser = require('./PycParser');

var fw: FileWrapper = new FileWrapperNode('/path/to/pyc/file');
fw.connect(function afterConnect(){
  var pyc: PycFile = PycParser.parse(fw);
  pyc.interpret();
});
