//var Tuple = require('./Tuple');
var Tuple = require(['../compiled/src/Tuple'], function (Tuple) {});
var List = require(['../compiled/src/List'], function (List) {});
var Dict = require(['../compiled/src/Dict'], function (Dict) {});
var Frozenset = require(['../compiled/src/Frozenset'], function (Frozenset) {});

var FileWrapperNode = require(['../compiled/src/FileWrapperNode'], function (FileWrapperNode) {});

//var FileWrapperNode = require('../compiled/src/FileWrapperNode');

//var MarshalParser = require(['../compiled/src/MarshalParser'], function (MarshalParser) {});

var PycParser = require(['../compiled/src/PycParser'], function (PycParser) {});


function getActualOutput(pathToPyc) {
    var fw = new FileWrapperNode(pathToPyc);
    var actualOutput = "";
    fw.connect(function afterConnect() {
        var pyc = MarshalParser.parse(fw);
        actualOutput = pyc.stringify();
    });
    return actualOutput;
}

//http://buildingonmud.blogspot.com/2009/06/
function toUnicode(theString) {
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
/*d = new Dict();
d = Dict.putItem("str",expectedOutputs["STRING"]);
d = Dict.putItem("fl",expectedOutputs["FLOAT"]);
d = Dict.putItem("tu",expectedOutputs["TUPLE"]);
expectedOutputs["DICT"] = d;*/
expectedOutputs["FROZEN_SET"] = new Frozenset(["a"]);

var testPath = "data/";

module("MarshalParser");

var mpPath = testPath + "module_marshal-parser/";

test( "typeInt", function(assert) {
    var expectedOutput = expectedOutputs["INT"];
    //var actualOutput = getActualOutput(mpPath + "INT.pyc");
    var path = mpPath + "INT.pyc";

    var fw = new FileWrapperNode(path);

    var actualOutput = "";
    fw.connect(function afterConnect() {
        var pyc = PycParser.parse(fw);
        actualOutput = pyc.stringify();
    });
    assert.equal(actualOutput,expectedOutput,"Expected output?");
});

test( "typeInt64", function( assert ) {
    var expectedOutput = expectedOutputs["INT_64"];
    var actualOutput = getActualOutput(mpPath + "INT_64.pyc");
    assert.equal( value,expectedOutput,actualOutput)
});

/*test( "typeFloat", function( assert ) {
    var value = "hello";
    assert.equal( value, "hello", "We expect value to be hello" );
});*/

test( "typeB_Float", function( assert ) {
    var expectedOutput = expectedOutputs["B_FLOAT"];
    var actualOutput = getActualOutput(mpPath + "B_FLOAT.pyc");
    assert.equal( value,expectedOutput,actualOutput)
});

/*test( "typeComplex", function( assert ) {
    var value = "hello";
    assert.equal( value, "hello", "We expect value to be hello" );
});*/

/*test( "typeBinaryComplex", function( assert ) {
    var value = "hello";
    assert.equal( value, "hello", "We expect value to be hello" );
});*/

test( "typeLong", function( assert ) {
    var expectedOutput = expectedOutputs["LONG"];
    var actualOutput = getActualOutput(mpPath + "LONG.pyc");
    assert.equal( value,expectedOutput,actualOutput)
});

test( "typeString", function( assert ) {
    var expectedOutput = expectedOutputs["STRING"];
    var actualOutput = getActualOutput(mpPath + "STRING.pyc");
    assert.equal( value,expectedOutput,actualOutput)
});

/*test( "typeInterned", function( assert ) {
    var value = "hello";
    assert.equal( value, "hello", "We expect value to be hello" );
});*/

/*test( "typeStringref", function( assert ) {
    var value = "hello";
    assert.equal( value, "hello", "We expect value to be hello" );
});*/

//Super-unit tests

test( "typeUnicode", function( assert ) {
    var expectedOutput = expectedOutputs["UNICODE"];
    var actualOutput = getActualOutput(mpPath + "UNICODE.pyc");
    assert.equal( value,expectedOutput,actualOutput)
});

test( "typeTuple", function( assert ) {
    var expectedOutput = expectedOutputs["TUPLE"];
    var actualOutput = getActualOutput(mpPath + "TUPLE.pyc");
    assert.equal( value,expectedOutput,actualOutput)
});

test( "typeList", function( assert ) {
    var expectedOutput = expectedOutputs["LIST"];
    var actualOutput = getActualOutput(mpPath + "LIST.pyc");
    assert.equal( value,expectedOutput,actualOutput)
});

test( "typeDict", function( assert ) {
    var expectedOutput = expectedOutputs["DICT"];
    var actualOutput = getActualOutput(mpPath + "DICT.pyc");
    assert.equal( value,expectedOutput,actualOutput)
});

test( "typeFrozenset", function( assert ) {
    var expectedOutput = expectedOutputs["FROZEN_SET"];
    var actualOutput = getActualOutput(mpPath + "FROZEN_SET.pyc");
    assert.equal( value,expectedOutput,actualOutput)
});

/*
test( "typeCodeObject", function( assert ) {
    var value = "hello";
    assert.equal( value, "hello", "We expect value to be hello" );
});*/
