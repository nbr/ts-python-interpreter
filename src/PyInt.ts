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
    var type: string = enums.PyType[this.getType()];
    if(type !== enums.PyType[comparee.getType()]){ throw "type mismatch"; }
    var a = this.getValue();
    var b = comparee.getValue();
    if (cmpidx === enums.Cmp.PyCmp_LT) {
      return a < b;
    }
    else if (cmpidx === enums.Cmp.PyCmp_LE) {
      return a <= b;
    }
    else if (cmpidx === enums.Cmp.PyCmp_EQ || cmpidx === enums.Cmp.PyCmp_IS) {
      return a === b;
    }
    else if (cmpidx === enums.Cmp.PyCmp_NE || cmpidx === enums.Cmp.PyCmp_IS_NOT) {
      return a !== b;
    }
    else if (cmpidx === enums.Cmp.PyCmp_GT) {
      return a > b;
    }
    else if (cmpidx === enums.Cmp.PyCmp_GE) {
      return a >= b;
    }
    else {
      throw "undefined comparison for type";
    }
  }

}

export = PyInt;
