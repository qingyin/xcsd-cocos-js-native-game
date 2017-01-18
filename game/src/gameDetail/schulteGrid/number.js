
var SchulteNumber = cc.Layer.extend({
	_hasSeleted:false,
    _touchEnable:true,
	_value:0,
	_str:null,
    _scale:null,
    _state:null,
    _isGuideTouch:true,
    ctor:function () {
        this._super();

        this.ignoreAnchorPointForPosition(false);
        this.setAnchorPoint(cc.p(0.5, 0.5));

        this.bg = new cc.Sprite(SG_GE.CellStateBG[SG_GE.CellState.DEFAULT]);
        var size = this.bg.getContentSize();
        this.bg.x = size.width/2;
        this.bg.y = size.height/2;
        this.setContentSize(size);
        this.addChild(this.bg,0);

        this._lbl_number = new cc.LabelTTF("1", "Arial", 38);
        this._lbl_number.attr({
        	anchorPoint:cc.p(0.5,0.5),
            x:size.width/2,
            y:size.height/2,
            color:cc.color(255,150,0),
        });
        this.addChild(this._lbl_number);

		cc.eventManager.addListener({
            event: cc.EventListener.TOUCH_ONE_BY_ONE,
            swallowTouches: false,
            onTouchBegan:function(touch, event){
                var target = event.getCurrentTarget();
                var rect = cc.rect(0,0,target.width,target.height);
                var pos = target.convertToNodeSpace(touch.getLocation());
                if (target._isGuideTouch == true && target._hasSeleted == false && target._touchEnable == true && cc.rectContainsPoint(rect,pos)){
                    target._handle(target._delegate,target);
                }
            	return true;
            },
            onTouchEnded: function(touch, event){           
            },
        }, this);
    },
    setParentHandle:function(delegate,handle){
        this._delegate = delegate;
        this._handle = handle;
    },
    setCellState:function(state){
    	this.bg.setTexture(SG_GE.CellStateBG[state]);
    },
    runWrongAction:function(actionTime){        
        var seq = cc.sequence(
            cc.callFunc(function(){
                this.setCellState(SG_GE.CellState.WRONG);
            },this),
            cc.scaleTo(actionTime/2,this._scale+0.1,this._scale+0.1),
            cc.scaleTo(actionTime/2,this._scale,this._scale),            
            cc.callFunc(function(){                
                this.setCellState(this._state);
            },this)
        );
        this.runAction(seq);
    },
    


});


