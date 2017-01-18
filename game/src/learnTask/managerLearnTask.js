
var ManagerLearnTask = cc.Layer.extend({
    ctor:function (args) {
        this._super();
        args = args || {};
        this._args = args;
        this._args.memberId = args.userId;
        this.taskList = args.taskList;
        
        this._isTest = true;
        if(args.isTest === false){
            this._isTest = false;
        }

        for (var i = 0; i < this.taskList.length; i++) {
            this.taskList[i].stars = 0;
        };

        this.runGameIndex = args.runGameIndex || 0;

        if (util.getArrycount(args.taskList) == 0 || args.taskList == null) {
            var tip = new AlertTip();
            this.addChild(tip);
            tip.setUIAttr(true);
            return;
        }
        this.init();
        return true;
    },
    init:function(){
        this.setEqualGameGuide();
        this.HandleShowViewStart(this);
    },

    IsLastTask:function(self){
        return (self.runGameIndex === (self.taskList.length-1));
    },
    recordStarNum:function(self,starNum){
        cc.log('starNum===',starNum);
        
        if(starNum > 0){
            self.taskList[self.runGameIndex].isPassed = true;
        }else{
            self.taskList[self.runGameIndex].isPassed = false;
        }

        if(self.taskList[self.runGameIndex].stars < starNum){
            self.taskList[self.runGameIndex].stars = starNum;
        }
    },

    setEqualGameGuide: function () {
        var taskLength = this.taskList.length;
        for (var i = 0; i < taskLength-1; i++) {
            var taskGame1 = this.taskList[i];
            for (var j = i+1; j < taskLength; j++) {
                var taskGame2 = this.taskList[j];
                if (taskGame1.gameId == taskGame2.gameId && taskGame1.hasGuide == "true" && taskGame2.hasGuide == "true") {
                    this.taskList[j].hasGuide = "false";
                }
            };
            
        };
    },

    HandleShowViewStart:function(self, guide){
        var args = {
           gameID : self.taskList[self.runGameIndex].gameId,
           level : self.taskList[self.runGameIndex].level,
           gameNum : self.taskList.length,
        };  
        if (guide == false) {
            args.hasGuide = "false";
        }else {
            args.hasGuide = self.taskList[self.runGameIndex].hasGuide;
        }

        self._viewStartting = new ViewStartting(args);
        var scene = cc.director.getRunningScene();
        cc.log('---task start args---',args,scene,self.runGameIndex); 
        if (scene == null) {            
        //if(self.runGameIndex <= 0){
             self.addChild(self._viewStartting);
        }else {
            cc.director.getRunningScene().addChild(self._viewStartting,9000);
            //scene.addChild(self._viewStartting,9000);
        }
      
        self._viewStartting._viewTop.setHandleBack(self,self.backApp);
        var removeViewHelp = function(delegate){
                var param = {
                    level:0,
                    delegate : self,
                    gameID : args.gameID,
                    isTest : self._isTest,
                    isGuide : true,
                };
                GameController.gotoScene(param);
        }
        self._viewStartting._viewTop.setHandleHelp(self,removeViewHelp);

        var gotoGame = function(delegate){
            var param = {
                gameID : args.gameID,
                level : args.level,
                delegate : self,
                hasGuide : args.hasGuide,
            };
            cc.log("------- param hasGuide ---------", param.hasGuide);
            GameController.gotoScene(param,function(){
                self.removeViewStartting(self);
            }); 
        }
        self._viewStartting.setHandleStartGame(self,gotoGame);

        if(self.runGameIndex > 0){
            self._viewStartting._viewTop.setHideBtnBack();
        }
        var ctl = self._viewStartting.progress;
        for (var i = 0; i < self.taskList.length; i++) {
            var state = self.taskList[i].isPassed;
            if(typeof(state) == 'boolean'){
                if(state == true){
                    ctl.setCircleTexture(i,ctl.RIGHT);
                }else{
                    ctl.setCircleTexture(i,ctl.WRONG);
                }
            }else{
                break;
            }
        };
        ctl.setCircleTexture(self.runGameIndex,ctl.CURRENT);
    },
    HandleNextGame:function(self){        
        cc.log('---HandleNextGame',cc.director.getRunningScene());
        self.runGameIndex += 1;
        cc.log('self.runGameIndex--',self.runGameIndex);
        self.HandleShowViewStart(self);
    },
    removeViewStartting:function(self){
        self._viewStartting.removeFromParent(true);
        //cc.director.getRunningScene().getChildByName('ViewStartting').removeFromParent();
    },

    backApp: function (self) {
        self._viewStartting.removeFromParent(true);
        platformFun.backToApp();
    },

    getTaskList:function(self){
        return self.taskList;
    },
    getGameNum:function(self){
        return self.taskList.length;
    },
    showViewTip:function(self){
        var args = {
            tipText : "确定要放弃进度，离开学能作业吗？",
        }
        self.viewTip = new ViewLeaveTip(args);
        cc.director.getRunningScene().addChild(self.viewTip);
        self.removeViewTip = function(param_self){
            param_self.viewTip.removeFromParent();
            platformFun.backToApp();
        }
        self.viewTip.setHandleLeave(self,self.removeViewTip);
    },

    submitTask:function(self){
        var args = {
            memberId : self._args.memberId || 37,
            resultList : self.taskList,
            token : self._args.token,
        }
        LearnCS.submitTask(args);
    },

    onExit: function () {
        cc.log('-------- task controller onExit --------');
        this._super();
    },
});