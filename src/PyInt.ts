import PyObject = require('./PyObject');
import enums = require('./enums');
import Exceptions = require('./Exceptions');

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
  __add__(right: PyObject): PyInt{
    var rightType: enums.PyType = right.getType();
    var rightN: number;
    switch (rightType) {
      case enums.PyType.TYPE_INT:
        rightN = (<PyInt> right).getValue();
        break;
      case enums.PyType.TYPE_TRUE:
        rightN = 1;
        break;
      case enums.PyType.TYPE_FALSE:
        rightN = 0;
        break;
      default:
        throw new Exceptions.Exception("__add__ param not TYPE_INT");
    }
    var result: number = this.n + rightN;
    return new PyInt(result);
  }
  __radd__(left: PyObject): PyInt{
    var leftType: enums.PyType = left.getType();
    var leftN: number;
    switch (leftType) {
      case enums.PyType.TYPE_TRUE:
        leftN = 1;
        break;
      case enums.PyType.TYPE_FALSE:
        leftN = 0;
        break;
      default:
        throw new Exceptions.Exception("__radd__ param not TYPE_INT");
    }
    var result: number = this.n + leftN;
    return new PyInt(result);
  }
}

export = PyInt;
