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
    var rightType: enums.PyType = right.getType();
    var rightN: gLong;
    switch (rightType) {
      case enums.PyType.TYPE_INT64:
        rightN = (<PyInt64> right).getValue();
        break;
      case enums.PyType.TYPE_INT:
        rightN = gLong.fromInt((<PyInt> right).getValue());
        break;
      case enums.PyType.TYPE_TRUE:
        rightN = gLong.fromInt(1);
        break;
      case enums.PyType.TYPE_FALSE:
        rightN = gLong.fromInt(0);
        break;
      default:
        throw new Exceptions.Exception("__add__ param not TYPE_INT");
    }
    var result: gLong = this.n.add(rightN);
    return new PyInt64(result);
  }
  __radd__(left: PyObject): PyInt64{
    var leftType: enums.PyType = left.getType();
    var leftN: gLong;
    switch (leftType) {
      case enums.PyType.TYPE_INT:
        leftN = gLong.fromInt((<PyInt> left).getValue());
        break;
      case enums.PyType.TYPE_TRUE:
        leftN = gLong.fromInt(1);
        break;
      case enums.PyType.TYPE_FALSE:
        leftN = gLong.fromInt(0);
        break;
      default:
        throw new Exceptions.Exception("__radd__ param not TYPE_INT");
    }
    var result: gLong = leftN.add(this.n);
    return new PyInt64(result);
  }
}

export = PyInt64;
