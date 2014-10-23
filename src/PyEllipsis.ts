import PyObject = require('./PyObject');
import enums = require('./enums');

class PyEllipsis extends PyObject{
  constructor(){
    super(enums.PyType.TYPE_ELLIPSIS);
  }
}

export = PyEllipsis;
