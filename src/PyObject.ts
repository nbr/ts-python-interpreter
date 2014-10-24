import enums = require('./enums');

class PyObject{
  private type: enums.PyType;
  //private value: any;
  /*
  constructor(type: enums.PyType, value: any){
    this.type = type;
    this.value = value;
  }
  */
  constructor(type: enums.PyType){
    this.type = type;
  }
  getType(): enums.PyType{
    return this.type;
  }
  __str__(): string{
    //TODO: fix with Exception
    throw "__str__ not implemented";
  }
  /*
  getValue(): any{
    return this.value;
  }
  */
}

export = PyObject;
