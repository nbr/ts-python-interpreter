import FileWrapper = require('./FileWrapper');
import PyError = require('./PyError');
import PyErrorType = require('./PyErrorType');
import PyType = require('./PyType');
import PyObject = require('./PyObject');
import CodeObject = require('./CodeObject');

class StackMachine{
  private static pyNumTypes: PyType[] = [
    PyType.TYPE_INT,
    PyType.TYPE_INT64,
    PyType.TYPE_FLOAT,
    PyType.TYPE_BINARY_FLOAT,
    PyType.TYPE_COMPLEX,
    PyType.TYPE_BINARY_COMPLEX,
    PyType.TYPE_LONG
  ];
  private oplist: Array<(fw: FileWrapper) => void> = [
    this.STOP_CODE,                     //0
    this.POP_TOP,                       //1
    this.ROT_TWO,                       //2
    this.ROT_THREE,                     //3
    this.DUP_TOP,                       //4
    this.ROT_FOUR,                      //5
    undefined,                          //6
    undefined,                          //7
    undefined,                          //8
    this.NOP,                           //9
    this.UNARY_POSITIVE,                //10
    this.UNARY_NEGATIVE,                //11
    this.UNARY_NOT,                     //12
    undefined,                          //13
    undefined,                          //14
    undefined,                          //15
    undefined,                          //16
    undefined,                          //17
    undefined,                          //18
    undefined,                          //19
    undefined,                          //20
    undefined,                          //21
    undefined,                          //22
    undefined,                          //23
    undefined,                          //24
    undefined,                          //25
    undefined,                          //26
    undefined,                          //27
    undefined,                          //28
    undefined,                          //29
    undefined,                          //30
    undefined,                          //31
    undefined,                          //32
    undefined,                          //33
    undefined,                          //34
    undefined,                          //35
    undefined,                          //36
    undefined,                          //37
    undefined,                          //38
    undefined,                          //39
    undefined,                          //40
    undefined,                          //41
    undefined,                          //42
    undefined,                          //43
    undefined,                          //44
    undefined,                          //45
    undefined,                          //46
    undefined,                          //47
    undefined,                          //48
    undefined,                          //49
    undefined,                          //50
    undefined,                          //51
    undefined,                          //52
    undefined,                          //53
    undefined,                          //54
    undefined,                          //55
    undefined,                          //56
    undefined,                          //57
    undefined,                          //58
    undefined,                          //59
    undefined,                          //60
    undefined,                          //61
    undefined,                          //62
    undefined,                          //63
    undefined,                          //64
    undefined,                          //65
    undefined,                          //66
    undefined,                          //67
    undefined,                          //68
    undefined,                          //69
    undefined,                          //70
    undefined,                          //71
    undefined,                          //72
    undefined,                          //73
    undefined,                          //74
    undefined,                          //75
    undefined,                          //76
    undefined,                          //77
    undefined,                          //78
    undefined,                          //79
    undefined,                          //80
    undefined,                          //81
    undefined,                          //82
    undefined,                          //83
    undefined,                          //84
    undefined,                          //85
    undefined,                          //86
    undefined,                          //87
    undefined,                          //88
    undefined,                          //89
    undefined,                          //90
    undefined,                          //91
    undefined,                          //92
    undefined,                          //93
    undefined,                          //94
    undefined,                          //95
    undefined,                          //96
    undefined,                          //97
    undefined,                          //98
    undefined,                          //99
    this.LOAD_CONST,                    //100
    undefined,                          //101
    undefined,                          //102
    undefined,                          //103
    undefined,                          //104
    undefined,                          //105
    undefined,                          //106
    undefined,                          //107
    undefined,                          //108
    undefined,                          //109
    undefined,                          //110
    undefined,                          //111
    undefined,                          //112
    this.MAKE_FUNCTION,                 //113
    undefined,                          //114
    undefined,                          //115
    undefined,                          //116
    undefined,                          //117
    undefined,                          //118
    undefined,                          //119
    undefined,                          //120
    undefined,                          //121
    undefined,                          //122
    undefined,                          //123
    undefined,                          //124
    undefined,                          //125
    undefined,                          //126
    undefined,                          //127
    undefined,                          //128
    undefined,                          //129
    undefined,                          //130
    undefined,                          //131
    undefined,                          //132
    undefined,                          //133
    undefined,                          //134
    undefined,                          //135
    undefined,                          //136
    undefined,                          //137
    undefined,                          //138
    undefined,                          //139
    undefined,                          //140
    undefined,                          //141
    undefined,                          //142
    undefined,                          //143
    undefined,                          //144
    undefined,                          //145
    undefined,                          //146
    undefined,                          //147
    undefined,                          //148
    undefined,                          //149
    undefined,                          //150
    undefined,                          //151
    undefined,                          //152
    undefined,                          //153
    undefined,                          //154
    undefined,                          //155
    undefined,                          //156
    undefined,                          //157
    undefined,                          //158
    undefined,                          //159
    undefined,                          //160
    undefined,                          //161
    undefined,                          //162
    undefined,                          //163
    undefined,                          //164
    undefined,                          //165
    undefined,                          //166
    undefined,                          //167
    undefined,                          //168
    undefined,                          //169
    undefined,                          //170
    undefined,                          //171
    undefined,                          //172
    undefined,                          //173
    undefined,                          //174
    undefined,                          //175
    undefined,                          //176
    undefined,                          //177
    undefined,                          //178
    undefined,                          //179
    undefined,                          //180
    undefined,                          //181
    undefined,                          //182
    undefined,                          //183
    undefined,                          //184
    undefined,                          //185
    undefined,                          //186
    undefined,                          //187
    undefined,                          //188
    undefined,                          //189
    undefined,                          //190
    undefined,                          //191
    undefined,                          //192
    undefined,                          //193
    undefined,                          //194
    undefined,                          //195
    undefined,                          //196
    undefined,                          //197
    undefined,                          //198
    undefined,                          //199
    undefined,                          //200
    undefined,                          //201
    undefined,                          //202
    undefined,                          //203
    undefined,                          //204
    undefined,                          //205
    undefined,                          //206
    undefined,                          //207
    undefined,                          //208
    undefined,                          //209
    undefined,                          //210
    undefined,                          //211
    undefined,                          //212
    undefined,                          //213
    undefined,                          //214
    undefined,                          //215
    undefined,                          //216
    undefined,                          //217
    undefined,                          //218
    undefined,                          //219
    undefined,                          //220
    undefined,                          //221
    undefined,                          //222
    undefined,                          //223
    undefined,                          //224
    undefined,                          //225
    undefined,                          //226
    undefined,                          //227
    undefined,                          //228
    undefined,                          //229
    undefined,                          //230
    undefined,                          //231
    undefined,                          //232
    undefined,                          //233
    undefined,                          //234
    undefined,                          //235
    undefined,                          //236
    undefined,                          //237
    undefined,                          //238
    undefined,                          //239
    undefined,                          //240
    undefined,                          //241
    undefined,                          //242
    undefined,                          //243
    undefined,                          //244
    undefined,                          //245
    undefined,                          //246
    undefined,                          //247
    undefined,                          //248
    undefined,                          //249
    undefined,                          //250
    undefined,                          //251
    undefined,                          //252
    undefined,                          //253
    undefined                           //254
  ];
  private stack: Array<PyObject>;
  private codeobj: CodeObject;

