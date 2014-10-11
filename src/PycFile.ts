import CodeObject = require('./CodeObject');
import PyObject = require('./PyObject');

class PycFile{
  //thanks to http://nedbatchelder.com/blog/200804/the_structure_of_pyc_files.html
  //Python pyc file fields
  private magicno: any; //type?
  private modtime: Date;
  private codeobj: PyObject;

  constructor(magicno: any, modtime: Date, codeobj: PyObject){
    this.magicno = magicno;
    this.modtime = modtime;
    this.codeobj = codeobj;
  }
  interpret(){
    this.codeobj.getValue().execute();
  }
  stringify(): string{
    return JSON.stringify(this);
  }
}

export = PycFile;
