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
  //this probably isn't the correct parsing,
  //but as long as correct number of bytes consumed,
  //I don't care right now
  return new Date(fw.getInt32());
}
