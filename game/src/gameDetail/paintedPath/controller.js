
var PaintedPath = cc.Layer.extend({
	ACTION_TIME_PROGRESS:1,
	_args:null,
	_canvasX:null,
	_canvasY:null,
	_colors:null,
	_curDrag:null,
	_dragList:null,
	_grid:null,
	_simCellGrid:null,
	_pathNullList:null,
	_pathWhiteList:null,
	_isLastPath:null,
	_isOtherFlag:null,
	_colorPoints:null,
	_arrows:null,
	_plusMods:null,
	_minusMods:null,
	_ends:null,
	_colorPath:null,
	_pathsList:null,
	_nowGrid:null,
	_roundIndex:null,
	_roundLevel:null,
	_roundCount:null,
	_cutDown:null,
	_isPauseGame:null,
	_runGameTime:null,
	_roundWin:null,
	_pauseClick:null,
	ctor: function (args) {
		this._super();

		this._args = args;
        this._args.timestampStart = parseInt(new Date().getTime());
        this._args.delegate = args.delegate || false;

        this._args.isLearnTest = args.isLearnTest || false;
        this._args.isFirstTest = args.isFirstTest || false;
        this._args.delegateLearnTest = args.delegateLearnTest || false;

		this._view = new PaintedPathView(args.bg_color);
		this.addChild(this._view);
		this._view._topView.setHandlePause(this,this.handlePurseEvent);

		this._pauseClick = false;

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
            this._showbackTip = false;
            this._isAppoint = 1;
            this._view._progressBar.setVisible(false);
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
        this._view.guideVisible(false);
        this.dTime = this.beginGuide();
        this.goalTip();
    },

    beginGuide: function () {
		this._view.setGridHandle(this, this.setDragClick);
        this.setTipArray(GAME_GUIDE_TIP[this._args.gameID].guideTip[0], true, 0);
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
            this._view.guideVisible(true);
            this.init(this.guideLevel);
            this.setTipArray(GAME_GUIDE_TIP[this._args.gameID].guideTip[1], false, 4);
            this.guide.init(this._guideArray);
	        this.guide.x = this._view.width*0.5 - this.guide.width*0.5;
	        this.guide.y = this._view.centerBg.y + this._view.centerBg.height*0.5 + 20;
	        this._view._topView._btn_pause.setTouchEnabled(false);
        }, this);
        this.runAction(cc.Sequence.create(delay, call));
    },

    setRoundTip: function (roundId) {
    	this.guide.removeTip();
    	var delay = cc.DelayTime.create(0.2);
        var call = cc.CallFunc.create(function () {
	        this.setTipArray(GAME_GUIDE_TIP[this._args.gameID].guideTip[roundId], false, 4);
	        this.guide.init(this._guideArray);
	        this.guide.x = this._view.width*0.5 - this.guide.width*0.5;
	        this.guide.y = this._view.centerBg.y + this._view.centerBg.height*0.5 + 20;
	        this._showbackTip = true;
        }, this);
    	this.runAction(cc.Sequence.create(delay, call));
    },

    setClipping: function () {
    	this.guide.removeClipping();
    	var ccp1 = cc.p(this._view.centerBg.x - this._view.centerBg.width*0.5, this._view.centerBg.y - this._view.centerBg.height*0.5);
    	var ccp2 = cc.p(this._view.centerBg.x + this._view.centerBg.width*0.5, this._view.centerBg.y + this._view.centerBg.height*0.5);
    	var rectCCP = [ccp1, ccp2];
        this.guide.addClipping(this._view, rectCCP, 1);
    },

    setBackTip: function () {
    	this.guide.removeTip();
	    this._view.guideVisible(true);
	    this.setTipArray(GAME_GUIDE_TIP[this._args.gameID].guideTip[4], false, 4);
	    this.guide.init(this._guideArray);
    },

    setHandPosList: function () {
    	this._posList = new Array();
    	var path = this._dragList[0].getIdealPath();
    	for (var i = 0; i < path.length; i++) {
    		var cell = this._grid[path[i].getPos().getY()][path[i].getPos().getX()];
    		var pos = cc.p(cell.x+cell.width*0.5, cell.y+cell.height*0.5);
    		this._posList[i] = pos;
    	};
    },

    removePosList: function () {
    	var posLength = this._posList.length;
    	for (var i = 0; i < posLength; i++) {
    		this._posList[i] = null;
    	};
    	this._posList.splice(0, posLength);
    	this._posList = null;
    },

    setDragClick: function (self, isBlocked) {
    	for (var i = 0; i < self._dragList.length; i++) {
    		var cell = self._grid[self._dragList[i].getPos().getY()][self._dragList[i].getPos().getX()];
    		cell.setBlocked(isBlocked);
    	};
    },

    showPlaying: function () {
    	switch (this._isAppoint) {
    		case 1: 
    			this._view.setGuideArraw();
    			this._view.setGuideHand(this._posList);
    			this._isAppoint = 2;
    		 	break;
    		case 2:
    			this._view.setGuideHand(this._posList);
    			this._isAppoint = 3;
    			break;
    		case 3:
    			this._view._topView._btn_pause.setTouchEnabled(true);
    			this.guide.removeClipping();
    			break;
    	}
    },

    guideSettle: function () {
    	if (this.guide) {
    		this.guide.removeTip();
    		this.guide.removeFromParent(true);
            this.guide = null;
    	}
    	
    	this.stopAllActions();
        this._isAppoint = 1;
        this._showbackTip = false;

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


	init: function (level) {
		// if (this._isGuide || (this._args.isFirstTest == false && this._args.isLearnTest == false)) {
  //           this.unit = dict_pp_level[level];
  //       }
		this.unit = dict_pp_level[level];
		this._roundIndex = 1;
		this._roundLevel = 1;
		this._roundWin = 0;
		this._roundCount = this.unit.round_id_list.length;

		this._view._topView.createPassProgress(this._roundCount);
		if (this._isGuide) {
			this._view._topView.hideParallelPic();
		}

		this.runOneGame();
	},

	runOneGame: function () {

		var roundKey = this.unit.round_id_list[this._roundIndex-1];
		var roundData = dict_pp_level_round[roundKey];
		this._grid = new Array();
		this._simCellGrid = new Array();
		this._dragList = new Array();
		this._canvasX = roundData.canvas_x;
		this._canvasY = roundData.canvas_y;
		this._colors = roundData.colors;
		this._colorPoints = roundData.points;
		this._arrows = roundData.arrows;
		this._plusMods = roundData.plus_mods;
		this._minusMods = roundData.minus_mods;
		this._ends = roundData.ends;
		this._cutDown = roundData.countDown;

		this._pathNullList = new Array();
		this._pathWhiteList = new Array();
		this._isLastPath = false;
		this._isOtherFlag = false;
		this._colorPath = new Array();
		this._pathsList = new Array();

		this._isPauseGame = false;
		this._runGameTime = 0;
		
		this.generateGrid();//生成矩阵
        this.generateSimCellGrid();//生成cell
        this.generateSimDraggables();//生成path

        if (!this._isGuide) {
        	this.scheduleUpdate();
        }
    	
		this._view._topView.setProgressState(this._roundLevel-1,this._view._topView._CURRENT);
		this._view._progressBar.setPercentage(100);
		var action = cc.progressTo(this._cutDown, 0);
		action.setTag(this.ACTION_TIME_PROGRESS);
        this._view._progressBar.runAction(action);

    	this.createStartingGrid();//创建开始点
        this.getBalkGrid();//灰格子
        this.getEndsGrid();//fork
        this.getColorPoints(this._colorPoints);//point
        this.getDirectionArrow(this._arrows);//arrow
        this.getPlusMods(this._plusMods);//add
        this.getMinusMods(this._minusMods);//sub
        this.initStartValue();
        
        if (this._isGuide && this._isAppoint <= 3) {
        	if (this._isAppoint < 3) {
        		this.setDragClick(this, false);
        		this.setHandPosList();
        	}
        	this.showPlaying();
        }
	},

	generateGrid: function () {
		var size = cc.winSize;
        var scale = size.width / 750;

        //设置背景的大小
        var whiteGrid = new GridCell();
        this._view.centerBg.width = whiteGrid.width * this._canvasX + 50;
        this._view.centerBg.height = whiteGrid.height *  this._canvasY + 50; 

        if (this._isGuide && this._isAppoint < 3) {
        	this.setClipping();
        }

		var gridTemp = new Array();
		for (var i = 0; i < this._canvasY; i++) {
			var rowTemp = new Array();
			for (var j = 0; j < this._canvasX; j++) {
				var whiteGrid = new GridCell();
				whiteGrid.attr({
					anchorX:0,
    				anchorY:0,
					x:25 + whiteGrid.width * j, 
					y:25 + whiteGrid.height * i + 1,
				});
				this._view.centerBg.addChild(whiteGrid);
				whiteGrid.setPos(new Point(j,i));
				whiteGrid.setBeganHandle(this, this.beganClickEvent);
				whiteGrid.setMovedHandle(this, this.movedClickEvent);
				whiteGrid.setEndedHandle(this, this.judgeSettle);
				rowTemp.push(whiteGrid);
			};
			gridTemp.push(rowTemp);
		};
		this._grid = gridTemp;
		
	},

	generateSimCellGrid: function () {
		var simCellGridTemp = new Array();
		for (var i = 0; i < this._canvasY; i++) {
			for (var j = 0; j < this._canvasX; j++) {
				simCellGridTemp.push(SimCell.createForPos(new Point(j,i)));
			};
		};
		this._simCellGrid = simCellGridTemp;
	},

	generateSimDraggables: function () {
		var i = 0;
		while (i < this._colors) {
			var maxPoints = this.getMaxPoints();

			var dragPos = this.getSpawnPoint();
			if (this._isGuide && this._isAppoint == 1) {
				dragPos = new Point(this._simCellGrid[2].getPos().getX(), this._simCellGrid[2].getPos().getY());
			}
			if (dragPos != null) {
				var drag = this.getCellByPosition(dragPos.getX(), dragPos.getY());
				drag.setBlocked(true);
				drag.getIdealPath().push(new SimPath(dragPos, drag));
				this._dragList.push(drag);
				
				this._isOtherFlag = false;
				this.generatePathFor(drag, maxPoints);
				this._pathNullList = [];
				this._pathWhiteList = [];
				i++;
			}else {
				return;
			}
		}

		// for (var j = 0; j < this._dragList.length; j++) {
		// 	cc.log(this._dragList[j].getIdealPath());
		// };
	},

	generatePathFor: function (drag, maxPoints) {
		this._curDrag = drag;
		var dragPath = maxPoints;
		var pathArray = drag.getIdealPath();
		var curPos = pathArray[pathArray.length - 1].getPos();
		while (maxPoints > 0) {
			for (var i = 0; i < 4; i++) {
				var arr;
				if (i <= 1) {
					arr = this.getNeighborsWithValue(curPos, i);
				}else {
					arr = this.getWhiteSpaceNeighbors(curPos);
				}
				if (arr.length != 0) {
					var cellToMove;
					if (i > 1) {
						cellToMove = this.getVaildCell(arr);
					}else if (i != 0 || drag.getIdealPath().length != 1) {
						var arrIndex = util.getRandom(1, arr.length) - 1;
						cellToMove = arr[arrIndex];
					}
					if (cellToMove == null) {
						if (this._isOtherFlag != true) {
							// cc.log("null");
							this._pathNullList.push(drag);
							this.getOtherDrag(drag, dragPath);
						}
						return;
					}

					cellToMove.setBlocked(true);
					curPos = cellToMove.getPos();
					drag.getIdealPath().push(new SimPath(curPos, drag));
				}else if (i == 3) {
					var dragLength = drag.getIdealPath().length;
					if (this._isOtherFlag != true && this._isLastPath == true) {
						// cc.log(" shang white");
						if (1 <  dragLength && dragLength < dragPath) {
							this._pathWhiteList.push(drag);
							this.getOtherDrag(drag, dragPath);
						}else if (dragLength == 1) {
							this._pathNullList.push(drag);
							this.getOtherDrag(drag, dragPath);
						}
						
					}
					return;
				}
			};

			maxPoints--;
		}

		var dragLength = drag.getIdealPath().length;
		if (this._isOtherFlag != true && this._isLastPath == true) {
			// cc.log("xia white");
			if (1 <  dragLength && dragLength < dragPath) {
				this._pathWhiteList.push(drag);
				this.getOtherDrag(drag, dragPath);
			}else if (dragLength == 1) {
				this._pathNullList.push(drag);
				this.getOtherDrag(drag, dragPath);
			}
		}

	},

	getOtherDrag: function (delDrag, dragPath) {
		var delPath = delDrag.getIdealPath();
		for (var i = 0; i < delPath.length; i++) {
			var delCell = this.getCellByPosition(delPath[i].getPos().getX(), delPath[i].getPos().getY());
			delCell.setBlocked(false);
		};
		delDrag.getIdealPath().splice(0, delDrag.getIdealPath().length);
		this._dragList.pop();
		var whiteArr = this.getWhiteSpace();
		var waLength = whiteArr.length;
		if (waLength == 0) {
			return null;
		}
		for (var i = waLength; i >= 0; i--) {
			for (var j = 0; j < this._pathNullList.length; j++) {
				if (this._pathNullList[j] == whiteArr[i]) {
					whiteArr.splice(i,1);
				}
			};
			
		};

		waLength = whiteArr.length;
		for (var i = waLength; i >= 0; i--) {
			for (var j = 0; j < this._pathWhiteList.length; j++) {
				if (this._pathWhiteList[j] == whiteArr[i]) {
					whiteArr.splice(i,1);
				}
			};
		};

		if (whiteArr.length > 0) {
			var drag = this.againWhitePath(whiteArr);
			this._isOtherFlag = true;
			this.generatePathFor(drag, dragPath);

			// cc.log("not white", drag.getIdealPath().length, dragPath);

			var dLength = drag.getIdealPath().length;
			if ( 1 < dLength && dLength < dragPath) {
				this._pathWhiteList.push(drag);
				this.getOtherDrag(drag, dragPath);
			}else if (dLength == 1) {
				this._pathNullList.push(drag);
				this.getOtherDrag(drag, dragPath);
			}
		}else {
			if (this._pathWhiteList.length > 0) {
				var drag = this.againWhitePath(this._pathWhiteList);
				this._isLastPath = false;
				this._isOtherFlag = true;
				this.generatePathFor(drag, dragPath);
				
			}else if (this._pathNullList.length > 0) {
				this.againIntoPath(this._pathNullList);
			}
		}
		
	},

	againWhitePath: function (arr) {
		var random = util.getRandom(0, arr.length-1);
		var drag = arr[random];
		var dragPos = drag.getPos();
		drag.setBlocked(true);
		drag.getIdealPath().push(new SimPath(dragPos, drag));
		this._dragList.push(drag);

		return drag;
	},

	againIntoPath: function (arr) {
		this.updateGridValues();
		var maxValueDrag = arr[0];
		for (var i = 1; i < arr.length; i++) {
			if (arr[i].getValue() > maxValueDrag.getValue()) {
				maxValueDrag = arr[i];
			} 
		};
		
		var dragPos = maxValueDrag.getPos();
		
		maxValueDrag.setBlocked(true);
		maxValueDrag.getIdealPath().push(new SimPath(dragPos, maxValueDrag));
		this._dragList.push(maxValueDrag);

		this.getNullPath(maxValueDrag, dragPos);
	},

	getNullPath: function (drag, dragPos) {
		this.updateGridValues();
		var neighborArr = this.getWhiteSpaceNeighbors(dragPos);
		var neibors = neighborArr.length;
		if (neibors > 0) {
			var random = util.getRandom(0, neibors-1);
			var neiPos = neighborArr[random].getPos();
			neighborArr[random].setBlocked(true);
			drag.getIdealPath().push(new SimPath(neiPos, drag));
			this.getNullPath(drag, neiPos);
		}
	},

	getVaildCell: function (arr) {
		var arrCopy = new Array();
		arrCopy = arr.concat();
		var cell = null;
		while (arrCopy.length > 0) {
			var j = util.getRandom(1, arrCopy.length) - 1;
			cell = arr[j];
			arrCopy.splice(j,1);
			if (!this.hasTwoAsNeighbor(cell.getPos())) {
				return cell;
			}
		}
		return cell;
	},

	hasTwoAsNeighbor: function (targetPos) {
		return this.getNeighborsWithValue(targetPos, 2).length != 0;
	},

	getNeighborsWithValue: function (pos, val) {
		var arr = new Array();
		var ref = this.getNeighbors(pos);
		
		this.updateGridValues();

		for (var i = 0; i < ref.length; i++) {
			var cell = ref[i];
			if (cell.getValue() == val) {
				arr.push(cell);
			}
		};
		return arr;
	},

	getWhiteSpaceNeighbors: function (pos) {
		var arr = new Array();
		var ref = this.getNeighbors(pos);

		for (var i = 0; i < ref.length; i++) {
			var cell = ref[i];
			if (!cell.isBlocked()) {
				arr.push(cell);
			}
		};
		return arr;
	},

	getMaxPoints: function () {
		var max = Math.floor((this._canvasX * this._canvasY) / this._colors);
		var min = Math.floor(max / 2);
		return (Math.floor(Math.random()) % (max - min)) + min;
	},

	getSpawnPoint: function () {
		if (this.getWhiteSpace().length == 0) {
			return null;
		}

		for (var j = 2; j >= 1; j--) {
			var list = this.getWhiteSpaceWithValue(j);
			if (list.length > 0) {
				var listIndex = util.getRandom(1, list.length) - 1;
				var randomCell = list[listIndex];
				return new Point(randomCell.getPos().getX(), randomCell.getPos().getY());
			}
		};
		return null;
	},

	getWhiteSpaceWithValue: function (val) {
		var arr = new Array();
		var ref = this.getWhiteSpace();

		this.updateGridValues();

		for (var i = 0; i < ref.length; i++) {
			var wsCell = ref[i];
			if (wsCell.getValue() >= val) {
				arr.push(wsCell);
			}
		};
		return arr;
	},

	updateGridValues: function () {

		for (var i = 0; i < this._simCellGrid.length; i++) {
			var cell = this._simCellGrid[i];
			if (cell.isBlocked()) {
				cell.setValue(-1);
			}else {
				var val = 0;
				var neighborArray = this.getNeighbors(cell.getPos());
				for (var j = 0; j < neighborArray.length; j++) {
					if (!neighborArray[j].isBlocked()) {
						val++;
					}
				};
				cell.setValue(val);
			}
		};
	},

	getNeighbors: function (pos) {
		var arr = new Array();
		if (pos.getX() > 0) {
			arr.push(this.getCellByPosition(pos.getX() - 1, pos.getY()));
		}
		if (pos.getY() > 0) {
			arr.push(this.getCellByPosition(pos.getX(), pos.getY() - 1));
		}
		if (pos.getX() < this._canvasX - 1) {
			arr.push(this.getCellByPosition(pos.getX() + 1, pos.getY()));
		}
		if (pos.getY() < this._canvasY - 1) {
			arr.push(this.getCellByPosition(pos.getX(), pos.getY() + 1));
		}
		return arr;
	},

	getCellByPosition: function (x, y) {

		for (var i = 0; i < this._simCellGrid.length; i++) {
			var cell = this._simCellGrid[i];
			if (cell.getPos().getX() == x && cell.getPos().getY() == y) {
				return cell;
			}
		};
		return null;
	},
	
	getWhiteSpace: function () {
		var arr = new Array();

		for (var i = 0; i < this._simCellGrid.length; i++) {
			var simCell = this._simCellGrid[i];
			if (!simCell.isBlocked()) {
				arr.push(simCell);
			}
		};
		return arr;
	},

	createStartingGrid: function () {
		var colorArray = new Array();
		for (var i = 0; i < cellRes.length-1; i++) {
			colorArray.push(i);
		};

		for (var i = 0; i < this._dragList.length; i++) {
			this._pathsList[i] = new Array();

			var randomColor = util.getRandom(0, colorArray.length-1);
			// var gridRes = cellRes[colorArray[randomColor]];
			this._colorPath.push(colorArray[randomColor]);
			var pathMoveValue = this._dragList[i].getIdealPath().length - 1;
			var pathId = i+1;
			this._grid[this._dragList[i].getPos().getY()][this._dragList[i].getPos().getX()].setStartingGrid(colorArray[randomColor], pathMoveValue, pathId);
			this._grid[this._dragList[i].getPos().getY()][this._dragList[i].getPos().getX()].setGridColor(colorArray[randomColor]);
			colorArray.splice(randomColor, 1);

			this._pathsList[i].push(this._grid[this._dragList[i].getPos().getY()][this._dragList[i].getPos().getX()]);
		};	
	},

	getBalkGrid: function () {
		var balkArray = this.getWhiteSpace();
		//添加灰色格子
		for (var i = 0; i < balkArray.length; i++) {
			// var gridRes = cellRes[cellRes.length-1];
			this._grid[balkArray[i].getPos().getY()][balkArray[i].getPos().getX()].setBalkGrid(colorValue.length-1);
		};
	},

	getEndsGrid: function () {
		var pathIdArr = new Array();
		var dragPathL = this._dragList.length;
		for (var i = 0; i < dragPathL; i++) {
			pathIdArr.push(i);
		};
		
		if (this._ends > dragPathL) {
			this._ends = dragPathL;
		}
		for (var i = 0; i < this._ends; i++) {
			var random = util.getRandom(1, pathIdArr.length)-1;
			var pathId = pathIdArr[random];
			var dragPath = this._dragList[pathId].getIdealPath();
			var topPos = dragPath[dragPath.length-1].getPos();
			var endCell = this.getCellByPosition(topPos.getX(), topPos.getY());
			endCell.setFlagged(true);
			pathIdArr.splice(random,1);
			//添加x
			this._grid[endCell.getPos().getY()][endCell.getPos().getX()].setEndsGrid();

		};
	},

	getColorPoints: function (count) {
		var pointCount = count;
		var whiteFlag = 0;
		var dragPathL = this._dragList.length;
		for (var i = 0; i < dragPathL; i++) {

			var dragPath = this._dragList[i].getIdealPath();
			var flagArray = this.getFlagList(dragPath, dragPath.length);
			var flagCount = flagArray.length;
			
			var random;
			if (flagCount >= pointCount) {
				random = util.getRandom(0, pointCount);
			}else {
				random = util.getRandom(0, flagCount);
			}

			pointCount = pointCount - random;
			whiteFlag = whiteFlag + flagCount - random;

			for (var j = 0; j < random; j++) {
				var randomFlag = util.getRandom(1, flagArray.length)-1;
				var pointGridPos = flagArray[randomFlag];
				var chooseCell = this.getCellByPosition(pointGridPos.getX(), pointGridPos.getY());
				chooseCell.setFlagged(true);
				flagArray.splice(randomFlag, 1);
				//添加颜色圆点
				var pathId = i+1;
				this._grid[chooseCell.getPos().getY()][chooseCell.getPos().getX()].setColorPointGrid(pathId, this._colorPath[i]);

			};

			if (pointCount == 0) {
				break;
			}
		};

		if (pointCount > 0 && whiteFlag > 0) {
			if (whiteFlag >= pointCount) {
				this.getColorPoints(pointCount);
			}else if (whiteFlag < pointCount) {
				cc.log("配置ColorPoint太大!");
				return;
			}
			
		}
	},

	getDirectionArrow: function (count) {
		var arrowCount = count;
		var whiteFlag = 0;
		// cc.log('getDirectionArrow',this._colors, this._dragList);
		var dragPathL = this._dragList.length;
		for (var i = 0; i < dragPathL; i++) {

			var dragPath = this._dragList[i].getIdealPath();
			var flagArray = this.getFlagList(dragPath, dragPath.length-1);
			var flagCount = flagArray.length;

			var random;
			if (flagCount >= arrowCount) {
				random = util.getRandom(0, arrowCount);
			}else {
				random = util.getRandom(0, flagCount);
			}

			arrowCount = arrowCount - random;
			whiteFlag = whiteFlag + flagCount - random;

			for (var j = 0; j < random; j++) {
				var randomFlag = util.getRandom(1, flagArray.length)-1;
				var arrowGridPos = flagArray[randomFlag];
				var chooseCell = this.getCellByPosition(arrowGridPos.getX(), arrowGridPos.getY());
				chooseCell.setFlagged(true);
				flagArray.splice(randomFlag, 1);
				//添加方向箭头
				var direction = this.getDirection(dragPath, chooseCell);
				this._grid[chooseCell.getPos().getY()][chooseCell.getPos().getX()].setArrowGrid(direction);

			};

			if (arrowCount == 0) {
				break;
			}
		};

		if (arrowCount > 0 && whiteFlag > 0) {
			if (whiteFlag >= arrowCount) {
				this.getDirectionArrow(arrowCount);
			}else if (whiteFlag < arrowCount) {
				cc.log("配置DirectionArrow太大!");
				return;
			}
			
		}
	},

	getDirection: function (dragPath, nowCell) {
		var direction;
		for (var i = 0; i < dragPath.length; i++) {
			if (nowCell.getPos().getX() == dragPath[i].getPos().getX() && nowCell.getPos().getY() == dragPath[i].getPos().getY()) {
				if (dragPath[i+1].getPos().getX() - nowCell.getPos().getX() == 1) {
					direction = 4;
				}else if (dragPath[i+1].getPos().getX() - nowCell.getPos().getX() == -1) {
					direction = 3;
				}else if (dragPath[i+1].getPos().getY() - nowCell.getPos().getY() == 1) {
					direction = 1;
				}else if (dragPath[i+1].getPos().getY() - nowCell.getPos().getY() == -1) {
					direction = 2;
				}
				return direction;
			}
		};

		return null;
	},

	getPlusMods: function (count) {
		var plusCount = count;
		var whiteFlag = 0;
		var dragPathL = this._dragList.length;
		for (var i = 0; i < dragPathL; i++) {
			var dragPath = this._dragList[i].getIdealPath();
			var dragMoveLength = dragPath.length;
			var flagArray = this.getFlagList(dragPath, dragMoveLength-1);
			var flagCount = flagArray.length;

			var random;
			if (flagCount >= plusCount) {
				random = util.getRandom(0, plusCount);
			}else {
				random = util.getRandom(0, flagCount);
			}

			var allNum = 0;
			for (var j = 1; j < dragMoveLength-1; j++) {
				var cellValue = this._grid[dragPath[j].getPos().getY()][dragPath[j].getPos().getX()].getValue();
				allNum = allNum + cellValue;
			};

			plusCount = plusCount - random;
			whiteFlag = whiteFlag + flagCount - random;
			
			for (var j = 0; j < random; j++) {
				var randomFlag = util.getRandom(1, flagArray.length)-1;
				var plusGridPos = flagArray[randomFlag];
				var chooseCell = this.getCellByPosition(plusGridPos.getX(), plusGridPos.getY());
				//添加加数字
				var type = 'add';
				var number;
				var maxNum = (dragMoveLength-2) - allNum;
				var leaveCell = random - j;
				if (maxNum > leaveCell) {
					number = util.getRandom(1,2);
				}else if (maxNum == leaveCell || (maxNum > 0 && maxNum < leaveCell)) {
					number = 1;
				}else {
					plusCount = plusCount + leaveCell;
					var flag_len = flagArray.length;
					whiteFlag = whiteFlag + random - flagCount - flag_len;
					flagArray.splice(0, flag_len);
					break;
				}
				allNum = allNum + number;

				chooseCell.setFlagged(true);
				flagArray.splice(randomFlag, 1);
				
				this._grid[chooseCell.getPos().getY()][chooseCell.getPos().getX()].setOperationGrid(type, number);
			};

			if (plusCount == 0) {
				break;
			}
		};

		if (plusCount > 0 && whiteFlag > 0) {
			if (whiteFlag >= plusCount) {
				this.getPlusMods(plusCount);
			}else if (whiteFlag < plusCount) {
				cc.log("配置PlusMods太大!");
				return;
			}
			
		}
	},

	getMinusMods: function (count) {
		var minusCount = count;
		var whiteFlag = 0;
		var dragPathL = this._dragList.length;
		for (var i = 0; i < dragPathL; i++) {
			var dragPath = this._dragList[i].getIdealPath();
			var flagArray = this.getFlagList(dragPath, dragPath.length-1);
			var flagCount = flagArray.length;

			var random;
			if (flagCount >= minusCount) {
				random = util.getRandom(0, minusCount);
			}else {
				random = util.getRandom(0, flagCount);
			}

			minusCount = minusCount - random;
			whiteFlag = whiteFlag + flagCount - random;

			for (var j = 0; j < random; j++) {
				var randomFlag = util.getRandom(1, flagArray.length)-1;
				var minusGridPos = flagArray[randomFlag];
				var chooseCell = this.getCellByPosition(minusGridPos.getX(), minusGridPos.getY());
				chooseCell.setFlagged(true);
				flagArray.splice(randomFlag, 1);
				//添加减数字
				var type = 'sub';
				var number = util.getRandom(1,2);
				this._grid[chooseCell.getPos().getY()][chooseCell.getPos().getX()].setOperationGrid(type, number);

			};

			if (minusCount == 0) {
				break;
			}
		};

		if (minusCount > 0 && whiteFlag > 0) {
			if (whiteFlag >= minusCount) {
				this.getMinusMods(minusCount);
			}else if (whiteFlag < minusCount) {
				cc.log("配置MinusMods太大!");
				return;
			}
			
		}
	},

	initStartValue: function () {
		for (var i = 0; i < this._dragList.length; i++) {
			var path = this._dragList[i].getIdealPath();
			var p_length = path.length;
			var value = p_length-1;
			for (var j = 0; j < p_length; j++) {
				var operaValue = this._grid[path[j].getPos().getY()][path[j].getPos().getX()].getValue();
				value = value - operaValue;
			};
			
			this._grid[this._dragList[i].getPos().getY()][this._dragList[i].getPos().getX()].setPathValue(value);
		};

		this.adjustOperaPos();
	},

	adjustOperaPos: function () {
		for (var i = 0; i < this._dragList.length; i++) {
			this.operaPosFor(this._dragList[i]);
		};
	},

    operaPosFor: function (drag) {
		var subArr = new Array();
		for (var j = 0; j < 3; j++) {
			subArr[j] = [];
		};
		var addArr = new Array();
		var path = drag.getIdealPath();
		var p_length = path.length;
		var operaValue = this._grid[drag.getPos().getY()][drag.getPos().getX()].getPathValue();

		var dif = 0;
		var isSub = false;
		for (var j = 1; j < p_length; j++) {
			var pathGird = this._grid[path[j].getPos().getY()][path[j].getPos().getX()];
			operaValue = operaValue + pathGird.getValue() - 1;
			if (isSub == false && operaValue < (p_length - j - 1) && operaValue <= 0) {
				if (operaValue == 0) {
					if (pathGird.getValue() == 0) {
						subArr[0].push(pathGird);
					}else if (pathGird.getValue() == -1) {
						subArr[1].push(pathGird);
					}else if (pathGird.getValue() == -2) {
						subArr[2].push(pathGird);
					}
					dif = (p_length - j - 1) - operaValue;
				}else {
					operaValue = operaValue - pathGird.getValue() + 1;
					dif = Math.abs((p_length - j) - operaValue);
				}
				isSub = true;
				
			}else if (isSub == false) {
				if (pathGird.getValue() == 0) {
					subArr[0].push(pathGird);
				}else if (pathGird.getValue() == -1) {
					subArr[1].push(pathGird);
				}else if (pathGird.getValue() == -2) {
					subArr[2].push(pathGird);
				}
			}else if (isSub == true) {
				if (pathGird.getValue() > 0) {
					addArr.push(pathGird);
				}
			}
		};

		if (dif > 0 && addArr.length > 0) {
			var valueArr = this.changeOpera(path, addArr, subArr);
			dif = dif - Math.abs(valueArr.addValue - valueArr.subValue);
			if (dif > 0) {
				this.operaPosFor(drag);
			}
		}
	},

	changeOpera: function (path, addArr, subArr) {
		var randomAdd = util.getRandom(0, addArr.length-1);
		var subIndex = 0;
		if (addArr[randomAdd].getValue() == 1) {
			subIndex = 1;
		}else if (addArr[randomAdd].getValue() == 2) {
			subIndex = 2;
		}

		if (subArr[1].length == 0) {
			subIndex = 0;
			if (subArr[2].length > 0) {
				subIndex = 2;
			}
		}

		if (subArr[2].length == 0) {
			subIndex = 0;
			if (subArr[1].length > 0) {
				subIndex = 1;
			}
		}

		if (subIndex == 2 && addArr[randomAdd].getValue() != 2) {
			randomAdd = addArr.length-1;
			subIndex = 2;
		}

		var randomSub = util.getRandom(0, subArr[subIndex].length-1);
		// cc.log(subIndex, randomSub, subArr, addArr);
		var subValue = subArr[subIndex][randomSub].getValue();
		var addValue = addArr[randomAdd].getValue();
		
		if (subIndex == 0) {
			var subType = subArr[subIndex][randomSub].getType();
			var subPathId = subArr[subIndex][randomSub].getPathId();
			var subDirection = subArr[subIndex][randomSub].getDirection();
			subArr[subIndex][randomSub].setOperationGrid('add', addValue);
			subArr[subIndex][randomSub].setPathId(-1);
			subArr[subIndex][randomSub].setDirection(0);
			addArr[randomAdd].setType(subType);
			addArr[randomAdd].setValue(subValue);
			addArr[randomAdd].delOperaGrid();
			switch (subType) {
				case 0:
					addArr[randomAdd].setPathId(subPathId);
					addArr[randomAdd].setDirection(subDirection);
					break;
				case 2:
					subArr[subIndex][randomSub].delPointGrid();
					addArr[randomAdd].setDirection(subDirection);
					addArr[randomAdd].setColorPointGrid(subPathId, this._colorPath[subPathId-1]);
					break;
				case 3:
					subArr[subIndex][randomSub].delArrowGrid();
					addArr[randomAdd].setPathId(subPathId);
					var direction = this.getDirection(path, addArr[randomAdd]);
					addArr[randomAdd].setArrowGrid(direction);
					break;
			}

		}else {
			subArr[subIndex][randomSub].setValue(addValue);
			subArr[subIndex][randomSub].setOperaStr(addValue);
			addArr[randomAdd].setValue(subValue);
			addArr[randomAdd].setOperaStr(subValue);
		}

		return {addValue:addValue, subValue: subValue};
	},

	getFlagList: function (path, length) {
		var arr = new Array();
		for (var i = 1; i < length; i++) {
			var cell = this.getCellByPosition(path[i].getPos().getX(), path[i].getPos().getY());
			if (cell.getFlagged() == false) {
				arr.push(path[i].getPos());
			}
		};

		return arr;
	},

	beganClickEvent: function (self, cell) {
		self._nowGrid = cell;
		var path = self._pathsList[cell.getPathId()-1];
		var p_length = path.length;
		if (cell != path[p_length-1]) {
			var subValue = 0;
			var changeIndex = p_length;
			for (var i = 0; i < p_length; i++) {
				if (cell == path[i]) {
					changeIndex = i;
					continue;
				}
				if (i > changeIndex) {
					self.setGridsSideShow(path[i], true);
					if (path[i].getType() != 2) {
						path[i].setPathId(-1);
					}
					path[i].setBlocked(false);
					path[i].delGridColor(cc.color(255,255,255,0));
					if (path[i].getType() == 4) {
						path[i].setMoveOpera(false);
					}else if (path[i].getType() == 2) {
						path[i].setMovePoint(false);
					}else if (path[i].getType() == 1) {
						path[i].setMoveEnd(false);
					}else if (path[i].getType() == 3) {
						path[i].setMoveArrow(false);
					}
					path[i].delLine();
					var nowValue = (-1) * path[i].getValue() + 1;
					subValue = subValue + nowValue;
				}
			};
			if (changeIndex > 0) {
				// self._pathsList[cell.getPathId()-1][changeIndex].setMoveLine(lineRes[1]);
				var frontCell =  self._pathsList[cell.getPathId()-1][changeIndex-1];
				self._pathsList[cell.getPathId()-1][changeIndex].adjustLine2(lineRes[1], self.getMoveDirection(frontCell, self._pathsList[cell.getPathId()-1][changeIndex]));
			}
			self.setStartValue(subValue);
			var delCount = p_length - (changeIndex+1);
			self._pathsList[cell.getPathId()-1].splice(changeIndex+1, delCount);
		}
		
	},

	movedClickEvent: function (self, touch) {
		
		var neighborArr = self.getNeighborsGrid(self._nowGrid.getPos());

		for (var i = 0; i < neighborArr.length; i++) {
			var neighborRect = cc.rect(0,0, neighborArr[i].width, neighborArr[i].height);
        	var touchPoint = neighborArr[i].convertToNodeSpace(touch.getLocation());
        	if (cc.rectContainsPoint(neighborRect, touchPoint)) {
        		if (self._nowGrid.getType() != 3) {
        			if (self._nowGrid.getType() != 1) {
        				self.moveNextGrid(neighborArr[i]);
        			}else if (self._nowGrid.getType() == 1 && neighborArr[i].isBlocked()) {
						self.moveNextGrid(neighborArr[i]);
        			}
        			
        		}else {
        			switch (self._nowGrid.getDirection()) {
						case 1: 
							if (self._nowGrid.getPos().getY() - neighborArr[i].getPos().getY() == -1) {
								self.moveNextGrid(neighborArr[i]);
							}
							break;
						case 2: 
							if (self._nowGrid.getPos().getY() - neighborArr[i].getPos().getY() == 1) {
								self.moveNextGrid(neighborArr[i]);
							}
							break;
						case 3: 
							if (self._nowGrid.getPos().getX() - neighborArr[i].getPos().getX() == 1) {
								self.moveNextGrid(neighborArr[i]);
							}
							break;
						case 4: 
							if (self._nowGrid.getPos().getX() - neighborArr[i].getPos().getX() == -1) {
								self.moveNextGrid(neighborArr[i]);
							}
							break;
					}

					if (neighborArr[i].isBlocked()) {
						self.moveNextGrid(neighborArr[i]);
					}
        		}     		
        	}
		};

	},

	getNeighborsGrid: function (pos) {
		var arr = new Array();
		if (pos.getX() > 0) {
			arr.push(this.getGridByPosition(pos.getX() - 1, pos.getY()));
		}
		if (pos.getY() > 0) {
			arr.push(this.getGridByPosition(pos.getX(), pos.getY() - 1));
		}
		if (pos.getX() < this._canvasX - 1) {
			arr.push(this.getGridByPosition(pos.getX() + 1, pos.getY()));
		}
		if (pos.getY() < this._canvasY - 1) {
			arr.push(this.getGridByPosition(pos.getX(), pos.getY() + 1));
		}
		return arr;
	},

	getGridByPosition: function (x, y) {
		if (this._grid[y][x] != null) {
			return this._grid[y][x];
		}
		return null;
	},

	moveNextGrid: function (nextCell) {
		// cc.log(nextCell.getPathId(), this._nowGrid.getPathId());
		var pathIndex = this._nowGrid.getPathId()-1;
		var pathLength = this._pathsList[pathIndex].length;
		var startValue = this._grid[this._dragList[pathIndex].getPos().getY()][this._dragList[pathIndex].getPos().getX()].getPathValue();
		var nextValue = nextCell.getValue() - 1;
		var moveValue = startValue + nextValue;
		if (nextCell.getPathId() != -1 && nextCell.getPathId() == this._nowGrid.getPathId()) {
			var backCell =  this._pathsList[pathIndex][pathLength-2];
			if (startValue >= 0 && nextCell.isBlocked() && backCell == nextCell) {
				//倒退
				this.backPathBefore(pathIndex, pathLength, nextCell);
				
			}else if (startValue > 0 && moveValue >= 0 && !nextCell.isBlocked()) {
				//gridType == 2
				this.forWardTypeDire(pathIndex, pathLength, nextCell);
			}
			
		}else if (startValue > 0 && moveValue >= 0 && nextCell.getPathId() == -1 && !nextCell.isBlocked()) {
			this.forWardTypeOther(pathIndex, pathLength, nextCell);
		}
	},

	backPathBefore: function (pathIndex, pathLength, nextCell) {
		this._nowGrid.setBlocked(false);
		this._nowGrid.delGridColor(cc.color(255,255,255,0));
		this.setGridsSideShow(this._nowGrid, true);
		var nowValue = (-1) * this._nowGrid.getValue() + 1;
		this.setStartValue(nowValue);
		if (this._nowGrid.getType() != 2) {
			this._nowGrid.setPathId(-1);
		}
		if (this._nowGrid.getType() == 4) {
			this._nowGrid.setMoveOpera(false);
		}else if (this._nowGrid.getType() == 2) {
			this._nowGrid.setMovePoint(false);
		}else if (this._nowGrid.getType() == 1) {
			this._nowGrid.setMoveEnd(false);
		}else if (this._nowGrid.getType() == 3) {
			this._nowGrid.setMoveArrow(false);
		}
		if (pathLength > 2) {
			// nextCell.setMoveLine(lineRes[1]);
			var frontCell =  this._pathsList[pathIndex][pathLength-3];
			nextCell.adjustLine2(lineRes[1], this.getMoveDirection(frontCell, nextCell));
			
		}
		this._nowGrid.delLine();
		this._nowGrid = nextCell;
		this._pathsList[this._nowGrid.getPathId()-1].pop();
	},

	forWardTypeDire: function (pathIndex, pathLength, nextCell) {
		nextCell.setBlocked(true);
		nextCell.setGridColor(this._colorPath[nextCell.getPathId()-1]);
		this.setGridsSideShow(nextCell, false);
		nextCell.setMovePoint(true);
		nextCell.setMoveLine(lineRes[1]);
		var nextDirection = this.getMoveDirection(this._nowGrid, nextCell);
		nextCell.adjustLine2(lineRes[1], nextDirection);
		if (pathLength > 1) {
			var frontCell = this._pathsList[pathIndex][pathLength-2];
			var frontDirection = this.getMoveDirection(frontCell, this._nowGrid);
			if (frontDirection == nextDirection) {
				this._nowGrid.adjustLine1(lineRes[0], nextDirection);
			}else {
				var type = this.getMoveType(frontDirection, nextDirection);
				this._nowGrid.adjustLine3(lineRes[2],type);
			}
		}

		var nextValue = nextCell.getValue() - 1;
		this.setStartValue(nextValue);
		this._nowGrid = nextCell;
		this._pathsList[this._nowGrid.getPathId()-1].push(nextCell);
	},

	forWardTypeOther: function (pathIndex, pathLength, nextCell) {
		if (nextCell.getType() != 3 || nextCell.getDirection() != this.getMoveDirection(nextCell, this._nowGrid)) {
			nextCell.setBlocked(true);
			nextCell.setPathId(this._nowGrid.getPathId());
			nextCell.setGridColor(this._colorPath[nextCell.getPathId()-1]);
			if (nextCell.getType() == 4) {
				nextCell.setMoveOpera(true, this._colorPath[nextCell.getPathId()-1]);
			}else if (nextCell.getType() == 1) {
				nextCell.setMoveEnd(true);
			}else if (nextCell.getType() == 3) {
				nextCell.setMoveArrow(true);
			}
			this.setGridsSideShow(nextCell, false);
			nextCell.setMoveLine(lineRes[1]);
			var nextDirection = this.getMoveDirection(this._nowGrid, nextCell);
			nextCell.adjustLine2(lineRes[1], nextDirection);
			if (pathLength > 1) {
				var frontCell = this._pathsList[pathIndex][pathLength-2];
				var frontDirection = this.getMoveDirection(frontCell, this._nowGrid);
				if (frontDirection == nextDirection) {
					this._nowGrid.adjustLine1(lineRes[0], nextDirection);
				}else {
					var type = this.getMoveType(frontDirection, nextDirection);
					this._nowGrid.adjustLine3(lineRes[2],type);
				}
			}
			
			var nextValue = nextCell.getValue() - 1;
			this.setStartValue(nextValue);
			this._nowGrid = nextCell;
			this._pathsList[this._nowGrid.getPathId()-1].push(nextCell);
		}
	},

	getMoveDirection: function (nowCell, nextCell) {
		var direction;
		if (nowCell.getPos().getX() - nextCell.getPos().getX() == 1) {
			direction = 3;
		}else if (nowCell.getPos().getX() - nextCell.getPos().getX() == -1) {
			direction = 4;
		}else if (nowCell.getPos().getY() - nextCell.getPos().getY() == 1) {
			direction = 2;
		}else if (nowCell.getPos().getY() - nextCell.getPos().getY() == -1) {
			direction = 1;
		}
		return direction;
	},

	setGridsSideShow: function (cell, isShow) {
		var neighborArr = this.getNeighborsGrid(cell.getPos());
		for (var i = 0; i < neighborArr.length; i++) {
			if (neighborArr[i].isBlocked() && neighborArr[i].getPathId() == cell.getPathId()) {
				cell.setSideVisible(this.getMoveDirection(cell, neighborArr[i]), isShow);
				neighborArr[i].setSideVisible(this.getMoveDirection(neighborArr[i], cell), isShow);
			}
		};
	},
	
	getMoveType: function (direction1, direction2) {
		var moveType;
		if ((direction1 == 3 && direction2 == 1) || (direction1 == 2 && direction2 == 4)) {
			moveType = 1;
		}else if ((direction1 == 4 && direction2 == 1) || (direction1 == 2 && direction2 == 3)) {
			moveType = 2;
		}else if ((direction1 == 1 && direction2 == 4) || (direction1 == 3 && direction2 == 2)) {
			moveType = 3;
		}else if ((direction1 == 4 && direction2 == 2) || (direction1 == 1 && direction2 == 3)) {
			moveType = 4;
		}
		return moveType;
	},

	setStartValue: function (addValue) {
		var value = this._grid[this._dragList[this._nowGrid.getPathId() - 1].getPos().getY()][this._dragList[this._nowGrid.getPathId() - 1].getPos().getX()].getPathValue() + addValue;
		this._grid[this._dragList[this._nowGrid.getPathId() - 1].getPos().getY()][this._dragList[this._nowGrid.getPathId() - 1].getPos().getX()].setPathValue(value);
	},

	judgeSettle: function (self) {

		if (self._isGuide && self._showbackTip) {
			self._showbackTip = false;
			self.setBackTip();
		}


		var isSuccess = true;
		for (var i = 0; i < self._canvasY; i++) {
			for (var j = 0; j < self._canvasX; j++) {
				var grid = self._grid[i][j];
				if (!grid.isBlocked()) {
					isSuccess = false;
					break;
				}
			};
		};

		if (isSuccess) {
			// self.unscheduleUpdate(self);
			self.unscheduleUpdate();
			self.setSettle(false);
		}
	},

	setSettle: function (isTimeout) {
		if (isTimeout == false){
            this._roundWin += 1;
            this._view._topView.setProgressState(this._roundLevel-1,this._view._topView._RIGHT);
            this._roundIndex += 1;
        }else{
            this._view._topView.setProgressState(this._roundLevel-1,this._view._topView._WRONG);
        }
		this._roundLevel += 1;
		this.delArray();
		if (this._roundLevel > this._roundCount) {
			if (this._isGuide) {
				this.guideSettle();
			}else {
				this.gotoSettle();
			}
			
		}else {
			if (this._isGuide) {
				this.setRoundTip(this._roundIndex);
				if (this._isAppoint < 3) {
					this.removePosList();
				}
			}
			this.runOneGame();
		}
	},

	gotoSettle: function () {
		cc.log("game over");
    	// this._view.setViewVisible(false);

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
        if (this._roundWin >= 5) {
        	starNum = 3;
        }else if (this._roundWin >= 4) {
        	starNum = 2;
        }else if (this._roundWin >= 3) {
        	starNum = 1;
        }else {
        	starNum = 0;
        }

        if (starNum == 0) {
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
            var str = self._roundWin.toString() + '/5'+'正确';
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
        var str = this._roundWin.toString() + '/5'+'正确';
        this._viewSettle.setResTipText(str);
        this.addChild(this._viewSettle);
    },

	handleNext:function(self){
        self._args.timestampStart = parseInt(new Date().getTime());
        self._args.level += 1;  
        if(self._args.level > 30){
            self._args.level = 1;  
        };
        self.init(self._args.level);
    },

    handleAgain:function(self){
        self.init(self._args.level);
    },

	handlePurseEvent:function(self){
        self._isPauseGame = true;
        cc.director.getActionManager().pauseTarget(self._view._progressBar);
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


        if (self._pauseClick == false) {
            self._pauseClick = true;
            self._pauseClick = false;
            self._viewGameSetting = new GameSetting(args);
            if (self._isGuide) {
	            self._viewGameSetting.setGuideHelp();
	        }
	        self.addChild(self._viewGameSetting);
	        self._viewGameSetting.setHandle(self,self.handleContinue,self.handleRestart); 
        }

        
    },

    handleContinue:function(self){
        cc.log('---handleContinue');
        self._viewGameSetting.removeFromParent();
        self._isPauseGame = false;
        cc.director.getActionManager().resumeTarget(self._view._progressBar);
        if (self._isGuide) {
        	cc.director.getActionManager().resumeTarget(self);
        }
        
    },

    handleRestart:function(self){
        cc.log('---handleRestart');       
        cc.director.getActionManager().resumeTarget(self._view._progressBar);
        if (self._isGuide) {
        	cc.director.getActionManager().resumeTarget(self);
        }
        self._viewGameSetting.removeFromParent(); 
        // self._view._progressBar.setPercentage(100);
        self.unscheduleUpdate();
        self.delArray();
        self.stopAllActions();
        
        if (self._isGuide) {
            self._isAppoint = 1;
            self._showbackTip = false;
            self.guide.removeFromParent(true);
            self.guide = null;
            self.sureGuide();
        }else {
            self.init(self._args.level);
        }  
    },

	update: function (dt) {
		if(this._isPauseGame == false){
            this._runGameTime += dt;
            if(this._runGameTime > this._cutDown){
            	// this.unscheduleUpdate(this);
            	this.unscheduleUpdate();
                this._isPauseGame = true;
                this.setSettle(true);
            }
        }
	},

	delArray: function () {
		for (var i = this._canvasY-1; i >= 0; i--) {
			for (var j = this._canvasX-1; j >= 0; j--) {
				this._grid[i][j].removeAllChildren(true);
				this._grid[i][j].removeFromParent(true);
				this._grid[i].splice(j,1);
			};
			this._grid.splice(i,1);
		};
		this._grid = null;

		for (var i = this._simCellGrid.length-1; i >= 0; i--) {
			// this._simCellGrid[i].removeAllChildren(true);
			// this._simCellGrid[i].removeFromParent(true);
			this._simCellGrid.pop();
		};
		this._simCellGrid = null;
		
		this._pathsList.splice(i,this._pathsList.length);
		this._pathsList = null;
		
		this._pathNullList.splice(i,this._pathNullList.length);
		this._pathNullList = null;
		
		this._pathWhiteList.splice(i,this._pathWhiteList.length);
		this._pathWhiteList = null;
		
		

		this._dragList.splice(i,this._dragList.length);
		this._dragList = null;

		this._colorPath.splice(i,this._colorPath.length);
		this._colorPath = null;

		var action = this._view._progressBar.getActionByTag(this.ACTION_TIME_PROGRESS);
        if(typeof(action) == 'object'){
            cc.director.getActionManager().removeAction(action);
        }
	},

    onExit: function () {
    	if (this._grid != null) {
    		this.delArray();
    	}
    	this._super();
    },
});