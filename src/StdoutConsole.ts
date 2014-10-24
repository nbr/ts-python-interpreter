import Stdout = require('./Stdout');

class StdoutConsole implements Stdout{
  constructor(){
  }
  write(s: string): void{
    console.log(s);
  }
}

export = StdoutConsole;
