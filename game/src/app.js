

//goBackGround(),goForeGround()这两个函数供ObjectC来调用
goBackGround = function(){
    cc.director.stopAnimation();
}
goForeGround = function(){
    cc.director.startAnimation();
}

var GameController =  GameController || {list:[],resLoadedList:{},curGameID:null};
GameController.gotoScene = function(gameArgs,callFun){
        
    gameArgs.userId = userData.getValue(userData.key.memberId);
    gameArgs.token = userData.getValue(userData.key.token);

    if (gameArgs.gameID == userData.actionEnum.GameHomeWork) {
        gameArgs.userId = userData.getValue(userData.key.childUserId);
    }

    var gameID = gameArgs.gameID;
    var gameRes = gameResConfig[String(gameID)];
    var resLoad = [];
    for(var k in gameRes.resource){
        resLoad.push(gameRes.resource[k]);
    }

    if (gameID != 10003 && gameID != 10004) {
        if (gameID == 7) {
            var level = gameArgs.level;
            var resArray = res.tangramLevel[level];
            for(var k in resArray){
                resLoad.push(resArray[k]);
            }
        }
    }else {
        for(var k in g_resources){
            resLoad.push(g_resources[k]);
        }     
    }
    
    var showLayer = function(hasGuide){        
        if(typeof(VIEW_CONFIG[String(gameID)]) == "object"){
            var color = VIEW_CONFIG[String(gameID)].bg_color;
            gameArgs.bg_color = cc.color(color.r,color.g,color.b,color.Opacity);            
        }
        if(typeof(callFun) == "function"){
            callFun();
        }
        gameData.setValue(gameData.key.curGameId,gameID);
        platformFun.reportDataGameIn(gameID);
        
        var scene = new cc.Scene();
        var bglayer = new cc.LayerColor(cc.color(255, 255, 255, 255));
        scene.addChild(bglayer,0);
        cc.log("gameArgs---",gameArgs);
        var layer = gameRes.testScene(gameArgs);
        scene.addChild(layer);
        cc.director.runScene(scene); 
    }

    if(this.curGameID == gameID){
        cc.LoaderScene.preload(resLoad, function () {
            showLayer();
        }, this); 
    }else{
        this.curGameID = gameID;
        GameController.unLoadRes();
        if(this.resLoadedList[gameID] === true){
            cc.loader.load(resLoad, function (err,results) {
                if(err){
                    return console.log(resLoad+"---->load failed,err:",err,gameID);
                }
                GameController.list = resLoad;
                showLayer();
            }, this);
        }else{ 
            cc.LoaderScene.preload(resLoad, function () {
                this.resLoadedList[gameID] = true;
                GameController.list = resLoad;       
                showLayer();
            }, this); 
        }
    }
}

