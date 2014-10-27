import PyObject = require('./PyObject');
import enums = require('./enums');

class PyFalse extends PyObject{
  constructor(){
    super(enums.PyType.TYPE_FALSE);
  }

  getValue(): boolean{
    return false;
  }

}

export = PyFalse;
