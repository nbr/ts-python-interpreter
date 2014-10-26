import enums = require('./enums');

class PyObject{
  private type: enums.PyType;
  //private value: any;
  /*
  constructor(type: enums.PyType, value: any){
    this.type = type;
    this.value = value;
  }
  */
  constructor(type: enums.PyType){
    this.type = type;
  }
  getType(): enums.PyType{
    return this.type;
  }
  __str__(): string{
    //TODO: fix with Exception
    throw "__str__ not implemented";
  }

  getValue(): any{
    //TODO: fix with Exception
    throw "getValue not implemented";
  }
  __cmp__(cmpidx: number, comparee: PyObject): boolean{
    //TODO: fix with Exception
    throw "cmp not implemented";
  }

//  __cmp__(cmpidx: number, comparee: PyObject): boolean{
//    var type = enums.PyType[this.getType()];
//    var exp = enums.Cmp[cmpidx];
//    if(type != enums.PyType[comparee.getType()]){ throw "type mismatch"; }
//
////    if(type == "TYPE_INT"){
////     return this.int_compare(exp,this.getValue(),comparee.getValue());
////    }
////    else if(type == "TYPE_STRING"){
////      return this.string_compare(exp,this.getValue(),comparee.getValue());
////    }
////    else{
////      throw "not defined for comparison yet";
////    }
//  }

  /*
  getValue(): any{
    return this.value;
  }
  */
}

export = PyObject;
