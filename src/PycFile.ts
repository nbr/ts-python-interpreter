import PyCodeObject = require('./PyCodeObject');
import PyEval = require('./PyInterpreterState')

class PycFile{
  //thanks to http://nedbatchelder.com/blog/200804/the_structure_of_pyc_files.html
  //Python pyc file fields
  private magicno: any; //type?
  private modtime: Date;
  private codeobj: PyCodeObject;

  constructor(magicno: any, modtime: Date, codeobj: PyCodeObject){
    this.magicno = magicno;
    this.modtime = modtime;
    this.codeobj = codeobj;
  }
  stringify(): string{
    return JSON.stringify(this, null, 2);
  }
  getCodeobj(): PyCodeObject{
    return this.codeobj;
  }
}

export = PycFile;
