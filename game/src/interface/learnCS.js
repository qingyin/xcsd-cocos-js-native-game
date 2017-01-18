var isLocalData = null;

var LearnCS = LearnCS || {};

LearnCS.judgeLocalData = function (isLocal) {
	return isLocal;
}

LearnCS.getLevelStarNum = function(param, func){
    cc.log("--=======request gameId========--",param.gameId);
    var list = gameData.getGameValue(param.gameId,gameData.LevelInfoKey.starsList); 
    if (GameGlobals.getOnDebug()) {
        var args = {
            gameId : param.gameId,
            starsList : list,
            isTest : false,
            userId : userData.getValue(userData.key.memberId),
            token : userData.getValue(userData.key.token),
        }
        args.isSettle = param.isSettle || false;
        func(args);
        return;
    }
    if(list){
        var args = {
            gameId : param.gameId,
            starsList : list,
            isTest : false,
            userId : userData.getValue(userData.key.memberId),
            token : userData.getValue(userData.key.token),
        }
        args.isSettle = param.isSettle || false;
        // cc.log("userjsondata",typeof(userjsondata),typeof(JSON.parse(userjsondata["body"])));

        gameData.setGameLevels(param.gameId,args);
        func(args);
    }else{
        var data = {
            body : {
                userId : userData.getValue(userData.key.memberId),
                gameId : param.gameId,
            },
            token : userData.getValue(userData.key.token),
            url:"/game/scores",
        }
        function callback(param_data){
            // var userjsondata = JSON.parse(param_data);
            // cc.log("--userjsondata--",userjsondata);

            var userjsondata = JSON.parse(param_data);
            var args = {
                gameId : param.gameId,
                starsList : JSON.parse(userjsondata["body"]),
                isTest : false,
                userId : param.userId,
                token : param.token,
            }
            args.isSettle = param.isSettle || false;
            // cc.log("userjsondata",typeof(userjsondata),typeof(JSON.parse(userjsondata["body"])));

            gameData.setGameLevels(param.gameId,args);

            func(args);
        }
        //NetManager.getMessage(data,callback, null, true);
        platformFun.httpPost(data,callback,true);
    }
}

LearnCS.reportStarNum = function (args, func) {
	if (isLocalData == true) {
		var incScore = util.getRandom(0,6);
		var isDisplayRank = util.getRandom(1,2);
		var displayRank = null,rankPercentage = null;
		if (isDisplayRank == 1) {
			displayRank = true;
			rankPercentage = util.getRandom(1,2) - 1;
			if (rankPercentage == 0) {
				rankPercentage = 0.1;
			} 
		}else {
			displayRank = false;
			rankPercentage = 0;
		}
		var param = {
            incScore : incScore,
            displayRank : displayRank,
            rankPercentage : rankPercentage,
        }  

		var curStarsLength = null;
	    if (args.isAddLevel == true) {
	        curStarsLength = util.getArrycount(gameData.data[args.gameID].starsList);
	    }else {
	        curStarsLength = args.level;
	    }
        
        gameData.setGameStars(args.gameID,curStarsLength, args);
	    func(param);
	   	
	   	return;
	}

    // if(typeof(args.token) == "string"){
        var costTime = parseInt((parseInt(new Date().getTime()) - args.timestampStart)/1000);
        var data = {
            body : {
                userId : userData.getValue(userData.key.memberId),
                gameId : args.gameID,
                level : args.level,
                stars : args.starNum,
                score : args.starNum,
                costTime : costTime,//单位秒
            },
            token : userData.getValue(userData.key.token),
            url:"/game/result",
        }

        function callback(param_data){
            var userjsondata = JSON.parse(param_data);
            var body = JSON.parse(userjsondata["body"]);
            var param = {
                incScore : body["incScore"],
                displayRank : body["displayRank"],
                rankPercentage : body["rankPercentage"],
            }  

            var curStarsLength = null;
            if (args.isAddLevel == true) {
                curStarsLength = util.getArrycount(gameData.data[args.gameID].starsList);
            }else {
                curStarsLength = args.level;
            }
            gameData.setGameStars(args.gameID,curStarsLength, args);
            // for (var k in gameData.data[args.gameID].starsList[curStarsLength]) {
            //     cc.log("--------key---",k,gameData.data[args.gameID].starsList[curStarsLength][k],typeof(gameData.data[args.gameID].starsList[curStarsLength][k]));
            // }

            func(param);
        }

        //NetManager.getMessage(data,callback,null, false);
        platformFun.httpPost(data,callback,true);
    // }
    cc.log("-------------", args);
};

