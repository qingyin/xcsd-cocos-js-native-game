
function  Http(){
    var _succCallback = function(){};//回调函数
    var _errCallback = function(){};//error function
}

function createXMLHttpRequest() {
    var xmlHttp;
    if (window.XMLHttpRequest) {
        xmlHttp = new XMLHttpRequest();
        if (xmlHttp.overrideMimeType)
            xmlHttp.overrideMimeType('text/xml');
    } else if (window.ActiveXObject) {
        try {
            xmlHttp = new ActiveXObject("Msxml2.XMLHTTP");
        } catch (e) {
            try {
                xmlHttp = new ActiveXObject("Microsoft.XMLHTTP");
            } catch (e) {
            }
        }
    }
    return xmlHttp;
}

Http.prototype.getJSON = function(url,data,callBack,errorCallBack,isSync, isHide){
    if(typeof (callBack) == "function"){
        this._succCallback = callBack;
    }else{
        this._succCallback = function(){}
    }
    if(typeof(isSync) != "boolean"){
        isSync = true;
    }
    if(typeof (errorCallBack) == "function"){
        this._errorCallBack = errorCallBack;
    }
    var xmlHttp = createXMLHttpRequest();
    if (data.constructor == Object) {
        data = JSON.stringify(data);
    }
    cc.log("send: " + data); 
    var datato2 = data;
    //var datato2 = cc.loader._str2Uint8Array(data); //加密 [201,34,...]
    //cc.log("send:datato2 " + datato2);
    xmlHttp.open("POST", url, true );//encodeURI(String(datato2)), true);
    xmlHttp.send(datato2);
    if (isSync) {
        Utils.showWaitting(isHide);
    }; 
    var self = this;
    var callBack2 = callBack;
    
    var currentScene = cc.director.getRunningScene();
    xmlHttp.onreadystatechange = function(){ // ajax回调
        if (xmlHttp.status == 0) {
            Utils.showLowNet();
            self._succCallback("fail");
            return;
        }
        if(xmlHttp.readyState == 4){
            if( xmlHttp.status == 200 ){
                var strData = xmlHttp.response;
                if(strData.length>0){    //当内容为空时会有"[]"
                    cc.log("rev: "+strData);
                    if (currentScene && isSync) {
                        Utils.removeLoading();
                    }
                    self._succCallback(strData);
                }else{
                    cc.log("链接不畅，请检查网络");
                    Utils.showLowNet();
                    return;
                }
            }else{
                //网络错误处理
                if(self._errorCallBack) {
                    JSON.stringify(self._errorCallBack);
                    self._errorCallBack();
                    Utils.showLowNet();
                    cc.log("连接失败");
                }
            }
        }else{
            //网络错误处理
            if(self._errorCallBack) {
                self._errorCallBack();
                Utils.showLowNet();
                cc.log("连接失败");
            }
        }
    }
}


Http.prototype.UInt8ArrayToString = function(uInt8Array) {
    var s = "";
    for (var i = 0; i < uInt8Array.length; i++) {
        if(i > 0)
            s += ",";
        s += uInt8Array[i];
    }
    return s;
}


