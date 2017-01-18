
var StackChart = cc.Layer.extend({
    ACTION_TIME_PROGRESS:1,
	_args:null,
	_targetArray:null,
	_interfereArray:null,
	_laterlResArray:null,
	_laterlMinSize:null,
	_laterlMaxSize:null,
	_topResArray:null,
	_chartNumber:null,
	_sizeCount:null,
	_rightIndex:null,
	_roundIndex:null,
	_roundCount:null,
	_countDown:null,
	_isPauseGame:null,
	_runGameTime:null,
	_rightNumber:null,
	_pauseClick:null,
    _rightRound:null,
    _starNum:null,
    _isRoundNext:null,
	ctor:function (args) {
        this._super();

        this._sizeCount = 6;

        this._args = args;
        this._args.timestampStart = parseInt(new Date().getTime());
        this._args.delegate = args.delegate || false;

        this._args.isLearnTest = args.isLearnTest || false;
        this._args.isFirstTest = args.isFirstTest || false;
        this._args.delegateLearnTest = args.delegateLearnTest || false;

        this._view = new StackChartView(args.bg_color);
        this._view.setSettleHandle(this, this.judgeRightOrWrong);
        this.addChild(this._view);

        this._pauseClick = false;
        var self = this;
        this._view._purseBtn.addClickEventListener(function(){
            if (self._pauseClick == false) {
                self._pauseClick = true;
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
            this.sureGuide();
        }else {
            this.init(this._args.level);
        }
    },


    //-------------------------------------------------------//
    //--------------------- 新手引导 -------------------------//
    //-------------------------------------------------------//

    sureGuide: function () {
        this._isGuide = true;
        this.guideLevel = 0;
        this._view._purseBtn.setTouchEnabled(true);
        this._view._progressBar.setVisible(false);
        this._view.testHideExperAndStar();
        this.dTime = this.beginGuide();
        this.goalTip();
    },

    beginGuide: function () {
        var scale = cc.winSize.width / 750;
        this.setTipArray(GAME_GUIDE_TIP[this._args.gameID].guideTip[0], true, 4);
        this.guide = new PlayerGuide(this._guideArray);
        this.guide.x = this._view.width*0.5 - this.guide.width*0.5;
        this.guide.y = this._view.laterlContainer.y - this.guide.height - 20*scale;
        this._view.addChild(this.guide, 10);

        this.init(this.guideLevel); 
        this._view._isClick = false;
        // this._view.isTouchListener = false;
        return 3.0;
    },

    setTipArray: function (tip, isRect, verticesType) {
        this._guideArray.tip = tip;
        this._guideArray.isRect = isRect;
        this._guideArray.verticesType = verticesType;
    },

    goalTip: function () {
        var scale = cc.winSize.width / 750;
        cc.log("------------- goalTip -------------", this._isAppoint);
        switch (this._isAppoint) {
            case 1:
                var delay1 = cc.DelayTime.create(this.dTime);
                var callF1 = cc.CallFunc.create(function () {
                    this._view._purseBtn.setTouchEnabled(false);
                    var laterlNode = this._view.laterlContainer.getChildByTag(111);
                    var laterViewPos = this._view.laterlContainer.convertToWorldSpace(laterlNode);
                    var ccp1 = cc.p(laterViewPos.x - laterlNode.width*0.5, this._view.laterlContainer.y - this._view.laterlContainer.height);
                    var ccp2 = cc.p(laterViewPos.x + laterlNode.width*0.5, laterViewPos.y - laterlNode.height*0.5 + this._view.laterViewHeight + 20*scale);
                    var rectCCP = [ccp1, ccp2];
                    this.guide.addClipping(this._view, rectCCP, 1);
                    this.guide.removeTip();
                    this.setTipArray(GAME_GUIDE_TIP[this._args.gameID].guideTip[1], true, 4);
                    this.guide.init(this._guideArray);
                    this.guide.x = this.width*0.5 - this.guide.width*0.5;
                }, this);

                var delay2 = cc.DelayTime.create(this.dTime);
                var callF2 = cc.CallFunc.create(function () {
                    this._view._isClick = true;
                    this.guide.removeClipping();

                    var laterlNode = this._view.laterlContainer.getChildByTag(111);
                    var laterViewPos = this._view.laterlContainer.convertToWorldSpace(laterlNode);
                    // var ccp1 = cc.p(laterViewPos.x - laterlNode.width*0.5, this._view.laterlContainer.y - this._view.laterlContainer.height);
                    // var ccp2 = cc.p(laterViewPos.x + laterlNode.width*0.5, laterViewPos.y - laterlNode.height*0.5 + this._view.laterViewHeight + 20*scale);
                    // var rectCCP1 = [ccp1, ccp2];

                    var topViewPos = this._view.topContainer.convertToWorldSpace(this._view._topNodeArray[0]);
                    var ccp3 = cc.p(this._view.topContainer.x - this._view.topContainer.width*0.5,this._view.topContainer.y - this._view.topContainer.height);
                    var ccp4 = cc.p(laterViewPos.x + laterlNode.width*0.5, laterViewPos.y - laterlNode.height*0.5 + this._view.laterViewHeight + 20*scale);
                    // var ccp4 = cc.p(this._view.topContainer.x + this._view.topContainer.width*0.5, topViewPos.y + this._view._topNodeArray[0].height*0.5 + 20*scale);
                    var rectCCP = [ccp3, ccp4];

                    // var rectCCP = new Array();
                    // rectCCP[0] = rectCCP1;
                    // rectCCP[1] = rectCCP2;
                    this.guide.addClipping(this._view, rectCCP, 1);

                    this.guide.removeTip();
                    this.setTipArray(GAME_GUIDE_TIP[this._args.gameID].guideTip[2], true, 4);
                    this.guide.init(this._guideArray);
                    this.guide.x = this.width*0.5 - this.guide.width*0.5;

                    this._view.setGuideHand(this._view._topNodeArray[this._rightIndex].getPosition());

                }, this);

                this.runAction(cc.Sequence.create(delay1, callF1, delay2, callF2));

                this._isAppoint = 2;
                break;
            case 3:
                this._isAppoint = 4;
                this.guideSettle();
                break;
        }
    },

    rightTip: function () {
        this._view.hand.stopAllActions();
        this._view.hand.removeFromParent(true);
        this._view.hand = null;

        this.guide.removeClipping();
        this._view._purseBtn.setTouchEnabled(true);

        this.guide.removeTip();
        this.setTipArray(GAME_GUIDE_TIP[this._args.gameID].guideTip[3], true, 4);
        this.guide.init(this._guideArray);
        this.guide.x = this.width*0.5 - this.guide.width*0.5;

        this._isAppoint = 3; 
    },

    guideSettle: function () {
        if (this.guide) {
            this.guide.removeClipping();
            this.guide.removeTip();
            this.guide.removeFromParent(true);
            this.guide = null;
        }
        
        this._view.setLaterlAndTopView();
        this.removeActions();
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
        self._view._isClick = true;
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


    init: function (level) {
        // if (this._isGuide || (this._args.isFirstTest == false && this._args.isLearnTest == false)) {
        //     this.unit = dict_sc_level[level];
        // }
    	this.unit = dict_sc_level[level];
    	this._roundIndex = 1;
        this._rightRound = 0;
    	this._roundCount = this.unit.round_id_list.length;
       	this._countDown = this.unit.countDown;
       	this._isPauseGame = false;
       	this._rightNumber = 0;
       	this._runGameTime = 0;
        this._starNum = 0;
       	this._view.setViewVisible(true);

        var action = cc.progressTo(this._countDown, 0);
        action.setTag(this.ACTION_TIME_PROGRESS);
        this._view._progressBar.runAction(action);

        this._view.initExper();
        if(!this._isGuide) {
            this.scheduleUpdate();
        }
        this._isRoundNext = true;
    	this.runOneGame(this._isRoundNext);
    },

    runOneGame: function (isNext) {
    	this._targetArray = new Array();
    	this._interfereArray = new Array();
    	this._laterlResArray = new Array();
    	this._topResArray = new Array();
    	var roundString = this.unit.round_id_list[this._roundIndex-1].toString();
    	this.roundUnit = dict_sc_level_round[roundString];
    	this._chartNumber = this.roundUnit.answerNumber;
        var passCount = this.roundUnit.changeRoundCount;
        if (isNext && passCount < 0) {
            this._rightRound = passCount;
        }else if (isNext && passCount > 0) {
           this._rightRound = this._rightRound + passCount; 
        }
        
    	this.getTargetAttr();
    	this.getLaterlAttr();
    	this.addTopGraph();
    },

    getTargetAttr: function () {
    	var typeCount;

    	if (this.roundUnit.isCone == 2) {
    		typeCount = this.roundUnit.laterlHeight;
    	}else if (this.roundUnit.isCone == 1 && this.roundUnit.laterlHeight <= this._sizeCount) {
    		typeCount = util.getRandom(1, this.roundUnit.laterlHeight);
    	}else if (this.roundUnit.isCone == 1 && this.roundUnit.laterlHeight > this._sizeCount) {
            typeCount = util.getRandom(1, this._sizeCount);
        }

    	var topAttrArray = this.getTopViewAttr(typeCount, true);
    	this._targetArray = topAttrArray.concat();

    	topAttrArray = null;
        this._laterlMinSize = this._targetArray[0].sizeIndex;
        this._laterlMaxSize = this._targetArray[typeCount-1].sizeIndex;
    },

    getTopViewAttr: function (typeCount, isTarget) {
    	var topViewArray = [];
    	var graphIndexArray = [1,2,3,4,5,6];
    	var graphSizeArray = [1,2,3,4,5,6];
    	for (var i = 0; i < typeCount; i++) {
            topViewArray[i] = {};

            var graphIndex = util.getRandom(1, graphIndexArray.length) - 1;
            topViewArray[i].graphIndex = graphIndexArray[graphIndex];
            graphIndexArray.splice(graphIndex, 1);

            var sizeRandom = util.getRandom(1, graphSizeArray.length) - 1;
            topViewArray[i].sizeIndex = graphSizeArray[sizeRandom];
            graphSizeArray.splice(sizeRandom, 1);

        };

        for (var i = 0; i < typeCount-1; i++) {
        	for (var j = i+1; j < typeCount; j++) {
        		if (topViewArray[i].sizeIndex > topViewArray[j].sizeIndex) {
        			var test = {};
        			test.graphIndex = topViewArray[i].graphIndex;
        			test.sizeIndex = topViewArray[i].sizeIndex;
        			topViewArray[i].graphIndex = topViewArray[j].graphIndex;
        			topViewArray[i].sizeIndex = topViewArray[j].sizeIndex;
        			topViewArray[j].graphIndex = test.graphIndex;
        			topViewArray[j].sizeIndex = test.sizeIndex;
        		}
        	};
        };

        if (isTarget == true) {
        	for (var i = 0; i < graphIndexArray.length; i++) {
	        	this._interfereArray.push(graphIndexArray[i]);
	        };
        }
        
        return topViewArray;
    },

    getLaterlAttr: function () {
    	if (this.roundUnit.isCone == 2) {
    		this.getlaterlTargetGraph();
    	}else if (this.roundUnit.isCone == 1) {
    		this.getlaterlTargetGraph();
    		var otherTypeArray = [];
    		otherTypeArray = this._interfereArray.concat();
    		var otherGraphLehgth = this.roundUnit.laterlHeight - this._targetArray.length;
    		for (var i = 0; i < otherGraphLehgth; i++) {
    			var otherTypeRandom = util.getRandom(1, otherTypeArray.length)-1;
    			var otherTypeIndex = otherTypeArray[otherTypeRandom];
    			otherTypeArray.splice(otherTypeRandom, 1);
    			var otherSizeRandom = util.getRandom(this._laterlMinSize, this._sizeCount);
    			var firstSize = otherSizeRandom;
    			var otherSizeString = this.getLaterlSize(otherSizeRandom);
    			var laterlLength = this._laterlResArray.length;
    			for (var j = 0; j < laterlLength; j++) {

    				if (otherSizeRandom == this._laterlMinSize) {
    					
						if ((laterlLength - j) == 1) {
    						otherSizeRandom = this._laterlResArray[j].sideIndex;
    					}
    					if (otherSizeRandom == this._laterlResArray[j].sideIndex) {
    						var otherGraphArray = {};
	    					otherGraphArray.sideRes = laterlGraphType[otherTypeIndex][otherSizeString];
	    					otherGraphArray.sideIndex = otherSizeRandom;
	    					this._laterlResArray.splice(j,0,otherGraphArray);
	    					break;
    					}
    				}else if (otherSizeRandom > this._laterlMinSize) {
    					otherSizeRandom = util.getRandom(this._laterlMinSize, otherSizeRandom);
    					
    					if ((laterlLength - j) == 1) {
    						otherSizeRandom = this._laterlResArray[j].sideIndex;
    					}
    					if (otherSizeRandom > firstSize) {
    						otherSizeString = this.getLaterlSize(otherSizeRandom);
    					}
    					if (otherSizeRandom == this._laterlResArray[j].sideIndex) {
							var otherGraphArray = {};
	    					otherGraphArray.sideRes = laterlGraphType[otherTypeIndex][otherSizeString];
	    					otherGraphArray.sideIndex = otherSizeRandom;
	    					this._laterlResArray.splice(j,0,otherGraphArray);
	    					break;
    					}
    				}else {
    					//cc.log(otherSizeRandom, this._laterlMinSize, this._laterlResArray[j].sideIndex);
    				}
    			};
    		};
    	}
    	 // cc.log(this._targetArray);
    	// cc.log(this._laterlResArray);
    	this._view.showLaterlView(this.roundUnit.laterlHeight, this._laterlResArray);
    	 
    },

    getlaterlTargetGraph: function () {
    	for (var i = 0; i < this._targetArray.length; i++) {
			var typeIndex = this._targetArray[i].graphIndex;
			var sizeString = this.getLaterlSize(this._targetArray[i].sizeIndex);
			this._laterlResArray[i] = {};
			this._laterlResArray[i].sideRes = laterlGraphType[typeIndex][sizeString];
			this._laterlResArray[i].sideIndex = this._targetArray[i].sizeIndex;
		};
    },

    getLaterlSize: function (sizeIndex) {
    	var sizeStr = '';
    	if (graphSize[sizeIndex] == 'large' || graphSize[sizeIndex] == 'more') {
    		sizeStr = 'large';
    	}else if (graphSize[sizeIndex] == 'middle' || graphSize[sizeIndex] == 'moderate') {
    		sizeStr = 'middle';
    	}else if (graphSize[sizeIndex] == 'small' || graphSize[sizeIndex] == 'less') {
    		sizeStr = 'small';
    	}
    	return sizeStr;
    },

    addTopGraph: function () {
    	for (var i = 0; i < this._chartNumber-1; i++) {
    		this.getInterfereAttr(i);
    	};
    	this.addTargetTopGraph();
    	this._view.showTopsView(this._chartNumber, this._topResArray);
    	// cc.log("this._targetArray", this._targetArray);
    	// cc.log("this._topResArray", this._topResArray);
    },

    getInterfereAttr: function (index) {
    	if (this.roundUnit.isEqualColor == 1) {
            var InterfereHeight;
            if (this._args.level <= 4) {
                InterfereHeight = util.getRandom(1, this._sizeCount);
            }else {
                InterfereHeight = this._targetArray.length;
            }
    		if (InterfereHeight == this._targetArray.length) {
    			var topAttrArray = [];
    			var topAttrArray = this.getTopViewAttr(InterfereHeight, false);
    			otherTopArray = this.judgeTypeEqual(InterfereHeight, topAttrArray);
    			this.getTopViewRes(otherTopArray, index);
    		}else {
    			var topAttrArray = this.getTopViewAttr(InterfereHeight, false);
    			this.getTopViewRes(topAttrArray, index);
    		}
    	}else if (this.roundUnit.isEqualColor == 2) {
    		var topAttrArray = [];
    		topAttrArray = this.getTypeEqualEMI();
    		// cc.log("topAttrArray", topAttrArray);
    		this.getTopViewRes(topAttrArray, index);
    	}
    },

    judgeTypeEqual: function (typeLength, obstructArray) {
    	var sureTypeArray = [];
    	sureTypeArray = obstructArray.concat();
    	var equal = 0;
    	for (var i = 0; i < typeLength; i++) {
    		for (var j = 0; j < typeLength; j++) {
    			if (obstructArray[i].graphIndex == this._targetArray[j].graphIndex) {
    				equal += 1;
    				break;
    			}
    		};
    	};
    	if (equal == typeLength) {
    		var changeIndex = util.getRandom(1, typeLength) - 1;

    		var otherTypeArray = [];
    		otherTypeArray = this._interfereArray.concat();
            var otherLength = otherTypeArray.length;
            if (otherLength > 0) {
                var addTypeIndex = util.getRandom(1, otherTypeArray.length) - 1;
                sureTypeArray[changeIndex].graphIndex = otherTypeArray[addTypeIndex];
            }else {
                var deleteTypeIndex = util.getRandom(1, sureTypeArray.length) - 1;
                sureTypeArray.splice(deleteTypeIndex,1);
            }
    		
    	}

    	return sureTypeArray;
    },

    getTypeEqualEMI: function () {
    	var topViewLength = this._targetArray.length;
    	var equalTypeEMI = this.getEMIAttr(topViewLength);
        var equalCount = 0;
        for (var i = 0; i < topViewLength; i++) {
        	if (equalTypeEMI[i].graphIndex == this._targetArray[i].graphIndex && equalTypeEMI[i].sizeIndex == this._targetArray[i].sizeIndex) {
    			equalCount += 1;
    		}
        };

    	if (equalCount == topViewLength) {
    		var changeWay = util.getRandom(1,2);
    		if (topViewLength == this._sizeCount) {
    			changeWay = 1;
    		}else if (topViewLength == 1) {
    			changeWay = 2;
    		}

    		//1：颜色换位 2：大小调整
    		if (changeWay == 1) {
    			var allTypeIndex = [];
    			for (var i = 0; i < topViewLength; i++) {
    				allTypeIndex.push(i);
    			};

    			for (var i = 0; i < (topViewLength - 2); i++) {
    				var randomIndex = util.getRandom(1, allTypeIndex.length) - 1;
    				allTypeIndex.splice(randomIndex, 1);
    			};

				var chooseType = equalTypeEMI[allTypeIndex[0]].graphIndex;
				equalTypeEMI[allTypeIndex[0]].graphIndex = equalTypeEMI[allTypeIndex[1]].graphIndex;
				equalTypeEMI[allTypeIndex[1]].graphIndex = chooseType;

    		}else if (changeWay == 2) {
    			this.changeSize(topViewLength, equalTypeEMI);
    		}
    	}

    	return equalTypeEMI;
    },

    getEMIAttr: function (topViewLength) {
    	var emiTypeArray = [];

    	for (var i = 0; i < topViewLength; i++) {
    		emiTypeArray[i] = {};
    		emiTypeArray[i].graphIndex = this._targetArray[i].graphIndex;
    	};
    	var emiSizeArray = [1,2,3,4,5,6];

    	var equalTypeEMI = [];

    	for (var i = 0; i < topViewLength; i++) {
    		var typeIndex = util.getRandom(1, emiTypeArray.length) - 1;
    		var typeEmi = emiTypeArray[typeIndex].graphIndex;
    		emiTypeArray.splice(typeIndex, 1);
    		var sizeIndex = util.getRandom(1, emiSizeArray.length) - 1;
    		var sizeEmi = emiSizeArray[sizeIndex];
    		emiSizeArray.splice(sizeIndex, 1);

    		equalTypeEMI[i] = {};
    		equalTypeEMI[i].graphIndex = typeEmi;
    		equalTypeEMI[i].sizeIndex = sizeEmi;
    	};

    	for (var i = 0; i < topViewLength-1; i++) {
        	for (var j = i+1; j < topViewLength; j++) {
        		if (equalTypeEMI[i].sizeIndex > equalTypeEMI[j].sizeIndex) {
        			var test = {};
        			test.graphIndex = equalTypeEMI[i].graphIndex;
        			test.sizeIndex = equalTypeEMI[i].sizeIndex;
        			equalTypeEMI[i].graphIndex = equalTypeEMI[j].graphIndex;
        			equalTypeEMI[i].sizeIndex = equalTypeEMI[j].sizeIndex;
        			equalTypeEMI[j].graphIndex = test.graphIndex;
        			equalTypeEMI[j].sizeIndex = test.sizeIndex;
        		}
        	};
        };

        return equalTypeEMI;
    },

    changeSize: function (groupCount, equalTypeEMI) {
    	var randomIndex = util.getRandom(1, groupCount) - 1;
    	var changeSize = equalTypeEMI[randomIndex].sizeIndex;
    	var sizeArray = [1,2,3,4,5,6];
    	var chooseCount = this._sizeCount - groupCount;
    	var chooseArray = [];

    	var maxSize;
    	if (randomIndex == 0) {
    		maxSize = changeSize;
    	}else {
    		maxSize = equalTypeEMI[randomIndex-1].sizeIndex;
    	}
    	for (var i = 0; i < this._sizeCount; i++) {
    		if (groupCount == 1 && sizeArray[i] != changeSize && chooseCount > 0) {
    			chooseArray.push(sizeArray[i]);
    			chooseCount -= 1;
    		}else if (sizeArray[i] > maxSize && sizeArray[i] != changeSize  && chooseCount > 0) {
				chooseArray.push(sizeArray[i]);
				chooseCount -= 1;
			}else if (chooseCount == 0) {
				break;
			}
		};
    	var randomChoose = util.getRandom(1, chooseCount)-1;
    	var disSize = chooseArray[randomChoose] - changeSize;
    	equalTypeEMI[randomIndex].sizeIndex = chooseArray[randomChoose];
    	for (var i = randomIndex+1; i < groupCount; i++) {
    		if (equalTypeEMI[i].sizeIndex <= equalTypeEMI[i-1].sizeIndex) {
    			equalTypeEMI[i].sizeIndex = equalTypeEMI[i].sizeIndex + disSize;
    		}
    	};
    },

    getTopViewRes: function (topViewAttr, index) {
    	this._topResArray[index] = [];
    	for (var i = 0; i < topViewAttr.length; i++) {
    		var chartTypeIndex = topViewAttr[i].graphIndex;
            var chartSizeKey = this.getLaterlSize(topViewAttr[i].sizeIndex)
            //var chartSizeKey = graphSize[sizeTag];
            //cc.log(chartTypeIndex, topGraphType);
            var chartRes = topGraphType[chartTypeIndex][chartSizeKey];
            this._topResArray[index][i] = {};
            this._topResArray[index][i].diskRes = chartRes;
            this._topResArray[index][i].sizeIndex = topViewAttr[i].sizeIndex;
    	};
    },

    addTargetTopGraph: function () {
    	var targetRes = [];
    	for (var i = 0; i < this._targetArray.length; i++) {
    		var chartTypeIndex = this._targetArray[i].graphIndex;
            var chartSizeKey = this.getLaterlSize(this._targetArray[i].sizeIndex)
            //var chartSizeKey = graphSize[sizeTag];

            var chartRes = topGraphType[chartTypeIndex][chartSizeKey];
            targetRes[i] = {};
            targetRes[i].diskRes = chartRes;
            targetRes[i].sizeIndex = this._targetArray[i].sizeIndex;
    	};

        var nowTime = new Date();
        var randomTarget = nowTime.getMilliseconds()%(this._topResArray.length+1);
    	this._topResArray.splice(randomTarget,0,targetRes);
    	this._rightIndex = randomTarget;
    },

    judgeRightOrWrong: function (self, index) {
        if (self._isGuide && self._isAppoint == 2) {
            if (self._rightIndex != index) {
                self._view._isClick = true;
                return;
            }else {
                self.rightTip();
            } 
        }

    	var isRight = false;
        var delayTime = 2; 
    	if (self._rightIndex == index) {
    		isRight = true;
            delayTime = 1; 
    		self._rightNumber += 1;
            self.getStarNum();
    	}

    	self._view.showChooseSettle(isRight);

    	var delaySettle = cc.DelayTime.create(delayTime);
    	var callFunc = cc.CallFunc.create(function () {
    		self._view.removeJudegTip();
    		self._view.setLaterlAndTopView();
    		self.setSettle(false);

            var action_this = self.getActionByTag(2);
            if(typeof(action_this) == 'object'){
                cc.director.getActionManager().removeAction(action_this);
            }
    	}, self);
    	var seqSettle = cc.Sequence.create(delaySettle, callFunc);
        seqSettle.setTag(2);
    	self.runAction(seqSettle);
    },

    setSettle: function (isTimeout) {
        
    	if (this._starNum == 3 || isTimeout == true) {
            this.unscheduleUpdate();
            if (this._isGuide) {
                this._view.setViewVisible(false);
                this.removeActions();
                this.goalTip();
                return;
            }
    		this.showSettle(false);
    	}else if ((this._roundIndex-1) < this._roundCount) {
    		//this._roundIndex += 1;
            this._isRoundNext = false;
            if (this._rightRound >= 0 && this._rightNumber == this._rightRound) {
                this._roundIndex += 1;
                this._isRoundNext = true;
            }
    		this._view._isClick = true;
    		this.runOneGame(this._isRoundNext);
    	} 
    },

    getStarNum: function () {
        if (this._rightNumber >= this.unit.starCondition[2]) {
            this._view._starsList[2].setTexture(res.game_star_small_02);
            this._starNum = 3;
        }else if (this._rightNumber >= this.unit.starCondition[1]) {
            this._view._starsList[1].setTexture(res.game_star_small_02);
            this._starNum = 2;
        }else if (this._rightNumber >= this.unit.starCondition[0]) {
            this._view._starsList[0].setTexture(res.game_star_small_02);
            this._starNum = 1;
        }

        var now_percent;
        var percentTage = this._view._loadingBar.getPercent();
        if (this._rightNumber <= this.unit.starCondition[0]) {
            now_percent = percentTage + 1 / (this.unit.starCondition[0]*3/2) * 100;
            if (this._rightNumber == 0) {
                now_percent = 0;
            }
        }else if (this._rightNumber <= this.unit.starCondition[1]) {
            var distanceStar = this.unit.starCondition[1] - this.unit.starCondition[0];
            now_percent = percentTage + 1 / (distanceStar*6) * 100;

        }else if (this._rightNumber <= this.unit.starCondition[2]) {
            var distanceStar = this.unit.starCondition[2] - this.unit.starCondition[1];
            now_percent = percentTage + 1 / (distanceStar*6) * 100;
        }else {
            now_percent = 100;
        }
        
        this._view._loadingBar.setPercent(now_percent);

        var size = cc.winSize;
        var scale = size.width / 750;
        var exper_width = this._view._exper_bg.getContentSize().width * scale;
        var zero_x = this._view._exper_bg.x - exper_width;

        this._view._zero.setString(this._rightNumber.toString());
        this._view._zero.setPositionX(zero_x + exper_width * now_percent/100);

    },

    showSettle: function () {
    	cc.log("game over");
    	this._view.setViewVisible(false);
        this.removeActions();
    	var args = {
            gameID:this._args.gameID,
            level:this._args.level,
            hasPassed:true,
            userId : this._args.userId,
            token : this._args.token,
            isGameTest : this._args.isTest,
            starsList : this._args.starsList,
        };

        if (this._starNum == 0) {
        	args.hasPassed = false;
        }

        args.starNum = this._starNum;
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

            self._viewSettle.showStar(self._starNum);
            var str = '答对'+self._rightNumber+'题';
            self._viewSettle.setResTipText(str);
            self.addChild(self._viewSettle);
        }
        var param = {
            gameID : this._args.gameID,
            level : this._args.level,
            starNum : this._starNum,
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
        this._args.delegate.recordStarNum(this._args.delegate,this._starNum);            
        args.delegate = this._args.delegate;
        this._viewSettle = new ViewSettle(args);
        if(this._args.delegate.IsLastTask(this._args.delegate) == true){
            this._viewSettle.showBtnSubmit();
        }
        this._viewSettle.setHandleAgain(this,this.handleAgain);
        this._viewSettle.setHandleNext(this._args.delegate,this._args.delegate.HandleNextGame);

        this._viewSettle.showStar(this._starNum);
        var str = '答对'+this._rightNumber+'题';
        this._viewSettle.setResTipText(str);
        this.addChild(this._viewSettle);
    },

    handleNext:function(self){
        self._args.timestampStart = parseInt(new Date().getTime());
        self._args.level += 1;  
        if(self._args.level > 30){
            self._args.level = 1;  
        };
        self._view._isClick = true;
        self._view.setLaterlAndTopView();
        self._view._progressBar.setPercentage(100);
        self.init(self._args.level);
    },

    handleAgain:function(self){
        self._view._isClick = true;
        self._view.setLaterlAndTopView();
        self._view._progressBar.setPercentage(100);
        self.init(self._args.level);
    },

    handlePurseEvent:function(self){
        self._isPauseGame = true;
        self._pauseClick = false;
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
        self._isPauseGame = false;
        cc.director.getActionManager().resumeTarget(self._view._progressBar);
        cc.director.getActionManager().resumeTarget(self);
    },

    handleRestart:function(self){
        cc.log('---handleRestart'); 
        cc.director.getActionManager().resumeTarget(self._view._progressBar);
        cc.director.getActionManager().resumeTarget(self);      
        self._viewGameSetting.removeFromParent(); 
        self._view.setLaterlAndTopView();
        self._view._progressBar.setPercentage(100);
        self.unscheduleUpdate();
        self.removeActions();
        self.stopAllActions();
        self._view._isClick = true;

        if (self._isGuide) {
            self._isAppoint = 1;
            self.guide.removeFromParent(true);
            self.guide = null;
            self.sureGuide();
        }else {
            self.init(self._args.level);
        }  
    },

    update:function(dt){
        if(this._isPauseGame == false){
            this._runGameTime += dt;
            if(this._runGameTime > this._countDown){
                this._isPauseGame = true;
                this._view.removeJudegTip();
                this._view.setLaterlAndTopView();
                this.setSettle(true);
            }
        }
    },

    removeActions: function () {
        var action_progress = this._view._progressBar.getActionByTag(this.ACTION_TIME_PROGRESS);
        if(typeof(action_progress) == 'object'){
            cc.director.getActionManager().removeAction(action_progress);
        }
    },

    onExit: function () {
        this._view._progressBar.stopAllActions();
        this.stopAllActions();
        // cc.director.getActionManager().removeAllActions();
    	this._targetArray = null;
    	this._interfereArray = null;
    	this._laterlResArray = null;
    	this._topResArray = null;
    	this._view.removeGame();
    	// this.removeFromParent(true);
        this._super();
    },
});