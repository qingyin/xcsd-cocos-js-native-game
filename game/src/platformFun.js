

var platformFun = platformFun || {};

platformFun.backToApp = function(){
    if (cc.sys.platform == cc.sys.ANDROID){

        cc.director.end();
        cc.log("platformFun.backToApp android");
        // jsb.reflection.callStaticMethod("com/tuxing/app/activity/CocosJSActivity", "showAlertDialog", "(Ljava/lang/String;Ljava/lang/String;)V", "How are you ?", "I'm great !");
        jsb.reflection.callStaticMethod("com/tuxing/app/activity/CocosJSActivity", "backToNativeApp", "()V");
    }else if(cc.sys.platform == cc.sys.IPHONE){
        var ret = jsb.reflection.callStaticMethod("GameMainController", 
	           "callNativeUIWithTitle:andContent:", 
	           "cocos2d-js", 
	           "Yes! you call a Native UI from Reflection");

    }else if(cc.sys.platform >= cc.sys.MOBILE_BROWSER){//浏览器

    }else{
        
    }
}

platformFun.setBtnPicColor = function (btnNode,color) {
    if(cc.sys.platform >= cc.sys.MOBILE_BROWSER){
        //在浏览器下运行有此属性
        btnNode._buttonNormalRenderer.color = color;
        btnNode._buttonClickedRenderer.color = color;
    }else{
        //在app中运用有此方法
        btnNode.getRendererNormal().color = color;
        btnNode.getRendererClicked().color = color;
    }
}


platformFun.removeAllActionsFromTarget = function (target) {
    if(cc.sys.platform >= cc.sys.MOBILE_BROWSER){
        //在浏览器下运行有此属性
        cc.director.getActionManager().removeAllActionsFromTarget(target, true);
    }else{
        //在app中运用有此方法
        cc.director.getActionManager().removeAllActionsFromTarget(target);
    }
}

platformFun.offlineNum = 0;

platformFun.bodyData = null;
platformFun.httpPostCallBackFun = null;
platformFun.isSync = null;
httpPostCallBack = function(cbData){
    var endIndex = cbData.lastIndexOf("}");
    cc.log("-----cbData--",cbData,"-----ddddd--",endIndex);
    var resStr = cbData.substring(0,endIndex+1);
    cc.log("-----resStr--",resStr);
 
    var data = JSON.parse(resStr);
    if(data.result == 200){
        if(platformFun.isSync){
            Utils.removeLoading();
        }
        platformFun.offlineNum = 0;
        platformFun.httpPostCallBackFun(resStr);
    }else if(data.result == 400){        
        if(platformFun.isSync){
            Utils.removeLoading();
        }
        Utils.showLowNet();
    }else{
        cc.log("============+++++++++++++++++++++");        
    }
}
platformFun.httpPost = function(bodyData,callback,isSync){
    //cc.log("url---",url,token,bodyData,callback,serverAddr);
    if (cc.sys.platform == cc.sys.ANDROID){
        platformFun.bodyData = bodyData;
        platformFun.httpPostCallBackFun = callback;
        platformFun.isSync = isSync;
        if(platformFun.isSync){
            Utils.showWaitting(platformFun.isSync);
        } 
        jsb.reflection.callStaticMethod("com/tuxing/app/activity/CocosJSActivity", "nativeHttpClient", "(Ljava/lang/String;Ljava/lang/String;Ljava/lang/String;Ljava/lang/String;)V",serverAddr,bodyData.url,JSON.stringify(bodyData),"androidCallback");

    }else if(cc.sys.platform == cc.sys.IPHONE){
        platformFun.bodyData = bodyData;
        platformFun.httpPostCallBackFun = callback;
        platformFun.isSync = isSync;
        if(platformFun.isSync){
            Utils.showWaitting(platformFun.isSync);
        } 
        jsb.reflection.callStaticMethod("GameMainController", 
        "callNativeHttpPost:token:bodyData:hostUrl:callback:", 
        bodyData.url,bodyData.token,JSON.stringify(bodyData),serverAddr,"callback");       
    }else if(cc.sys.platform >= cc.sys.MOBILE_BROWSER){//浏览器

    }else{
        
    }
}

platformFun.repeatHttpPost = function(){
    platformFun.httpPost(platformFun.bodyData,platformFun.httpPostCallBackFun,true);
}


platformFun.reportDataGameIn = function(gameId){
    if (cc.sys.platform == cc.sys.ANDROID){
        cc.log("platformFun.reportDataGameIn android");
        jsb.reflection.callStaticMethod("com/tuxing/app/activity/CocosJSActivity", "reportGameDataNative", "(II)V",gameId,5);
    }else if(cc.sys.platform == cc.sys.IPHONE){        
        jsb.reflection.callStaticMethod("GameMainController", 
        "callNativeGameReport:eventType:", 
        gameId,5); 
    }else if(cc.sys.platform >= cc.sys.MOBILE_BROWSER){//浏览器

    }else{
        
    }
}

platformFun.reportDataGameOut = function(gameId){
    if (cc.sys.platform == cc.sys.ANDROID){
        cc.log("platformFun.reportDataGameOut android");
        jsb.reflection.callStaticMethod("com/tuxing/app/activity/CocosJSActivity", "reportGameDataNative", "(II)V",gameId,6);
    }else if(cc.sys.platform == cc.sys.IPHONE){     
        jsb.reflection.callStaticMethod("GameMainController", 
        "callNativeGameReport:eventType:", 
        gameId,6);
    }else if(cc.sys.platform >= cc.sys.MOBILE_BROWSER){//浏览器

    }else{
        
    }
}

platformFun.reportFinishHomework = function(memberId,score){
    memberId = memberId + "";
    score = score + "";
    var scoreJson = "{\"score\":"+score+"}";
    if (cc.sys.platform == cc.sys.ANDROID){
        cc.log("platformFun.reportFinishHomework android");
        jsb.reflection.callStaticMethod("com/tuxing/app/activity/CocosJSActivity", "reportFinishHomeworkNative", "(Ljava/lang/String;Ljava/lang/String;)V",memberId,scoreJson);
    }else if(cc.sys.platform == cc.sys.IPHONE){     
        jsb.reflection.callStaticMethod("GameMainController", 
        "callNativeFinishHomeworkReport:andScore:",
        memberId,scoreJson);
    }else if(cc.sys.platform >= cc.sys.MOBILE_BROWSER){//浏览器

    }else{
        
    }
}

platformFun.reportGameTest = function(testId){
    testId = testId +"";
    if (cc.sys.platform == cc.sys.ANDROID){
        cc.log("platformFun.reportDataGameOut android");
        jsb.reflection.callStaticMethod("com/tuxing/app/activity/CocosJSActivity", "reportGameTestNative", "(Ljava/lang/String;)V",testId);
    }else if(cc.sys.platform == cc.sys.IPHONE){
        jsb.reflection.callStaticMethod("GameMainController", 
        "callNativeGameTestReport:", 
        testId);
    }else if(cc.sys.platform >= cc.sys.MOBILE_BROWSER){//浏览器

    }else{
        
    }
}

