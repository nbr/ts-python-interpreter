import Dict = require('./Dict');
import CodeObject = require('./CodeObject');
import PyObject = require('./PyObject');
import PyThreadState = require('./PyThreadState');

class PyFrame {

    back: PyFrame; //previous frame or null
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

    //Access only push/pop
    valueStack: Array<PyObject>;
    blockStack: Array<PyObject>; //TODO:PyTryBlock class

    //use as associative arrays
    locals: Array<PyObject>; //local variables
    globals: Array<PyObject>; //global variables
    builtins: Array<PyObject>; //builtin variables

    constructor(code: CodeObject, back: PyFrame){
        this.locals = [];
        this.globals = [];
        this.builtins = [];
        this.code = code;
        this.back = back;
        this.last_i = -1;
    }
}
export = PyFrame;