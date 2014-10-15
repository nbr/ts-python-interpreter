import marshal, struct,sys #, py_compile

# this script generates expected outputs for unit tests
# of MarshalParser.ts, in the format:
# data/[module]/[function_under_test]
# ex: data/marshal-parser/typeInt.pyc

PATH = "data/marshal-parser/"
#inputs
INT = 3
INT_64 = sys.maxint #9392468011745350111L
#FLOAT: uint8
B_FLOAT = 0.125
#COMPLEX : uint8 real, uint8 imaginary
B_COMPLEX = complex(3.0,5.0)
LONG = 9392468011745350111L #sys.maxint + 1 #use max(int) to find first long
STRING = "racecar"
#STRING_REF = id(STRING) #this may not be correct
UNICODE = STRING.decode(encoding='UTF-8')
TUPLE = tuple([STRING,INT])
LIST = [B_FLOAT,LONG]
DICT = dict(one=STRING,two=B_FLOAT,three=TUPLE)
FROZEN_SET = frozenset("a")

inputs = {"INT":INT,"INT_64":INT_64,"B_FLOAT":B_FLOAT,"B_COMPLEX":B_COMPLEX,
	"LONG":LONG,"STRING":STRING,"UNICODE":UNICODE,
	"TUPLE":TUPLE,"LIST":LIST,"DICT":DICT,"FROZEN_SET":FROZEN_SET}

for i in inputs:
	fo = open(PATH+i+".pyc","wb")
	fo.write(marshal.dumps(inputs[i]))
	fo.close()

#@TODO(Nick): for testing on more realistic pycs
#py_compile.compile('pyc_for_integration_tests');
#Code object should be tested under integration
