
var SevenPuzzle = cc.Layer.extend({
    _seven_puzzle:null,
    _seven_graph_element:null,
    _seven_graph_element_flip:null,
    _is_puzzle_flix:null,
    _touch_x:null,
    _touch_y:null,
    _middle_touch_x:null,
    _middle_touch_y:null,
    _touch_graph_index:null,
    _double_click:null,
    _is_double_click:null,
    _touch_time:null,
    _small_triangle_array:null,
    _clickCircleIndex:null,
    _isClockwise:null,
    _gameTime:null,
    _floor_index:null,
    _isClickWin:null,
    _floorRes:null,
    isLow:null,
    disZero:null,
    _isGamePause:null,
    _elementIndex:null,
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

        this._playLevel = this._args.level;

        this._isGamePause = false;

        this.scheduleUpdate();

        this._view = new SevenPuzzleView(args.bg_color);
        this.addChild(this._view);

        this._isPause = false;
        var self = this;
        this._view._purseBtn.addClickEventListener(function(){
            if (self._isPause == false) {
                self._isPause = true;
                self.handlePurseEvent(self);
            }
            
        });

        this._floorRes = [];
        this._delFloorRes = [];


        this._isGuide = args.isGuide || false;
        var resArray = res.tangramLevel[args.level];
        if (this._isGuide) {
            resArray = res.tangramLevel[1];
        }

        for(var k in resArray){
            this._floorRes.push(resArray[k]);
        }
        for(var k in resArray){
            this._delFloorRes.push(resArray[k]);
        }
        
        var size = cc.winSize;
        var scale = size.width / 750;
        this._back_height = this._view._bottom.height*scale;

        cc.eventManager.addListener({
            event: cc.EventListener.TOUCH_ONE_BY_ONE,
            swallowTouches: false,
            onTouchBegan: this.onTouchBegan,
            onTouchMoved: this.onTouchMoved,
            onTouchEnded: this.onTouchEnded
        }, this);
        
        this._firstTestLevel = 0;

        
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
            this.sureGuide();
        }else {
            this.runOneGame(this._playLevel, this._firstTestLevel);
        }  

        return true;
    },

    //-------------------------------------------------------//
    //--------------------- 新手引导 -------------------------//
    //-------------------------------------------------------//

    sureGuide: function () {
        this._isGuide = true;
        this.guideLevel = 0;
        // this._view.setGuideVisible(false);
        this.dTime = this.beginGuide();
        this.goalTip();
    },

    beginGuide: function () {
        var size = cc.winSize;
        var scale = size.width / 750;

        this.setTipArray(GAME_GUIDE_TIP[this._args.gameID].guideTip[0], true, 4);
        this.guide = new PlayerGuide(this._guideArray);
        this.guide.x = this._view.width*0.5 - this.guide.width*0.5;
        this.guide.y = this._view.topBg.y  -  this._view.topBg.height*scale - this.guide.height - 10;
        this._view.addChild(this.guide, 10);

        this.runOneGame(this._playLevel, this._firstTestLevel); 
        this.unschedule(this.getTime);
        this._view._progressBar.setVisible(false);
        this._isClickWin = false;
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
                this.scheduleOnce(this.showMoveRotate, this.dTime);
                break;
            case 3:
                this.showMoveFlipX();
                break; 
            case 4:
                this.guideSettle();
                break;
        }
    },

    showMoveRotate: function () {
        var size = cc.winSize;
        var scale = size.width / 750;

        var puzzleInitPos = this._seven_puzzle[0].getPosition();

        //clipping
        this._view._purseBtn.setTouchEnabled(false);
        var puzzleZOrder = this._seven_puzzle[0].getLocalZOrder();
        this._seven_puzzle[0].setLocalZOrder(9);
        var puzzleScale = this._seven_puzzle[0]._scale;
        var bgPuzzle = this._seven_puzzle[0].graph_puzzle;
        var dis = bgPuzzle.width*puzzleScale - this._view._bottom.height*scale;

        var floorDisX = this._view.floor_puzzle.x - this._view.floor_puzzle.width * puzzleScale * 0.5;
        var floorDisY = this._view.floor_puzzle.y - this._view._bottom.height*scale - this._view.floor_puzzle.height * puzzleScale * 0.5;
        var moveXDis = -(puzzleInitPos.x + bgPuzzle.width*puzzleScale*0.5 - 438*puzzleScale - floorDisX);
        var moveYDis = this._view._bottom.height*scale - puzzleInitPos.y + 328*puzzleScale + floorDisY + bgPuzzle.height*(Math.sqrt(2)-1)*puzzleScale*0.5;
        
        var ccp0 = cc.p(this._seven_puzzle[0].x + dis*0.75,0);
        var ccp1 = cc.p(this._seven_puzzle[0].x + bgPuzzle.width*puzzleScale - dis*0.25,this._view._bottom.height*scale);
        var ccp2 = cc.p(this.width, this._view._bottom.height*scale);
        var ccp3 = cc.p(this.width,0);
        var rectCCP1 = [ccp0, ccp1, ccp2, ccp3];

        var ccpDownX = puzzleInitPos.x + bgPuzzle.width*puzzleScale*0.5 + moveXDis - 404*puzzleScale*0.5 - 20*scale;
        var ccpDownY = puzzleInitPos.y + bgPuzzle.height*puzzleScale*0.5 + moveYDis - 444*puzzleScale*0.5 - 20*scale
        var ccpTopX = this.width;
        var ccpTopY = puzzleInitPos.y + bgPuzzle.height*puzzleScale*0.5 + moveYDis + 444*puzzleScale*0.5 + 20*scale;
        
        var ccp4 = cc.p(ccpDownX,ccpDownY);
        var ccp5 = cc.p(ccpTopX, ccpTopY);

        // var ccp4 = cc.p(this.width*0.5 - 150*puzzleScale,this.height*0.5-100*puzzleScale);
        // var ccp5 = cc.p(this.width, this.height*0.5 + bgPuzzle.width*puzzleScale*Math.sqrt(2));
        var rectCCP2 = [ccp4, ccp5];
        var rectCCP = new Array();
        rectCCP[0] = rectCCP1;
        rectCCP[1] = rectCCP2;
        this.guide.addClipping(this._view, rectCCP, 2);
        this.guide.setClippingZOrder();

        //wordTip
        this.guide.removeTip();
        this.setTipArray(GAME_GUIDE_TIP[this._args.gameID].guideTip[1], true, 4);
        this.guide.init(this._guideArray);
        this.guide.x = this._seven_puzzle[0].x + dis*0.75 - this.guide.width;
        this.guide.y = this._view._bottom.height*scale;

        // var moveYDis = 604*scale;
        // var moveXDis = -171*scale;

        // var moveXDis = -(this._seven_puzzle[0].x + bgPuzzle.width*puzzleScale*0.5 - 438*puzzleScale);
        // var moveYDis = this._view._bottom.height*scale - this._seven_puzzle[0].y + 328*puzzleScale + bgPuzzle.height*(Math.sqrt(2)-1)*puzzleScale*0.5;
        
        //handTip
        this.addMoveTip1(this._seven_puzzle[0], puzzleScale, moveYDis);

        //action-Move
        var delay0 = cc.DelayTime.create(0.5);
        var moveY = cc.MoveBy.create(0.5, cc.p(0, moveYDis));
        var call1 = cc.CallFunc.create(function () {
            this._view.addCircleRotate(this._seven_puzzle[0]);
            this.addRotateTip(this._seven_puzzle[0], puzzleScale);
        }, this);
        var delay1 = cc.DelayTime.create(1.2);
        var call2 = cc.CallFunc.create(function () {
            this.puzzleFit(this._seven_puzzle[0]);
        }, this);
        var delay2 = cc.DelayTime.create(0.2);
        var moveX = cc.MoveBy.create(0.5, cc.p(moveXDis, 0));
        var call3 = cc.CallFunc.create(function () {
            // this._view._circle_rotate.removeFromParent(true);
            this.reviewOver(false);
            this._seven_puzzle[0].setLocalZOrder(puzzleZOrder);
        }, this);
        var delay3 = cc.DelayTime.create(0.3);
        var call4 = cc.CallFunc.create(function () {
            // this.reviewOver();
            this.reviewPlaying(this._seven_puzzle[0], puzzleInitPos, 2);
        }, this);
        var seq1 = cc.Sequence.create(delay0, moveY, call1, delay1, call2, delay2, moveX, call3, delay3, call4);
        this._seven_puzzle[0].runAction(seq1);

        //Rotate
        var delay2 = cc.DelayTime.create(0.7);
        var rotate = cc.RotateBy.create(0.5, -45);
        var seq2 = cc.Sequence.create(delay0, delay2, rotate);
        this._seven_puzzle[0].graph_puzzle.runAction(seq2);
    },

    reviewOver: function (guideType) {
        this._view._circle_rotate.removeFromParent(true);
        this._view._circle_rotate = null;
        this._view._isCircle_exist = false;
        this._double_click = -1;
        this._view._purseBtn.setTouchEnabled(false);
        this._isClickWin = false;
        if (guideType == true) {
            this._isAppoint = 3;
        }
    },

    showMoveFlipX: function () {
        var size = cc.winSize;
        var scale = size.width / 750;

        var puzzleInitPos = this._seven_puzzle[5].getPosition();
        var puzzleZOrder = this._seven_puzzle[5].getLocalZOrder();
        var puzzleScale = this._seven_puzzle[5]._scale;
        var bgPuzzle = this._seven_puzzle[5].graph_puzzle;

        // var moveYDis = 384*scale;
        // var moveXDis = -66*scale;
        var floorDisX = this._view.floor_puzzle.x - this._view.floor_puzzle.width * puzzleScale * 0.5;
        var floorDisY = this._view.floor_puzzle.y - this._view._bottom.height*scale - this._view.floor_puzzle.height * puzzleScale * 0.5;
        var moveXDis = 60*puzzleScale + floorDisX - this._seven_puzzle[5].x + (bgPuzzle.height- bgPuzzle.width)*0.5*puzzleScale;
        var moveYDis = this._view._bottom.height*scale - this._seven_puzzle[5].y + 200*puzzleScale + floorDisY + 0.5*puzzleScale*(bgPuzzle.width - bgPuzzle.height);

        this._seven_puzzle[0].stopAllActions();
        var delay1 = cc.DelayTime.create(0.2);
        var call1 = cc.CallFunc.create(function () {
            //clipping
            this._seven_puzzle[5].setLocalZOrder(9);
            var dis = 10*scale;
            var surplusSide = bgPuzzle.width*puzzleScale + dis*2 - (this._view._bottom.height*scale - this._seven_puzzle[5].y - bgPuzzle.height*puzzleScale*0.5);
            var downDistance = bgPuzzle.width*puzzleScale + dis*2 - (this._seven_puzzle[5].y + bgPuzzle.height*puzzleScale*0.5);
            
            var ccp0 = cc.p(this._seven_puzzle[5].x - dis,this._seven_puzzle[5].y + bgPuzzle.height*puzzleScale*0.5);
            var ccp1 = cc.p(this._seven_puzzle[5].x - dis, this._view._bottom.height*scale + surplusSide);
            var ccp2 = cc.p(this._seven_puzzle[5].x + bgPuzzle.width*puzzleScale + dis, this._seven_puzzle[5].y + bgPuzzle.height*puzzleScale*0.5);
            var ccp3 = cc.p(this._seven_puzzle[5].x + bgPuzzle.width*puzzleScale + dis, -downDistance);
            var rectCCP1 = [ccp1, ccp2, ccp3, ccp0];

            var ccpDownX = puzzleInitPos.x + bgPuzzle.width*puzzleScale*0.5 + moveXDis - 404*puzzleScale*0.5 - 20*scale;
            var ccpDownY = puzzleInitPos.y + bgPuzzle.height*puzzleScale*0.5 + moveYDis - 444*puzzleScale*0.5 - 20*scale
            var ccpTopX = puzzleInitPos.x + bgPuzzle.width*puzzleScale*0.5 + 404*puzzleScale*0.5 + 20*scale;
            var ccpTopY = puzzleInitPos.y + bgPuzzle.height*puzzleScale*0.5 + moveYDis + 444*puzzleScale*0.5 + 20*scale;
            
            var ccp4 = cc.p(ccpDownX,ccpDownY);
            var ccp5 = cc.p(ccpTopX, ccpTopY);

            // var ccp4 = cc.p(0,(this._view._bottom.height + 30)*scale);
            // var ccp5 = cc.p(this.width*0.5 + 100*scale, this.height*0.5 + 120*scale);
            var rectCCP2 = [ccp4, ccp5];
            var rectCCP = new Array();
            rectCCP[0] = rectCCP1;
            rectCCP[1] = rectCCP2;
            this.guide.addClipping(this._view, rectCCP, 2);
            this.guide.setClippingZOrder();

            //wordTip
            this.guide.removeTip();
            this.setTipArray(GAME_GUIDE_TIP[this._args.gameID].guideTip[3], true, 4);
            this.guide.init(this._guideArray);
            this.guide.x = this._seven_puzzle[5].x + bgPuzzle.width*puzzleScale + 20*scale;
            this.guide.y = this._view._bottom.height*scale - this.guide.height*0.5;

            //handTip
            this.addMoveTip1(this._seven_puzzle[5], puzzleScale, moveYDis);

        }, this);

        var delay2 = cc.DelayTime.create(0.5);
        var moveY = cc.MoveBy.create(0.5, cc.p(0, moveYDis));
        var call2 = cc.CallFunc.create(function () {
            this._view.addCircleRotate(this._seven_puzzle[5]);
            this.addRotateTip(this._seven_puzzle[5], puzzleScale);
        }, this);
        var delay3 = cc.DelayTime.create(0.7);
        var call3 = cc.CallFunc.create(function () {
            this.guide.removeTip();
            this.setTipArray(GAME_GUIDE_TIP[this._args.gameID].guideTip[4], true, 4);
            this.guide.init(this._guideArray);
            this.guide.x = (this.width*0.5 + 100*scale) / 2 - this.guide.width*0.5;
            this.guide.y = this.height*0.5 + 120*scale + this.guide.height;
        }, this);
        var delay4 = cc.DelayTime.create(0.5);
        var call4 = cc.CallFunc.create(function () {
            this.addFlixPTip(this._seven_puzzle[5]);
        }, this);
        var delay5 = cc.DelayTime.create(1.2);
        var call5 = cc.CallFunc.create(function () {
            this.puzzleFit(this._seven_puzzle[5]);
        }, this);
        var delay6 = cc.DelayTime.create(0.2);
        var moveX = cc.MoveBy.create(0.5, cc.p(moveXDis, 0));
        var call6 = cc.CallFunc.create(function () {
            // this._view._circle_rotate.removeFromParent(true);
            this.reviewOver(true);
            this._seven_puzzle[5].setLocalZOrder(puzzleZOrder);
        }, this);
        var delay7 = cc.DelayTime.create(0.3);
        var call7 = cc.CallFunc.create(function () {
            // this.reviewOver();
            this.reviewPlaying(this._seven_puzzle[5], puzzleInitPos, 5);
        }, this);

        var seq1 = cc.Sequence.create(delay1, call1, delay2, moveY, call2, delay3, call3, delay4, call4, delay5, call5, delay6, moveX, call6, delay7, call7);
        this._seven_puzzle[5].runAction(seq1);

        //flipX
        var delay6 = cc.DelayTime.create(1.4);
        var rotate = cc.RotateBy.create(0.5, -90);
        var delay7 = cc.DelayTime.create(1.2);
        var flipx = cc.FlipX.create(true);
        var seq2 = cc.Sequence.create(delay6, rotate, delay7, flipx);
        this._seven_puzzle[5].graph_puzzle.runAction(seq2);

    },

    addMoveTip1: function (puzzle, puzzleScale, moveYDis) {
        var size = cc.winSize;
        var scale = size.width / 750;

        var bgPuzzle = puzzle.graph_puzzle;

        var puzzleWorldPos = puzzle.convertToWorldSpace(bgPuzzle);
        var handPos = cc.p(puzzleWorldPos.x + bgPuzzle.width*puzzleScale*0.25, puzzleWorldPos.y);
        this._view.setGuideHand(handPos);
        var arrowPos = cc.p(puzzleWorldPos.x + bgPuzzle.width*puzzleScale*0.25, (puzzleWorldPos.y+moveYDis)*0.7);
        this._view.setGuideArraw(arrowPos, guideTipRes[0]);
        this._view.addHandAction1(cc.p(0, moveYDis));
    },

    addRotateTip: function (puzzle, puzzleScale) {
        var size = cc.winSize;
        var scale = size.width / 750;

        var puzzleWorldPos = puzzle.convertToWorldSpace(this._view._circle_rotate);
        var radius = (this._view._circle_rotate.height*0.5-40)*puzzleScale;
        var origin_x = puzzleWorldPos.x;
        var origin_y = puzzleWorldPos.y;
        var handPos = cc.p(origin_x + 10*scale, origin_y+radius);
        this._view.setHandPos(handPos);

        this._view.setArrowPic(guideTipRes[2]);
        this._view.setArrowFade(true);
        this._view.setArrowRotate(-90);
        var arrowPos = cc.p(origin_x + 10*scale, origin_y);
        this._view.setArrowPos(arrowPos);

        ccp1 = cc.p(0,0);
        var x = origin_x - radius*Math.cos(67.5*Math.PI / 180);
        ccp2 = cc.p(-radius*Math.cos(67.5*Math.PI / 180), Math.sqrt(radius*radius - (x - origin_x)*(x - origin_x)) - radius);
        x = origin_x - radius*Math.cos(45*Math.PI / 180);
        ccp3 = cc.p(-radius*Math.cos(45*Math.PI / 180), Math.sqrt(radius*radius - (x - origin_x)*(x - origin_x)) - radius);
        x = origin_x - radius*Math.cos(22.5*Math.PI / 180);
        ccp4 = cc.p(-radius*Math.cos(22.5*Math.PI / 180), Math.sqrt(radius*radius - (x - origin_x)*(x - origin_x)) - radius);
        x = origin_x - radius;
        ccp5 = cc.p(-radius, -radius);

        var posArray = [
            ccp1,
            ccp2,
            ccp3,
            ccp4,
            ccp5
        ];
        this._view.addHandAction2(posArray);
    },

    addFlixPTip: function (puzzle) {
        var size = cc.winSize;
        var scale = size.width / 750;

        var puzzleWorldPos = puzzle.convertToWorldSpace(this._view._circle_rotate);
        var handPos = cc.p(puzzleWorldPos.x + 10*scale, puzzleWorldPos.y);
        this._view.setHandPos(handPos);
        this._view.addHandAction4();
    },

    puzzleFit: function (puzzle) {
        var size = cc.winSize;
        var scale = size.width / 750;

        var puzzleWorldPos = puzzle.convertToWorldSpace(this._view._circle_rotate);
        var handPos = cc.p(puzzleWorldPos.x + 10*scale, puzzleWorldPos.y);
        this._view.setHandPos(handPos);

        this._view.setArrowPic(guideTipRes[1]);
        this._view.setArrowFade(false);
        this._view.setArrowRotate(0);
        var arrowPos = cc.p(puzzleWorldPos.x - 171*scale*0.5, puzzleWorldPos.y);
        this._view.setArrowPos(arrowPos);

        var moveCCP = cc.p(-171*scale, 0);
        this._view.addHandAction3(moveCCP);
    },

    reviewPlaying: function (puzzle, puzzleInitPos, tipIndex) {
        var size = cc.winSize;
        var scale = size.width / 750;

        this.guide.removeTip();
        this.setTipArray(GAME_GUIDE_TIP[this._args.gameID].guideTip[tipIndex], true, 4);
        this.guide.init(this._guideArray);
        this.guide.x = this._view.width*0.5 - this.guide.width*0.5;
        this.guide.y = this._view.topBg.y  -  this._view.topBg.height*scale - this.guide.height - 10;
        if (tipIndex == 5) {
           var flipx = cc.FlipX.create(false);
            puzzle.graph_puzzle.runAction(flipx); 
        }
        
        puzzle.graph_puzzle.setRotation(0);
        puzzle.setPosition(puzzleInitPos);

        this.guide.removeClipping();
        this._view._purseBtn.setTouchEnabled(true);
        this._isClickWin = true;
        this._isAppoint = this._isAppoint + 1;
    },

    guideSettle: function () {
        this._seven_puzzle[5].stopAllActions();
        if (this.guide) {
            this.guide.removeTip();
            this.guide.removeFromParent(true);
            this.guide = null;
        }
        
        this.removeGraph();
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

    runOneGame: function (level, levelIndex) {
        this._isClickWin = true;
        if (this._isGuide || (this._args.isFirstTest == false && this._args.isLearnTest == false)) {
            this.unit = dict_sp_level[level];
        }else if (this._args.isFirstTest == true) {
            this.unit = first_test_sp_test[level];
            this._args.level = this.unit.testEnergy[levelIndex].game_level;
            this._args.energy_level = this.unit.testEnergy[levelIndex].energy_level;
            this._args.roundLength = this.unit.testEnergy.length;
        }else if (this._args.isLearnTest == true) {
            this.unit = test_sp_level[level];
            this._args.level = this.unit.game_level;
        }
        
        this._touch_time = 1;
        this._is_double_click = false;
        this._is_graph_y = false;
        this._isMove = true;
        this._isClockwise = 0;
        this._clickCircleIndex = -1;
        this._gameTime = this.unit.limit_time;
        this._is_puzzle_flix = new Array();
        this._seven_puzzle = new Array();
        this._seven_graph_element = new Array();
        this._seven_graph_element_flip = new Array();
        this._small_triangle_array = new Array();

        this._elementIndex = this._args.level;
        if (this._isGuide) {
            this._elementIndex = 1;
            this._floor_index = 1;
            var floor_res = dict_sp_element[this._elementIndex][this._floor_index].res;
            var percentage = this._view._progressBar.getPercentage();
            this._view.setViewMember(this.unit.limit_time, floor_res, percentage);
        }else {
            this._floor_index = Math.floor(Math.random() * 3 + 1);
            var floor_res = dict_sp_element[this._elementIndex][this._floor_index].res;
            var percentage = this._view._progressBar.getPercentage();
            this._view.setViewMember(this.unit.limit_time, floor_res, percentage);
            // this._view.initPoint(dict_sp_element[this._args.level][this._floor_index].target_pos);
        }
        

        this.getTime = function () {
            if (this._isGamePause == false) {
                this._gameTime = this._gameTime - 1;
                if (this._gameTime <= 0) {
                    cc.log("game over!");
                    this.unschedule(this.getTime);
                    this._isClickWin = false;
                    if (this._args.isLearnTest == true) {
                        var delegate = this._args.delegateLearnTest;
                        if (this._args.isFirstTest == true) {
                            delegate.recordLearnTestRes(delegate,true,this._args.energy_level - 1); 
                        }else{
                            delegate.recordLearnTestRes(delegate,false,this.unit.energy_level);
                        }
                        this.removeGraph();
                        if(delegate.IsLastLearnTest(delegate) == true){
                            delegate.showViewSettleTest(delegate);
                        } else {
                            delegate.HandleStartTest(delegate, false);
                        }                    
                    }else {
                        this.showSettleView();
                    }
                    return;
                }
            }
        }
        this.schedule(this.getTime, 1);

        this.init();

    },

    init: function () {
        var size = cc.winSize;
        var scale = size.width / 750;

        this.isLow = false;
        this.disZero;
        for (var i = 0; i < graph_number; i++) {
            
            var cell = new SevenGraph(seven_graph[i+1].res[0], this._view._graph_scale, seven_graph[i+1].graph_id, this._small_triangle_array);
            var gp_size = cell.graph_puzzle.getContentSize();
            var gap_scale_x = gp_size.width * (scale - this._view._graph_scale);
            var gap_scale_y = gp_size.height * (scale - this._view._graph_scale);
            cell.x = size.width * seven_graph[i+1].pos._x / 100 + gap_scale_x / 2;
            cell.y = size.height * seven_graph[i+1].pos._y / 100 - gap_scale_y / 2;

            if (i == 0 && cell.y <= 10) {
                this.isLow = true;
                this.disZero = 25 - cell.y;
            }

            if (this.isLow == true) {
                cell.y = cell.y + this.disZero;
            }

            var id = seven_graph[i+1].graph_id;
            this._view.addChildCell(cell, i+1, id);
            this._seven_puzzle.push(cell);
            this._is_puzzle_flix[i] = true;

            var gp_size = cell.graph_puzzle.getContentSize();
            this._seven_graph_element[i] = new Array();
            this._seven_graph_element_flip[i] = new Array();
            for (var j = 0; j < 2; j++) {
                if (j == 1) {
                    this._is_puzzle_flix[i] = false;
                }
                this.getGraphVertex(gp_size, id);
            };
            this._is_puzzle_flix[i] = true;
             
        };
    },

    getGraphVertex: function (gSize, id) {
        var point = new Array();
        if (id < 6) {
            this.getTriangleVertex(point, gSize, id);
        }else {
            this.getQuadrangleVertex(point, gSize, id);
        }
    },

    getTriangleVertex: function (point, gSize, id) {
        
        for (var i = 0; i < 3; i++) {
            point[i] = new Array();
        };
        switch (id) {
            case 1:
                this.getTriangleVertex1(point, gSize, id);
                break;
            case 2:
                this.getTriangleVertex2(point, gSize, id);
                break;
            case 3:
                this.getTriangleVertex3(point, gSize, id);
                break;
            case 4:
                this.getTriangleVertex4(point, gSize, id);
                break;
            case 5:
                this.getTriangleVertex5(point, gSize, id);
                break;
        }

        for (var i = 0; i < 3; i++) {
            var p_index_0 = i % 3;
            var p_index_1 = (i+1) % 3;
            var equation = new Array();
            equation[0] = point[p_index_0];
            equation[1] = point[p_index_1];
            if (this._is_puzzle_flix[id - 1] == true) {
                this._seven_graph_element[id - 1].push(equation);
            }else {
                this._seven_graph_element_flip[id - 1].push(equation);
            }
            
        };
    },

    getQuadrangleVertex: function (point, gSize, id) {
        
        for (var i = 0; i < 4; i++) {
            point[i] = new Array();
        };
        switch (id) {
            case 6:
                this.getQuadrangleVertex1(point, gSize, id);
                break;
            case 7:
                this.getQuadrangleVertex2(point, gSize, id);
                break;
        }

        for (var i = 0; i < 4; i++) {
            var p_index_0 = i % 4;
            var p_index_1 = (i+1) % 4;
            var equation = new Array();
            equation[0] = point[p_index_0];
            equation[1] = point[p_index_1];
            if (this._is_puzzle_flix[id - 1] == true) {
                this._seven_graph_element[id - 1].push(equation);
            }else {
                this._seven_graph_element_flip[id - 1].push(equation);
            }
        };
    },

    getTriangleVertex1: function (point, gSize, id) {
        if (this._is_puzzle_flix[id - 1] == true) {
            point[0]._x = 0;
            point[0]._y = 0;
            point[1]._x = gSize.width*this._view._graph_scale;
            point[1]._y = 0;
            point[2]._x = gSize.width*this._view._graph_scale;
            point[2]._y = gSize.height*this._view._graph_scale;
        } else {
            point[0]._x = 0;
            point[0]._y = gSize.height*this._view._graph_scale;
            point[1]._x = 0;
            point[1]._y = 0;
            point[2]._x = gSize.width*this._view._graph_scale;
            point[2]._y = 0;
        } 
    },
    
    getTriangleVertex2: function (point, gSize, id) {
        if (this._is_puzzle_flix[id - 1] == true) {
            point[0]._x = 0;
            point[0]._y = gSize.height*this._view._graph_scale;
            point[1]._x = 0;
            point[1]._y = 0;
            point[2]._x = gSize.width*this._view._graph_scale;
            point[2]._y = 0;
        } else {
            point[0]._x = 0;
            point[0]._y = 0;
            point[1]._x = gSize.width*this._view._graph_scale;
            point[1]._y = 0;
            point[2]._x = gSize.width*this._view._graph_scale;
            point[2]._y = gSize.height*this._view._graph_scale;
        }
          
    },

    getTriangleVertex3: function (point, gSize, id) {
        if (this._is_puzzle_flix[id - 1] == true) {
            point[0]._x = 0;
            point[0]._y = gSize.height*this._view._graph_scale;
            point[1]._x = gSize.width*this._view._graph_scale / 2;
            point[1]._y = 0;
            point[2]._x = gSize.width*this._view._graph_scale;
            point[2]._y = gSize.height*this._view._graph_scale;
        } else {
            point[0]._x = 0;
            point[0]._y = 0;
            point[1]._x = gSize.width*this._view._graph_scale;
            point[1]._y = 0;
            point[2]._x = gSize.width*this._view._graph_scale / 2;
            point[2]._y = gSize.height*this._view._graph_scale;
        }
    },

    getTriangleVertex4: function (point, gSize, id) {
        if (this._is_puzzle_flix[id - 1] == true) {
            point[0]._x = 0;
            point[0]._y = gSize.height*this._view._graph_scale;
            point[1]._x = gSize.width*this._view._graph_scale;
            point[1]._y = 0;
            point[2]._x = gSize.width*this._view._graph_scale;
            point[2]._y = gSize.height*this._view._graph_scale;
        } else {
            point[0]._x = 0;
            point[0]._y = gSize.height*this._view._graph_scale;
            point[1]._x = 0;
            point[1]._y = 0;
            point[2]._x = gSize.width*this._view._graph_scale;
            point[2]._y = gSize.height*this._view._graph_scale; 
        }
        
    },

    getTriangleVertex5: function (point, gSize, id) {
        if (this._is_puzzle_flix[id - 1] == true) {
            point[0]._x = 0;
            point[0]._y = gSize.height*this._view._graph_scale;
            point[1]._x = 0;
            point[1]._y = 0;
            point[2]._x = gSize.width*this._view._graph_scale;
            point[2]._y = gSize.height*this._view._graph_scale;
        } else {
            point[0]._x = 0;
            point[0]._y = gSize.height*this._view._graph_scale;
            point[1]._x = gSize.width*this._view._graph_scale;
            point[1]._y = 0;
            point[2]._x = gSize.width*this._view._graph_scale;
            point[2]._y = gSize.height*this._view._graph_scale;
        }
    },

    getQuadrangleVertex1: function (point, gSize, id) {
        if (this._is_puzzle_flix[id - 1] == true) {
            point[0]._x = 0;
            point[0]._y = gSize.height*this._view._graph_scale;
            point[1]._x = 0;
            point[1]._y = gSize.height*this._view._graph_scale / 2;
            point[2]._x = gSize.width*this._view._graph_scale;
            point[2]._y = 0;
            point[3]._x = gSize.width*this._view._graph_scale;
            point[3]._y = gSize.height*this._view._graph_scale / 2;
        } else {
            point[0]._x = 0;
            point[0]._y = gSize.height*this._view._graph_scale / 2;
            point[1]._x = 0;
            point[1]._y = 0;
            point[2]._x = gSize.width*this._view._graph_scale;
            point[2]._y = gSize.height*this._view._graph_scale / 2;
            point[3]._x = gSize.width*this._view._graph_scale;
            point[3]._y = gSize.height*this._view._graph_scale;
        }
        
    },

    getQuadrangleVertex2: function (point, gSize, id) {
        point[0]._x = 0;
        point[0]._y = gSize.height*this._view._graph_scale;
        point[1]._x = 0;
        point[1]._y = 0;
        point[2]._x = gSize.width*this._view._graph_scale;
        point[2]._y = 0;
        point[3]._x = gSize.width*this._view._graph_scale;
        point[3]._y = gSize.height*this._view._graph_scale;
    },

    getTriangleRect: function (index, clickPos) {
        var isClick = false;
        var side_equation = new Array();
        
        for (var i = 0; i < this._seven_graph_element[index].length; i++) {
            if (this._is_puzzle_flix[index] == true) {
                side_equation[i] = this.getEquation(clickPos, this._seven_graph_element[index][i][0], this._seven_graph_element[index][i][1]);
            } else {
                side_equation[i] = this.getEquation(clickPos, this._seven_graph_element_flip[index][i][0], this._seven_graph_element_flip[index][i][1]);
            }
            
        };
        var graph_id = index + 1;
        switch (graph_id) {
            case 1:
            case 4:
                if (this._is_puzzle_flix[index] == true) {
                    if (side_equation[0] >= 0 && side_equation[1] <= 0 && side_equation[2] <= 0) {
                        isClick = true;
                    } 
                } else {
                    if (side_equation[0] >= 0 && side_equation[1] >= 0 && side_equation[2] <= 0) {
                        isClick = true;
                    }
                }
                
                break;
            case 6:
            case 7:
                if (side_equation[0] >= 0 && side_equation[1] >= 0 && side_equation[2] <= 0 && side_equation[3] <= 0) {
                    isClick = true;
                }
                break;
            default:
                if (this._is_puzzle_flix[index] == true) {
                    if (side_equation[0] >= 0 && side_equation[1] >= 0 && side_equation[2] <= 0) {
                        isClick = true;
                    } 
                } else {
                    if (side_equation[0] >= 0 && side_equation[1] <= 0 && side_equation[2] <= 0) {
                        isClick = true;
                    } 
                }
                break;
        }

        return isClick;
    },

    getEquation: function (clickPos, point1, point2) {
        var k = 0;
        var b = 0;
        var equation = 0;

        if (point2._x != point1._x) {
            k = (point2._y - point1._y) / (point2._x - point1._x);
            b = point2._y - k * point2._x;
            equation = -k * clickPos.x + clickPos.y - b;
        } else {
            equation = clickPos.x - point1._x;
        }
        return equation;
    },

    onTouchBegan:function (touch, event) {
        var target = event.getCurrentTarget();
        if (target._isClickWin == true) {
            var pos = target.convertToNodeSpace(touch.getLocation());
            var is_click_circle = false;
            if (target._view._isCircle_exist == true) {

                var click_nodeSpace_circle = target._view._circle_rotate.convertToNodeSpace(pos);
                click_nodeSpace_circle.x = click_nodeSpace_circle.x - target._view._circle_rotate.width/2;
                click_nodeSpace_circle.y = click_nodeSpace_circle.y - target._view._circle_rotate.height/2;
                var isIn = target.getCircleRect(click_nodeSpace_circle);
                if (isIn <= 0) {
                    target.judgeRotateOrMove(click_nodeSpace_circle);
                    target._touch_graph_index = target._clickCircleIndex;
                    is_click_circle = true;
                } 
            }
            if (is_click_circle == false) {
                var click_puzzle = new Array();
                for (var i = 0; i < graph_number; i++) {
                    var size = target._seven_puzzle[i].graph_puzzle.getContentSize();
                    var size_width = size.width * target._view._graph_scale;
                    var size_height = size.height * target._view._graph_scale;
                    var puzzle_x = target._seven_puzzle[i].x;
                    var puzzle_y = target._seven_puzzle[i].y;
                    var targetRect = cc.rect(puzzle_x,puzzle_y, size_width, size_height);
                    var click_nodeSpace = target._seven_puzzle[i].graph_puzzle.convertToNodeSpace(pos);
                    if (cc.rectContainsPoint(targetRect,pos)) {
                        if (target._isGuide && target._isAppoint == 2 && i != 0) {
                            target._touch_graph_index = -3;
                            return true;
                        }
                        var isClick = target.getTriangleRect(i, click_nodeSpace); 
                        if (isClick == true) {
                            click_puzzle.push(i);
                        }    
                    }
                };

                if (click_puzzle.length > 1) {
                    var max_zorder = target._seven_puzzle[click_puzzle[0]].getLocalZOrder();
                    target._touch_graph_index = click_puzzle[0];
                    for (var i = 0; i < click_puzzle.length; i++) {
                        var puzzle_zorder = target._seven_puzzle[click_puzzle[i]].getLocalZOrder();
                        if (max_zorder < puzzle_zorder) {
                            max_zorder = puzzle_zorder;
                            target._touch_graph_index = click_puzzle[i];
                        }
                    };
                    target.setPuzzleZOrder();
                } else if (click_puzzle.length == 1) {
                    target._touch_graph_index = click_puzzle[0];
                    target.setPuzzleZOrder();
                } else {
                    target._touch_graph_index = -1;
                }
            }

            target._touch_x = pos.x;
            target._touch_y = pos.y;
            
            if (target._touch_graph_index != -1) {
                target.getDoubleClick();
            }
        }
         
        return true;  
    },

    onTouchMoved:function (touch, event) {
        var target = event.getCurrentTarget();
        if (target._isClickWin == true) {
            if (target._isGuide && target._isAppoint == 2 && target._touch_graph_index == -3) {
                return;
            }
            var pos = target.convertToNodeSpace(touch.getLocation());
            if (target._touch_graph_index != -1) {
                if (target._is_double_click == false) {
                    var move_x = pos.x - target._touch_x;
                    var move_y = pos.y - target._touch_y;
                    
                    if (target._isMove == true) {
                        target._seven_puzzle[target._touch_graph_index].x = target._seven_puzzle[target._touch_graph_index].x + move_x;
                        target._seven_puzzle[target._touch_graph_index].y = target._seven_puzzle[target._touch_graph_index].y + move_y;

                    } else {
                        //rotate 
                        var circleNodePos = cc.p(target._view._circle_rotate.x, target._view._circle_rotate.y);
                        var circleWorldPos = target._seven_puzzle[target._touch_graph_index].convertToWorldSpace(circleNodePos);
                        
                        var pos_puzzle_x = pos.x - circleWorldPos.x;
                        var pos_puzzle_y = pos.y - circleWorldPos.y;
                        var side_a = Math.sqrt(Math.pow(pos_puzzle_x, 2) + Math.pow(pos_puzzle_y, 2));
                        var touch_puzzle_x = target._touch_x - circleWorldPos.x;
                        var touch_puzzle_y = target._touch_y - circleWorldPos.y;
                        var side_b = Math.sqrt(Math.pow(touch_puzzle_x, 2) + Math.pow(touch_puzzle_y, 2));
                        var side_c = Math.sqrt(Math.pow(move_x, 2) + Math.pow(move_y, 2));
                        var cos_judge = (Math.pow(side_a, 2) + Math.pow(side_b, 2) - Math.pow(side_c, 2)) / (2 * side_a * side_b);
                        var angle = Math.acos(cos_judge) * 180 / Math.PI;

                        var isClockwise = target.getRotateAngle(touch_puzzle_x, touch_puzzle_y, pos_puzzle_x, pos_puzzle_y);
                        if (isClockwise < 0) {
                            angle = -angle;
                        }
                        var graph_judge = target._seven_puzzle[target._touch_graph_index].graph_puzzle.getRotation();
                        target._seven_puzzle[target._touch_graph_index].graph_puzzle.setRotation(angle + graph_judge); 
                    }

                    target._touch_x = pos.x;
                    target._touch_y = pos.y;
                    
                }
            }
        }
        
    },

    onTouchEnded:function (touch, event) {
        var target = event.getCurrentTarget();

        if (target._isClickWin == true) {
            if (target._isGuide && target._isAppoint == 2 && target._touch_graph_index == -3) {
                return;
            }
            if (target._is_double_click == true) {
                target._is_double_click = false;
            }

            if (target._isMove == false) {
                target._isMove = true;
            }
            
            if (target._touch_graph_index != -1) {
                var graph_nodePos = cc.p(target._seven_puzzle[target._touch_graph_index].graph_puzzle.x,target._seven_puzzle[target._touch_graph_index].graph_puzzle.y);
                var graph_pos = target._seven_puzzle[target._touch_graph_index].convertToWorldSpace(graph_nodePos);
                if (graph_pos.y < target._back_height) {
                    if (target._seven_puzzle[target._touch_graph_index]._isMoveCenter == true) {
                        target._seven_puzzle[target._touch_graph_index].removeShadowGraph();
                    }
                    if (target._view._isCircle_exist == true) {
                        target._view._circle_rotate.removeFromParent(true);
                        target._view._isCircle_exist = false;
                        target._is_graph_y = false;
                    }
                    target.moveBack();
                    if (target._is_puzzle_flix[target._touch_graph_index] == false) {
                        target.flipGraph();
                    }
                    if (target._touch_graph_index == 6) {
                        target._seven_puzzle[target._touch_graph_index].graph_puzzle.setRotation(45);
                    } else {
                        target._seven_puzzle[target._touch_graph_index].graph_puzzle.setRotation(0);
                    }
                    
                    target.setBackZOrder();
                    
                } else {
                    target.adjustAngle();

                    var delayTime = target.moveFromTargetPos(target._touch_graph_index);
                    var touchTargetIndex = target._touch_graph_index;
                    target.createShadow = function () {
                        if (target._isClickWin == true && target._seven_puzzle[touchTargetIndex]._isMoveCenter == false && target._seven_puzzle[touchTargetIndex].equalPos == false) {
                            var node = target._seven_puzzle[touchTargetIndex].graph_puzzle;
                            var spriteRes = seven_graph[touchTargetIndex + 1].res[3];
                            target._seven_puzzle[touchTargetIndex].initShadowGraph(node, spriteRes);

                            if (target._is_puzzle_flix[touchTargetIndex] == false) {
                                var flipX_shadow = cc.FlipX.create(true);
                                target._seven_puzzle[touchTargetIndex]._shadowGraph.runAction(flipX_shadow);
                            }
                        }
                    }
                    target.scheduleOnce(target.createShadow, delayTime);
                    
                    if (target._is_graph_y == false) {
                        if (target._view._isCircle_exist == true) {
                            target._view._circle_rotate.removeFromParent(true);
                        }
                        target._view.addCircleRotate(target._seven_puzzle[target._touch_graph_index]);
                        target._clickCircleIndex = target._touch_graph_index;  
                    }else{
                        target._is_graph_y = false;
                    }
                    
                }
            } else {
                if (target._view._isCircle_exist == true) {
                    target._view._circle_rotate.removeFromParent(true);
                    target._view._isCircle_exist = false;
                }
                target._double_click = -1;
            } 
        }
    },

    setPuzzleZOrder: function () {
        var max_zorder = this._seven_puzzle[0].getLocalZOrder();
        for (var i = 1; i < graph_number; i++) {
            var puzzle_zorder = this._seven_puzzle[i].getLocalZOrder();
            if (max_zorder < puzzle_zorder) {
                max_zorder = puzzle_zorder;
            }
        };
        var click_zorder = this._seven_puzzle[this._touch_graph_index].getLocalZOrder(); 
        for (var i = 0; i < graph_number; i++) {
            var puzzle_zorder = this._seven_puzzle[i].getLocalZOrder();
            if (puzzle_zorder > click_zorder) {
                this._seven_puzzle[i].setLocalZOrder(puzzle_zorder - 1);
            }
        };
        this._seven_puzzle[this._touch_graph_index].setLocalZOrder(max_zorder);
        
    },

    getDoubleClick: function () {
        var graph_nodePos = cc.p(this._seven_puzzle[this._touch_graph_index].graph_puzzle.x,this._seven_puzzle[this._touch_graph_index].graph_puzzle.y);
        var graph_pos = this._seven_puzzle[this._touch_graph_index].convertToWorldSpace(graph_nodePos);
        if (graph_pos.y >= this._back_height) {
            if (this._touch_time > 0.5 && this._double_click == this._touch_graph_index) {

                this.flipGraph();
                this.unschedule(this.secTime);
                this._touch_time = 1;
                this._is_double_click = true;
                this._double_click = -1;
                this._is_graph_y = true;
                return true;
            } else {
                this.unschedule(this.secTime);
                this._touch_time = 1;
            }
            if (this._double_click != this._touch_graph_index) {

                if (this._view._isCircle_exist == true) {
                    this._view._circle_rotate.removeFromParent(true);
                }
                this._view.addCircleRotate(this._seven_puzzle[this._touch_graph_index]);
                this._clickCircleIndex = this._touch_graph_index;
            }
            this._is_graph_y = true;
        } 
        
        this.secTime = function (dt) {
            this._touch_time = this._touch_time - dt;
            if (this._touch_time <= 0) {
                this.unschedule(this.secTime);
            }
        }
        this.schedule(this.secTime, 1/60);
        
        this._double_click = this._touch_graph_index;
    },

    moveBack: function () {

        this._seven_puzzle[this._touch_graph_index].stopAllActions();
        var size = cc.winSize;
        var scale = size.width / 750;
        var gp_size = this._seven_puzzle[this._touch_graph_index].graph_puzzle.getContentSize();
        var gap_scale_x = gp_size.width * (scale - this._view._graph_scale);
        var gap_scale_y = gp_size.height * (scale - this._view._graph_scale);
        var back_x = size.width * seven_graph[this._touch_graph_index + 1].pos._x / 100 + gap_scale_x / 2;
        var back_y = size.height * seven_graph[this._touch_graph_index + 1].pos._y / 100 - gap_scale_y / 2;

        if (this.isLow == true) {
            back_y = back_y + this.disZero;
        }

        var back_puzzle = cc.MoveTo.create(0.5, cc.p(back_x, back_y));
        this._seven_puzzle[this._touch_graph_index].runAction(back_puzzle);
    },

    setBackZOrder: function () {
        this._seven_puzzle[this._touch_graph_index].setLocalZOrder(1);
        for (var i = 0; i < graph_number; i++) {
            var puzzle_zorder = this._seven_puzzle[i].getLocalZOrder();
            if (puzzle_zorder > 1) {
                this._seven_puzzle[i].setLocalZOrder(puzzle_zorder - 1);
            }
        };
    },

    flipGraph: function () {
        if (this._is_puzzle_flix[this._touch_graph_index] == true) {
            var flipX = cc.FlipX.create(true);
            this._seven_puzzle[this._touch_graph_index].graph_puzzle.runAction(flipX);
            if (this._seven_puzzle[this._touch_graph_index]._isMoveCenter == true) {
                var flipX_shadow = cc.FlipX.create(true);
                this._seven_puzzle[this._touch_graph_index]._shadowGraph.runAction(flipX_shadow);
            }
            
            this._is_puzzle_flix[this._touch_graph_index] = false;
        } else {
            var flipX = cc.FlipX.create(false);
            this._seven_puzzle[this._touch_graph_index].graph_puzzle.runAction(flipX);
            if (this._seven_puzzle[this._touch_graph_index]._isMoveCenter == true) {
                var flipX_shadow = cc.FlipX.create(false);
                this._seven_puzzle[this._touch_graph_index]._shadowGraph.runAction(flipX_shadow);
            }
            this._is_puzzle_flix[this._touch_graph_index] = true;
        }
        var graph_judge = this._seven_puzzle[this._touch_graph_index].graph_puzzle.getRotation();
        this._seven_puzzle[this._touch_graph_index].graph_puzzle.setRotation(-graph_judge);
        this.flixChangePos(this._is_puzzle_flix[this._touch_graph_index], this._touch_graph_index);
        
    },


    flixChangePos: function (isFlipX, clickIndex) {
        var pos_index = pos_index_array[clickIndex];
        switch (clickIndex) {
            
            case 0:
                //var pos_index = 0;
                if (isFlipX == false) {
                    this._seven_puzzle[this._touch_graph_index].getSmallTriganlePos2(pos_index);
                    
                }else {
                    this._seven_puzzle[this._touch_graph_index].getSmallTriganlePos1(pos_index);
                }
                
                break;
            case 1:
                //var pos_index = 8;
                if (isFlipX == false) {
                    this._seven_puzzle[this._touch_graph_index].getSmallTriganlePos1(pos_index);
                    
                }else {
                    this._seven_puzzle[this._touch_graph_index].getSmallTriganlePos2(pos_index);
                }
                break;
            case 2:
                //var pos_index = 16;
                if (isFlipX == false) {
                    this._seven_puzzle[this._touch_graph_index].getSmallTriganlePosFlipX3(pos_index);
                    
                }else {
                    this._seven_puzzle[this._touch_graph_index].getSmallTriganlePos3(pos_index);
                }
                break;
            case 3:
                //var pos_index = 20;
                if (isFlipX == false) {
                    this._seven_puzzle[this._touch_graph_index].getSmallTriganlePos5(pos_index);
                    
                }else {
                    this._seven_puzzle[this._touch_graph_index].getSmallTriganlePos4(pos_index);
                }
                break;
            case 4:
                //var pos_index = 22;
                if (isFlipX == false) {
                    this._seven_puzzle[this._touch_graph_index].getSmallTriganlePos4(pos_index);
                    
                }else {
                    this._seven_puzzle[this._touch_graph_index].getSmallTriganlePos5(pos_index);
                }
                break;
            case 5:
                //var pos_index = 24;
                if (isFlipX == false) {
                    this._seven_puzzle[this._touch_graph_index].getSmallTriganlePosFlipX6(pos_index);
                    
                }else {
                    this._seven_puzzle[this._touch_graph_index].getSmallTriganlePos6(pos_index);
                }
                break;
            case 6:
                break;

        }
    },

    getCircleRect: function (clickPos) {
        var circle_size = this._view._circle_rotate.getContentSize();
        var side_max = 0;

        if (circle_size.width < circle_size.height){
            side_max = circle_size.height * this._view._graph_scale;
        } else {
            side_max = circle_size.width * this._view._graph_scale;
        }
        var isClickIn = clickPos.x * clickPos.x +  clickPos.y * clickPos.y - side_max * side_max / 4;
        return isClickIn;
    },

    judgeRotateOrMove: function (clickPos) {
        var move_width = 190;
        var move_height = 180; 
        var rectangle_width = move_width * this._view._graph_scale;
        var rectangle_height = move_height * this._view._graph_scale;
        if (clickPos.x <= rectangle_width / 2 && clickPos.x >= -rectangle_width / 2 && clickPos.y <= rectangle_height / 2 && clickPos.y >= -rectangle_height / 2) {
            this._isMove = true;
        } else {
            this._isMove = false;

        }   
    },

    getRotateAngle: function (touch_x, touch_y, pos_x, pos_y) {

        if (pos_y == touch_y && this.isClockwise == 0) {
            if (pos_x - touch_x > 0) {
                this.isClockwise = -1;
            }else if (pos_x - touch_x < 0) {
                this.isClockwise = 1; 
            }
        } else {
            if (touch_x >= 0 && pos_x >= 0) {
                if (pos_y - touch_y > 0) {
                    this.isClockwise = -1;
                } else if (pos_y - touch_y < 0) {
                    this.isClockwise = 1; 
                } 
            } else if (touch_x <= 0 && pos_x <= 0) {
                if (pos_y - touch_y > 0) {
                    this.isClockwise = 1;
                } else if (pos_y - touch_y < 0) {
                    this.isClockwise = -1;
                } 
            } else if (touch_x >= 0 && pos_x < 0) {
                
            } else if (touch_x <= 0 && pos_x > 0) {
                
            }
        }
       return this.isClockwise;
    },

    adjustAngle: function () {
        var graph_judge = this._seven_puzzle[this._touch_graph_index].graph_puzzle.getRotation();
        graph_judge = graph_judge % 360;
        var mod_judge = graph_judge % 45;
        if (Math.abs(mod_judge) >= 22.5) {
            if (graph_judge < 0) {
                graph_judge = graph_judge - (45 + mod_judge);
            }else {
                graph_judge = graph_judge + (45 - mod_judge);
            }
            
        }else {
            graph_judge = graph_judge - mod_judge;
        }
        this._seven_puzzle[this._touch_graph_index].graph_puzzle.setRotation(graph_judge);
        
    },
    
    judgeWin: function () {
        var currentPosArray = {};
        currentPosArray = this.updatePos();

        var target_pos_;

        var count_equal = 0;
        for (var i = 0; i < arrayLength; i++) {
            target_pos_ = dict_sp_element[this._elementIndex][this._floor_index].target_pos[i];
            for (var j = 0; j < arrayLength; j++) {

                if (Math.abs(target_pos_._x - currentPosArray[j]._x) <= 5 && Math.abs(target_pos_._y - currentPosArray[j]._y) <= 5) {
                    count_equal = count_equal + 1;
                    break;
                }
            };
        };

        cc.log("count_equal", count_equal);
        if (this._isGuide && this._isAppoint == 2 && count_equal >= 16) {
            this.reviewOver(true);
            this.goalTip();
        }
        // var string = '';
        // for (i = 0; i < arrayLength; i++) {
        //     string = string + i.toString() + ':{' + '_x:' + currentPosArray[i]._x.toString() + ', _y:' + currentPosArray[i]._y.toString() + '},' + '\n';
        // }
        // cc.log(string);

        if (count_equal == arrayLength) {
            cc.log("youarewin");
            this._isClickWin = false;
            // this._view._purseBtn.setTouchEnable(false);
            this.unschedule(this.getTime);
            this._view._progressBar.stopAllActions();
            if (this._view._isCircle_exist == true) {
                this._view._circle_rotate.removeFromParent(true);
                this._view._isCircle_exist = false;
            }
            for (var i = 0; i < graph_number; i++) {
                if (this._seven_puzzle[i]._isMoveCenter == true) {
                    this._seven_puzzle[i].removeShadowGraph();
                }
            };
            for (var i = 0; i < graph_number; i++) {
                this.winAction(i, this._seven_puzzle[i].graph_puzzle);
            };
            var delayTime = 5.0;
            this.gameOver = function () {
                if (this._isGuide) {
                    this.goalTip();
                    return;
                }
                // this._view._purseBtn.setTouchEnable(true);
                if (this._args.isLearnTest == true) {                
                    var delegate = this._args.delegateLearnTest;
                    if (this._args.isFirstTest == true) {
                        if (this._firstTestLevel == this._args.roundLength-1) {
                            delegate.recordLearnTestRes(delegate,true,this._args.energy_level);
                        }else {
                            this.removeGraph();

                            this._firstTestLevel += 1;
                            this.runOneGame(this._playLevel, this._firstTestLevel);
                            return;
                        }
                    }else {
                        delegate.recordLearnTestRes(delegate,true,this.unit.energy_level);
                    }
                    this.removeGraph();
                    if(delegate.IsLastLearnTest(delegate) == true){
                        delegate.showViewSettleTest(delegate);
                    } else {
                        delegate.HandleStartTest(delegate, false);
                    }                    
                }else {
                    this.showSettleView();
                }
            }
            this.scheduleOnce(this.gameOver, delayTime);
        }
    },

    winAction: function (index, node) { 
        var delayTime = 0.5 * (index+1); 
        var delay = cc.DelayTime.create(delayTime);
        var callF = cc.CallFunc.create(function () {
            var texture = cc.textureCache.addImage(seven_graph[index+1].res[2]);
            node.setTexture(seven_graph[index+1].res[2]);
        }, this);
        var seq = cc.Sequence.create(delay, callF);
        node.runAction(seq);
    },

    updatePos: function () {
        
        var currentPosArray = {};
        for (var i = 0; i < arrayLength; i++) {
            var relatePos = cc.p(this._small_triangle_array[i]._x, this._small_triangle_array[i]._y);
            var wordSpacePos = cc.p(0, 0); 

            if (i < 16) {
                relatePos.x = relatePos.x * this._seven_puzzle[0].graph_puzzle.width ;
                relatePos.y = relatePos.y * this._seven_puzzle[0].graph_puzzle.height ;
                wordSpacePos = this._seven_puzzle[0].graph_puzzle.convertToWorldSpace(relatePos);
                
                wordSpacePos = this._view.convertToBgNodeSpace(wordSpacePos);
            }else if (i < 32) {
                relatePos.x = relatePos.x * this._seven_puzzle[1].graph_puzzle.width;
                relatePos.y = relatePos.y * this._seven_puzzle[1].graph_puzzle.height;
                wordSpacePos = this._seven_puzzle[1].graph_puzzle.convertToWorldSpace(relatePos);

                wordSpacePos = this._view.convertToBgNodeSpace(wordSpacePos);
            }else if (i < 40) {
                relatePos.x = relatePos.x * this._seven_puzzle[2].graph_puzzle.width;
                relatePos.y = relatePos.y * this._seven_puzzle[2].graph_puzzle.height;
                wordSpacePos = this._seven_puzzle[2].graph_puzzle.convertToWorldSpace(relatePos);

                wordSpacePos = this._view.convertToBgNodeSpace(wordSpacePos);
            }else if (i < 44) {
                relatePos.x = relatePos.x * this._seven_puzzle[3].graph_puzzle.width;
                relatePos.y = relatePos.y * this._seven_puzzle[3].graph_puzzle.height;
                wordSpacePos = this._seven_puzzle[3].graph_puzzle.convertToWorldSpace(relatePos);

                wordSpacePos = this._view.convertToBgNodeSpace(wordSpacePos);
            }else if (i < 48) {
                relatePos.x = relatePos.x * this._seven_puzzle[4].graph_puzzle.width;
                relatePos.y = relatePos.y * this._seven_puzzle[4].graph_puzzle.height;
                wordSpacePos = this._seven_puzzle[4].graph_puzzle.convertToWorldSpace(relatePos);

                wordSpacePos = this._view.convertToBgNodeSpace(wordSpacePos);
            }else if (i < 56) {
                relatePos.x = relatePos.x * this._seven_puzzle[5].graph_puzzle.width;
                relatePos.y = relatePos.y * this._seven_puzzle[5].graph_puzzle.height;
                wordSpacePos = this._seven_puzzle[5].graph_puzzle.convertToWorldSpace(relatePos);

               wordSpacePos = this._view.convertToBgNodeSpace(wordSpacePos);
            }else if (i < 64) {
                relatePos.x = relatePos.x * this._seven_puzzle[6].graph_puzzle.width;
                relatePos.y = relatePos.y * this._seven_puzzle[6].graph_puzzle.height;
                wordSpacePos = this._seven_puzzle[6].graph_puzzle.convertToWorldSpace(relatePos);

                wordSpacePos = this._view.convertToBgNodeSpace(wordSpacePos);
            }
            currentPosArray[i] = {};
            currentPosArray[i]._x = Math.round(wordSpacePos.x*10000000000)/10000000000;
            currentPosArray[i]._y = Math.round(wordSpacePos.y*10000000000)/10000000000;
        };

        return currentPosArray;
    },

    moveFromTargetPos: function (clickGraphIndex) {

        var currentGraphPos = new Array();
        var currentPosArray = new Array();
        currentPosArray = this.updatePos();
        
        for (var i = 0; i < small_triangle_array[clickGraphIndex]; i++) {
            var pos_index = pos_index_array[clickGraphIndex] + i;
            currentGraphPos[i] = currentPosArray[pos_index];
        };

        var distance_targetPos_array = new Array();
        for (var i = 0; i < small_triangle_array[clickGraphIndex]; i++) {
            for (var j = 0; j < arrayLength; j++) {
                var distance = Math.sqrt(Math.pow((currentGraphPos[i]._x - dict_sp_element[this._elementIndex][this._floor_index].target_pos[j]._x), 2) + Math.pow((currentGraphPos[i]._y - dict_sp_element[this._elementIndex][this._floor_index].target_pos[j]._y), 2));
                
                if (distance <= 30) {

                    var dis_index = distance_targetPos_array.length;
                    
                    distance_targetPos_array[dis_index] = new Array();
                    distance_targetPos_array[dis_index].dis_target = distance;
                    distance_targetPos_array[dis_index]._x = parseFloat(this.Subtr(dict_sp_element[this._elementIndex][this._floor_index].target_pos[j]._x, currentGraphPos[i]._x));
                    distance_targetPos_array[dis_index]._y = parseFloat(this.Subtr(dict_sp_element[this._elementIndex][this._floor_index].target_pos[j]._y, currentGraphPos[i]._y));
                    distance_targetPos_array[dis_index].currIndex = i;
                    distance_targetPos_array[dis_index].targetIndex = j;

                }
            };
        };
        
        var delay_time = 0;
        var dis_length = distance_targetPos_array.length;

        var getIndex = 0;
        if (dis_length > 0) {
            var min_dis = distance_targetPos_array[0].dis_target;
            for (var i = 1; i < dis_length; i++) {
                if (min_dis > distance_targetPos_array[i].dis_target) {
                    min_dis = distance_targetPos_array[i].dis_target;
                    getIndex = i;
                }
            };
    
            delay_time = 0.1;
            
            var moveGraph = cc.MoveBy.create(delay_time, cc.p(distance_targetPos_array[getIndex]._x, distance_targetPos_array[getIndex]._y));
            
            var callF = cc.CallFunc.create(function () {
                var errorArray = this.correctingErrors(clickGraphIndex, distance_targetPos_array[getIndex].currIndex, distance_targetPos_array[getIndex].targetIndex);
                this._seven_puzzle[clickGraphIndex].x = this._seven_puzzle[clickGraphIndex].x + errorArray.disX;
                this._seven_puzzle[clickGraphIndex].y = this._seven_puzzle[clickGraphIndex].y + errorArray.disY;                                                                                                                                         
                this.deleteShadow(clickGraphIndex);
            }, this);
            var seq = cc.Sequence.create(moveGraph, callF);
            this._seven_puzzle[clickGraphIndex].runAction(seq);
        }else {
            this._seven_puzzle[clickGraphIndex].equalPos = false;
        }
       
        this.delayJudgeWin = function () {
            if (this._isClickWin == true) {
                this.judgeWin();

            }
        }
        this.scheduleOnce(this.delayJudgeWin, delay_time+0.05);

        return delay_time;
    },

    correctingErrors: function (clickGraphIndex, currentIndex, targetIndex) {
        var currentGraphPos = new Array();
        var currentPosArray = new Array();
        currentPosArray = this.updatePos();
        
        for (var i = 0; i < small_triangle_array[clickGraphIndex]; i++) {
            var pos_index = pos_index_array[clickGraphIndex] + i;
            currentGraphPos[i] = currentPosArray[pos_index];
        };

        var error_x = dict_sp_element[this._elementIndex][this._floor_index].target_pos[targetIndex]._x - currentGraphPos[currentIndex]._x;
        var error_y = dict_sp_element[this._elementIndex][this._floor_index].target_pos[targetIndex]._y - currentGraphPos[currentIndex]._y;
        //cc.log(currentGraphPos[currentIndex]._x, currentGraphPos[currentIndex]._y);
        //cc.log(currentGraphPos[currentIndex]._x + error_x, currentGraphPos[currentIndex]._y + error_y);
        return {disX:error_x, disY:error_y};
    },

    Subtr: function (arg1,arg2) {
         var r1,r2,m,n;
         try{r1=arg1.toString().split(".")[1].length}catch(e){r1=0};
         try{r2=arg2.toString().split(".")[1].length}catch(e){r2=0};
         m=Math.pow(10,Math.max(r1,r2));
         n=(r1>=r2)?r1:r2;
         return ((arg1*m-arg2*m)/m).toFixed(n);
    },

    deleteShadow: function (clickGraphIndex) {
        var currentGraphPos = new Array();
        var currentPosArray = new Array();
        currentPosArray = this.updatePos();
        
        for (var i = 0; i < small_triangle_array[clickGraphIndex]; i++) {
            var pos_index = pos_index_array[clickGraphIndex] + i;
            currentGraphPos[i] = currentPosArray[pos_index];
        };
        var rightPosCount = 0;

        for (var i = 0; i < small_triangle_array[clickGraphIndex]; i++) {
            for (var j = 0; j < arrayLength; j++) {
                target_pos_ = dict_sp_element[this._elementIndex][this._floor_index].target_pos[j];
                if (Math.abs(currentGraphPos[i]._x - target_pos_._x) < 5 && Math.abs(currentGraphPos[i]._y - target_pos_._y) < 5) {
                    rightPosCount += 1;
                    break;
                }
            };
        };

        if (rightPosCount == small_triangle_array[clickGraphIndex]) {
            if (this._seven_puzzle[clickGraphIndex]._isMoveCenter == true) {
                this._seven_puzzle[clickGraphIndex].removeShadowGraph();
            }
            this._seven_puzzle[clickGraphIndex].equalPos = true;
        }else {
            this._seven_puzzle[clickGraphIndex].equalPos = false;
        }
    },

    removeGraph: function () {
        for (var i = 0; i < graph_number; i++) {
            if (this._seven_puzzle[i]._isMoveCenter == true) {
                this._seven_puzzle[i].removeShadowGraph();
            }
            this._seven_puzzle[i].removeFromParent(true);
        };
        for (var i = 0; i < graph_number; i++) {
            this._seven_puzzle.pop();
        };
    },

    getStarNum: function () {
        var getStarNum = 0;
        if (this._gameTime > this.unit.star_num.three_star) {
            getStarNum = 3;
        } else if (this._gameTime > this.unit.star_num.two_star) {
            getStarNum = 2;
        } else if (this._gameTime > 0) {
            getStarNum = 1;
        }

        return getStarNum;
    },

    showSettleView:function(){
        
        var args = {
            gameID:this._args.gameID,
            level:this._args.level,
            hasPassed:false,
            userId : this._args.userId,
            token : this._args.token,
            isGameTest : this._args.isTest,
            starsList : this._args.starsList,
        }; 
        var starNum = this.getStarNum();
        if(starNum > 0){
            args.hasPassed = true;
        }

        args.starNum = starNum;
        this.removeGraph();
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
            var str = '还剩下'+self._gameTime+'秒时间';
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
        var str = '还剩下'+this._gameTime+'秒时间';
        this._viewSettle.setResTipText(str);
        this.addChild(this._viewSettle);
    },
    
    handleNext:function(self){
        self._args.timestampStart = parseInt(new Date().getTime());
        self._args.level += 1;
        if(self._args.level > 30){
            self._args.level = 1;
        };
        
        self.loadLevelRes(self._args.level);
    },
    handleAgain:function(self){
        self.loadFloorRes(false);
    },

    handlePurseEvent:function(self){
        self._isPursed = true;
        self._isPause = false;
        self._isGamePause = true;
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
        self.addChild(self._viewGameSetting);
        if (self._isGuide) {
            self._viewGameSetting.setGuideHelp();
        }
        self._viewGameSetting.setHandle(self,self.handleContinue,self.handleRestart);
    },
    handleContinue:function(self){
        cc.log('---handleContinue');
        self._viewGameSetting.removeFromParent();

        cc.director.getActionManager().resumeTarget(self._view._progressBar);
        cc.director.getActionManager().resumeTarget(self);
        self._isGamePause = false;

        self._isPursed = false;
    },
    handleRestart:function(self){
        cc.log('---handleRestart');
        //cc.eventManager.removeAllListeners();

        self.removeGraph();
        self._viewGameSetting.removeFromParent(); 

        cc.director.getActionManager().resumeTarget(self._view._progressBar);
        cc.director.getActionManager().resumeTarget(self);
        self.unscheduleAllCallbacks();
        self.stopAllActions();
        //self.unscheduleAll();
        self._isGamePause = false;
        self._isPursed = false;
        self.loadFloorRes(false);
    },

    loadFloorRes: function (isPursed) {
        this._view._progressBar.setPercentage(100);

        if (this._isGuide) {
            this._isAppoint = 1;
            this.guide.removeFromParent(true);
            this.guide = null;
            this.sureGuide();
        }else {
            this.runOneGame(this._args.level, this._firstTestLevel);
        }  

        
        if (isPursed == true) {
            this._viewSettle._clickNext = false;
            this._viewSettle.removeFromParent(true);

        }
        
    },

    loadLevelRes: function (level) {
        var resArray = res.tangramLevel[level];
        for(var k in resArray){
            this._floorRes.push(resArray[k]);
        }

        var delLength = this._delFloorRes.length;
        if (delLength > 0) {
            this._delFloorRes.forEach(function(item){
                cc.loader.release(item);
            });
            this._delFloorRes.splice(0,delLength);
            this._floorRes.splice(0,3);
        }

        this.loadNextLevel = function () {
            this.loadFloorRes(true);
        }
        
        LoadResource.loadingResourses(this._floorRes, this, this.loadNextLevel);

        for (var i = 0; i < this._floorRes.length; i++) {
            this._delFloorRes[i] = this._floorRes[i];
        };
    },

    onExit: function () {

        this._is_puzzle_flix = null;
        this._seven_puzzle = null;
        this._seven_graph_element = null;
        this._seven_graph_element_flip = null;
        this._small_triangle_array = null;

        this._floorRes.forEach(function(item){
            cc.loader.release(item);  
        });
        // this.removeFromParent(true);
        cc.log("---   tangram   ---   onExit");
        this._super();
    },
});