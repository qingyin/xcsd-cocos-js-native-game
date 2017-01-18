
var SevenPuzzleView = cc.LayerColor.extend({
	_circle_rotate:null,
	_isCircle_exist:null,
    ctor:function (bgColor) {
        this._super();

        this.color = bgColor;
        
        this.init();

        return true;
    },

    init: function () {
        this.initTop();
        this.initBottom();
        this.initCenter();
    },

    initPoint: function (point) {
        // this.draw = new cc.DrawNode();
        // this.addChild(this.draw);



        // for (var i = 0; i < 64; i++) {
        //     var wordSpacePos = this.floor_puzzle.convertToWorldSpace(cc.p(point[i]._x, point[i]._y));
        //     this.draw.drawDot(wordSpacePos, 5, cc.color(255,255,255,255));
        // };
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

        // //elementBtn
        // this.elementBtn = new ccui.Button();
        // this.elementBtn.setTouchEnabled(true);
        // this.elementBtn.loadTextures(res.game_btn_suspend_n, res.game_btn_suspend_s, "");

        // this.elementBtn.ignoreAnchorPointForPosition(false);
        // this.elementBtn.setAnchorPoint(cc.p(0.5, 0.5));

        // var bgSize = this.topBg.getContentSize();
        // this.elementBtn.x = bgSize.width - 70;
        // this.elementBtn.y = bgSize.height * scale /2 - topGap;
        // this.topBg.addChild(this.elementBtn);

        //progress bar long  res.colorMachine.cm_nav_progressBar_
	    this._progressBar = new cc.ProgressTimer(new cc.Sprite(res.tangram.cm_nav_progressBar_));
	    this._progressBar.ignoreAnchorPointForPosition(false);
        this._progressBar.setAnchorPoint(cc.p(0.5, 1));

        this._progressBar.type = cc.ProgressTimer.TYPE_BAR;
        this._progressBar.midPoint = cc.p(1, 0);
        this._progressBar.barChangeRate = cc.p(1, 0);
        this._progressBar.x = this.topBg.width/2;
        this._progressBar.y = 0;
        this.topBg.addChild(this._progressBar);
        this._progressBar.setPercentage(100);
    },

    initBottom: function () {
        var size = cc.winSize;
        var scale = size.width / 750;

        this._bottom = new cc.Sprite(res.tangram.tangram_bg_a);
        this._bottom.ignoreAnchorPointForPosition(false);
        this._bottom.setAnchorPoint(cc.p(0, 0));
        var puzzle_size = this._bottom.getContentSize();
        this._bottom.x = 0;
        this._bottom.y = 0;
        this._bottom.setScale(scale);
        this.addChild(this._bottom);
    },

    initCenter: function () {
        var floorHeight = 884;
        var size = cc.winSize;
        var scale = size.width / 750;

        var bgSize = this.topBg.getContentSize();
        var bottom_size = this._bottom.getContentSize();
        //this._progressBar.height
        var center_heigth = size.height - bgSize.height*scale - bottom_size.height*scale - this._progressBar.height;
        
    	this.floor_puzzle = new cc.Sprite(res.tangram.tangram_bgA_01);
        this.floor_puzzle.ignoreAnchorPointForPosition(false);
        this.floor_puzzle.setAnchorPoint(cc.p(0.5, 0.5));
        var puzzle_size = this.floor_puzzle.getContentSize();
        this.floor_puzzle.x = size.width / 2;
        this.floor_puzzle.y = center_heigth / 2 + bottom_size.height*scale;
        this._graph_scale = center_heigth / floorHeight;

        if (scale < this._graph_scale) {
        	this._graph_scale = scale;
        } else {
        	if (this._graph_scale >= 1) {
        		this._graph_scale = 1;
        	}
        }
        this.floor_puzzle.setScale(this._graph_scale);
        this.addChild(this.floor_puzzle);

        var isLow = false;
        var disZero;
        for (var i = 0; i < graph_number; i++) {
            var bottom_graph = new cc.Sprite(seven_graph[i+1].res[1]);
            bottom_graph.ignoreAnchorPointForPosition(false);
            bottom_graph.setAnchorPoint(cc.p(0, 0));
            var gap_scale_x = bottom_graph.width * (scale - this._graph_scale);
            var gap_scale_y = bottom_graph.height * (scale - this._graph_scale);
            bottom_graph.x = size.width * seven_graph[i+1].pos._x / 100 + gap_scale_x / 2;
            bottom_graph.y = size.height * seven_graph[i+1].pos._y / 100 - gap_scale_y / 2;
            bottom_graph.setScale(this._graph_scale);
            this.addChild(bottom_graph);
            if (i == 6) {
                bottom_graph.x = bottom_graph.x - bottom_graph.width * this._graph_scale/2 * (Math.sqrt(2) - 1);
                bottom_graph.y = bottom_graph.y + bottom_graph.height * this._graph_scale/2;
                bottom_graph.setRotation(45);
               
            }

            if (i == 0 && bottom_graph.y <= 10) {
                isLow = true;
                disZero = 25 - bottom_graph.y;
            }

            if (isLow == true) {
                bottom_graph.y = bottom_graph.y + disZero;
            }
        };  
    },

    addChildCell: function (graph, zorder, id) {
        this.addChild(graph, zorder, id);
    },

    addCircleRotate: function (node) {
        this._circle_rotate = new cc.Sprite(res.tangram.tangram_bnt_rotate);
        this._circle_rotate.ignoreAnchorPointForPosition(false);
        this._circle_rotate.setAnchorPoint(cc.p(0.5, 0.5));
        var puzzle_size = node.graph_puzzle.getContentSize();
        this._circle_rotate.x = puzzle_size.width *  this._graph_scale / 2;
        this._circle_rotate.y = puzzle_size.height * this._graph_scale / 2;
        this._circle_rotate.setScale(this._graph_scale);
        node.addChild(this._circle_rotate);
        this._isCircle_exist = true;
    },

    setViewMember: function (limitTime, floorRes, percentage) {
        this.floor_puzzle.setTexture(floorRes);
        this._isCircle_exist = false;
        this._progressBar.setPercentage(percentage);
        var fromTo = cc.progressTo(limitTime, 0);
        this._progressBar.runAction(fromTo);
    },

    convertToBgNodeSpace:function(pos){
    	return this.floor_puzzle.convertToNodeSpace(pos);
    },

    setGuideHand: function (pos) {
        var size = cc.winSize;
        var scale = size.width / 750;

        this.hand = new cc.Sprite(res.Helper_hand);
        this.hand.setAnchorPoint(cc.p(0.5, 1));
        this.hand.attr({
            x:pos.x,
            y:pos.y,
            scale:scale,
        });
        this.addChild(this.hand, 10);
    },

    setGuideArraw: function (pos, arrowRes) {
        var size = cc.winSize;
        var scale = size.width / 750;

        this.handArraw = new cc.Sprite(arrowRes);
        this.handArraw.setAnchorPoint(cc.p(0.5, 0.5));
        this.handArraw.attr({
            x:pos.x,
            y:pos.y,
            scale:scale,
        });
        this.addChild(this.handArraw, 9);
    },

    addHandAction1: function (movesPos) {
        var size = cc.winSize;
        var scale = size.width / 750;

        var action = [];
        action[action.length] = cc.DelayTime.create(0.5);
        action[action.length] = cc.MoveBy.create(0.5, movesPos); 
        action[action.length] = cc.CallFunc.create(function () {
            this.hand.setVisible(false);
            this.handArraw.setVisible(false);
        }, this);

        this.hand.runAction(cc.sequence(action));
    },

    addHandAction2: function (posArray) {
        var size = cc.winSize;
        var scale = size.width / 750;

        this.hand.stopAllActions();

        var action = [];
        action[action.length] = cc.CallFunc.create(function () {
            this.hand.setVisible(true);
            this.handArraw.setVisible(true);
        }, this);
        action[action.length] = cc.DelayTime.create(0.2);
        action[action.length] = cc.cardinalSplineBy(0.5, posArray, 0);
        action[action.length] = cc.CallFunc.create(function () {
            this.hand.setVisible(false);
            this.handArraw.setVisible(false);
        }, this);
        this.hand.runAction(cc.sequence(action));
    },

    addHandAction3: function (movesPos) {
        var size = cc.winSize;
        var scale = size.width / 750;

        this.hand.stopAllActions();

        var action = [];
        action[action.length] = cc.CallFunc.create(function () {
            this.hand.setVisible(true);
            this.handArraw.setVisible(true);
        }, this);
        action[action.length] = cc.DelayTime.create(0.2);
        action[action.length] = cc.MoveBy.create(0.5, movesPos);
        action[action.length] = cc.CallFunc.create(function () {
            this.hand.removeFromParent(true);
            this.handArraw.removeFromParent(true);
        }, this);
        this.hand.runAction(cc.sequence(action));
    },

    addHandAction4: function () {
        var size = cc.winSize;
        var scale = size.width / 750;

        this.hand.stopAllActions();
        this.hand.setVisible(true);

        var scale1 = cc.ScaleTo.create(0.2, 0.8);
        var scale2 = cc.ScaleTo.create(0.1, 1.0);
        var seq1 = cc.Sequence.create(scale1, scale2);
        var repeat = cc.Repeat.create(seq1, 2);
        this.hand.runAction(repeat);
    },

    setHandPos: function (pos) {
        this.hand.setPosition(pos);
    },

    setArrowPos: function (pos) {
        this.handArraw.setPosition(pos);
    },

    setArrowPic: function (res) {
        this.handArraw.setTexture(res);
    },

    setArrowFade: function (isFlip) {
        var flipx = cc.FlipX.create(isFlip);
        this.handArraw.runAction(flipx);
    },

    setArrowRotate: function (angle) {
        this.handArraw.setRotation(angle);
    },

});