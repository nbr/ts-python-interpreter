import Dict = require('./Dict');
import CodeObject = require('./CodeObject');
import PyObject = require('./PyObject');

class PyFrame {

    back: PyFrame; //previous frame or null
    code: CodeObject;

    //TODO: trace: PyObject; ?
    f_exc_type: PyObject;
    f_exc_value: PyObject;
    f_exc_traceback: PyObject;

    //f_tstate: PyThreadState;
    f_lasti: number;
    f_lineno: number;
    f_iblock: number;

    f_localsplus: Array<any>; //locals+cells+free_var+valstack
    //i.e. co_nlocals,co_cellvars,co_freevars,co_stacksize

    //Access only push/pop
    valueStack: Array<PyObject>;
    blockStack: Array<PyObject>; //TODO:PyTryBlock

    //use as associative arrays
    locals: Array<string>; //local variables
    globals: Array<string>; //global variables
    builtins: Array<string>; //builtin variables

    //TODO: PyFrame constructor
    constructor(){
        this.locals = [];
        this.globals = [];
        this.builtins = [];
    }
}
export = PyFrame;