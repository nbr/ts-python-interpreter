import gLong = require('../lib/gLong');
import PyObject = require('./PyObject');
import PyInt = require('./PyInt');
import enums = require('./enums');
import Exceptions = require('./Exceptions');

class PyInt64 extends PyObject{
  private n: gLong;
  constructor(n: gLong){
    super(enums.PyType.TYPE_INT64);
    this.n = n;
  }
  getInt64(): gLong{
    return this.n;
  }

  __str__(): string{
    return this.n.toString();
  }
  __add__(right: PyObject): PyInt64{
    var rightN: gLong;
    if(right.getType() === this.getType()){
      rightN = (<PyInt64> right).getInt64();
    }else{
      try{
        rightN = this.coercion(right);
      }catch(e){
        throw new Exceptions.Exception("TYPE_INT64 __add__ unsuported parameter type");
      }
    }
    var result: gLong = this.n.add(rightN);
    return new PyInt64(result);
  }
  __radd__(left: PyObject): PyInt64{
    try{
      var leftN: gLong = this.coercion(left);
    }catch(e){
      throw new Exceptions.Exception("TYPE_INT64 __radd__ unsuported parameter type");
    }
    var result: gLong = leftN.add(this.n);
    return new PyInt64(result);
  }
  private coercion(left: PyObject): gLong{
    var leftType: enums.PyType = left.getType();
    var leftN: number;
    switch(leftType){
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
    return gLong.fromInt(leftN);
  }
}

export = PyInt64;
