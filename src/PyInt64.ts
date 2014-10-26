import gLong = require('../lib/gLong');
import PyObject = require('./PyObject');
import enums = require('./enums');

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
}

export = PyInt64;
