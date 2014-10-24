import PyObject = require('./PyObject');
import enums = require('./enums');

class PyUnicode extends PyObject{
  private u: string;
  constructor(u: string){
    super(enums.PyType.TYPE_UNICODE);
    this.u = u;
  }
  getUnicode(): string{
    return this.u;
  }
  __str__(): string{
    return this.u;
  }
}

export = PyUnicode;
