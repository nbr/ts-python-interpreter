import Stdout = require('./Stdout');

class StdoutBrowser implements Stdout{
  private s: string;
  constructor(){
    this.s = '';
  }
  write(s: string): void{
    if(s.slice(-1) === '\n'){
      s = this.s + s;
      this.s = '';
      console.log(s);
      return;
    }
    this.s += s;
  }
}

export = StdoutBrowser;
