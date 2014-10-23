import PyObject = require('./PyObject');
import PyCodeObject = require('./PyCodeObject');
import PyDict = require('./PyDict');
import PyNone = require('./PyNone');
import enums = require('./enums');

class PyFunction extends PyObject{
  private code: PyCodeObject;
  private globals: PyDict<PyObject, PyObject>;
  private defaults: PyTuple<PyObject>;
  private closure: PyTuple<PyCell<PyObject>>;
  private doc: PyObject;
  private name: PyString;
  private dict: PyDict<PyObject, PyObject>;
  private weakreflist: PyList<PyObject>;
  private mod: PyObject;
  
  constructor(code: PyCodeObject, globals: PyDict<PyObject, PyObject>){
    super(enums.PyType.TYPE_FUNCTION);
    this.code = code;
    this.globals = globals;
    if(this.code.getConstsSize() >=1){
      this.doc = this.code.getConst();
    }
    else{ this.doc = new PyNone(); }
  }
  getName(): PyString{
    return this.code.getName();
  }
  getConsts(): PyTuple<PyObject>{
    return this.code.getConsts();
  }
}

export = PyFunction;
