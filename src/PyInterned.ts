import PyObject = require('./PyObject');
import FileWrapper = require('./FileWrapper');
import enums = require('./enums');

class PyInterned extends PyObject{
  private fw: FileWrapper;
  constructor(fw: FileWrapper){
    super(enums.PyType.TYPE_INTERNED);
    this.fw = fw;
  }
  getFileWrapper(): FileWrapper{
    return this.fw;
  }
}

export = PyInterned;
