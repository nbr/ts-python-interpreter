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

function getActualOutput(pathToPyc: string, callback){
    fs.readFile(pathToPyc, function afterRead(err, buffer: NodeBuffer){
        if(err) { throw err; }
        var fw: FileWrapper = new FileWrapperNode(buffer);
        var codeobj: PyObject = MarshalParser.parse(fw);
        actualOutput = codeobj.getValue();
        callback(actualOutput);
    });
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

var testPath = 'test/data/';

var mpPath = testPath + 'marshal-parser/';

var actualOutput;
getActualOutput(mpPath + 'INT.pyc', function executeAssert(actualOutput){
    var expectedOutputInt = expectedOutputs["INT"];
    assert.equal(expectedOutputInt,actualOutput,"Testing type int");
});
actualOutput = "";

getActualOutput(mpPath + 'INT_64.pyc', function executeAssert(actualOutput){
    var expectedOutputInt64 = expectedOutputs["INT_64"];
    assert.equal(expectedOutputInt64,actualOutput,"Testing type int64");
});
actualOutput = "";

getActualOutput(mpPath + 'B_FLOAT.pyc', function executeAssert(actualOutput){
    var expectedOutputBFl = expectedOutputs["B_FLOAT"];
    assert.equal(expectedOutputBFl,actualOutput,"Testing type bfloat");
});
actualOutput = "";

getActualOutput(mpPath + 'LONG.pyc', function executeAssert(actualOutput){
    var expectedOutputLong = expectedOutputs["LONG"];
    assert.equal(expectedOutputLong,actualOutput,"Testing type long");
});
actualOutput = "";

getActualOutput(mpPath + 'STRING.pyc', function executeAssert(actualOutput){
    var expectedOutputStr = expectedOutputs["STRING"];
    assert.equal(expectedOutputStr,actualOutput,"Testing type str");
});
actualOutput = "";

getActualOutput(mpPath + 'UNICODE.pyc', function executeAssert(actualOutput){
    var expectedOutputUnic = expectedOutputs["UNICODE"];
    assert.equal(expectedOutputUnic,actualOutput,"Testing type unic");
});
actualOutput = "";

getActualOutput(mpPath + 'TUPLE.pyc', function executeAssert(actualOutput){
    var expectedOutputTuple = expectedOutputs["TUPLE"];
    assert.equal(expectedOutputTuple,actualOutput,"Testing type tuple");
});
actualOutput = "";

getActualOutput(mpPath + 'LIST.pyc', function executeAssert(actualOutput){
    var expectedOutputList = expectedOutputs["LIST"];
    assert.equal(expectedOutputList,actualOutput,"Testing type list");
});
actualOutput = "";

getActualOutput(mpPath + 'DICT.pyc', function executeAssert(actualOutput){
    var expectedOutputDict = expectedOutputs["DICT"];
    assert.equal(expectedOutputDict,actualOutput,"Testing type dict");
});
actualOutput = "";

getActualOutput(mpPath + 'FROZEN_SET.pyc', function executeAssert(actualOutput){
    var expectedOutputFrzSet = expectedOutputs["FROZEN_SET"];
    assert.equal(expectedOutputFrzSet,actualOutput,"Testing type frzset");
});
actualOutput = "";