//TODO: optimize imports
import FileWrapper = require('./FileWrapper');
import PyError = require('./PyError');
import PyErrorType = require('./PyErrorType');
import PyObject = require('./PyObject');
import CodeObject = require('./CodeObject');
import Dict = require('./Dict');
import enums = require('./enums');
import PyFrame = require('./PyFrame');
import Exceptions = require('./Exceptions');
import PyThreadState = require('./PyThreadState');

class PyFrame {

  code: CodeObject;
  /*TODO?: trace: PyObject;
   f_lineno: number;*/
  /*TODO?: exception fields? f_exc_type: PyObject;
   f_exc_value: PyObject;
   f_exc_traceback: PyObject;*/

  tstate: PyThreadState;

  last_i: number;
  f_iblock: number;

  f_localsplus: Array<any>; //locals+cells+free_var+valstack
  //i.e. co_nlocals,co_cellvars,co_freevars,co_stacksize

  //Access only push/pop; TODO:Stack class?
  valueStack: Array<PyObject>; //Opcode arguments (if applicable)
  blockStack: Array<PyObject>; //TODO:PyTryBlock class

  //use as associative arrays
  locals: Array<PyObject>; //local variables
  globals: Array<PyObject>; //global variables
  builtins: Array<PyObject>; //builtin variables

  constructor(code: CodeObject, tstate: PyThreadState){
    this.locals = [];
    this.globals = [];
    this.builtins = [];
    this.code = code;
    this.last_i = -1;
    this.tstate = tstate;
  }

  //ceval.c : PyEval_EvalFrameEx
  evalFrame(): void {
    var opCodes:FileWrapper = this.code.getCode().getValue();
    opCodes.seek(0);
    while (opCodes.getOffset() < opCodes.getBufLength()) {
      this.runOp(opCodes);
    }
    //TODO: Then get the next frame from threadstate
  }

  //TODO: will fail on unimpl opcodes
  private runOp(fw:FileWrapper):void {
    var currOpcode: number = fw.getUInt8();
    console.log(currOpcode);
    //assert(lookupTable[i] != null, "Missing implementation of opcode " + enums.OpList[i]);
    if(this[enums.OpList[fw.getUInt8()]]) {
      this[enums.OpList[fw.getUInt8()]].call(this, fw);
    }
    else{
      console.log("Missing impl of opcode");
    }
  }

  private rot(n:number):void {
    var len:number = this.valueStack.length;
    var top:any = this.valueStack[len - 1];
    for (var i:number = 1; i < n; i++) {
      this.valueStack[len - i] = this.valueStack[len - i - 1];
    }
    this.valueStack[len - n] = top;
  }

  private isPyNum(type:enums.PyType):boolean {
    return (enums.PyType.TYPE_INT <= type && type <= enums.PyType.TYPE_LONG);
  }

  /*Opcodes
   ~= ceval.c ln 1112-2824
   runOp() instead of switch statements*/

  //101
  //Credit to Python Innards for Python-syntax version.
  //TODO: is the typing right here
  //TODO: returns should be callStack pushes
  private LOAD_NAME(name: any): PyObject {
    var NameError:Exceptions.Exception = new Exceptions.Exception("" + name + "not defined");
    try {
      return this.locals[name];
    }
    catch (NameError) {
      try {
        return this.globals[name];
      }
      catch (NameError) {
        try {
          return this.builtins[name];
        }
        catch (NameError) {
          throw NameError;
        }
      }
    }
  }

  //90
  private STORE_NAME(name:any, value:any) {
    this.locals[name] = value;
  }

  //TODO: Bypass scope optimization and simply call (LOAD,STORE)_NAME?
  private LOAD_FAST() {
  }

  private STORE_FAST() {
  }

  private LOAD_GLOBAL() {
  }

  private STORE_GLOBAL() {
  }

  //0
  private STOP_CODE(fw:FileWrapper):void {
    return;
  }

  //1
  private POP_TOP(fw:FileWrapper):void {
    this.valueStack.pop();
  }

  //2
  private ROT_TWO(fw:FileWrapper):void {
    this.rot(2);
  }

