
var ChooseLevelCell = cc.Layer.extend({
    _touchEnable:false,
    _levelIndex:-1,
    _isClicked:null,
    ctor:function (args) {
        this._super();
        this._args = {};
        this._args.viewConfig = args.viewConfig;
        this._isClicked = false;

        this.ignoreAnchorPointForPosition(false);
        this.setAnchorPoint(cc.p(0.5, 0.5));

        this._color = this._args.viewConfig.mainColor;
        this.ballBG = new cc.Sprite(res.game.game_gameLevel_01);
        var size = this.ballBG.getContentSize();
        this.ballBG.attr({
            x:size.width*0.5,
            y:size.height*0.5,
            //color:this._color,
        });
        this.addChild(this.ballBG,0);
        this.setContentSize(size);

        this.lbl_ball_number = new cc.LabelTTF("1", "Arial", 38);
        this.lbl_ball_number.attr({
            anchorPoint:cc.p(0.5,0.5),
            x:this.ballBG.x,
            y:this.ballBG.y,
            color:cc.color(255,150,0),
        });
        this.ballBG.addChild(this.lbl_ball_number);

        cc.eventManager.addListener({
            event: cc.EventListener.TOUCH_ONE_BY_ONE,
            swallowTouches: false,
            onTouchBegan:function(touch, event){
                var target = event.getCurrentTarget();
                target._worldpos = target.convertToWorldSpace(touch.getLocation());
                return true;
            },
            onTouchEnded: function(touch, event){         
                var target = event.getCurrentTarget();
                var worldPos = target.convertToWorldSpace(touch.getLocation());

                var ratio = cc.view.getDevicePixelRatio();
                var ClickDisX = 20 * ratio / 2;
                var ClickDisY = 20 * ratio / 2;
                var moved = ((Math.abs(target._worldpos.x - worldPos.x) <= ClickDisX) && (Math.abs(target._worldpos.y - worldPos.y) <= ClickDisY));
                var rect = cc.rect(0,0,target.width,target.height);
                var pos = target.convertToNodeSpace(touch.getLocation());
                if (target._isClicked == false && moved && target._touchEnable && cc.rectContainsPoint(rect,pos)){
                    target._isClicked = true;
                    target._handle(target._delegate,target);
                }
            },
        }, this);
        this.initStar();
    },
    setParentHandle:function(delegate,handle){
        this._delegate = delegate;
        this._handle = handle;
    },
    initStar:function(){   
        this.dark_star = [];
        this.bright_star = [];
        for (var i = 0; i < 3; i++) {          
            this.dark_star[i] = new cc.Sprite(res.game_star_small_01);
            this.dark_star[i].attr({
                x:this.width/6*(i*2+1),
                y:-15,
            });   
            this.dark_star[i].setVisible(false); 
            this.addChild(this.dark_star[i]); 

            this.bright_star[i] = new cc.Sprite(res.game_star_small_02);
            this.bright_star[i].attr({
                x:this.width/6*(i*2+1),
                y:-15,
            });
            this.bright_star[i].setVisible(false); 
            this.addChild(this.bright_star[i]);  
        };
    },
    showStar:function(num){
        for (var i = 0; i < num; i++) {            
            this.dark_star[i].setVisible(false); 
            this.bright_star[i].setVisible(true); 
        };
        for (var i = num; i < 3; i++) {            
            this.dark_star[i].setVisible(true); 
            this.bright_star[i].setVisible(false); 
        };
    },
    fockCurLevel:function(){
        this.ballBG.setTexture(res.game.game_gameLevel_02);   
        this.ballBG.setColor(cc.color(255,255,255));
        this.lbl_ball_number.setColor(this._color);
    },
    lock:function(){
        this._touchEnable = false;
        this.ballBG.setTexture(res.game.game_gameLevel_01);
        this.lbl_ball_number.setColor(cc.color(172,172,172));
    },
    unLock:function(){
        this._touchEnable = true;
        this.ballBG.setTexture(res.game.game_gameLevel_02);
        this.ballBG.setColor(this._color);
        this.lbl_ball_number.setColor(cc.color.WHITE);
    },

    hideStar: function () {
        for (var i = 0; i < 3; i++) {            
            this.dark_star[i].setVisible(false); 
        };
        for (var i = 0; i < 3; i++) {            
            this.bright_star[i].setVisible(false); 
        };
    },

});