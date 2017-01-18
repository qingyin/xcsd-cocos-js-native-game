var SeabedWorld = cc.Layer.extend({
	_fish_number:null,
	_goal_color:null,
	_goal_icon:null,
	_goal_number:null,
	_speed:null,
	_isEqual:null,
    _col:null,
    _remainCount:null,
    _posX:null,
    _fish_swim_time:null,
    _goal_count:null,
    _isShowFish1:null,
    _isShowFish2:null,
    _isShowFish3:null,
    _isShowFish4:null,
    _isChange:null,
    _way:null,
    _goalFishId:null,
    _stopSchedule:null,
    ctor: function (args) {
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
        this._args.delegateLearnTest = args.delegateLearnTest || false;
        this._view = new WorldView(args.bg_color);
        this._view.handleGuide(this, this.guideClick);
        this.addChild(this._view);     

        this._isPause = false;
        var self = this;
        this._view._purseBtn.addClickEventListener(function(){
            if (self._isPause == false) {
                self._isPause = true;
                self.handlePurseEvent(self);
            }
        });

        this._stopSchedule = false;

        this._isGuide = args.isGuide || false;
        if (args.hasGuide == "true") {
            this._hasGuide = true;
        }else {
            this._hasGuide = false;
            this._args.timestampStart = parseInt(new Date().getTime());
        }
        if ((this._args.delegate == false && util.getArrycount(gameData.data[this._args.gameID].starsList) == 0 && gameData.testEditionGuide(this._args.level)) || (this._isGuide == true) || (this._hasGuide == true)) {
            //新手引导
            this._firstGoalFish = null;
            this._guideArray = new Array();
            this._isAppoint = 1;
            this.sureGuide(0);
        }else {
            this.runOneGame(this._args.level);
        }

        
        return true;
    },

    runOneGame:function(level){
        this._view._beginAddOneFlag = false;
        if (this._isGuide || this._args.isLearnTest == false) {
            this.unit = dict_sw_level[level];
        }else if (this._args.isLearnTest == true) {
            this.unit = test_sm_level[level];
        }

        this._fish_number = util.getRandom(this.unit.fish_count.minCount, this.unit.fish_count.maxCount);
        this.settle_fish_number = this._fish_number;
        this._goal_number = 0;
        
        this.numberNature = new Array();
        this.ftime_Array = new Array();
        this.fish_type = new Array();
        this._way = new Array();

        this._groupFishArray = new Array();
        this._groupTypeArray = new Array(); 

        this._view._touchCount = 0;
        this._view._gn_width = 0;
        this._view.getTouchCount(0);
        this._view.setAllNodeVisible(true);

        this._view.select_fish.setVisible(false);
        this._view.fishbowl.setVisible(false);
        this._view.obstacle_left.x = 0;
        this._view.obstacle_left.y = 150;
        this._view.obstacle_right.x = cc.winSize.width;
        this._view.obstacle_right.y = 150;

        this.chooseChannal();

        var goalIndex = this.selectFishType();
        //this.scheduleUpdate();
        this._view.setGoalFish(dict_sm_elememt[this._goal_color][this._goal_icon].res);        
        var start_time = this.startGame(goalIndex);        
        this.scheduleOnce(this.init, start_time);
    },
    chooseChannal: function () {
        switch (this.unit.channal_count) {
            case 1:
                this._isShowFish1 = false;
                this._isOnlyFish1 = true;
                break;
            case 2:
                this._isShowFish1 = false;
                this._isShowFish2 = false;
                break;
            case 3:
                this._isShowFish1 = false;
                this._isShowFish2 = false;
                this._isShowFish3 = false;
                break;
            case 4:
                this._isShowFish1 = false;
                this._isShowFish2 = false;
                this._isShowFish3 = false;
                this._isShowFish4 = false;
                break;
            default:
                break;
        } 

        this.chooseFishDirection(this.unit.channal_count);
    },

    chooseFishDirection: function (chCount) {
        for (var i = 0; i < chCount; i++) {
            var direction = util.getRandom(1, 2);
            this._way[i] = direction;
        };
    },

    init: function () {
        this._view._beginAddOneFlag = true;
        if (this._isGuide) {
            this._view._beginAddOneFlag = false;
        }

        var apper_time = 0.5;
        this.apperFish = function () {

        	var random_channal = util.getRandom(1, this.unit.channal_count);
	    	switch (random_channal) {
	    		case 1:
	    		    this.initChannal1();
	    		    break;
	    		case 2:
	    		    this.initChannal2();
	    		    break;
	    		case 3:
	    		    this.initChannal3();
	    		    break;
	    		case 4:
	    		    this.initChannal4();
	    		    break;
	    		default:
	    		    break;
	    	}
	    	this.scheduleOnce(this.initMoreChannal, apper_time);
        }
        
        this.scheduleOnce(this.apperFish, apper_time);       
    },

    initMoreChannal:function () {

        this.showCFish = function () {
         
            var showTime = util.getRandom(5, 10) * 0.1;

            if (this._isShowFish1 == false || this._isShowFish2 == false || this._isShowFish3 == false || this._isShowFish4 == false) {
                var channalArray = [];
                if (this._isShowFish1 == false) {
                    channalArray.push(1);
                }
                if (this._isShowFish2 == false) {
                    channalArray.push(2);
                }
                if (this._isShowFish3 == false) {
                    channalArray.push(3);
                }
                if (this._isShowFish4 == false) {
                    channalArray.push(4);
                }

                var channalCount = channalArray.length;
                var indexRandom;
                var channal;
                if (channalCount > 0) {
                    indexRandom = util.getRandom(1, channalCount)-1;
                    channal = channalArray[indexRandom];
                    switch (channal) {
                        case 1:
                            this._isShowFish1 = true;
                            break;
                        case 2:
                            this._isShowFish2 = true;
                            break;
                        case 3:
                            this._isShowFish3 = true;
                            break;
                        case 4:
                            this._isShowFish4 = true;
                            break;
                        default:
                            break;
                    }
                }else {
                    channal = 0;
                    showTime = 0;
                }

                
                this.showGame = function () {
                    switch (channal) {
                        case 1:
                            this.initChannal1();
                            break;
                        case 2:
                            this.initChannal2();
                            break;
                        case 3:
                            this.initChannal3();
                            break;
                        case 4:
                            this.initChannal4();
                            break;
                        default:
                            break;
                    }
                    channalArray.splice(0, channalCount);
                    
                }
                this.scheduleOnce(this.showGame, showTime); 
            }

            if (this._fish_number <= 0 && this._stopSchedule == false) {
                this._stopSchedule = true;
                this.unschedule(this.showCFish);
                return;
            }
        }

        this.schedule(this.showCFish, 1/60);
    },

    selectFishType: function (tCount) {
    	var color_array = [1,2,3,4,5];
    	
    	for (var i = 0; i < 5 - this.unit.fish_type.color_type; i++) {
            var color_index = util.getRandom(1, color_array.length) - 1;
            color_array.splice(color_index, 1);
        }; 

        var icon_array = [1,2,3,4,5];
       
        for (var i = 0; i < 5 - this.unit.fish_type.pic_type; i++) {
            var icon_index = util.getRandom(1, icon_array.length) - 1;
            icon_array.splice(icon_index, 1);
        }; 

        var type_array = new Array();
        var gap_color_icon = color_array.length - icon_array.length;
        for (var i = 0; i < color_array.length; i++) {
            for (var j = 0; j < icon_array.length; j++) {

                var type_index = i * (color_array.length - gap_color_icon) + j;
                type_array[type_index] = new Array();
                type_array[type_index][0] = color_array[i];
                type_array[type_index][1] = icon_array[j];
            };
        };

        this.sureFishType(type_array);

        var goal_random = util.getRandom(1, this.fish_type.length) - 1;
        this._goal_color = this.fish_type[goal_random][0];
        this._goal_icon = this.fish_type[goal_random][1]; 

        this._goalFishId = dict_sm_elememt[this._goal_color][this._goal_icon].id;

        return goal_random;
    },

    sureFishType: function (type_array) {
    	var typeArray = type_array.concat();
        
    	for (var i = 0; i < this.unit.fish_type.fish_type_count; i++) {
    		var type_index = util.getRandom(1, typeArray.length) - 1;
            
            this.fish_type[i] = new Array();
	        this.fish_type[i][0] = typeArray[type_index][0];
	        this.fish_type[i][1] = typeArray[type_index][1];

	        typeArray.splice(type_index, 1);
    	};
    },

    initChannal1: function () {

    	var size = cc.winSize;
        var scale = size.width / 750;

        if (this.unit.fish_direction_count.channal1 == 2) {
            this._way[0] = util.getRandom(1, 2);
        }
        this.numberNature.swim_direction = this._way[0];
        
	    var fish_count = util.getRandom(1, this.unit.show_fish_number);
	    var col_count = util.getRandom(1, this.unit.show_fish_height);

	    if (this._fish_number < fish_count) {
	    	fish_count = this._fish_number;
	    }

        this._isChange = false;
	    var change_random = util.getRandom(1, this.unit.fish_change_probability.denominator);
	    if (change_random <= this.unit.fish_change_probability.member) {
            fish_count = 1;
            col_count = 1;
            this._isChange = true;
	    }

        if (this._isGuide && this._isAppoint == 1) {
            fish_count = 1;
            col_count = 1;
        }

	    var channal_pos = this._view.obstacle_left.getContentSize().height / 4 + this._view.obstacle_left.y - 60;
        this._isShowFish1 = true;
	    var bfTime = this.showFish(channal_pos, fish_count, col_count);
	    
	    this.dTime1 = function () {
	    	this._isShowFish1 = false;
	    }
	    this.scheduleOnce(this.dTime1, bfTime);	   
    },

    initChannal2: function () {

    	var size = cc.winSize;
        var scale = size.width / 750;

        if (this.unit.fish_direction_count.channal2 == 2) {
            this._way[1] = util.getRandom(1, 2);
        }
        this.numberNature.swim_direction = this._way[1];
        
        var fish_count = util.getRandom(1, this.unit.show_fish_number);
        var col_count = util.getRandom(1, this.unit.show_fish_height);

	    if (this._fish_number < fish_count) {
	    	fish_count = this._fish_number;
	    }
        
        this._isChange = false;
	    var change_random = util.getRandom(1, this.unit.fish_change_probability.denominator);
	    if (change_random <= this.unit.fish_change_probability.member) {
            fish_count = 1;
            col_count = 1;
            this._isChange = true;
	    }

	    var channal_pos = this._view.obstacle_left.y + this._view.obstacle_left.getContentSize().height / 2 + 15;// + 64 * scale;
        this._isShowFish2 = true;
	    var bfTime = this.showFish(channal_pos, fish_count, col_count);
        
	    this.dTime2 = function () {
	    	this._isShowFish2 = false;
	    }
        this.scheduleOnce(this.dTime2, bfTime);
    },

    initChannal3: function () {

    	var size = cc.winSize;
        var scale = size.width / 750;

        this._isChange = false;

        if (this.unit.fish_direction_count.channal3 == 2) {
            this._way[2] = util.getRandom(1, 2);
        }
        this.numberNature.swim_direction = this._way[2];

        var fish_count = util.getRandom(1, this.unit.show_fish_number);
        if (this._fish_number < fish_count) {
	    	fish_count = this._fish_number;
	    }

	    var col_count = 1;
	    var channal_pos = this._view.obstacle_left.getContentSize().height + this._view.obstacle_left.y + 70 * scale ;
        this._isShowFish3 = true;
	    var bfTime = this.showFish(channal_pos, fish_count, col_count);
        
	    this.dTime3 = function () {
	    	this._isShowFish3 = false;
	    }
        this.scheduleOnce(this.dTime3, bfTime);
    },

    initChannal4: function () {
    
    	var size = cc.winSize;
        var scale = size.width / 750;

        this._isChange = false;

        if (this.unit.fish_direction_count.channal4 == 2) {
            this._way[3] = util.getRandom(1, 2);
        }
        this.numberNature.swim_direction = this._way[3];

        var fish_count = util.getRandom(1, this.unit.show_fish_number);
        if (this._fish_number < fish_count) {
	    	fish_count = this._fish_number;
	    }
        
	    var col_count = 1;
	    var channal_pos = this._view.obstacle_left.getContentSize().height + this._view.obstacle_left.y + 270 * scale;
        this._isShowFish4 = true;
	    var bfTime = this.showFish(channal_pos, fish_count, col_count);
	    
	    this.dTime4 = function () {
	    	this._isShowFish4 = false;
	    }
        this.scheduleOnce(this.dTime4, bfTime);

    },

    showFish: function (cPosY, fishCount, hCount) {
        this._fish_swim_time = 0;
        this._isEqual = false;
        this._col = 0;
        this._remainCount = 0;
        var speed_index = util.getRandom(1, 3);
        this._speed = move_speed[speed_index];
        if (this.numberNature.swim_direction == 1) {
        	this._posX = 0;
        } else {
        	var size = cc.winSize;
        	this._posX = size.width;
        }
        
        if (this.ftime_Array.length > 0) {
        	this.ftime_Array.splice(0, this.ftime_Array.length - 1);
        }

        this.goalFishCount = 0;
        for (var i = 0; i < fishCount; i++) {
            this.getFishType(fishCount);
        };
        // cc.log("----------------------------------------------------------------");
        // cc.log("----------------------------------------------------------------");
        // cc.log("--------- GAME FISH COUNT ---------", fishCount, hCount);
        // for (var i = 0; i < fishCount; i++) {
        //     cc.log("--------- game fish type ---------", this._groupTypeArray[i]);
        // };

        // cc.log("--------- game fish type ---------", this._groupTypeArray);

        this._groupFishIndex = 0;
        this.setFishPos(cPosY, fishCount, hCount);

        for (var i = 0; i < fishCount; i++) {
            this._groupTypeArray[i].fish_res = null;
            this._groupTypeArray[i].fish_typeId = null;
            this._groupTypeArray[i] = null;
        };
        this._groupTypeArray.splice(0, fishCount);
        this._groupTypeArray = [];

        var s_time = this.getMaxMoveTime();
        this._fish_swim_time = s_time;

        if (this._isGuide && this._isAppoint == 2) {
            this.seekGoalFish(s_time-0.5);
            this._isAppoint = 3;
        }

        return s_time;
    },

    setFishPos: function (cPosY, fCount, hCount) {
    	
        var posY = cPosY;
    	var colCount = 0;
    	if (fCount > hCount) {
    		colCount = util.getRandom(1, hCount);
    	} else if (fCount == hCount) {
    		colCount = fCount;
    	} else {
    		colCount = util.getRandom(1, fCount);
    	}
    	
    	this._col = this._col + 1;
    	
    	if (colCount == hCount) {
    		this._isEqual = true;
    	}

        this._remainCount = fCount - colCount;

        // cc.log('--------qian this._remainCount------', this._remainCount, colCount);

        if (0 < this._remainCount && this._remainCount < hCount && this._isEqual == false) {
            var random_h = util.getRandom(1, 2);
            // cc.log('--------random_h------', random_h);
            if (random_h == 1) {
                colCount = hCount;
                if (fCount < colCount) {
                    colCount = fCount;
                }
                this._remainCount = fCount - colCount;
                this._isEqual = true;
            } else {
            	colCount = fCount - hCount;
                if (colCount > 0) {
                   this._remainCount = hCount; 
                }
            }
        }

        // cc.log('--------hou this._remainCount------', this._remainCount, colCount);

    	var posX = this._posX;

    	var fish_gap = 20;
        if (this._col == 1) {
        	fish_gap = 0;
        }

		for (var j = 0; j < colCount; j++) {
            // cc.log('----------- fish index -------------', this._groupFishIndex);
            // cc.log('----------- fish -------------', this._groupTypeArray[this._groupFishIndex]);
            this.numberNature.fishRes = this._groupTypeArray[this._groupFishIndex].fish_res;
            this.numberNature.fishId = this._groupTypeArray[this._groupFishIndex].fish_typeId;
            this.numberNature.fishSpeed = this._speed;

			var fish = new SeaFish(this.numberNature);
            fish.addFishTouch();
            fish.handleFish(this, this.touchFish);
            fish.handleTouch(this, this.calculationScore);
            fish.handleRun(this, this.otherFishRun);
            this._groupFishIndex += 1;

            this._groupFishArray.push(fish);

			fish_size = fish.swim_fish.getContentSize();
            
			fish.x = posX - fish_size.width - fish_gap;
			fish.y = posY;

            if (this._isGuide && this._isAppoint == 1 && this.numberNature.fishRes == dict_sm_elememt[this._goal_color][this._goal_icon].res) {
                this._firstGoalFish = fish;
                this._isAppoint = 2;
            }

			
			if (colCount > 1) {
				posY = posY + fish_size.height;
			}
      
			if (this.numberNature.swim_direction == 2) {
				var size = cc.winSize;
                fish.x = posX + fish_gap;
			}

			if (this._posX > fish.x) {
				if (this.numberNature.swim_direction == 2) {
					var px = fish.x + fish_size.width;
					if (this._posX < px) {
						this._posX = px;
					}
				} else {
					this._posX = fish.x;
				} 
			} else {
				if (this.numberNature.swim_direction == 2) {
					this._posX = fish.x + fish_size.width;
				}
			}

			this._view._fishLayer.addChild(fish);
            
            var fish_sTime = 0;
            if (fCount == 1 && this._col == 1 && hCount == 1) {
                var move_type = util.getRandom(1, 2);
                if (this._isChange == false) {
                	move_type = 2;
                } else {
                	move_type = 1;
                }

                if (move_type == 1) {
                    fish_sTime = this.moveFishType2(fish);
                    this.ftime_Array.push(fish_sTime);

                    this.numberNature.fishSpeed = change_speed;
                } else {
               	    fish_sTime = this.moveFishType1(fish);
               	    this.ftime_Array.push(fish_sTime);
                }
            } else {
            	fish_sTime = this.moveFishType1(fish);
            	this.ftime_Array.push(fish_sTime);
            }

            fish.swingAction(this.numberNature.fishSpeed);

            this._fish_number = this._fish_number - 1;
			
		};

		if (this._remainCount > 0) {
			this.setFishPos(cPosY, this._remainCount, hCount);
		}
    },

    getFishType: function (fishCount) {
    	var color_index = 0;
    	var icon_index = 0;
        var type_random = util.getRandom(1, this.unit.fish_goal_probability.denominator);
        if (this._isGuide && this._isAppoint == 1) {
            type_random = 1;
        }

        if (this.goalFishCount > Math.floor(fishCount*0.5)) {
            type_random = this.unit.fish_goal_probability.member + 1;
        }
    	if (type_random <= this.unit.fish_goal_probability.member) {
            color_index = this._goal_color;
            icon_index = this._goal_icon;
            this._goal_number = this._goal_number + 1;
            this.goalFishCount += 1;

    	} else {
            var other_fish_array = new Array();
            for (var i = 0; i < this.fish_type.length; i++) {
                if ((this.fish_type[i][0] != this._goal_color) || (this.fish_type[i][1] != this._goal_icon)) {
                    other_fish_array.push(i);
                }
            };
    		var type_random = util.getRandom(1, other_fish_array.length - 1) - 1;
            var fish_index = other_fish_array[type_random];
    		color_index = this.fish_type[fish_index][0];
    	    icon_index = this.fish_type[fish_index][1];
    	}

    	var fish_res = dict_sm_elememt[color_index][icon_index].res;
        var fish_typeId = dict_sm_elememt[color_index][icon_index].id;

        var gtLength = this._groupTypeArray.length;
        this._groupTypeArray[gtLength] = {};
        this._groupTypeArray[gtLength].fish_res = fish_res;
        this._groupTypeArray[gtLength].fish_typeId = fish_typeId;
        
    	//return this._groupTypeArray;//{fish_res: fish_res, fish_typeId: fish_typeId};
    },

    getMaxMoveTime: function () {
    	var ftime = this.ftime_Array[0];
    	for (var i = 1; i < this.ftime_Array.length; i++) {
    		var fish_time = this.ftime_Array[i];
    		if (ftime < fish_time) {
                ftime = fish_time;
    		}
    	};
        ftime = ftime + 0.5;
    	return ftime;
    },

    moveFishType1: function (node) {
        var size = cc.winSize;
        var node_posX = node.x;
        var distance = size.width - node_posX;
        var swim_time = distance / this._speed;
        
        var fish_size = node.swim_fish.getContentSize();
        if (this.numberNature.swim_direction == 2) {
            distance = -(node_posX + fish_size.width);
            swim_time = -distance / this._speed;
        }

        var move = cc.MoveBy.create(swim_time, cc.p(distance, 0));
        var callF = cc.CallFunc.create(function () {
            this.settle_fish_number = this.settle_fish_number - 1;
            if (this.settle_fish_number <= 0) {
                this.accountResult();
            }
            node.swim_fish.stopAllActions();
            node.swim_fish.removeFromParent(true);
            node.removeFromParent(true);
        }, this);
        var seq = cc.Sequence.create(move, callF);

        node.runAction(seq);
        
        return swim_time;
    },

    moveFishType2: function (node) {
    	var size = cc.winSize;

    	var node_posX = node.x;
    	var fish_size = node.swim_fish.getContentSize();
        var distance_middle = size.width/2 - node_posX - fish_size.width / 2;
        var speed = change_speed;
        var swim_time1 = distance_middle / speed;
        var move_x = size.width / 2 - fish_size.width / 2;

        if (this.numberNature.swim_direction == 2) {
        	distance_middle = node_posX - size.width / 2 + fish_size.width / 2;
        } 

        var node_posY = node.y;

        var swim_time1 = distance_middle / speed;

        var move1 = cc.MoveTo.create(swim_time1, cc.p(move_x, node_posY));

        var distance_remain = size.width - move_x;
        
        move_x = size.width;

        if (this.numberNature.swim_direction == 2) {
        	distance_remain = size.width / 2 + fish_size.width / 2 ;
        	move_x = 0 - fish_size.width;
        } 
        var swim_time2 = distance_remain / speed;

        var move2 = cc.MoveTo.create(swim_time2, cc.p(move_x, node_posY));

        var delay = cc.DelayTime.create(0.5);

        var callStopSwing = cc.CallFunc.create(function () {
            node.fishStopSwing();
        }, this);

        var callRunSwing = cc.CallFunc.create(function () {
            node.swingAction(speed);
        }, this);

        var callF = cc.CallFunc.create(function () {
            this.settle_fish_number = this.settle_fish_number - 1;
            if (this.settle_fish_number <= 0) {
                this.accountResult();
            }
            node.swim_fish.stopAllActions();
            node.swim_fish.removeFromParent(true);
            node.removeFromParent(true);
        }, this);
        
        var seq = cc.Sequence.create(move1, callStopSwing, delay, callRunSwing, move2, callF);

        node.runAction(seq);

        var fw_times = swim_time1 + 1.0 + swim_time2;
        
        return fw_times;
    },

    startGame: function (gIndex) {
    	var size = cc.winSize;

    	var fish_array = new Array();

	    this.numberNature.swim_direction = 2;
	    this._speed = 200;
        
        var behind_fish = this.startFishPos(fish_array);

        var gf_size = fish_array[gIndex].swim_fish.getContentSize(); 

        var distance = fish_array[gIndex].x - (size.width - gf_size.width)/2; 
        var mTime1 = distance / this._speed;
        var delay_time = 0.5 + 0.2 + 0.2 + 0.5;

        for (var i = 0; i < fish_array.length; i++) {
        	var distance_fish = fish_array[i].x + gf_size.width;
	    	this.startFishMove(fish_array[i], distance, distance_fish, mTime1, delay_time);
	    };

	    this.photo = function () {

	    	var bowl_size = this._view.fishbowl.getContentSize();
	        var bowl_gap = 5;
	        var bowl_posX = fish_array[gIndex].x + gf_size.width/2 - bowl_size.width/2 + bowl_gap;
	        var bowl_posY = fish_array[gIndex].y + gf_size.height/2 - bowl_size.height/2 + bowl_gap;
	        this._view.setBowlPos(size.width, bowl_posY);

	        var bowl_distance = size.width - bowl_posX;
	    	
            var move_bowl = cc.MoveBy.create(0.5, cc.p(-bowl_distance, 0));
            
            var callF = cc.CallFunc.create(this.showGFish, this);

            var delay = cc.DelayTime.create(0.2);

            var bowl_height = 40;
            var move_bowl2 = cc.MoveTo.create(0.5, cc.p(0, bowl_height));

            var callTip = cc.CallFunc.create(function () {
                if (this._isGuide) {
                    this.goalFishTip();
                }
            }, this);

            var seq = cc.Sequence.create(move_bowl, delay, callF, delay, move_bowl2, callTip);

            this._view.fishbowl.runAction(seq);


	    	this.unschedule(this.photo);
	    }

	    this.scheduleOnce(this.photo, mTime1);
        
        var bfish_x = fish_array[gIndex].x;
        var bfish_width = fish_array[gIndex].getContentSize().width;
	    for (var i = 2; i < behind_fish; i++) {
	    	var fish_x = fish_array[fish_array.length - i].x;
	    	if (bfish_x < fish_x) {
	    		bfish_x = fish_x;
	    		bfish_width = fish_array[fish_array.length - i].getContentSize().width;
	    	}
	    };

	    var bfis_disx = bfish_x - distance + bfish_width;
	    var b_time = bfis_disx / this._speed; 

	    var obstacle_delay = delay_time + mTime1 + b_time;

        this.scheduleOnce(this.showObstacle, obstacle_delay);

        return (obstacle_delay + 1.1);
 
    },

    startFishMove: function (node, distance, distance_fish, mTime, dTime) {
        var move_fish = cc.MoveBy.create(mTime, cc.p(-distance, 0));

        var delay = cc.DelayTime.create(dTime);

        var callStopSwing = cc.CallFunc.create(function () {
            node.fishStopSwing();
        }, this);

        var distance2 = distance_fish - distance;
        this._speed = 500;
        var mTime2 = distance2 / this._speed;

        var callRunSwing = cc.CallFunc.create(function () {
            node.swingAction(this._speed);
        }, this);

        this.numberNature.fishSpeed = this._speed;
        node._speed = this.numberNature.fishSpeed;

        var move_fish2 = cc.MoveBy.create(mTime2, cc.p(-distance2, 0));

        var call_remove = cc.CallFunc.create(function () {
            node.swim_fish.stopAllActions();
            node.swim_fish.removeFromParent(true);
        	node.removeFromParent(true);
        });

        var seq = cc.Sequence.create(move_fish, callStopSwing, delay, callRunSwing, move_fish2, call_remove);

        node.runAction(seq);
    },

    startFishPos: function (fish_array) {
    	var size = cc.winSize;
    	var scale = size.width / 750;

    	var col = 1;
        var row = 5;
        var fishTypeCount = this.fish_type.length;
        var col = fishTypeCount / 5;
        var col_mod = fishTypeCount % 5;
        if (col_mod > 0) {
            col = col + 1;
        }

        if (col < 5) {
            col = 1;
        }
        
        for (var i = 0; i < col; i++) {
        	if (col_mod > 0 && i == col - 1) {
                row = col_mod;
        	}

        	var height_Array = this.getPosYArray(row);
        	for (var j = 0; j < row; j++) {
        		var index = i * 5 + j;
        		var color_index = this.fish_type[index][0];
				var icon_index = this.fish_type[index][1];
				this.numberNature.fishRes = dict_sm_elememt[color_index][icon_index].res;
                this.numberNature.fishId = dict_sm_elememt[color_index][icon_index].id;
                this.numberNature.fishSpeed = this._speed;
				var fish = new SeaFish(this.numberNature);
                fish.swingAction(this.numberNature.fishSpeed);
				fish.x = size.width + util.getRandom(1, 100) + 150 * scale * i;

		        var h_index = util.getRandom(1, height_Array.length) - 1;
		        var j_index = height_Array[h_index];
		        height_Array.splice(h_index, 1);

				fish.y = size.height * 5 / 16 + 150 * scale * (j_index - 1);
				this._view._fishLayer.addChild(fish);

				fish_array.push(fish);
        	};
        };

        if (col_mod == 0) {
            return row;
        } else {
        	return col_mod;
        }
    },

    getPosYArray: function (typeCount) {
        var posYArray = [];
        var oneIndex = util.getRandom(1, 6 - typeCount) - 1;
        for (var i = 0; i < typeCount; i++) {
            var posIndex = oneIndex + i;
            posYArray.push(posIndex);
        };
        return posYArray;
    },

    showGFish: function () {
    	var size = cc.winSize;
    	var colorLayer = new cc.LayerColor(cc.color(255,255,255,255), size.width, size.height);
    	this._view.addChild(colorLayer);
    	var delay = cc.DelayTime.create(0.1);
    	var callF = cc.CallFunc.create(function () {
            colorLayer.removeFromParent(true);
    	});
    	var seq = cc.Sequence.create(delay, callF);
    	colorLayer.runAction(seq);
        this._view.setShowGFish();
    },

    showObstacle:function () {
    	var size = cc.winSize;

    	var move_time = 1.0;
    	var down_time = 0.1;
    	var down_disY = 50;
        var obstacle_show = (size.width - this.unit.channal12_width) / 2;
        var obstacle_width = this._view.obstacle_left.getContentSize().width
        if (obstacle_show > obstacle_width) {
            obstacle_show = obstacle_width;
        }

        var move_left = cc.MoveBy.create(move_time, cc.p(obstacle_show, 0));
        var move_ldown = cc.MoveBy.create(down_time, cc.p(0, -down_disY));
        var seq_left = cc.Sequence.create(move_left, move_ldown);
        this._view.obstacle_left.runAction(seq_left);

        var move_right = cc.MoveBy.create(move_time, cc.p(-obstacle_show, 0));
        var move_rdown = cc.MoveBy.create(down_time, cc.p(0, -down_disY));
        var seq_right = cc.Sequence.create(move_right, move_rdown);
        this._view.obstacle_right.runAction(seq_right);

        this.unschedule(this.showObstacle);
    },
    
    accountResult: function () {
        this._view._beginAddOneFlag = false;
    	var goal_fRes = dict_sm_elememt[this._goal_color][this._goal_icon].res;
        var goal_fId = dict_sm_elememt[this._goal_color][this._goal_icon].id;
    	this._view.setAccountView(goal_fRes);

        if (this._isGuide) {
            this.removeTip();
        }

    	var delayTime = 0.5;
    	var overTime = 0;
        this.fishMove = function () {
            overTime = this.goalFishAccount(goal_fRes, goal_fId);
            overTime = overTime + 1.0;
            this.scheduleOnce(this.judgeTestOrGame, overTime);
        }
        this.scheduleOnce(this.fishMove, delayTime);
        
    },

    judgeTestOrGame: function () {
        if(this._isGuide) {
            var passNum = this.getStarNum();
            if (passNum > 0) {
                this.guideSettle();
            }else {
                this._view.circle_touch.setVisible(false);
                this._view.circle_goal.setVisible(false);

                this._firstGoalFish = null;
                this._isAppoint = 1;
                this.sureGuide(5);
            }
            
        }else {
            if (this._args.isLearnTest == true) {
                var delegate = this._args.delegateLearnTest;
                var error_number = Math.abs(this._view._touchCount - this._goal_number);
                if (error_number < 5) {
                    delegate.recordLearnTestRes(delegate,true,this.unit.energy_level);
                }else {
                    delegate.recordLearnTestRes(delegate,false,this.unit.energy_level);
                }

                this._view.circle_touch.setVisible(false);
                this._view.circle_goal.setVisible(false);
                if(delegate.IsLastLearnTest(delegate) == true){
                    delegate.showViewSettleTest(delegate);
                } else {
                    delegate.HandleStartTest(delegate, false);
                }            
            }else {
                this.showSettleView();
            }
        }
        
    },

    goalFishAccount: function (gfRes, gfId){

        var size = cc.winSize;

    	this.numberNature.fishRes = gfRes;
        this.numberNature.fishId = gfId;
    	this.numberNature.swim_direction = 2;

        if (this._goal_number <= 50) {
            this._speed = 1000;
        }else if (this._goal_number > 50 && this._goal_number <= 90) {
            this._speed = 1750;
        }else if (this._goal_number > 90) {
            this._speed = 2500;
        }

        this.numberNature.fishSpeed = this._speed;
	    
	    this._goal_count = 0;

        var f_width = 0;
        
    	for (var i = 0; i < this._goal_number; i++) {
    		var fish = new SeaFish(this.numberNature);
            fish.swingAction(this.numberNature.fishSpeed);
            f_width = fish.swim_fish.getContentSize().width;
			fish.x = size.width + (i - 1) * f_width;
			fish.y = size.height / 8;
			this._view._fishLayer.addChild(fish);

            var distance = fish.x + f_width;
            var g_time = distance / this._speed;
			this.goalFishMove(fish, distance, g_time);
    	};

    	var ctime = (size.width + (this._goal_number - 1) * f_width) / this._speed;
        
    	return ctime;
    },

    goalFishMove: function (node, distance, mTime) {
        var move_fish = cc.MoveBy.create(mTime, cc.p(-distance, 0));
        var callF = cc.CallFunc.create(function () {
        	this._goal_count = this._goal_count + 1;
            this._view.getGoalCount(this._goal_count);
            node.swim_fish.stopAllActions();
            node.swim_fish.removeFromParent(true);
            node.removeFromParent(true);
    	}, this);
    	var seq = cc.Sequence.create(move_fish, callF);
    	node.runAction(seq);
    },

    getStarNum: function () {
        var star_num = 0;
        var error_value = Math.abs(this._view._touchCount - this._goal_number);
        if (error_value == 0) {
            star_num = 3;
        }else if (error_value <= 2) {
            star_num = 2;
        }else if (error_value <= 5) {
            star_num = 1;
        }
        return star_num;
    },

    showSettleView:function(){
        this._view.circle_touch.setVisible(false);
        this._view.circle_goal.setVisible(false);
        var args = {
            gameID:this._args.gameID,
            level:this._args.level,
            hasPassed:false,
            userId : this._args.userId,
            token : this._args.token,
            isGameTest : this._args.isTest,
            starsList : this._args.starsList,
        };
        var get_starNum = this.getStarNum();
        if(get_starNum > 0){
            args.hasPassed = true;
        }

        args.starNum = get_starNum;
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
            var str = self._view._touchCount+'/'+self._goal_number+'正确';
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
        var str = this._view._touchCount+'/'+this._goal_number+'正确';
        this._viewSettle.setResTipText(str);
        this.addChild(this._viewSettle);
    }, 

    setGamePauseResume:function(isPause){
        var children = this._view._fishLayer.getChildren();
        if(isPause == true){
            for(var k in children){
                cc.director.getActionManager().pauseTarget(children[k]);
            }
            cc.director.getActionManager().pauseTarget(this._view.obstacle_left);
            cc.director.getActionManager().pauseTarget(this._view.obstacle_right);
            cc.director.getActionManager().pauseTarget(this._view.fishbowl);
            cc.director.getScheduler().pauseTarget(this);
        }else{
            for(var k in children){                
                cc.director.getActionManager().resumeTarget(children[k]);
            }
            cc.director.getActionManager().resumeTarget(this._view.obstacle_left);
            cc.director.getActionManager().resumeTarget(this._view.obstacle_right);
            cc.director.getActionManager().resumeTarget(this._view.fishbowl);
            cc.director.getScheduler().resumeTarget(this);
        }
    },
    handleNext:function(self){
        self._args.timestampStart = parseInt(new Date().getTime());
        self._args.level += 1;
        if(self._args.level > 30){
            self._args.level = 1;
        };
        self._stopSchedule = false;
        self.runOneGame(self._args.level);
    },
    handleAgain:function(self){
        self._stopSchedule = false;
        self.runOneGame(self._args.level);
    },

    handlePurseEvent:function(self){
        if (self._isGuide) {
            cc.director.getActionManager().pauseTarget(self);
        } 
        self._isPause = false;
        self.setGamePauseResume(true);        
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
        if (self._isGuide) {
            cc.director.getActionManager().resumeTarget(self);
        }
        self.setGamePauseResume(false);
        self._viewGameSetting.removeFromParent();
    },
    handleRestart:function(self){
        cc.log('---handleRestart');
        if (self._isGuide) {
            cc.director.getActionManager().resumeTarget(self);
        }
        self.setGamePauseResume(false);
        self.unscheduleAllCallbacks();
        self._view._fishLayer.removeAllChildren();        
        self._viewGameSetting.removeFromParent(); 
        self.stopAllActions();
        self._stopSchedule = false;

        if (self._isGuide) {
            self.removeTip();
            self.removeHand();
            self._view.removeOne();
            self._firstGoalFish = null;
            self._isAppoint = 1;
            self.sureGuide(0);
        }else {
            self.runOneGame(self._args.level);
        }  
    },
    
    guideClick: function (self) {
        if (self._isGuide && self._isAppoint == 3) {
            self.addUpFishTip();
            self._isAppoint = 4;
        }
    },

    calculationScore: function (self, tPos, fishType) {
        var score = 0;
        if (self._goalFishId == fishType) {
            score = 1;
        }else {
            score = -1;
        }
        self._view.showScore(tPos, score);
    },

    touchFish: function (self, fish, touchPos) {
        if (self._goalFishId == fish._typeId) {
            fish.onGoalDisappearFish(touchPos);
        }else {
            fish.onOtherDisappearFish(touchPos);
        }
    },

    otherFishRun: function (self, fish) {
        var distance, ccpx;
        if (fish._swim_direction == 1) {
            distance = cc.winSize.width - fish.x;
            ccpx = distance;
        }else {
            distance = fish.x + fish.width;
            ccpx = -distance;
        }
        var speed = 1200;
        var time = distance / speed;
        fish.swingAction(speed);
        var move = cc.MoveBy.create(time, cc.p(ccpx, 0));
        var call = cc.CallFunc.create(function () {
            fish.swim_fish.stopAllActions();
            fish.swim_fish.removeFromParent(true);
            fish.stopAllActions();
            fish.removeFromParent(true);
        })
        fish.runAction(move);
    },

    //-------------------------------------------------------//
    //--------------------- 新手引导 -------------------------//
    //-------------------------------------------------------//

    sureGuide: function (index) {
        this._isGuide = true;
        this.guideLevel = 0;
        // this._view.setGuideVisible(false);
        this.dTime = this.beginGuide(index);
    },

    beginGuide: function (index) {
        this.setTipArray(GAME_GUIDE_TIP[this._args.gameID].guideTip[index], true, 4);
        this.guide = new PlayerGuide(this._guideArray);
        this.guide.x = this._view.width*0.5 - this.guide.width*0.5;
        this.guide.y = this._view.height*0.77;
        this._view.addChild(this.guide, 10);

        this.runOneGame(this.guideLevel); 

        return 3.0;
    },

    setTipArray: function (tip, isRect, verticesType) {
        this._guideArray.tip = tip;
        this._guideArray.isRect = isRect;
        this._guideArray.verticesType = verticesType;
    },

    goalFishTip: function () {
        this.guide.removeTip();
        this.setTipArray(GAME_GUIDE_TIP[this._args.gameID].guideTip[1], true, 4);
        this.guide.init(this._guideArray);
        this.guide.x = this._view.width*0.5 - this.guide.width*0.5;
    },

    seekGoalFish: function (fSwimTime) {
        this.draw = new cc.DrawNode();
        this._view.addChild(this.draw, 5);

        var delay = cc.DelayTime.create(fSwimTime/2);
        var call = cc.CallFunc.create(function () {

            cc.director.getScheduler().pauseTarget(this);
            cc.director.getActionManager().pauseTarget(this._firstGoalFish);

            var scale = cc.winSize.width / 750;
            var ccp1 = cc.p(0, 0);
            var ccp2 = cc.p(this._view.fishbowl.width*scale, this._view.fishbowl.y*2 + this._view.fishbowl.height*scale);
            var rectCCP1 = [ccp1, ccp2];

            sPos = this._view.fishbowl.convertToWorldSpace(this._view.select_fish);
            var spWidth = this._view.select_fish.width*scale;
            var spHeight = this._view.select_fish.height*scale;
            var length = (spWidth > spHeight)?spWidth:spHeight; 
            this.addGoalCircle(sPos, length+15*scale);

            length = (this._firstGoalFish.width > this._firstGoalFish.height)?this._firstGoalFish.width:this._firstGoalFish.height;
            length += 30*scale;
            var ccp3 = cc.p(this._firstGoalFish.x - (length-this._firstGoalFish.width)*0.5, this._firstGoalFish.y - (length-this._firstGoalFish.height)*0.5);
            var ccp4 = cc.p(this._firstGoalFish.x + (length+this._firstGoalFish.width)*0.5, this._firstGoalFish.y + (length+this._firstGoalFish.height)*0.5);
            var rectCCP2 = [ccp3, ccp4];

            this.addGoalCircle(cc.p(ccp3.x + length*0.5, ccp3.y + length*0.5), length-15*scale);

            var rectCCP = new Array();
            rectCCP[0] = rectCCP1;
            rectCCP[1] = rectCCP2;
            this.guide.addClipping(this._view, rectCCP, 3);
            
            this.guide.removeTip();
            this.setTipArray(GAME_GUIDE_TIP[this._args.gameID].guideTip[2], true, 4);
            this.guide.init(this._guideArray);
            this.guide.x = this._view.width*0.5 - this.guide.width*0.5;
            this.guide.y = this._firstGoalFish.x + (length+this._firstGoalFish.width)*0.5 + 20*scale;

            this._view._purseBtn.setTouchEnabled(false);

        }, this);
    
        var delay1 = cc.DelayTime.create(3);
        var call1 = cc.CallFunc.create(function () {
            this.guide.removeClipping();
            this._view._purseBtn.setTouchEnabled(true);
            this.draw.clear();
            this.draw.removeFromParent(true);
            this.draw = null;
            this.guide.removeTip();
            this.setTipArray(GAME_GUIDE_TIP[this._args.gameID].guideTip[3], true, 4);
            this.guide.init(this._guideArray);
            this.guide.x = this._view.width*0.5 - this.guide.width*0.5;
            this.guide.y = this._view.height*0.6;

            var handCCP = cc.p(0,0);
            if (this._firstGoalFish._swim_direction == 1) {
                handCCP.x = this._firstGoalFish.x - this._firstGoalFish.width*0.5;
            }else {
                handCCP.x = this._firstGoalFish.x + this._firstGoalFish.width*0.5;
            }
            handCCP.y = this._firstGoalFish.y + this._firstGoalFish.height*0.5;
            this.handTip(handCCP);

            this._view._beginAddOneFlag = true;
        }, this);

        this.runAction(cc.Sequence.create(delay, call, delay1, call1));
    },

    addUpFishTip: function () {
        
        this.removeHand();
        cc.director.getScheduler().resumeTarget(this);
        cc.director.getActionManager().resumeTarget(this._firstGoalFish);

        this.guide.removeTip();
        this.setTipArray(GAME_GUIDE_TIP[this._args.gameID].guideTip[4], true, 4);
        this.guide.init(this._guideArray);
        this.guide.x = this._view.width*0.5 - this.guide.width*0.5;
    },

    removeTip: function () {
        if (this.guide) {
            this.guide.removeTip();
            this.guide.removeFromParent(true);
            this.guide = null;
        }
    },

    removeHand: function () {
        if (this._view.hand) {
            platformFun.removeAllActionsFromTarget(this._view.hand);
            // cc.director.getActionManager().removeAllActionsFromTarget(this._view.hand, true);
            this._view.hand.removeFromParent(true);
            this._view.hand = null;
        }
    },

    guideSettle: function () {
        this._view.circle_touch.setVisible(false);
        this._view.circle_goal.setVisible(false);

        var gSettle = new GuideSettle();
        this.addChild(gSettle);

        var delay = cc.DelayTime.create(2.0);
        var call = cc.CallFunc.create(function () {
            gSettle.removeFromParent(true);
            
            var guideArgs = {
                gameID:this._args.gameID,
                level : this._args.level,
                starNum : 0,
                timestampStart : this._args.timestampStart,
            }

            var self = this;
            
            if (this._args.delegate == false) {
                var gameStart = function () {
                    self.beginGame();
                }

                if (util.getArrycount(gameData.data[this._args.gameID].starsList) == 0) {
                    var starsArray = gameData.data[this._args.gameID].starsList;
                    var curStarsLength = util.getArrycount(starsArray);
                    guideArgs.isAddLevel = true;
                    gameData.data[this._args.gameID].starsList[curStarsLength+1] = {};
                    LearnCS.reportStarNum(guideArgs, gameStart);
                }else {
                    gameStart();
                }
            }else {
                var gameStart = function () {
                    self.taskOrTestStartGame();
                }
                if (this._hasGuide == true) {
                    guideArgs.isTask = (this._args.isLearnTest == true) ? false : true;
                    LearnCS.reportGuideSettle(guideArgs, gameStart); 
                }else {
                    gameStart();
                }
            }
            
        }, this);
        this.runAction(cc.Sequence.create(delay, call));
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

    addGoalCircle: function (origin, radius) {
        this.draw.drawCircle(origin, radius*0.5, cc.degreesToRadians(90), 100, false, 6, cc.color(0, 255, 255, 255));
    },

    handTip: function (handPos) {
        this._view.addGuideHand(handPos);
    },

    //-------------------------------------------------------//

    onExit: function () {
        // this.removeFromParent(true);
        this._super();
    },
});