//TODO: optimize imports
import FileWrapper = require('./FileWrapper');
import FileWrapperFactory = require('./FileWrapperFactory');
import PyError = require('./PyError');
import PyErrorType = require('./PyErrorType');
import PyObject = require('./PyObject');
import PyCodeObject = require('./PyCodeObject');
import enums = require('./enums');
import Exceptions = require('./Exceptions');
import PyThreadState = require('./PyThreadState');
import Stack = require('./Stack');
import PyDict = require('./PyDict');
import PyList = require ('./PyList');
import PyTuple = require('./PyTuple');
import PyFunction = require('./PyFunction');
import PyTrue = require('./PyTrue');
import PyFalse = require('./PyFalse');
import PyString = require('./PyString');
import PyTryBlock = require ('./PyTryBlock');
import Iterator = require ('./Iterator');

class PyFrame {

  private code: PyCodeObject;
  /*TODO?: trace: PyObject;
  private  f_lineno: number;*/
  /*TODO?: exception fields? f_exc_type: PyObject;
  private  f_exc_value: PyObject;
  private  f_exc_traceback: PyObject;*/

  private CO_MAXBLOCKS;

  private tstate: PyThreadState;

  private last_i: number;

  private f_localsplus: Array<PyObject>; //locals+cells+free_var+valstack
  //i.e. co_nlocals,co_cellvars,co_freevars,co_stacksize
  //I could not find anything in frameobject.c that
  //suggests f_localsplus has pointers to the valuestack
  //In frameobject.h, it does say locals+stack
  //on line 49

  private valueStack: Stack<PyObject>; //Opcode arguments (if applicable)

  private blockStack: Stack<PyTryBlock>;

  //private iblock: number; //an index into the block stack
  //This is equivalent to blockStack.getLength() and unnecessary
  //likewise for f_stacktop, which is just valueStack.length()

  //use as associative arrays
  private locals: PyDict<PyObject, PyObject>; //local variables
  private globals: PyDict<PyObject, PyObject>; //global variables
  private builtins: PyDict<PyObject, PyObject>; //builtin variables