var AppEnterFun = {
    onEnter : function (args) {
        // args = "action=10003&token=123&memberId=12&childUserId=12&gameList=[{\"gameId\":11,\"level\":1,\"abilityId\":5,\"hasGuide\":\"true\"},{\"gameId\":11,\"level\":1,\"abilityId\":5,\"hasGuide\":\"false\"},{\"gameId\":11,\"level\":1,\"abilityId\":5,\"hasGuide\":\"false\"}]";

        //userData.handleEnterCocosArgs(args);

        // args = "action=10004&token=123&memberId=12&childUserId=12&taskList=[{\"gameId\":11,\"level\":1,\"abilityId\":5,\"hasGuide\":\"true\"},{\"gameId\":11,\"level\":1,\"abilityId\":5,\"hasGuide\":\"false\"},{\"gameId\":11,\"level\":1,\"abilityId\":5,\"hasGuide\":\"false\"}]";

        // args = "action=10004&taskList=[{\"gameId\":11,\"level\":1,\"abilityId\":5,\"hasGuide\":\"true\"},{\"gameId\":11,\"level\":1,\"abilityId\":5,\"hasGuide\":\"false\"},{\"gameId\":11,\"level\":1,\"abilityId\":5,\"hasGuide\":\"false\"}]";

        //args = "action=10001&token=81d8267785ab472babf58915e58eb3d6&memberId=60";

        if(cc.sys.isNative){
            userData.handleEnterCocosArgs(args);    
        }
        
        //在浏览器中，切换网页会调用
        cc.eventManager.addCustomListener(cc.game.EVENT_HIDE, function () {
            cc.director.stopAnimation();
        });
        cc.eventManager.addCustomListener(cc.game.EVENT_SHOW, function () {
            cc.director.startAnimation();
        });

        isLocalData = LearnCS.judgeLocalData(false);

        var action = userData.getValue(userData.key.action);
        cc.log("---action====---",action,typeof(action));
        if(action == userData.actionEnum.GameTest){
            this.gotoLearnTestScene();
        }else if (action == userData.actionEnum.GameHomeWork) {
            this.gotoLearnTestGameListScene();
        }else{  
            userData.setValue(userData.key.action,userData.actionEnum.GameLobby);
            gameData.initGameData();
            this.gotoGameLobbyScene();
        }        
    },
    gotoGameLobbyScene : function(){
        this.showLobby = function () {
            // GameController.gotoScene({gameID:11,level:2});  
            // return;   
            var _levelConf = new PlayingKoiLevelSettings();         
            var scene = new cc.Scene();
            var args = {
                userId : userData.getValue(userData.key.memberId),
                token : userData.getValue(userData.key.token),
            }

            if (GameGlobals.getOnDebug() === false){
                if (isLocalData == true) {
                    scene.addChild(new GameLobbyLayer());
                }else {
                    if (gameData.firstGame == true) {
                        scene.addChild(new GameLobbyLayer(args));
                    }else {
                        scene.addChild(new GameLobbyLayer());
                    }              
                }
            }else{                
                var args = {
                    gameId : 11,
                    _isGuide : true,
                }
                scene.addChild(new ManagerGame(args));
            }            

            cc.director.runScene(scene);
        }
        var resLoad = [];
        //if (GameGlobals.getOnDebug() === false) {
            for(var k in g_resources){
                resLoad.push(g_resources[k]);
            }
        //}
        for(var k in res.game){
            resLoad.push(res.game[k]);
        }
        cc.LoaderScene.preload(resLoad, this.showLobby, this);
    },
    gotoLearnTestScene : function(){
        var args = {
            isTest : false,
            gameID : userData.actionEnum.GameTest,
            isFirstTest : userData.getValue(userData.key.isFirstTest),
            gameList : userData.getValue(userData.key.gameList),
            testId : userData.getValue(userData.key.testId),
        }
        GameController.gotoScene(args);
    },
    gotoLearnTestGameListScene : function(){        
        var args = {
            gameID : userData.actionEnum.GameHomeWork,
            isTest : false,
            taskList : userData.getValue(userData.key.TaskList),
        }
        cc.log("args---gotoLearnTestGameList",args);
        GameController.gotoScene(args);
    },
}

GameController.unLoadRes = function(){
    GameController.list.forEach(function(item){
        cc.loader.release(item);
    });
}

var gameResConfig = {
    1:{
        title:"序列方阵",
        resource:res.schulte,
        testScene:function (args) {
            return new SchulteGrid(args);
        },
    },
    2:{
        title:"数字排排坐",
        resource:res.numberCrash,
        testScene:function (args) {
            return new NumberCrash(args);
        },
    },
    3:{
        title:"颜色混淆",
        resource:res.colorMachine,
        testScene:function (args) {
            return new ColorMachine(args);
        },
    },
    4:{
        title:"海底世界",
        resource:res.seabed,
        testScene:function (args) {
            return new SeabedMobilze(args);
        },
    },
    5:{
        title:"位置记忆",
        resource:res.posMem,
        testScene:function (args) {
            return new PositionMemory(args);
        },
    },
    6:{
        title:"生字大比拼",
        resource:res.newWords,
        testScene:function (args) {
            return new NewWords(args);
        },
    },
    7:{
        title:"七巧板",
        resource:res.tangram,
        testScene:function (args) {
            return new SevenPuzzle(args);
        },
    },
    8:{
        title:"堆叠圆盘",
        resource:res.stackChart,
        testScene:function (args) {
            return new StackChart(args);
        },
    },
    9:{
        title:"画路",
        resource:res.paintedPath,
        testScene:function (args) {
            return new PaintedPath(args);
        },
    },
    10:{
        title:"捕鱼达人",
        resource:res.seabed,
        testScene:function (args) {
            return new SeabedWorld(args);
        },
    },
    11:{
        title:"喂鱼游戏",
        resource:res.koiGame,
        testScene:function (args) {
            return new PlayingKoiController(args).view;
        },
    },
    10003:{
        title:"学能测试",
        resource:res.learnTest,
        testScene:function (args) {
            return new ManagerLearnTest(args);
        },
    },
    10004:{
        title:"学能作业",
        resource:res.learnTask,
        testScene:function (args) {
            return new ManagerLearnTask(args);
        },
    }, 
}