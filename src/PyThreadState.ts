import PyFrame = require('./PyFrame');
import PyCodeObject = require('./PyCodeObject');
import Stack = require('./Stack');
import PyInterpreterState = require('PyInterpreterState');

class PyThreadState{

  private current_stack_frame: PyFrame;
  private frameStack: Stack<PyFrame>; //this handles the "linked list" functionality needed by Frame 'back' ptrs; "call stack"
  private interpreter: PyInterpreterState;

  constructor(code: PyCodeObject, interpreter: PyInterpreterState){
    this.interpreter = interpreter;
    this.current_stack_frame = new PyFrame(code, this);
    this.frameStack = new Stack<PyFrame>();
    this.current_stack_frame.evalFrame();
    /*Recursive execution of frames begins here
     Frames themselves are responsible for pushing/popping off of the frameStack*/
  }
  frameStackPush(frame: PyFrame): void{
    this.frameStack.push(frame);
  }
  frameStackPop(): PyFrame{
    return this.frameStack.pop();
  }
  stdout(s: string): void{
    this.interpreter.stdout(s);
  }
}
export = PyThreadState;
