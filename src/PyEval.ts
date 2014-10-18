import FileWrapper = require('./FileWrapper');
import PyError = require('./PyError');
import PyErrorType = require('./PyErrorType');
import PyObject = require('./PyObject');
import CodeObject = require('./CodeObject');
import Dict = require('./Dict');
import enums = require('./enums');
import PyFrame = require('./PyFrame');
import Exceptions = require('./Exceptions');

class PyEval {

    private current_stack_frame: PyFrame = new PyFrame;
    private callStack: Array<PyObject>;
    //private codeobj: CodeObject;

    constructor(current_stack_frame: PyFrame) {
        //     (codeobj: CodeObject         )
        //this.codeobj = codeobj;
        this.current_stack_frame = current_stack_frame;
        this.callStack = new Array<PyObject>();
    }

    //modeling on ceval.c : PyEval_EvalFrameEx
    execute():void {
        var code:FileWrapper = this.current_stack_frame.code.getCode().getValue();
        code.seek(0);
        while (code.getOffset() < code.getBufLength()) {
            this.runOp(code);
        }
    }

    //TODO: will fail on unimpl opcodes
    private runOp(fw: FileWrapper):void {
        var opcode: number = fw.getUInt8();
        console.log(opcode);
        //assert(lookupTable[i] != null, "Missing implementation of opcode " + enums.OpList[i]);
        this[enums.OpList[fw.getUInt8()]].call(this, fw);
    }

    private rot(n:number):void {
        var len:number = this.callStack.length;
        var top:any = this.callStack[len - 1];
        for (var i:number = 1; i < n; i++) {
            this.callStack[len - i] = this.callStack[len - i - 1];
        }
        this.callStack[len - n] = top;
    }

    private isPyNum(type: enums.PyType):boolean {
        return (enums.PyType.TYPE_INT <= type && type <= enums.PyType.TYPE_LONG);
    }

    /*Opcodes
    ~= ceval.c ln 1112-2824
    runOp() instead of switch statements*/


    //TODO:type of param?
    //101
    //Credit to Python Innards for Python-syntax version.
    private LOAD_NAME(name: any) {
        var NameError: Exceptions.Exception = new Exceptions.Exception("" + name + "not defined");
        try{
            return this.current_stack_frame.locals;
        }
        catch(NameError){
            try{
                return this.current_stack_frame.globals[name];
            }
            catch(NameError){
                try{
                    return this.current_stack_frame.builtins[name];
                }
                catch(NameError){
                   throw NameError;
                }
            }
        }
    }
    //90
    private STORE_NAME(name: any,value: any){
        this.current_stack_frame.locals[name] = value;
    }

    //TODO: Bypass scope optimization and simply call (LOAD,STORE)_NAME?
    private LOAD_FAST(){}
    private STORE_FAST(){}
    private LOAD_GLOBAL(){}
    private STORE_GLOBAL(){}

    //0
    private STOP_CODE(fw: FileWrapper):void {
        return;
    }

    //1
    private POP_TOP(fw: FileWrapper):void {
        this.callStack.pop();
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
        this.callStack.push(this.callStack[this.callStack.length - 1]);
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
        var v:PyObject = this.callStack.pop();
        if (!this.isPyNum(v.getType())) {
            v = new PyObject(enums.PyType.TYPE_ERROR, new PyError(PyErrorType.TypeError));
        }
        this.callStack.push(v);
    }

    //11
    private UNARY_NEGATIVE(fw:FileWrapper):void {
        var v:PyObject = this.callStack.pop();
        if (!this.isPyNum(v.getType())) {
            v = new PyObject(enums.PyType.TYPE_ERROR, new PyError(PyErrorType.TypeError));
        }
        else {
            v = new PyObject(v.getType(), -1 * v.getValue());
        }
        this.callStack.push(v);
    }

    //12
    private UNARY_NOT(fw:FileWrapper):void {
        var v:PyObject = this.callStack.pop();
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
        this.callStack.push(p);
    }

    //100
    private LOAD_CONST(fw:FileWrapper):void {
        var index:number = this.getArg(fw);
        this.callStack.push(this.current_stack_frame.code.getConst(index));
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
export = PyEval;
