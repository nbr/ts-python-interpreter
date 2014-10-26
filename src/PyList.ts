import PyObject = require('./PyObject');
import enums = require('./enums');

class PyList<T> extends PyObject{
  private array: T[];
  constructor(array: T[]){
    super(enums.PyType.TYPE_LIST);
    this.array = array.slice(0);
  }
  getItem(index: number): T{
    return this.array[index];
  }
  getLength(): number{
    return this.array.length;
  }
  __str__(): string{
    var s = "[";
    for(var i=0; i < this.array.length; i++){
      s += "" + this.getItem(i);
      if(i!=this.array.length-1){ s+=","; }
    }
    s += "]"
    return s;
  }
}

export = PyList;
