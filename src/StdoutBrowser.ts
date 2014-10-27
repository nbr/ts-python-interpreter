import Stdout = require('./Stdout');

class StdoutBrowser implements Stdout{
  constructor(){
  }
  write(s: string): void{
    console.log(s);
  }
}

export = StdoutBrowser;
