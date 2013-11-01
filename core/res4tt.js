/**
 * Resource util 4 mo.
 * User: small
 * Date: 13-10-12
 * Time: 下午5:10
 * To change this template use File | Settings | File Templates.
 */

var tt = tt || {};
tt.resCfg = tt.resCfg || {};

tt.testDirPre = "test/"
/**
 * Desc: merge res info into target.
 * @param target
 * @param arr
 * @param store
 * @private
 */
tt._mergeResArr = function(target, arr, store){
    arr.forEach(function(value){
        if(value == null) return;
        value = typeof value == "string" ? {src : value} : value;
        if(store[value.src]) return;
        store[value.src] = true;
        target.push(value);
    });
};

/**
 * Desc: merge js path info into target.
 * @param target
 * @param arr
 * @param store
 * @private
 */
tt._mergeJsArr = function(target, arr, store){
    arr.forEach(function(value){
        if(value == null) return;
        store[value] = true;
        target.push(value);
    });
};

/**
 * Desc: get the res for loading.
 * @param loadResName
 * @param store
 * @param isTest
 * @returns {Array}
 */
tt.getLoadRes = function(loadResName, store, isTest){
    if(loadResName == null) return [];
    if(typeof loadResName != "string") throw "Argument should be String!"
    var loadRes = tt.resCfg[loadResName];
    var resArr = [];
    store = store || {};
    if(loadRes){
        if(loadRes.ref != null){
            loadRes.ref.forEach(function(value, index){
                if(typeof value == "string"){
                    if(store[value]) return;
                    tt._mergeResArr(resArr, tt.getLoadRes(value, store, isTest), {});
                }else if(value instanceof Array){
                    tt._mergeResArr(resArr, value, store);
                }
            });
        }
        if(loadRes.res) tt._mergeResArr(resArr, loadRes.res, store);
        if(isTest && loadRes.testRes) tt._mergeResArr(resArr, loadRes.testRes, store);
    }
    if(loadResName.length > 5
        && loadResName.substring(loadResName.length - 5).toLowerCase() == ".ccbi"
        && store[loadResName] != true){
        resArr.push({src : loadResName})
    }
    store[loadResName] = true;
    return resArr;
};
/**
 * Desc: get js array 4 loading.
 * @param loadResName
 * @param type
 * @param store
 * @returns {Array}
 */
tt.getLoadJs = function(loadResName, type, store){
    if(loadResName == null) return [];
    if(typeof loadResName != "string") throw "Argument should be String!"
    var loadRes = tt.resCfg[loadResName];
    var jsArr = [];
    store = store || {};
    if(loadRes != null){
        if(loadRes.ref != null){
            loadRes.ref.forEach(function(value, index){
                if(typeof value == "string"){
                    if(store[value] == true) return;
                    tt._mergeJsArr(jsArr, tt.getLoadJs(value, type, store), {});
                }
            });
        }
        if(loadRes[type] != null) tt._mergeJsArr(jsArr, loadRes[type], store);
    }
    if(type == "appFiles"
        && loadResName.length > 3
        && loadResName.substring(loadResName.length - 3).toLowerCase() == ".js"
        && store[loadResName] != true){
        jsArr.push(loadResName);
    }
    store[loadResName] = true;
    return jsArr;
};

/**
 * Desc: get app files 4 cfg.
 * @param key
 * @param files
 * @param type
 */
tt.getAppFiles = function(key, files, type){
    files = files || [];
    //获取到的数组是有先后顺序的
    var temp = tt.getLoadJs(key, type, {});
    temp.forEach(function(v, i){
        if(files.indexOf(v) < 0){
            files.push(v);
        }
    });
};
/**
 * Desc: init file path with dir.
 * @param arr
 * @param dir
 */
tt.initFilesByDir = function(arr, dir){
    if(!dir) return;
    arr.forEach(function(value, index){
        arr[index] = dir + value;
    });
};
/**
 * Desc: init cfg before loading.
 * @param cfg
 */
tt.initCfg = function(cfg, resCfg, baseCfgName){
    cfg.appFiles = cfg.appFiles || [];
    if(resCfg != null) tt.resCfg = resCfg;
    else tt.resCfg = tt.resCfg || ResCfg;
    var appFiles = [], testFiles = [];
    if(baseCfgName != null){
        var baseCfg = tt.resCfg[baseCfgName];
        appFiles = baseCfg["appFiles"] || [];
        testFiles = baseCfg["testFiles"] || [];
        tt.initFilesByDir(appFiles, cfg.codeDir);
        if(cfg.runMode == "test") tt.initFilesByDir(testFiles, cfg.testDir);
        cfg.appFiles = cfg.appFiles.concat(appFiles, testFiles);
        appFiles = [], testFiles = [];
    }
    if(cfg.runMode == "test"){
        appFiles = tt.pushArr(appFiles, tt.getLoadJs(cfg.testCfg, "appFiles"));
        testFiles = tt.pushArr(testFiles, tt.getLoadJs(cfg.testCfg, "testFiles"));
        tt.initFilesByDir(appFiles, cfg.codeDir);
        tt.initFilesByDir(testFiles, cfg.testDir);
    }else{
        for(var key in tt.resCfg){
            if(key == null || typeof key != "string") return;
            tt.getAppFiles(key, appFiles, "appFiles");
        }
        tt.initFilesByDir(appFiles, cfg.codeDir);
    }
    cfg.appFiles = cfg.appFiles.concat(appFiles, testFiles);
    if(cfg.runMode != "test"){
        for(var i = 0, li = cfg.appFiles.length; i < li; ++i){
            if(!cfg.appFiles[i]) continue;
            if(cfg.appFiles[i].indexOf(tt.testDirPre) == 0) cfg.appFiles.splice(i, 1);
        }
    }
    if(cfg.gameVersion){
        cfg.appFiles.forEach(function(value, index){
            cfg.appFiles[index] = value + "?v=" + cfg.gameVersion;
        });
    }
};
