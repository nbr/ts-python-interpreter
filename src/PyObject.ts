import PyType = require('./PyType');

class PyObject{
  private type: PyType;
  private value: any;
  constructor(type: PyType, value: any){
    this.type = type;
    this.value = value;
  }
  getType(): PyType{
    return this.type;
  }
  getValue(): any{
    return this.value;
  }
}

export = PyObject;
