import PyObject = require('./PyObject');
import FileWrapper = require('./FileWrapper');
import enums = require('./enums');

class PyString extends PyObject{
  private fw: FileWrapper;
  constructor(fw: FileWrapper){
    super(enums.PyType.TYPE_STRING);
    this.fw = fw;
  }
  getFileWrapper(): FileWrapper{
    return this.fw;
  }
}

export = PyString;
