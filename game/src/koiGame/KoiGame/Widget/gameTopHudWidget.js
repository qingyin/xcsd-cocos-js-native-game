
var GameTopHudWidget = cc.Layer.extend({
    _lblPond : null,
    _lblScore : null,
	ctor : function(){
		this._super();
		this._init();
	},
	_init : function(){
        this._initBtnPause();
        this._initHud();
	},
    _initBtnPause : function(){
        var btnPause = new ccui.Button();
        btnPause.loadTextures(res.koiGame.game_buttonPauseOff,res.koiGame.game_buttonPauseDown,'');        
        btnPause.attr({
            anchorX : 0,
            anchorY : 1,
            x:0,
            y:AppConfig.h,
            name:BtnEventName.paused,
        });
        this.addChild(btnPause);
        btnPause.addTouchEventListener(this.BtnEvent,this);
    },
    _initHud : function(){
        var w = 250;
        var h = 70;
        //this._hudContainer = new cc.LayerColor();
        this._hudContainer = new cc.Node();
        this._hudContainer.attr({
            color : cc.color(234,234,234,0),
            x : 100,
            y : AppConfig.h - h,
            width : AppConfig.w,
            hight : h,
            opacity : 175,
        });
        this.addChild(this._hudContainer);
        

        var bgColorLayer = new cc.LayerColor();
        bgColorLayer.attr({
            color : cc.color(234,234,234,20),
            width : w,
            hight : h,
            x : 80,
            y : 0,
            anchorX : 0.5,
            anchorY : 0.5,
            opacity : 100,
        });
        this._hudContainer.addChild( bgColorLayer );

        var self = this;
        cc.eventManager.addListener({
            event: cc.EventListener.TOUCH_ONE_BY_ONE,
            swallowTouches: false,
            onTouchBegan:function(touch, event){
                //cc.log("touch, event",touch, event);
                var target = event.getCurrentTarget();
                var size = target.getContentSize();

                var rect = cc.rect(0,0,size.width,size.height);
                var pos = target.convertToNodeSpace(touch.getLocation());
                if (cc.rectContainsPoint(rect,pos)){
                    var cEvent = new cc.EventCustom(CustomEvent.settingBtnEvent.name);
                    var userData = {};
                    userData[CustomEvent.settingBtnEvent.userDataKey.btnEventName] = BtnEventName.resume;
                    cEvent.setUserData(userData);
                    //cc.eventManager.dispatchEvent(cEvent);
                }
                return true;
            },
            onTouchEnded: function(touch, event){           
            },
        }, bgColorLayer);



        this._lblPond = new cc.LabelTTF();
        this._lblPond.attr({
            string:"POND  1 of 5",
            fontName:'Arial',
            fontSize:32,
            x:w*0.5,
            y:h*0.5,
            color:cc.color.BLACK,
            anchorX : 0.5,
            anchorY : 0.5,
            opacity : 200,
        });
        bgColorLayer.addChild(this._lblPond);

        var bgColorLayer2 = new cc.LayerColor();
        bgColorLayer2.attr({
            color : cc.color(234,234,234,20),
            width : w,
            hight : h,
            x : bgColorLayer.x + bgColorLayer.width+20,
            y : 0,
            anchorX : 0.5,
            anchorY : 0.5,
            opacity : 100,
        });
        this._hudContainer.addChild( bgColorLayer2 );

        var self = this;
        cc.eventManager.addListener({
            event: cc.EventListener.TOUCH_ONE_BY_ONE,
            swallowTouches: false,
            onTouchBegan:function(touch, event){
                //cc.log("touch, event",touch, event);
                var target = event.getCurrentTarget();
                var size = target.getContentSize();

                var rect = cc.rect(0,0,size.width,size.height);
                var pos = target.convertToNodeSpace(touch.getLocation());
                if (cc.rectContainsPoint(rect,pos)){
                    var cEvent = new cc.EventCustom(CustomEvent.settingBtnEvent.name);
                    var userData = {};
                    userData[CustomEvent.settingBtnEvent.userDataKey.btnEventName] = BtnEventName.restart;
                    cEvent.setUserData(userData);
                    //cc.eventManager.dispatchEvent(cEvent);
                }
                return true;
            },
            onTouchEnded: function(touch, event){           
            },
        }, bgColorLayer2);


        this._lblScore = new cc.LabelTTF();//("POND  1 of 5", "Arial", 35);
        this._lblScore.attr({
            string:"SCORE   0",
            fontName:'Arial',
            fontSize:32,
            x:w*0.5,
            y:h*0.5,
            color:cc.color.BLACK,
            anchorX : 0.5,
            anchorY : 0.5,
            opacity : 200,
        });
        bgColorLayer2.addChild(this._lblScore);
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
            	if(sender.name == BtnEventName.paused){
            		var cEvent = new cc.EventCustom(CustomEvent.settingBtnEvent.name);
			        var userData = {};
			        userData[CustomEvent.settingBtnEvent.userDataKey.btnEventName] = sender.name;
			        cEvent.setUserData(userData);
			        cc.eventManager.dispatchEvent(cEvent);
            	}
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
    setHudPondIndex : function(index,trialsNum){
        this._lblPond.setString("POND  "+ index +" of " + trialsNum);
    },
    setScore : function(score){
        //this._lblScore.setString("SCORE    "+score);
    },
    setLevel : function(level){
        this._lblScore.setString("LEVEL    "+level);
    },
    setTextColor : function(color){
        this._lblPond.setColor(color);
        this._lblScore.setColor(color);
    },

    onExit : function(){
        this._super();
        cc.log("GameTopHudWidget  view   onExit");
    },
});