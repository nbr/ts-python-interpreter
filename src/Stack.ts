class Stack<T> {

  private stack;

  constructor(){
    this.stack = new Array<T>();
  }

  pop(): T{
    return this.stack.pop();
  }
  push(item: T): void {
    this.stack.push(item);
  }

  length(): number {
    return this.stack.length();
  }

}

export = Stack;
