
var SchulteLayer = cc.LayerColor.extend({
    _progressBar:null,
    _upLayer:null,
    _downLayer:null,
    ctor:function (bgColor) {
        this._super();
        
        this.color = bgColor; 
        this.init();
        return true;
    },

    init:function (){
        this.initTop();
        this.initCenter();
    },

    initTop:function (){
        var size = cc.winSize;
        var scale = size.width / 750;

        this.topLayer = new cc.Sprite(res.game_nav_pg);
        this.topLayer.ignoreAnchorPointForPosition(false);
        this.topLayer.setAnchorPoint(cc.p(0.5, 1));
        this.topLayer.attr({
            x:size.width/2,
            y:size.height,
            scale:scale
        });
        this.addChild(this.topLayer);

        //purse btn
        this._purseBtn = new ccui.Button();
        this._purseBtn.setTouchEnabled(true);
        this._purseBtn.loadTextures(res.game_btn_suspend_n, res.game_btn_suspend_s, "");

        this._purseBtn.ignoreAnchorPointForPosition(false);
        this._purseBtn.setAnchorPoint(cc.p(0.5, 0.5));

        var bgSize = this.topLayer.getContentSize();
        this._purseBtn.x = 70;
        this._purseBtn.y = bgSize.height/2-15;
        this.topLayer.addChild(this._purseBtn);
        //this._purseBtn.addTouchEventListener(this.onPauseBtnEvent ,this);

        //progress bar long
        this._progressBar = new cc.ProgressTimer(new cc.Sprite(res.schulte.sg_nav_progressbar));
        this._progressBar.ignoreAnchorPointForPosition(false);
        this._progressBar.setAnchorPoint(cc.p(0.5, 1));

        this._progressBar.type = cc.ProgressTimer.TYPE_BAR;
        this._progressBar.midPoint = cc.p(1, 0);
        this._progressBar.barChangeRate = cc.p(1, 0);
        this._progressBar.x = bgSize.width/2;
        this._progressBar.y = 0;

        this.topLayer.addChild(this._progressBar);
        this._progressBar.setPercentage(100);

        //var fromTo = cc.sequence(cc.progressTo(55, 0), cc.progressTo(0, 100));
        //this._progressBar.runAction(fromTo.repeatForever());
    },

    initCenter:function(){
        var size = cc.winSize;
        //var scale = size.width / 750     
        this._upLayer = new cc.LayerColor();
        this._upLayer.ignoreAnchorPointForPosition(false);
        this._upLayer.attr({
            anchorPoint:cc.p(0.5,0.5),
            x: size.width / 2,
            y: size.height /2,
            width: size.width * 0.95,
            height: size.width * 0.95,
            color: cc.color(255, 0, 0),
            opacity:0,
        });
        this.addChild(this._upLayer,1);

        this._downLayer = new cc.LayerColor();
        this._downLayer.ignoreAnchorPointForPosition(false);
        this._downLayer.attr({
            anchorPoint:cc.p(0.5,1),
            x: size.width / 2,
            y: size.height * 1 / 6,
            width: size.width * 0.99,
            height: size.width * 0.15,
            color: cc.color(255, 0, 0),
            opacity:0,
            visible:false,
        });
        this.addChild(this._downLayer,1);          

        this.lblStartTip = new cc.LabelTTF("初始数字2", "Arial", 38);
        this.lblStartTip.attr({
            anchorPoint:cc.p(0.5,0.5),
            x:size.width/2,
            y:size.height/2,
            color: cc.color(67, 67, 67),
        });
        this.addChild(this.lblStartTip);
    },
    appearRotateScale:function(node,actionTime){ 
        node.setScale(0);  
        node.setRotation(0);
        var seq = cc.spawn(
            cc.scaleTo(actionTime,1,1),
            cc.rotateBy(actionTime,360),
            cc.callFunc(function(){
                this.lblStartTip.setVisible(true)
            },this)
        );
        node.runAction(seq);
    },
    disappearRotateScale:function(node,actionTime){ 
        node.setRotation(0);
        var seq = cc.spawn(
            cc.scaleTo(actionTime,0,0),
            cc.rotateBy(actionTime,-360),
            cc.callFunc(function(){
                this.lblStartTip.setVisible(false)
            },this)
        );
        node.runAction(seq);
    }, 
    setStartTipText:function(txt){
        this.lblStartTip.setString('初始数字 '+txt);
    },

    setGuideHand: function (coin) {
        var size = cc.winSize;
        var scale = size.width / 750;
        var coinPos = this._upLayer.convertToWorldSpace(coin);

        this.hand = new cc.Sprite(res.Helper_hand);
        this.hand.setAnchorPoint(cc.p(0.5, 1));
        this.hand.attr({
            x:coinPos.x+10*scale,
            y:coinPos.y - 10*scale,
            scale:scale,
        });
        this.addChild(this.hand, 6);
        this.addHandAction();
    },

    addHandAction: function () {
        var size = cc.winSize;
        var scale = size.width / 750;
        this.hand.stopAllActions();

        var move = cc.MoveBy.create(0.1, cc.p(0, 10*scale));
        var delay1 = cc.DelayTime.create(0.3);
        var call = cc.CallFunc.create(function () {
            this.handClick();
        }, this);
        var seq2 = cc.Sequence.create(move, delay1, call);
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