  constructor(code: PyCodeObject,
      tstate: PyThreadState){
    this.locals = new PyDict<PyObject, PyObject>();
    this.globals = new PyDict<PyObject, PyObject>();
    this.builtins = new PyDict<PyObject, PyObject>();
    //guess what's in builtins and stick it
    this.builtins.put(new PyString(FileWrapperFactory.fromString('True')), new PyTrue);
    this.builtins.put(new PyString(FileWrapperFactory.fromString('False')), new PyFalse);
    this.code = code;
    this.last_i = -1;
    this.tstate = tstate;
    this.f_localsplus = new Array<PyObject>();

    this.valueStack = new Stack<PyObject>();
    this.blockStack = new Stack<PyTryBlock>();

    this.CO_MAXBLOCKS = 100; //TODO: temporary
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
    //console.log(currOpcode);
    //this.last_i = fw.getOffset();
    if(this[enums.OpList[currOpcode]]) {
      this[enums.OpList[currOpcode]].call(this, fw);
    }
    else{
      this.tstate.stdout('opcode ' + currOpcode + ' = ' + enums.OpList[currOpcode]);
      throw new Exceptions.Exception("Opcode not impl");
    }
    this.last_i = fw.getOffset();
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

  private blockSetup(f: PyFrame, type, handler: number, level: number): void{
    if(this.blockStack.getLength() >= this.CO_MAXBLOCKS){
      throw "block stack overflow";
    }
    //console.log(this.blockStack.getLength());
    var tryBlock = new PyTryBlock(type,handler,level);
    this.blockStack.push(tryBlock);
  }

  private blockPop(f: PyFrame): PyTryBlock{
    var tryBlock: PyTryBlock;
    tryBlock = f.blockStack.pop();
    return tryBlock;
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

  //23
  private BINARY_ADD(fw: FileWrapper): void{
    var left: PyObject = this.valueStack.pop();
    var right: PyObject = this.valueStack.pop();
    var result: PyObject;
    try{
      result = left.__add__(right);
    }catch(e){//TS says "Catch clause parameter cannot have a type annotation."
      result = right.__radd__(left);
    }
    this.valueStack.push(result);
  }
  //68
  private GET_ITER(fw: FileWrapper): void{
    //Create an iterator object from the object that's on the stack and return the iterator class encapsulating that object.
    var obj = this.valueStack.pop();
    var itt = new Iterator(obj);
    this.valueStack.push(itt);
  }
  //71
  private PRINT_ITEM(fw: FileWrapper): void{
//    console.log("PRINT_ITEM");
    var i: PyObject = this.valueStack.pop();
    this.tstate.stdout(i.__str__());
  }
  //72
  private PRINT_NEWLINE(fw: FileWrapper): void{
//    console.log("PRINT_NEWLINE");
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
  //87
  private POP_BLOCK(fw: FileWrapper): void{
    this.blockPop(this);
  }
  //90
  private STORE_NAME(fw: FileWrapper): void{
    var index: number = fw.getUInt16();
    var key: PyObject = this.code.getNames().getItem(index);
    var value: PyObject = this.valueStack.pop();
    this.locals.put(key, value);
  }
  //93
  private FOR_ITER(fw: FileWrapper): void{
    var iter = <Iterator<PyObject>> this.valueStack.pop();
    var jump: number = fw.getUInt16();
    if(iter.reverseHasNext()){
      var item = iter.reverseNext();
      this.valueStack.push(iter);
      this.valueStack.push(item);
    }
    else{
      fw.seek(fw.getOffset() + jump);
    }
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
      try{
        this.tstate.stdout('key=' + key.__str__());
      }
      catch(e){
        this.tstate.stdout('key=' + JSON.stringify(key));
      }
      throw new Exceptions.Exception('LOAD_NAME key not defined');
    }
    this.valueStack.push(value);
  }

  //102
  private BUILD_TUPLE(fw: FileWrapper): void{

  }
  //103
  private BUILD_LIST(fw: FileWrapper): void{
    var listSize = fw.getUInt16();
    var pyList = new PyList(new Array<PyObject>());
    for(var i = listSize; i>0; i--){
      var elt = this.valueStack.pop();
      pyList.array.push(elt);
    }
    this.valueStack.push(pyList);
  }
  //104
  private BUILD_SET(fw: FileWrapper): void{

  }
  //105
  private BUILD_MAP(fw: FileWrapper): void{

  }
  //107
  private COMPARE_OP(fw: FileWrapper): void {
    var cmpidx = fw.getUInt16();
    var b: PyObject = this.valueStack.pop();
    var a: PyObject = this.valueStack.pop();
    if(a.__cmp__(cmpidx,b)){
      this.valueStack.push(new PyTrue());
    }
    else{
      this.valueStack.push(new PyFalse());
    }
  }
  //108
  private IMPORT_NAME(fw: FileWrapper): void{

  }
  //109
  private IMPORT_FROM(fw: FileWrapper): void{

  }
  //110
  private JUMP_FORWARD(fw: FileWrapper): void{
    var jump: number = fw.getUInt16();
    fw.seek(fw.getOffset() + jump);
  }
  //113
  private JUMP_ABSOLUTE(fw: FileWrapper): void{
    var jumpto: number = fw.getUInt16();
    fw.seek(jumpto);
  }
  //114
  private POP_JUMP_IF_FALSE(fw: FileWrapper): void{
    var value: boolean = this.valueStack.pop().getValue();
    var jumpto: number = fw.getUInt16();
    if(value == false){
      fw.seek(jumpto);
    }
  }
  //116
  private LOAD_GLOBAL(fw: FileWrapper): void{
    var index: number = fw.getUInt16();
    var key: PyObject = this.code.getNames().getItem(index);
    var value: PyObject = this.globals.get(key);
    if(value === undefined){
      value = this.builtins.get(key);
    }
    if(value === undefined){
      try{
        this.tstate.stdout('key=' + key.__str__());
      }
      catch(e){
        this.tstate.stdout('key=' + JSON.stringify(key));
      }
      throw new Exceptions.Exception('LOAD_GLOBAL key not defined');
    }
    this.valueStack.push(value);
  }
  //119
  private CONTINUE_LOOP(fw: FileWrapper): void{

  }
  //120
  private SETUP_LOOP(fw: FileWrapper): void{
    var offset = fw.getUInt16();
    this.blockSetup(this,PyFrame,this.last_i + offset,this.valueStack.getLength());
  }
  //121
  private SETUP_EXCEPT(fw: FileWrapper): void{
    this.blockSetup(this,PyFrame,this.last_i + fw.getUInt16(),this.valueStack.getLength());
  }
  //122
  private SETUP_FINALLY(fw: FileWrapper): void{
    this.blockSetup(this,PyFrame,this.last_i + fw.getUInt16(),this.valueStack.getLength());
  }

  //124
  private LOAD_FAST(fw: FileWrapper): void{
    var index: number = fw.getUInt16();
    this.valueStack.push(this.f_localsplus[index]);
  }
  //125
  private STORE_FAST(fw: FileWrapper): void{
    //lines 815-834 of frameobject.c has some info
    //about it views f_localsplus the call to the func
    //is dict_to_map(co->co_varnames, j, f_locals, f_localsplus, 0, clear);
    //edited from line 946
    var value: PyObject = this.valueStack.pop();
    var index: number = fw.getUInt16();
    //console.log('value='+JSON.stringify(value));
    //console.log('index='+index);
    //console.log('co_varnames='+JSON.stringify(this.code.getVarnames()));
    //this is my best guess. I'm not sure if
    //f_localsplus should store the PyObject or
    //point to another data structure that actually
    //stores the PyObject
    this.f_localsplus[index] = value;
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
    for(i = 0; i < posParamCnt; i++){
      var param: PyObject = this.valueStack.pop();
      posParamArray.unshift(param);
    }
    var posParams: PyTuple<PyObject> = new PyTuple<PyObject>(posParamArray);
    var func: PyFunction = <PyFunction> this.valueStack.pop();
    var frame: PyFrame = new PyFrame(func.getCode(), this.tstate);
    //TODO: This should be a temporary hack
    frame.f_localsplus = posParamArray;
    //copy locals of this frame to globals of the one created
    frame.globals = this.locals.shallowCopy();
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
    for(var i: number = 0; i < paramCnt; i++) {
      opargs.push(this.valueStack.pop());
    }
    var func: PyFunction = new PyFunction(codeobj,
      this.globals,
      new PyTuple<PyObject>(opargs));
    this.valueStack.push(func);
  }
}
export = PyFrame;
