//var GuideController = cc.Class.extend(
var GuideController = cc.Layer.extend(
{
    gameID : 11,
    _guideArray : null,
    _isAppoint : null,
    ctor: function()
    {
        this._super();
        this._isAppoint = 1;
        this._guideArray = {};
        this.init();
    },
    init: function()
    {
    }, 
    sureGuide: function () {
        this.removeGuideTip();
        this._isAppoint = 1;
        this._isGuide = true;
        this.guideLevel = 0;        
        this.beginGuide();
    },

    beginGuide: function () {
        this.setTipArray(GAME_GUIDE_TIP[this.gameID].guideTip[0], true, 0);
        this.guide = new PlayerGuide(this._guideArray);

        this.guide.x = AppConfig.w_2 - this.guide.width*0.5;
        this.guide.y = AppConfig.h * 0.70;
        this.addChild(this.guide);
        return 3.0;
    },

    setTipArray: function (tip, isRect, verticesType) {
        this._guideArray.tip = tip;
        this._guideArray.isRect = isRect;
        this._guideArray.verticesType = verticesType;
    },

    goalTip: function () {
        //return;
        switch (this._isAppoint) {
            case 1:
                this.guide.removeTip();
                this.setTipArray(GAME_GUIDE_TIP[this.gameID].guideTip[1], true, 4);
                this.guide.init(this._guideArray);
                this._isAppoint = 2;
                break;
            case 2:
                this.guide.removeTip();
                this.setTipArray(GAME_GUIDE_TIP[this.gameID].guideTip[2], true, 4);
                this.guide.init(this._guideArray);

                this._isAppoint = 3;
                break;
            case 3:
                this.guide.removeTip();
                this._isAppoint = 4;
                break;
        }
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
        this.addChild(this.hand);

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
    removeHandleSprite: function () {
        if (this.hand) {            
            this.hand.stopAllActions();
            this.hand.removeFromParent(true);
            this.hand = null;
        }
    },
    removeGuideTip : function(){
        this.removeHandleSprite();
        if (this.guide) {
            this.guide.removeTip();
            this.guide.removeFromParent(true);
            this.guide = null;
        }
    },

} );