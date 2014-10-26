import PyObject = require('./PyObject');
import enums = require('./enums');

class PyInt extends PyObject{
  private n: number;
  constructor(n: number){
    super(enums.PyType.TYPE_INT);
    this.n = n;
  }
  __str__(): string{
    return this.n.toString();
  }

  getValue(): number{
    return this.n;
  }

  __cmp__(cmpidx: number, comparee: PyObject): boolean{
    var type = enums.PyType[this.getType()];
    var exp = enums.Cmp[cmpidx];
    if(type != enums.PyType[comparee.getType()]){ throw "type mismatch"; }
    var a = this.getValue();
    var b = comparee.getValue();
    if (exp == "PyCmp_LT") {
      return a < b;
    }
    else if (exp == "PyCmp_LE") {
      return a <= b;
    }
    else if (exp == "PyCmp_EQ" || exp == "PyCmp_IS") {
      return a == b;
    }
    else if (exp == "PyCmp_NE" || exp == "PyCmp_IS_NOT") {
      return a != b;
    }
    else if (exp == "PyCmp_GT") {
      return a > b;
    }
    else if (exp == "PyCmp_GE") {
      return a >= b;
    }
    else {
      throw "undefined comparison for type";
    }
  }

}

export = PyInt;
