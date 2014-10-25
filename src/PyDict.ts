import PyObject = require('./PyObject');
import enums = require('./enums');

//TODO: Fix
//O(n) lookups and inserts yay! Wait, booooo!
//tried to use https://github.com/flesler/hashmap
//but no worky. I should copy the hash function.
class PyDict<K, V>{
  private keys: K[];
  private values: V[];
  private size: number;
  constructor(){
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
  count(): number{
    return this.size;
  }
  private getKeyIndex(key: K): number{
    return this.keys.indexOf(key);
  }
}

export = PyDict;