var FileWrapperNode = require('../compiled/src/FileWrapperNode');
var PycParser = require('../compiled/src/MarshalParser');

function getActualOutput(pathToPyc) {
    var fw = new FileWrapperNode(pathToPyc);
    var actualOutput;
    fw.connect(function afterConnect() {
        var pyc = MarshalParser.parse(fw);
        actualOutput = pyc.stringify();
    });
    return actualOutput;
}

var testPath = "/path/"

module("MarshalParser");

var mpPath = testPath + "/to/"

test( "typeInt", function( assert ) {
    var expectedOutput = "";
    var actualOutput = getActualOutput(mpPath + "testdata.file");
    assert.equal(value,expectedOutput,actualOutput)
});

test( "typeInt64", function( assert ) {
    var value = "hello";
    assert.equal( value, "hello", "We expect value to be hello" );
});

test( "typeFloat", function( assert ) {
    var value = "hello";
    assert.equal( value, "hello", "We expect value to be hello" );
});

test( "typeBinaryFloat", function( assert ) {
    var value = "hello";
    assert.equal( value, "hello", "We expect value to be hello" );
});

test( "typeComplex", function( assert ) {
    var value = "hello";
    assert.equal( value, "hello", "We expect value to be hello" );
});

test( "typeBinaryComplex", function( assert ) {
    var value = "hello";
    assert.equal( value, "hello", "We expect value to be hello" );
});

test( "typeLong", function( assert ) {
    var value = "hello";
    assert.equal( value, "hello", "We expect value to be hello" );
});

test( "typeString", function( assert ) {
    var value = "hello";
    assert.equal( value, "hello", "We expect value to be hello" );
});

test( "typeInterned", function( assert ) {
    var value = "hello";
    assert.equal( value, "hello", "We expect value to be hello" );
});

test( "typeStringref", function( assert ) {
    var value = "hello";
    assert.equal( value, "hello", "We expect value to be hello" );
});

//Super-unit tests

test( "typeUnicode", function( assert ) {
    var value = "hello";
    assert.equal( value, "hello", "We expect value to be hello" );
});

test( "typeTuple", function( assert ) {
    var value = "hello";
    assert.equal( value, "hello", "We expect value to be hello" );
});

test( "typeList", function( assert ) {
    var value = "hello";
    assert.equal( value, "hello", "We expect value to be hello" );
});

test( "typeDict", function( assert ) {
    var value = "hello";
    assert.equal( value, "hello", "We expect value to be hello" );
});

test( "typeFrozenset", function( assert ) {
    var value = "hello";
    assert.equal( value, "hello", "We expect value to be hello" );
});

test( "typeCodeObject", function( assert ) {
    var value = "hello";
    assert.equal( value, "hello", "We expect value to be hello" );
});