var StackChartView = cc.LayerColor.extend({
	_topNodeArray:null,
	_topNumber:null,
	_isClick:null,
    _starsList:null,
    _clickSize:null,
	ctor:function (bgColor) {
        this._super();

        this.color = bgColor;

        this._topNodeArray = new Array();
        this._starsList = new Array();
        this._isClick = true;

        this.init();

        return true;
    },

    init: function () {
    	this.initTop();
    	this.initCenter();
    	this.initBottom();
    },

    initTop: function () {
    	var size = cc.winSize;
        var scale = size.width / 750;
    	// top bg
        this.topBg = new cc.Sprite(res.game_nav_pg);
        this.topBg.ignoreAnchorPointForPosition(false);
        this.topBg.setAnchorPoint(cc.p(0.5, 1));
        this.topBg.attr({
        	x:size.width/2,
        	y:size.height,
        	scale:scale
        });
        this.addChild(this.topBg);
        
        var topGap = 15;

        //purse btn
       	this._purseBtn = new ccui.Button();
	    this._purseBtn.setTouchEnabled(true);
	    this._purseBtn.loadTextures(res.game_btn_suspend_n, res.game_btn_suspend_s, "");

	    this._purseBtn.ignoreAnchorPointForPosition(false);
        this._purseBtn.setAnchorPoint(cc.p(0.5, 0.5));

        var bgSize = this.topBg.getContentSize();
	    this._purseBtn.x = 70;
	    this._purseBtn.y = bgSize.height * scale /2 - topGap;
	    this.topBg.addChild(this._purseBtn);

	    //progress bar long
        this._progressBar = new cc.ProgressTimer(new cc.Sprite(res.stackChart.stack_nva_progressBar));
        this._progressBar.ignoreAnchorPointForPosition(false);
        this._progressBar.setAnchorPoint(cc.p(0.5, 1));

        this._progressBar.type = cc.ProgressTimer.TYPE_BAR;
        this._progressBar.midPoint = cc.p(1, 0);
        this._progressBar.barChangeRate = cc.p(1, 0);
        this._progressBar.x = bgSize.width/2;
        this._progressBar.y = 0;

        this.topBg.addChild(this._progressBar);
        this._progressBar.setPercentage(100);

        //exper_progress and star        
        //experBg
        this._exper_bg = new cc.Sprite(res.stackChart.stack_nva_progressBar_bg);
        this._exper_bg.setAnchorPoint(cc.p(1, 0.5));
        this._exper_bg.attr({
            x: bgSize.width  * 14 / 15,
            y: bgSize.height / 4,
            scale:scale
        });
        this.topBg.addChild(this._exper_bg, 0);
       
        //_loadingBar
        this._loadingBar = new ccui.LoadingBar();
        this._loadingBar.loadTexture(res.stackChart.stack_nva_progressBar_bg02);
        this._loadingBar.setDirection(ccui.LoadingBar.TYPE_LEFT);
        this._loadingBar.setPercent(0);
        this._loadingBar.setAnchorPoint(cc.p(1, 0.5));
        this._loadingBar.x = bgSize.width  * 14 / 15;
        this._loadingBar.y = bgSize.height / 4;
        this._loadingBar.setScale(scale);
        this.topBg.addChild(this._loadingBar);

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
            this.topBg.addChild(star, 0);
            this._starsList.push(star);
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
        this.topBg.addChild(this._zero);
    },

    initCenter: function () {
    	this.initLaterlView();
    	this.initTopView();
    },

    initLaterlView: function () {
    	var size = cc.winSize;
        var scale = size.width / 750;

    	this.laterlContainer = new cc.Node();
    	this.addChild(this.laterlContainer);

    	//laterViewBg
    	var laterViewBg = new cc.Sprite(res.stackChart.stacks_bkg);
    	laterViewBg.setScale(scale, scale*5/6);
    	this.laterlContainer.addChild(laterViewBg);

    	this.laterlContainer.setAnchorPoint(cc.p(0.5, 1));
    	this.laterlContainer.width = laterViewBg.width * scale;
    	this.laterlContainer.height = laterViewBg.height * scale * 5/6;

    	this.laterlContainer.y = size.height - this.topBg.height * scale - 20 - this._progressBar.height;
    	this.laterlContainer.x = size.width*0.5;

    	laterViewBg.x = this.laterlContainer.width * 0.5;
    	laterViewBg.y = this.laterlContainer.height * 0.5;

    	var tipLbl = new cc.LabelTTF("侧视图", "Arial", 40);
    	tipLbl.anchorX = 0.5;
    	tipLbl.anchorY = 0;
        tipLbl.x = this.laterlContainer.width * 0.5;
        tipLbl.y = 10;
        tipLbl.color = cc.color(157, 126, 15);
        this.laterlContainer.addChild(tipLbl);

        this.tipHeight = tipLbl.y + tipLbl.height;

    },

    initTopView: function () {
    	var size = cc.winSize;
        var scale = size.width / 750;

    	this.topContainer = new cc.Node();
    	this.addChild(this.topContainer);

    	//topViewBg
    	var topViewBg = new cc.Sprite(res.stackChart.stacks_bkg);
    	topViewBg.setScale(scale, scale*4/3);
    	this.topContainer.addChild(topViewBg);

    	this.topContainer.setAnchorPoint(cc.p(0.5, 1));
    	this.topContainer.width = topViewBg.width * scale;
    	this.topContainer.height = topViewBg.height * scale * 4/3;

    	this.topContainer.y = this.laterlContainer.y - this.laterlContainer.height - 40;
    	this.topContainer.x = size.width*0.5;

    	topViewBg.x = this.topContainer.width * 0.5;
    	topViewBg.y = this.topContainer.height * 0.5;

    	var tipLbl = new cc.LabelTTF("顶视图", "Arial", 40);
    	tipLbl.anchorX = 0.5;
    	tipLbl.anchorY = 0;
        tipLbl.x = this.topContainer.width * 0.5;
        tipLbl.y = 10;
        tipLbl.color = cc.color(157, 126, 15);
        this.topContainer.addChild(tipLbl);
    },

    initBottom: function () {
    	var size = cc.winSize;
        var scale = size.width / 750;

        var bottomHeight = this.topContainer.y - this.topContainer.height - 30;

        this.tipBg = new cc.Sprite(res.game_nav_pg);
        this.tipBg.ignoreAnchorPointForPosition(false);
        this.tipBg.setAnchorPoint(cc.p(0.5, 0));
        this.tipBg.attr({
            x:size.width/2,
            y:0,
        });
        var scaleY = bottomHeight / (this.tipBg.height * scale);
        if (scaleY > 1) {
            scaleY = scale;
        }
        this.tipBg.setScale(scale, scaleY);

        this.addChild(this.tipBg);

        var tipLbl = new cc.LabelTTF("选择与侧视图比例与形状相匹配的顶视图。", "Arial", 35);
        tipLbl.x = this.tipBg.width*0.5;
        tipLbl.y = this.tipBg.height*0.5;
        tipLbl.color = cc.color(157, 126, 15);
        tipLbl.setScale(scaleY);
        //tipLbl._setBoundingWidth(this.tipBg.width - 60);
        this.tipBg.addChild(tipLbl);
    },

    showLaterlView: function (laterlLength, laterlArray) {
    	var size = cc.winSize;
        var scale = size.width / 750;

    	var laterlHeight = this.laterlContainer.height - this.tipHeight;
    	var laterlNode = new cc.Node();
    	laterlNode.attr({
    		anchorX:0.5,
    		anchorY:0.5,
    		width:this.laterlContainer.width,
    		height:laterlHeight,
    		x:this.laterlContainer.width*0.5,
    		y:laterlHeight*0.5 + this.tipHeight,
    	});
    	laterlNode.setTag(111);
    	this.laterlContainer.addChild(laterlNode);

        var laterH = 0;
        this._showTime = 0;
        this.laterViewHeight = 10;

        for (var i = 0; i < laterlLength; i++) {
            var scaleValue = laterScale[laterlArray[i].sideIndex];
            var laterlSprite = new cc.Sprite(laterlArray[i].sideRes);
            laterlSprite.attr({
                anchorY:0,
            });
            laterlSprite.setScale(scaleValue*scale, scale*2/3);
            laterlSprite.x = laterlNode.width*0.5;
            laterlSprite.y = 10 + laterH;
            laterlNode.addChild(laterlSprite);
            //laterlSprite.setVisible(false);
            laterlSprite.setScale(0);

            laterH = laterH + laterlSprite.height * scale*2/3;

            this.laterViewHeight = this.laterViewHeight + laterlSprite.height * scale*2/3;

            this._showTime = this._showTime + 0.05;
            var scaleX = scaleValue*scale;
            scaleY = scale*2/3;
            this.showLaterlAction(laterlSprite, this._showTime, scaleX, scaleY);
        };
    },

    showLaterlAction: function (sprite, dTime, sX, sY) {
        var delay = cc.DelayTime.create(dTime);
        var scaleTo = cc.ScaleTo(0.05, sX, sY);
        var seq = cc.Sequence.create(delay, scaleTo);
        sprite.runAction(seq);
    },

    showTopsView: function (topNumber, topArray) {
    	var posArray;
    	if (topNumber == 2) {
    		posArray = topNumberPos[0].pos;
    	}else if (topNumber == 3) {
    		posArray = topNumberPos[1].pos;
    	}else if (topNumber == 4) {
    		posArray = topNumberPos[2].pos;
    	}
    	for (var i = 0; i < topNumber; i++) {
    		var topLength = topArray[i].length;
    		this.addTopView(topLength, topArray[i], posArray[i+1]);
    	};
    	this._topNumber = topNumber;
    	this.addEventListener();
    },

    addTopView: function (topLength, chartArray, posArray) {
    	var size = cc.winSize;
        var scale = size.width / 750;

    	var chartHeight = this.topContainer.height - this.tipHeight;
    	var chartNode = new cc.Node();
    	chartNode.attr({
    		anchorX:0.5,
    		anchorY:0.5,
    		x:this.topContainer.width * posArray._x,
    		y:chartHeight*posArray._y + this.tipHeight,
    	});
    	
    	this.topContainer.addChild(chartNode);
    	this._topNodeArray.push(chartNode);

        var chartSprite = new cc.Sprite(res.stackChart.stack_large_0);
        chartNode.width=chartSprite.width*scale*1.2;
        chartNode.height=chartSprite.height*scale*1.2;

    	for (var i = 0; i < topLength; i++) {
            var scaleValue = topScale[chartArray[i].sizeIndex];
    		var chartSprite = new cc.Sprite(chartArray[i].diskRes);
    		chartSprite.attr({
    			anchorY:0.5,
    			scale:scale*scaleValue*1.2,
    		});
    		chartSprite.x = chartNode.width*0.5;
    		chartSprite.y = chartNode.height*0.5;
    		chartNode.addChild(chartSprite);
    	};
    },

    addEventListener: function () {
    	cc.eventManager.addListener({
            event: cc.EventListener.TOUCH_ONE_BY_ONE,
            swallowTouches: false,
            onTouchBegan: this.onTouchBegan,
            onTouchMoved: this.onTouchMoved,
            onTouchEnded: this.onTouchEnded
        }, this);
    },

    onTouchBegan: function (touch, event) {
    	var target = event.getCurrentTarget();
    	var pos = target.convertToNodeSpace(touch.getLocation());
    	for (var i = 0; i < target._topNumber; i++) {
    		var topPos = target.topContainer.convertToWorldSpace(target._topNodeArray[i].getPosition());
    		var size = target._topNodeArray[i].getContentSize();
    		topPos.x = topPos.x - size.width*0.5;
    		topPos.y = topPos.y - size.height*0.5;
    		var targetRect = cc.rect(topPos.x,topPos.y, size.width, size.height);
	        if (target._isClick == true && cc.rectContainsPoint(targetRect,pos)) {
	        	if (typeof(target._settleHandle) == 'function') {
	        		target._isClick = false;
	        		target._settleHandle(target._settleDelegate, i);
	        	}
	        }
    	};
    	return true;
    },

    onTouchMoved: function (touch, event) {
    },
    onTouchEnded: function (touch, event) {
    },

    setSettleHandle: function (delegate, handle) {
    	this._settleDelegate = delegate;
    	this._settleHandle = handle;
    },

    showChooseSettle: function (judgeSettle) {
    	var size = cc.winSize;
        var scale = size.width / 750;

        this.rightIcon = new cc.Sprite(res.stackChart.stack_sure);
        this.rightIcon.ignoreAnchorPointForPosition(false);
        this.rightIcon.setAnchorPoint(cc.p(0.5, 1));
        this.rightIcon.attr({
            x:this.topContainer.width*0.5,
            y:this.topContainer.height,
            scale:scale
        });
        this.topContainer.addChild(this.rightIcon);

        if (judgeSettle == false) {
            this.removeJudegTip();
            this.showErrorLayer();
            // this.rightIcon.setTexture(res.stackChart.stack_wrong);
        }
    },

    showErrorLayer: function() {
        if (this._errorLayer == null){
            this._errorLayer = new cc.Sprite(res.stackChart.stack_wrong);
            this._errorLayer.setAnchorPoint(cc.p(0.5, 1));
            this._errorLayer.x = this.topContainer.width / 2;
            this._errorLayer.y = this.topContainer.height;
            this.topContainer.addChild(this._errorLayer);

            //add progress
            this._errorLayer.progressBar = new cc.ProgressTimer(new cc.Sprite(res.stackChart.stack_wrong_bg02));
            this._errorLayer.progressBar.type = cc.ProgressTimer.TYPE_RADIAL;
            this._errorLayer.progressBar.x = this._errorLayer.width/2;
            this._errorLayer.progressBar.y = this._errorLayer.height/2;
            this._errorLayer.addChild(this._errorLayer.progressBar);
        }

        this._errorLayer.setVisible(true);
        this._errorLayer.x =  this.topContainer.width * 3/2;
        this._errorLayer.progressBar.setPercentage(0);

        var point1 =cc.p(this.topContainer.width/2 - 50,this.topContainer.height);;
        var point2 =cc.p(this.topContainer.width/2,this.topContainer.height);
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

    removeJudegTip: function () {
        if (this.rightIcon != null) {
            this.rightIcon.removeFromParent(true);
        }
		this.rightIcon = null;
    },

    setLaterlAndTopView: function () {
    	var laterlNode = this.laterlContainer.getChildByTag(111);
        if (laterlNode != null) {
            laterlNode.removeAllChildren(true);
            laterlNode.removeFromParent(true);
        }
    	
    	for (var i = 0; i < this._topNumber; i++) {
    		this._topNodeArray[i].removeAllChildren(true);
    		this._topNodeArray[i].removeFromParent(true);
    		this._topNodeArray[i] = null;
    	};
    	this._topNodeArray = [];
    	this._topNumber = 0;
    },

    testHideExperAndStar: function () {
        this._exper_bg.setVisible(false);
        this._loadingBar.setVisible(false);
        for (var i = 0; i < 3; i++) {
            this._starsList[i].setVisible(false);
        };
        this._zero.setVisible(false);
    },

    initExper:function () {
        this._loadingBar.setPercent(0);
        for (var i = 0; i < 3; i++) {
            this._starsList[i].setTexture(res.game_star_small_01);
        };
        this._zero.setString('0');
        var size = cc.winSize;
        var scale = size.width / 750;
        var exper_width = this._exper_bg.getContentSize().width * scale;
        this._zero.x = this._exper_bg.x - exper_width;
    },

    setViewVisible: function (isShow) {
    	this.laterlContainer.setVisible(isShow);
    	this.topContainer.setVisible(isShow);
    	this.tipBg.setVisible(isShow);
    	this.topBg.setVisible(isShow);
    },

    removeGame: function () {
        this._exper_bg.removeFromParent(true);
        this._loadingBar.removeFromParent(true);
        for (var i = 0; i < 3; i++) {
            this._starsList[i].removeFromParent(true);
            this._starsList[i] = null;
        };
        this._zero.setVisible(false);
    	this.laterlContainer.removeAllChildren(true);
    	this.laterlContainer.removeFromParent(true);
    	this.topContainer.removeAllChildren(true);
    	this.topContainer.removeFromParent(true);
    	this.tipBg.removeAllChildren(true);
    	this.tipBg.removeFromParent(true);
    	this.topBg.removeAllChildren(true);
    	this.topBg.removeFromParent(true);
    },

    setGuideHand: function (targetPos) {
        var size = cc.winSize;
        var scale = size.width / 750;

        this.hand = new cc.Sprite(res.Helper_hand);
        this.hand.setAnchorPoint(cc.p(0.5, 1));
        this.hand.attr({
            x:targetPos.x + 50*scale,
            y:targetPos.y - 100*scale,
            scale:scale,
        });
        this.topContainer.addChild(this.hand);

        this.addHandAction();
    },

    addHandAction: function () {
        var size = cc.winSize;
        var scale = size.width / 750;
        this.hand.stopAllActions();

        var move = cc.MoveBy.create(0.3, cc.p(-50*scale, 100*scale));
        var delay1 = cc.DelayTime.create(0.3);
        var seq2 = cc.Sequence.create(move, delay1);
        this.hand.runAction(seq2);

        this.scheduleOnce(this.handClick,0.6);
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

});