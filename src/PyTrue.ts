import PyObject = require('./PyObject');
import enums = require('./enums');

class PyTrue extends PyObject{
  constructor(){
    super(enums.PyType.TYPE_TRUE);
  }

  getValue(): boolean{
    return true;
  }

}

export = PyTrue;
