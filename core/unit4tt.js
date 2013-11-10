/**
 * Test unit 4 mo.
 * @type {*|{}}
 */

var tt = tt || {};
tt.resCfg = tt.resCfg || {};

tt.getClazz = function(clazzPath){
    var clazz = null;
    var arr = clazzPath.split(".");
    for(var i = 0; i < arr.length; ++i){
        clazz = clazz == null ? window[arr[i]] : clazz[arr[i]];
    }
    return clazz;
};
/**
 * Desc:test for sprite.
 * @param cfgName
 */
tt.testSprite = function(cfgName){
    tt.Layer4Test = tt.Layer4Test || cc.Layer.extend({
        init : function(spriteClazz, args){
            this._super();
            var node = spriteClazz.create(args);
            node.setAnchorPoint(cc.p(0.5, 0.5));
            this.addChild(node);
            var winSize = cc.Director.getInstance().getWinSize();
            node.setPosition(winSize.width/2, winSize.height/2);
            return true;
        }
    });
    tt.Layer4Test.create = tt.Layer4Test.create || function(spriteClazz, args){
        var layer = new tt.Layer4Test();
        return layer.init(spriteClazz, args) ? layer : null;
    };
    var cfg = ResCfg[cfgName];
    cfg.args = cfg.args || {};
    cc.LoaderScene.preload(tt.getLoadRes(cfgName, null, true), function(){
        var scene = cc.Scene.create();
        var clazz = tt.getClazz(cfg.sprite);
        scene.addChild(tt.Layer4Test.create(clazz, cfg.args || {}));
        cc.Director.getInstance().replaceScene(scene);
    });
};
/**
 * Desc: test for layer.
 * @param cfgName
 */
tt.testLayer = function(cfgName){
    var cfg = ResCfg[cfgName];
    cfg.args = cfg.args || {};
    cc.LoaderScene.preload(tt.getLoadRes(cfgName, null, true), function(){
        var scene = cc.Scene.create();
        var clazz = tt.getClazz(cfg.layer);
        scene.addChild(clazz.create(cfg.args || {}));
        cc.Director.getInstance().replaceScene(scene);
    });
};
/**
 * Desc: test for scene.
 * @param cfgName
 */
tt.testScene = function(cfgName){
    var cfg = ResCfg[cfgName];
    cfg.args = cfg.args || {};
    cc.LoaderScene.preload(tt.getLoadRes(cfgName, null, true), function(){
        var clazz = tt.getClazz(cfg.scene);
        var scene = clazz.create(cfg.args || {});
        cc.Director.getInstance().replaceScene(scene);
    });
};
/**
 * Desc: test for ccbi.
 * @param cfgName
 */
tt.testCCBI = function(cfgName){
    var cfg = ResCfg[cfgName];
    cfg.args = cfg.args || {};
    cc.LoaderScene.preload(tt.getLoadRes(cfgName, null, true), function(){
        var node = cc.BuilderReader.load(cfgName);
        var scene = cc.Scene.create();
        if(node != null) scene.addChild(node);
        cc.Director.getInstance().replaceScene(scene);
    });
};

/**
 * Desc: enter point of test unit.
 * @param cfgName
 */
tt.test = function(cfgName){
    var cfg = ResCfg[cfgName];
    if(!cfg) throw "Please config the info of [" + cfgName + "] in resCfg.js first!"
    if(cfg.scene){
        tt.testScene(cfgName);
    }else if(cfg.layer){
        tt.testLayer(cfgName);
    }else if(cfg.sprite){
        tt.testSprite(cfgName);
    }else{
        tt.testCCBI(cfgName);
    }
};