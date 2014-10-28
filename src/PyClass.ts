import PyTuple = require('./PyTuple');
import PyDict = require('./PyDict');

class PyClass{
  private name: string; // class name
  private bases: PyTuple; //parent class(es)
  private dict: PyDict; // methods dictionary

  constructor(name: string, bases: PyTuple, dict: PyDict){
    this.name = name;
    this.bases = bases;
    this.dict = dict;
  }

}
