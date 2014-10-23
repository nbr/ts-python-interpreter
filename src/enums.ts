/*
 Refactoring per enum tip by @jvilk
 */

export enum PyType{
  TYPE_NULL = 0,
  TYPE_NONE = 1,
  TYPE_FALSE = 2,
  TYPE_TRUE = 3,
  TYPE_STOPITER = 4,
  TYPE_ELLIPSIS = 5,
  TYPE_INT = 6,
  TYPE_INT64 = 7,
  TYPE_FLOAT = 8,
  TYPE_BINARY_FLOAT = 9,
  TYPE_COMPLEX = 10,
  TYPE_BINARY_COMPLEX = 11,
  TYPE_LONG = 12,
  TYPE_STRING = 13,
  TYPE_INTERNED = 14,
  TYPE_STRINGREF = 15,
  TYPE_UNICODE = 16,
  TYPE_TUPLE = 17,
  TYPE_LIST = 18,
  TYPE_DICT = 19,
  TYPE_FROZENSET = 20,
  TYPE_CODE = 21,

  //added
  TYPE_FUNCTION = 22,
  TYPE_ERROR = 23
}

export enum PyErrorType{
  TypeError
}

export enum OpList {
  STOP_CODE = 0,
  POP_TOP = 1,
  ROT_TWO = 2,
  ROT_THREE = 3,
  DUP_TOP = 4,
  ROT_FOUR = 5,
  NOP = 9,
  //UNARY_POSITIVE = 10,
  //UNARY_NEGATIVE = 11,
  //UNARY_NOT = 12,
  STORE_NAME = 90,
  LOAD_CONST = 100,
  LOAD_NAME = 101,
  MAKE_FUNCTION = 132
}
