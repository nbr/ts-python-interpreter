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

class PyInterpreterState {

  private pyThreadState_current;

  constructor(code: PyCodeObject) {
    this.pyThreadState_current = new PyThreadState(code);
  }
}
export = PyInterpreterState;
