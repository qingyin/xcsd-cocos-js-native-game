
var PositionCoin = cc.Layer.extend({
    _x:null,
    _y:null,
    _picArray:null,
    _hasFliped:false,
    _isTarget:false,
    _scale:1,
    _isGuideShow:null,
    ctor: function(){
        this._super();

        this.ignoreAnchorPointForPosition(false);
        this.setAnchorPoint(cc.p(0.5, 0.5));

        this._isGuideShow = false;

        var bg = new cc.Sprite(res.posMem.pm_pattern_pg);
        var size = bg.getContentSize();
        bg.x = size.width/2;
        bg.y = size.height/2;
        this.setContentSize(size);
        this.addChild(bg,0);

        this._picArray = new Array();
        for (var i = 0; i < 2; i++) {
        	this._picArray[i] = new cc.Sprite(res.posMem.pm_pattern_cuo);
        	this._picArray[i].attr({
				x:size.width/2,
				y:size.height/2
			});
			this.addChild(this._picArray[i],i+1);
			this._picArray[i].setVisible(false);
        };

		cc.eventManager.addListener({
            event: cc.EventListener.TOUCH_ONE_BY_ONE,
            swallowTouches: false,
            onTouchBegan:function(touch, event){
            	return true;
            },
            onTouchEnded: function(touch, event){           
            },
        }, this);
    },
    setHandle:function(parent,callback){
        this._parent = parent;
        this._callback = callback;
    },
    setBelowSprite:function(pic){
        for (var i = 0; i < 2; i++) {
        	this._picArray[i].setTexture(pic);
        };
    },    
    setAboveSprite:function(pic){
	    this._picArray[1].setTexture(pic);
    },
    turnOpen:function(actionTime){    
        this._hasFliped = true;
	    var seq = cc.sequence(
	        cc.scaleTo(actionTime/2,0,this._scale),
	        cc.callFunc(function(){
                for (var i = 0; i < 2; i++) {
                    this._picArray[i].setVisible(true);
                };
            },this),
	        cc.scaleTo(actionTime/2,this._scale,this._scale)
	    );
	    this.runAction(seq);
    },
    turnCover:function(actionTime){
        this._hasFliped = false;  	
	    var seq = cc.sequence(
	        cc.scaleTo(actionTime/2,0,this._scale),
	        cc.callFunc(function(){                
                for (var i = 0; i < 2; i++) {
                    this._picArray[i].setVisible(false);
                };
            },this),
	        cc.scaleTo(actionTime/2,this._scale,this._scale)
	    );
	    this.runAction(seq);
    },

    enterScale:function(dtime,scale){
        this.setScale(0,0);
        this.runAction(cc.scaleTo(dtime,scale,scale));
        this._scale = scale;
    },

    exitScale:function(dtime){    	
	    var seq = cc.sequence(
	        cc.scaleTo(dtime,0,0),
	        cc.callFunc(function () {
                this.removeFromParent(true);
            },this)
	    );
	    this.runAction(seq);
    },
    
});