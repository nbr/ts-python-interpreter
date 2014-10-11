import gLong = require('../lib/gLong');
import FileWrapper = require('./FileWrapper');
import Tuple = require('./Tuple');
import List = require('./List');
import Dict = require('./Dict');
import Frozenset = require('./Frozenset');
import CodeObject = require('./CodeObject');
import PyType = require('./PyType');
import PyObject = require('./PyObject');

var typeParserMap = {
  'O': function typeNull(fw: FileWrapper){ return new PyObject(PyType.TYPE_NULL, undefined); },
  'N': function typeNone(fw: FileWrapper){ return new PyObject(PyType.TYPE_NONE, undefined); },
  'F': function typeFalse(fw: FileWrapper){ return new PyObject(PyType.TYPE_FALSE, undefined); },
  'T': function typeTrue(fw: FileWrapper){ return new PyObject(PyType.TYPE_TRUE, undefined); },
  'S': function typeStopiter(fw: FileWrapper){ return new PyObject(PyType.TYPE_STOPITER, undefined); },
  '.': function typeEllipsis(fw: FileWrapper){ return new PyObject(PyType.TYPE_ELLIPSIS, undefined); },
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
  'u': typeUnicode,
  '(': typeTuple,
  '[': typeList,
  '{': typeDict,
  '>': typeFrozenset,
  'c': typeCodeObject
};
export function parse(fw: FileWrapper): PyObject{
  return typeParserMap[fw.getUtf8(1)](fw);
}
function typeInt(fw: FileWrapper): PyObject{
  return new PyObject(PyType.TYPE_INT, fw.getInt32());
}
function typeInt64(fw: FileWrapper): PyObject{
  //is this reading order of low/high correct
  //with respect to little endian?
  var high: number = fw.getInt32();
  var low: number = fw.getInt32();
  return new PyObject(PyType.TYPE_INT64, gLong.fromBits(low,high));
}
function typeFloat(fw: FileWrapper): PyObject{
  var size: number = fw.getUInt8();
  //not sure if the character encoding here is UTF-8
  var s: string = fw.getUtf8(size);
  return new PyObject(PyType.TYPE_FLOAT, Number(s));
}
function typeBinaryFloat(fw: FileWrapper): PyObject{
  return new PyObject(PyType.TYPE_BINARY_FLOAT, fw.getDouble());
}
function typeComplex(fw: FileWrapper): PyObject{
  //we still need to find a library to represent complex #
  //see issue #12
  var real: number = typeFloat(fw).getValue();
  var imaginary: number = typeFloat(fw).getValue();
  return undefined;
}
function typeBinaryComplex(fw: FileWrapper): PyObject{
  //we still need to find a library to represent complex #
  //see issue #12
  var real: number = typeBinaryFloat(fw).getValue();
  var imaginary: number = typeBinaryFloat(fw).getValue();
  return undefined;
}
function typeLong(fw: FileWrapper): PyObject{
  //this may not be correct. The blog post is
  //unclear. marshal.c parses TYPE_LONG with
  //r_PyLong on line 568
  return new PyObject(PyType.TYPE_LONG, typeInt64(fw));
}
function typeString(fw: FileWrapper): PyObject{
  var size: number = fw.getInt32();
  return new PyObject(PyType.TYPE_STRING, fw.getSlice(size));
}
//interned info:
//https://docs.python.org/3.0/library/sys.html
//http://stackoverflow.com/questions/15541404/python-string-interning
function typeInterned(fw: FileWrapper): PyObject{
  //do we need to implement an intern list?
  var size: number = fw.getInt32();
  return new PyObject(PyType.TYPE_INTERNED, fw.getSlice(size));
}
//should this return a string that is a result of
//the intern list lookup or just the number that
//is the reference to the string in the interned
//list?
function typeStringref(fw: FileWrapper): PyObject{
  return new PyObject(PyType.TYPE_STRINGREF, fw.getInt32());
}
function typeUnicode(fw: FileWrapper): PyObject{
  var size: number = fw.getInt32();
  return new PyObject(PyType.TYPE_UNICODE, fw.getUtf8(size));
}
function typeTuple(fw: FileWrapper): PyObject{
  var count: number = fw.getInt32();
  return new PyObject(PyType.TYPE_TUPLE, new Tuple<any>(getNextN(count, fw)));
}
function typeList(fw: FileWrapper): PyObject{
  var count: number = fw.getInt32();
  return new PyObject(PyType.TYPE_LIST, new List<any>(getNextN(count, fw)));
}
function typeDict(fw: FileWrapper): PyObject{
  var object = {};
  var key: PyObject = parse(fw);
  while(key.getType() !== PyType.TYPE_NULL){
    object[key.getValue()] = parse(fw);
    key = parse(fw);
  }
  return new PyObject(PyType.TYPE_DICT, new Dict(object));
}
function typeFrozenset(fw: FileWrapper): PyObject{
  var count: number = fw.getInt32();
  return new PyObject(PyType.TYPE_FROZENSET, new Frozenset<any>(getNextN(count, fw)));
}
function getNextN(n: number, fw: FileWrapper): PyObject[]{
  var a: any[] = new Array();
  for(var i: number = 0; i < n; i++){
    a[i] = parse(fw);
  }
  return a;
}
function typeCodeObject(fw: FileWrapper): PyObject{
  var argcount: number = fw.getInt32();
  var nlocals: number = fw.getInt32();
  var stacksize: number = fw.getInt32();
  var flags: number = fw.getInt32();
  var code: PyObject = parse(fw);
  var consts: PyObject = parse(fw);
  var names: PyObject = parse(fw);
  var varnames: PyObject = parse(fw);
  var freevars: PyObject = parse(fw);
  var cellvars: PyObject = parse(fw);
  var filename: PyObject= parse(fw);
  var name: PyObject= parse(fw);
  var firstlineno: number = fw.getInt32();
  var lnotab: PyObject= parse(fw);
  return new PyObject(PyType.TYPE_CODE, new CodeObject(argcount,
      nlocals,
      stacksize,
      flags,
      code,
      consts,
      names,
      varnames,
      freevars,
      cellvars,
      filename,
      name,
      firstlineno,
      lnotab));
}
