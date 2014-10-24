import FileWrapper = require('./FileWrapper');
import PyCodeObject = require('./PyCodeObject');
import PycFile = require('./PycFile');
import MarshalParser = require('./MarshalParser');
import PyObject = require('./PyObject');

export function parse(fw: FileWrapper): PycFile{
  var magicno: any = parseMagicNumber(fw);
  var modtime: Date = parseModTimeStamp(fw);
  var codeobj: PyCodeObject = <PyCodeObject> new MarshalParser().parse(fw);
  return new PycFile(magicno, modtime, codeobj);
}
function parseMagicNumber(fw: FileWrapper): any{
  var magicno: number = fw.getInt32();
  return magicno;
}
function parseModTimeStamp(fw: FileWrapper): Date{
  return new Date(1000*fw.getUInt32());
}
