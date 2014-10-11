import FileWrapper = require('./FileWrapper');

class StackMachine{
  private oplist: Array<(fw: FileWrapper) => void> = [
  ];
  private stack: Array<any>;
  constructor(){
    this.stack = new Array();
  }
  execute(code: FileWrapper): void{
  }
  private runop(fw: FileWrapper): void{
  }
  private STOP_CODE(fw: FileWrapper): void{
    return;
  }
  private NOP(fw: FileWrapper): void{
    return;
  }
  private POP_TOP(fw: FileWrapper): void{
    this.stack.pop();
  }
  private ROT_TWO(fw: FileWrapper): void{
    this.rot(2);
  }
  private ROT_THREE(fw: FileWrapper): void{
    this.rot(3);
  }
  private ROT_FOUR(fw: FileWrapper): void{
    this.rot(4);
  }
  private DUP_TOP(fw: FileWrapper): void{
    this.stack.push(this.stack[this.stack.length - 1]);
  }
  private UNARY_POSITIVE(fw: FileWrapper): void{
    return;
  }
  private UNARY_NEGATIVE(fw: FileWrapper): void{
    this.stack[this.stack.length - 1] = -this.stack[this.stack.length - 1];
  }
  private rot(n: number): void{
    var len: number = this.stack.length;
    var top: any = this.stack[len - 1];
    for(var i: number = 1; i < n; i++){
      this.stack[len - i] = this.stack[len - i - 1];
    }
    this.stack[len - n] = top;
  }
}
export = StackMachine;
