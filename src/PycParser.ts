import FileWrapper = require('./FileWrapper');
import CodeObject = require('./CodeObject');
import PycFile = require('./PycFile');
import MarshalParser = require('./MarshalParser');

export function parse(fw: FileWrapper): PycFile{
  var magicno: any = parseMagicNumber(fw);
  var modtime: Date = parseModTimeStamp(fw);
  var codeobj: CodeObject = MarshalParser.parse(fw);
  return new PycFile(magicno, modtime, codeobj);
}
function parseMagicNumber(fw: FileWrapper): any{
  var magicno: number = fw.getInt32();
  return magicno;
}
function parseModTimeStamp(fw: FileWrapper): Date{
  return new Date(1000*fw.getUInt32());
}
