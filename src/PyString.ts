import PyObject = require('./PyObject');
import PyUnicode = require('./PyUnicode');
import FileWrapper = require('./FileWrapper');
import FileWrapperFactory = require('./FileWrapperFactory');
import enums = require('./enums');
import Exceptions = require('./Exceptions');

class PyString extends PyObject{
  private fw: FileWrapper;
  constructor(fw: FileWrapper){
    super(enums.PyType.TYPE_STRING);
    this.fw = fw;
  }
  getFileWrapper(): FileWrapper{
    return this.fw;
  }
  __str__(): string{
    this.fw.seek(0);
    var s: string = this.fw.getUtf8(this.fw.getBufLength());
    this.fw.seek(0);
    return s;
  }

  getValue(): string{
    return this.__str__();
  }

  __cmp__(cmpidx: number, comparee: PyObject): boolean{
    var type: string = enums.PyType[this.getType()];
    if(type !== enums.PyType[comparee.getType()]){ throw "type mismatch"; }
    var a = this.getValue();
    var b = comparee.getValue();
    if (cmpidx === enums.Cmp.PyCmp_EQ || cmpidx === enums.Cmp.PyCmp_IS) {
      return a === b;
    }
    else if (cmpidx === enums.Cmp.PyCmp_NE || cmpidx === enums.Cmp.PyCmp_IS_NOT) {
      return a !== b;
    }
    else {
      throw "undefined comparison for type";
    }
  }
  __add__(right: PyObject): PyString{
    var rightS: string;
    if(right.getType() === this.getType()){
      rightS = (<PyString> right).__str__();
    }else{
      try{
        rightS = this.coercion(right);
      }catch(e){
        throw new Exceptions.Exception("TYPE_STRING __add__ unsuported parameter type");
      }
    }
    var result: string = this.__str__() + rightS;
    return new PyString(FileWrapperFactory.fromString(result));
    throw new Exceptions.Exception("TYPE_STRING __add__ unsuported parameter type");
  }
  __radd__(left: PyObject): PyString{
    try{
      var leftS: string = this.coercion(left);
    }catch(e){
      throw new Exceptions.Exception("TYPE_STRING __radd__ unsuported parameter type");
    }
    var result: string = leftS + this.__str__();
    return new PyString(FileWrapperFactory.fromString(result));
  }
  private coercion(left: PyObject): string{
    var leftType: enums.PyType = left.getType();
    switch(leftType){
      case enums.PyType.TYPE_UNICODE:
        return (<PyUnicode> left).getUnicode();
      default:
        throw new Exceptions.Exception("unsuported parameter type");
    }
  }
}

export = PyString;
