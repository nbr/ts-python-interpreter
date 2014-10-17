import FileWrapper = require('./FileWrapper');
import PyError = require('./PyError');
import PyErrorType = require('./PyErrorType');
import PyObject = require('./PyObject');
import CodeObject = require('./CodeObject');
import Dict = require('./Dict');
import enums = require('./enums');

class StackMachine {

    private stack:Array<PyObject>;
    private codeobj:CodeObject;
    private globals:Dict;
    //private lookupTable: Array;

    constructor(codeobj:CodeObject) {
        this.codeobj = codeobj;
        this.stack = new Array<PyObject>();
        //this.lookupTable = this.enumToArray();
    }

    /*
     function enum-to-array
     put result into global lookup table
     Array size 255 = 0xff per # of opcodes
     Will fail assertion for unimplemented opcodes
        (10/15: commenting since opcodes are incomplete)
     _Credit to @jvilk for suggesting this refactoring and referencing similar function from Doppio src/opcodes.ts_
     */
    /*
    enumToArray(): Array{
        var lookupTable = new Array(255);
        for (var i = 0; i < 255; i++) {
            if (enums.OpList.hasOwnProperty("" + i)) {
                lookupTable[i] = enums.OpList[i].toLowerCase();
                //assert(lookupTable[i] != null, "Missing implementation of opcode " + enums.OpList[i]);
            }
        }
        return lookupTable;
    }
    */

    execute():void {
        var code:FileWrapper = this.codeobj.getCode().getValue();
        code.seek(0);
        while (code.getOffset() < code.getBufLength()) {
            this.runop(code);
        }
    }

    private runop(fw:FileWrapper):void {
        var opcode:number = fw.getUInt8();
        console.log(opcode);
        //this.lookupTable[opcode].call(this, fw);
        this[enums.OpList[fw.getUInt8()]].call(this,fw);
    }

    //0
    private STOP_CODE(fw:FileWrapper):void {
        return;
    }

    //1
    private POP_TOP(fw:FileWrapper):void {
        this.stack.pop();
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
        this.stack.push(this.stack[this.stack.length - 1]);
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
        var v:PyObject = this.stack.pop();
        if (!this.isPyNum(v.getType())) {
            v = new PyObject(enums.PyType.TYPE_ERROR, new PyError(PyErrorType.TypeError));
        }
        this.stack.push(v);
    }

    //11
    private UNARY_NEGATIVE(fw:FileWrapper):void {
        var v:PyObject = this.stack.pop();
        if (!this.isPyNum(v.getType())) {
            v = new PyObject(enums.PyType.TYPE_ERROR, new PyError(PyErrorType.TypeError));
        }
        else {
            v = new PyObject(v.getType(), -1 * v.getValue());
        }
        this.stack.push(v);
    }

    //12
    private UNARY_NOT(fw:FileWrapper):void {
        var v:PyObject = this.stack.pop();
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
        this.stack.push(p);
    }

    //100
    private LOAD_CONST(fw:FileWrapper):void {
        var index:number = this.getArg(fw);
        this.stack.push(this.codeobj.getConst(index));
    }

    //132
    private MAKE_FUNCTION(fw:FileWrapper):void {
        var paramCnt:number = this.getArg(fw);
        console.log(paramCnt);
    }

    private getArg(fw:FileWrapper):number {
        return fw.getUInt16();
    }

    private rot(n:number):void {
        var len:number = this.stack.length;
        var top:any = this.stack[len - 1];
        for (var i:number = 1; i < n; i++) {
            this.stack[len - i] = this.stack[len - i - 1];
        }
        this.stack[len - n] = top;
    }

    private isPyNum(type: enums.PyType):boolean {
      return (enums.PyType.TYPE_INT <= type && type <= enums.PyType.TYPE_LONG);
    }
}
export = StackMachine;
