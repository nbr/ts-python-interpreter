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

class MarshalParser{
  private typeParserMap = {
    'O': function typeNull(){ return new PyObject(enums.PyType.TYPE_NULL); },
    'N': function typeNone(){ return new PyObject(enums.PyType.TYPE_NONE); },
    'F': function typeFalse(){ return new PyObject(enums.PyType.TYPE_FALSE); },
    'T': function typeTrue(){ return new PyObject(enums.PyType.TYPE_TRUE); },
    'S': function typeStopiter(){ return new PyObject(enums.PyType.TYPE_STOPITER); },
    '.': function typeEllipsis(){ return new PyObject(enums.PyType.TYPE_ELLIPSIS); },
    'i': this.typeInt,
    'I': this.typeInt64,
    'f': this.typeFloat,
    'g': this.typeBinaryFloat,
    'x': this.typeComplex,
    'y': this.typeBinaryComplex,
    'l': this.typeLong,
    's': this.typeString,
    't': this.typeInterned,
    'R': this.typeStringref,
    'u': this.typeUnicode,
    '(': this.typeTuple,
    '[': this.typeList,
    '{': this.typeDict,
    '>': this.typeFrozenset,
    'c': this.typeCodeObject
  };
  private fw: FileWrapper;
  private interned: PyString[];
  constructor(){
  }
  parse(fw: FileWrapper): PyObject{
    this.fw = fw;
    this.interned = new Array<PyString>();
    return this.parseNext();
  }
  parseNext(): PyObject{
    return this.typeParserMap[this.fw.getUtf8(1)].call(this);
  }
  typeInt(): PyInt{
    return new PyInt(this.fw.getInt32());
  }
  typeInt64(): PyInt64{
    //is this reading order of low/high correct
    //with respect to little endian?
    var high: number = this.fw.getInt32();
    var low: number = this.fw.getInt32();
    return new PyInt64(gLong.fromBits(low,high));
  }
  typeFloat(): PyFloat{
    var size: number = this.fw.getUInt8();
    //not sure if the character encoding here is UTF-8
    var s: string = this.fw.getUtf8(size);
    return new PyFloat(Number(s));
  }
  typeBinaryFloat(): PyBinaryFloat{
    return new PyBinaryFloat(this.fw.getDouble());
  }
  typeComplex(): PyObject{
    //we still need to find a library to represent complex #
    //see issue #12
    var real: number = this.typeFloat().getFloat();
    var imaginary: number = this.typeFloat().getFloat();
    throw 'typeComplex broke!';
    return undefined;
  }
  typeBinaryComplex(): PyObject{
    //we still need to find a library to represent complex #
    //see issue #12
    var real: number = this.typeBinaryFloat().getBinaryFloat();
    var imaginary: number = this.typeBinaryFloat().getBinaryFloat();
    throw 'typeBinaryComplex broke!';
    return undefined;
  }
  typeLong(): PyObject{
    //this may not be correct. The blog post is
    //unclear. marshal.c parses TYPE_LONG with
    //r_PyLong on line 568
    throw 'typeBinaryComplex broke!';
    return new PyLong(0);
  }
  typeString(): PyString{
    var size: number = this.fw.getInt32();
    return new PyString(this.fw.getSlice(size));
  }
  //interned info:
  //https://docs.python.org/3.0/library/sys.html
  //http://stackoverflow.com/questions/15541404/python-string-interning
  typeInterned(): PyString{
    //do we need to implement an intern list?
    /*
    var size: number = this.fw.getInt32();
    return new PyInterned(this.fw.getSlice(size));
    */
    var s: PyString = this.typeString();
    this.interned.push(s);
    return s;
  }
  //should this return a string that is a result of
  //the intern list lookup or just the number that
  //is the reference to the string in the interned
  //list?
  typeStringref(): PyString{
    //return new PyStringref(this.fw.getInt32());
    return this.interned[this.fw.getInt32()];
  }
  typeUnicode(): PyUnicode{
    var size: number = this.fw.getInt32();
    return new PyUnicode(this.fw.getUtf8(size));
  }
  typeTuple(): PyTuple<PyObject>{
    var count: number = this.fw.getInt32();
    return new PyTuple<PyObject>(this.getNextN(count));
  }
  typeList(): PyList<PyObject>{
    var count: number = this.fw.getInt32();
    return new PyList<PyObject>(this.getNextN(count));
  }
  typeDict(): PyDict<PyObject, PyObject>{
    var d: PyDict<PyObject, PyObject> = new PyDict<PyObject, PyObject>();
    var key: PyObject = this.parseNext();
    while(key.getType() !== enums.PyType.TYPE_NULL){
      var value: PyObject = this.parseNext();
      d.put(key, value);
      key = this.parseNext();
    }
    return d;
  }
  typeFrozenset(): PyFrozenset<PyObject>{
    var count: number = this.fw.getInt32();
    return new PyFrozenset<PyObject>(this.getNextN(count));
  }
  getNextN(n: number): PyObject[]{
    var a: any[] = new Array();
    for(var i: number = 0; i < n; i++){
      a[i] = this.parseNext();
    }
    return a;
  }
  typeCodeObject(): PyCodeObject{
    var argcount: number = this.fw.getInt32();
    var nlocals: number = this.fw.getInt32();
    var stacksize: number = this.fw.getInt32();
    var flags: number = this.fw.getInt32();
    var code: PyString = <PyString> this.parseNext();
    var consts: PyTuple<PyObject> = <PyTuple<PyObject>> this.parseNext();
    var names: PyTuple<PyObject> = <PyTuple<PyObject>> this.parseNext();
    var varnames: PyTuple<PyObject> = <PyTuple<PyObject>> this.parseNext();
    var freevars: PyTuple<PyObject> = <PyTuple<PyObject>> this.parseNext();
    var cellvars: PyTuple<PyObject> = <PyTuple<PyObject>> this.parseNext();
    var filename: PyString = <PyString> this.parseNext();
    var name: PyString = <PyString> this.parseNext();
    var firstlineno: number = this.fw.getInt32();
    var lnotab: PyString = <PyString> this.parseNext();
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
}

export = MarshalParser;
