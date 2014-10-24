//TODO: optimize imports
import FileWrapper = require('./FileWrapper');
import PyError = require('./PyError');
import PyErrorType = require('./PyErrorType');
import PyObject = require('./PyObject');
import PyCodeObject = require('./PyCodeObject');
import enums = require('./enums');
import PyFrame = require('./PyFrame');
import Exceptions = require('./Exceptions');
import PyThreadState = require('./PyThreadState');
import Stdout = require('./Stdout');

class PyInterpreterState {

  private pyThreadState_current;
  private stdoutObj: Stdout;

  constructor(code: PyCodeObject, stdoutObj: Stdout) {
    this.stdoutObj = stdoutObj;
    this.pyThreadState_current = new PyThreadState(code, this);
  }
  stdout(s: string): void{
    this.stdoutObj.write(s);
  }
}
export = PyInterpreterState;