  //3
  private ROT_THREE(fw:FileWrapper):void {
    this.rot(3);
  }

  //4
  private DUP_TOP(fw:FileWrapper):void {
    this.valueStack.push(this.valueStack[this.valueStack.length - 1]);
  }

  //5
  private ROT_FOUR(fw:FileWrapper):void {
    this.rot(4);
  }

  //9
  private NOP(fw:FileWrapper):void {
    return;
  }

  //10
  private UNARY_POSITIVE(fw:FileWrapper):void {
    var v:PyObject = this.valueStack.pop();
    if (!this.isPyNum(v.getType())) {
      v = new PyObject(enums.PyType.TYPE_ERROR, new PyError(PyErrorType.TypeError));
    }
    this.valueStack.push(v);
  }

  //11
  private UNARY_NEGATIVE(fw:FileWrapper):void {
    var v:PyObject = this.valueStack.pop();
    if (!this.isPyNum(v.getType())) {
      v = new PyObject(enums.PyType.TYPE_ERROR, new PyError(PyErrorType.TypeError));
    }
    else {
      v = new PyObject(v.getType(), -1 * v.getValue());
    }
    this.valueStack.push(v);
  }

  //12
  private UNARY_NOT(fw:FileWrapper):void {
    var v:PyObject = this.valueStack.pop();
    var b:boolean;
    switch (v.getType()) {
      case enums.PyType.TYPE_NULL:
        throw 'TYPE_NULL on UNARY_NOT';
        return;
      case enums.PyType.TYPE_NONE:
      case enums.PyType.TYPE_FALSE:
        b = true;
        break;
      case enums.PyType.TYPE_TRUE:
        b = false;
        break;
      case enums.PyType.TYPE_STOPITER:
        throw 'TYPE_STOPITER on UNARY_NOT';
      case enums.PyType.TYPE_ELLIPSIS:
        throw 'TYPE_ELLIPSIS on UNARY_NOT';
      case enums.PyType.TYPE_INT:
      case enums.PyType.TYPE_INT64:
      case enums.PyType.TYPE_FLOAT:
      case enums.PyType.TYPE_BINARY_FLOAT:
      case enums.PyType.TYPE_COMPLEX:
      case enums.PyType.TYPE_BINARY_COMPLEX:
      case enums.PyType.TYPE_LONG:
        if (v.getValue() === 0) {
          b = true;
          break;
        }
        b = false;
        break;
      case enums.PyType.TYPE_STRING:
      case enums.PyType.TYPE_INTERNED:
        if (v.getValue().getBufLength() === 0) {
          b = true;
          break;
        }
        b = false;
        break;
      case enums.PyType.TYPE_STRINGREF:
        //need to dereference string
        throw 'TYPE_STRINGREF on UNARY_NOT';
      case enums.PyType.TYPE_UNICODE:
        if (v.getValue().length === 0) {
          b = true;
          break;
        }
        b = false;
        break;
      case enums.PyType.TYPE_TUPLE:
      case enums.PyType.TYPE_LIST:
      case enums.PyType.TYPE_DICT:
      case enums.PyType.TYPE_FROZENSET:
        if (v.getValue().getLength() === 0) {
          b = true;
          break;
        }
        b = false;
        break;
      case enums.PyType.TYPE_CODE:
      case enums.PyType.TYPE_ERROR:
        //https://docs.python.org/2/library/stdtypes.html#typesnumeric
        //this probably is not be correct
        b = false;
        break;
    }
    var p:PyObject;
    if (b) {
      p = new PyObject(enums.PyType.TYPE_TRUE, undefined);
    }
    else {
      p = new PyObject(enums.PyType.TYPE_FALSE, undefined);
    }
    this.valueStack.push(p);
  }

  //100
  private LOAD_CONST(fw:FileWrapper):void {
    var index:number = this.getArg(fw);
    this.valueStack.push(this.code.getConst(index));
  }

  //132
  private MAKE_FUNCTION(fw:FileWrapper):void {
    var paramCnt:number = this.getArg(fw);
    console.log(paramCnt);
  }

  private getArg(fw:FileWrapper):number {
    return fw.getUInt16();
  }

}
export = PyFrame;