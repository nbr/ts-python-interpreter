import PyObject = require('./PyObject');
import PyCodeObject = require('./PyCodeObject');
import PyDict = require('./PyDict');
import PyTuple = require('./PyTuple');
import PyNone = require('./PyNone');
import PyCell = require('./PyCell');
import PyString = require('./PyString');
import PyList = require('./PyList');
import enums = require('./enums');

class PyFunction extends PyObject{
  private code: PyCodeObject;
  private globals: PyDict<PyObject, PyObject>;
  private defaults: PyTuple<PyObject>;
  private closure: PyTuple<PyCell<PyObject>>;
  private doc: PyObject;
  private dict: PyDict<PyObject, PyObject>;
  private weakreflist: PyList<PyObject>;
  private func_module: PyObject;
  //name = codeobject name
  //consts = codeobject consts
  
  constructor(code: PyCodeObject,
      globals: PyDict<PyObject, PyObject>,
      defaults: PyTuple<PyObject>){
    super(enums.PyType.TYPE_FUNCTION);
    this.code = code;
    this.globals = globals;
    this.defaults = defaults;
    if(this.code.getConstsSize() >=1){
      this.doc = this.code.getConst(0);
    }
    else{ this.doc = new PyNone(); }
    //TODO: There is more in funcobject.c
    //dealing with func_module
  }
  getName(): PyString{
    return this.code.getName();
  }
}

export = PyFunction;
