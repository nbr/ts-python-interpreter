
class PyTryBlock {
  private type; /* what kind of block this is */
  private handler; /* where to jump to find handler */
  private level; /* value stack level to pop to */

  constructor(type, handler: number, level: number){
    this.type = type;
    this.handler = handler;
    this.level = level;
  }

}

export = PyTryBlock;