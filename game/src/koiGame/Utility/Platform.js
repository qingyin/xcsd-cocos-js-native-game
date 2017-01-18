

var Platform = Platform || {};

Platform.loadFileSync = function (filePath) {
    var txtData;
    if (cc.sys.platform >= cc.sys.MOBILE_BROWSER) {//html5
        txtData = cc.loader._loadTxtSync(filePath);  
    }else{//native
        txtData = jsb.fileUtils.getStringFromFile(filePath);
    }
    return txtData;
}
