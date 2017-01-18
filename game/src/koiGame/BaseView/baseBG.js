//var BaseBG = cc.LayerColor.extend({
var BaseBG = cc.Layer.extend({
	ctor: function () {
		this._super();
        // cc.log("----",this.anchorX,this.anchorY);
        // cc.log("----",this.x,this.y);
        // cc.log("----",this.getContentSize());
         
        this._bgColorLayer = new cc.LayerColor();
        this._bgColorLayer.attr({
            anchorX:0,
            anchorY:0,
            color : AppConfig.color.SILVERY,
            opacity : 175,
        });
        this.addChild(this._bgColorLayer);

        // this._bgPicLayer = new cc.Sprite(res.background_jpg);
        // // this._bgPicLayer.ignoreAnchorPointForPosition(false);
        // var size = this._bgPicLayer.getContentSize();
        // this._bgPicLayer.attr({
        //     anchorX:0.5,
        //     anchorY:0.5,
        //     x:cc.winSize.width * 0.5,
        //     y:cc.winSize.height * 0.5,
        //     scale:cc.winSize.height/size.height,
        // });
        // this.addChild(this._bgPicLayer);

        cc.eventManager.addListener({
            event: cc.EventListener.TOUCH_ONE_BY_ONE,
            swallowTouches: true,
            onTouchBegan:function(touch, event){
                cc.log("BaseBG--touch");
                return true;},
            onTouchMoved:function(){},
            onTouchEnded:function(){},
        }, this);

		this.init_BaseBG();
	},

	init_BaseBG : function () {

	},

    setBaseBGColor : function(color){
        this._bgColorLayer.setColor(color);
    },

    setBaseBGPic : function(bgPic){
        //this._bgPicLayer
    },




});