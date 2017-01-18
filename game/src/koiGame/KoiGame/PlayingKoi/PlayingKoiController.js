
var PlayingKoiController = cc.Class.extend({
    isGameOver : null,
    hasGuide : null,
    delegateHomeWork : null,
    delegateLearnTest : null,
    timestampStart : null,
    ctor : function (argument) {
        argument = argument || {};
        var level = argument.level || 1;
        this._isGuide = argument.isGuide || false;
        this.hasGuide = false;
        if (argument.hasGuide == "true") {
            this.hasGuide = true;
            this._isGuide = true;
        }

        this.timestampStart = parseInt(new Date().getTime());

        var action = userData.getValue(userData.key.action);
        if (action == userData.actionEnum.GameHomeWork) {
            this.delegateHomeWork = argument.delegate;
        }else if(action == userData.actionEnum.GameTest){
            this.delegateLearnTest = argument.delegateLearnTest;
        }else{
            if (cc.sys.isNative) {
                if(util.getArrycount(gameData.data["11"].starsList) == 0){                
                    this.hasGuide = true;
                    this._isGuide = true;
                }                
            }
        }

        this.initMV();

        if (this.hasGuide) {
            this.model.lastLevel = level;
            level = 0;
        }

        this.view.doPondMoveIn(this.makeNewLevel.bind(this,level),0);
    },
    initMV : function(){
        this.settings = new PlayingKoiSettings( res.JsonPath.settings );
        //this.koi_level_settings = new PlayingKoiLevelSettings();
        //cc.log("--this.settings----",this._isGuide);
        this.model = new PlayingKoiModel(this.settings,this._isGuide);
        this.model.configColorList();
        this.view = new PlayingKoiView( this.settings, this.model, this );

        this._addListener();
    },
    initGame : function(){
        this.model.isGameReady = false;
        this.isGameOver = false;
        //this.model.assetIndex =  0;
        this.model.configColorList();
        cc.log("this.model._level, this.model._trial, this.model._gameLength",this.model._level, this.model._trial, this.model._gameLength);
        this.view.nextLevel(this.model._level, this.model._trial, this.model._gameLength);

        this._beginMetadataRound();
        this.model.score = 0;
        //cc.log("--this.modle--",this.model);

        // this.cue_startTrial();
        // this.cue_transitionPondColor();
    },
    onPause : function(){
        cc.audioEngine.setMusicVolume( 0 );
        this.model.isPaused = true;
        this.view.onPause();
    },
    onResume : function(){
        this.model.isPaused = false;
        this.view.onResume();
        this.view.showPond();
        cc.audioEngine.setMusicVolume( 1 );
    },
    onRestart : function()
    {
        //this.model._trial = 1;       
        this.initGame();
        this.view._containerView.setPositionX(0);
        this.view.changePondSceneCue();
        this.view.transitionPondColorCue();

        this.cue_startTrial();
        this.cue_transitionPondColor();
    },
    againHandle : function(){
        var self = this;
        self.model.isPaused = false;
        self.view.onRestart();
        cc.audioEngine.setMusicVolume( 1 );

        self.view._createGuideUI.removeGuideTip();
        if (self._viewGameSetting) {
            self._viewGameSetting.removeFromParent(true);
            self._viewGameSetting = null;
        }
        if(self._viewSettle){
            self._viewSettle.removeFromParent(true);
            self._viewSettle = null;                        
        }
        
        self.model.makeLevelConfig(self.model._level); 
        self.model._trial = 1;     
        self.model.assetIndex =  0;
        self.model.md_correctRounds = 0;
        self.view.doPondMoveIn(self.onRestart.bind(self),0.5);
    },
    onQuit : function(){

    },
    makeNewLevel : function(level){
        this.model.makeLevelConfig(level);
        this.model._trial = 1;     
        this.model.assetIndex =  0;      
        this.initGame();
        this.view._containerView.setPositionX(0);
        this.view.changePondSceneCue();
        this.view.transitionPondColorCue();

        this.cue_startTrial();
        this.cue_transitionPondColor();
    },

    cue_startTrial: function()
    {
        //ll.verbose ("................................. START TRIAL");
        this.view.startTrialCue();
        this.playingGame = true;
    },

    cue_changePondScene: function()
    {
        //ll.verbose ("................................. CHaNGE POND SCNE");
        this.view.changePondSceneCue();
    },

    cue_transitionPondColor: function()
    {
        //ll.verbose ("................................. TRANSITION POND COLOR");
        this.view.transitionPondColorCue();
    },

    cue_showTrial: function()
    {
        //ll.verbose ("................................. SHOW TRIAL");
        this.view.showTrialCue();
    },
    _addListener : function(){
        var self = this;
        this._touchFishListener = cc.EventListener.create({
            event: cc.EventListener.CUSTOM,
            eventName: CustomEvent.touchFishEvent.name,
            callback: function(event){
                var ud = event.getUserData();
                //cc.log("-----_addListener--ud=",ud);
                var touchPoint = ud[CustomEvent.touchFishEvent.userDataKey.touchPoint];
                var hitFishId = ud[CustomEvent.touchFishEvent.userDataKey.hitFishId];
                var fishColorValue = ud[CustomEvent.touchFishEvent.userDataKey.fishColorValue];

                self.interaction_received(hitFishId,fishColorValue);
            }
        });
        cc.eventManager.addListener(this._touchFishListener, 1);

        this._btnListener = cc.EventListener.create({
            event: cc.EventListener.CUSTOM,
            eventName: CustomEvent.settingBtnEvent.name,
            callback: function(event){
                var ud = event.getUserData();
                var btnEventName = ud[CustomEvent.settingBtnEvent.userDataKey.btnEventName];
                
                cc.log("-----_btnListener--btnEventName=",btnEventName);
                if(btnEventName == BtnEventName.paused){                

                    self.view.setViewVisible(false);
                    self.showSettingView();
                    if (self.model.isGuide === false) {
                        self.onPause();
                    }
                }else if (btnEventName == BtnEventName.resume){
                    if (self.model.isGuide === false) {
                        self.onResume();
                    }
                    self.view.setViewVisible(true);
                    if (self._viewGameSetting) {
                        self._viewGameSetting.removeFromParent(true);
                        self._viewGameSetting = null;
                    }
                }else if (btnEventName == BtnEventName.restart){
                    self.againHandle();
                }else if (btnEventName == BtnEventName.next){
                    if(self._viewSettle){
                        self._viewSettle.removeFromParent(true);
                        self._viewSettle = null;                        
                    }
                    self.model.md_correctRounds = 0;
                    var cEvent = new cc.EventCustom(CustomEvent.chooseLevelEvent.name);
                    var userData = {};
                    userData[CustomEvent.chooseLevelEvent.userDataKey.levelIndex] = self.model._level+1;
                    cEvent.setUserData(userData);
                    cc.eventManager.dispatchEvent(cEvent);
                }else if (btnEventName == BtnEventName.quit){
                    self.onQuit();                             
                }else if (btnEventName == BtnEventName.howToPlay){
                    cc.log("-----howToPlay====------"); 
                    self.model.isGuide = true;
                    self.model.makeLevelConfig(0);
                    self.againHandle();                   
                }else if (btnEventName == BtnEventName.againGuide){
                    self.againHandle();                  
                }else if (btnEventName == BtnEventName.chooseLevel){   
                    self.gameLevel = new GameLevelWidget();
                    self.gameLevel.setPositionX(-AppConfig.w);
                    self.view.addChild(self.gameLevel,PondLayerIndex.kLayerChooseLevel);

                    var actionBy = cc.moveBy(0.5,cc.p(AppConfig.w,0));
                    self.gameLevel.runAction(actionBy);
                }else{
                    
                }
            }
        });
        cc.eventManager.addListener(this._btnListener, 1);


        this._chooseLevelListener = cc.EventListener.create({
            event: cc.EventListener.CUSTOM,
            eventName: CustomEvent.chooseLevelEvent.name,
            callback: function(event){
                var ud = event.getUserData();
                var levelIndex = ud[CustomEvent.chooseLevelEvent.userDataKey.levelIndex];
                cc.log("-----_addListener--levelIndex=",levelIndex,self.model.isGuide);
                if (levelIndex > 30 || levelIndex < 0) {
                    levelIndex = 1;
                }
                self.view.onRestart();
                self.view.doPondMoveIn(self.makeNewLevel.bind(self,levelIndex),0.5);
            }
        });
        cc.eventManager.addListener(this._chooseLevelListener, 1);
    },

    onExit:function(){
        cc.eventManager.removeListener(this._touchFishListener);
        cc.eventManager.removeListener(this._btnListener);
        cc.eventManager.removeListener(this._chooseLevelListener);
    },

    _beginMetadataTrial: function()
    {
        this.model.md_trialRound = this.model.assetIndex + 1;
    },

    interaction_received:function(hitFishId,fishColorValue)
    {
       if (this.model.isGameReady === false) {
           cc.log("------isGameReady false===");
           return;
       }
 
       if (this.isGameOver) {
           return;
       }
       var mark = this.view.onClick(hitFishId,fishColorValue);
       //cc.log("------mark===",mark);
       if( mark <= 0){
           return;
       }
       this.model.md_numTries = this.model.md_numTries + 1;
       this.model.md_roundNumTries = this.model.md_roundNumTries + 1;

       if(mark > 0)
        {
            this.model._fishMarked = this.model._fishMarked + 1;
            if(this.model._fishMarked === this.model._numFish)
            {
                this.view._food._allDone = 1;
                this.isGameOver = true;
            }
            if (this.model.isGuide && this.model.assetIndex === 0) {
                if (this.model._fishMarked < this.model._numFish) {
                    this.model.isPointToNextFish = true;
                }else{
                    this.view._createGuideUI.goalTip();
                }
            }    
        }
        if(mark === 2)
        {
            this.model.md_numCorrect = this.model.md_numCorrect + 1;
            this.model.md_roundNumCorrect = this.model.md_roundNumCorrect + 1;
            this.model.md_numFishCorrect = this.model.md_numFishCorrect + 1;
        }
    },
    doneEating:function()
    {
        if(this.model._fishMarked === this.model._numFish && this.isGameOver && this.model.isDataFull === true)
        {
            this.isGameOver = false;
            this.playingGame = false;
            // all Correct?
            var allCorrect = 1;
            for(var i = 0; i < this.view._kois.length; i++)
            {
                //if(this.view._kois[i].model._hit === 0)
                cc.log("this.view._kois[i].model.onClickCorrect=  ",this.view._kois[i].model.onClickCorrect);
                if(this.view._kois[i].model.onClickCorrect === false)
                {
                    allCorrect = 0;
                    break;
                }
            }
            if(allCorrect === 1)
            {
                this.view.doWinAnim();
                var rF =  cc.CallFunc.create(this.reveal.bind(this,1), this);
                var seq = cc.Sequence.create(cc.DelayTime.create(0.7), rF);
                this.view.runAction(seq);
            }
            else
            {
                // Show Answers
                var rF =  cc.CallFunc.create(this.reveal.bind(this,0), this);
                var seq = cc.Sequence.create(cc.DelayTime.create(0.7), rF);
                this.view.runAction(seq);
            }
        }
    },
    reveal:function(allCorrect)
    {
        // Show Answers, then cue Outro, then load next level
        var revealCtr = 0.25;
        var revealDelta = 0.25;

        if(allCorrect === 1)
        {
            for(var i = 0; i < this.view._kois.length; i++)
            {
                var rF =  cc.CallFunc.create(this.doH.bind(this, i, Highlights.AllCorrect), this);
                var seq = cc.Sequence.create(cc.DelayTime.create(revealCtr), rF);
                this.view.runAction(seq);
                revealCtr = revealCtr + revealDelta;
            }
        }
        else
        {
            for(var i = 0; i < this.view._kois.length; i++)
            {
                if(this.view._kois[i].model._hit === 0)
                {
                    var rF =  cc.CallFunc.create(this.doH.bind(this, i, Highlights.Reveal), this);
                    var seq = cc.Sequence.create(cc.DelayTime.create(revealCtr), rF);
                    this.view.runAction(seq);
                    revealCtr = revealCtr + revealDelta;
                }
            }
            this.view.doingLoseAnim = 1;
       }
        // Cue doFoodViewOutAnim
        //this.view.doFoodViewOutAnim();

        // now ready to go to next level
        var rF =  cc.CallFunc.create(this.nextLevel.bind(this, allCorrect), this);
        var seq = cc.Sequence.create(cc.DelayTime.create(1.0 + revealCtr), rF);
        this.view.runAction(seq);
    },

    _beginMetadataRound:function()
    {
        this.model.md_roundLevel = this.model._level;
        this.model.md_roundRound = this.model.assetIndex + 1;
        this.model.md_roundFish = this.model._numFish;
        this.model.md_roundDistractors = 0;
        this.model.md_roundNumTries = 0;
        this.model.md_roundNumCorrect = 0;
        this.model.md_roundNumClicks = 0;
        this.model.md_roundStartTime = 3;
    },
    doH:function(index, highlight)
    {
        if(index === 0 && highlight === Highlights.AllCorrect)
        {
            cc.audioEngine.playEffect("res/koiGame/sounds/PlayingKoi_levelComplete.mp3");
        }
        else if(highlight != Highlights.AllCorrect )
        {
            cc.audioEngine.playEffect("res/koiGame/sounds/PlayingKoi_levelIncomplete.mp3");
        }

        if(index === this.view._kois.length - 1 && highlight === Highlights.AllCorrect) {
            LumosityUtils.executeDelayedFunction(this.playEndSound, 1.0, this.view);
        }
        this.view._kois[index].view.doHighlight(highlight);
    },
    nextLevel:function(allCorrect)
    {
        this.cheatingUp = false;
        this.model.resetLevel();

        if(allCorrect)
        {
            this.model.makeAdvanceLevelConfig();
            this.model.md_correctRounds = this.model.md_correctRounds + 1;
            this.view.setProgressState(this.model._trial-1,true);
        }
        else
        {
            this.model.makeDemoteLevelConfig();
            this.view.setProgressState(this.model._trial-1,false);
        }
        //cc.log("---this.model._trial = this.model._gameLength=",this.model._trial , this.model._gameLength);

        if(this.model._trial > this.model._gameLength )
        {
            this.view.doPondMoveOut(this.showSettleView.bind(this));
            return;
        }

        this.model.assetIndex = this.model.assetIndex + 1;
        var fun = function(){            
            //cc.log("---this.model._trial=",this.model._trial);

            // STILL PLAYING, so set things up
            //this.view.playAnimation("nextTrial");//在父类中,上一场景下拉，本次场景下拉

            //this.view.nextLevel(this.model._level, this.model._trial, this.model._numFish);
            this._beginMetadataRound();
            this.onRestart();
        }
        this.view.doPondMoveOutAndMoveIn(fun.bind(this));
        //fun.call(this);
    },
    showSettingView : function(){
        var delegate = false;
        var action = userData.getValue(userData.key.action);
        if (action == userData.actionEnum.GameHomeWork) {
            delegate = this.delegateHomeWork;
        }else if(action == userData.actionEnum.GameTest){
            delegate = this.delegateLearnTest;
        }
        var args = {
            delegate : delegate,
            gameID : 11,
            // isTest : self._args.isLearnTest,
            // userId : self._args.userId,
            // token : self._args.token,
            // isGameTest : self._args.isTest,
            // starsList : self._args.starsList, 
            // level : self._args.level,
        }
        this._viewGameSetting = new GameSetting(args);
        if (this.model.isGuide) {
            this._viewGameSetting.setGuideHelp();
        }
        //this.view._containerView.addChild(this._viewGameSetting,PondLayerIndex.kLayerSettingUI);
        this.view.addChild(this._viewGameSetting,PondLayerIndex.kLayerSettingUI);
    },
    taskSettle: function (args) {
        var starNum = this.model.getStarNum();
        var action = userData.getValue(userData.key.action);
        var delegate = null;
        if (action == userData.actionEnum.GameHomeWork) {
            delegate = this.delegateHomeWork;
        }else if (action == userData.actionEnum.GameTest) {
            delegate = this.delegateLearnTest;
        }
        delegate.recordStarNum(delegate,starNum);    
        args.delegate = delegate;
        this._viewSettle = new ViewSettle(args);
        if(delegate.IsLastTask(delegate) == true){
            this._viewSettle.showBtnSubmit();
        }
        // this._viewSettle.setHandleAgain(this,this.handleAgain);
        this._viewSettle.setHandleNext(delegate,delegate.HandleNextGame);

        this._viewSettle.showStar(starNum);
        var str = this.model.md_correctRounds+'/'+this.model._gameLength+'正确';
        this._viewSettle.setResTipText(str);
        this.view.addChild(this._viewSettle,PondLayerIndex.kLayerSettingUI);        
    },
    showSettleView : function(){
        this.onPause();
        this.view.destroyLevel();
        this.view.setViewVisible(false);
        //cc.director.getActionManager().removeAllActions();

        var action = userData.getValue(userData.key.action);
        if (action == userData.actionEnum.GameHomeWork) {
            if (this.hasGuide) {//作业中有新手引导
                this.showGuideSettle();
            }else{
                if (this.model.isGuide) {//自己点击新手引导
                    this.showGuideSettle();
                }else{
                    var param = {
                        gameID : 11,
                        level : this.model._level,
                        starNum : this.model.getStarNum(),
                        hasPassed : false,
                    }
                    if (param.starNum > 0) {
                        param.hasPassed = true;
                    }
                    this.taskSettle(param);
                }
            }
            return;
        }else if (action == userData.actionEnum.GameTest) {
            if (this.hasGuide) {//游戏测评中有新手引导
                this.showGuideSettle();
                //this.taskSettle();
            }else{
                if (this.model.isGuide) {//自己点击新手引导
                    this.showGuideSettle();
                    //this.taskSettle();
                }else{
                     this.delegateLearnTest.HandleStartTest(this.delegateLearnTest, false);
                }
            }
            return;
        }

        if (this.model.isGuide) {
            this.showGuideSettle();
            return;
        }
        var self = this;
        var settleView = function(){            
            var param = {
                gameID : 11,
                level : self.model._level,
                starNum : self.model.getStarNum(),
                hasPassed : false,
                // userId : this._args.userId,
                // token : this._args.token,
            }
            if (param.starNum > 0) {
                param.hasPassed = true;
            }
            self._viewSettle = new SettleView(param);
            var txt = "正确："+self.model.md_correctRounds+"/"+self.model._gameLength;
            self._viewSettle.setResTipText(txt);
            self._viewSettle.showStar(param.starNum);

            //this._viewSettle.setHandle(this,this.handleNext,this.handleAgain);
            self.view.addChild(self._viewSettle,PondLayerIndex.kLayerSettingUI);
        }
        var param = {
            gameID : 11,
            level : this.model._level,
            starNum : this.model.getStarNum(),
            // userId : this._args.userId,
            // token : this._args.token,
            timestampStart : this.timestampStart,
            isAddLevel : false,
        }
        //LearnCS.reportStarNum(param, settleView);

        var starsArray = gameData.data["11"].starsList;
        var curStarsLength = util.getArrycount(starsArray);
        if(GameGlobals.getOnDebug()){
            settleView();
        }else{
            if (this.model._level == (curStarsLength + 1)) {
                //新关卡
                param.isAddLevel = true;
                gameData.data["11"].starsList[curStarsLength+1] = {};
                LearnCS.reportStarNum(param, settleView);
            }else if (param.starNum > starsArray[this.model._level].stars) {
                //已有关卡
                param.isAddLevel = false;
                LearnCS.reportStarNum(param, settleView);
            }else {
                settleView();
            }            
        }
    },

    showGuideSettle: function () {
        var args = {
            gameID:11,
            level:0,
            hasPassed : false,
            starNum : 0,
            incScore : 0,
            displayRank : false,
            rankPercentage : 0,
        };
        if (this.model.getGuideResult() == false) {
            args.gameType = "失败了！";
        }else {
            args.gameType = "非常好！";
        }

        var gSettle = new GuideSettle(args);
        // gSettle.setHandleAgain(this, this.againGuide);
        
        var action = userData.getValue(userData.key.action);
        var starNum = util.getArrycount(gameData.data[11].starsList);
        var self = this;
        var fun = function(){
            var args = {
                gameID : 11,
            }
            if (action == 10004){
                args.isTask = true;
            }

            self.model.isGuide = false;
            //是否需要汇报新手引导
            var reportCbFun = function(){                
                //点击关闭按钮，回到那个界面
                if (action == 10004){//userData.actionEnum.GameHomeWork) {
                    self.delegateHomeWork.HandleShowViewStart(self.delegateHomeWork, false);
                }else if(action == 10003){//userData.actionEnum.GameTest){            
                    self.delegateLearnTest.HandleStartTest(self.delegateLearnTest, true);
                }
            }
            if (self.hasGuide) {
                if (action == 10004 || action == 10003) {
                    LearnCS.reportGuideSettle(args,reportCbFun);
                }else{                    
                    var args = {
                        gameID : 11,
                        level : 1,
                        starNum : 0,
                        timestampStart : self.timestampStart,
                        isAddLevel : false,
                    }
                    gameData.data["11"].starsList = {};
                    gameData.data["11"].starsList["1"] = {};
                    LearnCS.reportStarNum(args, self.beginGame.bind(self)); 
                }
            }else{             
                if (action == 10004 || action == 10003) {
                    reportCbFun();   
                }else{
                    self.beginGame();
                }
            }
        }
        var cbFun = fun.bind(this);
        gSettle.setHandleEnd(this, fun);
        //this.addChild(gSettle);
        this.view.addChild(gSettle,PondLayerIndex.kLayerSettingUI);
    },
    beginGame: function () {        
        var args = {
            gameId : 11,
            level : this.model.lastLevel,
            //starsList : this._args.starsList,
            //isTest : this._args.isTest,
            // userId : this._args.userId,
            // token : this._args.token,
            isGuide : true,
            isPassGuide : true,
            isSettle : true,
        };
        var game = new ManagerGame(args);
        //cc.director.getRunningScene().addChild(game,10000);
        cc.director.getRunningScene().addChild(game);
    },
});