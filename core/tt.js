
/**
 * Base 4 tt.
 * User: small
 * Date: 13-10-12
 * Time: 下午5:10
 * To change this template use File | Settings | File Templates.
 */

var tt = tt || {};

tt._getXMLHttpRequest = function () {
    if (window.XMLHttpRequest) {
        return new window.XMLHttpRequest();
    } else {
        return new ActiveXObject("MSXML2.XMLHTTP");
    }
};
tt.loadJson = function (fileUrl, cb) {
    var selfPointer = this;
    var xhr = tt._getXMLHttpRequest();
    xhr.open("GET", fileUrl, true);
    if (/msie/i.test(navigator.userAgent) && !/opera/i.test(navigator.userAgent)) {
        // IE-specific logic here
        xhr.setRequestHeader("Accept-Charset", "utf-8");
    } else {
        if (xhr.overrideMimeType)
            xhr.overrideMimeType("text\/plain; charset=utf-8");
    }
    xhr.onreadystatechange = function (event) {
        if (xhr.readyState == 4) {
            if (xhr.status == 200) {
                cb(null, eval("(" + xhr.responseText + ")"));
            } else {
                cb(null, null);
            }
        }
    };
    xhr.send(null);
};

tt.loadJs = function(baseDir, jsList, cb){
    if(arguments.length < 1) return;
    if(arguments.length == 1){
        jsList = baseDir instanceof Array ? baseDir : [baseDir];
        baseDir = "";
    }else if(arguments.length == 2){
        if(typeof jsList == "function"){
            cb = jsList;
            jsList = baseDir instanceof Array ? baseDir : [baseDir];
            baseDir = "";
        }else{
            jsList = jsList instanceof Array ? jsList : [jsList];
        }
    }else{
        jsList = jsList instanceof Array ? jsList : [jsList];
    }
    return tt._loadJsArr(baseDir, jsList, 0, cb);
};
tt._loadJsArr = function(baseDir, jsList, index, cb){
    baseDir = baseDir || "";
    if(index >= jsList.length) {
        if(cb) cb();
        return;
    }
    var f = document.createElement('script');
    f.type = 'text/javascript';
    f.src = baseDir + jsList[index];
    f.addEventListener('load',function(){
        tt._loadJsArr(baseDir, jsList, index+1, cb);
        this.removeEventListener('load', arguments.callee, false);
    },false);
    document.head.appendChild(f);
};

tt._ttDir = "";
tt._modulesDir = "";
tt._moduleCache = {};
tt.loadGame = function(cb){
    tt.loadJson("package.json", function(err, data){
        if(err){
            console.error(err);
        }else{
            tt._ttDir = data.ttDir;
            tt._modulesDir = tt._ttDir + "modules/";
            var dependencies = tt._getDependencies(data.dependencies);
            var jsList = data.jsList;
            tt.loadJson(tt._ttDir + "core" + "/package.json", function(err, data2){
                tt.loadDependencies(tt._getDependencies(data2.dependencies), 0, "", data2.jsList, function(){
                    tt.loadDependencies(dependencies, 0, "", jsList, function(){
                        console.log("success!")
                    }, "./");
                }, tt._ttDir + "core/");
            });
        }
    });
};
tt._getDependencies = function(temp){
    var dependencies = [];
    for(var key in temp){
        dependencies.push(key);
    };
    return dependencies;
}
tt.loadDependencies = function(dependencies, index, moduleName, jsList, cb, defaultDir){
    var moduleDir = defaultDir ? defaultDir : tt._modulesDir + moduleName + "/";
    if(index >= dependencies.length || !dependencies[index]) {
        console.log(moduleDir);
        tt.loadJs(moduleDir, jsList, function(){
            if(!defaultDir) tt._moduleCache[moduleName] = true;
            if(cb) cb();
        });
        return;
    }
    var dependency = dependencies[index];
    tt.loadJson(tt._modulesDir + dependency + "/package.json", function(err, data){
        if(err){
            console.error(err);
            console.error("Please install the module [" + dependency + "] first!");
        }else{
            var jsList2 = data.jsList;
            var dependencies2 = tt._getDependencies((data.dependencies));
            var index2 = 0;
            tt.loadDependencies(tt._getDependencies((data.dependencies)), 0, dependency, jsList2, function(){
                tt.loadDependencies(dependencies, index+1, moduleName, jsList, cb, defaultDir);
            });
        }
    });
};
tt._loadPackage = function(moduleDir, moduleName, cb){
    tt.loadJson(moduleDir + moduleName + "/package.json", function(err, data){
        if(err){
            console.error(err);
            console.error("Please install the module [" + moduleName + "] first!");
        }else{
            tt._packageCache[moduleName] = true;
            console.log(data);
            var jsList = data.jsList;
            tt.loadJs("core/", jsList, function(){
                if(cb) cb();
            })
        }
    });
}

/**
 * Desc: put src (Array) into target (Array) from startIndex to endIndex.
 * @param {Array} target
 * @param {Array} src
 * @param {Integer||null} startIndex
 * @param {Integer||null} endIndex
 * @returns {*}
 */
tt.pushArr = function(target, src, startIndex, endIndex){
    startIndex = startIndex == null ? 0 : startIndex;
    endIndex = endIndex == null ? src.length : endIndex;
    for(var i = startIndex; i < endIndex; ++i){
        target.push(src[i]);
    }
    return target;
};


tt.initBase = function(){
    tt.ANCHOR_POINT_TL = cc.p(0, 1);
    tt.ANCHOR_POINT_T = cc.p(0.5, 1);
    tt.ANCHOR_POINT_TR = cc.p(1, 1);
    tt.ANCHOR_POINT_L = cc.p(0, 0.5);
    tt.ANCHOR_POINT_C = cc.p(0.5, 0.5);
    tt.ANCHOR_POINT_R = cc.p(1, 0.5);
    tt.ANCHOR_POINT_BL = cc.p(0, 0);
    tt.ANCHOR_POINT_B = cc.p(0.5, 0);
    tt.ANCHOR_POINT_BR = cc.p(1, 0);

    tt.WIN_SIZE = cc.Director.getInstance().getWinSize();

    tt.WIN_CENTER = cc.p(tt.WIN_SIZE.width/2, tt.WIN_SIZE.height/2);
};