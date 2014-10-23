import PyObject = require('./PyObject');
import enums = require('./enums');

class PyTuple<T> extends PyObject{
  private array: T[];
  constructor(array: T[]){
    super(enums.PyType.TYPE_TUPLE);
    this.array = array.slice(0);
  }
  getItem(index: number): T{
    return this.array[index];
  }
  getLength(): number{
    return this.array.length;
  }
}

export = PyTuple;
