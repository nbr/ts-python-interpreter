import PyObject = require('./PyObject');
import enums = require('./enums');

class PyBinaryFloat extends PyObject{
  private n: number;
  constructor(n: number){
    super(enums.PyType.TYPE_BINARY_FLOAT);
    this.n = n;
  }
  getBinaryFloat(): number{
    return this.n;
  }
}

export = PyBinaryFloat;
