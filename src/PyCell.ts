import PyObject = require('./PyObject');
import enums = require('./enums');

class PyCell<T> extends PyObject{
  private o: T;
  constructor(o: T){
    super(enums.PyType.TYPE_CELL);
    this.o = o;
  }
  enclosed(): T{
    return this.o;
  }
}

export = PyCell;
