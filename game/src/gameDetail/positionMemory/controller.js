
var PositionMemory = cc.Layer.extend({
    _modle:null,
    _view:null,
    _coinArray:null,
    _posArray:null,
    _var:{
        gameState:null,
        title:null,
        level:null,
        repeat_index:null,
        target_total_num:null,
        target_selected_num:null,
        win_num:null,
    },
    ctor:function (args) {
        this._super();
        var winSize = cc.winSize;
        this._args = args;
        this._args.level = args.level;
        this._args.gameID = args.gameID;
        this._args.timestampStart = parseInt(new Date().getTime());
        this._args.delegate = args.delegate || false;

        this._args.isLearnTest = args.isLearnTest || false;
        this._args.isFirstTest = args.isFirstTest || false;
        this._args.delegateLearnTest = args.delegateLearnTest || false;

        this._coinArray = [];
        this._posArray = [];
        this._var.repeat_index = 1;
        this._var.play_repeat_count = 1;
        this._var.target_total_num = 0;
        this._var.target_selected_num = 0;
        this._var.win_num = 0;

        

        this._pic_size_width = 120;
        this._pic_size_height = 134;

        this._view = new PositionLayer(args.bg_color);
        this.addChild(this._view);

        this._isPause = false;
        var self = this;
        this._view._btn_pause.addClickEventListener(function(){
            if (self._isPause == false) {
                self._isPause = true;
                self.handlePurseEvent(self);
            }
            
        });

        this._cellWidth = this._view._coinListLayer.width/6;
        this._cellHeight = this._view._coinListLayer.height/6;

        cc.eventManager.addListener({
            event:cc.EventListener.TOUCH_ONE_BY_ONE,
            swallowTouches:true,
            onTouchBegan:function(touch,event){
              return true;
            },
            onTouchMoved:function(){},
            onTouchEnded:function(){}  
        },this);

        this._var.gameState = PM_GE.GAME_STATE_ENUM.BEGIN;


        this._isGuide = args.isGuide || false;
        if (args.hasGuide == "true") {
            this._hasGuide = true;
        }else {
            this._hasGuide = false;
            this._args.timestampStart = parseInt(new Date().getTime());
        }
        if ((this._args.delegate == false && util.getArrycount(gameData.data[this._args.gameID].starsList) == 0 && gameData.testEditionGuide(this._args.level)) || (this._isGuide == true) || (this._hasGuide == true)) {
            //新手引导
            this._guideArray = new Array();
            this._var.play_repeat_count = 0;
            this._isAppoint = 1;
            this.sureGuide();
        }else {
            this._modle = new PositionModle();
            this.addChild(this._modle);
            this._modle.getConfig(args.level,this._var.repeat_index, this._args.isLearnTest, this._args.isFirstTest, this._isGuide);
            this._view.createPassProgress(this._modle._data.repeat_num);
            this.doRepeate(args.level);
        }

        if (this._args.isLearnTest == true || this._isGuide) {
            this._view.hideParallelPic();
        }

        return true;
    },

    //-------------------------------------------------------//
    //--------------------- 新手引导 -------------------------//
    //-------------------------------------------------------//

    sureGuide: function () {
        this._isGuide = true;
        this.guideLevel = 0;
        this._view.setHandleFade(this, this.showClick);
        this._modle = new PositionModle();
        this.addChild(this._modle);
        this._modle.getConfig(this.guideLevel,this._var.repeat_index, this._args.isLearnTest, this._args.isFirstTest, this._isGuide);
        this._view.createPassProgress(this._modle._data.repeat_num);

        this.dTime = this.beginGuide();
        this.goalTip(this.dTime);
    },

    beginGuide: function () {
        this.setTipArray(GAME_GUIDE_TIP[this._args.gameID].guideTip[0], true, 0);
        this.guide = new PlayerGuide(this._guideArray);
        this.guide.x = this._view.width*0.5 - this.guide.width*0.5;
        this.guide.y = this._view._coinListLayer.y + 10;
        this._view.addChild(this.guide, 10);
        this._view._btn_pause.setTouchEnabled(false);
        return 3.0;
    },

    setTipArray: function (tip, isRect, verticesType) {
        this._guideArray.tip = tip;
        this._guideArray.isRect = isRect;
        this._guideArray.verticesType = verticesType;
    },

    goalTip: function (dTime) {
        var delay = cc.DelayTime.create(dTime);
        var call = cc.CallFunc.create(function () {
            this.guide.removeClipping();
            this.guide.removeTip();
            this.doRepeate(this.guideLevel, GAME_GUIDE_TIP[this._args.gameID].guideTip[1]);
            this.showClipping();
            this.setCoinClick(true);
        }, this);

        var delayFade = cc.DelayTime.create(1.2+this._modle._data.shown_time);
        var callFade = cc.CallFunc.create(function () {
            this.guide.removeTip();
            this.setTipArray(GAME_GUIDE_TIP[this._args.gameID].guideTip[2], false, 4);
            this.guide.init(this._guideArray);
            this.guide.x = this._view.width*0.5 - this.guide.width*0.5;
            // this.showPlaying();
            this.showHand(0);
            this._chooseCoin = 1;
            this.setCoinClick(false);
        }, this);
        this.runAction(cc.Sequence.create(delay, call, delayFade, callFade));
    },

    showClipping: function () {
        var ccp1 = cc.p(this._view._coinListLayer.x - this._view._coinListLayer.width*0.5, this._view._coinListLayer.y - this._view._coinListLayer.height*0.5);
        var ccp2 = cc.p(this._view._coinListLayer.x + this._view._coinListLayer.width*0.5, this._view._coinListLayer.y + this._view._coinListLayer.height*0.5);
        var rectCCP = [ccp1, ccp2];
        this.guide.addClipping(this._view, rectCCP, 1);
    },

    doRepeateTip: function (tip) {
        var delay = cc.DelayTime.create(PM_GE.coin_action_time_add+0.2);
        var call = cc.CallFunc.create(function () {
            this.guide.removeTip();
            this.setTipArray(tip, false, 4);
            this.guide.init(this._guideArray);
            this.guide.x = this._view.width*0.5 - this.guide.width*0.5;
            var row_num =this._modle._data.row_num,col_num =this._modle._data.column_num;
            var width = row_num*this._pic_size_width;
            var scale = this._view._coinListLayer.width/width;
            this.guide.y = this._coinArray[0][col_num-1].worldPos.y + this._coinArray[0][col_num-1].height*0.5*scale + 20;
        }, this);
        this.runAction(cc.Sequence.create(delay, call)); 
    },

    addTargetCoinPos: function () {
        this.targetCoinPos = new Array();
        this.coinWidth = 0;
        this.coinHeight = 0;
        for (var i = 0; i < this._coinArray.length; i++) {
            var len = this._coinArray[i].length;
            for (var j = 0; j < len; j++) {
                var coin = this._coinArray[i][j];
                if (i == 0 && j == 0) {
                    this.coinWidth = coin.width;
                    this.coinHeight = coin.height;
                }
                if (coin._isTarget == true) {
                    var targetLength = this.targetCoinPos.length;
                    this.targetCoinPos[targetLength] = {};
                    this.targetCoinPos[targetLength].pos = coin.worldPos;
                    this.targetCoinPos[targetLength].grid = coin;
                }
            };
        };
        this._isAppoint = 2;
    },

    showHand: function (coinIndex) {
        this._view.addGuideHand(this.targetCoinPos[coinIndex], this.coinWidth, this.coinHeight);
    },

    chooseHandGuide: function (coinIndex) {
        this.delHand();
        this.showHand(coinIndex);
    },

    showPlaying: function () {
        var delayTime = 1 * 0.7;
        var delay = cc.DelayTime.create(delayTime);
        var call1 = cc.CallFunc.create(function () {
            this._view.addGuideHand(this.targetCoinPos[0], this.coinWidth, this.coinHeight);
        }, this);
        var call2 = cc.CallFunc.create(function () {
            this._view.addGuideHand(this.targetCoinPos[1], this.coinWidth, this.coinHeight);
        }, this);

        this.runAction(cc.Sequence.create(call1, delay, call2));
    },

    showClick: function (self, coin) {
        coin.turnOpen(PM_GE.coin_action_time_open);
        self.settleResult(PM_GE.coin_action_time_open,coin._isTarget);
    },

    answerWrong: function () {
        this.guide.removeTip();
        this.setTipArray(GAME_GUIDE_TIP[this._args.gameID].guideTip[3], false, 4);
        this.guide.init(this._guideArray);
        this.guide.x = this._view.width*0.5 - this.guide.width*0.5;
    },

    delHand: function () {
        if (this._view.hand) {
            this._view.hand.stopAllActions();
            this._view.hand.removeFromParent(true);
            this._view.hand = null;
        }
    },

    guideSettle: function () {
        if (this.guide) {
            this.guide.removeTip();
            this.guide.removeFromParent(true);
            this.guide = null;
        }
        this.stopAllActions();
        this.removeCoin(0.00001);
        this._view._bgTop.setVisible(false);

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
        args.gameType = "非常好！";
       
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
        self._view.setRemainBlockNum(0);
        self._var.gameState = PM_GE.GAME_STATE_ENUM.OVER;
        self._var.repeat_index = 1;
        for (var i =0;i<self._modle._data.repeat_num;i++){
            self._view.setProgressState(i,PM_GE.pass_progress_state.idle);
        }
        self._var.win_num = 0;
        self._var.play_repeat_count = 0;
        self.sureGuide();
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

    removeArray: function () {
        var length = this.targetCoinPos.length;
        for (var i = 0; i < length; i++) {
            this.targetCoinPos[i].pos = null;
            this.targetCoinPos[i].grid = null;
        };
        this.targetCoinPos.splice(0, length);
        this.targetCoinPos = null;
        this.coinWidth = null;
        this.coinHeight = null;
    },

    setCoinClick: function (isClick) {
        for (var i = 0; i < this._coinArray.length; i++) {
            for (var j = 0; j < this._coinArray[i].length; j++) {
                this._coinArray[i][j]._isGuideShow = isClick;
            };
        };
    },

    guideTargetCoin: function (coin) {
        if (this._isGuide && this._isAppoint == 2) {
           if (coin == this.targetCoinPos[0].grid && this._chooseCoin == 1) {
                this._chooseCoin = 2;
                if (this.targetCoinPos[1].grid._hasFliped == true) {
                    this.delHand();
                }else {
                    this.chooseHandGuide(1);
                }
            }else if (coin == this.targetCoinPos[1].grid && this._chooseCoin == 2) {
                this._chooseCoin = 1;
                if (this.targetCoinPos[0].grid._hasFliped == true) {
                    this.delHand();
                }else {
                    this.chooseHandGuide(0);
                }
            }else if (coin != this.targetCoinPos[0].grid && coin != this.targetCoinPos[1].grid) {
                this.delHand();
            }
        }
    },

    //-------------------------------------------------------//

    doRepeate:function(level, tip){
        this._modle.getConfig(level,this._var.repeat_index, this._args.isLearnTest, this._args.isFirstTest, this._isGuide);
        // cc.log("--------------- this._modle._data.repeat_num ----------------", this._modle._data.repeat_num);
        this._view.createPassProgress(this._modle._data.repeat_num);
        this._view._bgTop.setVisible(true);
        this.adjustLayout();
        this.addCoin(PM_GE.coin_action_time_add);
        if (this._isGuide) {
            this.doRepeateTip(tip);
        }
        
        var action = [];
        action[action.length] = cc.delayTime(PM_GE.coin_action_time_add);
        action[action.length] = cc.callFunc(function(){
            this.addCoinListener(); 
            this.setCoinAttribute();
        },this)
        this.runAction(cc.sequence(action));
    },
    addCoin:function(delayTime){
        var row_num =this._modle._data.row_num,col_num =this._modle._data.column_num;

        var width = row_num*this._pic_size_width;
        var height = col_num*this._pic_size_height;
        var scale = this._view._coinListLayer.width/width;
        //cc.log("scale:",scale);

        for (var i = 0; i < row_num; i++) {
            this._coinArray[i]=[];
            for (var j = 0; j < col_num; j++) {
                var coin = new PositionCoin();
                this._view._coinListLayer.addChild(coin);           
                var x = (i+0.5)*this._pic_size_width*scale;
                var y = (j+0.5)*this._pic_size_height*scale;
                coin.attr({
                    x:x,
                    y:y,
                    scale:scale
                });
                this._coinArray[i][j] = coin;
                coin.worldPos = coin.getParent().convertToWorldSpace(cc.p(x,y));
                coin.enterScale(delayTime,scale);
            };
        };
    },
    removeCoin:function(delayTime){
        var row_num = this._coinArray.length;
        for (var i = 0; i < this._coinArray.length; i++) {
            var len = this._coinArray[i].length;
            for (var j = 0; j < len; j++) {
                var coin = this._coinArray[i].pop();
                coin.exitScale(delayTime);
            };
        };
        for (var i = 0; i < row_num; i++) {
            this._coinArray.pop();     
        };

        this._coinArray = [];
    },
    setCoinAttribute:function(){
        this._posArray = this._modle.getRandomPosArray(this._modle._data.row_num,this._modle._data.column_num);
        var temp = {},target_pic=[];
        for (var i = 0; i < this._modle._data.list_target_eleID.length; i++) {
            var id = String(this._modle._data.list_target_eleID[i]);
            temp[id] = true;
            target_pic[i]=dict_pm_element[id].pic;
        };
        if (this._modle._data.target_show_flag == true){
            this._view.setTargetPic(target_pic);
        }

        this._var.target_total_num = 0;
        this._var.target_selected_num = 0;
        //util.log(this._modle._data.list_ele_below,'---ele_below');
        for (var i = 0; i < this._modle._data.list_ele_below.length; i++) {
            var pos = this._posArray[i];
            // cc.log("----------------- coin row col -----------------", pos.row, pos.col);
            var coin = this._coinArray[pos.row][pos.col];
            var pic_id = this._modle._data.list_ele_below[i];
            coin._isTarget = (temp[String(pic_id)] == true)?true:false;
            if (coin._isTarget == true) {
                this._var.target_total_num += 1;
            };

            coin.setBelowSprite(dict_pm_element[String(pic_id)].pic);

            var above_pic_id = this._modle._data.list_ele_above[i];
            if (typeof(above_pic_id) == 'string'){
                if (coin._isTarget == false){
                    coin._isTarget = (temp[above_pic_id] == true)?true:false;
                    if (coin._isTarget == true) {
                        this._var.target_total_num += 1;
                    }
                }
                coin.setAboveSprite(dict_pm_element[above_pic_id].pic)
            }
            coin.turnOpen(PM_GE.coin_action_time_open);
        };

        if (this._isGuide && this._isAppoint == 1) {
            this.addTargetCoinPos();
        }

        var action = [];
        action[action.length] = cc.delayTime(PM_GE.coin_action_time_open+this._modle._data.shown_time);
        action[action.length] = cc.callFunc(function(){
            // cc.log('---this._modle._data.list_ele_below.length===',this._modle._data.list_ele_below.length);
            // cc.log('---',this._posArray);
            // cc.log('--_coinArray-',this._coinArray);
            for (var i=0;i<this._modle._data.list_ele_below.length;i++){
                var pos = this._posArray[i];
                // cc.log('-----[pos.row][pos.col]--',i,pos.row,pos.col);
                var coin = this._coinArray[pos.row][pos.col];
                // if(typeof(coin) != 'object'){
                //     cc.log('[pos.row][pos.col]--',i,pos.row,pos.col);
                // }
                coin.turnCover(PM_GE.coin_action_time_cover);
            }
        },this);
        action[action.length] = cc.delayTime(PM_GE.coin_action_time_cover);
        action[action.length] = cc.callFunc(function(){
            this._var.gameState = PM_GE.GAME_STATE_ENUM.ONGAME;
            if (this._modle._data.target_show_flag == true){
                this._view._targetTipLayer.setVisible(true);
            }
            this._view.setRemainBlockNum(this._var.target_total_num);
            //cc.log("this._var.repeat_index", this._var.repeat_index-1);
            this._view.setProgressState(this._var.repeat_index-1,PM_GE.pass_progress_state.current); 
            
        },this);
        this.runAction(cc.sequence(action));
    },

    addCoinListener:function(){
        var r = (this._pic_size_width - 10)/2;
        cc.eventManager.addListener({
            event: cc.EventListener.TOUCH_ONE_BY_ONE,
            swallowTouches: true,
            onTouchBegan:function(touch, event){  
            var target = event.getCurrentTarget();              
            var controller = target.getParent();    
            if (controller._var.gameState != PM_GE.GAME_STATE_ENUM.ONGAME){
                return false;
            }
            var pos = controller.convertToWorldSpace(touch.getLocation());

            var row_num =controller._modle._data.row_num;
            var col_num =controller._modle._data.column_num;
            for (var i = 0; i < row_num; i++) {
                var coinRow = controller._coinArray[i];
                for (var j = 0; j < col_num; j++) {
                    var coin = coinRow[j];
                    if(coin._isGuideShow == false && coin._hasFliped == false && Math.pow((pos.x - coin.worldPos.x), 2) +
                        Math.pow((pos.y - coin.worldPos.y), 2) <= r*r)
                    {   
                        controller.guideTargetCoin(coin);
                        coin.turnOpen(PM_GE.coin_action_time_open);
                        controller.settleResult(PM_GE.coin_action_time_open,coin._isTarget);
                        break;
                    }
                    else
                    {
                        //cc.log('row---'+row_num+' col_num='+col_num+' len1='+controller._coinArray.length+ ' len2='+coinRow.length);
                        //cc.log('22---'+coin._hasFliped+' '+typeof(coin));
                    }                    
                };
            };
            return true;
            },
        }, this._view);
    },
    settleResult:function(dtime,isWin){
        // cc.log(dtime+'  rrrrrr '+isWin);
        if (isWin == true){
            this._var.target_selected_num += 1;
        }
        if (isWin == true && (this._var.target_total_num != this._var.target_selected_num)){
            this._view.setRemainBlockNum(this._var.target_total_num - this._var.target_selected_num);
            return;
        }
        this._var.gameState = PM_GE.GAME_STATE_ENUM.OVER;
        this._view.setRemainBlockNum(0);

        var action = [];
        action[action.length] = cc.delayTime(dtime+0.3);
        if (isWin == true){
            this._var.win_num +=1;
            this._view.setProgressState(this._var.repeat_index-1,PM_GE.pass_progress_state.win);
        }else{
            if (this._isGuide) {
                this.answerWrong();
            }
            this._view.setProgressState(this._var.repeat_index-1,PM_GE.pass_progress_state.fail);
            
            this.openRightEle(PM_GE.coin_action_time_open);
            action[action.length] = cc.delayTime(PM_GE.coin_action_time_open);
        }

        action[action.length] = cc.callFunc(function(){
            this._view._targetTipLayer.setVisible(false);
            this.removeCoin(PM_GE.coin_action_time_remove);
        },this);
        action[action.length] = cc.delayTime(PM_GE.coin_action_time_remove);

        action[action.length] = cc.callFunc(function(){
            if (this._var.repeat_index == this._modle._data.repeat_num || 
                (this._var.play_repeat_count == this._modle._data.repeat_num && (this._isGuide == false && this._args.isFirstTest == true))) {
                if (this._isGuide) {
                    if (isWin) {
                        this.guideSettle();
                    }else {
                        this.doRepeate(this.guideLevel, GAME_GUIDE_TIP[this._args.gameID].guideTip[4]);
                    }
                    return;
                }
                var star_num = 0;
                if (this._var.win_num == this._modle._data.repeat_num){
                    star_num = 3;
                }else if (this._var.win_num == this._modle._data.repeat_num-1){
                    star_num = 2;
                }else if (this._var.win_num == this._modle._data.repeat_num-2){
                    star_num = 1;
                }
                var str = this._var.win_num+"/"+this._modle._data.repeat_num;
                if (this._args.isLearnTest == true) {
                    var delegate = this._args.delegateLearnTest;
                    if (this._args.isFirstTest == true) {
                        if (this._var.repeat_index > 1) {
                            delegate.recordLearnTestRes(delegate,true,this._modle._data.currEnergyLevel);
                        }else {
                            delegate.recordLearnTestRes(delegate,false,this._modle._data.currEnergyLevel);
                        }
                    }else {
                        if (this._var.win_num >= 4) {
                            delegate.recordLearnTestRes(delegate,true,this._modle._data.energyLevel);
                        }else {
                            delegate.recordLearnTestRes(delegate,false,this._modle._data.energyLevel);
                        }
                        
                    }
                    
                    this.removeCoin(0.00001);
                    this._view._bgTop.setVisible(false);
                    if(delegate.IsLastLearnTest(delegate) == true){
                        delegate.showViewSettleTest(delegate);
                    } else {
                        delegate.HandleStartTest(delegate, false);
                    }
                }else {
                    this.showSettleLayer(star_num,str);
                }
            }else{
                if ((this._args.isFirstTest == true && isWin == true) || (this._args.isFirstTest == false && ((this._isGuide && isWin) || !this._isGuide))) {
                    this._var.repeat_index += 1;
                }
                if (this._isGuide) {
                    this.removeArray();
                    if (this._isAppoint == 2 && isWin == false) {
                        this._isAppoint = 1;
                        this.goalTip(0);
                    }else if (this._isAppoint == 2 && isWin == true) {
                        this._isAppoint = 3;
                        this.guide.removeClipping();
                        this._view._btn_pause.setTouchEnabled(true);
                        this.doRepeate(this.guideLevel, GAME_GUIDE_TIP[this._args.gameID].guideTip[4]); 
                    }
                    
                }else {
                    this.doRepeate(this._args.level);
                }
                //this.showSettleLayer(1);
            }
            if (!(this._isGuide && !isWin)) {
                this._var.play_repeat_count += 1;
            }
            
        },this);
        this.runAction(cc.sequence(action));
    },

    showSettleLayer:function(star_num,str){
        this.removeCoin(0.00001);
        this._view._bgTop.setVisible(false);
        var args = {
            gameID : this._args.gameID,
            level : this._args.level,
            hasPassed:false,
            userId : this._args.userId,
            token : this._args.token,
            isGameTest : this._args.isTest,
            starsList : this._args.starsList,
        }
        if(star_num > 0){
            args.hasPassed = true;
        }

        args.starNum = star_num;
        if(this._args.delegate === false){
            this.gameSettle(args, str);
        }else{            
            this.taskSettle(args, str);
        }
    },

    gameSettle: function (args, str) {
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
            self._viewSettle.setResTipText('正确: '+str);
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

    taskSettle: function (args, str) {
        this._args.delegate.recordStarNum(this._args.delegate,args.starNum);            
        args.delegate = this._args.delegate;
        this._viewSettle = new ViewSettle(args);
        if(this._args.delegate.IsLastTask(this._args.delegate) == true){
            this._viewSettle.showBtnSubmit();
        }
        this._viewSettle.setHandleAgain(this,this.handleAgain);
        this._viewSettle.setHandleNext(this._args.delegate,this._args.delegate.HandleNextGame);

        this._viewSettle.showStar(args.starNum);
        this._viewSettle.setResTipText('正确: '+str);
        this.addChild(this._viewSettle);
    },

    openRightEle:function(delayTime){
        for (var i=0;i<this._modle._data.list_ele_below.length;i++){
            var pos = this._posArray[i];
            var coin = this._coinArray[pos.row][pos.col];
            if (coin._hasFliped == false){
                coin.turnOpen(delayTime);
            }
        }
    },
    adjustLayout:function(){
        var row_num =this._modle._data.row_num;
        var col_num =this._modle._data.column_num;
        var height = this._cellHeight * col_num;        

        this._view._coinListLayer.width = this._cellWidth * row_num;
        this._view._coinListLayer.height = this._cellHeight * col_num;

        var space = cc.winSize.height - this._view._var.topLayerHeight - height;
        if (this._modle._data.target_show_flag == true){
            space = cc.winSize.height - this._view._var.topLayerHeight - this._view._var.targetLayerHeight
            - height-20;
        }

        this._view._coinListLayer.y = space/3*2+height/2;
        this._view._targetTipLayer.y = space/3*2+height+20;
        if (this._modle._data.target_show_flag == true){
            this._view.target_desc.setString(this._modle._data.target_desc);
            this._view.adjustLayout(this._modle._data.list_target_eleID.length);
        }
    },
    handleContinue:function(self){
        cc.log('---handleContinue');
        cc.director.getActionManager().resumeTarget(self);
        self._viewGameSetting.removeFromParent(true);
    },
    handleRestart:function(self){
        cc.log('---handleRestart');
        cc.director.getActionManager().resumeTarget(self);
        self.removeCoin(0);
        self._view.setRemainBlockNum(0);
        self.stopAllActions();
        self._var.gameState = PM_GE.GAME_STATE_ENUM.OVER;
        self._viewGameSetting.removeFromParent(true);
        self._var.repeat_index = 1;
        self._var.play_repeat_count = 1;
        for (var i =0;i<self._modle._data.repeat_num;i++){
            self._view.setProgressState(i,PM_GE.pass_progress_state.idle);
        }
        self._view._targetTipLayer.setVisible(false);
        self._var.win_num = 0;


        if (self._isGuide) {
            self._var.play_repeat_count = 0;
            self._isAppoint = 1;
            self.guide.removeFromParent(true);
            self.guide = null;
            self.sureGuide();
        }else {
            self.doRepeate(self._args.level);
        }    
    },
    handleNext:function(self){
        self._args.timestampStart = parseInt(new Date().getTime());
        self._args.level += 1;  
        if(self._args.level > 30){
            self._args.level = 1; 
        }    
        self._var.repeat_index = 1;
        self._var.play_repeat_count = 1;
        for (var i =0;i<self._modle._data.repeat_num;i++){
            self._view.setProgressState(i,PM_GE.pass_progress_state.idle);
        }
        self._var.win_num = 0;
        self.doRepeate(self._args.level);
    },
    handleAgain:function(self){       
        self._var.repeat_index = 1;
        self._var.play_repeat_count = 1;
        for (var i =0;i<self._modle._data.repeat_num;i++){
            self._view.setProgressState(i,PM_GE.pass_progress_state.idle);
        }
        self._var.win_num = 0;
        self._view._targetTipLayer.setVisible(false);
        self.doRepeate(self._args.level);
    },

    handlePurseEvent:function(self){
        cc.director.getActionManager().pauseTarget(self);

        self._isPause = false;
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
        self._viewGameSetting = new GameSetting(args);
        if (self._isGuide) {
            self._viewGameSetting.setGuideHelp();
        }
        self.addChild(self._viewGameSetting);
        self._viewGameSetting.setHandle(self,self.handleContinue,self.handleRestart); 

    },
    
    onExit:function(){
        this._modle._ele._color = [];
        this._modle._ele._shape = [];
        this._modle._ele._color_shape = [];  
        this._modle._ele = null;
        cc.log('--onExit',this._var.repeat_index);
        // this.removeFromParent(true);
        this._super();
    },

});
