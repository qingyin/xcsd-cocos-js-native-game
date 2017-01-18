
var ManagerLearnTest = cc.Layer.extend({
    ctor:function (args) {
        this._super();
        args = args || {};
        this.args = args;

        if (args.isTest == false) {
            this.args.isTest = false;
        }else {
            this.args.isTest = true;
        }

        this.curUserId = this.args.userId;
        this.ability = new Array();
        for (var i = 1; i <= TEST_TYPE_COUNT; i++) {
            this.ability[i] = 0;
        };

        for (var i = 0; i < this.args.gameList.length; i++) {
            this.args.gameList[i].result = 2;
        };

        this.doingLearnTestIndex = -1;
        cc.log("----args test----", args);
        this.init();
        return true;
    },
    init:function(){
        if (this.args.gameList.length == 0) {
            var tip = new AlertTip();
            this.addChild(tip);
            tip.setUIAttr(false);
            return;
        }else {
            this.setEqualGameGuide();
            this.HandleStartTest(this, false);
        }
    },

    setEqualGameGuide: function () {
        var taskLength = this.args.gameList.length;
        for (var i = 0; i < taskLength-1; i++) {
            var taskGame1 = this.args.gameList[i];
            for (var j = i+1; j < taskLength; j++) {
                var taskGame2 = this.args.gameList[j];
                if (taskGame1.gameId == taskGame2.gameId && taskGame1.hasGuide == "true" && taskGame2.hasGuide == "true") {
                    this.args.gameList[j].hasGuide = "false";
                }
            };
            
        };
    },

    HandleStartTest:function(self, isGuide){
        var needGuide = null;

        if (isGuide != true) {
            self.doingLearnTestIndex += 1;
        }
        
        var testList = self.args.gameList;

        if (isGuide == true) {
            needGuide = "false";
        }else {
            needGuide = testList[self.doingLearnTestIndex].hasGuide;
        }
        
        if (util.getArrycount(testList) == 0 || testList == null) {
            cc.log("-------- test not have game ---------");
            return;
        }
        var args = {
            gameID : testList[self.doingLearnTestIndex].gameId,
            gameCount : testList.length,
            gameIndex : self.doingLearnTestIndex,
        }
        self.viewStartGame = new StartGameView(args);
        var scene = cc.director.getRunningScene();
        if (scene == null) {
            self.addChild(self.viewStartGame);
        }else {
            cc.director.getRunningScene().addChild(self.viewStartGame);
        }

        var gotoGame = function(delegate){ 
            var param = {
               gameID : args.gameID,
               level : testList[self.doingLearnTestIndex].level,
               delegate : self,
               isLearnTest:true,
               isFirstTest:false,
               delegateLearnTest : self,
               hasGuide : needGuide,
            };
            if(self.args.isFirstTest == true){
                param.isFirstTest = true;
                param.level = 1;
            }

            GameController.gotoScene(param,function(){
                self.removeViewStartGame(self);
            });
        }
        self.viewStartGame.setHandleStart(self,gotoGame);

        if(self.doingLearnTestIndex > 0){
            self.viewStartGame._viewTop.setHideBtnBack();
            self.viewStartGame.setBtnTitleText();
        }else{
            var removeViewStartGameFun = function(self){                
                self.doingLearnTestIndex -= 1;
                self.viewStartGame.removeFromParent(true);
                platformFun.backToApp();
            }
            self.viewStartGame._viewTop.setHandleBack(self,removeViewStartGameFun); 
        }

        var removeViewHelp = function(delegate){
            var param = {
                gameID : args.gameID,
            }
            delegate.addHelpView = function () {
                var param = {
                    level:0,
                    delegate : self,
                    delegateLearnTest : self,
                    gameID : args.gameID,
                    isTest : self.args.isTest,
                    isLearnTest : true,
                    isGuide : true,
                };
                GameController.gotoScene(param);
            }
            var helpRes = res.gameHelp[args.gameID];
            LoadResource.loadingResourses(helpRes, delegate, delegate.addHelpView);
        }
        self.viewStartGame._viewTop.setHandleHelp(self,removeViewHelp);
    },
    removeViewStartGame:function(self){
        self.viewStartGame.removeFromParent(true);
        cc.log('----removeViewStartGame');
    },
    IsLastLearnTest:function(self){
        var testList = self.args.gameList;
        return (self.doingLearnTestIndex === (testList.length-1));
    },
    recordLearnTestRes:function(self,isPass,abilityLevel){
    
        var gameID = self.args.gameList[self.doingLearnTestIndex].gameId;

        if (isPass == true) {
            switch (gameID) {
                case 1:
                case 4:
                    self.ability[1] = abilityLevel+2;
                    break;
                case 2:
                    self.ability[4] = abilityLevel+2;
                    break;
                case 3:
                    self.ability[3] = abilityLevel+2;
                    break;
                case 5:
                case 6:
                    self.ability[2] = abilityLevel+2;
                    break;
                case 7:
                    self.ability[5] = abilityLevel+2;
                    break;
            }

            self.args.gameList[self.doingLearnTestIndex].result = 1;
        }else {
            self.args.gameList[self.doingLearnTestIndex].result = 0;
        }
        
        cc.log('abilityLevel===', gameID, abilityLevel,self.doingLearnTestIndex);
        
    },
    showViewSettleTest:function(self){
        var cbFun = function(args){
            var settleArgs = {
                testGrade:args.testGrade,
                abilityHistory:args.abilityHistory,
                totalGrade:args.totalGrade,
            }

            var isSettle = true;
            self.viewSettleTest = new SettleTestView(settleArgs, isSettle);
            cc.director.getRunningScene().addChild(self.viewSettleTest);
            self.removeViewSettleTestFun = function(param_self){
                platformFun.backToApp();
            }
            self.viewSettleTest._viewTop.setHandleBack(self,self.removeViewSettleTestFun);
        }
        if(self.args.isTest == false){
            self.submitTest(cbFun);
        }else{
            var args = {
                abilityHistory:[
                    {key:1, value:140},
                    {key:2, value:240},
                    {key:3, value:320},
                    {key:4, value:420},
                    {key:5, value:430},   
                    {key:6, value:680}
                ],
            }
            cbFun(args);
        }
    },

    showViewTip:function(self,settingDelegate,gameDelegate) {
           
            var args = {
                tipText : "测试在限定时间内只有一次机会，" + "\n" + "确定要离开吗？",
            }
            self.viewTip = new ViewLeaveTip(args);
            self.viewTip.setBtnLeaveTitle();
            // cc.director.getRunningScene().removeAllChildren();
            cc.director.getRunningScene().addChild(self.viewTip);
            self.removeViewTip = function(param_self){
                param_self.viewTip.removeFromParent();
                var deletePause = function () {
                    settingDelegate.removeFromParent();
                }
                
                gameDelegate.removeFromParent(true);
                self.doingLearnTestIndex = -1;
                platformFun.backToApp();
            }
            self.viewTip.setHandleLeave(self,self.removeViewTip);
    },

    submitTest : function(callback){
        if (this.args.isFirstTest == true) {
            this.ticklingAbility();
        }

        // for (var i = 0; i < this.args.gameList.length; i++) {
        //     cc.log("------- submitTest test --------", this.args.gameList[i]);
        // };

        var args = {
            userId : this.curUserId,
            testId : this.args.testId,
            testList : this.args.gameList,
            token : this.args.token,
        }
        // cc.log("------11",args);
        LearnCS.submitTest(args,callback);
    },


    ticklingAbility: function () {
        var testList = this.args.gameList;
        for (var i = 0; i < testList.length; i++) {
            var gameID = testList[i].gameId;
            switch (gameID) {
                case 1:
                    this.args.gameList[i].abilityLevel = this.ability[1];
                    break;
                case 4:
                    this.args.gameList[i].abilityLevel = this.ability[1];
                    break;
                case 2:
                    this.args.gameList[i].abilityLevel = this.ability[4];
                    break;
                case 3:
                    this.args.gameList[i].abilityLevel = this.ability[3];
                    break;
                case 5:
                    this.args.gameList[i].abilityLevel = this.ability[2];
                    break;
                case 6:
                    this.args.gameList[i].abilityLevel = this.ability[2];
                    break;
                case 7:
                    this.args.gameList[i].abilityLevel = this.ability[5];
                    break;
            }
        };
    },

});