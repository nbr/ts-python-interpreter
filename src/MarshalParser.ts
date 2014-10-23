import gLong = require('../lib/gLong');
import FileWrapper = require('./FileWrapper');
import PyTuple = require('./PyTuple');
import PyList = require('./PyList');
import PyDict = require('./PyDict');
import PyFrozenset = require('./PyFrozenset');
import PyCodeObject = require('./PyCodeObject');
import PyObject = require('./PyObject');
import enums = require('./enums');
import PyInt = require('./PyInt');
import PyInt64 = require('./PyInt64');
import PyFloat = require('./PyFloat');
import PyBinaryFloat = require('./PyBinaryFloat');
import PyLong = require('./PyLong');
import PyString = require('./PyString');
import PyInterned = require('./PyInterned');
import PyStringref = require('./PyStringref');
import PyUnicode= require('./PyUnicode');

var typeParserMap = {
  'O': function typeNull(fw: FileWrapper){ return new PyObject(enums.PyType.TYPE_NULL); },
  'N': function typeNone(fw: FileWrapper){ return new PyObject(enums.PyType.TYPE_NONE); },
  'F': function typeFalse(fw: FileWrapper){ return new PyObject(enums.PyType.TYPE_FALSE); },
  'T': function typeTrue(fw: FileWrapper){ return new PyObject(enums.PyType.TYPE_TRUE); },
  'S': function typeStopiter(fw: FileWrapper){ return new PyObject(enums.PyType.TYPE_STOPITER); },
  '.': function typeEllipsis(fw: FileWrapper){ return new PyObject(enums.PyType.TYPE_ELLIPSIS); },
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
function typeInt(fw: FileWrapper): PyInt{
  return new PyInt(fw.getInt32());
}
function typeInt64(fw: FileWrapper): PyInt64{
  //is this reading order of low/high correct
  //with respect to little endian?
  var high: number = fw.getInt32();
  var low: number = fw.getInt32();
  return new PyInt64(gLong.fromBits(low,high));
}
function typeFloat(fw: FileWrapper): PyFloat{
  var size: number = fw.getUInt8();
  //not sure if the character encoding here is UTF-8
  var s: string = fw.getUtf8(size);
  return new PyFloat(Number(s));
}
function typeBinaryFloat(fw: FileWrapper): PyBinaryFloat{
  return new PyBinaryFloat(fw.getDouble());
}
function typeComplex(fw: FileWrapper): PyObject{
  //we still need to find a library to represent complex #
  //see issue #12
  var real: number = typeFloat(fw).getFloat();
  var imaginary: number = typeFloat(fw).getFloat();
  throw 'typeComplex broke!';
  return undefined;
}
function typeBinaryComplex(fw: FileWrapper): PyObject{
  //we still need to find a library to represent complex #
  //see issue #12
  var real: number = typeBinaryFloat(fw).getBinaryFloat();
  var imaginary: number = typeBinaryFloat(fw).getBinaryFloat();
  throw 'typeBinaryComplex broke!';
  return undefined;
}
function typeLong(fw: FileWrapper): PyObject{
  //this may not be correct. The blog post is
  //unclear. marshal.c parses TYPE_LONG with
  //r_PyLong on line 568
  throw 'typeBinaryComplex broke!';
  return new PyLong(0);
}
function typeString(fw: FileWrapper): PyString{
  var size: number = fw.getInt32();
  return new PyString(fw.getSlice(size));
}
//interned info:
//https://docs.python.org/3.0/library/sys.html
//http://stackoverflow.com/questions/15541404/python-string-interning
function typeInterned(fw: FileWrapper): PyInterned{
  //do we need to implement an intern list?
  var size: number = fw.getInt32();
  return new PyInterned(fw.getSlice(size));
}
//should this return a string that is a result of
//the intern list lookup or just the number that
//is the reference to the string in the interned
//list?
function typeStringref(fw: FileWrapper): PyStringref{
  return new PyStringref(fw.getInt32());
}
function typeUnicode(fw: FileWrapper): PyUnicode{
  var size: number = fw.getInt32();
  return new PyUnicode(fw.getUtf8(size));
}
function typeTuple(fw: FileWrapper): PyTuple<PyObject>{
  var count: number = fw.getInt32();
  return new PyTuple<PyObject>(getNextN(count, fw));
}
function typeList(fw: FileWrapper): PyList<PyObject>{
  var count: number = fw.getInt32();
  return new PyList<PyObject>(getNextN(count, fw));
}
function typeDict(fw: FileWrapper): PyDict{
  var keys: PyObject[] = [];
  var values: PyObject[] = [];
  var key: PyObject = parse(fw);
  while(key.getType() !== enums.PyType.TYPE_NULL){
    keys.push(key);
    values.push(parse(fw));
    key = parse(fw);
  }
  return new PyDict(keys, values);
}
function typeFrozenset(fw: FileWrapper): PyFrozenset<PyObject>{
  var count: number = fw.getInt32();
  return new PyFrozenset<PyObject>(getNextN(count, fw));
}
function getNextN(n: number, fw: FileWrapper): PyObject[]{
  var a: any[] = new Array();
  for(var i: number = 0; i < n; i++){
    a[i] = parse(fw);
  }
  return a;
}
function typeCodeObject(fw: FileWrapper): PyCodeObject{
  var argcount: number = fw.getInt32();
  var nlocals: number = fw.getInt32();
  var stacksize: number = fw.getInt32();
  var flags: number = fw.getInt32();
  var code: PyString = <PyString> parse(fw);
  var consts: PyTuple<PyObject> = <PyTuple<PyObject>> parse(fw);
  var names: PyTuple<PyObject> = <PyTuple<PyObject>> parse(fw);
  var varnames: PyTuple<PyObject> = <PyTuple<PyObject>> parse(fw);
  var freevars: PyTuple<PyObject> = <PyTuple<PyObject>> parse(fw);
  var cellvars: PyTuple<PyObject> = <PyTuple<PyObject>> parse(fw);
  var filename: PyString = <PyString> parse(fw);
  var name: PyString = <PyString> parse(fw);
  var firstlineno: number = fw.getInt32();
  var lnotab: PyString = <PyString> parse(fw);
  return new PyCodeObject(argcount,
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
      lnotab);
}
