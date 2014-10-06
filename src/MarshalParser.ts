import gLong = require('../lib/gLong');
import FileWrapper = require('FileWrapper');
import Tuple = require('Tuple');
import List = require('List');

enum Constants {
  Null,
  None,
  False,
  True,
  Stopiter,
  Ellipsis
}
var typeParserMap = {
  'O': function typeNull(fw: FileWrapper){ return Constants.Null; },
  'N': function typeNone(fw: FileWrapper){ return Constants.None; },
  'F': function typeFalse(fw: FileWrapper){ return Constants.False; },
  'T': function typeTrue(fw: FileWrapper){ return Constants.True; },
  'S': function typeStopiter(fw: FileWrapper){ return Constants.Stopiter; },
  '.': function typeEllipsis(fw: FileWrapper){ return Constants.Ellipsis; },
  'i': typeInt,
  'I': typeInt64,
  'f': typeFloat,
  'g': typeBinaryFloat,
  'x': typeComplex,
  'y': typeBinaryComplex,
  'l': typeLong,
  's': typeString,
  't': typeInterned,
  'R': typeStringref,
  'u': typeUnicode
};
export function parse(fw: FileWrapper): any{
  return typeParserMap[fw.getUInt8()](fw);
}
function typeInt(fw: FileWrapper): number{
  return fw.getInt32();
}
function typeInt64(fw: FileWrapper): gLong {
  //is this reading order of low/high correct
  //with respect to little endian?
  var high: number = fw.getInt32();
  var low: number = fw.getInt32();
  return gLong.fromBits(low,high);
}
function typeFloat(fw: FileWrapper): number{
  var size: number = fw.getUInt8();
  //not sure if the character encoding here is UTF-8
  var s: string = fw.getUtf8(size);
  return Number(s);
}
function typeBinaryFloat(fw: FileWrapper): number{
  return fw.getDouble();
}
function typeComplex(fw: FileWrapper): any{
  //we still need to find a library to represent complex #
  //see issue #12
  var real: number = typeFloat(fw);
  var imaginary: number = typeFloat(fw);
  return undefined;
}
function typeBinaryComplex(fw: FileWrapper): any{
  //we still need to find a library to represent complex #
  //see issue #12
  var real: number = typeBinaryFloat(fw);
  var imaginary: number = typeBinaryFloat(fw);
  return undefined;
}
function typeLong(fw: FileWrapper): gLong{
  //this may not be correct. The blog post is
  //unclear. marshal.c parses TYPE_LONG with
  //r_PyLong on line 568
  return typeInt64(fw);
}
function typeString(fw: FileWrapper): string{
  var size: number = fw.getInt32();
  //is this character set right?
  return fw.getUtf8(size);
}
//interned info:
//https://docs.python.org/3.0/library/sys.html
//http://stackoverflow.com/questions/15541404/python-string-interning
function typeInterned(fw: FileWrapper): string{
  //do we need to implement an intern list?
  return typeString(fw);
}
//should this return a string that is a result of
//the intern list lookup or just the number that
//is the reference to the string in the interned
//list?
function typeStringref(fw: FileWrapper): number{
  return fw.getInt32();
}
function typeUnicode(fw: FileWrapper): string{
  var size: number = fw.getInt32();
  return fw.getUtf8(size);
}
function typeTuple(fw: FileWrapper): Tuple<any>{
  var count: number = fw.getInt32();
  return new Tuple<any>(getNextN(count, fw));
}
function typeList(fw: FileWrapper): List<any>{
  var count: number = fw.getInt32();
  return new List<any>(getNextN(count, fw));
}
function getNextN(n: number, fw: FileWrapper): any[]{
  var a: any[] = new Array();
  for(var i: number = 0; i < n; i++){
    a[i] = parse(fw);
  }
  return a;
}
//function codeobj(fw: FileWrapper): CodeObject{
//  can be recursive
//}
