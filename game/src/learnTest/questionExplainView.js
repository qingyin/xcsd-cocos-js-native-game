var questionExplainView = cc.LayerColor.extend({
    ctor:function (args) {
        this._super();

        this.titleStr = args.titlestr;
        this.explainStr = args.explainStr;
        var color = cc.color(0,0,0,150);
        cc.LayerColor.prototype.init.call(this, color);;
        
        this.init();
    },

    init: function () {
    	var size = cc.winSize;
        this.bg = new cc.Sprite(res.learnTest.LC_titlebar_bg);
        this.bg.setAnchorPoint(cc.p(0.5,0.5));
        this.bg.attr({
            x:size.width/2,
            y:size.height*0.5,
        });    
        this.addChild(this.bg); 

        cc.eventManager.addListener({
            event: cc.EventListener.TOUCH_ONE_BY_ONE,
            swallowTouches: true,
            onTouchBegan: function(touch, event) {
                var target = event.getCurrentTarget();
                var rect = cc.rect(0,0,target.width,target.height);
                var pos = target.convertToNodeSpace(touch.getLocation());
                if(cc.rectContainsPoint(rect,pos)){
                    target.getParent().removeFromParent(true);
                }
                return true;   
            },
        }, this.bg);

        this.initTop();
        this.initCenter();
    },

    initTop: function () {
    	this.topBg = new cc.Sprite(res.learnTest.LC_titlebar);
        this.topBg.setAnchorPoint(cc.p(0.5,1));
        this.topBg.attr({
            x:this.bg.width/2,
            y:this.bg.height,
        });    
        this.bg.addChild(this.topBg);

        this._btn_close = new ccui.Button();
        //this._btn_help.loadTextures(res.game_btn_suspend_n, res.game_btn_suspend_s, "");
        this._btn_close.setAnchorPoint(cc.p(0,0.5));
        this._btn_close.attr({
            x:36,
            y:this.topBg.height*0.5,
            titleText:'关闭',
            titleFontSize:30,
            titleFontName:'Arial',
            titileColor:cc.color(255, 255, 255),
        });
        this.topBg.addChild(this._btn_close);

        this._btn_close.addTouchEventListener(this.btnEvent,this);

        var titleLabel = new cc.LabelTTF(this.titleStr, "Arial", 36);
        titleLabel.attr({
            anchorX:0.5,
            x:this.topBg.width/2,
            y:this.topBg.height/2,
            color: cc.color(255, 255, 255),
        });
        this.topBg.addChild(titleLabel);
    },

    initCenter: function () {
    	var contentLabel = new cc.LabelTTF(this.explainStr, "Arial", 30);
        contentLabel.attr({
            anchorX:0,
            anchorY:1,
            x:30,
            y:this.bg.height - this.topBg.height - 20,
            color: cc.color(125,125,125),
        });
        contentLabel._setBoundingWidth(this.bg.width - 60);
        var contentHeight = contentLabel._getHeight();
        this.bg.addChild(contentLabel);
    },

    btnEvent: function (sender, type) {
        switch (type) {
            case ccui.Widget.TOUCH_BEGAN:
                this.removeFromParent(true);
                break;
            case ccui.Widget.TOUCH_MOVED:
                break;
            case ccui.Widget.TOUCH_ENDED:
                break;
            case ccui.Widget.TOUCH_CANCELED:
                break;
            default:
                break;
        }
    },
});
