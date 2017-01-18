var STAR_NUM = 3;

var ColorMachineView = cc.LayerColor.extend({
	_leftBtn:null,
	_rightBtn:null,
	_leftBtnHandle:null,
	_rightBtnHandle:null,
    _isbtnEvent:true,
    _touchX:null,
    _touchY:null,
    _isMoveLayer:true,
    _is_ture:null,
    ctor:function (bgColor) {
        this._super();

        this.color = bgColor;

        this.starName = new Array();

        this.isTouchListener = true;

        cc.eventManager.addListener({
            event: cc.EventListener.TOUCH_ONE_BY_ONE,
            swallowTouches: false,
            onTouchBegan: this.onTouchBegan,
            onTouchMoved: this.onTouchMoved,
            onTouchEnded: this.onTouchEnded
        }, this); 

        this.init();
        return true;
    },

    init:function (){
    	this.initTop();
    	this.initBottom();
    	this.initCenter();
    },

    initTop:function (){

    	var size = cc.winSize;
    	var scale = size.width / 750;

        this._topBg = new cc.Sprite(res.game_nav_pg);
        this._topBg.ignoreAnchorPointForPosition(false);
        this._topBg.setAnchorPoint(cc.p(0.5, 1));
        this._topBg.attr({
        	x:size.width/2,
        	y:size.height,
        	scale:scale
        });
        this.addChild(this._topBg);

        var topGap = 15;

        //purse btn
       	this._purseBtn = new ccui.Button();
	    this._purseBtn.setTouchEnabled(true);
	    this._purseBtn.loadTextures(res.game_btn_suspend_n, res.game_btn_suspend_s, "");

	    this._purseBtn.ignoreAnchorPointForPosition(false);
        this._purseBtn.setAnchorPoint(cc.p(0.5, 0.5));

        var bgSize = this._topBg.getContentSize();
	    this._purseBtn.x = 70;
	    this._purseBtn.y = bgSize.height/2 - topGap;
	    this._topBg.addChild(this._purseBtn);

	    //progress bar long
	    this._progressBar = new cc.ProgressTimer(new cc.Sprite(res.colorMachine.cm_nav_progressBar_));
	    this._progressBar.ignoreAnchorPointForPosition(false);
        this._progressBar.setAnchorPoint(cc.p(0.5, 1));

        this._progressBar.type = cc.ProgressTimer.TYPE_BAR;
        this._progressBar.midPoint = cc.p(1, 0);
        this._progressBar.barChangeRate = cc.p(1, 0);
        this._progressBar.x = bgSize.width/2;
        this._progressBar.y = 0;

        this._topBg.addChild(this._progressBar);
        this._progressBar.setPercentage(0);

        //exper_progress and star        
        //experBg
        this._exper_bg = new cc.Sprite(res.colorMachine.cm_nva_progressBar_bg);
        this._exper_bg.setAnchorPoint(cc.p(1, 0.5));
        this._exper_bg.attr({
            x: bgSize.width  * 14 / 15,
            y: bgSize.height / 4,
            scale:scale
        });
        this._topBg.addChild(this._exper_bg, 0);
       
        //_loadingBar
        this._loadingBar = new ccui.LoadingBar();
        this._loadingBar.loadTexture(res.colorMachine.cm_nva_progressBar);
        this._loadingBar.setDirection(ccui.LoadingBar.TYPE_LEFT);
        this._loadingBar.setPercent(0);
        this._loadingBar.setAnchorPoint(cc.p(1, 0.5));
        this._loadingBar.x = bgSize.width  * 14 / 15;
        this._loadingBar.y = bgSize.height / 4;
        this._loadingBar.setScale(scale);
        this._topBg.addChild(this._loadingBar);

        var exper_width = this._exper_bg.getContentSize().width * scale;
        var exper_height = this._exper_bg.getContentSize().height * scale;

        //star
        for (var i = 1; i <= STAR_NUM; i++) {
            var star = new cc.Sprite(res.game_star_small_01);
            star.setAnchorPoint(cc.p(0.5, 0));
            star.attr({
                x: this._exper_bg.x - exper_width * (3 - i) /  6,
                y: this._exper_bg.y + exper_height,
                scale:scale
            });
            this._topBg.addChild(star, 0);
            this.starName.push(star);
        };

        //0
        this._zero = new cc.LabelTTF("0", "Arial", 18);
        this._zero.setAnchorPoint(cc.p(0.5, 1));
        this._zero.attr({
            x: this._exper_bg.x - exper_width,
            y: this._exper_bg.y - exper_height / 2,
            scale:scale
        });
        this._zero.color = cc.color(148, 169, 119);
        this._topBg.addChild(this._zero);
    },

    initBottom:function (){

    	var size = cc.winSize;
    	var scale = size.width / 750;

        this._bottomBg = new cc.Sprite(res.game_bg_select_titlebar);
        this._bottomBg.ignoreAnchorPointForPosition(false);
        this._bottomBg.setAnchorPoint(cc.p(0.5, 0));
        this._bottomBg.attr({
        	x:size.width/2,
        	y:0,
        	scale:scale
        });
        this.addChild(this._bottomBg);

        //left btn
       	this._leftBtn = new ccui.Button();
	    this._leftBtn.setTouchEnabled(true);
	    this._leftBtn.loadTextures(res.colorMachine.game_btn_select_titlebar_n, res.colorMachine.game_btn_select_titlebar_s, "");
	    this._leftBtn.setTitleText("否");

	    this._leftBtn.setTitleFontSize(30);
	    this._leftBtn.setTitleColor(cc.color.RED);

	    this._leftBtn.ignoreAnchorPointForPosition(false);
        this._leftBtn.setAnchorPoint(cc.p(0.5, 0));
	    this._leftBtn.x = size.width / 4;
	    this._leftBtn.y = 0;
	    this._leftBtn.setScale(scale);

	    this._leftBtn.addTouchEventListener(this.leftBtnEvent ,this);
	    this.addChild(this._leftBtn);

	    //right btn
       	this._rightBtn = new ccui.Button();
	    this._rightBtn.setTouchEnabled(true);
	    this._rightBtn.loadTextures(res.colorMachine.game_btn_select_titlebar_n, res.colorMachine.game_btn_select_titlebar_s, "");
	    this._rightBtn.setTitleText("是");

	    this._rightBtn.setTitleFontSize(30);
	    this._rightBtn.setTitleColor(cc.color.RED);

	    this._rightBtn.ignoreAnchorPointForPosition(false);
        this._rightBtn.setAnchorPoint(cc.p(0.5, 0));
	    this._rightBtn.x = size.width * 3 / 4;
	    this._rightBtn.y = 0;
	    this._rightBtn.setScale(scale);

	    this._rightBtn.addTouchEventListener(this.rightBtnEvent ,this);
	    this.addChild(this._rightBtn);

    },

    initCenter: function(){

    	var size = cc.winSize;
    	var scale = size.width / 750
    	this._centerContainer = new cc.LayerColor(cc.color(255, 255, 255, 0));

        this._centerContainer.ignoreAnchor = false;
        this._centerContainer.anchorX = 0.5;
        this._centerContainer.anchorY = 0.5;
        this._centerContainer.setContentSize(size.width, 500);
        this._centerContainer.x = size.width / 2;
        this._centerContainer.y = size.height / 2;
        this.addChild(this._centerContainer,2);
        this._centerContainer.setRotation(0);

        // add help tips

        this._helpText = new cc.LabelTTF("", "Arial", 35);
        this._helpText.x = size.width / 2;//this._centerContainer.width /2;
        this._helpText.y = this._centerContainer.y + this._centerContainer.height * 0.25 + 75;
        this._helpText.color = cc.color(67, 67, 67);
        this.addChild(this._helpText);

        // add color sprite
        this._colorSprite = new cc.Sprite(res.colorMachine.cm_colourDisk_whit02);
        this._colorSprite.x = this._centerContainer.width /2;
        this._colorSprite.y = this._centerContainer.height /2;

        var scale = this._colorSprite.width / size.width * 0.85;
        this._centerContainer.addChild(this._colorSprite);

        // add text above
        this._meanText = new cc.LabelTTF("意思", "Arial", 20);
        this._meanText.x = this._centerContainer.width /2;
        this._meanText.y = this._centerContainer.height /2 + this._colorSprite.height * 3 / 8 + 10;
        this._meanText.color = cc.color(181, 181, 181);
        this._centerContainer.addChild(this._meanText);

        this._aboveText = new cc.LabelTTF("", "Arial-BoldMT", 45);
        this._aboveText.x = this._centerContainer.width /2;
        this._aboveText.y = this._centerContainer.height /2 + this._colorSprite.height * 3 / 16 + 5;
        this._aboveText.color = cc.color(255, 0, 0);
        this._centerContainer.addChild(this._aboveText);

        // add text below
        this._belowMeanText = new cc.LabelTTF("字体颜色", "Arial", 20);
        this._belowMeanText.x = this._centerContainer.width /2;
        this._belowMeanText.y = this._centerContainer.height /2 - this._colorSprite.height/8 + 10;
        this._belowMeanText.color = cc.color(181, 181, 181);
        this._centerContainer.addChild(this._belowMeanText);

        this._belowText = new cc.LabelTTF("", "Arial-BoldMT", 45);
        this._belowText.x = this._centerContainer.width /2;
        this._belowText.y = this._centerContainer.height /2 - this._colorSprite.height * 5 / 16 + 5;
        this._belowText.color = cc.color(255, 0, 0);
        this._centerContainer.addChild(this._belowText);

        //add text center
        this._centerText = new cc.LabelTTF("", "Arial-BoldMT", 50);
        this._centerText.x = this._centerContainer.width /2;
        this._centerText.y = this._centerContainer.height /2;
        this._centerText.color = cc.color(255, 0, 0);
        this._centerContainer.addChild(this._centerText);

        //add right correct icon
        this._rightCorrectIcon = new cc.Sprite(res.colorMachine.cm_icon_exactness);
        this._rightCorrectIcon.x = size.width * 0.88;
        this._rightCorrectIcon.y = this._centerContainer.y;
        this.addChild(this._rightCorrectIcon);
        // this._rightCorrectIcon.x = this._centerContainer.width * 0.88;
        // this._rightCorrectIcon.y = this._centerContainer.height /2;
        // this._centerContainer.addChild(this._rightCorrectIcon);

        //add left correct icon
        this._leftCorrectIcon = new cc.Sprite(res.colorMachine.cm_icon_exactness);
        this._leftCorrectIcon.x = size.width * 0.12;
        this._leftCorrectIcon.y = this._centerContainer.y;
        this.addChild(this._leftCorrectIcon);
        // this._leftCorrectIcon.x = this._centerContainer.width * 0.12;
        // this._leftCorrectIcon.y = this._centerContainer.height /2;
        // this._centerContainer.addChild(this._leftCorrectIcon);

    },

    showErrorLayer: function() {
    	if (this._errorLayer == null){
	    	this._errorLayer = new cc.Sprite(res.colorMachine.cm_icon_wrong);
	    	this._errorLayer.x = this._centerContainer.width / 2;
	    	this._errorLayer.y = this._centerContainer.height /2;
	    	this._centerContainer.addChild(this._errorLayer);

	    	//add progress
	    	this._errorLayer.progressBar = new cc.ProgressTimer(new cc.Sprite(res.colorMachine.cm_icon_wrong_circular));
	        this._errorLayer.progressBar.type = cc.ProgressTimer.TYPE_RADIAL;
	        this._errorLayer.progressBar.x = this._errorLayer.width/2;
	        this._errorLayer.progressBar.y = this._errorLayer.height/2;
	        this._errorLayer.addChild(this._errorLayer.progressBar);
    	}

    	this._errorLayer.setVisible(true);
    	this._errorLayer.x =  this._centerContainer.width * 3/2;
    	this._errorLayer.progressBar.setPercentage(0);

    	var point1 =cc.p(this._centerContainer.width/2 - 50,this._centerContainer.height/2);;
    	var point2 =cc.p(this._centerContainer.width/2,this._centerContainer.height/2);
    	var moveTo1 = cc.moveTo(0.2, point1);
    	var moveTo2 = cc.moveTo(0.05, point2);

    	var callFun = cc.callFunc(this.errorProgress, this);
    	var callFun2 = cc.callFunc(this.hideErrorLayer, this);
    	var delay = cc.delayTime(0.2+1);
    	this._errorLayer.runAction(cc.sequence(moveTo1, moveTo2, callFun, delay, callFun2));
    },

    errorProgress: function(){
    	var to2 = cc.progressFromTo(1, 0, 100);
    	this._errorLayer.progressBar.runAction(to2);
    },

    hideErrorLayer: function() {
    	this._errorLayer.setVisible(false);
    },

    setBtnHandle: function(controller, leftBtnHandle, rightBtnHandle) {
    	this._controller = controller;
    	this._leftBtnHandle = leftBtnHandle;
    	this._rightBtnHandle = rightBtnHandle;
    },

    leftBtnEvent: function (sender, type) {
        switch (type) {
            case ccui.Widget.TOUCH_BEGAN:
                if (this._isbtnEvent == true) {
                    this._isbtnEvent = false;
                    this._leftBtnHandle(this._controller);
                }
            	
                break;
            case ccui.Widget.TOUCH_MOVED:
                break;
            case ccui.Widget.TOUCH_ENDED:
                break;
            case ccui.Widget.TOUCH_CANCELED:
                break;
            default:
                break;
        }
    },

    rightBtnEvent: function (sender, type) {
        switch (type) {
            case ccui.Widget.TOUCH_BEGAN:
                if (this._isbtnEvent == true) {
                    this._isbtnEvent = false;
                    this._rightBtnHandle(this._controller);
                }
                break;
            case ccui.Widget.TOUCH_MOVED:
                break;
            case ccui.Widget.TOUCH_ENDED:
                break;
            case ccui.Widget.TOUCH_CANCELED:
                break;
            default:
                break;
        }
    },

    enableBtn: function (vbool){
    	this._rightBtn.setEnabled(vbool);
    	this._leftBtn.setEnabled(vbool);
    },
    onTouchBegan:function (touch, event) {
        var target = event.getCurrentTarget();
        var touchPoint = touch.getLocation();
        if (target.isTouchListener == true) {
            this._touchX = touchPoint.x;
            this._touchY = touchPoint.y;
        }
        return true;
        
    },
    onTouchMoved:function (touch, event) {
        var target = event.getCurrentTarget();
        var touchPoint = touch.getLocation();

        if (target.isTouchListener == true) {
            var disX = touchPoint.x - this._touchX;
            var disY = touchPoint.y - this._touchY;
            var center_x = target._centerContainer.x;
            var center_y = target._centerContainer.y;
            if (target._isMoveLayer == true) {
                target._centerContainer.setPosition(center_x + disX, center_y + disY);
            }
            
            this._touchX = touchPoint.x;
            this._touchY = touchPoint.y;
        }
        

    },
    onTouchEnded:function (touch, event) {
        var target = event.getCurrentTarget();
        var size = cc.winSize;
        var touchPoint = touch.getLocation();
        if (target.isTouchListener == true) { 
            var judge = (target._centerContainer.y - size.height/2) / (target._centerContainer.x - size.width/2)
            var distance_moveX = Math.abs(target._centerContainer.x - size.width/2);
            if (target._isMoveLayer == true) {
                target.isTouchListener = false;
                if (distance_moveX > 60) {
                    if (target._centerContainer.x > size.width/2) {
                        
                        if (target._is_ture == true) {
                            var action_time = target.moveRightCenter(judge);
                            target.rightHandle = function () {
                                target._rightBtnHandle(target._controller);
                            }
                            target.scheduleOnce(target.rightHandle, action_time);
                        }else {
                            target._centerContainer.setPosition(size.width/2, size.height/2);
                            target._rightBtnHandle(target._controller);
                        }
                    }else {
                        
                        if (target._is_ture == false) {
                            var action_time = target.moveLeftCenter(judge);
                            target.leftHandle = function () {
                                target._leftBtnHandle(target._controller);
                            }
                            target.scheduleOnce(target.leftHandle, action_time);
                        }else {
                            target._centerContainer.setPosition(size.width/2, size.height/2);
                            target._leftBtnHandle(target._controller);
                        }
                    }
                    target._isMoveLayer = false;
                }else {
                    target._centerContainer.setPosition(size.width/2, size.height/2);
                    target.isTouchListener = true;
                }
            }         
        }
    },
    moveRightCenter:function (rotate) {
        var size = cc.winSize;
        var center_x = this._centerContainer.x;
        var center_y = this._centerContainer.y;
        var disX = size.width * 3/2 - center_x;
        var disY = size.height / 2 - center_y;
        var array_pos = [
            cc.p(0, 0),
            cc.p(disX, disY)
        ];
        var fly = cc.CardinalSplineBy.create(0.3, array_pos, 0);
        var rote = cc.RotateBy.create(0.3, 360);
        var repeat = cc.Repeat.create(rote, 3);
        var spawn = cc.Spawn.create(fly, repeat);
        var callF = cc.CallFunc.create(function(){
            this._centerContainer.setRotation(0);
            this._centerContainer.stopAllActions();
            this._centerContainer.setPosition(size.width/2, size.height/2);
            this.isTouchListener = true;
        }, this);
        var seq = cc.Sequence.create(spawn, callF);
        this._centerContainer.runAction(seq);

        var right_time = 0.4;

        return right_time;
    },
    moveLeftCenter:function (rotate) {
        var size = cc.winSize;
        var center_x = this._centerContainer.x;
        var center_y = this._centerContainer.y;
        var disX = - size.width / 2 - center_x;
        var disY = size.height / 2 - center_y;
        var array_pos = [
            cc.p(0, 0),
            cc.p(disX, disY)
        ];
        var fly = cc.CardinalSplineBy.create(0.3, array_pos, 0);
        var rote = cc.RotateBy.create(0.3, -360);
        var repeat = cc.Repeat.create(rote, 3);
        var spawn = cc.Spawn.create(fly, repeat);
        var callF = cc.CallFunc.create(function(){
            this._centerContainer.setRotation(0);
            this._centerContainer.stopAllActions();
            this._centerContainer.setPosition(size.width/2, size.height/2);
            this.isTouchListener = true;
        }, this);
        var seq = cc.Sequence.create(spawn, callF);
        this._centerContainer.runAction(seq);

        var left_time = 0.4;
    
        return left_time;
    },

    setContainerPos: function () {
        var size = cc.winSize;
        this._centerContainer.setPosition(size.width/2, size.height/2);
    },
    setAllLayerVisible:function(isShow){
        this._topBg.setVisible(isShow);
        this._centerContainer.setVisible(isShow);
        this._bottomBg.setVisible(isShow);
        this._leftBtn.setVisible(isShow);
        this._leftBtn.setTouchEnabled(true);
        this._rightBtn.setTouchEnabled(true);
        this._helpText.setVisible(true);
    },

    testHideExperAndStar: function () {
        this._exper_bg.setVisible(false);
        this._loadingBar.setVisible(false);
        for (var i = 0; i < 3; i++) {
            this.starName[i].setVisible(false);
        };
        this._zero.setVisible(false);
    },

    settleAction: function () {
        this._centerContainer.stopAllActions();
        this._helpText.stopAllActions();
        this._isMoveLayer = false;
        this._centerContainer.setVisible(false);
        this._helpText.setVisible(false);
        this._leftBtn.setTouchEnabled(false);
        this._rightBtn.setTouchEnabled(false);
    },

    testDelView: function () {
         this._centerContainer.removeFromParent(true);
         this.removeFromParent(true);
    },

    setGuideHand: function () {
        var size = cc.winSize;
        var scale = size.width / 750;

        this.hand = new cc.Sprite(res.Helper_hand);
        this.hand.setAnchorPoint(cc.p(0.5, 1));
        this.hand.attr({
            x:size.width*0.5,
            y:this._centerContainer.y - this._colorSprite.height*0.5 - 30*scale,
            scale:scale,
        });
        this.addChild(this.hand, 6); 
    },

    addMoveArrow: function (direction) {
        var size = cc.winSize;
        var scale = size.width / 750;

        this.handArraw = new cc.Sprite(res.Helper_arrow_Left);
        this.handArraw.setAnchorPoint(cc.p(0.5, 1));
        this.handArraw.attr({
            x:size.width*0.5 - this._colorSprite.height*0.25*scale,
            y:this._centerContainer.y - this._colorSprite.height*0.5*scale - 30*scale,
            scale:scale,
        });
        this.addChild(this.handArraw, 2);

        var moveCCP = cc.p(0,0);
        if (direction == 1) {
            var flpx = cc.FlipX.create(true);
            this.handArraw.runAction(flpx);
            this.handArraw.x = size.width*0.5 + this._colorSprite.height*0.25*scale;
            moveCCP.x = this._colorSprite.width*0.5*scale;
        }else if (direction == 2) {
            moveCCP.x = -this._colorSprite.width*0.5*scale;
        }

        this.addHandAction(moveCCP);
    },

    addHandAction: function (ccp) {
        var size = cc.winSize;
        var scale = size.width / 750;
        this.hand.stopAllActions();

        var call = cc.CallFunc.create(function () {
            this.hand.setVisible(true);
        }, this);
        var move = cc.MoveBy.create(0.5, ccp);
        var call1 = cc.CallFunc.create(function () {
            this.hand.setVisible(false);
            this.hand.x = size.width*0.5;
        }, this);
        var delay = cc.DelayTime.create(0.5);
        var seq = cc.Sequence.create(call, move, call1, delay);
        var repeat = cc.RepeatForever.create(seq);

        this.hand.runAction(repeat);
    },

    addHandAction1: function (movePos) {
        var size = cc.winSize;
        var scale = size.width / 750;
        this.hand.stopAllActions();

        this.hand.x = movePos.x + 100*scale;
        this.hand.y = movePos.y;

        var move = cc.MoveTo.create(0.5, movePos);
        var delay1 = cc.DelayTime.create(0.3);
        var seq2 = cc.Sequence.create(move, delay1);
        this.hand.runAction(seq2);

        this.scheduleOnce(this.handClick,0.8);
    },

    handClick: function () {
        if (this.hand) {
            this.hand.stopAllActions();

            var scale1 = cc.ScaleTo.create(0.3, 0.8);
            var scale2 = cc.ScaleTo.create(0.3, 1.0);
            var seq1 = cc.Sequence.create(scale1, scale2);
            var repeat = cc.RepeatForever.create(seq1);
            this.hand.runAction(repeat);
        }
    },

    setGuideVisible: function (isShow) {
        this._progressBar.setVisible(isShow);
        this.testHideExperAndStar();
        this._rightCorrectIcon.setVisible(isShow);
        this._leftCorrectIcon.setVisible(isShow);
        this._helpText.setVisible(isShow);
    },
});

