
var CommonTopPause = cc.Layer.extend({
    ctor:function () {
        this._super();

        var size = cc.winSize;
        var scale = size.width / 750;
        this.topBg = new cc.Sprite(res.game_nav_pg);
        this.topBg.ignoreAnchorPointForPosition(false);
        this.topBg.setAnchorPoint(cc.p(0.5, 1));
        this.topBg.attr({
            x:size.width/2,
            y:size.height,
            scale : scale,
            //color:cc.color(255,0,0),
        });
        this.addChild(this.topBg,2);

        this.setContentSize(this.topBg.width,this.topBg.height); 

        var bgSize = this.topBg.getContentSize();
        this._btn_pause = new ccui.Button();
        this._btn_pause.loadTextures(res.game_btn_suspend_n, res.game_btn_suspend_s, "");
        this._btn_pause.setAnchorPoint(cc.p(0,0.5));
        this._btn_pause.attr({
            x:bgSize.width*0.05,
            y:bgSize.height*0.5-10,
            name:'A+6',
        });
        this._btn_pause.setTouchEnabled(true);
        this._btn_pause.addTouchEventListener(this.BtnEvent,this);

        this.topBg.addChild(this._btn_pause);

        // cc.eventManager.addListener({
        //     event: cc.EventListener.TOUCH_ONE_BY_ONE,
        //     swallowTouches: true,
        //     onTouchBegan:function(touch, event){
        //         return true;},
        // }, this);

        return true;
    }, 
    addMyChild:function(child){
        this.topBg.addChild(child);
    },
    setHandlePause:function(self,handle){
        this._btn_pause._delegate = self;
        this._btn_pause._handlePause = handle;
        //cc.log('handle',typeof(handle),this._btn_pause,this);
        this._btn_pause.addClickEventListener(function(sender){
            //cc.log('this._handlePause',typeof(sender._handlePause),sender,this);
            sender._handlePause(sender._delegate);
        });
    },

    onEnter:function () {
        this._super();
        cc.eventManager.addListener({
            event:cc.EventListener.TOUCH_ONE_BY_ONE,
            swallowTouches:false,
            onTouchBegan:function(touch,event){
                return true;
            },
        },this);
    },
    onExit : function(){
        this._super();
    },
    BtnEvent: function (sender, type) {
        switch (type) {
            case ccui.Widget.TOUCH_ENDED:
                    var cEvent = new cc.EventCustom(CustomEvent.settingBtnEvent.name);
                    var userData = {};
                    userData[CustomEvent.settingBtnEvent.userDataKey.btnEventName] = BtnEventName.paused;
                    cEvent.setUserData(userData);
                    cc.eventManager.dispatchEvent(cEvent);
                break;
            case ccui.Widget.TOUCH_MOVED:
                break;
            case ccui.Widget.TOUCH_BEGAN:
                break;
            case ccui.Widget.TOUCH_CANCELED:
                break;
            default:
                break;
        }
    },
    addColorBGLayer : function(){
        if (this._bgColorLayer) {
            this._bgColorLayer.removeFromParent(true);
            this._bgColorLayer = null;
        }
        var size = cc.winSize;
        var scale = size.width / 750;
        this._bgColorLayer = new cc.LayerColor();
        this._bgColorLayer.ignoreAnchorPointForPosition(false);
        this._bgColorLayer.setAnchorPoint(cc.p(0.5, 1));
        this._bgColorLayer.attr({
            color : cc.color(201,234,236),
            x:size.width/2,
            y:size.height,
            width : this.topBg.width,
            height : this.topBg.height,
            scale:scale,
        });
        this.addChild(this._bgColorLayer,1);
    },
    addDeleteColorShadeLayer : function(isAdd) {
        if (this._colorShadeLayer) {
            this._colorShadeLayer.removeFromParent(true);
            this._colorShadeLayer = null;
        }
        if (isAdd === false) {
            return;
        }
        var size = cc.winSize;
        var scale = size.width / 750;
        this._colorShadeLayer = new cc.LayerColor();
        this._colorShadeLayer.ignoreAnchorPointForPosition(false);
        this._colorShadeLayer.setAnchorPoint(cc.p(0.5, 1));
        this._colorShadeLayer.attr({
            color : cc.color(0, 0, 0),
            x:size.width/2,
            y:size.height,
            width : this.topBg.width,
            height : this.topBg.height,
            //scale:scale,
        });
        this.addChild(this._colorShadeLayer,100);

        this._colorShadeLayer.setOpacity(125);
    },
    setBtnPauseEnable : function (enable) {        
        this._btn_pause.setTouchEnabled(enable);
    }
});