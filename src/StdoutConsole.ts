import Stdout = require('./Stdout');

class StdoutConsole implements Stdout{
  constructor(){
  }
  write(s: string): void{
    process.stdout.write(s);
  }
}

export = StdoutConsole;
