var uglify = require("uglify-js");
var fs = require("fs");
var path = require("path");

var toolsDir = path.join(__dirname, "../");
var code01 = path.join(toolsDir, "test/code/code01.js");
var code02 = path.join(toolsDir, "test/code/code02.js");

var result = uglify.minify([code01, code02], {
    inSourceMap: "tools/test/code",
    outSourceMap: "tools.test.mini"
});
console.log(result);