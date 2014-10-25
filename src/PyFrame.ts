//TODO: optimize imports
import FileWrapper = require('./FileWrapper');
import PyError = require('./PyError');
import PyErrorType = require('./PyErrorType');
import PyObject = require('./PyObject');
import PyCodeObject = require('./PyCodeObject');
import enums = require('./enums');
import Exceptions = require('./Exceptions');
import PyThreadState = require('./PyThreadState');
import Stack = require('./Stack');
import PyDict = require('./PyDict');
import PyTuple = require('./PyTuple');
import PyFunction = require('./PyFunction');

class PyFrame {

  private code: PyCodeObject;
  /*TODO?: trace: PyObject;
  private  f_lineno: number;*/
  /*TODO?: exception fields? f_exc_type: PyObject;
  private  f_exc_value: PyObject;
  private  f_exc_traceback: PyObject;*/

  private tstate: PyThreadState;

  private last_i: number;
  private f_iblock: number;

  private f_localsplus: Array<any>; //locals+cells+free_var+valstack
  //i.e. co_nlocals,co_cellvars,co_freevars,co_stacksize

  private valueStack: Stack<PyObject>; //Opcode arguments (if applicable)
  private blockStack: Stack<PyObject>; //TODO:PyTryBlock class

  //use as associative arrays
  private locals: PyDict<PyObject, PyObject>; //local variables
  private globals: PyDict<PyObject, PyObject>; //global variables
  private builtins: PyDict<PyObject, PyObject>; //builtin variables

  constructor(code: PyCodeObject,
      tstate: PyThreadState){
    this.locals = new PyDict<PyObject, PyObject>();
    this.globals = new PyDict<PyObject, PyObject>();
    this.builtins = new PyDict<PyObject, PyObject>();
    this.code = code;
    this.last_i = -1;
    this.tstate = tstate;
    this.valueStack = new Stack<PyObject>();
    this.blockStack = new Stack<PyObject>();
  }

  //ceval.c : PyEval_EvalFrameEx
  evalFrame(): PyObject{
    var opCodes:FileWrapper = this.code.getCode().getFileWrapper();
    opCodes.seek(0);
    while (opCodes.getOffset() < opCodes.getBufLength()) {
      var returnValue: any = this.runOp(opCodes);
    }
    //TODO: Then get the next frame from threadstate
    //the last executed opcode should be RETURN_VALUE
    return <PyObject> returnValue;
  }

  //TODO: will fail on unimpl opcodes
  private runOp(fw:FileWrapper): void{
    var currOpcode: number = fw.getUInt8();
    if(this[enums.OpList[currOpcode]]) {
      this[enums.OpList[currOpcode]].call(this, fw);
    }
    else{
      console.log(currOpcode);
      throw "Missing impl of opcode";
    }
  }

  private rot(n:number): void{
    var len:number = this.valueStack.getLength();
    var top:any = this.valueStack[len - 1];
    for (var i:number = 1; i < n; i++) {
      this.valueStack[len - i] = this.valueStack[len - i - 1];
    }
    this.valueStack[len - n] = top;
  }

  private isPyNum(type:enums.PyType): boolean{
    return (enums.PyType.TYPE_INT <= type && type <= enums.PyType.TYPE_LONG);
  }

  /*Opcodes
   ~= ceval.c ln 1112-2824
   runOp() instead of switch statements*/

  //0
  private STOP_CODE(fw:FileWrapper): void{
    return;
  }

  //1
  private POP_TOP(fw:FileWrapper): void{
    this.valueStack.pop();
  }

  //2
  private ROT_TWO(fw:FileWrapper): void{
    this.rot(2);
  }

  //3
  private ROT_THREE(fw:FileWrapper): void{
    this.rot(3);
  }

  //4
  private DUP_TOP(fw:FileWrapper): void{
    this.valueStack.push(this.valueStack[this.valueStack.getLength() - 1]);
  }

  //5
  private ROT_FOUR(fw:FileWrapper): void{
    this.rot(4);
  }

  //9
  private NOP(fw:FileWrapper): void{
    return;
  }

  //10
  //TODO: redo using class methods
  /*
  private UNARY_POSITIVE(fw:FileWrapper): void{
    var v:PyObject = this.valueStack.pop();
    if (!this.isPyNum(v.getType())) {
      v = new PyObject(enums.PyType.TYPE_ERROR, new PyError(PyErrorType.TypeError));
    }
    this.valueStack.push(v);
  }
  */

