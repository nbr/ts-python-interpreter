import StackOp = require('StackOp');
import StackMachine = require('StackMachine');
class CodeObject{
  //thanks to http://daeken.com/2010-02-20_Python_Marshal_Format.html
  //Python code object fields
  private argcount: number;
  private nlocals: number;
  private stacksize: number;
  private flags: number; //figure out bit operations or maybe switch to enums
  private code: StackOp[];
  private consts: Tuple<any>;
  private names: Tuple<string>; //pretty sure only strings here
  private varnames: Tuple<string>; //pretty sure only strings here
  private freevars: Tuple<any>;
  private cellvars: Tuple<any>;
  private filename: string;
  private name: string;
  private firstlineno: number;
  private lnotab: CodeOffsetToLineNoMap;

  //Implementation variables
  //Looking at CALL_FUNCTION of dis it seems as though
  //each code object should have its own stack machine
  //since it pops arguments and function and pushes
  //return. That function itself must be executed on
  //stack machine.
  private stackMachine: StackMachine;

  //Look into factory pattern?
  constructor(/*dict containing all the fields*/){
    //fill in fields
    this.stackMachine = new StackMachine();
  }
  execute(){
  }
}
interface CodeOffsetToLineNoMap{
  [index: number]: number;
}
class Tuple<T>{
  private array: T[];
  constructor(array: T[]){
    this.array = array.slice(0);
  }
  getItem(index: number): T{
    return this.array[index];
  }
  getLength(): number{
    return this.array.length;
  }
}

export = CodeObject;
