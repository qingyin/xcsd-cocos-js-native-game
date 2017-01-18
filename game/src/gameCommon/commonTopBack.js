
var CommonTopBack = cc.Layer.extend({
    _handleBack:null,
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
            scale:scale
        });
        this.addChild(this.topBg);

        this.setContentSize(this.topBg.width,this.topBg.height); 

        var backNode = new cc.Node();
        backNode.attr({
            anchorX:0,
            anchorY:0,
            x:28,
            y:0,
            width:100,
            height:60,
            name:'back',
        });
        this.topBg.addChild(backNode);
        this.addUIListener(backNode);

        var posY = 44;

        var _sprite_back = new cc.Sprite(res.comLearn_go_back);
        _sprite_back.attr({
            anchorX:0,
            x:0,
            y:posY,
        });
        backNode.addChild(_sprite_back);

        var _lbl_back = new cc.LabelTTF("返回", "Arial", 32);
        _lbl_back.attr({
            anchorX : 0,
            x : _sprite_back.x+_sprite_back.width,
            y:posY,            
            color:cc.color(50,185,255),
        });
        backNode.addChild(_lbl_back);
        backNode.width = _lbl_back.x + _lbl_back.width;
        backNode.height = posY * 2;

        cc.eventManager.addListener({
            event: cc.EventListener.TOUCH_ONE_BY_ONE,
            swallowTouches: true,
            onTouchBegan:function(touch, event){
                return true;},
        }, this);

        return true;
    }, 

    addHelp: function () {
        var posY = 44;
        var helpNode = new cc.Node();
        helpNode.attr({
            anchorX:1,
            anchorY:0,
            x:this.topBg.width - 10,
            y:0,
            name:'help',
        });
        this.topBg.addChild(helpNode);
        this.addUIListener(helpNode);

        var lbl_help = new cc.LabelTTF("帮助", "Arial", 29);
        lbl_help.attr({
            anchorX : 0.5,
            anchorY : 0.5,
            x : helpNode.width * 0.5,
            y:posY,            
            color:cc.color(50,185,255),
        });
        helpNode.addChild(lbl_help);

        helpNode.width = lbl_help.width + 22;
        helpNode.height = posY * 2;
        lbl_help.x = helpNode.width * 0.5;

    },

    addUIListener: function (node) {
        var self = this;
        var listener = cc.EventListener.create({
            event:cc.EventListener.TOUCH_ONE_BY_ONE,
            onTouchBegan:function(touch,event){return true;},
            onTouchEnded:function(touch,event){
                var target = event.getCurrentTarget();
                var rect = cc.rect(0,0,target.width,target.height);
                var pos = target.convertToNodeSpace(touch.getLocation());
                var parent = target.getParent().getParent();
                if(cc.rectContainsPoint(rect,pos)){
                    if (target.name == "back") {
                        if (typeof(parent._handleBack) == "function"){
                            parent._handleBack(parent._delegate); 
                        }
                    }else if (target.name == "help") {
                        if (typeof(parent._handleHelp) == "function"){
                            parent._handleHelp(parent._delegateHelp);
                        }
                    }

                }
            }
        });
        cc.eventManager.addListener(listener,node);
    },

    addMyChild:function(child){
        this.topBg.addChild(child);
    },
    setHandleBack:function(self,handle){
        this._delegate = self;
        this._handleBack = handle;
    },
    setHandleHelp:function (delegate, handle) {
        this._delegateHelp = delegate;
        this._handleHelp = handle;
    },

    lobbyDelHelp: function () {
        var helpNode = this.topBg.getChildByName('help');
        helpNode.removeFromParent(true);
    },
    

});