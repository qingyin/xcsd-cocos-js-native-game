
var NumberCrash = cc.Layer.extend({
    _args:null,
    _isPursed:null,
    _isPause:null,
    sum:null,
    _args:null,
    onSelectSum:null,
    numberArray:null,
    onSelectNumber:null,
    empytFlagArray:null,
    typwTwoArray:null,
    warnColNumbers:null,
    calculate_right_count:null,
    rmCount:null,
    dropArray:null,
    dropGridArray:{equationTimes:null, arrowTimes:null, obstacleTimes:null},
    ctor:function (args) {
        this._super();        
        var size = cc.winSize;

        this.attr({
            x:0,
            y:0,
            anchorX: 0.5,
            anchorY: 0.5,
            width: size.width ,
            height: size.height,
        });

        this._args = args;
        this._args.gameID = args.gameID;
        this._args.level = args.level;
        this._args.timestampStart = parseInt(new Date().getTime());
        this._args.delegate = args.delegate || false;

        this._args.isLearnTest = args.isLearnTest || false;
        this._args.isFirstTest = args.isFirstTest || false;
        this._args.delegateLearnTest = args.delegateLearnTest || false;
       
		this.row = 10;
		this.col = 7;

	    this._view = new NumberCrashView(args.bg_color);
	    this._view.sethandle(this, this.setViewDelegate);
        this.addChild(this._view);

        this._isPause = false;
        var self = this;
        this._view._stopButton.addClickEventListener(function(){
            if (self._isPause == false) {
                self._isPause = true;
                self.handlePurseEvent(self);
            }
            
        });

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

            this.sureGuide(0);
        }else {
            this.runOneGame(this._args.level);
        }
        
        
	    // this.scheduleUpdate();
    },

    //-------------------------------------------------------//
    //--------------------- 新手引导 -------------------------//
    //-------------------------------------------------------//

    sureGuide: function (indexTip) {
        this._isGuide = true;
        this.guideLevel = 0;
        this._view.testHideExperAndStar();
        this.dTime = this.beginGuide(indexTip);
        this.goalTip();
    },

    beginGuide: function (indexTip) {
        this.setTipArray(GAME_GUIDE_TIP[this._args.gameID].guideTip[indexTip], true, 0);
        this.guide = new PlayerGuide(this._guideArray);
        this.guide.x = this._view.width*0.5 - this.guide.width*0.5;
        this.guide.y = this._view.height*0.6;
        this._view.addChild(this.guide, 10);
        return 3.0;
    },

    setTipArray: function (tip, isRect, verticesType) {
        this._guideArray.tip = tip;
        this._guideArray.isRect = isRect;
        this._guideArray.verticesType = verticesType;
    },

    goalTip: function () {
        var delay = cc.DelayTime.create(this.dTime);
        var call = cc.CallFunc.create(function () {
            this.guide.removeTip();
            this.setTipArray(GAME_GUIDE_TIP[this._args.gameID].guideTip[1], false, 4);
            this.guide.init(this._guideArray);
            this.guide.x = this._view._titlebar.width * 0.25 - this.guide.width*0.5;
            this.guide.y = this._view._titlebar.height+this.guide._hornHeight;
            this.runOneGame(this.guideLevel);
            var rectCCP = [cc.p(0, 0), cc.p(this._view._titlebar.width * 0.5, this._view._titlebar.height)];
            this.guide.addClipping(this._view, rectCCP, 1);
            this._view._stopButton.setTouchEnabled(false);
        },this);
        var delay1 = cc.DelayTime.create(this.dTime-0.5);
        var call1 = cc.CallFunc.create(function () {
            this.guide.removeTip();
            this.guide.removeClipping();
            
            var scale = cc.winSize.width / 750;
            var rectCCP1 = [cc.p(0, 0), cc.p(this._view._titlebar.width, this._view._titlebar.height)];
            this.setNumberScale();
            var disWidth = (this._view.width - this._view._gameNode.width)/2;
            var rectCCP2 = [cc.p(disWidth + this._view._gameNode.width*3/7, this._view._titlebar.height), cc.p(disWidth + this._view._gameNode.width*5/7, this._view._topbar.y - this._view._topbar.height)];
            var rectCCP = new Array();
            rectCCP[0] = rectCCP1;
            rectCCP[1] = rectCCP2;
            this.guide.addClipping(this._view, rectCCP, 3);
            // this._view._stopButton.setTouchEnabled(true);
            this.DropSingle(4, 5);

            for (var i = 4; i < 6; i++) {
                this.numberArray[i][1]._clickSettle = true;
            };
        },this);
        var delay2 = cc.DelayTime.create(0.5);
        var call2 = cc.CallFunc.create(function () {
            this.setTipArray(GAME_GUIDE_TIP[this._args.gameID].guideTip[2], true, 0);
            this.guide.init(this._guideArray);
            this.guide.x = this._view.width*0.5 - this.guide.width*0.5;
            this.guide.y = this._view.height*0.6;
        },this);
        var delay3 = cc.DelayTime.create(1.5);
        var call3 = cc.CallFunc.create(function () {

            this.handPosArray = this.getGuideNumberPos();
            this._view.setGuideHand(this.handPosArray.pos1,this.handPosArray.pos2);
            this._view.addHandAction3(this.handPosArray.pos1);

            this._changeHand = true;
            for (var i = 4; i < 6; i++) {
                this.numberArray[i][1]._clickSettle = false;
            };
        }, this);
        this.runAction(cc.Sequence.create(delay, call, delay1, call1, delay2, call2, delay3, call3));
    },

    deleteHandPos: function () {
        for (var k in this.handPosArray) {
            this.handPosArray[k] = null;
        }
        this.handPosArray = null;
        for (var i = 4; i < 6; i++) {
            this.numberArray[i][1] = null;
            this.numberArray[i] = {};
        };

    },

    setRemoveTip: function () {
        this.deleteHandPos();
        this.guide.removeClipping();
        platformFun.removeAllActionsFromTarget(this._view.hand);
        if (this._view.hand) {
            this._view.hand.removeFromParent(true);
            this._view.hand = null;
        }
        
        this._view._stopButton.setTouchEnabled(true);

        this.sum = 10;

        this.guide.removeTip();
        this.setTipArray(GAME_GUIDE_TIP[this._args.gameID].guideTip[7], true, 0);
        this.guide.init(this._guideArray);
        this.guide.x = this._view.width*0.5 - this.guide.width*0.5;
        this.guide.y = this._view.height*0.6;

        this.DropSingle(1,3);

        this._isAppoint = 2;
    },

    setResetTip: function () {
        var scale = cc.winSize.width / 750;

        this.guide.removeTip();
        this.setTipArray(GAME_GUIDE_TIP[this._args.gameID].guideTip[3], false, 6);
        this.guide.init(this._guideArray);
        this.guide.x = this._view._titlebar.width - 10  - this.guide.width - this.guide._hornHeight;
        this.guide.y = this._view._titlebar.height+this.guide._hornHeight;

        var rectCCP = [cc.p(this._view._titlebar.width*0.5, 0), cc.p(this._view._titlebar.width, this._view._titlebar.height)];
        this.guide.addClipping(this._view, rectCCP, 1);

        var ccp1 = this._view._titlebar.convertToWorldSpace(this._view._deleteButton);
        ccp1.x = ccp1.x-this._view._deleteButton.width*0.5+10*scale;
        this._view.setGuideHand(ccp1);
        this._view.addHandAction3(ccp1);

        for (var i = 1; i < 4; i++) {
            this.numberArray[i][1]._clickSettle = true;
        };

        this._view._stopButton.setTouchEnabled(false);

        this._isAppoint = 3;
    },

    setAddGoalTip: function () {
        this.guide.removeTip();
        this.guide.removeClipping();
        platformFun.removeAllActionsFromTarget(this._view.hand);
        // cc.director.getActionManager().removeAllActionsFromTarget(this._view.hand, true);
        this._view.hand.removeFromParent(true);
        this._view.hand = null;

        for (var i = 1; i < 4; i++) {
            this.numberArray[i][1]._clickSettle = false;
        };
        this._view._stopButton.setTouchEnabled(true);

        this.setTipArray(GAME_GUIDE_TIP[this._args.gameID].guideTip[2], true, 0);
        this.guide.init(this._guideArray);
        this.guide.x = this._view.width*0.5 - this.guide.width*0.5;
        this.guide.y = this._view.height*0.6;
    },

    setAppointTip: function () {
        switch (this._isAppoint) {
            case 1:
                this.setRemoveTip();
                break;
            case 2:
                break;
            case 3:
                break;
            case 4:
                var delay1 = cc.DelayTime.create(0.7);
                var call1 = cc.CallFunc.create(function () {
                    this.guide.removeTip();
                    for (var i = 1; i < 4; i++) {
                        this.numberArray[i][1] = null;
                        this.numberArray[i] = {};
                    };
                    this.init();
                },this);
                var delay2 = cc.DelayTime.create(0.5);
                var call2 = cc.CallFunc.create(function () {
                    this.setTipArray(GAME_GUIDE_TIP[this._args.gameID].guideTip[4], true, 0);
                    this.guide.init(this._guideArray);
                    this.guide.x = this._view.width*0.5 - this.guide.width*0.5;
                    this.guide.y = this._view.height*0.6;
                    this._isAppoint = 5;
                },this);
                this.runAction(cc.Sequence.create(delay1, call1, delay2, call2));
                break;
            case 5:
                this._isAppoint = 6;
                this.guide.removeTip();
                this.setTipArray(GAME_GUIDE_TIP[this._args.gameID].guideTip[5], true, 0);
                this.guide.init(this._guideArray);
                this.guide.x = this._view.width*0.5 - this.guide.width*0.5;
                this.guide.y = this._view.height*0.6;
                break;
            case 6:
                this._isAppoint = 7;
                this.guideSettle(true);
                break;
        }
    },

    guideSettle: function (guideType) {
        this.unschedule(this.gameStep);
        this.settleStopActions();
        this._view._gameNode.removeAllChildren(true);
        this._view.setAllLayerVisible(false);
        if (this.guide) {
            this.guide.removeTip();
            this.guide.removeFromParent(true);
            this.guide = null;
        }
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
        self.stopAllActions();
        self.delNumberArray();
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

    DropSingle: function (startCol, endCol) {
        for (var col = startCol; col <= endCol; col++) {
            this.rmCount[col] = 0;
            this.numberArray[col] = new Array();
            for (var row = 1; row <= 1; row++) {
                this.initNumber(col, row);
            };
        };
    },

    setSingleValue: function (col) {
        switch (col) {
            case 1:
                value = 2;
                break;
            case 2:
                value = 3;
                break;
            case 3:
                value = 5;
                break;
            case 4:
                value = 3;
                break;
            case 5:
                value = 4;
                break;
        }
        return value;
    },

    setGoalGuide: function (sum) {
        this.sum = sum;
        this._view.setSumLabel(0);
        this._view.setGoalLabel(this.sum);
    },

    getGuideNumberPos: function () {
        var scale = cc.winSize.width / 750;
        var ccp1 = this._view._gameNode.convertToWorldSpace(this.numberArray[4][1]);
        ccp1.x = ccp1.x+this.numberArray[4][1].width*0.5+10*scale;
        ccp1.y = ccp1.y+this.numberArray[4][1].height*0.5;
        var ccp2 = this._view._gameNode.convertToWorldSpace(this.numberArray[5][1]);
        ccp2.x = ccp2.x+this.numberArray[5][1].width*0.5+10*scale;
        ccp2.y = ccp2.y+this.numberArray[5][1].height*0.5;
        return {pos1 : ccp1, pos2 : ccp2};
    },

    //-------------------------------------------------------//


    runOneGame:function(level){
        this._isPursed = false;
        this._showStarNum = 0;
        this.sum = 0;        
        this.onSelectSum = 0;
        this.numberArray = new Array();
        this.onSelectNumber = new Array();
        this.empytFlagArray = new Array();
        this.typwTwoArray = new Array();
        this.warnColNumbers = new Array();
        this.calculate_right_count = 0;

        this.rmCount = new Array();
        this.dropArray = new Array();

        this.dropGridArray = {
            equationTimes : 1,
            arrowTimes : 1,
            obstacleTimes : 1,
        }

        if (this._isGuide) {
            this.unit = dict_number_level[level];
        }else if (this._args.isFirstTest == true) {
            this.unit = first_test_nc_level[level];
            this.passEquationCount = 18;
            this.judgeRigntCount = 0;
        }else if (this._args.isLearnTest == true) {
            this.unit = test_nc_level[level];
        }else {
            this.unit = dict_number_level[level];
            this.experAndStar();
            for (var i = 0; i < 3; i++) {
                this._view.starName[i].setTexture(res.game_star_small_01);
            };
        }
        if (this._args.isFirstTest == true && this._isGuide == false) {
            this.firstTestUpdateData();
        }else {
            this.initLevelData(this.unit);
        }
        
        this._view.setAllLayerVisible(true);
        if (this._args.isLearnTest == true && this._isGuide == false) {
            this._view.testHideExperAndStar();
        }

        if (this._isGuide) {
            this.setGoalGuide(7);
        }else {
           this.init(); 
        }
        
    },

    runFirstTestRoundData: function (roundIndex) {
        this.roundRightCount = this.unit.round_level[roundIndex].pass_equation;
        this.roundEnergyLevel = this.unit.round_level[roundIndex].energy_level;
        this.initLevelData(this.unit.round_level[roundIndex]);
    },

    firstTestUpdateData: function () {
        if (this.calculate_right_count == 0) {
            this.roundIndex = 0;
            this.runFirstTestRoundData(this.roundIndex);
        }else if (this.calculate_right_count == this.roundRightCount) {
            this.dropGridArray.equationTimes = 1; 
            this.roundIndex += 1;
            this.runFirstTestRoundData(this.roundIndex);
        }
    },

    initLevelData:function (leveldata) {
	    this.equation_count = parseInt(leveldata.equation.count);

        if (this._isGuide == false && this._args.isFirstTest == true) {
            this.equation_dropWay_array = leveldata.equation.drop_way; 
        }else {
            this.equation_drop_way = parseInt(leveldata.equation.drop_way);
            this.not_remove_bar_count = parseInt(leveldata.bar_not_remove.count);
            this.not_remove_bar_drop_way = parseInt(leveldata.bar_not_remove.drop_way);
        }

	    this.remove_bar_count = parseInt(leveldata.bar_remove.count);
	    this.remove_bar_drop_way = parseInt(leveldata.bar_remove.drop_way);

	    this.target_min_value = parseInt(leveldata.target_result.min_value);
	    this.target_max_value = parseInt(leveldata.target_result.max_value);
        this.single_value_max = parseInt(leveldata.single_number_max);
	    this.equation_typeArray = leveldata.equation.typeIndex;
        this.cellDropTime = leveldata.cell_drop_time;
        this._view.setPromptLabel(leveldata.level_tips);

    },
    setNumberScale:function () {
    	var number_length = 0;
        var game_size = this._view._gameNode.getContentSize();
        var number_width = game_size.width / this.col;
        var number_height = game_size.height / this.row;
        var gap  = Math.abs(number_width - number_height);
        if (number_width > number_height) {
            number_length = number_height;
            this._view._gameNode.setContentSize(game_size.width - gap * this.col, game_size.height);
        }else {
        	number_length = number_width;
        	this._view._gameNode.setContentSize(game_size.width, game_size.height - gap * this.row);
        }
        
        return number_length;
    },

    

    init:function() {
        this.sum = util.getRandom(this.target_min_value, this.target_max_value);
        this._view.setSumLabel(0);
        this._view.setGoalLabel(this.sum);

        for (var col = 1; col <= this.col; col++) {
        	this.rmCount[col] = 0;
            this.numberArray[col] = new Array();
            for (var row = 1; row <= 1; row++) {
            	this.initNumber(col, row);
            };
        };

        this.gameStart();
    },

    initNumber:function (col, row) {
    	number_data = this.setNumberData(numberData[1].typeId);
        if (this._isGuide) {
            number_data.number_value = this.setSingleValue(col);
            number_data.number_expression = number_data.number_value.toString();
        }
        
    	var number = new NumberCrashNumber(number_data);
    	number.setHandle(this, this.sethandle);
    	var number_size = number._cellNode.getContentSize();
    	var x = (col-1)*number_size.width;
    	var row_drop = util.getRandom(5, 10);
    	var y = (row_drop-1)*number_size.height;
        number.upLogicPos(col,row_drop);
        number.row = row;
        number.col = col;
        var dtCol = 0;
        var dtRow = row - row_drop;
        number.upLogicPos(dtCol,dtRow);
        
        number.setPosition(x, y);
    	this._view._gameNode.addChild(number);
        
        this.numberArray[col][row] = number;
        this.moveToCell(number, row_drop, row, number_size.height, 0);
    },
    setNumberData:function (ntype) {
    	var number_data = new Array();
        switch(ntype) {
        	case numberData[1].typeId:
        	    var grid_number_max = parseInt(this.single_value_max);
			    number_data.number_value = util.getRandom(1, grid_number_max);
			    number_data.number_expression = number_data.number_value.toString();

        	    break;
        	case numberData[2].typeId:
                
                var typeIndex = util.getRandom(1, this.equation_typeArray.length)-1;
                var level_equation_index = this.equation_typeArray[typeIndex];
			    var equation_count = util.getArrycount(dict_number_equation[level_equation_index]);
			    var equation_index = util.getRandom(1, equation_count);
			    number_data.number_value = dict_number_equation[level_equation_index][equation_index].nValue;
			    number_data.number_expression = dict_number_equation[level_equation_index][equation_index].equation;
			    			    
        	    break;
        	default:
        	    number_data.number_value = 0;
        	    number_data.number_expression = "";
                break;
        }
        number_data.number_side = this.setNumberScale();
	    number_data.number_type = ntype;
	    number_data.number_length = numberData[ntype].nLength;

	    return number_data;

    },
    sethandle:function(self,number){
        self.settle(number);
	},
    dropRules:function (isDropMore) {
    	
    	var typeId = numberData[1].typeId;
        var mod_equation = -1;
        if (this.equation_drop_way > 0) {
            mod_equation = this.calculate_right_count % (this.equation_drop_way * this.dropGridArray.equationTimes);
        }
        var mod_remove = -1;
        if (this.remove_bar_drop_way > 0) {
            mod_remove = this.calculate_right_count % (this.remove_bar_drop_way * this.dropGridArray.arrowTimes);
        }
        var mod_not_remove = -1;
        if (this.not_remove_bar_drop_way > 0) {
            mod_not_remove = this.calculate_right_count % (this.not_remove_bar_drop_way * this.dropGridArray.obstacleTimes);
        }

    	if (this.calculate_right_count == 0) {
    		mod_equation = -1;
    		mod_remove = -1;
    		mod_not_remove = -1;
    	}
       
        var type_array = new Array();
    	if (this.equation_count > 0 && mod_equation == 0) {
    		type_array.push(numberData[2].typeId);
            this.equation_count = this.equation_count - 1; 
            this.dropGridArray.equationTimes += 1;
    	}

    	if (this.remove_bar_count > 0 && mod_remove == 0) {
    		type_array.push(numberData[4].typeId);
            this.remove_bar_count = this.remove_bar_count - 1;
            this.dropGridArray.arrowTimes += 1;
    	}

    	if (this.not_remove_bar_count > 0 && mod_not_remove == 0) {
    		type_array.push(numberData[3].typeId);
            this.not_remove_bar_count = this.not_remove_bar_count - 1;
            this.dropGridArray.obstacleTimes += 1;
    	}
    	
    	var type_count = util.getArrycount(type_array);
    	for (var i = 0; i < type_count; i++) {
    			this.dropArray.push(type_array[i]);
    		};
        
        var number_count = util.getArrycount(this.dropArray);
    	if (number_count > 0 && isDropMore == true) {
    		typeId = this.dropArray[0];
    		this.dropArray.splice(0,1);
    	}
        type_array.splice(0,type_count);

        return typeId;
    },

    firstTestDropRules: function (isDropMore) {
        var typeId = numberData[1].typeId;

        var type_array = new Array();
        var startIndex = this.dropGridArray.equationTimes;

        for (var i = startIndex-1; i < this.equation_dropWay_array.length; i++) {
            if ((this.calculate_right_count) == this.equation_dropWay_array[i]) {
                if (this.equation_count > 0) {
                    type_array.push(numberData[2].typeId);
                    this.equation_count = this.equation_count - 1; 
                    this.dropGridArray.equationTimes += 1;
                }
                break;
            }
        };

        var mod_remove = -1;
        if (this.remove_bar_drop_way > 0) {
            mod_remove = this.calculate_right_count % this.remove_bar_drop_way;
        }

        if (this.calculate_right_count == 0) {
            mod_remove = -1;
        }

        //
        if (this.judgeRigntCount == this.calculate_right_count) {
            mod_remove = -1;
        }
        this.judgeRigntCount = this.calculate_right_count;

        if (this.remove_bar_count > 0 && mod_remove == 0) {
            type_array.push(numberData[4].typeId);
            this.remove_bar_count = this.remove_bar_count - 1;
            this.dropGridArray.arrowTimes += 1;
        }

        var type_count = util.getArrycount(type_array);
        for (var i = 0; i < type_count; i++) {
                this.dropArray.push(type_array[i]);
            };
        
        var number_count = util.getArrycount(this.dropArray);
        if (number_count > 0 && isDropMore == true) {
            typeId = this.dropArray[0];
            this.dropArray.splice(0,1);
        }
        
        type_array.splice(0,type_count);

        return typeId;
    },

    gameStart:function () {
        var secTimer = 0;        
        this.gameStep = function(dt) {
            if(this._isPursed == true){
                return;
            }
	        secTimer = secTimer + dt;

	        if (secTimer >= 2) {
	            
	            secTimer = 0;
                if (this._isGuide == false && this._args.isFirstTest == true) {
                    this.firstTestUpdateData();
                }
                

                var sum_number = 0;
		    	var number;
		    	for (var i = 1; i <= this.col; i++) {
		    		var nCount = util.getArrycount(this.numberArray[i]);
		    		sum_number = sum_number + nCount; 
                    for (var j = 1; j <= nCount; j++) {
                        if (this.numberArray[i][j] == COL_ROW_NIL || this.numberArray[i][j] == COL_ROW_MULTIPLE) {
                            sum_number = sum_number - 1;
                        }
                    };
		    	};

		    	if (sum_number < 5) {
                    var colArray = this.getDropPosX();
		            for (var i = 1; i <= 5; i++) {
		            	var typeId = numberData[1].typeId;
		            	number = this.initDropNumber(typeId, colArray[i-1]);
		            };
                    if (this._isGuide == false && this._args.isFirstTest == true) {
                        this.firstTestDropRules(false);
                    }else {
                        this.dropRules(false);
                    }
		    	} else {
                    
                    var typeId;
                    if (this._isGuide == false && this._args.isFirstTest == true) {
                        typeId = this.firstTestDropRules(true);
                    }else {
                        typeId = this.dropRules(true);
                    }
		            number = this.initDropNumber(typeId);
                    if (number._number_type == numberData[2].typeId) {
                        this.typwTwoArray.push(number);
                    }
		    	}

		    	if (number._number_type == numberData[4].typeId && util.getArrycount(this.numberArray[number.col]) == 1) {
                    this.delArrowNumber = function () {
                        this.numberArray[number.col].pop(); 
                        var rt = number.onDisappearCell();
                        this.runFunWithDelay(number, rt);
                    }
                    this.scheduleOnce(this.delArrowNumber, number._dropArray._dropTime);
		        }

                //cc.log("------ number pos ------", number.col, number.row);

		        var nCount = util.getArrycount(this.numberArray[number.col]);
                
                if (nCount >= 10) {
		            
		            this.unschedule(this.gameStep);
                    this.settleStopActions();
		            cc.log("you are defeat!!!");
                    var delayDefeat = this.defeatAction(number, nCount);
                    //var delayDefeat = 1.0;
                    this.defeat = function () {
                        if (this._args.isLearnTest == true) {
                            var delegate = this._args.delegateLearnTest;
                            if (this._isGuide == false && this._args.isFirstTest == true) {
                                delegate.recordLearnTestRes(delegate,true,this.roundEnergyLevel-1);
                            }else {
                                delegate.recordLearnTestRes(delegate,false,this.unit.energy_level);
                            }
                            this.testPass(false);   
                        }else {
                            if (this._isGuide) {
                                this.guideSettle(false);

                            }else {
                                this.showSettleView();
                            }
                        }
                    }
                    this.scheduleOnce(this.defeat, delayDefeat);
                    return;
		            
		        }
	        }
	    }
	    this.schedule(this.gameStep, 0); 
    },
    getDropPosX: function () {
        var colArray = [1,2,3,4,5,6,7];
        for (var i = 0; i < 2; i++) {
            var maxIndex = 7-i;
            var randomCol = util.getRandom(1,maxIndex)-1;
            colArray.splice(randomCol,1);
        };
        return colArray;
    },
    initDropNumber:function(typeId, dropCol) {
    	var drop_row = 10;
        var randCol = util.getRandom(1, this.col); 
        var col = dropCol || randCol;
        number_data = this.setNumberData(typeId);
        var number =  new NumberCrashNumber(number_data);
        number.setHandle(this, this.sethandle);
        var number_size = number._cellNode.getContentSize();
        var x = (col-1)*number_size.width; 
        var y = (drop_row-1)*number_size.height;
        
        var col_refer = this.getDropCol(col, number._number_length);
        x = (col_refer-1) * (number_size.width / number._number_length);
        var maxCol = this.getMainCol(col_refer, number);
        this.addNumberArray(maxCol, number);
        number.setPosition(x, y);
        this._view._gameNode.addChild(number);
        this.moveToCell(number, drop_row, number.row, number_size.height, 0);
        return number;
    },
    getDropCol:function (col, nLength) {
        var colNum = 0;
	    if (col <= this.col - nLength + 1) {
	        colNum = col;
	    }else {
	        var moveNum = col - (this.col - nLength + 1);
	        colNum = col - moveNum;
	    }
	    return colNum;
    },
    getMainCol:function (col, number) {
        var dtRowArray = new Array();
	    var logicPos = number.upLogicPos(col,10);
	    
	    for (var i = 1; i <= number._number_length; i++) {
	    	dtRowArray[i] = new Array();
            var colHeight = util.getArrycount(this.numberArray[i-1+col]);
	        dtRowArray[i].col = i-1+col;
	        dtRowArray[i].dt = logicPos[i][2] - colHeight;
	    };
        
	    var minDt = dtRowArray[1].dt;
	    var maxCol = dtRowArray[1].col;
	    var isMax = true;
	    var dtCount = util.getArrycount(dtRowArray);
	    
	    if (dtCount > 1) {
            for (var i = 2; i <= dtCount; i++) {
		    	if (minDt > dtRowArray[i].dt) {
		    		minDt = dtRowArray[i].dt;
	                maxCol = dtRowArray[i].col;
		    	}else if (minDt == dtRowArray[i].dt) {
	                isMax = false;
		    	}
	        };

	        if (isMax == false) {
		    	maxCol = -1;
		    }
    	}
	    
	    var dtCol = 0;
        var dtRow = 1 - minDt;
        
        number.upLogicPos(dtCol,dtRow);

	    return maxCol;
    },
    addNumberArray:function (maxCol, number) {
    	var posCount = util.getArrycount(number.logicPos);

        for (var i = 1; i <= posCount; i++) {
        	var col = number.logicPos[i][1];
            var row = number.logicPos[i][2];
        	if (maxCol == -1) {
	    		this.numberArray[col][row] = number;
	    		number.col = col;
	            number.row = row;
	    	}else {
	    		if (col == maxCol) {
	    			this.numberArray[col][row] = number;
	    			number.col = col;
	                number.row = row;
	    		}else {
	    			
	    			var nCount = util.getArrycount(this.numberArray[col]);
	    			var nil_count = row - nCount - 1;
	    			for (var j = 1; j <= nil_count; j++) {
						this.numberArray[col][row - j] = COL_ROW_NIL;
					};
	    			this.numberArray[col][row] = COL_ROW_MULTIPLE;
	    		}
	    	}
        };
        number._drop_state = this.getNumberchuState(number);
    },
    
    settle:function(num) {
    	if (num._number_state == state.on_Select) {
            this.onSelectNumber.push(num);
            this.onSelectSum = this.onSelectSum + num._numbre_value;
    	}else if (num._number_state == state.un_Select) {
            this.removeByValue(this.onSelectNumber, num);
            this.onSelectSum = this.onSelectSum - num._numbre_value;
    	}

        if (this._isGuide && this._isAppoint == 1 && num._number_state == state.on_Select) {
            if (num.logicPos[1][1] == 4 && this._changeHand == true) {
                this._changeHand = false;
                this._view.addHandAction3(this.handPosArray.pos2);
            }else if (num.logicPos[1][1] == 5 && this._changeHand == false) {
                this._changeHand = true;
                this._view.addHandAction3(this.handPosArray.pos1);
            }
        }

        if (this._isGuide && this._isAppoint == 2) {
            this.setResetTip();
        }
    	if (this.onSelectSum == this.sum) {
            this.calculate_right_count = this.calculate_right_count + 1;

    		this.initEmpytFlagArray();
    		var selectCount = util.getArrycount(this.onSelectNumber);
    		
    		for (var i = 0; i < selectCount; i++) {
    			var nu = this.onSelectNumber[i];

    			var pCount = util.getArrycount(nu.logicPos);
    			for (var pIndex = 1; pIndex <= pCount; pIndex++) {
    				var col = nu.logicPos[pIndex][1];
                    var row = nu.logicPos[pIndex][2];
                    this.empytFlagArray[col][row] = true;
                    this.rmCount[nu.col] = this.rmCount[nu.col] + 1;
                    this.numberArray[col][row] = COL_ROW_NIL;
    			};
    		};

    		this.elemitAndFilling();

            var removeNumberCount = this.arrowDisappear();
            if (removeNumberCount > 0) {
                var sCount = util.getArrycount(this.onSelectNumber);
                this.onSelectNumber.splice(0,sCount);
                this.onSelectSum = 0;
            }
            

            this.sum = util.getRandom(this.target_min_value, this.target_max_value);

            if (this._isGuide == false && this._args.isLearnTest == true) {
                var delegate = this._args.delegateLearnTest;
                if (this._args.isFirstTest == true && this.calculate_right_count >= this.passEquationCount) {
                    delegate.recordLearnTestRes(delegate,true,this.roundEnergyLevel);
                    this.testPass(true);
                }else if (this._args.isFirstTest == false && this.calculate_right_count >= this.unit.pass_equation) {
                    delegate.recordLearnTestRes(delegate,true,this.unit.energy_level);
                    this.testPass(true);
                }
            }else if (this._args.isLearnTest == false) {
                this.experAndStar();
            }

            if (this._isGuide) {
                this.setAppointTip();
            }    
        }

    	this._view.setGoalLabel(this.sum);
        this._view.setSumLabel(this.onSelectSum);
    },
    initEmpytFlagArray:function () {
    	for (var i = 1; i <= this.col; i++) {
    		this.rmCount[i] = 0;
            this.empytFlagArray[i] = {};
            var colCount = util.getArrycount(this.numberArray[i]);
            for (var j = 1; j <= colCount; j++) {
            	this.empytFlagArray[i][j] = false;
            };
    	};
    },
    elemitAndFilling:function () {
        var pos = {x:0,y:0};
	    var cols = this.col;
	    var rows = this.row;
        
        this.drop = function(col, row) {
        	var empytFlag = this.empytFlagArray;
            var mvsp ;
	        var index = row;
	        var colLeng = util.getArrycount(empytFlag[col]);
	        var isEmpty = empytFlag[col][row];

	        if (isEmpty == true && row < colLeng) {
                while (isEmpty == true && index < colLeng) {
                    index = index + 1;
                    isEmpty = empytFlag[col][index];
                }
                
                if (empytFlag[col][index] != true) {
                	mvsp = this.numberArray[col][index];
                	this.gridsDrop(mvsp, col, row, index);
                }
                
                
	        }
        };
        
        for (var col = 1; col <= cols; col++) {
        	var colCount = util.getArrycount(this.numberArray[col]);
        	for (var row = 1; row <= colCount; row++) {
        		this.drop(col, row);
        	};
        };

        this.removeNumber();
        
        var selectCount = util.getArrycount(this.onSelectNumber);
        for (var i = 0; i < selectCount; i++) {
        	var nu = this.onSelectNumber[i];
            if (nu._number_type == numberData[2].typeId) {
                this.removeByValue(this.typwTwoArray, nu);
            }

            if (nu._number_type == numberData[4].typeId) {
                var delayRemoveTime = nu._dropArray._dropTime;
                this.removeArrowActions = function () {
                    var rt = nu.onDisappearCell();
                    this.runFunWithDelay(nu, rt);
                }
                this.scheduleOnce(this.removeArrowActions, delayRemoveTime);
            }else {
                var rt = nu.onDisappearCell();
                this.runFunWithDelay(nu, rt);
            }
            
        };

    },
    removeNumber:function () {
        for (var col = 1; col <= this.col; col++) {
        	this.rmCount[col] = 0;
        	var col_count = util.getArrycount(this.numberArray[col]);
            for (var i = col_count; i >= 1; i--) {
            	if (this.numberArray[col][i] == COL_ROW_NIL || this.empytFlagArray[col][i] == true) {
            		this.rmCount[col] = this.rmCount[col] + 1;
            	}else {
            		break;
            	}
            };
        };
        for (var col = 1; col <= this.col; col++) {
        	while (this.rmCount[col] > 0) {
        		this.numberArray[col].pop();
        		this.rmCount[col] = this.rmCount[col] - 1;
        	}
        };
    },
    gridsDrop:function (mvsp, col, row, index) {
    	
    	if (mvsp == COL_ROW_NIL || mvsp == COL_ROW_MULTIPLE) {
        	if (mvsp == COL_ROW_MULTIPLE) {
        		this.setNullMember(col, index);
        	}
        } else {
	    	if (mvsp && mvsp.row > row) {
        	    this.min_drop = this.getMinCount(mvsp);

	    		if (mvsp._number_type == numberData[2].typeId) {
	                if (this.min_drop > 0) {
	                	mvsp.row = mvsp.row - this.min_drop;
	                	mvsp.upLogicPos(0,-this.min_drop);
	                	var number_size = mvsp._cellNode.getContentSize();
                        var delay_time = this.getDropOverplusTime(mvsp);
                        //this.dropPloygon = function () {
                            this.moveToCell(mvsp, index, mvsp.row, number_size.height, delay_time);
                        //}
				        //this.scheduleOnce(this.dropPloygon, delay_time);
	                	var number_count = util.getArrycount(mvsp.logicPos);
	                	for (var i = 1; i <= number_count; i++) {
	                		var col_pos = mvsp.logicPos[i][1];
	                        var row_pos = mvsp.logicPos[i][2];
                            var number = this.numberArray[col_pos][index];
				            this.numberArray[col_pos][mvsp.row] = number;
				            this.empytFlagArray[col_pos][mvsp.row] = false;
				            this.empytFlagArray[col_pos][index] = true;
				            this.numberArray[col_pos][index] = COL_ROW_NIL;
	                	};
	                	var now_state = this.getNumberState(mvsp);
	                	this.changeState(mvsp, now_state, index);
                        this.isDropOtherCol(index, mvsp, col);

	                }else {
                        var now_state = this.getNumberState(mvsp);
                        this.changeState(mvsp, now_state, index);
	                }
	    		}else {
	    			if (this.min_drop > 0) {
	    				var number_size = mvsp._cellNode.getContentSize();
		            	mvsp.row = mvsp.row - this.min_drop;
			            mvsp.upLogicPos(0,-this.min_drop);
                        var delay_time = this.getDropOverplusTime(mvsp);
                        //this.dropSingle = function () {
                            this.moveToCell(mvsp, index, mvsp.row, number_size.height, delay_time); 
                        //}
			            //this.scheduleOnce(this.dropSingle, delay_time);
			            this.numberArray[col][mvsp.row] = mvsp;
			            this.empytFlagArray[col][mvsp.row] = false;
			            this.empytFlagArray[col][index] = true;
			            this.numberArray[col][index] = COL_ROW_NIL;
	    			} 
	    		}
	        }      
        } 
    },
    isDropOtherCol:function (index, mvsp, col) {
    	var number_count = util.getArrycount(mvsp.logicPos);
        var col_count = util.getArrycount(this.numberArray[col]);
        var isEqual = false;
        if (index + 1 <= col_count) {
        	var bigMvsp = this.numberArray[col][index+1];
    	    var isEqual = this.isEqualCol(mvsp, bigMvsp);
        }
        if (isEqual == false) {
			for (var i = 1; i <= number_count; i++) {
        		var col_other = mvsp.logicPos[i][1];
        		if (col_other != col) {
        			this.dropOtherCol(col_other, index);
        		}
        	};
        } 
    },
    dropOtherCol:function (col, index) {
    	var count = util.getArrycount(this.numberArray[col]);
        if (index < count) {
            for (var i = index + 1; i <= count; i++) {
            	var mvsp = this.numberArray[col][i];
            	this.gridsDrop(mvsp, col, i - 1, i);
            };
        }
    },
    getDropCount:function (col, row) {
    	var drop_count = 0;
        for (var i = row - 1; i >= 1; i--) {
        	var number_dowm = this.numberArray[col][i];
        	var isEmpty = this.empytFlagArray[col][i];
        	if (number_dowm == COL_ROW_NIL || isEmpty == true) {
                drop_count = drop_count + 1;
        	}else {
        		break;
        	}
        };
        return drop_count;
    },
    getMinCount:function (mvsp) {
    	var drop_distance = new Array();
		var number_pos_count = util.getArrycount(mvsp.logicPos);
		for (var i = 1; i <= number_pos_count; i++) {
         	var col_pos = mvsp.logicPos[i][1];
            var row_pos = mvsp.logicPos[i][2];
            drop_distance[i] = this.getDropCount(col_pos, row_pos);
        };
        var min_count = drop_distance[1];
        for (var i = 1; i <= number_pos_count; i++) {
            if (min_count > drop_distance[i]) {
                min_count = drop_distance[i];
            }
        };
        return min_count;
    },
    setNullMember:function (col, row) {
    	var count = 0;
    	for (var i = row - 1 ; i >= 1; i--) {
    		var number_dowm = this.numberArray[col][i];
        	var isEmpty = this.empytFlagArray[col][i];
        	
        	if (isEmpty == true || number_dowm == COL_ROW_NIL) {
               count = count + 1;
    		}else {
    			break;
    		} 
    	};
    	for (var i = 1; i <= count; i++) {
			this.numberArray[col][row - i] = COL_ROW_NIL;
		};
    },
    getNumberState:function (mvsp) {
    	var state_number = -1;
    	var stateDis = new Array();
        var number_pos_count = util.getArrycount(mvsp.logicPos);
		for (var i = 1; i <= number_pos_count; i++) {
         	var col_pos = mvsp.logicPos[i][1];
            var row_pos = mvsp.logicPos[i][2];
            stateDis[i] = 0;
            
            for (var j = row_pos - 1; j >= 1; j--) {
	        	var number_dowm = this.numberArray[col_pos][j];
	        	var isEmpty = this.empytFlagArray[col_pos][j];
	        	if (number_dowm == -1 || isEmpty == true) {
	        		stateDis[i] = stateDis[i] + 1;
	        	}else {
	        		break;
	        	}
	        };
        };
        
        
        var dis_min = stateDis[1];
        for (var i = 2; i <= number_pos_count; i++) {
        	if (dis_min == stateDis[i]) {
        		state_number = -1;
        	}else if (dis_min > stateDis[i]) {
                state_number = mvsp.logicPos[i][1];
        	}else {
        		state_number = mvsp.logicPos[1][1];
        	}
        };

        return state_number;

    },
    getNumberchuState:function (mvsp) {
    	var state_number = -1;
    	var stateDis = new Array();
        var number_pos_count = util.getArrycount(mvsp.logicPos);
		for (var i = 1; i <= number_pos_count; i++) {
         	var col_pos = mvsp.logicPos[i][1];
            var row_pos = mvsp.logicPos[i][2];
            stateDis[i] = 0;
            
            for (var j = row_pos - 1; j >= 1; j--) {
	        	var number_dowm = this.numberArray[col_pos][j];
	        	if (number_dowm == -1) {
	        		stateDis[i] = stateDis[i] + 1;
	        	}else {
	        		break;
	        	}
	        };
        };
        var dis_min = stateDis[1];
        for (var i = 2; i <= number_pos_count; i++) {
        	if (dis_min == stateDis[i]) {
        		state_number = -1;
        	}else if (dis_min > stateDis[i]) {
                state_number = mvsp.logicPos[i][1];
        	}else {
        		state_number = mvsp.logicPos[1][1];
        	}
        };

        return state_number;
    },
    changeState:function (mvsp, now_state, index) {
        var number_count = util.getArrycount(mvsp.logicPos);
        if (now_state != -1) {
            if (mvsp._drop_state != -1) {
               if (mvsp._drop_state != now_state) {
               	    this.numberArray[now_state][mvsp.row] = mvsp;
               	    this.numberArray[mvsp._drop_state][mvsp.row] = COL_ROW_MULTIPLE;
               	    this.setNullMember(mvsp._drop_state,mvsp.row);
                }
            }else if (mvsp._drop_state == -1) {
                for (var i = 1; i <= number_count; i++) {
                	var col_pos = mvsp.logicPos[i][1];
                	if (col_pos != now_state) {
                		this.numberArray[col_pos][mvsp.row] = COL_ROW_MULTIPLE;
                		this.setNullMember(col_pos, mvsp.row);
                	}else {
                		this.numberArray[now_state][mvsp.row] = mvsp;

                	}
                };
            }
        }else if (now_state == -1) {
        	if (mvsp._drop_state != -1) {
        		for (var i = 1; i <= number_count; i++) {
                	var col_pos = mvsp.logicPos[i][1];
                	this.numberArray[col_pos][mvsp.row] = mvsp;
                };
        	}
        }
        mvsp._drop_state = now_state;
    },
    isEqualCol:function (numA, numB) {
    	var isEqual = true; 
    	if (numB != COL_ROW_NIL && numB != COL_ROW_MULTIPLE) {
            if (numA._number_type == numB._number_type) {
	       	    var number_count = util.getArrycount(numA.logicPos);
	       	    for (var i = 1; i <= number_count; i++) {
	       	    	var colA = numA.logicPos[i][1];
	       	   	    var colB = numB.logicPos[i][1];
	       	   	    if (colA != colB) {
	                    isEqual = false;
	       	   	    }
	       	    };
	        }else {
	        	isEqual = false;
	        }
    	}else {
            isEqual = false;
    	}
        

        return isEqual;
    },
    
    arrowDisappear:function () {
        //if (isFour == false) {
            this.initEmpytFlagArray();
            var sCount = util.getArrycount(this.onSelectNumber);
            this.onSelectNumber.splice(0,sCount);
            this.onSelectSum = 0;
        //}
		
        var reNumberCount = 0;

		for (var col = 1; col <= this.col; col++) {
			var col_count = util.getArrycount(this.numberArray[col]);
            for (var row = 1; row <= col_count; row++) {
	        	if (this.numberArray[col][row]._number_type == numberData[4].typeId) {
	        		this.empytFlagArray[col][row] = true;
	        		this.onSelectNumber.push(this.numberArray[col][row]);
	        		this.rmCount[col] = this.rmCount[col] + 1;
	        		this.numberArray[col][row] = COL_ROW_NIL;
                    reNumberCount += 1;
	        	}else{
	        		break;
	        	}
	        };
		};
        if (reNumberCount > 0) {
            this.elemitAndFilling();
        }
		return reNumberCount;	
    },

    getDropOverplusTime: function (node) {
        var posX = node.getPositionX();
        var posY = node.getPositionY();

        var curDistance = posY - node._dropArray._dropPosY;
        var delayTime = curDistance / node._dropArray._dropDistance * node._dropArray._dropTime;
        if (delayTime < 0) {
            delayTime = 0;
        }
        return delayTime;
    },

    moveToCell:function (node, customRow, row, height, delatTime) {
        node.stopAllActions();

	    var jumpBTime = 0.1;

	    var posX = node.getPositionX();
	    var posY = node.getPositionY();

	    var time = this.cellDropTime;
	    var speed = height * 10 / time;
        var distance = height;
	    var moveTime = distance/speed * (customRow - row + 1);
        moveTime = moveTime + delatTime - jumpBTime;
	    var actionUp = cc.JumpBy.create(jumpBTime, cc.p(0,0), -8, 1);
	    var actionMv = cc.MoveTo.create(moveTime, cc.p(posX, height * (row-1)));
	    
	    var actions = cc.Sequence.create(actionMv, actionUp);

	    node.runAction(actions);

        var dropDistance = posY - height * (row-1);
        var dropPosY = height * (row-1);

        node._dropArray._dropDistance = dropDistance;
        node._dropArray._dropPosY = dropPosY;
        node._dropArray._dropTime = moveTime;
	},
	runFunWithDelay:function (node, time) {

        var removeNumber = function() {
            node.removeFromParent(true);
        }
		var cFunc = cc.CallFunc.create(removeNumber, this);
	    var delay = cc.DelayTime.create(time);
	    var sequence = cc.Sequence.create(delay, cFunc);
	    node.runAction(sequence);
	    return sequence;
	},
	setViewDelegate:function (self) {
		self.deleteSum();
	},
    deleteSum:function () {
        
        var selectCount = util.getArrycount(this.onSelectNumber);
        if (selectCount > 0) {
        	for (var i = 0; i < selectCount; i++) {
        	    this.onSelectNumber[i].unSelectCell();
	        };
	        this.onSelectNumber.splice(0,selectCount);
	        this.onSelectSum = 0;
	        this._view.setSumLabel(this.onSelectSum);
        }
        
        if (this._isAppoint == 3 && this._isGuide) {
            this.setAddGoalTip();
            this._isAppoint = 4;
        };

    },
    experAndStar:function () {
        var oneStar_value = this.unit.star_term.oneStar;
        var twoStar_value = this.unit.star_term.twoStar;
    	var custom_value = this.unit.star_term.threeStar;

        if (this.calculate_right_count >= 0) {

            var now_percent;
            var percentTage = this._view._loadingBar.getPercent();
            if (this.calculate_right_count <= oneStar_value) {
                now_percent = percentTage + 1 / (oneStar_value*3/2) * 100;
                if (this.calculate_right_count == 0) {
                    now_percent = 0;
                }
            }else if (this.calculate_right_count <= twoStar_value) {
                var distanceStar = twoStar_value - oneStar_value;
                now_percent = percentTage + 1 / (distanceStar*6) * 100;

            }else if (this.calculate_right_count <= custom_value) {
                var distanceStar = custom_value - twoStar_value;
                now_percent = percentTage + 1 / (distanceStar*6) * 100;
            }else {
                now_percent = 100;
            }

        	this._view._loadingBar.setPercent(now_percent);
        	this._view._zero.setString(this.calculate_right_count.toString());
        	var exper_size = this._view._experNode.getContentSize().width;
        	this._view._zero.setPositionX(exper_size*now_percent/100);
        }

        switch (this.calculate_right_count) {
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
                    this.unschedule(this.gameStep);
		            cc.log("you are success!!!");
                    this.settleStopActions();
                    this.showSettleView();
        	       break;
        	default:
                break;               
        }
    },

    defeatAction: function (number, colCount) {

        var warnColCount = this.warnColNumbers.length;
        for (var i = 0; i < warnColCount; i++) {
            var warnNumberCount = this.warnColNumbers[i].length;
            for (var j = 0; j < warnNumberCount; j++) {
                this.warnColNumbers[i][j]._cell_bg.stopAllActions();
                this.warnColNumbers[i][j]._cell_bg.setColor(cc.color(255,255,255));
            };
            
        };

        var actionTime = 1;
        return actionTime;
    },

    settleStopActions: function () {
        if (util.getArrycount(this.numberArray) == 0) {return;};
        for (var i = 1; i <= this.col; i++) {
            var colLength = util.getArrycount(this.numberArray[i]);
            // cc.log("------------------ colLength ------------------", colLength);
            for (var j = 1; j <= colLength; j++) {
                if (this.numberArray[i][j] != COL_ROW_NIL && this.numberArray[i][j] != COL_ROW_MULTIPLE) {
                    // cc.log("------------------ i && j ------------------", i, j);
                    this.numberArray[i][j].stopAllActions();
                    this.numberArray[i][j].successAction();
                }  
            };
        };
    },

    testPass: function (isPass) {
        if (isPass == true) {
            this.unschedule(this.gameStep);
            this.settleStopActions();
        }

        this.showTest = function () {
            this._view._gameNode.removeAllChildren(true);
            this._view.setAllLayerVisible(false);

            var delegate = this._args.delegateLearnTest;
            if(delegate.IsLastLearnTest(delegate) == true){
                delegate.showViewSettleTest(delegate);
            } else {
                delegate.HandleStartTest(delegate, false);
            }  
        }
        this.scheduleOnce(this.showTest, 1);      
    },

    showSettleView:function(){
        this._view._gameNode.removeAllChildren(true);
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
            var str = '答对'+self.calculate_right_count+'题';
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
        var str = '答对'+this.calculate_right_count+'题';
        this._viewSettle.setResTipText(str);
        this.addChild(this._viewSettle);
    },

    handleNext:function(self){
        self._args.timestampStart = parseInt(new Date().getTime());
        self._args.level += 1;
        if(self._args.level > 30){
            self._args.level = 1;
        };
        
        self.runOneGame(self._args.level);
    },
    handleAgain:function(self){
        
        self.runOneGame(self._args.level);
    },

    handlePurseEvent:function(self){
        self._isPursed = true;
        self._isPause = false;
        var children = self._view._gameNode.getChildren();
        for(var k in children){
            cc.director.getActionManager().pauseTarget(children[k]);
        }   
        if (self._isGuide) {
            cc.director.getActionManager().pauseTarget(self);
        } 
         
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
        self._viewGameSetting.removeFromParent(true);
        self._isPursed = false;
        var children = self._view._gameNode.getChildren();
        for(var k in children){
            cc.director.getActionManager().resumeTarget(children[k]);
        }
        if (self._isGuide) {
            cc.director.getActionManager().resumeTarget(self);
        } 
    },
    handleRestart:function(self){
        cc.log('---handleRestart');
        var children = self._view._gameNode.getChildren();
        for(var k in children){
            cc.director.getActionManager().resumeTarget(children[k]);
        }
        if (self._isGuide) {
            cc.director.getActionManager().resumeTarget(self);
        } 
        
        self._viewGameSetting.removeFromParent(true); 

        self._view._gameNode.removeAllChildren(true);
        self.unschedule(self.gameStep);
        self._isPursed = false;
        self.stopAllActions();
        
        if (self._isGuide) {
            self._view.setAllLayerVisible(false);
            self.delNumberArray();
            self._isAppoint = 1;
            self.guide.removeFromParent(true);
            self.guide = null;
            self.sureGuide(0);
        }else {
            self.runOneGame(self._args.level); 
        }  
    },

    indexOf:function(array, val) { 
        var aCount = util.getArrycount(array);   
        for (var i = 0; i < aCount; i++) {  
            if (array[i] == val) return i;  
        }  
        return -1;  
    },
    removeByValue:function(array, val) {  
        var index = this.indexOf(array, val); 
        if (index > -1) {  
            array.splice(index, 1);  
        }  
    }, 

    delNumberArray: function () {
        if (this.numberArray != null) {
            for (var i = 1; i <= this.col; i++) {
                var colLength = util.getArrycount(this.numberArray[i]);
                for (var j = 1; j <= colLength; j++) {
                    this.numberArray[i][j] = null;
                };
                if (colLength > 0) {
                   this.numberArray[i].splice(1, colLength); 
                }
                
                this.numberArray[i] = null;
            };
            this.numberArray.splice(1, this.col);
            this.numberArray = null;
        }
    },  

    onExit: function () {
        // cc.director.getScheduler().unscheduleAll();
        // this.unschedule(this.gameStep);
        this._view._gameNode.removeAllChildren(true);
        this._view.removeAllChildren(true);
        this.delNumberArray();
        // this.removeFromParent(true);
        this._super();
    },

});