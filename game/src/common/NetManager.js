
//服务器接口地址
//var serverAddr = 'http://121.41.101.14:8080/gamedata.py';//正式线上
// var serverAddr = 'http://121.41.101.14:8090/gamedata.py';//正式线上
// var serverAddr = 'http://122.0.71.122:8080/archer/gamedata.py';

var serverAddr = 'http://121.41.101.14:8080/gamedata.py'; //测试服 
// var serverAddr = 'http://121.40.16.212:8080/gamedata.py'; //开发服
//var serverAddr = 'http://service.xcsdedu.com/gamedata.py'; //线上服 

// var Localserver = 'http://123.57.172.138/static/archer';//客户端地址
var Localserver = 'http://192.168.1.121:8090/Sites';
var Localserver = 'http://127.0.0.1/~yiliu/'; 


var serverSDK = 'http://m.888.qq.com/m_qq/active/lg.gameHall.nocache.html?mobile=1&mdebug=1&gameId=woshijianshou&callBackUrl='+Localserver;
//具体方法实现方法
var NetManager = {
    /**
     * 通用获取数据方法getMessage
     * @param successCallBack 成功后回调函数
     * @param errorCallBack  失败后回调函数(默认不填) 
     */
    getMessage: function(data,successCallBack,isSync, isHide) {
        var http = new Http();
        http.getJSON(serverAddr, data, successCallBack, null,isSync, isHide);        
    },
};



