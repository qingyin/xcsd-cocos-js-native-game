
var NewWords = cc.Layer.extend({
    ACTION_TIME_PROGRESS:1,
    _view:null,
    gameState:null,
    _var:{
        roundNum:null,
        roundIndex:null,
        roundRightNum:null,
        targetDesc:null,
        shownTime:null,
        upEle:null,
        downEle:null,
        needFoundEleNum:null,
        hadFoundEleNum:0,
        title:null,
        gameTime:null,
        startTimeFlag:null,
    },
    ctor:function (args) {
        this._super();

        args = args || {};
        this._var.roundIndex = 0;
        this._var.roundRightNum = 0;
        this._var.plyaRound = 0;
        this._var.startTimeFlag = false;

        this._args = args;
        this._args.gameID = args.gameID;
        this._args.level = args.level;
        this._args.timestampStart = parseInt(new Date().getTime());
        this._args.delegate = args.delegate || false;

        this._args.isLearnTest = args.isLearnTest || false;
        this._args.isFirstTest = args.isFirstTest || false;
        this._args.delegateLearnTest = args.delegateLearnTest || false;

        this._var.gameTime = 0;

        this._isPause = false;

        this._view = new NewWordsView(args.bg_color);
        this._view._topView.setHandlePause(this,this.onPauseBtnEvent);
        this._view.setCellHandle(this,this.setHandleCell);
        this.addChild(this._view);

        //this.getConfig(this._args.level,this._var.roundIndex);

        this._isGuide = args.isGuide || false;
        if (args.hasGuide == "true") {
            this._hasGuide = true;
        }else {
            this._hasGuide = false;
            this._args.timestampStart = parseInt(new Date().getTime());
        }
        if ((this._args.delegate == false && util.getArrycount(gameData.data[this._args.gameID].starsList) == 0 && gameData.testEditionGuide(this._args.level)) || (this._isGuide == true) || (this._hasGuide == true)) {
            //新手引导
            this._rightArray = new Array();
            this._guideArray = new Array();
            this._isAppoint = 1;
            this.sureGuide(0);
        }else {
            this.runOneRound(0.4, this._args.level);
            this.scheduleUpdate();
        } 
    },


    //-------------------------------------------------------//
    //--------------------- 新手引导 -------------------------//
    //-------------------------------------------------------//

    sureGuide: function (indexTip) {
        this.stopAllActions();
        this._isGuide = true;
        this.guideLevel = 0;
        this._view._topView.setVisible(true);
        this._view.hideProgress(); 
        this.dTime = this.beginGuide(indexTip);

    },

    beginGuide: function (indexTip) {
        this.setTipArray(GAME_GUIDE_TIP[this._args.gameID].guideTip[indexTip], true, 0);
        this.guide = new PlayerGuide(this._guideArray);
        this.guide.x = this._view.width*0.5 - this.guide.width*0.5;
        this.guide.y = this._view._lblTargetDes.y - this._view._lblTargetDes.height*0.5;
        this._view.addChild(this.guide, 10);
        this._view._progressBar.setVisible(false);
        this.runOneRound(3, this.guideLevel);
        return 3.0;
    },

    setTipArray: function (tip, isRect, verticesType) {
        this._guideArray.tip = tip;
        this._guideArray.isRect = isRect;
        this._guideArray.verticesType = verticesType;
    },

    goalTip: function () {
        switch (this._isAppoint) {
            case 1:
                this._view._lblTargetDes.setVisible(true);
                this._view._topView._btn_pause.setTouchEnabled(false); 

                this.guide.removeTip();
                this.setTipArray(GAME_GUIDE_TIP[this._args.gameID].guideTip[1], false, 1);
                this.guide.init(this._guideArray);
                this.guide.x = this._view.width*0.5 - this.guide.width*0.5;
                var upCellPos = this._view._upLayer.convertToWorldSpace(this._view._upCellArray[0]);
                this.guide.y = upCellPos.y - this._view._upCellArray[0].height*0.5 - this.guide.height - 10;

                var ccp1 = cc.p(upCellPos.x - this._view._upCellArray[0].width*0.5 - 5, upCellPos.y - this._view._upCellArray[0].height*0.5 - 5);
                var ccp2 = cc.p(upCellPos.x + this._view._upCellArray[0].width*0.5 + 5, upCellPos.y + this._view._upCellArray[0].height*0.5 + 5);
                var rectCCP = [ccp1, ccp2];
                this.guide.addClipping(this._view, rectCCP, 1);

                this._isAppoint = 2;
                break;
            case 2:
                this.guide.removeTip();
                this.getRightCells();
                this._isAppoint = 3;
                break;
            case 3:
                this.setTipArray(GAME_GUIDE_TIP[this._args.gameID].guideTip[2], false, 4);
                this.guide.init(this._guideArray);
                this.guide.x = this._view.width*0.5 - this.guide.width*0.5;
                this.guide.y = this._view._downLayer.y + this._view._downLayer.height*0.5 + 20;

                this.guide.removeClipping();
                var ccp1 = cc.p(0, this._view._downLayer.y - this._view._downLayer.height*0.5 - 10);
                var ccp2 = cc.p(this.width, this._view._downLayer.y + this._view._downLayer.height*0.5 + 10);
                var rectCCP = [ccp1, ccp2];
                this.guide.addClipping(this._view, rectCCP, 1);

                this.showRightCells();

                
                var targetPos = this._view._downLayer.convertToWorldSpace(this._rightArray[0]);
                var targetSize = this._rightArray[0].getContentSize();
                this._view.addGuideHand(targetPos, targetSize);
                this._isAppoint = 4;
                break;
            case 4:
                this._view.hand.stopAllActions();
                this._view.hand.removeFromParent(true);
                this._view.hand = null;

                this.clickCell(this._rightArray[1]);
                var targetPos = this._view._downLayer.convertToWorldSpace(this._rightArray[1]);
                var targetSize = this._rightArray[1].getContentSize();
                this._view.addGuideHand(targetPos, targetSize);

                this._isAppoint = 5;
                break;
            case 5:
                this._view.hand.stopAllActions();
                this._view.hand.removeFromParent(true);
                this._view.hand = null;
                var cells = new Array();
                cells[0] = this._rightArray[0];
                cells[1] = this._rightArray[1];
                this.notClickCells(cells);

                this._isAppoint = 6;
                break;
            case 6:
                this.guideSettle(true);
                this._isAppoint = 7;
                break;
        }
    },

    guideSettle: function (guideType) {
        this.removeRightArray();
        if (this.guide) {
            this.guide.removeTip();
            this.guide.removeClipping();
            this.guide.removeFromParent(true);
            this.guide = null;
        }
        
        this._view._topView._btn_pause.setTouchEnabled(true);
        this.stopAllActions();
        this._isAppoint = 1;

        var args = {
            gameID:this._args.gameID,
            level:this._args.level,
            hasPassed : false,
            userId : this._args.userId,
            token : this._args.token,
            isGameTest : this._args.isTest,
            starsList : this._args.starsList,
            starNum : 0,
            incScore : 0,
            displayRank : false,
            rankPercentage : 0,
        }; 

        if (guideType == false) {
            args.gameType = "失败了！";
        }else {
            args.gameType = "非常好！";
        }

        var gSettle = new GuideSettle(args);
        gSettle.setHandleAgain(this, this.againGuide);
        gSettle.setHandleEnd(this, this.endGuide);
        this.addChild(gSettle);

    },

    beginGame: function () {
        var args = {};
        if (this._args.level != 0) {
            args = {
                gameId : this._args.gameID,
                level : this._args.level,
                starsList : this._args.starsList,
                isTest : this._args.isTest,
                userId : this._args.userId,
                token : this._args.token,
                isSettle : false,
                isGuide : this._isGuide,
                isPassGuide : true,
            };
        }else {
            args = {
                gameId : this._args.gameID,
                starsList : this._args.starsList,
                isTest : this._args.isTest,
                userId : this._args.userId,
                token : this._args.token,
                isSettle : true,
            };
        }
        var game = new ManagerGame(args);
        cc.director.getRunningScene().addChild(game);
    },

    taskOrTestStartGame: function () {
        if (this._args.isLearnTest == true) {
            var delegate = this._args.delegateLearnTest;
            delegate.HandleStartTest(delegate, this._isGuide);
        }else {
            this._args.delegate.HandleShowViewStart(this._args.delegate, false);
        }
    },

    againGuide: function (self) {
        self.reStartSettle();
        self._isAppoint = 1;
        self.sureGuide(0);
    },

    endGuide: function (self) {
        var guideArgs = {
            gameID:self._args.gameID,
            level : self._args.level,
            starNum : 0,
            timestampStart : self._args.timestampStart,
        }
        if (self._args.delegate == false) {
            var gameStart = function () {
                self.beginGame();
            }

            if (util.getArrycount(gameData.data[self._args.gameID].starsList) == 0) {
                var starsArray = gameData.data[self._args.gameID].starsList;
                var curStarsLength = util.getArrycount(starsArray);
                guideArgs.isAddLevel = true;
                gameData.data[self._args.gameID].starsList[curStarsLength+1] = {};
                LearnCS.reportStarNum(guideArgs, gameStart);
            }else {
                gameStart();
            }
        }else {
            var gameStart = function () {
                self.taskOrTestStartGame();
            }
            if (self._hasGuide == true) {
                guideArgs.isTask = (self._args.isLearnTest == true) ? false : true;
                LearnCS.reportGuideSettle(guideArgs, gameStart); 
            }else {
                gameStart();
            }
        }
    },

    defeatGuide: function () {
        
        this.stopAllActions();
        var delay1 = cc.delayTime(1.0);
        var call1 = cc.callFunc(function () {
            this._view.runActionFade(false,NW_GE.action_cell_disappear_time);
        }, this);
        var delay2 = cc.delayTime(NW_GE.action_cell_disappear_time);
        var call2 = cc.callFunc(function () {
            this.guide.removeTip();
            this.guide.removeClipping();
            this._view.setViewVisible(false);
        }, this);
        var delay3 = cc.delayTime(0.5);
        var call3 = cc.callFunc(function () {
            this.guideSettle(false);
        }, this);
        this.runAction(cc.sequence(delay1, call1, delay2, call2, delay3, call3));
        
    },

    getRightCells: function () {
        

        var cellLength = this._view._downCellArray.length;
        for (var i = 0; i < cellLength; i++) {
            if (this._view._downCellArray[i]._isTarget == true) {
                this._rightArray.push(this._view._downCellArray[i]);
            }

        };

        for (var i = 0; i < this._rightArray.length - 1; i++) {
            for (var j = i+1; j < this._rightArray.length; j++) {
                if (this._rightArray[i].y < this._rightArray[j].y) {
                    this.swapCell(i,j);
                }else if (this._rightArray[i].y == this._rightArray[j].y && this._rightArray[i].x > this._rightArray[j].x) {
                    this.swapCell(i,j);
                }
            };
        };


    },

    clickCell:function (clickCell) {
        var cellLength = this._view._downCellArray.length;
        for (var i = 0; i < cellLength; i++) {
            if (this._view._downCellArray[i] == clickCell) {
                this._view._downCellArray[i]._touchEnable = true;
            }
        };
    },

    notClickCells: function (notCells) {
        var cellLength = this._view._downCellArray.length;
        for (var i = 0; i < cellLength; i++) {
            for (var j = 0; j < notCells.length; j++) {
                if (this._view._downCellArray[i] == notCells[i]) {
                    this._view._downCellArray[i]._touchEnable = false;
                    break;
                }else {
                    this._view._downCellArray[i]._touchEnable = true;
                }
            };
        };
    },

    removeRightArray: function () {
        for (var i = 0; i < this._rightArray.length; i++) {
            var draw = this._rightArray[i].getChildByTag(10);
            draw.clear();
            draw.removeFromParent(true);
        };
        this._rightArray.splice(0, this._rightArray.length);
        this._rightArray = [];
    },

    swapCell: function (indexA, indexB) {
        var testCell = null;
        testCell = this._rightArray[indexA];
        this._rightArray[indexA] = this._rightArray[indexB];
        this._rightArray[indexB] = testCell;
    },

    showRightCells: function () {
        for (var i = 0; i < this._rightArray.length; i++) {
            var draw = new cc.DrawNode();
            this._rightArray[i].addChild(draw);
            draw.setTag(10);
            this.addFrame(this._rightArray[i]);
        };
    },

    addFrame: function (cell) {
        var draw = cell.getChildByTag(10);
        var ccp1 = cc.p(0, 2);
        var ccp2 = cc.p(cell.width-2, cell.height);
        draw.drawRect(ccp1, ccp2, null, 3, cc.color(255, 0, 255, 255));
    },

    //-------------------------------------------------------//


    runOneRound:function(delayTime, level){  

        var seq = cc.sequence(
            cc.delayTime(delayTime), 
            cc.callFunc(function(){
                this._view.setCellIdle();
                this.getConfig(level,this._var.roundIndex);
                if(this._var.roundIndex ==0){
                    this._view.showProgress();
                    this._view._topView.createPassProgress(this._var.roundNum);
                }
                this._view.setViewVisible(true);
                if (this._isGuide) {
                    this._view._lblTargetDes.setVisible(false);
                }
                if (this._args.isLearnTest == true) {
                    this._view.hideProgress();
                }

                if (this._var.plyaRound == 0) {
                    this._var.startTimeFlag = true;
                    this._view._progressBar.setPercentage(100);
                    var action = cc.progressTo(this._var.countdown, 0);
                    action.tag = this.ACTION_TIME_PROGRESS;
                    this._view._progressBar.runAction(action);
                }

                this._view._topView.setProgressState(this._var.roundIndex,this._view._topView._CURRENT);
                this._view.setTargetDesc(this._var.targetDesc);
                this._view.setCellShowStr(this._var.upEle,this._var.downEle);
                this._view.runCellAction(true,true,0);
                if (this._isGuide) {
                    this.goalTip();
                }
            },this),                          
            cc.callFunc(function(){
                this._view.runActionFade(true,NW_GE.action_cell_appear_time);
            },this),
            cc.delayTime(NW_GE.action_cell_appear_time),
            cc.delayTime(2),           
            cc.callFunc(function(){ 
                if (this._isGuide) {
                    this.goalTip();
                }
                this._view.runCellAction(true,false,NW_GE.action_cell_to_open_time);
            },this),
            cc.delayTime(NW_GE.action_cell_to_open_time),           
            cc.callFunc(function(){           
                this._view.runCellAction(false,true,NW_GE.action_cell_to_open_time);
            },this),
            cc.delayTime(NW_GE.action_cell_to_open_time),
            cc.callFunc(function(){ 
                if (this._isGuide) {
                    this.goalTip();
                }
            },this),
            cc.callFunc(function(){
                this._gameState = NW_GE.GAME_STATE_ENUM.ONGAME;
                var cellLength = this._view._downCellArray.length;
                if (this._isGuide) {
                    for (var i = 0; i < cellLength; i++) {
                        this._view._downCellArray[i]._touchEnable = false;

                    };
                    this.clickCell(this._rightArray[0]);
                }
            },this)
        );
        this.runAction(seq);
    },
    setHandleCell:function(self,cell){
        self.judgeRightWrong(cell);
    },
    judgeRightWrong:function(cell){
        if (this._gameState != NW_GE.GAME_STATE_ENUM.ONGAME){
            return;
        }
        //cc.log('cell-----',cell);
        if(cell._isTarget == true){
            if (this._isGuide && this._isAppoint < 6) {
                this.goalTip();
            }
            
            cell.runRightAction(NW_GE.action_cell_right_time);
            this._var.hadFoundEleNum += 1;
            if(this._var.hadFoundEleNum >= this._var.needFoundEleNum){
                this._var.roundRightNum += 1;            
                var seq = cc.sequence(
                    cc.callFunc(function(){           
                        this._gameState = NW_GE.GAME_STATE_ENUM.OVER;
                        this._view._topView.setProgressState(this._var.roundIndex,this._view._topView._RIGHT);
                        cell.runRightAction(NW_GE.action_cell_right_time);
                    },this),
                    cc.delayTime(NW_GE.action_cell_right_time), 
                    cc.callFunc(function(){
                        this._view.runOtherRightCellAction(NW_GE.action_cell_right_time);
                    },this),
                    cc.delayTime(NW_GE.action_cell_right_time),
                    cc.callFunc(function(){
                        this.settle(1);
                    },this)
                );
                this.runAction(seq);
            }
        }else{
            var seq = cc.sequence(
                cc.callFunc(function(){           
                    this._gameState = NW_GE.GAME_STATE_ENUM.OVER;
                    this._view._topView.setProgressState(this._var.roundIndex,this._view._topView._WRONG);
                    cell.runWrongAction(NW_GE.action_cell_wrong_time);
                },this),
                cc.delayTime(NW_GE.action_cell_wrong_time), 
                cc.callFunc(function(){
                    this._view.runOtherRightCellAction(NW_GE.action_cell_right_time);
                },this),
                cc.delayTime(NW_GE.action_cell_right_time),
                cc.callFunc(function(){

                    if(this._isGuide){
                        this.defeatGuide();
                        return;
                    }else {
                        this.settle(1);
                    }
                    
                },this)
            );
            this.runAction(seq);            
        }
    },
    settle:function(delayTime){
        var seq = cc.sequence(
            cc.delayTime(delayTime),              
            cc.callFunc(function(){
                this._view.runActionFade(false,NW_GE.action_cell_disappear_time);
            },this),
            cc.delayTime(NW_GE.action_cell_disappear_time), 
            cc.callFunc(function(){   
                if ((this._isGuide == false && this._args.isFirstTest == true && this._var.roundRightNum > this._var.roundIndex) || 
                    this._args.isFirstTest == false) {
                    this._var.roundIndex += 1;
                } 
                if (delayTime == 0) {
                    this._var.plyaRound = this._var.roundNum;
                }

                this._var.plyaRound +=1;
                if(this._var.plyaRound >= this._var.roundNum){
                    this._var.plyaRound = 0;
                    this._var.startTimeFlag = false;
                    var action = this._view._progressBar.getActionByTag(this.ACTION_TIME_PROGRESS);
                    if(typeof(action) == 'object'){
                        cc.director.getActionManager().removeAction(action);
                    }
                    this._view.setViewVisible(false);

                    if (this._isGuide) {
                        this.goalTip();
                        return;
                    }
                    
                    if (this._isGuide == false && this._args.isLearnTest == true) {
                        var delegate = this._args.delegateLearnTest;
                        if (this._args.isFirstTest == true){
                            if (this._var.roundIndex > 0) {
                                delegate.recordLearnTestRes(delegate,true,this._var.currEnergyLevel);
                            }else {
                                delegate.recordLearnTestRes(delegate,false,this._var.currEnergyLevel);
                            } 
                        }else {
                            if (this._var.roundRightNum >= 4) {
                                delegate.recordLearnTestRes(delegate,true,this._var.energyLevel);
                            }else{
                                delegate.recordLearnTestRes(delegate,false,this._var.energyLevel);
                            }
                            
                        }
                        if(delegate.IsLastLearnTest(delegate) == true){
                            delegate.showViewSettleTest(delegate);
                        } else {
                            delegate.HandleStartTest(delegate, false);
                        }
                    }else {
                        this.showSettleView();
                    }
                    //this.showSettleView();
                }else{
                    if(this._var.gameTime < this._var.countdown){
                        this.runOneRound(0, this._args.level);
                    }
                }
            },this)
        );
        this.runAction(seq);
    },
    showSettleView:function(){
        var args = {
            level:this._args.level,
            gameID:this._args.gameID,
            hasPassed:true,
            userId : this._args.userId,
            token : this._args.token,
            isGameTest : this._args.isTest,
            starsList : this._args.starsList,
        };
        var starNum = 0;
        switch(this._var.roundNum - this._var.roundRightNum){
            case 0:starNum = 3;break;
            case 1:starNum = 2;break;
            case 2:starNum = 1;break;
            default:
                starNum = 0;
                args.hasPassed = false;                   
        }

        args.starNum = starNum;
        if(this._args.delegate === false){
            this.gameSettle(args);
        }else{           
            this.taskSettle(args);
        } 
    },

    gameSettle: function (args) {
        args = args || {};
        var self = this;

        var firstSettle = function (param) {
            if (typeof(param) == 'object') {
                args.incScore = param.incScore;
                args.displayRank = param.displayRank;
                args.rankPercentage = param.rankPercentage;
            }
            self._viewSettle = new SettleView(args);
            self._viewSettle.setHandle(self,self.handleNext,self.handleAgain);

            self._viewSettle.showStar(args.starNum);
            var str = '正确: '+self._var.roundRightNum+'/'+self._var.roundNum;
            self._viewSettle.setResTipText(str);
            self.addChild(self._viewSettle);
        }

        var param = {
            gameID : this._args.gameID,
            level : this._args.level,
            starNum : args.starNum,
            userId : this._args.userId,
            token : this._args.token,
            timestampStart : this._args.timestampStart,
        }

        var starsArray = gameData.data[this._args.gameID].starsList;
        var curStarsLength = util.getArrycount(starsArray);

        if (isLocalData == true) {
            if (starsArray[this._args.level] == null) {
                param.isAddLevel = true;
                gameData.data[this._args.gameID].starsList[curStarsLength+1] = {};
                LearnCS.reportStarNum(param, firstSettle);
            }else {
                param.isAddLevel = false;
                LearnCS.reportStarNum(param, firstSettle);
            }
            return;
        }
        
        if (this._args.level == (curStarsLength + 1)) {
            //新关卡
            param.isAddLevel = true;
            gameData.data[this._args.gameID].starsList[curStarsLength+1] = {};
            // GameCS.reportStarNum(param, firstSettle);
            LearnCS.reportStarNum(param, firstSettle);
        }else if (param.starNum > starsArray[this._args.level].stars) {
            //已有关卡
            param.isAddLevel = false;
            // GameCS.reportStarNum(param, firstSettle);
            LearnCS.reportStarNum(param, firstSettle);
        }else {
            firstSettle();
        }
    },

    taskSettle: function (args) {
        this._args.delegate.recordStarNum(this._args.delegate,args.starNum);            
        args.delegate = this._args.delegate;
        this._viewSettle = new ViewSettle(args);
        if(this._args.delegate.IsLastTask(this._args.delegate) == true){
            this._viewSettle.showBtnSubmit();
        }
        this._viewSettle.setHandleAgain(this,this.handleAgain);
        this._viewSettle.setHandleNext(this._args.delegate,this._args.delegate.HandleNextGame);

        this._viewSettle.showStar(args.starNum);
        var str = '正确: '+this._var.roundRightNum+'/'+this._var.roundNum;
        this._viewSettle.setResTipText(str);
        this.addChild(this._viewSettle);
    },

    getConfig:function(level,roundIndex){
        var level_unit;
        var unit;
        if (this._isGuide || (this._args.isFirstTest == false && this._args.isLearnTest == false)) {
            this._var.roundNum = dict_nw_level[level.toString()].round_id_list.length;
            level_unit = dict_nw_level[level.toString()];
            var roundId = level_unit.round_id_list[roundIndex];
            unit = dict_nw_level_round[roundId.toString()];
        }else if (this._args.isFirstTest == true) {
            this._var.roundNum = first_test_nw_level[level.toString()].round_id_list.length;
            level_unit = first_test_nw_level[level.toString()];
            var roundId = level_unit.round_id_list[roundIndex];
            unit = first_test_nw_level_round[roundId.toString()];
            this._var.energyLevel = unit.energy_level;
            if (roundIndex > 0) {
                var frontRoundId = first_test_nw_level[level.toString()].round_id_list[roundIndex-1];
                this._var.currEnergyLevel = first_test_nw_level_round[frontRoundId.toString()].energy_level;
            }   
        }else if (this._args.isLearnTest == true) {
            this._var.roundNum = test_nw_level[level.toString()].round_id_list.length;
            level_unit = test_nw_level[level.toString()];
            this._var.energyLevel = level_unit.energy_level;
            var roundId = level_unit.round_id_list[roundIndex];
            unit = test_nw_level_round[roundId.toString()];
        }
        
        this._var.targetDesc = unit.targetDesc;
        this._var.shownTime = unit.shownTime;
        this._var.countdown = level_unit.countdown;

        var allKeyNum = unit.target.eleKeyList.length;
        var findKeyNum = unit.target.eleKeyNum.length;
        this._var.upEle = [];
        this._var.downEle = [];
        this._var.needFoundEleNum = 0;
        this._var.hadFoundEleNum = 0;

        this.getMoreWordsArray(unit); 
        this.targetWordsArray = []; 
        if(allKeyNum > 0){
            //this.moreWordsArray = unit.moreWordSet.concat();
            
            util.shuffle(unit.target.eleKeyList);
            var STRUCTURE ='WL_STRUCTURE_';
            var tempUpEleKeySet = [];
            for (var i = 0; i < findKeyNum; i++) {
                var k = unit.target.eleKeyList[i];
                tempUpEleKeySet[i] = k;
                var str = unit.wordSet[k];
                if(k.substr(0,STRUCTURE.length) == STRUCTURE){
                    this._var.upEle[i] = str[unit.target.eleKeyNum[i]];
                }else{
                    this._var.upEle[i] = k;
                }
                var wordSetLength = str.length;
                str = this.addMoreSelectWords(this._var.upEle[i],str);
                var indexArray = this.getRandomIndexArray(str.length);

                var subCount = this.getSubWordsNumber(this._var.upEle[i]);
                var showCount = unit.target.eleKeyNum[i] - subCount;

                this._var.needFoundEleNum += showCount;
                for (var j = 0; j < showCount; j++) {
                    this._var.downEle[this._var.downEle.length] = {eleStr:str[indexArray[j]],isTarget:true};
                    this.getEqualCharacters(str[indexArray[j]]);
                };               
            };

            var allKey = [];
            for (var k in unit.wordSet) {
                allKey[allKey.length] = k;
            };
            var otherKeySet = this.DiffSet(allKey,tempUpEleKeySet);
            var otherStr = '';
            for (var i = 0; i < otherKeySet.length; i++) {
                otherStr += unit.wordSet[otherKeySet[i]];
            };  

            var moreStr = this.getOtherCharacter();
            otherStr += moreStr;

            var indexArray = this.getRandomIndexArray(otherStr.length);
            var targetNum = this._var.downEle.length;
            for (var j = 0; j < 14-targetNum; j++) {
                this._var.downEle[this._var.downEle.length] = {eleStr:otherStr[indexArray[j]],isTarget:false};
            };
        }else{ 
            var str = unit.target.ele; 
            var moreStr = this.getOtherCharacter();
            str += moreStr;
            var indexArray = this.getRandomIndexArray(str.length);
            var targetNum = this._var.downEle.length;
            for (var j = 0; j < unit.target.eleKeyNum[0]; j++) {
                this._var.upEle[this._var.upEle.length] = str[indexArray[j]];
            };
            if(unit.target.isFindTarget == true){
                this._var.needFoundEleNum = unit.target.eleKeyNum[0];
                for (var j = 0; j < 14; j++) {
                    var isTarget = false;
                    if(j < unit.target.eleKeyNum[0]){
                        isTarget = true;
                    }
                    this._var.downEle[this._var.downEle.length] = {eleStr:str[indexArray[j]],isTarget:isTarget};
                };
            }else{
                this._var.needFoundEleNum = 14-unit.target.eleKeyNum[0];
                for (var j = 0; j < 14; j++) {
                    var isTarget = false;
                    if(j >= unit.target.eleKeyNum[0]){
                        isTarget = true;
                    }
                    this._var.downEle[this._var.downEle.length] = {eleStr:str[indexArray[j]],isTarget:isTarget};
                };
            }

            // cc.log("this._var.upEle", this._var.upEle);
            // cc.log("this._var.downEle", this._var.downEle);
        }
        util.shuffle(this._var.upEle);
        util.shuffle(this._var.downEle);
        // cc.log('upEle',this._var.upEle,'downEle',this._var.downEle);
    },
    getRandomIndexArray:function(len){
        var indexArray = [];
        for (var i=0;i<len;i++){
            indexArray[i] = i;
        }
        util.shuffle(indexArray);
        return indexArray;
    },
    DiffSet:function(set1,set2){
        var set =[];
        for(var i=0;i<set1.length;i++){
            var isContented = false;
            for(var j=0;j<set2.length;j++){
                if(set1[i] == set2[j]){
                    isContented = true;
                    break;
                }
            }
            if(isContented == false){
                set[set.length] = set1[i];
            }
        }
        return set;
    },

    getMoreWordsArray: function (unit) {
        this.moreWordsArray = [];
        for(var k in unit.moreWordSet){
            var mwLength = this.moreWordsArray.length;
            this.moreWordsArray[mwLength] = [];
            this.moreWordsArray[mwLength] = unit.moreWordSet[k];
        }
    },

    addMoreSelectWords:function (targetKey, wordsString) {

        var delTargetIndex = [];

        for (var i = 0; i < this.moreWordsArray.length; i++) {
            var wordTagLength = util.getArrycount(this.moreWordsArray[i]['radical']);
            for (var j = 0; j < wordTagLength; j++) {
                if (this.moreWordsArray[i]['radical'][j] == targetKey) {
                    var twLength = this.targetWordsArray.length;
                    this.targetWordsArray[twLength] = {};
                    this.targetWordsArray[twLength].radical = {};
                    this.targetWordsArray[twLength].radical = this.moreWordsArray[i]['radical'];
                    this.targetWordsArray[twLength].characters = this.moreWordsArray[i]['characters'];
                    this.targetWordsArray[twLength].wordCount = 0;
                    wordsString += this.moreWordsArray[i]['characters'];
                    delTargetIndex.push(i);
                    break;
                }
            };
        };
        for (var i = delTargetIndex.length - 1; i >= 0; i--) {
            this.moreWordsArray.splice(delTargetIndex[i],1);
        };

        return wordsString;
    },

    getSubWordsNumber: function (targetKey) {
        var equalCount = 0;

        for (var i = 0; i < this.targetWordsArray.length; i++) {
            var radicalLength = util.getArrycount(this.targetWordsArray[i].radical);
            for (var j = 0; j < radicalLength; j++) {
                if (this.targetWordsArray[i].radical[j] == targetKey) {
                    equalCount = this.targetWordsArray[i].wordCount;
                    break;
                }
            };
        };

        return equalCount;
    },

    getEqualCharacters: function (word) {
        for (var i = 0; i < this.targetWordsArray.length; i++) {
            for (var k = 0; k < this.targetWordsArray[i].characters.length; k++) {
                if (this.targetWordsArray[i].characters[k] == word) {
                    this.targetWordsArray[i].wordCount += 1;
                }
            };
        };
    },

    getOtherCharacter: function () {
        var otherStr = '';
        for (var i = 0; i < this.moreWordsArray.length; i++) {
            otherStr += this.moreWordsArray[i]['characters'];
        };
        return otherStr;
    },

    handleContinue:function(self){
        cc.log('---handleContinue');
        self._viewGameSetting.removeFromParent();
        self._var.startTimeFlag = true;
        cc.director.getActionManager().resumeTarget(self._view._progressBar);
        cc.director.getActionManager().resumeTarget(self);
    },
    handleRestart:function(self){
        cc.log('---handleRestart');
        cc.director.getActionManager().resumeTarget(self._view._progressBar);
        cc.director.getActionManager().resumeTarget(self);

        self._viewGameSetting.removeFromParent();        
        self.stopAllActions();
        self._view._progressBar.stopAllActions();

        self.reStartSettle();

        if (self._isGuide) {
            self._isAppoint = 1;
            self.guide.removeFromParent(true);
            self.guide = null;
            self.sureGuide(0);
        }else {
            self.runOneRound(0, self._args.level);
        }  
        
    },
    handleNext:function(self){
        self._args.timestampStart = parseInt(new Date().getTime());
        self._args.level += 1;
        if(self._args.level > 30){
            self._args.level = 1;
        };
        self._view._progressBar.setPercentage(100);
        self._var.gameTime = 0;
        self._var.roundRightNum = 0;
        self._var.roundIndex = 0;
        self._var.plyaRound = 0;
        self.runOneRound(0, self._args.level);
    },
    handleAgain:function(self){
        self._view._progressBar.setPercentage(100);
        self._var.gameTime = 0;
        self._var.roundRightNum = 0;
        self._var.roundIndex = 0;
        self._var.plyaRound = 0;
        self.runOneRound(0, self._args.level);
    },
    onPauseBtnEvent:function(self){
        self._var.startTimeFlag = false;
        cc.director.getActionManager().pauseTarget(self._view._progressBar);
        cc.director.getActionManager().pauseTarget(self);
        var args = {
            delegate : self._args.delegate,
            gameID : self._args.gameID,
            isTest : self._args.isLearnTest,
            userId : self._args.userId,
            token : self._args.token,
            isGameTest : self._args.isTest,
            starsList : self._args.starsList,
            level : self._args.level, 
        }

        if (self._isPause == false) {
            self._isPause = true;
            self._isPause = false;
            self._viewGameSetting = new GameSetting(args);
            if (self._isGuide) {
                self._viewGameSetting.setGuideHelp();
            }
            self.addChild(self._viewGameSetting);
            self._viewGameSetting.setHandle(self,self.handleContinue,self.handleRestart);
        }
    },
    update:function(dt){
        if(this._var.startTimeFlag == true){
            this._var.gameTime += dt;
            if(this._var.gameTime >= this._var.countdown){
                this._var.startTimeFlag = false;
                this.settle(0);
            }
        }
    },

    reStartSettle: function () {
        this._gameState = NW_GE.GAME_STATE_ENUM.OVER;

        for (var i = 0; i < this._view._upCellArray.length; i++) {
            this._view._upCellArray[i]._lbl_number.stopAllActions();
            this._view._upCellArray[i].bg.stopAllActions();
            this._view._upCellArray[i].stopAllActions();
            this._view._upCellArray[i].setReStartAttr(true);
        };

        for (var i = 0; i < this._view._downCellArray.length; i++) {
            this._view._downCellArray[i]._lbl_number.stopAllActions();
            this._view._downCellArray[i].bg.stopAllActions();
            this._view._downCellArray[i].stopAllActions();
            this._view._downCellArray[i].setReStartAttr(false);
        };

        cc.director.getActionManager().resumeTarget(this._view._progressBar);
        var action = this._view._progressBar.getActionByTag(this.ACTION_TIME_PROGRESS);
        if(typeof(action) == 'object'){
            cc.director.getActionManager().removeAction(action);
        }
        this._view._progressBar.setPercentage(100);
        this._var.gameTime = 0;
        this._var.roundRightNum = 0;
        this._var.roundIndex = 0;
        this._var.plyaRound = 0;
    },
    
    onExit:function(){
        cc.log('newWords--onExit',this._var.roundIndex);
        // this.removeFromParent(true);
        this._super();
    },

});