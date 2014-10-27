import PyObject = require('./PyObject');
import PyTuple = require('./PyTuple');
import PyDictItem = require('./PyDictItem');
import PyUnicode = require('./PyUnicode');
import enums = require('./enums');

//tried to use https://github.com/flesler/hashmap
//but no worky. I should copy the hash function.
class PyDict<K extends PyObject, V extends PyObject> extends PyObject{
  private items: PyDictItem<K, V>[];
  private size: number;
  constructor(){
    super(enums.PyType.TYPE_DICT);
    this.items = new Array<PyDictItem<K, V>>();
    this.size = 0;
  }
  get(key: K): V{
    var h: string = this.hash(key);
    if(this.items[h] === undefined){
      return undefined;
    }
    return this.items[this.hash(key)].value();
  }
  put(key: K, value: V): void{
    var h: string = this.hash(key);
    if(this.items[h] === undefined){
      this.size++;
      this.items[h] = new PyDictItem<K, V>(key,value);
    }
    this.items[h].setValue(value);
  }
  getItems(): Array<PyDictItem<K, V>>{
    return this.items.slice(0);
  }
  shallowCopy(): PyDict<K, V>{
    var cItems: Array<PyDictItem<K, V>> = new Array<PyDictItem<K, V>>();
    for(var key in this.items){
      if(this.items.hasOwnProperty(key)){
        var i: PyDictItem<K, V> = this.items[key];
        cItems[key] = new PyDictItem<K, V>(i.key(), i.value());
      }
    }
    var d: PyDict<K, V> = new PyDict<K, V>();
    d.items = cItems;
    d.size = this.size;
    return d;
  }
  count(): number{
    return this.size;
  }
  //TODO: hash function needs to be fixed
  //for objects that do not override __str__()
  private hash(key: K): string{
    return key.__str__();
  }

  __str__(): string{
    var s = "{";
    for(var hash in this.items){
      if(this.items.hasOwnProperty(hash)){
        s += "(";
        s += "" + this.items[hash].key().__str__();
        s += ": ";
        s += this.items[hash].value().__str__();
        s += "),";
      }
    }
    if(this.size > 0){
      s = s.slice(0,-1);
    }
    s += "}";
    return s;
  }
}

export = PyDict;
