import PyObject = require('./PyObject');
import enums = require('./enums');

class PyFloat extends PyObject{
  private n: number;
  constructor(n: number){
    super(enums.PyType.TYPE_FLOAT);
    this.n = n;
  }
  getFloat(): number{
    return this.n;
  }
}

export = PyFloat;
