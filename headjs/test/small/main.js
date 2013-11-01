function loadModule(currIndex, cb){
    if(cc.ref.length <= currIndex) return cb();
    var moduleName = cc.ref[currIndex];
    head.js(cc.dir + "modules/" + moduleName + "/list.js", function(){
        var arr = [];
        var module = cc.modules[moduleName];
        for(var i = 0, l = module.length; i < l; ++i){
            arr.push(cc.dir + "modules/" + moduleName + "/" + module[i]);
        }
        arr.push(function(){
            loadModule(currIndex + 1, cb);
        });
        head.js.apply(this, arr);
    });
};
head.js("modules.js", function(){
    head.js(cc.dir + "core/list.js", function(){
        var arr = [];
        var module = cc.modules["core"];
        for(var i = 0, l = module.length; i < l; ++i){
            arr.push(cc.dir + "core/" + module[i]);
        }
        arr.push(function(){
            loadModule(0, function(){
                head.js("a.js", function(){
                });
            });
        });
        head.js.apply(this, arr);
    });
});

