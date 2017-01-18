
var SeabedMobilzeView = cc.LayerColor.extend({
    _touchCount:null,
    _gn_width:null,
    _beginAddOneFlag:null,
    ctor: function (bgColor) {
    	this._super();
        this.color = cc.color(195,218,241);
        
        var size = cc.winSize;
        var scaleX = size.width / 750;
        var scaleY = size.height / 1334;
        var scale;
        if (scaleX > scaleY) {
            scale = scaleX;
        }else {
            scale = scaleY;
        }

        var seabedBg = new cc.Sprite(res.seabed.seabed_bg_seabed);
        seabedBg.setAnchorPoint(cc.p(0.5, 0));
        seabedBg.attr({
            x:size.width/2,
            y:0,
            scale:scale
        });
        this.addChild(seabedBg);

        var seabedTop = new cc.Sprite(res.seabed.seabed_bg_03);
        seabedTop.setAnchorPoint(cc.p(0.5, 1));
        seabedTop.attr({
            x:size.width/2,
            y:size.height,
            scale:scale
        });
        this.addChild(seabedTop);

        this._beginAddOneFlag = false;
        this._touchCount = 0;

        this.init();

        return true;
    },

    init: function () {
    	this.initTop();
        this.addBubbles();
    	this.initGame();
        this.initAccountView();
        this.setTouch();
    },

    initTop: function () {

    	var size = cc.winSize;
    	var scaleX = size.width / 750;
        var scaleY = size.height / 1334;
        var scale;
        if (scaleX > scaleY) {
            scale = scaleX;
        }else {
            scale = scaleY;
        }

    	// top bg
        var topBg = new cc.Sprite(res.game_nav_pg);
        topBg.ignoreAnchorPointForPosition(false);
        topBg.setAnchorPoint(cc.p(0.5, 1));
        topBg.attr({
        	x:size.width/2,
        	y:size.height,
        	scale:scale,
        });
        topBg.setTag(101);
        this.addChild(topBg);

        var topGap = 15;
        
        //purse btn
       	this._purseBtn = new ccui.Button();
	    this._purseBtn.setTouchEnabled(true);
	    this._purseBtn.loadTextures(res.game_btn_suspend_n, res.game_btn_suspend_s, "");

	    this._purseBtn.ignoreAnchorPointForPosition(false);
        this._purseBtn.setAnchorPoint(cc.p(0.5, 0.5));

        var bgSize = topBg.getContentSize();
	    this._purseBtn.x = 70;
	    this._purseBtn.y = bgSize.height/2 - topGap;
	    topBg.addChild(this._purseBtn);
        //this._purseBtn.addTouchEventListener(this.onPauseBtnEvent ,this);


        //fish goal_number
        this._goal_number = new cc.LabelTTF("0", "Arial", 50);
        this._goal_number.setAnchorPoint(cc.p(1, 0.5));
        this._goal_number.attr({
            x: bgSize.width - 30,
            y: bgSize.height / 2 - topGap,
            scale:scale
        });
        this._goal_number.color = cc.color(70, 70, 70);
        topBg.addChild(this._goal_number);
        
        // x  label
        this.x_tag = new cc.LabelTTF("x", "Arial", 45);
        this.x_tag.setAnchorPoint(cc.p(1, 0));

        var goal_size = this._goal_number.getContentSize();
        this._gn_width = goal_size.width;
        var x_gap = 6;
        this.x_tag.attr({
            x: this._goal_number.x - goal_size.width - x_gap,
            y: this._goal_number.y - goal_size.height / 2,
            scale:scale
        });
        this.x_tag.color = cc.color(150, 150, 150);
        topBg.addChild(this.x_tag);

        //fish sprite
        
        this.goal_fish = new cc.Sprite(res.seabed.seabed_fish_green05);
        this.goal_fish.ignoreAnchorPointForPosition(false);
        this.goal_fish.setAnchorPoint(cc.p(1, 0.5));

        var x_size = this.x_tag.getContentSize();
        var fish_gap = 10;
        this.goal_fish.attr({
        	x:this.x_tag.x - x_size.width - fish_gap,
        	y:bgSize.height / 2 - topGap,
        	scale:0.7
        });
        topBg.addChild(this.goal_fish);

        var fish_flipX = cc.FlipX.create(true);
        this.goal_fish.runAction(fish_flipX);

        this.goal_fish.setVisible(false);
        this.x_tag.setVisible(false);
        this._goal_number.setVisible(false);

    },

    initGame: function () {
        this._fishLayer = new cc.Node();
        this.addChild(this._fishLayer,1);

    	var size = cc.winSize;
    	var scale = size.width / 750;
        
        //obstacle_left
    	this.obstacle_left = new cc.Sprite(res.seabed.seabed_obstacle);
        this.obstacle_left.ignoreAnchorPointForPosition(false);
        this.obstacle_left.setAnchorPoint(cc.p(1, 0));
        this.obstacle_left.attr({
        	x:0,
        	y:150,
        	scale:scale
        });
        this.obstacle_left.setTag(102);
        this.obstacle_left.setLocalZOrder(2);
        this.addChild(this.obstacle_left);

        //obstacle_right
        this.obstacle_right = new cc.Sprite(res.seabed.seabed_obstacle);
        this.obstacle_right.ignoreAnchorPointForPosition(false);
        this.obstacle_right.setAnchorPoint(cc.p(0, 0));
        this.obstacle_right.attr({
        	x:size.width,
        	y:150,
        	scale:scale
        });
        this.obstacle_right.setTag(103);
        this.obstacle_right.setLocalZOrder(2);
        this.addChild(this.obstacle_right);
        
        //fishbowl
    	this.fishbowl = new cc.Sprite(res.seabed.seabed_fishbowl);
        this.fishbowl.ignoreAnchorPointForPosition(false);
        this.fishbowl.setAnchorPoint(cc.p(0, 0));
        var bowl_height = 40;
        this.fishbowl.attr({
        	x:0,
        	y:bowl_height,
        	scale:scale
        });
        this.fishbowl.setTag(104);
        this.fishbowl.setLocalZOrder(2);
        this.addChild(this.fishbowl);
        this.fishbowl.setVisible(false);
        
        //select_fish
        this.select_fish = new cc.Sprite(res.seabed.seabed_fish_green05);
        this.select_fish.ignoreAnchorPointForPosition(false);
        this.select_fish.setAnchorPoint(cc.p(0.5, 0.5));
        var fishbowl_size = this.fishbowl.getContentSize();
        var bowl_gap = 5;
        this.select_fish.attr({
        	x:fishbowl_size.width / 2 - bowl_gap,
        	y:fishbowl_size.height / 2 - bowl_gap,
        });
        this.fishbowl.addChild(this.select_fish);

        var fish_flipX = cc.FlipX.create(true);
        this.select_fish.runAction(fish_flipX);

        this.select_fish.setVisible(false);
    },

    addBubbles: function () {
        var bubble = new ParticleBubble();
        this.addChild(bubble);
        bubble.gravityBubble();
    },

    onPauseBtnEvent: function (sender, type){

        switch (type) {
            case ccui.Widget.TOUCH_BEGAN:
                // cc.director.getRunningScene().removeAllChildren();
                var layer = new GameSetting();
                cc.director.getRunningScene().addChild(layer);
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

    getTouchCount: function (touchCount) {
        this._goal_number.setString(touchCount.toString());
        
        var gn_width = this._goal_number.getContentSize().width;
        if (this._gn_width < gn_width) {
            this.setGoalPosX(gn_width);
            this._gn_width = gn_width;
        }
        
    },

    setGoalPosX: function (gNWidth) {
        var x_gap = 6;
        var gn_posX = this._goal_number.getPositionX();
        var x_posX = gn_posX - gNWidth - x_gap;
        this.x_tag.x = x_posX;

        var fish_gap = 10;
        var x_size = this.x_tag.getContentSize();
        var gf_posX = x_posX - x_size.width - fish_gap;
        this.goal_fish.x = gf_posX;
    },

    showTouch: function (touchPos) {
        var size = cc.winSize;
        var scale = size.width / 750;

        var addOne = new cc.LabelTTF("+1", "Arial", 55);
        addOne.setAnchorPoint(cc.p(0.5, 0));
        addOne.attr({
            x: touchPos.x,
            y: touchPos.y + 15,
            scale:scale
        });
        addOne.color = cc.color(200, 200, 200);
        addOne.setLocalZOrder(3);
        this.addChild(addOne);
        addOne.setTag(11);
        this.touchFly(addOne);
    },

    touchFly: function (node) {
        var move_time = 0.5;
        
        var move = cc.MoveBy.create(move_time, cc.p(0, 100));
        var fOut = cc.FadeOut.create(move_time);

        var spawn = cc.Spawn.create(move, fOut);
        var callF = cc.CallFunc.create(function () {
            this.removeOne();
        }, this);

        var seq = cc.Sequence.create(spawn, callF);

        node.runAction(seq);
    },

    removeOne: function () {
        var one = this.getChildByTag(11);
        if (one) {
            one.stopAllActions();
            one.removeFromParent(true);
        }
    },

    onTouchBegan:function (touch, event) {
        var target = event.getCurrentTarget();
        if(target._beginAddOneFlag == true){            
            var touchPoint = touch.getLocation();
            target.showTouch(touchPoint);
            target._touchCount = target._touchCount + 1;
            target.getTouchCount(target._touchCount);
            target._handle(target._delelgate);
        }
        return true;  
    },

    onTouchMoved:function (touch, event) {
    },

    onTouchEnded:function (touch, event) {
    },

    handleGuide: function (delegate, handle) {
        this._delelgate = delegate;
        this._handle = handle;
    },

    setGoalFish: function (fishRes) {
      this.goal_fish.setTexture(fishRes);
      this.select_fish.setTexture(fishRes);
    },

    setBowlPos: function (posX, posY) {
        this.fishbowl.x = posX;
        this.fishbowl.y = posY;
        this.fishbowl.setVisible(true);
    },
    
    setShowGFish: function () {
        this.x_tag.setVisible(true);
        this._goal_number.setVisible(true);
        this.goal_fish.setVisible(true)
        this.select_fish.setVisible(true);
    },

    initAccountView:function(){
        var size = cc.winSize;
        var scale = size.width / 750;
        
        //circle_touch
        this.circle_touch = new cc.Sprite(res.seabed.seabed_bg_settlement01);
        this.circle_touch.setAnchorPoint(cc.p(0.5, 0.5));
        this.circle_touch.attr({
            x:size.width/2,
            y:size.height* 11/16,
            scale:scale
        });
        this.addChild(this.circle_touch);
        
        //g_fish
        this.g_fish = new cc.Sprite(res.seabed.seabed_bg_settlement01);
        this.g_fish.ignoreAnchorPointForPosition(false);
        this.g_fish.setAnchorPoint(cc.p(0.5, 0.5));

        var c_size = this.circle_touch.getContentSize();
        var fish_gap = 10;
        this.g_fish.attr({
            x:c_size.width / 2,
            y:c_size.height * 9 / 16,
            scale:scale
        });
        this.circle_touch.addChild(this.g_fish);
        
        var fish_flipX = cc.FlipX.create(true);
        this.g_fish.runAction(fish_flipX);
        
        //touch_count
        this.touch_count = new cc.LabelTTF("0", "Arial", 45);
        this.touch_count.setAnchorPoint(cc.p(0.5, 0.5));
        this.touch_count.attr({
            x: c_size.width / 2,
            y: c_size.height / 5,
            scale:scale
        });
        this.touch_count.setString(this._touchCount.toString());
        this.touch_count.color = cc.color(255, 255, 255);
        this.circle_touch.addChild(this.touch_count);

        //circle_goal
        this.circle_goal = new cc.Sprite(res.seabed.seabed_bg_settlement02);
        this.circle_goal.setAnchorPoint(cc.p(0.5, 0.5));
        this.circle_goal.attr({
            x:size.width/2,
            y:size.height* 7/16,
            scale:scale
        });
        this.addChild(this.circle_goal);

        var cg_size = this.circle_goal.getContentSize();

        //goal_count
        this.goal_count = new cc.LabelTTF("0", "Arial", 60);
        this.goal_count.setAnchorPoint(cc.p(0.5, 0.5));
        this.goal_count.attr({
            x: cg_size.width / 2,
            y: cg_size.height / 2,
            scale:scale
        });
        this.goal_count.color = cc.color(0, 0, 0);
        this.circle_goal.addChild(this.goal_count);  

        this.circle_touch.setVisible(false);
        this.circle_goal.setVisible(false);
    },

    setAccountView: function (gfRes) {
        this.setAllNodeVisible(false);                
        this.g_fish.setTexture(gfRes);          
        this.goal_count.setString("0");
        this.touch_count.setString(this._touchCount.toString());  
        this.circle_touch.setVisible(true);
        this.circle_goal.setVisible(true); 
    },

    getGoalCount: function (gCount) {
        this.goal_count.setString(gCount.toString());
    },

    setTouch: function () {
        cc.eventManager.addListener({
            event: cc.EventListener.TOUCH_ONE_BY_ONE,
            swallowTouches: false,
            onTouchBegan: this.onTouchBegan,
            onTouchMoved: this.onTouchMoved,
            onTouchEnded: this.onTouchEnded
        }, this); 
    },

    goalFishHide: function () {
        this._goal_number.setVisible(false);
        this.x_tag.setVisible(false);
        this.goal_fish.setVisible(false);
    },

    goalFishShow: function () {
        this._goal_number.setVisible(true);
        this.x_tag.setVisible(true);
        this.goal_fish.setVisible(true);
    },

    setAllNodeVisible:function(isShow){
        for (var i = 101; i < 105; i++) {
            this.getChildByTag(i).setVisible(isShow);
        };
    },

    addGuideHand: function () {
        var size = cc.winSize;
        var scale = size.width / 750;

        this.hand = new cc.Sprite(res.Helper_hand);
        this.hand.setAnchorPoint(cc.p(0.5, 0.5));
        this.hand.attr({
            x:size.width/2 + 100,
            y:size.height* 0.5 - 200,
            scale:scale
        });
        this.addChild(this.hand, 3);

        this.addHandAction();
    },

    addHandAction: function () {
        var size = cc.winSize;
        var scale = size.width / 750;
        this.hand.stopAllActions();

        var move = cc.MoveBy.create(0.3, cc.p(-100, 100));
        var delay1 = cc.DelayTime.create(0.3);
        var call = cc.CallFunc.create(function () {
            this.handClick();
        }, this);
        var seq2 = cc.Sequence.create(move, delay1, call);
        this.hand.runAction(seq2);
    },

    handClick: function () {
        var size = cc.winSize;
        var scale = size.width / 750;

        if (this.hand) {
            this.hand.stopAllActions();

            var scale1 = cc.ScaleTo.create(0.3, 0.8);
            var call = cc.CallFunc.create(function () {
                this.showTouch(cc.p(cc.winSize.width/2, cc.winSize.height* 0.5 - 100 + this.hand.height*scale*0.5));
            }, this);
            var scale2 = cc.ScaleTo.create(0.3, 1.0);
            var seq1 = cc.Sequence.create(scale1, call, scale2);
            var repeat = cc.RepeatForever.create(seq1);
            this.hand.runAction(repeat); 
        }
    },

});