LearnCS.submitTask = function(args) {
	if (isLocalData == true) {
		return;
	}
    
    var data = {
        body : {
            memberId : userData.getValue(userData.key.memberId),
            resultList : args.resultList,
        },
        token : userData.getValue(userData.key.token),
        url:"/homework/result",
    }
    //NetManager.getMessage(data,function(){},false,false);
    
    platformFun.httpPost(data,function(){},false);
}

LearnCS.submitTest = function(args,cbFun){
	if (isLocalData == true) {
		var argsTest = {
			abilityHistory : [
				{x:1, y:160},
	            {x:2, y:200},
	            {x:5, y:402},
	            {x:3, y:340},
	            {x:4, y:370},
	        ]
		}

		if(typeof(cbFun) == "function"){
            cbFun(argsTest);
        }
        return;
	}

    var data = {
        body : {
            userId : userData.getValue(userData.key.memberId),
            testId : args.testId,
            testList : args.testList,
        },
        token : userData.getValue(userData.key.token),
        url:"/game_test/result",
    }
    function callback(param_data){
        platformFun.reportGameTest(args.testId);

        var userjsondata = JSON.parse(param_data);
        cc.log("userjsondata-469-",userjsondata);
        var body = JSON.parse(userjsondata["body"]);
        var argsTest = {
            abilityHistory : body["abilityHistory"],
            totalGrade : body["maxAbilityQuotient"],
            testGrade : body["abilityQuotient"],
        };

        if(typeof(cbFun) == "function"){
            cbFun(argsTest);
        }
    }
    //NetManager.getMessage(data,callback, null, false);
    platformFun.httpPost(data,callback,true);
}

LearnCS.reportGuideSettle = function (args, func) {

	if (isLocalData == true) {
	    func();
	   	return;
	}

    var userID = userData.getValue(userData.key.memberId);
    if (args.isTask == true) {
        userID = userData.getValue(userData.key.childUserId)
    }
    var data = {
        body : {
            userId : userID,
            gameId : args.gameID,
        },
        token : userData.getValue(userData.key.token),
        url:"/game/run_guide",
    }

    function callback(param_data){
        func();
    }

    //NetManager.getMessage(data,callback,null, false);
    platformFun.httpPost(data,callback,true);  
};

LearnCS.getOnlyRanking = function (args) {
    var userID = userData.getValue(userData.key.memberId);
    var param = {
        body : {
            userId : userID,
            gameId : args.gameId,
        },
        token : userData.getValue(userData.key.token),
        url:"/game/ranking",
    }

    function callback(param_data){
        var userjsondata = JSON.parse(param_data);
        var body = JSON.parse(userjsondata["body"]);
        var gameId = param.body.gameId;
        
        cc.log("data.ranking----",body); 

        for (var i = 0; i < body.length; i++) {
            gameData.setRankInfo(gameId,body[i].rank,body[i]);
        }
        //没有返回自己的分数
        //gameData.setMySelfRankScore(gameId,data["userScore"]);
        var cEvent = new cc.EventCustom("_rankHeadInfoEvent");
        cEvent.setUserData({gameId:gameId});
        cc.eventManager.dispatchEvent(cEvent);
    }
    platformFun.httpPost(param,callback,true);
    cc.log("send---",param);
    //NetManager.getMessage(param,callback, null, true);
}

LearnCS.getRanking = function (args) {
    var userID = userData.getValue(userData.key.memberId);
    var param = {
        body : {
            userId : userID,
            gameId : args.gameId,
        },
        token : userData.getValue(userData.key.token),
        url:"/game/levels_and_ranking",
    }
    function callback(param_data){
        var userjsondata = JSON.parse(param_data);
        var data = JSON.parse(userjsondata["body"]);
        var gameId = param.body.gameId;

        for (var i = 0; i < data["ranking"].length; i++) {
            gameData.setRankInfo(gameId,data["ranking"][i].rank,data["ranking"][i]);
        }
        gameData.setMySelfRankScore(gameId,data["userScore"]);
        
        var cEvent = new cc.EventCustom("_rankHeadInfoEvent");
        cEvent.setUserData({gameId:gameId});
        cc.eventManager.dispatchEvent(cEvent);
    }
    platformFun.httpPost(param,callback,true);
    cc.log("send---",param);
    //NetManager.getMessage(param,callback, null, true);
}

