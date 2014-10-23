import PyObject = require('./PyObject');
import enums = require('./enums');

class PyNull extends PyObject{
  constructor(){
    super(enums.PyType.TYPE_NULL);
  }
}

export = PyNull;
