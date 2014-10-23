import PyObject = require('./PyObject');
import enums = require('./enums');

//TODO: Fix
//O(n) lookups and inserts yay! Wait, booooo!
class PyDict{
  private keys: PyObject[];
  private values: PyObject[];
  private size: number;
  constructor(keys: PyObject[], values: PyObject[]){
    this.keys = keys;
    this.values = values;
    this.size = keys.length;
  }
  getItem(key: PyObject): PyObject{
    var index: number = this.getKeyIndex(key);
    if(index === -1){ return undefined; }
    return this.values[index];
  }
  //probably need to tighten up the typing here
  putItem(key: PyObject, value: PyObject): void{
    var index: number = this.getKeyIndex(key);
    if(index === -1){
      this.size++;
      this.keys.push(key);
      this.values.push(value);
      return;
    }
    this.values[index] = value;
  }
  getLength(): number{
    return this.size;
  }
  private getKeyIndex(key: PyObject): number{
    return this.keys.indexOf(key);
  }
}

export = PyDict;
