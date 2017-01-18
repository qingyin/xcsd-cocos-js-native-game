var PondView = cc.Layer.extend({
//var PondView = cc.LayerColor.extend({  
    _model : null,
    _controller : null,
    
    ctor:function(model, controller)
    {
        this._super();
        // this.attr({
        //     // width : AppConfig.w,
        //     // height : AppConfig.h,
        //     color : AppConfig.color.GRAY,
        //     anchorX : 0.5,
        //     anchorY : 0.5,
        //     x : 0,
        //     y : 0,
        // });

        this._model = model;
        this._controller = controller; 
        this.init();
    }, 

    onPause:function()
    {
    },

    onResume:function()
    {
    },
 
    updateView: function( delta )
    {
        
    }, 
    init: function()
    {     
        //this._bg = new cc.Sprite(res.koiGame.background_jpg);
        this._bg = new cc.Sprite(res.koiGame.fish_scene01);
        var size = this._bg.getContentSize();
        this._bg.attr({
            anchorX:0,
            anchorY:0,
            scale : AppConfig.scaleX,
            // scaleX:cc.winSize.width/size.width,
            // scaleY:cc.winSize.height/size.height,
        });
        this.addChild(this._bg,Layers.kLayerPondScenePlant);
    },
    setPondBGIndex:function(index){
        var txt = res.koiGame["fish_scene0"+index]
        this._bg.setTexture(txt);
    },
    onExit : function(){
        this._super();
        cc.log("PondView  view   onExit");
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

} );