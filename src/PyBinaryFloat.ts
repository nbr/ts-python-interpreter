import PyObject = require('./PyObject');
import PyInt = require('./PyInt');
import PyInt64 = require('./PyInt64');
import enums = require('./enums');
import Exceptions = require('./Exceptions');

class PyBinaryFloat extends PyObject{
  private n: number;
  constructor(n: number){
    super(enums.PyType.TYPE_BINARY_FLOAT);
    this.n = n;
  }
  getBinaryFloat(): number{
    return this.n;
  }
  __str__(): string{
    var s: string = this.n.toString();
    if(Math.round(this.n) === this.n){
      s += '.0';
    }
    return s;
  }
  __add__(right: PyObject): PyBinaryFloat{
    var rightN: number;
    if(right.getType() === this.getType()){
      rightN = (<PyBinaryFloat> right).getBinaryFloat();
    }else{
      try{
        rightN = this.coercion(right);
      }catch(e){
        throw new Exceptions.Exception("TYPE_BINARY_FLOAT __add__ unsuported parameter type");
      }
    }
    var result: number = this.n + rightN;
    return new PyBinaryFloat(result);
  }
  __radd__(left: PyObject): PyBinaryFloat{
    try{
      var leftN: number = this.coercion(left);
    }catch(e){
      throw new Exceptions.Exception("TYPE_BINARY_FLOAT __radd__ unsuported parameter type");
    }
    var result: number = leftN + this.n;
    return new PyBinaryFloat(result);
  }
  private coercion(left: PyObject): number{
    var leftType: enums.PyType = left.getType();
    var leftN: number;
    switch(leftType){
      case enums.PyType.TYPE_INT64:
        leftN = (<PyInt64> left).getInt64().toNumber();
        break;
      case enums.PyType.TYPE_INT:
        leftN = (<PyInt> left).getValue();
        break;
      case enums.PyType.TYPE_TRUE:
        leftN = 1;
        break;
      case enums.PyType.TYPE_FALSE:
        leftN = 0;
        break;
      default:
        throw new Exceptions.Exception("unsuported parameter type");
    }
    return leftN;
  }
}

export = PyBinaryFloat;
