import Stdout = require('./Stdout');

class StdoutConsole implements Stdout{
  constructor(){
  }
  write(s: string): void{
    if(s == null){
      process.stdout.write('\n');
    }
    else{
      process.stdout.write(s+'\n');
    }
  }
}

export = StdoutConsole;
