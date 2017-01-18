
var Utils = Utils || {};

Utils.showWaitting = function(isHide){
    var currentScene = cc.director.getRunningScene();
    if (currentScene) {
        var size = cc.winSize;
        var img_bg = new cc.LayerColor();
        img_bg.attr({
            x : 0,
            y : 0,
            width : size.width,
            height : size.height,
            color : cc.color(255,255,255),
        });
        currentScene.addChild(img_bg,0);

        cc.eventManager.addListener({
            event:cc.EventListener.TOUCH_ONE_BY_ONE,
            swallowTouches:true,
            onTouchBegan:function(touch,event){return true;},
            onTouchMoved:function(){},
            onTouchEnded:function(){}  
        },img_bg);

        if (isHide == false) {
            img_bg.setOpacity(0);
        }else {
            img_bg.setOpacity(255);
        }

        var img_loading = new cc.Sprite(res.loading_dengdai);
        img_loading.attr({
            x:cc.winSize.width/2,
            y:cc.winSize.height/2,
            scale:0.5,
        });
        img_bg.addChild(img_loading,100);
        img_loading.runAction(new cc.RepeatForever(new cc.RotateBy(1, 360)));
        Utils.removeLoading = function(){
            if (img_loading) {
                img_loading.removeFromParent(false);
                img_bg.removeFromParent(true);
                Utils.removeLoading = null;
            }
        }
    }
}

Utils.showLowNet = function(){
    var currentScene = cc.director.getRunningScene();
    if (currentScene) {
        var addGame = new AlertTip();
        currentScene.addChild(addGame,10);

        if (typeof(Utils.removeLoading) == "function") {
            Utils.removeLoading();
        };
    }
}

Utils.request = function(strParame){
    if(cc.sys.platform >= cc.sys.MOBILE_BROWSER){//浏览器
        var args = {};
        var query = location.search.substring(1);
        cc.log("location--",query);
        var pairs = query.split("&");
        for(var i = 0; i < pairs.length; i++) {
            var pos = pairs[i].indexOf('=');
            if (pos == -1) continue;
            var argname = pairs[i].substring(0,pos);
            var value = pairs[i].substring(pos+1);
            value = unescape(value);
            args[argname] = value;
        }
        return args[strParame];
    }
}

Utils.argsList = {};
Utils.handleEnterCocosArgs = function(argsStr){
    cc.log("Utils.handleEnterCocosArgs-argsStr--",argsStr);
    var strManager = argsStr;
    if(cc.sys.platform >= cc.sys.MOBILE_BROWSER){//浏览器
        strManager = location.search.substring(1);
        cc.log("Utils.handleEnterCocosArgs-location--",strManager);
    }

    Utils.argsList = {};
    var pairs = strManager.split("&");
    for(var i = 0; i < pairs.length; i++) {
        var pos = pairs[i].indexOf('=');
        if (pos == -1) continue;
        var argname = pairs[i].substring(0,pos);
        var value = pairs[i].substring(pos+1);
        value = unescape(value);
        // Utils.argsList[argname] = value;

        if (argname == ESEnum.paramKey.MemberId) {
            Utils.argsList[argname] = parseInt(value)
        }else {
            Utils.argsList[argname] = value;
        }
    }
    userData.handleEnterCocosArgs(argsStr);
    userData.printAll();
}

Utils.getArgsValue = function(key){
    return Utils.argsList[key];
}

Utils.getArgsByKey = function(source,key){
    var args = {};
    var pairs = source.split("&");
    for(var i = 0; i < pairs.length; i++) {
        var pos = pairs[i].indexOf('=');
        if (pos == -1) continue;
        var argname = pairs[i].substring(0,pos);
        var value = pairs[i].substring(pos+1);
        value = unescape(value);
        args[argname] = value;
    }
    cc.log("query ",query,key,args[key]);
    return args[key];
}



