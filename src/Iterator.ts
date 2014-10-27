import PyObject = require ('./PyObject');
import enums = require ('./enums');

// Credit for base class to https://github.com/funnythingz/typescript-iterator
// with modification here

class Iterator<T extends PyObject> extends PyObject {

  private count: number;
  private lists: Array<T>;

  constructor(iterable: PyObject) {
    super(enums.PyType.TYPE_ITER);
    this.lists = iterable.getArray();
    this.count = this.lists.length-1;
  }

  hasNext(): boolean {
    if(this.count < this.lists.length) {
      return true;
    }
    return false;
  }

  next(): T {
    var result: T;
    if(this.hasNext()) {
      result = this.lists[this.count];
      this.count += 1;
      return result;
    }

    return null;
  }

  reverseHasNext(): boolean {
    if(this.count >= 0) {
      return true;
    }
    return false;
  }

  reverseNext(): T {
    var result: T;
    if(this.hasNext()) {
      result = this.lists[this.count];
      this.count -= 1;
      return result;
    }

    return null;
  }

}

export = Iterator;