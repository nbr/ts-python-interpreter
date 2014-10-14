/// <reference path="../lib/qunit.d.ts" />
/// <reference path="../lib/node.d.ts" />

import assert = require('assert');
import fs = require('fs');

import Tuple = require('../src/Tuple');
import List = require('../src/List');
import Dict = require('../src/Dict');
import Frozenset = require('../src/Frozenset');
import FileWrapperNode = require('../src/FileWrapperNode');
import MarshalParser = require('../src/MarshalParser');
import PyObject = require('../src/PyObject');
import FileWrapper = require('../src/FileWrapper');

function getActualOutput(pathToPyc: string): any{
    var actualOutput = "";
    fs.readFile(pathToPyc, function afterRead(err, buffer: NodeBuffer){
        if(err) { throw err; }
        var fw: FileWrapper = new FileWrapperNode(buffer);
        var codeobj: PyObject = MarshalParser.parse(fw);
        actualOutput = codeobj.getValue();
    });
    return actualOutput;
}

//http://buildingonmud.blogspot.com/2009/06/
function toUnicode(theString: String) {
    var unicodeString = '';
    for (var i=0; i < theString.length; i++) {
        var theUnicode = theString.charCodeAt(i).toString(16).toUpperCase();
        while (theUnicode.length < 4) {
            theUnicode = '0' + theUnicode;
        }
        theUnicode = '\\u' + theUnicode;
        unicodeString += theUnicode;
    }
    return unicodeString;
}

var expectedOutputs = new Array();

expectedOutputs["INT"] = 3;
expectedOutputs["INT_64"] = 9392468011745350111;
expectedOutputs["B_FLOAT"] = 0.125;
expectedOutputs["LONG"] = 9223372036854775808;
expectedOutputs["STRING"] = "racecar";
expectedOutputs["UNICODE"] = toUnicode(expectedOutputs["STRING"]);
expectedOutputs["TUPLE"] = new Tuple([expectedOutputs["STRING"],expectedOutputs["INT"]]);
expectedOutputs["LIST"] = new List([expectedOutputs["B_FLOAT"],expectedOutputs["LONG"]]);
var d = new Dict({});
d.putItem("str",expectedOutputs["STRING"]);
d.putItem("fl",expectedOutputs["FLOAT"]);
d.putItem("tu",expectedOutputs["TUPLE"]);
expectedOutputs["DICT"] = d;
expectedOutputs["FROZEN_SET"] = new Frozenset(["a"]);

var testPath = "data/";

var mpPath = testPath + "marshal-parser/";

var expectedOutput = "";
var actualOutput = "";

expectedOutput = expectedOutputs["INT"];
actualOutput = getActualOutput(mpPath + "INT.pyc");
console.log("act:");
console.log(actualOutput);
console.log("exp:");
console.log(expectedOutput);
assert.equal(expectedOutput,actualOutput,"Testing type int");

expectedOutput = expectedOutputs["INT_64"];
actualOutput = getActualOutput(mpPath + "INT_64.pyc");
assert.equal(expectedOutput,actualOutput,"Testing type int64");

expectedOutput = expectedOutputs["B_FLOAT"];
actualOutput = getActualOutput(mpPath + "B_FLOAT.pyc");
assert.equal(expectedOutput,actualOutput,"Testing type bfloat");

expectedOutput = expectedOutputs["LONG"];
actualOutput = getActualOutput(mpPath + "LONG.pyc");
assert.equal(expectedOutput,actualOutput,"Testing type long");

expectedOutput = expectedOutputs["STRING"];
actualOutput = getActualOutput(mpPath + "STRING.pyc");
assert.equal(expectedOutput,actualOutput,"Testing type str");

expectedOutput = expectedOutputs["UNICODE"];
actualOutput = getActualOutput(mpPath + "UNICODE.pyc");
assert.equal(expectedOutput,actualOutput,"Testing type unic");

expectedOutput = expectedOutputs["TUPLE"];
actualOutput = getActualOutput(mpPath + "TUPLE.pyc");
assert.equal(expectedOutput,actualOutput,"Testing type tuple");

expectedOutput = expectedOutputs["LIST"];
actualOutput = getActualOutput(mpPath + "LIST.pyc");
assert.equal(expectedOutput,actualOutput,"Testing type list");

expectedOutput = expectedOutputs["DICT"];
actualOutput = getActualOutput(mpPath + "DICT.pyc");
assert.equal(expectedOutput,actualOutput,"Testing type dict");

expectedOutput = expectedOutputs["FROZEN_SET"];
actualOutput = getActualOutput(mpPath + "FROZEN_SET.pyc");
assert.equal(expectedOutput,actualOutput,"Testing type fset");