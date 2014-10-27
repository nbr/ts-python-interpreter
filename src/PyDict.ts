import PyObject = require('./PyObject');
import PyTuple = require('./PyTuple');
import PyDictItem = require('./PyDictItem');
import enums = require('./enums');

//TODO: Fix
//O(n) lookups and inserts yay! Wait, booooo!
//tried to use https://github.com/flesler/hashmap
//but no worky. I should copy the hash function.
class PyDict<K extends PyObject, V extends PyObject> extends PyObject{
  private keys: K[];
  private values: V[];
  private size: number;
  constructor(){
    super(enums.PyType.TYPE_DICT);
    this.keys = new Array<K>();
    this.values = new Array<V>();
    this.size = 0;
  }
  get(key: K): V{
    var index: number = this.getKeyIndex(key);
    if(index === -1){ return undefined; }
    return this.values[index];
  }
  put(key: K, value: V): void{
    var index: number = this.getKeyIndex(key);
    if(index === -1){
      this.size++;
      this.keys.push(key);
      this.values.push(value);
      return;
    }
    this.values[index] = value;
  }
  items(): Array<PyDictItem<K, V>>{
    var a: Array<PyDictItem<K, V>> = new Array<PyDictItem<K, V>>();
    for(var i: number = 0; i < this.keys.length; i++){
      var di: PyDictItem<K, V> = new PyDictItem<K, V>(this.keys[i], this.values[i]);
      a.push(di);
    }
    return a;
  }
  shallowCopy(): PyDict<K, V>{
    var d: PyDict<K, V> = new PyDict<K, V>();
    d.keys = this.keys.slice(0);
    d.values = this.values.slice(0);
    d.size = this.size;
    return d;
  }
  count(): number{
    return this.size;
  }
  private getKeyIndex(key: K): number{
    return this.keys.indexOf(key);
  }

  __str__(): string{
    var s = "{";
    if(this.keys.length != this.values.length){
      throw "uneven dict";
    }
    for(var i=0; i < this.keys.length; i++){
      s += "(";
      s += "" + this.keys[i];
      s += ": ";
      s += this.get(this.keys[i]);
      if(i!=this.keys.length-1){ s += "),"; }
      else{ s += ")"; }
    }
    s += "}";
    return s;
  }
}

export = PyDict;
