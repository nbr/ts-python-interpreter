import PyObject = require('./PyObject');
import enums = require('./enums');

class PyStringref extends PyObject{
  private ref: number;
  constructor(ref: number){
    super(enums.PyType.TYPE_STRINGREF);
    this.ref = ref;
  }
  getRef(): number{
    return this.ref;
  }
}

export = PyStringref;
