import PyFrame = require('./PyFrame');

class PyThreadState{

    current_stack_frame: PyFrame;
    frameStack: Array<PyFrame>;

    constructor(current_stack_frame: PyFrame){
        this.current_stack_frame = current_stack_frame;
        this.current_stack_frame.tstate = this;
    }

    popFrame(): PyFrame{
        return this.frameStack.pop();
    }

    pushFrame(frame: PyFrame): void {
        this.frameStack.push(frame);
    }

}

export = PyThreadState;