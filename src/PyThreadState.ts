import PyFrame = require('./PyFrame');

class PyThreadState{

  current_stack_frame: PyFrame;
  frameStack: Array<PyFrame>; //this handles the "linked list" functionality needed by Frame 'back' ptrs

  constructor(code: CodeObject){
    this.current_stack_frame = new PyFrame(code,this);
    this.frameStack = new Array<PyFrame>();
    this.current_stack_frame.evalFrame();
    /*Recursive execution of frames begins here
     Frames themselves are responsible for pushing/popping off the frameStack*/
  }

  popFrame(): PyFrame{
    return this.frameStack.pop();
  }

  pushFrame(frame: PyFrame): void {
    this.frameStack.push(frame);
  }

}

export = PyThreadState;