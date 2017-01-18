var GameCS = GameCS || {};

///测试暂时还没有用这个文件

GameCS.getLevelStarNum = function(gameId){

    if(gameData.getGameValue(gameId,gameData.LevelInfoKey.starsList)){

    }else{
        var data = {
            body : {
                userId : userData.getValue(userData.key.memberId),
                gameId : gameId,
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

            gameData.data[param.gameId].gameId = args.gameId;
            gameData.data[param.gameId].starsList = args.starsList;
            gameData.data[param.gameId].isTest = args.isTest;
            gameData.data[param.gameId].isSettle = args.isSettle;


            gameData.setGameValue(gameId,gameData.LevelInfoKey.starsList,args.starsList);


            var game = new ManagerGame(args);
            cc.director.getRunningScene().addChild(game);
        }
        //NetManager.getMessage(data,callback, null, true);
        platformFun.httpPost(data,callback);
    }

}

GameCS.reportStarNum = function (args, func) {
    if(typeof(args.token) == "string"){
        var data = {
            body : {
                userId : userData.getValue(userData.key.memberId),
                gameId : args.gameID,
                level : args.level,
                stars : args.starNum,
                score : args.starNum,
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
                gameData.data[args.gameID].starsList[curStarsLength].gameId = args.gameID;
                gameData.data[args.gameID].starsList[curStarsLength].level = args.level;
                gameData.data[args.gameID].starsList[curStarsLength].score = args.starNum;
                gameData.data[args.gameID].starsList[curStarsLength].stars = args.starNum;
            }else {
                curStarsLength = args.level;
                gameData.data[args.gameID].starsList[curStarsLength].gameId = args.gameID;
                gameData.data[args.gameID].starsList[curStarsLength].level = args.level;
                gameData.data[args.gameID].starsList[curStarsLength].score = args.starNum;
                gameData.data[args.gameID].starsList[curStarsLength].stars = args.starNum;
            }

            // for (var k in gameData.data[args.gameID].starsList[curStarsLength]) {
            //     cc.log("--------key---",k,gameData.data[args.gameID].starsList[curStarsLength][k],typeof(gameData.data[args.gameID].starsList[curStarsLength][k]));
            // }

            func(param);
        }

        NetManager.getMessage(data,callback,null, false);
    }
    cc.log("-------------", args);
};

GameCS.submitTask = function(args) {
    var data = {
        body : {
            memberId : userData.getValue(userData.key.memberId),
            resultList : args.resultList,
        },
        token : userData.getValue(userData.key.token),
        url:"/homework/result",
    }
    // cc.log('data', data.body.resultList);
    NetManager.getMessage(data,function(){},false,false);
}

GameCS.submitTest = function(args,cbFun){
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
        var userjsondata = JSON.parse(param_data);
        cc.log("userjsondata-469-",userjsondata);
        var body = JSON.parse(userjsondata["body"]);
        var argsTest = {
            abilityHistory : body["abilityHistory"],
            rankRate : body["rankRate"],
            ability : body["ability"],
            abilityQuotient : body["abilityQuotient"],
            remainTestCount : body["remainTestCount"],
            abilityScores : body["abilityScores"],
            abilityTotalScore : body["abilityTotalScore"],
        };

        if(typeof(cbFun) == "function"){
    //     	for (var i = argsTest.abilityHistory.length - 1; i >= 0; i--) {
    //     		var abilityHistory = argsTest.abilityHistory[i];
    //     		for (var k in abilityHistory) {
				// 	cc.log("--------key---",k,abilityHistory[k],typeof(abilityHistory[k]));
				// }
    //     	};
            cbFun(argsTest);
        }
    }
    NetManager.getMessage(data,callback, null, false);
}

GameCS.reportGuideSettle = function (args, func) {
    if(typeof(args.token) == "string"){
        var data = {
            body : {
                userId : userData.getValue(userData.key.memberId),
                gameId : args.gameID,
            },
            token : userData.getValue(userData.key.token),
            url:"/game/run_guide",
        }

        function callback(param_data){
            var curStarsLength = util.getArrycount(gameData.data[args.gameID].starsList);
            gameData.data[args.gameID].starsList[curStarsLength].gameId = args.gameID;
            gameData.data[args.gameID].starsList[curStarsLength].level = args.level;
            gameData.data[args.gameID].starsList[curStarsLength].score = args.starNum;
            gameData.data[args.gameID].starsList[curStarsLength].stars = args.starNum;
            
            // for (var k in gameData.data[args.gameID].starsList[curStarsLength]) {
            //     cc.log("--------key---",k,gameData.data[args.gameID].starsList[curStarsLength][k],typeof(gameData.data[args.gameID].starsList[curStarsLength][k]));
            // }
            func();
        }

        NetManager.getMessage(data,callback,null, false);
    }
};


