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
    var rightN: number;
    if(right.getType() === this.getType()){
      rightN = (<PyInt> right).getValue();
    }else{
      try{
        rightN = this.coercion(right);
      }catch(e){
        throw new Exceptions.Exception("TYPE_INT __add__ unsuported parameter type");
      }
    }
    var result: number = this.n + rightN;
    return new PyInt(result);
  }
  __radd__(left: PyObject): PyInt{
    try{
      var leftN: number = this.coercion(left);
    }catch(e){
      throw new Exceptions.Exception("TYPE_INT __radd__ unsuported parameter type");
    }
    var result: number = leftN + this.n;
    return new PyInt(result);
  }
  private coercion(left: PyObject): number{
    var leftType: enums.PyType = left.getType();
    switch(leftType){
      case enums.PyType.TYPE_TRUE:
        return 1;
      case enums.PyType.TYPE_FALSE:
        return 0;
      default:
        throw new Exceptions.Exception("unsuported parameter type");
    }
  }
}

export = PyInt;
