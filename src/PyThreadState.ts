import PyFrame = require('./PyFrame');
import CodeObject = require('./CodeObject');
import Stack = require('./Stack');

class PyThreadState{

  private current_stack_frame: PyFrame;
  private frameStack: Stack<PyFrame>; //this handles the "linked list" functionality needed by Frame 'back' ptrs; "call stack"

  constructor(code: CodeObject){
    this.current_stack_frame = new PyFrame(code,this);
    this.frameStack = new Stack<PyFrame>();
    this.current_stack_frame.evalFrame();
    /*Recursive execution of frames begins here
     Frames themselves are responsible for pushing/popping off of the frameStack*/
  }

}
export = PyThreadState;