  constructor(codeobj: CodeObject){
    this.codeobj = codeobj;
    this.stack = new Array<PyObject>();
  }
  execute(): void{
    var code: FileWrapper = this.codeobj.getCode().getValue();
    code.seek(0);
    while(code.getOffset() < code.getBufLength()){
      this.runop(code);
    }
  }
  private runop(fw: FileWrapper): void{
    var opcode: number = fw.getUInt8();
    console.log(opcode);
    this.oplist[opcode].call(this, fw);
  }
  //0
  private STOP_CODE(fw: FileWrapper): void{
    return;
  }
  //1
  private POP_TOP(fw: FileWrapper): void{
    this.stack.pop();
  }
  //2
  private ROT_TWO(fw: FileWrapper): void{
    this.rot(2);
  }
  //3
  private ROT_THREE(fw: FileWrapper): void{
    this.rot(3);
  }
  //4
  private DUP_TOP(fw: FileWrapper): void{
    this.stack.push(this.stack[this.stack.length - 1]);
  }
  //5
  private ROT_FOUR(fw: FileWrapper): void{
    this.rot(4);
  }
  //9
  private NOP(fw: FileWrapper): void{
    return;
  }
  //10
  private UNARY_POSITIVE(fw: FileWrapper): void{
    var v: PyObject = this.stack.pop();
    if(!this.isPyNum(v.getType())){
      v = new PyObject(PyType.TYPE_ERROR, new PyError(PyErrorType.TypeError));
    }
    this.stack.push(v);
  }
  //11
  private UNARY_NEGATIVE(fw: FileWrapper): void{
    var v: PyObject = this.stack.pop();
    if(!this.isPyNum(v.getType())){
      v = new PyObject(PyType.TYPE_ERROR, new PyError(PyErrorType.TypeError));
    }
    else{
      v = new PyObject(v.getType(), -1 * v.getValue()); 
    }
    this.stack.push(v);
  }
  //12
  private UNARY_NOT(fw: FileWrapper): void{
    var v: PyObject = this.stack.pop();
    var b: boolean;
    switch(v.getType()){
      case PyType.TYPE_NULL:
        throw 'TYPE_NULL on UNARY_NOT';
        return;
      case PyType.TYPE_NONE:
      case PyType.TYPE_FALSE:
        b = true;
        break;
      case PyType.TYPE_TRUE:
        b = false;
        break;
      case PyType.TYPE_STOPITER:
        throw 'TYPE_STOPITER on UNARY_NOT';
      case PyType.TYPE_ELLIPSIS:
        throw 'TYPE_ELLIPSIS on UNARY_NOT';
      case PyType.TYPE_INT:
      case PyType.TYPE_INT64:
      case PyType.TYPE_FLOAT:
      case PyType.TYPE_BINARY_FLOAT:
      case PyType.TYPE_COMPLEX:
      case PyType.TYPE_BINARY_COMPLEX:
      case PyType.TYPE_LONG:
        if(v.getValue() === 0){
          b = true;
          break;
        }
        b = false;
        break;
      case PyType.TYPE_STRING:
      case PyType.TYPE_INTERNED:
        if(v.getValue().getBufLength() === 0){
          b = true;
          break;
        }
        b = false;
        break;
      case PyType.TYPE_STRINGREF:
        //need to dereference string
        throw 'TYPE_STRINGREF on UNARY_NOT';
      case PyType.TYPE_UNICODE:
        if(v.getValue().length === 0){
          b = true;
          break;
        }
        b = false;
        break;
      case PyType.TYPE_TUPLE:
      case PyType.TYPE_LIST:
      case PyType.TYPE_DICT:
      case PyType.TYPE_FROZENSET:
        if(v.getValue().getLength() === 0){
          b = true;
          break;
        }
        b = false;
        break;
      case PyType.TYPE_CODE:
      case PyType.TYPE_ERROR:
        //https://docs.python.org/2/library/stdtypes.html#typesnumeric
        //this probably is not be correct
        b = false;
        break;
    }
    var p: PyObject;
    if(b){
      p = new PyObject(PyType.TYPE_TRUE, undefined);
    }
    else{
      p = new PyObject(PyType.TYPE_FALSE, undefined);
    }
    this.stack.push(p);
  }
  //100
  private LOAD_CONST(fw: FileWrapper): void{
    var index: number = this.getArg(fw);
    this.stack.push(this.codeobj.getConst(index));
  }
  //132
  private MAKE_FUNCTION(fw: FileWrapper): void{
  }
  private getArg(fw: FileWrapper): number{
    return fw.getUInt16();
  }
  private rot(n: number): void{
    var len: number = this.stack.length;
    var top: any = this.stack[len - 1];
    for(var i: number = 1; i < n; i++){
      this.stack[len - i] = this.stack[len - i - 1];
    }
    this.stack[len - n] = top;
  }
  private isPyNum(type: PyType): boolean{
    return StackMachine.pyNumTypes.some(function(item, index, array){
      return (type === item);
    });
  }
}
export = StackMachine;
