
var ColorMachine = cc.Layer.extend({
    _view:null,
    _answer:null,
    _right_count:null,
    _isError:null,
    _isPursed:null,
    _playRoundTime:null,
    _roundIndex:null,
    ctor:function (args) {

        this._super();

        this._args = args;
        this._args.level = args.level;
        this._args.gameID = args.gameID;
        this._args.timestampStart = parseInt(new Date().getTime());
        this._args.delegate = args.delegate || false;

        this._args.isLearnTest = args.isLearnTest || false;
        this._args.isFirstTest = args.isFirstTest || false;
        this._args.delegateLearnTest = args.delegateLearnTest || false;

        this._view = new ColorMachineView(args.bg_color);
        this.addChild(this._view);
        this._view.setBtnHandle(this, this.leftBtnHandle, this.rightBtnHandle);

        this._isPause = false;
        var self = this;
        this._view._purseBtn.addClickEventListener(function(){
            if (self._isPause == false) {
                self._isPause = true;
                self.handlePurseEvent(self);
            }
        });
        
        this._roundIndex = 0;

        this._isGuide = args.isGuide || false;
        if (args.hasGuide == "true") {
            this._hasGuide = true;
        }else {
            this._hasGuide = false;
            this._args.timestampStart = parseInt(new Date().getTime());
        }
        if ((this._args.delegate == false && util.getArrycount(gameData.data[this._args.gameID].starsList) == 0 && gameData.testEditionGuide(this._args.level)) || (this._isGuide == true) || (this._hasGuide == true)) {
            this._guideArray = new Array();
            this._isAppoint = 1;
            this.sureGuide();
        }else {
            this.startGame(this._args.level, this._roundIndex);
        }

        // this.scheduleUpdate();
        return true;
    },

    

    //-------------------------------------------------------//
    //--------------------- 新手引导 -------------------------//
    //-------------------------------------------------------//

    sureGuide: function () {
        this._isGuide = true;
        this.guideLevel = 0;
        this._view.setGuideVisible(false);
        this.dTime = this.beginGuide();
        this.goalTip();
    },

    beginGuide: function () {
        this.setTipArray(GAME_GUIDE_TIP[this._args.gameID].guideTip[0], true, 4);
        this.guide = new PlayerGuide(this._guideArray);
        this.guide.x = this._view.width*0.5 - this.guide.width*0.5;
        this.guide.y = this._view._centerContainer.y + this._view._centerContainer.height*0.5 + 20;
        this._view.addChild(this.guide, 10);

        this.startGame(this.guideLevel, this._roundIndex); 

        this._view.isTouchListener = false;
        this._view._leftBtn.setTouchEnabled(false);
        this._view._rightBtn.setTouchEnabled(false);
        return 3.0;
    },

    setTipArray: function (tip, isRect, verticesType) {
        this._guideArray.tip = tip;
        this._guideArray.isRect = isRect;
        this._guideArray.verticesType = verticesType;
    },

    goalTip: function () {
        var scale = cc.winSize.width / 750;

        var delay = cc.DelayTime.create(this.dTime);
        var call = cc.CallFunc.create(function () {
            var ccp1 = cc.p(0, this._view._centerContainer.y - this._view._centerContainer.height*0.5);
            var ccp2 = cc.p(this.width, this._view._centerContainer.y + this._view._centerContainer.height*0.5);
            var rectCCP1 = [ccp1, ccp2];
            var scale2 = cc.winSize.width / 750;
            var ccp3 = cc.p(this._view._bottomBg.x - this._view._bottomBg.width*0.5*scale2,this._view._bottomBg.y);
            var ccp4 = cc.p(this._view._bottomBg.width*0.5*scale2, this._view._bottomBg.height*scale2);
            var rectCCP2 = [ccp3, ccp4];
            var rectCCP = new Array();
            rectCCP[0] = rectCCP1;
            rectCCP[1] = rectCCP2;
            this.guide.addClipping(this._view, rectCCP, 3);

            this.guide.removeTip();
            this.setTipArray(GAME_GUIDE_TIP[this._args.gameID].guideTip[1], true, 4);
            this.guide.init(this._guideArray);
            this.guide.x = this.width*0.5 - this.guide.width*0.5;

            //addOtherTip
            this.setTipArray(GAME_GUIDE_TIP[this._args.gameID].guideTip[5], true, 4);
            this.guide1 = new PlayerGuide(this._guideArray);
            this.guide1.x = this._view._bottomBg.width*0.25*scale2 - this.guide1.width*0.5;
            this.guide1.y = this._view._bottomBg.height*scale2 + 20;
            this._view.addChild(this.guide1, 10);
            
            this._view.setGuideHand();
            var wrongPos = cc.p(this._view._leftBtn.x, this._view._leftBtn.height*0.5*scale);
            this._view.addHandAction1(wrongPos);

            this._view._purseBtn.setTouchEnabled(false);
            this._view._rightBtn.setTouchEnabled(false);
            this._view._leftBtn.setTouchEnabled(true);
            
            
        },this);
        this.runAction(cc.Sequence.create(delay, call));
    },

    practiceClickTip: function () {
        this.guide.removeClipping();

        var ccp1 = cc.p(0, this._view._centerContainer.y - this._view._centerContainer.height*0.5);
        var ccp2 = cc.p(this.width, this._view._centerContainer.y + this._view._centerContainer.height*0.5);
        var rectCCP1 = [ccp1, ccp2];
        var scale2 = cc.winSize.width / 750;
        var ccp3 = cc.p(this._view._bottomBg.x - this._view._bottomBg.width*0.5*scale2,this._view._bottomBg.y);
        var ccp4 = cc.p(this._view._bottomBg.width*scale2, this._view._bottomBg.height*scale2);
        var rectCCP2 = [ccp3, ccp4];
        var rectCCP = new Array();
        rectCCP[0] = rectCCP1;
        rectCCP[1] = rectCCP2;
        this.guide.addClipping(this._view, rectCCP, 3);

        this.guide.removeTip();
        this.setTipArray(GAME_GUIDE_TIP[this._args.gameID].guideTip[2], true, 4);
        this.guide.init(this._guideArray);
        this.guide.x = this.width*0.5 - this.guide.width*0.5;

        this.guide1.x = this._view._bottomBg.width*0.5*scale2 - this.guide1.width*0.5;

        this._view._rightBtn.setTouchEnabled(true);
        this._view.isTouchListener = false;

    },

    slideTip: function (ranswer) {
        this.guide.removeClipping();

        var scale = cc.winSize.width / 750;
        var ccp1 = cc.p(0, this._view._bottomBg.height*scale);
        var ccp2 = cc.p(this.width, this._view._topBg.y - this._view._topBg.height*scale);
        var rectCCP = [ccp1, ccp2];
        this.guide.addClipping(this._view, rectCCP, 1);

        this.guide.removeTip();
        this.setTipArray(GAME_GUIDE_TIP[this._args.gameID].guideTip[3], true, 4);
        this.guide.init(this._guideArray);
        this.guide.x = this.width*0.5 - this.guide.width*0.5;

        this.guide1.removeTip();
        this.setTipArray(GAME_GUIDE_TIP[this._args.gameID].guideTip[6], true, 4);
        this.guide1.init(this._guideArray);
        this.guide1.x = this.width*0.5 - this.guide1.width*0.5;
        this.guide1.y = this._view._bottomBg.width*0.5*scale - this.guide1.width*0.5;

        this._view.setGuideHand();
        this._view.addMoveArrow(ranswer);

        this._view._leftBtn.setTouchEnabled(false);
        this._view._rightBtn.setTouchEnabled(false);
        this._view.isTouchListener = true;

    },

    practiceSlideTip: function () {
        this.guide.removeTip();
        this.setTipArray(GAME_GUIDE_TIP[this._args.gameID].guideTip[4], true, 4);
        this.guide.init(this._guideArray);
        this.guide.x = this.width*0.5 - this.guide.width*0.5;

        if (this.guide1) {
            this.guide1.removeTip();
            this.guide1.removeFromParent(true);
            this.guide1 = null;
        }
    },

    delHand: function () {
        if ((this._isAppoint >= 2 && this._isAppoint <= 4) && this._view.hand) {
            platformFun.removeAllActionsFromTarget(this._view.hand);
            // cc.director.getActionManager().removeAllActionsFromTarget(this._view.hand, true);
            this._view.hand.removeFromParent(true);
            this._view.hand = null;
            if(this._view.handArraw) {
                this._view.handArraw.removeFromParent(true);
                this._view.handArraw = null;
            }
            
        }
        
    },

    nextStepGuide: function (isRight) {
        if (this._isGuide) {
            switch(this._isAppoint) {
                case 1:
                    this._isAppoint = 2;
                    break;
                case 2:
                    if (this._answer == isRight) {
                        this._isAppoint = 3;
                    }
                    break;
                case 3:
                    if (this._answer == isRight) {
                        this._isAppoint = 4;
                    }
                    // this._isAppoint = 4;
                    break;
                case 4:
                    if (this._answer == isRight) {
                        this._isAppoint = 5;
                    }
                    break;
                case 5:
                    this._isAppoint = 6;
                    break;
            }
            this.delHand();
        }
    },

    guideSettle: function () {
        if (this.guide) {
            this.guide.removeClipping();
            this.guide.removeTip();
            this.guide.removeFromParent(true);
            this.guide = null;
        }
        
        this._view.settleAction();
        this._view.setAllLayerVisible(false);
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
        self._isAppoint = 1; 
        self._view.setAllLayerVisible(true); 
        self._view.isTouchListener = true;
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

    setNotRound: function (result) {
        if (result == 1) {
            return 2;
        }
    },

    //-------------------------------------------------------//


    startGame:function(level, roundIndex){
        if (this._isGuide || (this._args.isFirstTest == false && this._args.isLearnTest == false)) {
            this.unit = dict_cm_level[level];
        }else if (this._args.isFirstTest == true) {
            this.unit = first_test_cm_level[level];
            this._args.roundTime = this.unit.round_level[roundIndex].limit_time;
            this._args.roundPassCount = this.unit.round_level[roundIndex].pass_count;
            this._args.roundCount = this.unit.round_level.length;
            this._args.energyLevel = this.unit.round_level[roundIndex].energy_level;
        }else if (this._args.isLearnTest == true) {
            this.unit = test_cm_level[level]; 
        }

        this._right_count = 0;
        this._isError = false;
        this._isPursed = false;
        this._showStarNum = 0;

        this.colorArray = new Array();
        var colorCount;
        if (this._args.isFirstTest == true && this._isGuide == false) {
            colorCount = this.getColorCount(this.unit.round_level[roundIndex].play_type, roundIndex);
            this.setColorType(colorCount);
            this.getRountType(this.unit.round_level[roundIndex].play_type);
        }else {
            colorCount = this.getColorCount(this.unit.play_type);
            this.setColorType(colorCount);
            this.getRountType(this.unit.play_type);
        }
        
        if (roundIndex == 0 && (!this._isGuide)) {

            this._view._progressBar.setPercentage(100);
            var fromTo = cc.progressTo(this.unit.limit_time, 0);
            fromTo.tag = 1;
            this._view._progressBar.runAction(fromTo);

            this._playRoundTime = 0;
            this.gameOver();
        }
        

        this._view.setContainerPos();

        if (this._isGuide) {
            return;
        };

        if (this._args.isLearnTest == false) {
            this.experAndStar();
            for(var i=0;i<3;i++){          
               this._view.starName[i].setTexture(res.game_star_small_01);
            }
            this._view.setAllLayerVisible(true);
        } else {
            this._view.testHideExperAndStar();
        }
    },

    getColorCount:function (ptype, roundIndex) {
        var colorCount = 0;
        var isFirstTestGame = ((this._args.isFirstTest == true) && (this._isGuide == false));
        switch (ptype) {
            case 1:
                if (isFirstTestGame) {
                    colorCount = this.unit.round_level[roundIndex].fontcolor_count;
                }else {
                    colorCount = this.unit.fontcolor_count;
                }
                break;
            case 2:
                if (isFirstTestGame) {
                    colorCount = this.unit.round_level[roundIndex].fontcolor_count;
                }else {
                    colorCount = this.unit.fontcolor_count;
                }
                
                break;
            case 3:
                if (isFirstTestGame) {
                    colorCount = this.unit.round_level[roundIndex].colorwords_count;
                }else {
                    colorCount = this.unit.colorwords_count;
                }
                
                break;
            case 4:
                if (isFirstTestGame) {
                    colorCount = this.unit.round_level[roundIndex].colorwords_count;
                }else {
                    colorCount = this.unit.colorwords_count;
                }
                
                break;
            default:
                break; 
        }
        return colorCount;
    },

    getRountType:function (ptype) {
        switch (ptype) {
            case 1:
                this.initRoundType1();
                break;
            case 2:
                this.initRoundType2();
                break;
            case 3:
                this.initRoundType3();
                break;
            case 4:
                this.initRoundType4();
                break;
            default:
                break; 
        }
    },
    
    setColorType:function (typeCount) {
        var color_array = [1,2,3,4,5,6,7];
        for (var i = 0; i < typeCount; i++) {
            var bgColor = util.getRandom(1, color_array.length) - 1;
            this.colorArray.push(color_array[bgColor]);
            color_array.splice(bgColor, 1);
        };
    },

    initRoundType1:function() {
        this._view.isTouchListener = true;
        this._view._centerContainer.setRotation(0);
        
        var spFrame = null;
        var cString = null;
        var errorId = null;
        var colorIndex = util.getRandom(1, this.colorArray.length) - 1;
        var bgColor = this.colorArray[colorIndex];
        var ranswer = Math.floor( 2 * Math.random() + 1);

        if (this._isGuide) {
            switch (this._isAppoint) {
                case 1:
                    ranswer = this.setNotRound(ranswer);
                    // this._isAppoint = 2;
                    break;
                case 2:
                    this.practiceClickTip();
                    // this._isAppoint = 3;
                    break;
                case 3:
                    this.slideTip(ranswer);
                    // this._isAppoint = 4;
                    break;
                case 4:
                    this.practiceSlideTip();
                    // this._isAppoint = 5;
                    break;
                case 5:
                    this.guideSettle();
                    // this._isAppoint = 6;
                    break;
            }
        }
       
        if (ranswer == 1){
            this._answer = true;
            cString = CmConfig.cell[bgColor].string;
            this._view._centerText.color = cc.color(
                CmConfig.cell[bgColor].rgb[0], 
                CmConfig.cell[bgColor].rgb[1], 
                CmConfig.cell[bgColor].rgb[2]
            );
        }else{
            this._answer = false;
            errorId = this.gemErrorColor(bgColor);
            cString = CmConfig.cell[errorId].string;
            this._view._centerText.color = cc.color(
                CmConfig.cell[errorId].rgb[0], 
                CmConfig.cell[errorId].rgb[1], 
                CmConfig.cell[errorId].rgb[2]
            );
        };

        var spFramePath = CmConfig.cell[bgColor].type1;
        var frameSprite = new cc.Sprite(spFramePath);
        var spFrame = frameSprite.getSpriteFrame();

        this.hideCorrectIcon();
        this._view._meanText.setVisible(false);
        this._view._aboveText.setVisible(false);
        this._view._belowText.setVisible(false);
        this._view._centerText.setVisible(true);
        this._view._belowMeanText.setVisible(false);
        this._view._colorSprite.setSpriteFrame(spFrame);
        this._view._helpText.setString(CmConfig.tips[1].tips);
        this._view._centerText.setString(cString);

        this._view._isbtnEvent = true;
        this._view._isMoveLayer = true;
        this._view._is_ture = this._answer;
    },
    
    initRoundType2:function() {

        this._view._centerContainer.setRotation(0);
        
        var spFrame = null;
        var cString = null;
        var errorId = null;
        var colorIndex = util.getRandom(1, this.colorArray.length) - 1;
        var bgColor = this.colorArray[colorIndex];
        var ranswer = Math.floor( 2 * Math.random() + 1);

        if (ranswer == 1){
            this._answer = true;
            this._view._centerText.color = cc.color(
                CmConfig.cell[bgColor].rgb[0], 
                CmConfig.cell[bgColor].rgb[1], 
                CmConfig.cell[bgColor].rgb[2]
            );
        }else{
            this._answer = false;
            errorId = this.gemErrorColor(bgColor);
            this._view._centerText.color = cc.color(
                CmConfig.cell[errorId].rgb[0], 
                CmConfig.cell[errorId].rgb[1], 
                CmConfig.cell[errorId].rgb[2]
            );
        };

        cString = CmConfig.cell[bgColor].string;

        var spFramePath = res.colorMachine.cm_colourDisk_white;
        var frameSprite = new cc.Sprite(spFramePath);
        var spFrame = frameSprite.getSpriteFrame();

        this.hideCorrectIcon();
        this._view._meanText.setVisible(false);
        this._view._aboveText.setVisible(false);
        this._view._belowText.setVisible(false);
        this._view._centerText.setVisible(true);
        this._view._belowMeanText.setVisible(false);
        this._view._colorSprite.setSpriteFrame(spFrame);
        this._view._helpText.setString(CmConfig.tips[2].tips);
        this._view._centerText.setString(cString);  

        this._view.isTouchListener = true;
        this._view._isbtnEvent = true;
        this._view._isMoveLayer = true;
        this._view._is_ture = this._answer;
    },
    
    initRoundType3:function() {

        this._view._centerContainer.setRotation(0);
        
        var spFrame = null;
        var cString = null;
        var errorId = null;
        var colorIndex = util.getRandom(1, this.colorArray.length) - 1;
        var bgColor = this.colorArray[colorIndex];
        var ranswer = Math.floor( 2 * Math.random() + 1);

        if (ranswer == 1){
            this._answer = true;
            cString = CmConfig.cell[bgColor].string;
            this._view._aboveText.color = cc.color(
                CmConfig.cell[bgColor].rgb[0], 
                CmConfig.cell[bgColor].rgb[1], 
                CmConfig.cell[bgColor].rgb[2]
            );
        }else{
            this._answer = false;
            errorId = this.gemErrorColor(bgColor);
            cString = CmConfig.cell[errorId].string;
            this._view._aboveText.color = cc.color(
                CmConfig.cell[errorId].rgb[0], 
                CmConfig.cell[errorId].rgb[1], 
                CmConfig.cell[errorId].rgb[2]
            );
        };

        var spFramePath = CmConfig.cell[bgColor].type3;
        var frameSprite = new cc.Sprite(spFramePath);
        var spFrame = frameSprite.getSpriteFrame();

        this.hideCorrectIcon();
        this._view._meanText.setVisible(true);
        this._view._aboveText.setVisible(true);
        this._view._belowText.setVisible(false);
        this._view._centerText.setVisible(false);
        this._view._belowMeanText.setVisible(false);
        this._view._colorSprite.setSpriteFrame(spFrame);
        this._view._helpText.setString(CmConfig.tips[3].tips);
        this._view._aboveText.setString(cString);

        this._view.isTouchListener = true;
        this._view._isbtnEvent = true;
        this._view._isMoveLayer = true;
        this._view._is_ture = this._answer;
    },

    initRoundType4:function() {

        this._view._centerContainer.setRotation(0);
        
        var errorId = null;
        var aboveString = null;
        var belowString = null;

        var aboveIndex = util.getRandom(1, this.colorArray.length) - 1;
        var aboveCellId = this.colorArray[aboveIndex];
        
        var belowIndex = util.getRandom(1, this.colorArray.length) - 1;
        var belowCellId = this.colorArray[belowIndex];

        var ranswerFlag = Math.floor(2 * Math.random() + 1);
        
        var randomIndex = util.getRandom(1, this.colorArray.length) - 1;
        var randomCellId = this.colorArray[randomIndex];

        var randomErrorCellId = this.gemErrorColor(aboveCellId);

        aboveString = CmConfig.cell[aboveCellId].string;
        belowString = CmConfig.cell[belowCellId].string;

        this._view._aboveText.color = cc.color(
            CmConfig.cell[randomCellId].rgb[0], 
            CmConfig.cell[randomCellId].rgb[1], 
            CmConfig.cell[randomCellId].rgb[2]
        );

        if (ranswerFlag == 1){
            this._answer = true;
            this._view._belowText.color = cc.color(
                CmConfig.cell[aboveCellId].rgb[0], 
                CmConfig.cell[aboveCellId].rgb[1], 
                CmConfig.cell[aboveCellId].rgb[2]
            );
        }else{
            this._answer = false;
            this._view._belowText.color = cc.color(
                CmConfig.cell[randomErrorCellId].rgb[0], 
                CmConfig.cell[randomErrorCellId].rgb[1], 
                CmConfig.cell[randomErrorCellId].rgb[2]
            );
        };

        var spFramePath = res.colorMachine.cm_colourDisk_whit02;
        var frameSprite = new cc.Sprite(spFramePath);
        var spFrame = frameSprite.getSpriteFrame();

        this.hideCorrectIcon();
        this._view._meanText.setVisible(true);
        this._view._aboveText.setVisible(true);
        this._view._belowText.setVisible(true);
        this._view._centerText.setVisible(false);
        this._view._belowMeanText.setVisible(true);
        this._view._colorSprite.setSpriteFrame(spFrame);
        this._view._helpText.setString(CmConfig.tips[4].tips);
        this._view._aboveText.setString(aboveString);
        this._view._belowText.setString(belowString);
        
        this._view.isTouchListener = true;
        this._view._isbtnEvent = true;
        this._view._isMoveLayer = true;
        this._view._is_ture = this._answer;
    },

    hideCorrectIcon:function() {
        this._view._leftCorrectIcon.setVisible(false);
        this._view._rightCorrectIcon.setVisible(false);
    },

    gemErrorColor:function( colorValue ) {
        var index = 0
        var array = [];
        var colorCount = this.colorArray.length;
        for (var i = 0; i < colorCount; i++) {
            if (colorValue == this.colorArray[i]){
                continue;
            }
            array[index++] = this.colorArray[i];
        };
        var random = util.getRandom(1, colorCount-1) - 1;
        return array[random];
    },

    leftBtnHandle:function(self){

        var delayTime = 0; 
        if(self._answer == true){
            delayTime = 2;
            self._view.showErrorLayer();
            self._isError = true;
        }else{
            delayTime = 0.5;
            self._view._leftCorrectIcon.setVisible(true);
            self._right_count = self._right_count + 1;
        }
        if (self._isGuide) {
        }else if (self._args.isFirstTest == false && self._args.isLearnTest == true && self._right_count >= self.unit.pass_count) {
            var delegate = self._args.delegateLearnTest;
            delegate.recordLearnTestRes(delegate,true,self.unit.energy_level);
            self.testOver();
            return;
        }else if (self._args.isLearnTest == false) {
            if (self._answer == false) {
                self.experAndStar();
            }
        }

        var callFun = null;
        
        var random;//parseInt(3 * Math.random() + 1);
        if (self._isGuide == false && self._args.isFirstTest == true) {
            random = self.unit.round_level[self._roundIndex].play_type;
            if (self._playRoundTime <= self._args.roundTime && self._right_count >= self._args.roundPassCount) {
                random = 5;
            }
        }else {
            random = self.unit.play_type;
        }
        switch (random) {
            case 1:
                callFun = cc.callFunc(self.initRoundType1, self);
                break;
            case 2:
                callFun = cc.callFunc(self.initRoundType2, self);
                break;
            case 3:
                callFun = cc.callFunc(self.initRoundType3, self);
                break;
            case 4:
                callFun = cc.callFunc(self.initRoundType4, self);
                break;
            default:
                //callFun = cc.callFunc(self.initRoundType1, self);
                break;
        }

        self.nextStepGuide(false);
        
        if (random != 5) {
            var delay = cc.DelayTime.create(delayTime);
            var action = cc.Sequence.create(delay, callFun);
            action.tag = 1;
            self.runAction(action);
        }
        
    },

    rightBtnHandle:function(self){

        var delayTime = 0; 
        if(self._answer == true){
            delayTime = 0.5;
            self._view._rightCorrectIcon.setVisible(true);
            self._right_count = self._right_count + 1;
        }else{
            delayTime = 2;
            self._view.showErrorLayer();
            self._isError = true;
        }

        if (self._isGuide) {
        }else if (self._args.isFirstTest == false && self._args.isLearnTest == true && self._right_count >= self.unit.pass_count) {
            var delegate = self._args.delegateLearnTest;
            delegate.recordLearnTestRes(delegate,true,self.unit.energy_level);
            self.testOver();
            return;
        }else if (self._args.isLearnTest == false) {
            if (self._answer == true) {
                self.experAndStar();
            } 
        }

        var callFun = null;
        var random;//parseInt(3 * Math.random() + 1);
        if (self._isGuide == false && self._args.isFirstTest == true) {
            random = self.unit.round_level[self._roundIndex].play_type;
            if (self._playRoundTime <= self._args.roundTime && self._right_count >= self._args.roundPassCount) {
                random = 5;
            }
        }else {
            random = self.unit.play_type;
        }
        switch (random) {
            case 1:
                callFun = cc.callFunc(self.initRoundType1, self);
                break;
            case 2:
                callFun = cc.callFunc(self.initRoundType2, self);
                break;
            case 3:
                callFun = cc.callFunc(self.initRoundType3, self);
                break;
            case 4:
                callFun = cc.callFunc(self.initRoundType4, self);
                break;
            default:
                //callFun = cc.callFunc(self.initRoundType1, self);
                break;
        }

        self.nextStepGuide(true);

        if (random != 5) {
            var delay = cc.DelayTime.create(delayTime);
            var action = cc.Sequence.create(delay, callFun);
            action.tag = 2;
            self.runAction(action);
        }
    },

    gameOver:function () {
        var secTimer = 0;
        this.gameStop = function (dt) {
            if (this._isPursed == false){                 
                secTimer = secTimer + 1;
                
                if (secTimer >= this.unit.limit_time) {
                    cc.log("game over!");
                    this.unschedule(this.gameStop);
                    if (this._args.isLearnTest == true) {
                        var delegate = this._args.delegateLearnTest;
                        if (this._args.isFirstTest == true) {
                            delegate.recordLearnTestRes(delegate,true,this._args.energyLevel - 1);
                        }else {
                            delegate.recordLearnTestRes(delegate,false,this.unit.energy_level);
                        }
                        this.testOver();                      
                    }else {
                        this.settleAction();
                        //this.showSettleView();
                    }
                    
                    return;
                } else {
                    if (this._args.isFirstTest == true) {
                        if (this._playRoundTime <= this._args.roundTime && this._right_count >= this._args.roundPassCount) {
                            this._roundIndex += 1;
                            this._right_count = 0;
                            this._playRoundTime = 0;
                            if (this._roundIndex < this._args.roundCount) {
                                var delay = cc.delayTime(0.1);
                                var callFun = cc.callFunc(function () {
                                    this.startGame(this._args.level, this._roundIndex);
                                }, this);
                                var action = cc.sequence(delay, callFun);
                                action.tag = 3;
                                this.runAction(action);
                                
                            } else {
                                //this.unschedule(this.gameStop);
                                var delegate = this._args.delegateLearnTest;
                                delegate.recordLearnTestRes(delegate,true,this._args.energyLevel);
                                this.testOver();  
                            }
                            
                        } else if (this._playRoundTime > this._args.roundTime) {
                            this._right_count = 0;
                            this._playRoundTime = 0;
                        }
                    }
                }
                this._playRoundTime += 1;
            }
        }
        this.schedule(this.gameStop, 1);   
    },

    experAndStar:function () {
        var oneStar_value = this.unit.star_term.oneStar;
        var twoStar_value = this.unit.star_term.twoStar;
        var custom_value = this.unit.star_term.threeStar;

        if (this._right_count >= 0) {

            var now_percent;
            var percentTage = this._view._loadingBar.getPercent();
            if (this._right_count <= oneStar_value) {
                now_percent = percentTage + 1 / (oneStar_value*3/2) * 100;
                if (this._right_count == 0) {
                    now_percent = 0;
                }
            }else if (this._right_count <= twoStar_value) {
                var distanceStar = twoStar_value - oneStar_value;
                now_percent = percentTage + 1 / (distanceStar*6) * 100;

            }else if (this._right_count <= custom_value) {
                var distanceStar = custom_value - twoStar_value;
                now_percent = percentTage + 1 / (distanceStar*6) * 100;
            }else {
                now_percent = 100;
            }
            
            this._view._loadingBar.setPercent(now_percent);
           
            var size = cc.winSize;
            var scale = size.width / 750;
            var exper_width = this._view._exper_bg.getContentSize().width * scale;
            var zero_x = this._view._exper_bg.x - exper_width;

            this._view._zero.setString(this._right_count.toString());
            this._view._zero.setPositionX(zero_x + exper_width * now_percent/100);
        }

        switch (this._right_count) {
            case oneStar_value:
                   this._view.starName[0].setTexture(res.game_star_small_02);
                   this._showStarNum = 1;
                   break;
            case twoStar_value:
                   this._view.starName[1].setTexture(res.game_star_small_02);
                   this._showStarNum = 2;
                   break;
            case custom_value:
                   this._view.starName[2].setTexture(res.game_star_small_02);
                   this._showStarNum = 3;
                   cc.director.getActionManager().pauseTarget(this._view._progressBar);
                   this.unschedule(this.gameStop);
                   this.settleAction();
                   //this.showSettleView();
                   break;
            default:
                break;               
        }

    },

    settleAction: function () {
        this._view.settleAction();

        // var delay = cc.DelayTime.create(1);
        // var callSettle = cc.CallFunc.create(function() {
            this.showSettleView();
        // }, this);
        // this.runAction(cc.Sequence.create(delay, callSettle));
    },

    testOver: function () {

        cc.director.getActionManager().pauseTarget(this._view._progressBar);
        this.unschedule(this.gameStop);

        this._view.settleAction();
        var delay = cc.DelayTime.create(0.5);
        var callSettle = cc.CallFunc.create(function() {
            this._view.setAllLayerVisible(false);
            this._view.testDelView();
            var delegate = this._args.delegateLearnTest;
            if(delegate.IsLastLearnTest(delegate) == true){
                delegate.showViewSettleTest(delegate);
            } else {
                delegate.HandleStartTest(delegate, false);
            }   
        }, this);
        this.runAction(cc.Sequence.create(delay, callSettle));
    },

    showSettleView:function(){
        this._view.setAllLayerVisible(false);
        var args = {
            gameID:this._args.gameID,
            level:this._args.level,
            hasPassed:false,
            userId : this._args.userId,
            token : this._args.token,
            isGameTest : this._args.isTest,
            starsList : this._args.starsList,
        }; 
        if(this._showStarNum > 0){
            args.hasPassed = true;
        }

        args.starNum = this._showStarNum;

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

            self._viewSettle.showStar(self._showStarNum);
            var str = '答对'+self._right_count+'题';
            self._viewSettle.setResTipText(str);
            self.addChild(self._viewSettle);
        }
        var param = {
            gameID : this._args.gameID,
            level : this._args.level,
            starNum : this._showStarNum,
            userId : this._args.userId,
            token : this._args.token,
            timestampStart : this._args.timestampStart,

        }
        
        var starsArray = gameData.data[this._args.gameID].starsList;
        var curStarsLength = util.getArrycount(starsArray);
        // cc.log("----", starsArray);
        // for (var k in starsArray) {
        //     cc.log("--------stars key---",k,starsArray[k],typeof(starsArray[k]));
        // }
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
        this._args.delegate.recordStarNum(this._args.delegate,this._showStarNum);            
        args.delegate = this._args.delegate;
        this._viewSettle = new ViewSettle(args);
        if(this._args.delegate.IsLastTask(this._args.delegate) == true){
            this._viewSettle.showBtnSubmit();
        }
        this._viewSettle.setHandleAgain(this,this.handleAgain);
        this._viewSettle.setHandleNext(this._args.delegate,this._args.delegate.HandleNextGame);

        this._viewSettle.showStar(this._showStarNum);
        var str = '答对'+this._right_count+'题';
        this._viewSettle.setResTipText(str);
        this.addChild(this._viewSettle);
    },

    handleNext:function(self){
        self._args.timestampStart = parseInt(new Date().getTime());
        self._args.level += 1;
        if(self._args.level > 30){
            self._args.level = 1;
        };
        cc.director.getActionManager().resumeTarget(self._view._progressBar);
        self.startGame(self._args.level, self._roundIndex);
    },
    handleAgain:function(self){
        cc.director.getActionManager().resumeTarget(self._view._progressBar);
        self.startGame(self._args.level, self._roundIndex);
    },

    handlePurseEvent:function(self){
        self._isPursed = true;
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
        self._isPursed = false;
        cc.director.getActionManager().resumeTarget(self._view._progressBar);
        cc.director.getActionManager().resumeTarget(self);
    },
    handleRestart:function(self){
        cc.log('---handleRestart');
        self._viewGameSetting.removeFromParent(); 

        cc.director.getActionManager().resumeTarget(self._view._progressBar);
        cc.director.getActionManager().resumeTarget(self);
        var action = self._view._progressBar.getActionByTag(1);
        if(typeof(action) == 'object'){
            cc.director.getActionManager().removeAction(action);
        }
        action = self.getActionByTag(1);
        if(typeof(action) == 'object'){
            cc.director.getActionManager().removeAction(action);
        }
        action = self.getActionByTag(2);
        if(typeof(action) == 'object'){
            cc.director.getActionManager().removeAction(action);
        }
        if (self._isGuide == false && self._args.isFirstTest == true) {
            action = self.getActionByTag(3);
            if(typeof(action) == 'object'){
                cc.director.getActionManager().removeAction(action);
            }
        }
        
        self.unschedule(self.gameStop);
        self._isPursed = false;
        self._view.isTouchListener = true;
        self.stopAllActions();
        self._view._centerContainer.setRotation(0);

        if (self._isGuide) {
            self._isAppoint = 1;
            self.guide.removeFromParent(true);
            self.guide = null;
            self.sureGuide();
        }else {
            self.startGame(self._args.level, self._roundIndex);
        }  
    },

    onExit: function () {
        this._super();
    },
    
});


