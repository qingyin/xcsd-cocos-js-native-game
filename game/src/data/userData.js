

var userData = userData || {};
userData.data = {};

userData.key = {
	action : "action",//int
    token : "token",//string
    memberId : "memberId",//int

    gameList : "gameList",//{gameId,level,abilityId,hasGuide}
    isFirstTest : "isFirstTest",//bool,
    testId : "testId",//
    
    Ability : "ability",//
    AbilityId : "abilityId",//
    TaskList : "taskList",


    taskList : "taskList",//{gameId,level,abilityId,hasGuide}
    childUserId : "childUserId",//int
}

userData.LobbyInfoKey = {
    action : "action",//int
    token : "token",//string
    memberId : "memberId",//int
}

userData.TestInfoKey = {
    action : "action",//int
    token : "token",//string
    memberId : "memberId",//int
    gameList : "gameList",//{gameId,level,abilityId,hasGuide}
    isFirstTest : "isFirstTest",//bool,
    testId : "testId",//int
}

userData.HomeWorkInfoKey = {
    action : "action",//int
    token : "token",//string
    memberId : "memberId",//int
    taskList : "taskList",//{gameId,level,abilityId,hasGuide}
    childUserId : "childUserId",//int
}

userData.actionEnum = {
    GameLobby : 10001,
    GameTest : 10003,
    GameHomeWork : 10004,
}


userData.setValue = function(key,value){
	key = key + "";
	userData.data[key] = value;
}

userData.getValue = function(key){
	key = key + "";
	return userData.data[key];
} 

userData.handleEnterCocosArgs = function(argsStr){
    if(GameGlobals.getOnDebug()){
        return; 
    }
    cc.log("userData.handleEnterCocosArgs-argsStr--",argsStr);
    var strManager = argsStr;

    // if(GameGlobals.getOnDebug()){        
    //     if(cc.sys.platform >= cc.sys.MOBILE_BROWSER){//浏览器
    //         strManager = location.search.substring(1);
    //         cc.log("userData.handleEnterCocosArgs-location--",strManager);
    //     } 
    // }
    var argsList = {};
    var pairs = strManager.split("&");
    for(var i = 0; i < pairs.length; i++) {
        var pos = pairs[i].indexOf('=');
        if (pos == -1) continue;
        var argname = pairs[i].substring(0,pos);
        var value = pairs[i].substring(pos+1);
        value = unescape(value);
        argsList[argname] = value;
    }
    for (var key in argsList) {
    	userData.setValue(key,argsList[key])
    }

    var temp = userData.getValue(userData.key.action);      
    if(temp){
        userData.setValue(userData.key.action,parseInt(temp));
    }

    temp = userData.getValue(userData.key.memberId);        
    if(temp){
        userData.setValue(userData.key.memberId,parseInt(temp));
    }
	
	temp = userData.getValue(userData.key.gameList);	    
	if(temp){
    	userData.setValue(userData.key.gameList,JSON.parse(temp));
    }

    temp = userData.getValue(userData.key.isFirstTest);
    if(temp){
        userData.setValue(userData.key.isFirstTest,JSON.parse(temp));
    }

    temp = userData.getValue(userData.key.testId);        
    if(temp){
        userData.setValue(userData.key.testId,parseInt(temp));
    }

    temp = userData.getValue(userData.key.taskList);        
    if(temp){
        userData.setValue(userData.key.taskList,JSON.parse(temp));
    }

    temp = userData.getValue(userData.key.childUserId);        
    if(temp){
        userData.setValue(userData.key.childUserId,parseInt(temp));
    }
    

    //userData.printAll();
}

userData.printAll = function(){
    cc.log("----------------userData.printAll----start");
	for (var k in userData.data) {
		cc.log("--------key---",k,userData.data[k],typeof(userData.data[k]));
	}
    cc.log("----------------userData.printAll----end");
}





