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
}

export = PyInt;