  //11
  //TODO: redo using class methods
  /*
  private UNARY_NEGATIVE(fw:FileWrapper): void{
    var v:PyObject = this.valueStack.pop();
    if (!this.isPyNum(v.getType())) {
      v = new PyObject(enums.PyType.TYPE_ERROR, new PyError(PyErrorType.TypeError));
    }
    else {
      v = new PyObject(v.getType(), -1 * v.getValue());
    }
    this.valueStack.push(v);
  }
  */

  //12
  //TODO: redo using class methods
  /*
  private UNARY_NOT(fw:FileWrapper): void{
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
  */

  //71
  private PRINT_ITEM(fw: FileWrapper): void{
    var i: PyObject = this.valueStack.pop();
    this.tstate.stdout(i.__str__());
  }
  //72
  private PRINT_NEWLINE(fw: FileWrapper): void{
    this.tstate.stdout('\n');
  }
  //73
  private PRINT_NEWLINE_TO(fw: FileWrapper): void{
    this.PRINT_NEWLINE(fw);
  }
  //83
  private RETURN_VALUE(fw: FileWrapper): PyObject{
    return this.valueStack.pop();
  }
  //90
  private STORE_NAME(fw: FileWrapper): void{
    var index: number = fw.getUInt16();
    var key: PyObject = this.code.getNames().getItem(index);
    var value: PyObject = this.valueStack.pop();
    this.locals.put(key, value);
  }

  //97
  private STORE_GLOBAL() {
  }

  //100
  private LOAD_CONST(fw: FileWrapper): void{
    var index: number = fw.getUInt16();
    this.valueStack.push(this.code.getConst(index));
  }

  //101
  //Credit to Python Innards for Python-syntax version.
  private LOAD_NAME(fw: FileWrapper): void{
    var index: number = fw.getUInt16();
    var key: PyObject = this.code.getNames().getItem(index);
    var value: PyObject = this.locals.get(key);
    if(value === undefined){
      value = this.globals.get(key);
    }
    if(value === undefined){
      value = this.builtins.get(key);
    }
    if(value === undefined){
      throw new Exceptions.Exception(JSON.stringify(key) + " not defined");
    }
    this.valueStack.push(value);
  }

  //116
  private LOAD_GLOBAL() {
  }

  //124
  //TODO: Bypass scope optimization and simply call (LOAD,STORE)_NAME?
  private LOAD_FAST() {
  }

  //125
  private STORE_FAST() {
  }

  //131
  private CALL_FUNCTION(fw: FileWrapper): void{
    var posParamCnt: number = fw.getUInt8();
    var keyParamCnt: number = fw.getUInt8();
    var keyParams: PyDict<PyObject, PyObject> = new PyDict<PyObject, PyObject>();
    for(var i: number = 0; i < keyParamCnt; i++){
      var key: PyObject = this.valueStack.pop();
      var value: PyObject = this.valueStack.pop();
      keyParams.put(key, value);
    }
    var posParamArray: PyObject[] = new Array<PyObject>();
    for(i = 0; i < keyParamCnt; i++){
      var param: PyObject = this.valueStack.pop();
      posParamArray.unshift(param);
    }
    var posParams: PyTuple<PyObject> = new PyTuple<PyObject>(posParamArray);
    //TODO: I don't know what to do with the parameters yet.
    //We'll figure that out when we get to functions with parameters.
    var func: PyFunction = <PyFunction> this.valueStack.pop();
    var frame: PyFrame = new PyFrame(func.getCode(), this.tstate);
    //TODO: Fill in frame fields using func
    this.tstate.frameStackPush(frame);
    var returnValue: PyObject = frame.evalFrame();
    this.tstate.frameStackPop();
    this.valueStack.push(returnValue);
  }

  //132
  private MAKE_FUNCTION(fw: FileWrapper): void{
    var paramCnt: number = fw.getUInt16();
    var codeobj: PyCodeObject = <PyCodeObject> this.valueStack.pop();
    var opargs: PyObject[] = new Array<PyObject>();
    for(var i: number = 0; i < paramCnt; i++){
      opargs.push(this.valueStack.pop());
    }
    var func: PyFunction = new PyFunction(codeobj,
      this.globals,
      new PyTuple<PyObject>(opargs));
    this.valueStack.push(func);
  }
}
export = PyFrame;