LearnCS.getLevelAndRanking = function (args, func) {
    if(cc.sys.isNative && true){
        var list = gameData.getGameValue(args.gameId,gameData.LevelInfoKey.starsList);     
        if(list){
            var param = {
                gameId : args.gameId,
                starsList : list,
            }
            param.isSettle = args.isSettle || false;

            gameData.setGameLevels(args.gameId,param);

            LearnCS.getRanking(param);
            func(param);
        }else{
            var userID = userData.getValue(userData.key.memberId);
            var param = {
                body : {
                    userId : userID,
                    gameId : args.gameId,
                },
                token : userData.getValue(userData.key.token),
                url:"/game/levels_and_ranking",
            }

            function callback(param_data){
                var userjsondata = JSON.parse(param_data);
                var data = JSON.parse(userjsondata["body"]); 

                var gameId = args.gameId;

                for (var i = 0; i < data["levels"].length; i++) {
                    gameData.setLevelDifficulty(gameId,i,data["levels"][i].length);        
                }               
                for (var i = 0; i < data["ranking"].length; i++) {
                    gameData.setRankInfo(gameId,data["ranking"][i].rank,data["ranking"][i]);
                } 

                gameData.setMySelfRankScore(gameId,data["userScore"]);

                var arg = {
                    gameId : gameId,
                    starsList : data.scores,
                    isTest : false,
                }
                arg.isSettle = args.isSettle || false;

                gameData.setGameLevels(arg.gameId,arg);

                func(arg);
            }
            platformFun.httpPost(param,callback,true);
            //NetManager.getMessage(param,callback, null, true);
        }  
    }else{
        var data = {
            levels : [[1,2,3,4,5,6,7,8,9,10,11,12,13,14],
                        [15,16,17,18,19,20,21,22],
                        [23,24,25,26,27,28,29,30]],
            scores : {
                1 :{level:1,score:0,stars:0},
                // 2 :{level:1,score:0,stars:3},
                // 3 :{level:1,score:0,stars:3},
                // 4 :{level:1,score:0,stars:3},
                // 5 :{level:1,score:0,stars:3},
                // 6 :{level:1,score:0,stars:3},
                // 7 :{level:1,score:0,stars:3},
                // 8 :{level:1,score:0,stars:3},
                // 9 :{level:1,score:0,stars:3},
            },
            ranking : [
                { 
                    userId:1,
                    name : "lik1",
                    rank : 1,
                    score : 10,
                    avatar : "https://www.baidu.com/img/baidu_jgylogo3.gif",
                },
                { 
                    userId:12,
                    name : "lik2",
                    rank : 2,
                    score : 10,
                    avatar : "https://www.baidu.com/img/baidu_jgylogo3.gif",
                },
                { 
                    userId:123,
                    name : "lik3",
                    rank : 3,
                    score : 10,
                    avatar : "https://www.baidu.com/img/baidu_jgylogo3.gif",
                },
                { 
                    userId:124,
                    name : "lik4",
                    rank : 4,
                    score : 10,
                    avatar : "https://www.baidu.com/img/baidu_jgylogo3.gif",
                }
            ],
        };

        var userID = 12;
        var gameId = args.gameId;
        for (var i = 0; i < data["levels"].length; i++) {
            gameData.setLevelDifficulty(gameId,i,data["levels"][i].length);        
        }

        for (var i = 0; i < data["ranking"].length; i++) {
            gameData.setRankInfo(gameId,data["ranking"][i].rank,data["ranking"][i]);
            if (data["ranking"][i].userId == userID) {
                gameData.setMySelfRankScore(gameId,data["ranking"][i].score);

            }
        }
        var arg = {
            gameId : gameId,
            starsList : data.scores,
            isTest : false,
        }
        arg.isSettle = args.isSettle || false;

        gameData.setGameLevels(arg.gameId,arg);

        if (func) {
            func(arg);
        }
    }
};
//LearnCS.getLevelAndRanking({gameId:11});
