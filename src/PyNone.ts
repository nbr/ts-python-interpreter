import PyObject = require('./PyObject');
import enums = require('./enums');

class PyNone extends PyObject{
  constructor(){
    super(enums.PyType.TYPE_NONE);
  }
}

export = PyNone;
