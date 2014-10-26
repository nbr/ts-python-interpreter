import PyObject = require('./PyObject');
import FileWrapper = require('./FileWrapper');
import enums = require('./enums');

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
    var type = enums.PyType[this.getType()];
    var exp = enums.Cmp[cmpidx];
    if(type != enums.PyType[comparee.getType()]){ throw "type mismatch"; }
    var a = this.getValue();
    var b = this.getValue();
    if (exp == "PyCmp_EQ" || exp == "PyCmp_IS") {
      return a == b;
    }
    else if (exp == "PyCmp_NE" || exp == "PyCmp_IS_NOT") {
      return a != b;
    }
    else {
      throw "undefined comparison for type";
    }
  }

}

export = PyString;
