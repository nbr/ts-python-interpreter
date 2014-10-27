import PyObject = require('./PyObject');
import enums = require('./enums');

class PyDictItem<K extends PyObject, V extends PyObject> extends PyObject{
  private k: K;
  private v: V;
  constructor(key: K, value: V){
    super(enums.PyType.TYPE_DICTITEM);
    this.k = key;
    this.v = value;
  }
  key(): K{
    return this.k;
  }
  value(): V{
    return this.v;
  }
}

export = PyDictItem;
