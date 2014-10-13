/// <reference path="../lib/qunit.d.ts" />

import fs = require('fs');
import Tuple = require('../src/Tuple');
import List = require('../src/List');
import Dict = require('../src/Dict');
import Frozenset = require('../src/Frozenset');
import FileWrapperNode = require('../src/FileWrapperNode');
import MarshalParser = require('../src/MarshalParser');
import PyObject = require('../src/PyObject');
import FileWrapper = require('../src/FileWrapper');

/*function getActualOutput(pathToPyc: string): any{
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
}*/


var expectedOutputs = new Array();

expectedOutputs["INT"] = 3;
expectedOutputs["INT_64"] = 9392468011745350111;
expectedOutputs["B_FLOAT"] = 0.125;
expectedOutputs["LONG"] = 9223372036854775808;
expectedOutputs["STRING"] = "racecar";
//expectedOutputs["UNICODE"] = toUnicode(expectedOutputs["STRING"]);
expectedOutputs["TUPLE"] = new Tuple([expectedOutputs["STRING"],expectedOutputs["INT"]]);
expectedOutputs["LIST"] = new List([expectedOutputs["B_FLOAT"],expectedOutputs["LONG"]]);
/*d = new Dict();
 d = Dict.putItem("str",expectedOutputs["STRING"]);
 d = Dict.putItem("fl",expectedOutputs["FLOAT"]);
 d = Dict.putItem("tu",expectedOutputs["TUPLE"]);
 expectedOutputs["DICT"] = d;*/
expectedOutputs["FROZEN_SET"] = new Frozenset(["a"]);

var testPath = "data/";

QUnit.module("MarshalParser");

var mpPath = testPath + "module_marshal-parser/";

QUnit.test("a test", function () {
    QUnit.equal(1, "1", "String '1' and number 1 have the same value");
});

/*

test( "typeInt", function() {
    var expectedOutput = expectedOutputs["INT"];
    var actualOutput = getActualOutput(mpPath + "INT.pyc");
    equal(expectedOutput,actualOutput,"int test");
});

QUnit.test( "typeInt64", function( assert ) {
    var expectedOutput = expectedOutputs["INT_64"];
    var actualOutput = getActualOutput(mpPath + "INT_64.pyc");
    assert.equal(expectedOutput,actualOutput,"");
});

*/
/*test( "typeFloat", function( assert ) {
 var value = "hello";
 assert.equal( value, "hello", "We expect value to be hello" );
 });*//*


QUnit.test( "typeB_Float", function( assert ) {
    var expectedOutput = expectedOutputs["B_FLOAT"];
    var actualOutput = getActualOutput(mpPath + "B_FLOAT.pyc");
    assert.equal(expectedOutput,actualOutput,"");
});

*/
/*test( "typeComplex", function( assert ) {
 var value = "hello";
 assert.equal( value, "hello", "We expect value to be hello" );
 });*//*


*/
/*test( "typeBinaryComplex", function( assert ) {
 var value = "hello";
 assert.equal( value, "hello", "We expect value to be hello" );
 });*//*


QUnit.test( "typeLong", function( assert ) {
    var expectedOutput = expectedOutputs["LONG"];
    var actualOutput = getActualOutput(mpPath + "LONG.pyc");
    assert.equal(expectedOutput,actualOutput,"");
});

QUnit.test( "typeString", function( assert ) {
    var expectedOutput = expectedOutputs["STRING"];
    var actualOutput = getActualOutput(mpPath + "STRING.pyc");
    assert.equal(expectedOutput,actualOutput,"");
});

*/
/*test( "typeInterned", function( assert ) {
 var value = "hello";
 assert.equal( value, "hello", "We expect value to be hello" );
 });*//*


*/
/*test( "typeStringref", function( assert ) {
 var value = "hello";
 assert.equal( value, "hello", "We expect value to be hello" );
 });*//*



QUnit.test( "typeUnicode", function( assert ) {
    var expectedOutput = expectedOutputs["UNICODE"];
    var actualOutput = getActualOutput(mpPath + "UNICODE.pyc");
    assert.equal(expectedOutput,actualOutput,"");
});

QUnit.test( "typeTuple", function( assert ) {
    var expectedOutput = expectedOutputs["TUPLE"];
    var actualOutput = getActualOutput(mpPath + "TUPLE.pyc");
    assert.equal(expectedOutput,actualOutput,"");
});

QUnit.test( "typeList", function( assert ) {
    var expectedOutput = expectedOutputs["LIST"];
    var actualOutput = getActualOutput(mpPath + "LIST.pyc");
    assert.equal(expectedOutput,actualOutput,"");
});

QUnit.test( "typeDict", function( assert ) {
    var expectedOutput = expectedOutputs["DICT"];
    var actualOutput = getActualOutput(mpPath + "DICT.pyc");
    assert.equal(expectedOutput,actualOutput,"");
});

QUnit.test( "typeFrozenset", function( assert ) {
    var expectedOutput = expectedOutputs["FROZEN_SET"];
    var actualOutput = getActualOutput(mpPath + "FROZEN_SET.pyc");
    assert.equal(expectedOutput,actualOutput,"");
});

*/
/*
 test( "typeCodeObject", function( assert ) {
 var value = "hello";
 assert.equal( value, "hello", "We expect value to be hello" );
 });*/
