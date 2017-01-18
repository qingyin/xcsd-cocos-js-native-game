
var NumberCrashView = cc.LayerColor.extend({
    starName:null,
    ctor:function (bgColor) {
        //////////////////////////////
        // 1. super init first
        this._super();

        this.starName = new Array();
        
        this.winSize = cc.winSize;
        this.view_scaleX = this.winSize.width / 750;

        this.attr({
            x:0,
            y:0,
            width: this.winSize.width ,
            height: this.winSize.height
        });
        
        this.color = bgColor;

        this.init();
    },
    init:function(){
        this.initToppBar();
        this.initTopExper();
        this.initGameNode();
        this.initBottom();
        this.initBottomLabel();
        this.initEvnent();
    },
    initToppBar:function(){

        var scale = this.winSize.width / 750;
        
        this._topbar = new cc.Node();
        this._topbar.ignoreAnchorPointForPosition(false);
        this._topbar.setAnchorPoint(cc.p(0, 1));
        this._topbar.attr({
            x: 0,
            y: this.winSize.height
        });
        this.addChild(this._topbar, 0);

        //topBg
        this._topbar_bg = new cc.Sprite(res.game_nav_pg);
        this._topbar.addChild(this._topbar_bg, 0);
        this._topbar_bg.setScale(scale);

        var topbar_bg_size = this._topbar_bg.getContentSize();
        var topbar_width = topbar_bg_size.width * scale;
        var topbar_height = topbar_bg_size.height * scale;

        this._topbar.setContentSize(topbar_width, topbar_height);
        //this._topbar.setPositionY(this.winSize.height - topbar_height)
        this._topbar_bg.setPosition(topbar_width/2, topbar_height/2);

        //prompt
        this._prompt = new cc.LabelTTF("", "Arial", 24);
        this._prompt.setAnchorPoint(cc.p(0, 0));
        this._prompt.attr({
            x: topbar_width * 0.17,
            y: topbar_height / 4 - 11/2,
            scale:scale
        });
        this._prompt.color = cc.color(148, 169, 119);
        this._topbar.addChild(this._prompt);

    },
    initTopExper:function(){
        
        var scale = this.winSize.width / 750;
        var topbar_size = this._topbar.getContentSize();
        
        this._experNode = new cc.Node();
        this._experNode.ignoreAnchorPointForPosition(false);
        this._experNode.setAnchorPoint(cc.p(1, 0.5));
        this._experNode.attr({
            x: topbar_size.width  * 14 / 15,
            y: topbar_size.height / 4, 
            //scale:scale
        });
        this._experNode.setContentSize(321, 80);
        this._topbar.addChild(this._experNode, 0);
        
        var exper_size = this._experNode.getContentSize();
        
        //experBg
        this._exper_bg = new cc.Sprite(res.numberCrash.nc_nva_progressBar_bg);
        this._exper_bg.setAnchorPoint(cc.p(0.5, 0.5));
        this._exper_bg.attr({
            x: exper_size.width  / 2,
            y: exper_size.height / 2,
            scale:scale
        });
        this._experNode.addChild(this._exper_bg, 0);

        var exper_width = exper_size.width * scale;
        var exper_height = exper_size.height * scale;
        this._experNode.setContentSize(exper_width, exper_height);
        this._exper_bg.setPosition(exper_width/2, exper_height/2);
       
        //_loadingBar
        this._loadingBar = new ccui.LoadingBar();
        this._loadingBar.loadTexture(res.numberCrash.nc_nva_progressBar);
        this._loadingBar.setDirection(ccui.LoadingBar.TYPE_LEFT);
        this._loadingBar.setPercent(0);
        this._loadingBar.x = exper_width / 2;
        this._loadingBar.y = exper_height / 2;
        this._loadingBar.setScale(scale);
        this._experNode.addChild(this._loadingBar);

        var exper_bg_height = this._exper_bg.getContentSize().height * scale;
        //star
        var scaleStar = exper_height/ exper_size.height;
        for (var i = 1; i <= STAR_NUM; i++) {
            var star = new cc.Sprite(res.game_star_small_01);
            star.setAnchorPoint(cc.p(0.5, 0));
            star.attr({
                x: exper_width * (i+3) /  6,
                y: exper_height / 2 + exper_bg_height,
                scale:scale
            });
            this._experNode.addChild(star, 0);
            this.starName.push(star);
        };

        //0
        this._zero = new cc.LabelTTF("0", "Arial", 18);
        this._zero.setAnchorPoint(cc.p(1, 1));
        this._zero.attr({
            x: 0,
            y: exper_height / 2,
            scale:scale
        });
        this._zero.color = cc.color(148, 169, 119);
        var zero_width = this._zero.getContentSize().width * scale;
        this._zero.setPositionX(zero_width);
        this._experNode.addChild(this._zero);

        this._prompt.setPositionY(topbar_size.height / 4 - exper_bg_height/2);

    },
    initGameNode:function(){
        
        this._gameNode = new cc.Node();
        this._gameNode.ignoreAnchorPointForPosition(false);
        this._gameNode.setAnchorPoint(cc.p(0.5, 0));
        this._gameNode.attr({
            x: this.winSize.width / 2,
            y: this.winSize.height / 10,
            width: gameSize.gWidth ,
            height: gameSize.gHeight
        });
        this.addChild(this._gameNode, 0);
      
        var gameNode_size = this._gameNode.getContentSize();
        var gameNode_width = gameSize.gWidth * this.view_scaleX;
        var gameNode_height = gameSize.gHeight * this.view_scaleX;
        this._gameNode.setContentSize(gameNode_width, gameNode_height);
    },
    initBottom:function(){
        var scale = this.winSize.width / 750;

        //_titlebar
        this._titlebar = new cc.Node();
        this._titlebar.ignoreAnchorPointForPosition(false);
        this._titlebar.setAnchorPoint(cc.p(0, 0));
        this._titlebar.attr({
            x: 0,
            y: 0,
        });
        this.addChild(this._titlebar, 0);

        //_targetBg
        this._titlebar_bg = new cc.Sprite(res.game_bg_select_titlebar);
        this._titlebar.addChild(this._titlebar_bg, 0);
        
        this._titlebar_bg.setScale(scale);

        var titlebar_bg_size = this._titlebar_bg.getContentSize();

        var titlebar_width = titlebar_bg_size.width * scale;
        var titlebar_height = titlebar_bg_size.height * scale;
        this._titlebar.setContentSize(titlebar_width, titlebar_height);
        this._titlebar_bg.setPosition(titlebar_width/2, titlebar_height/2);
        
        var topbar_size = this._topbar.getContentSize();
        var width_gap = 13 * scale;
        var height_gap = 8.5 * scale;
        var game_height = this.winSize.height - titlebar_height - topbar_size.height - height_gap;
        var game_width = this.winSize.width - width_gap; 
        this._gameNode.setContentSize(game_width, game_height);
        this._gameNode.setPosition(this.winSize.width / 2, titlebar_height + height_gap);
    },
    initBottomLabel:function(){
        var scale = this.winSize.width / 750;

        var titlebar_size = this._titlebar.getContentSize();
        //targetLabel
        this.targetLabel = new cc.LabelTTF("目标", "Arial", 24);
        this.targetLabel.setAnchorPoint(cc.p(0.5, 0.5));
        this.targetLabel.attr({
            x: titlebar_size.width / 4,
            y: titlebar_size.height * 0.8,
            scale:scale
        });
        this.targetLabel.color = cc.color(188, 188, 188);
        this._titlebar.addChild(this.targetLabel, 0);

        //goalLabel
        this.goalLabel = new cc.LabelTTF("", "Arial", 48);
        this.goalLabel.setAnchorPoint(cc.p(0.5, 0.5));
        this.goalLabel.attr({
            x: titlebar_size.width / 4,
            y: titlebar_size.height * 0.4,
            scale:scale
        });
        this.goalLabel.color = cc.color(125, 125, 125);
        this._titlebar.addChild(this.goalLabel, 0);

        //total
        this.totalLabel = new cc.LabelTTF("总和", "Arial", 24);
        this.totalLabel.setAnchorPoint(cc.p(0.5, 0.5));
        this.totalLabel.attr({
            x: titlebar_size.width * 3 / 4,
            y: titlebar_size.height * 0.8,
            scale:scale
        });
        this.totalLabel.color = cc.color(188, 188, 188);
        this._titlebar.addChild(this.totalLabel, 0);

        //sum
        this.sumLabel = new cc.LabelTTF("", "Arial", 48);
        this.sumLabel.setAnchorPoint(cc.p(0.5, 0.5));
        this.sumLabel.attr({
            x: titlebar_size.width * 3 / 4,
            y: titlebar_size.height * 0.4,
            scale:scale
        });
        this.sumLabel.color = cc.color(59, 212, 182);
        this._titlebar.addChild(this.sumLabel, 0);
    },
    sethandle:function (delegate, handle) {
        this._delegate = delegate;
        this._handle = handle;
    },
    initEvnent:function(){
        var scalebtn = this.winSize.width / 750;

        var titlebar_size = this._titlebar.getContentSize();
        //delete
        this._deleteButton = new ccui.Button();
        this._deleteButton.setAnchorPoint(cc.p(1, 0.5));
        this._deleteButton.setTouchEnabled(true);
        this._deleteButton.loadTextures(res.numberCrash.nc_label_small, res.numberCrash.nc_label_small, "");
        this._deleteButton.x = titlebar_size.width - 10;
        this._deleteButton.y = titlebar_size.height / 2;
        this._deleteButton.setScale(scalebtn);
        this._deleteButton.addTouchEventListener(this.touchDelEvent ,this);
        this._titlebar.addChild(this._deleteButton);

        var topbar_size = this._topbar.getContentSize();
        //stop
        var topGap = 15;
        this._stopButton = new ccui.Button();
        this._stopButton.setAnchorPoint(cc.p(0.5, 0.5));
        this._stopButton.setTouchEnabled(true);
        this._stopButton.loadTextures(res.game_btn_suspend_n, res.game_btn_suspend_s, "");
        this._stopButton.x = topbar_size.width * 0.1;
        this._stopButton.y = topbar_size.height / 2 - topGap;
        this._stopButton.setScale(scalebtn);
        //this._stopButton.addTouchEventListener(this.touchStopEvent ,this);
        this._topbar.addChild(this._stopButton);
    },
    touchDelEvent: function (sender, type) {
        switch (type) {
            case ccui.Widget.TOUCH_BEGAN:
                this._handle(this._delegate);
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
    setPromptLabel:function (str) {
        this._prompt.setString(str);
    },
    setSumLabel:function (str) {
        this.sumLabel.setString(str);
    },
    setGoalLabel:function (str) {
        this.goalLabel.setString(str);
    },
    setAllLayerVisible:function(isShow){
        this._topbar.setVisible(isShow);
        this._titlebar.setVisible(isShow);
    },

    testHideExperAndStar: function () {
        this._experNode.setVisible(false);
    },

    setGuideHand: function (mCCP1, mCCP2) {
        var size = cc.winSize;
        var scale = size.width / 750;

        this.hand = new cc.Sprite(res.Helper_hand);
        this.hand.setAnchorPoint(cc.p(0.5, 1));
        this.hand.attr({
            x:size.width*0.5,
            y:10*scale + this.hand.height*scale,
            scale:scale,
        });
        this.addChild(this.hand, 3);

        if (mCCP2 == null) {
            this.hand.x = mCCP1.x - this._deleteButton.width*scale - 100*scale;
            this.hand.y = mCCP1.y;
        }else {
            var distance = mCCP2.x - mCCP1.x;
            this.hand.x = mCCP1.x + distance*0.5;
            this.hand.y = 10*scale + this.hand.height*scale;
        } 
    },

    addHandAction3: function (mCCP1) {
        var size = cc.winSize;
        var scale = size.width / 750;
        this.hand.stopAllActions();

        var move1 = cc.MoveTo.create(0.3, mCCP1);
        var delay1 = cc.DelayTime.create(0.3);
        var call = cc.CallFunc.create(function () {
            this.handClick();
        }, this);
        var seq2 = cc.Sequence.create(move1, delay1, call);
        this.hand.runAction(seq2);
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