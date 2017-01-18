
var NewWordCell = cc.Layer.extend({
    ctor:function(args) {
        this._super();
        this.ignoreAnchorPointForPosition(false);
        this.setAnchorPoint(cc.p(0.5, 0.5));

        this._touchEnable = false;
        this._hasSeleted = false;
        this._scale = 1;

        this._args = {};
        this._args.isUpPic = args.isUpPic;

        if(this._args.isUpPic == true){
            this.bg = new cc.Sprite(res.newWords.youxi_newWorlds_backBig);
        }else{
            this.bg = new cc.Sprite(res.newWords.youxi_newWorlds_back);
        }
        var size = this.bg.getContentSize();
        this.bg.x = size.width/2;
        this.bg.y = size.height/2;
        this.setContentSize(size);
        this.addChild(this.bg,0);

        this._lbl_number = new cc.LabelTTF("1", "Arial", 45);
        this._lbl_number.attr({
        	anchorPoint:cc.p(0.5,0.5),
            x:size.width/2,
            y:size.height/2,
            color:cc.color(255,255,255),
        });
        this.addChild(this._lbl_number);

        if(this._args.isUpPic == true){
            this._lbl_number.setFontSize(55);
        }

		cc.eventManager.addListener({
            event: cc.EventListener.TOUCH_ONE_BY_ONE,
            swallowTouches: false,
            onTouchBegan:function(touch, event){
                var target = event.getCurrentTarget();
                var rect = cc.rect(0,0,target.width,target.height);
                var pos = target.convertToNodeSpace(touch.getLocation());
                if (target._hasSeleted == false && target._touchEnable == true && cc.rectContainsPoint(rect,pos)){
                    target._handle(target._delegate,target);
                }
            	return true;
            },
            onTouchEnded: function(touch, event){           
            },
        }, this);
    },
    setTouchHandle:function(delegate,handle){
        this._delegate = delegate;
        this._handle = handle;
    },
    setCellBGTexture:function(texture){
    	this.bg.setTexture(texture);
    },
    runOverturnAction:function(isTurnOpen,actionTime){ 
        var seq = cc.sequence(
            cc.scaleTo(actionTime/2,0,this._scale),
            cc.callFunc(function(){
                if(isTurnOpen == false){                    
                    if(this._args.isUpPic == true){
                        this.setCellBGTexture(res.newWords.youxi_newWorlds_backBig);
                    }else{
                        this.setCellBGTexture(res.newWords.youxi_newWorlds_back);
                        this._touchEnable = false;
                    }
                    this._lbl_number.setVisible(false);
                }else{
                    if(this._args.isUpPic == true){
                        this.setCellBGTexture(res.newWords.youxi_newWorlds_normalBig);
                    }else{
                        this.setCellBGTexture(res.newWords.youxi_newWorlds_Normal);
                        this._touchEnable = true;
                        this._hasSeleted = false;
                    }
                    this._lbl_number.setVisible(true);
                } 
            },this),
            cc.scaleTo(actionTime/2,this._scale,this._scale)
        );
        this.runAction(seq);
    },
    runRightAction:function(actionTime){
        this._hasSeleted = true;        
        var seq = cc.sequence(
            cc.scaleTo(actionTime/2,this._scale),
            cc.callFunc(function(){
                this.setCellBGTexture(res.newWords.youxi_newWorlds_Selected);
                this._lbl_number.setVisible(true);
            },this),
            cc.scaleTo(actionTime/2,this._scale,this._scale)
        );
        this.runAction(seq);
    },
    runWrongAction:function(actionTime){
        this._hasSeleted = true;      
        var seq = cc.sequence(
            cc.scaleTo(actionTime/2,this._scale),
            cc.callFunc(function(){
                this.setCellBGTexture(res.newWords.youxi_newWorlds_Wrong);
                this._lbl_number.setVisible(true);
            },this),
            cc.scaleTo(actionTime/2,this._scale,this._scale)
        );
        this.runAction(seq);
    },
    runOpenAction:function(actionTime){
        if(this._hasSeleted == false && this._isTarget == true){
            this.runRightAction(actionTime);
        }
    },
    setShowStr:function(eleStrObj){
        if(this._args.isUpPic == true){
            this._lbl_number.setString(eleStrObj);
        }else{
            this._lbl_number.setString(eleStrObj.eleStr);
            this._isTarget = eleStrObj.isTarget;            
        }
    },
    setIdle:function(){            
        if(this._args.isUpPic == true){
            this.setCellBGTexture(res.newWords.youxi_newWorlds_backBig);
        }else{
            this.setCellBGTexture(res.newWords.youxi_newWorlds_back);
        }
        this._lbl_number.setVisible(false);
    },
    runActionFade:function(isAppear,actionTime){
        if(isAppear == true){            
            this._lbl_number.setOpacity(0);             
            this._lbl_number.runAction(cc.fadeTo(actionTime,255));
            this.bg.setOpacity(0);             
            this.bg.runAction(cc.fadeTo(actionTime,255));
        }else{            
            this._lbl_number.runAction(cc.fadeTo(actionTime,0));
            this.bg.runAction(cc.fadeTo(actionTime,0));
        }
    },
    
    setReStartAttr: function (isUp) {
        this.bg.setOpacity(255);
        this.bg.setScale(1);
        this._lbl_number.setOpacity(255);
        this._lbl_number.setScale(1);

        if (isUp == false) {
            this.bg.setTexture(res.newWords.youxi_newWorlds_back);
        }else {
            this.bg.setTexture(res.newWords.youxi_newWorlds_backBig);
        }
    },


});


