import PyObject = require('./PyObject');
import enums = require('./enums');

class PyStopiter extends PyObject{
  constructor(){
    super(enums.PyType.TYPE_STOPITER);
  }
}

export = PyStopiter;
