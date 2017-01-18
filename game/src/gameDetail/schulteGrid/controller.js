
var SchulteGrid = cc.Layer.extend({
    ACTION_TIME_PROGRESS:1,
    _view:null,
    _coinArray:[],
    _coinFilterArray:[],
    _gameState:null,    
    _var:{
        repeate_num:null,
        gameState:null,
        title:null,
        repeate_index:null,
        curTargetValue:null,
        endTargetValue:null,
        gameTime:null,
        startTimeFlag:null,
    },
    _config:{
        countdown:null,
        get_star123_time:null,
        row_column:null,
        blank_grid_num:null,
        filter_grid_num:null,
        ele_start:null,
    },
    ctor:function (args) {
        this._super();

        this.attr({
            x:0,
            y:0,
            anchorX: 0.5,
            anchorY: 0.5,
            width: cc.winSize.width ,
            height: cc.winSize.height,
        });

        this._args = args;
        this._args.gameID = args.gameID;
        this._args.level = args.level;
        this._args.timestampStart = parseInt(new Date().getTime());
        this._args.delegate = args.delegate || false;

        this._args.isLearnTest = args.isLearnTest || false;
        this._args.isFirstTest = args.isFirstTest || false;
        this._args.delegateLearnTest = args.delegateLearnTest || false;

        this._coinArray = [];
        this._coinFilterArray = [];
        this._var.repeate_index = 1;
        this._var.gameTime = 0;
        this._var.startTimeFlag = false;

        this._view = new SchulteLayer(args.bg_color);
        this.addChild(this._view);

        this._isPause = false;
        var self = this;
        this._view._purseBtn.addClickEventListener(function(){
            if (self._isPause == false) {
                self._isPause = true;
                self.handlePurseEvent(self);
            }
        });

        this._cellSpace = 5;
        this._cellSize = 113;
        this._cellWidth = (this._view._upLayer.width-this._cellSpace*5) / 6;
        this._cellHeight = (this._view._upLayer.width-this._cellSpace*5) / 6;
        
        

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
            this._isAppoint = 1;
            this._view._progressBar.setVisible(false);
            this.sureGuide();
        }else {
            this.runOneGame(0, this._args.level);
        }

        if (!this._isGuide) {
            this.scheduleUpdate();
        }
    },


    //-------------------------------------------------------//
    //--------------------- 新手引导 -------------------------//
    //-------------------------------------------------------//

    sureGuide: function () {
        this._isGuide = true;
        this.guideLevel = 0;
        // this._view.guideVisible(false);
        this.dTime = this.beginGuide();
        this.goalTip();
    },

    beginGuide: function () {
        this.runOneGame(0, this.guideLevel);

        this.setTipArray(GAME_GUIDE_TIP[this._args.gameID].guideTip[0], true, 4);
        this.guide = new PlayerGuide(this._guideArray);
        this.guide.x = this._view.width*0.5 - this.guide.width*0.5;
        // var ccpY = this._view.lblStartTip.y * 2 - (this._view._upLayer.y + this._view._upLayer.height*0.5);
        // this.guide.y = ccpY;
        this._view.addChild(this.guide, 10);
        this.guide.setVisible(false);

        return 3.0;
    },

    setTipArray: function (tip, isRect, verticesType) {
        this._guideArray.tip = tip;
        this._guideArray.isRect = isRect;
        this._guideArray.verticesType = verticesType;
    },

    showFirstTip: function () {
        var size = cc.winSize;
        var scale = size.width / 750;

        var ccpY = this._view.lblStartTip.y * 2 - (this._view._upLayer.y + this._view._upLayer.height*0.5);
        var ccp1 = cc.p(this._view._upLayer.x - this._view._upLayer.width*0.5, this._view._upLayer.y - this._view._upLayer.height*0.5);
        var ccp2 = cc.p(this._view._upLayer.x + this._view._upLayer.width*0.5, ccpY);
        var rectCCP = [ccp1, ccp2];
        this.guide.addClipping(this._view, rectCCP, 1);

        this.sortCoins();
        this._view.setGuideHand(this.sortCoinList[0].grid);

        this.guide.removeTip();
        this.setTipArray(GAME_GUIDE_TIP[this._args.gameID].guideTip[1], false, 4);
        this.guide.init(this._guideArray);
        this.guide.x = this._view.width*0.5 - this.guide.width*0.5;
        this.guide.y = ccpY+10*scale;
        this._view._purseBtn.setTouchEnabled(false);
        this.setCoinTouch(true);
        this._isAppoint = 2;
    },

    goalTip: function () {
        switch (this._isAppoint) {
            case 1:
                var delay = cc.DelayTime.create(this.dTime);
                var call = cc.CallFunc.create(this.showFirstTip, this);
                this.runAction(cc.Sequence.create(delay, call));
                break;
            case 2:
                this.removeHand();
                this._view.setGuideHand(this.sortCoinList[1].grid);

                this.guide.removeTip();
                this.setTipArray(GAME_GUIDE_TIP[this._args.gameID].guideTip[2], false, 4);
                this.guide.init(this._guideArray);
                this.guide.x = this._view.width*0.5 - this.guide.width*0.5;
                this._view._purseBtn.setTouchEnabled(false);
                this._isAppoint = 3;
                break;
            case 3:
                this.guide.removeClipping();
                this.removeHand();
                this.removeCoinList();

                this.guide.removeTip();
                this.setTipArray(GAME_GUIDE_TIP[this._args.gameID].guideTip[3], false, 4);
                this.guide.init(this._guideArray);
                this.guide.x = this._view.width*0.5 - this.guide.width*0.5;
                this._view._purseBtn.setTouchEnabled(true);
                this._isAppoint = 4;
                break;
        }
    },

    setCoinTouch: function (isClick) {
        for (var i = 0; i < this._coinArray.length; i++) {
            for (var j = 0; j < this._coinArray[i].length; j++) {
                this._coinArray[i][j]._isGuideTouch = isClick;
            };
        };
    },

    removeHand: function () {
        if (this._view.hand) {
            this._view.hand.stopAllActions();
            this._view.hand.removeFromParent(true);
            this._view.hand = null;
        }
    },

    sortCoins: function () {
        this.sortCoinList = new Array();
        for (var i = 0; i < this._coinArray.length; i++) {
            var coinCols = this._coinArray[i];
            for (var j = 0; j < coinCols.length; j++) {
                var caLength = this.sortCoinList.length;
                this.sortCoinList[caLength] = {};
                this.sortCoinList[caLength].grid = coinCols[j];
                this.sortCoinList[caLength].gridValue = coinCols[j]._value;
            };
        };

        for (var i = 0; i < this.sortCoinList.length-1; i++) {
            var gridArray = this.sortCoinList[i];
            for (var j = i; j < this.sortCoinList.length; j++) {
                var gridList = this.sortCoinList[j];
                if (gridArray.gridValue > gridList.gridValue) {
                    var testList = {};
                    testList.grid = gridArray.grid;
                    testList.gridValue = gridArray.gridValue;
                    
                    gridArray.grid = gridList.grid;
                    gridArray.gridValue = gridList.gridValue;
                    
                    gridList.grid = testList.grid;
                    gridList.gridValue = testList.gridValue;
                    
                    testList.grid = null;
                    testList.gridValue = null;
                    testList = null;
                }
            };
        };
    },

    removeCoinList: function () {
        var listLength = this.sortCoinList.length;
        for (var i = 0; i < listLength; i++) {
            this.sortCoinList[i] = null;
        };
        this.sortCoinList.splice(0, listLength);
    },

    guideSettle: function () {
        
        if (this.guide) {
            this.guide.removeFromParent(true);
            this.guide = null;
        }
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
        self._gameState = SG_GE.GAME_STATE_ENUM.OVER;
        var action = self._view._progressBar.getActionByTag(self.ACTION_TIME_PROGRESS);
        if(typeof(action) == 'object'){
            cc.director.getActionManager().removeAction(action);
        }
        self._view._progressBar.setPercentage(100);
        
        self._var.repeate_index = 1;
        self._var.gameTime = 0;
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

    //-------------------------------------------------------//


    addCoin:function(){
        this._coinArray.splice(0, this._coinArray.length);
        this._coinArray = [];
        var scale = this._cellWidth/this._cellSize;
        for (var row = 0; row < this._config.row_column[0]; row++) {
            this._coinArray[row] = [];
            for (var col = 0; col < this._config.row_column[1]; col++) {
                var coin = new SchulteNumber();
                coin.setParentHandle(this,this.callHandle);
                coin.attr({
                    x:this._cellWidth*(row+0.5)+this._cellSpace*row,
                    y:this._cellHeight*(col+0.5)+this._cellSpace*col,

                });
                coin._state = SG_GE.CellState.DEFAULT;
                coin._scale = scale;
                coin._lbl_number.setString(2);
                this._view._upLayer.addChild(coin);

                this._coinArray[row][col] = coin;                         
            };     
        };

        this._coinFilterArray.splice(0, this._coinFilterArray.length);
        this._coinFilterArray = [];
        for (var i = 0; i < this._config.filter_grid_num; i++) {
            var coin = new SchulteNumber();
            coin.setParentHandle(this,this.callHandle);
            coin.attr({
                x:this._cellWidth*(i+0.5)+this._cellSpace*i,
                y:this._cellHeight/2,
            });
            coin._state = SG_GE.CellState.BLANK;
            coin._scale = scale;
            coin._lbl_number.setString(1);
            this._view._downLayer.addChild(coin);

            this._coinFilterArray[i] = coin; 
        }
        if (this._isGuide && this._isAppoint == 1) {
            this.setCoinTouch(false);
        }
       
    },
    removeCoin:function(delayTime){  
        this.stopAllActions();   
        var seq = cc.sequence(
            cc.callFunc(function(){
                this._view.disappearRotateScale(this._view._upLayer,delayTime||SG_GE.coin_action_time_disappear);
                this._view.disappearRotateScale(this._view._downLayer,delayTime||SG_GE.coin_action_time_disappear);
            },this),
            cc.delayTime(delayTime||SG_GE.coin_action_time_disappear),           
            cc.callFunc(function(){
                this._view._upLayer.removeAllChildren(true);
                this._view._downLayer.removeAllChildren(true);
                this._coinArray = [];
                this._coinFilterArray = [];
            },this)
        );
        this.runAction(seq);
    },

    removeGuideCoins: function () {
        for (var i = 0; i < this._coinArray.length; i++) {
            var colCoins = this._coinArray[i];
            for (var j = 0; j < colCoins.length; j++) {
                colCoins[j].removeFromParent(true);
                colCoins[j] = null;  
            };
            colCoins.splice(0, colCoins.length);
        };
        this._coinArray.splice(0, this._coinArray.length);

        for (var i = 0; i < this._coinFilterArray.length; i++) {
            var colCoins = this._coinFilterArray[i];
            for (var j = 0; j < colCoins.length; j++) {
                colCoins[j].removeFromParent(true);
                colCoins[j] = null;  
            };
            colCoins.splice(0, colCoins.length);
        };
        this._coinFilterArray.splice(0, this._coinArray.length);

        this._view._upLayer.removeAllChildren(true);
        this._view._downLayer.removeAllChildren(true);
        this._coinArray = [];
        this._coinFilterArray = [];
    },

    setCoinAttr:function(){
        this._view.setStartTipText(dict_sg_element[String(this._config.ele_start)].str);
        this._var.curTargetValue = dict_sg_element[String(this._config.ele_start)].value;
        this._var.endTargetValue = this._var.curTargetValue + this._config.row_column[0]*this._config.row_column[1];
        var posArray = this.getRandomPosArray(this._config.row_column[0],this._config.row_column[1]);
        util.shuffle(posArray);
        for (var i = 0; i < posArray.length; i++) {
            var pos = posArray[i];
            var coin = this._coinArray[pos.row][pos.col];
            var ele = dict_sg_element[String(this._config.ele_start+i)];            
            coin._value = ele.value;
            coin._str = ele.str;
            if (ele.str.length == 0){
                var index = Math.round((ele.equation.length-1)*Math.random())
                coin._str = ele.equation[index];
                if(this._var.curTargetValue == ele.value){
                    this._view.setStartTipText(coin._str);
                }
            }
            coin._lbl_number.setString(coin._str);
        };
        for (var i = 0; i < this._coinArray.length; i++) {
            util.shuffle(this._coinArray[i]);
        };
        util.shuffle(this._coinArray);
        var filter_ele =[];
        for (var i = 0; i < this._config.filter_grid_num; i++) {            
            var pos = posArray[i];
            var coin = this._coinArray[pos.row][pos.col];
            filter_ele[i] = {value:coin._value,str:coin._str,isBlank:true};
            if (i < this._config.blank_grid_num){                
                coin._value = -1;
                coin._touchEnable = false;
                coin._lbl_number.setString('');
                coin._state = SG_GE.CellState.BLANK;
                coin.setCellState(SG_GE.CellState.BLANK);
            }else{
                filter_ele[i].isBlank = false;
            }
        };
        util.shuffle(filter_ele);
        for (var i = 0; i < this._config.filter_grid_num; i++) {
            var filter_coin = this._coinFilterArray[i];
            filter_coin._value = filter_ele[i].value;
            if (filter_ele[i].isBlank == false){
                filter_coin._value = -1;
            }
            filter_coin._str = filter_ele[i].str;
            filter_coin._lbl_number.setString(filter_ele[i].str);
            filter_coin.setCellState(SG_GE.CellState.BLANK);
        };
        if(this._config.filter_grid_num > 0){
            this._view._downLayer.setVisible(true);
        }else{
            this._view._downLayer.setVisible(false);
        }
    },
    runOneGame:function(delayTime, level){ 
        var seq = cc.sequence(
            cc.delayTime(delayTime), 
            cc.callFunc(function(){
                //this._view._progressBar.setPercentage(100);
                this._view.topLayer.setVisible(true);
                this.getConfig(level,this._var.repeate_index);
                this.adjustLayout();
                this.addCoin();
                this.setCoinAttr();
                this._view.appearRotateScale(this._view._upLayer,SG_GE.coin_action_time_appear);
                this._view.appearRotateScale(this._view._downLayer,SG_GE.coin_action_time_appear);   
            },this),
            cc.delayTime(SG_GE.coin_action_time_appear),           
            cc.callFunc(function(){            
                this._gameState = SG_GE.GAME_STATE_ENUM.ONGAME;
                if(this._var.repeate_index == 1){  
                    this._view._progressBar.setPercentage(100);                  
                    this._var.gameTime = 0;
                    this._var.startTimeFlag = true;
                    var action = cc.progressTo(this._config.countdown, 0);
                    action.tag = this.ACTION_TIME_PROGRESS;
                    this._view._progressBar.runAction(action);
                }
            },this)
        );
        this.runAction(seq);
    },
    adjustLayout:function(){
        var width = this._config.row_column[0] * (this._cellWidth + this._cellSpace) - this._cellSpace;
        var height = this._config.row_column[1] * (this._cellWidth + this._cellSpace) - this._cellSpace;
        this._view._upLayer.width = width;
        this._view._upLayer.height = height;   
        this._view.lblStartTip.y = this._view._upLayer.y+height*0.5+40;
        if (this._isGuide && this._isAppoint == 1) {
            this.guide.setVisible(true);
            this.guide.y = this._view.lblStartTip.y + this._view.lblStartTip.height*0.5+10;
        }       

        if (this._config.filter_grid_num > 0){
            var _width = this._config.filter_grid_num * (this._cellWidth + this._cellSpace*1.5) - this._cellSpace*1.5;
            this._view._downLayer.width = _width;
            this._view._downLayer.height = this._cellWidth;
            this._view._downLayer.y = this._view._upLayer.y-this._view._upLayer.height/2-this._cellWidth;            
        }
    },
    callHandle:function(self,coin){
        self.judgeRightWrong(coin);
    },
    judgeRightWrong:function(coin){
        if (this._gameState != SG_GE.GAME_STATE_ENUM.ONGAME){
            return;
        }
    
        if(coin._value == this._var.curTargetValue){
            coin._hasSeleted = true;
            coin.setCellState(SG_GE.CellState.RIGHT)
            this._var.curTargetValue +=1;
            this._var.roundRightNum +=1;
            this.goalTip();
            if (this._var.curTargetValue == this._var.endTargetValue){
                if (this._isGuide && this._isAppoint == 4) {
                    this.guide.removeTip();
                    this._isAppoint == 5;
                }
                this._var.repeate_index += 1;
                this.settle(false);  
            }
        }else{
            coin.runWrongAction(SG_GE.coin_action_time_wrong);
            //this.settle();
        }
    },
    settle:function(isTimeout){
        this._gameState = SG_GE.GAME_STATE_ENUM.OVER;
        // cc.log('----------settle-------------', this._var.repeate_index, this._var.repeate_num);
        if(this._var.repeate_index > this._var.repeate_num || isTimeout == true){
            this._var.startTimeFlag = false;
            var action = this._view._progressBar.getActionByTag(this.ACTION_TIME_PROGRESS);
            if(typeof(action) == 'object'){
                cc.director.getActionManager().removeAction(action);
            }
            this._view.topLayer.setVisible(false);

            this.removeCoin(0.000001);

            if (this._isGuide) {
                this.guideSettle();
                return;
            }

            if (this._isGuide == false && this._args.isFirstTest == true && this._args.isLearnTest == true) {
                var delegate = this._args.delegateLearnTest;
                if (isTimeout == false) {
                    delegate.recordLearnTestRes(delegate,true,this._var.energyLevel);
                }else {
                    delegate.recordLearnTestRes(delegate,true,this._var.energyLevel-1);
                }
                if(delegate.IsLastLearnTest(delegate) == true){
                    delegate.showViewSettleTest(delegate);
                } else {
                    delegate.HandleStartTest(delegate, false);
                }  
            }else if (this._isGuide == false && this._args.isLearnTest == true && this._args.isFirstTest == false) {
                var delegate = this._args.delegateLearnTest;
                if (this._var.roundRightNum >= 4) {
                    // cc.log("SchulteGrid Pass", this._var.roundRightNum);
                    delegate.recordLearnTestRes(delegate,true,this._var.energyLevel);
                }else {
                    // cc.log("SchulteGrid not Pass");
                    delegate.recordLearnTestRes(delegate,false,this._var.energyLevel);
                }
                if(delegate.IsLastLearnTest(delegate) == true){
                    delegate.showViewSettleTest(delegate);
                } else {
                    delegate.HandleStartTest(delegate, false);
                }                
            }else {
                this.showSettleView(isTimeout);
            }
        }else{
            this.removeCoin();
            var gototTime = SG_GE.coin_action_time_disappear + 0.000001;
            var self = this;
            var gotoGame = function () {
                if (self._isGuide) {
                    self.runOneGame(SG_GE.coin_action_time_disappear, self.guideLevel);
                    return;
                }
                self.runOneGame(SG_GE.coin_action_time_disappear, self._args.level);
            }
            this.scheduleOnce(gotoGame, gototTime)
        }
    },
    showSettleView:function(isTimeout){        
        var args = {
            gameID:this._args.gameID,
            level:this._args.level,
            hasPassed:true,
            userId : this._args.userId,
            token : this._args.token,
            isGameTest : this._args.isTest,
            starsList : this._args.starsList,
        };
        var starNum = 0;
        this._var.gameTime = Number(this._var.gameTime).toFixed(2);
        if(isTimeout != true){            
            if(this._var.gameTime > this._config.get_star123_time[0]){
                starNum = 0;
                args.hasPassed = false;
            }else if(this._var.gameTime > this._config.get_star123_time[1]){
                starNum = 1;
            }else if(this._var.gameTime > this._config.get_star123_time[2]){
                starNum = 2;
            }else{
                starNum = 3;
            }
        }else{
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
            self._viewSettle.setResTipText('用时:'+self._var.gameTime+'秒');
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
        this._viewSettle.setResTipText('用时:'+this._var.gameTime+'秒');
        this.addChild(this._viewSettle);
    },

    getConfig:function(level,repeateIndex){
        this._var.roundRightNum = 0;
        var level_unit;
        var unit;
        if (this._isGuide || (this._args.isFirstTest == false && this._args.isLearnTest == false)) {
            this._var.repeate_num = dict_sg_level[String(level)].round_id_list.length;
            level_unit = dict_sg_level[String(level)];
            var round_id = level_unit.round_id_list[repeateIndex-1];
            unit = dict_sg_level_round[String(round_id)];
        }else if (this._args.isFirstTest == true) {
            this._var.repeate_num = first_test_sg_level[String(level)].round_id_list.length;
            level_unit = first_test_sg_level[String(level)];
            var round_id = level_unit.round_id_list[repeateIndex-1];
            unit = first_test_sg_level_round[String(round_id)];
            this._var.energyLevel = unit.energy_level;
        }else if (this._args.isLearnTest == true) {
            this._var.repeate_num = test_sg_level[String(level)].round_id_list.length;
            level_unit = test_sg_level[String(level)];
            this._var.energyLevel = level_unit.energy_level;
            var round_id = level_unit.round_id_list[repeateIndex-1];
            unit = test_sg_level_round[String(round_id)];
        }
        
        this._config.countdown = level_unit.countdown;
        this._config.get_star123_time = level_unit.get_star123_time;
        if (unit == null || typeof(unit) == 'undefined'){
            cc.log("error!!!! sg config level=",level," index=",repeateIndex-1);  
            return;          
        }
        this._config.row_column = unit.row_column;
        this._config.blank_grid_num = unit.blank_grid_num;
        this._config.filter_grid_num = unit.filter_grid_num;

        var v2 = unit.ele_start_range[1]||unit.ele_start_range[0];
        var diff = v2 - unit.ele_start_range[0];
        this._config.ele_start = unit.ele_start_range[0]+Math.round(Math.random()*diff);
        //util.log(this._config);
        // util.log(this._var,'_var');
    },
    getRandomPosArray:function(row_num,col_num){
        var posArray = [];
        var len = 0;
        for (var i=0;i<row_num;i++){
            for (var j = 0; j < col_num; j++) {
                posArray[len] = {row:i,col:j};
                len += 1;
            }
        }
        return posArray;
    },

    handlePurseEvent:function(self){
        self._var.startTimeFlag = false;
        self._isPause = false;
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
        self._viewGameSetting = new GameSetting(args);
        if (self._isGuide) {
            self._viewGameSetting.setGuideHelp();
        }
        self.addChild(self._viewGameSetting);
        self._viewGameSetting.setHandle(self,self.handleContinue,self.handleRestart); 
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
        self._gameState = SG_GE.GAME_STATE_ENUM.OVER;
        cc.director.getActionManager().resumeTarget(self._view._progressBar);
        cc.director.getActionManager().resumeTarget(self);
        var action = self._view._progressBar.getActionByTag(self.ACTION_TIME_PROGRESS);
        if(typeof(action) == 'object'){
            cc.director.getActionManager().removeAction(action);
        }
        self._viewGameSetting.removeFromParent(); 
        self._view._progressBar.setPercentage(100);
        
        self._var.repeate_index = 1;
        self._var.gameTime = 0;

        if (self._isGuide) {
            self.removeGuideCoins();
            self.stopAllActions();
            self.removeHand();
            self.guide.removeTip();
            self.guide.removeClipping();
            self._isAppoint = 1;
            self.guide.removeFromParent(true);
            self.guide = null;
            self.sureGuide();
        }else {
            self.removeCoin(0.000001);
            var againGame = function () {
                self.runOneGame(0, self._args.level);
            }
            self.scheduleOnce(againGame, 0.000002);
            
        }  
    },
    handleNext:function(self){
        self._args.timestampStart = parseInt(new Date().getTime());
        self._args.level += 1;  
        if(self._args.level > 30){
            self._args.level = 1;  
        };
        self._view._progressBar.setPercentage(100);
        self._var.repeate_index = 1;
        self._var.gameTime = 0;
        self.runOneGame(0, self._args.level);
    },
    handleAgain:function(self){
        self._view._progressBar.setPercentage(100);
        self._var.repeate_index = 1;
        self._var.gameTime = 0;
        self.runOneGame(0, self._args.level);
    },
    update:function(dt){
        if(this._var.startTimeFlag == true){
            this._var.gameTime += dt;
            //cc.log('---this._var.gameTime += dt',this._var.gameTime,dt,this._config.countdown);
            if(this._var.gameTime > this._config.countdown){
                this._var.startTimeFlag = false;
                this._var.gameTime = Math.floor(this._var.gameTime);
                this.settle(true);
            }
        }
    },
    
    onExit:function(){
        cc.log('schulte--onExit',this._var.repeate_index);
        // this.removeFromParent(true);
        this._super();
    },

});
