var GuideSettle = SettleView.extend({
    ctor: function (args) {
        this._super(args);
        // var size = cc.winSize;
        // this.setContentSize(size.width, size.height);
        this.gameID = args.gameID;
        this._args.gameType = args.gameType;
        // this._args.viewConfig = VIEW_CONFIG[String(args.gameID)];

        cc.eventManager.addListener({
            event: cc.EventListener.TOUCH_ONE_BY_ONE,
            swallowTouches: true,
            onTouchBegan:function(touch, event){
                return true;},
        }, this);

        this.initGuideLayer();
        return true;
    },

    initGuideLayer: function () {
        
        var color = this._args.viewConfig.mainColor;

        var gameTitle = this.panel.getChildByTag(33);
        gameTitle.setString("新手引导");
        var settleType = this.panel.getChildByTag(666);
        var typeStr = "  " + this._args.gameType;
        settleType.setString(typeStr);

        this.setGuideVisible();

        var guideImage;
        if (this._args.gameType == "非常好！") {
            guideImage = res.game_expression_02;
        }else {
            guideImage = res.game_expression_01;
        }

        this.faceBg = new cc.Sprite(guideImage);
        this.faceBg.attr({
            x:this.panel.width*0.5,
            y:this.panel.height*0.5 - 70,
            color:cc.color(color),
        });
        this.panel.addChild(this.faceBg);

        //btn

        var again = new ccui.Button();
        again.loadTextures(res.game_btn_left_n,res.game_btn_left_s);  
        again.ignoreAnchorPointForPosition(true);      
        again.attr({
            x:7,
            y:10,
            name:'againGuide',
            titleText:'再学一次',
            titleFontSize:38,
            titleFontName:'Arial',
        });
        this.panel.addChild(again);
        again.addTouchEventListener(this.btnEvent,this);
        platformFun.setBtnPicColor(again,color);

        var end = new ccui.Button();
        end.loadTextures(res.game_btn_right_n,res.game_btn_right_s);
        end.ignoreAnchorPointForPosition(true);      
        end.attr({
            x:this.panel.width-end.width-7,
            y:10,
            name:'endGuide',
            titleText:'结束教程',
            titleFontSize:38,
            titleFontName:'Arial',
        });
        this.panel.addChild(end);
        end.addTouchEventListener(this.btnEvent,this);
        platformFun.setBtnPicColor(end,color);
    },

    btnEvent:function(sender,type){
        switch (type) {
            case ccui.Widget.TOUCH_ENDED:
                if(sender.name == 'againGuide'){    
                    this.removeFromParent(true);                
                    if (typeof(this._handleAgain) == 'function') {
                        this._handleAgain(this._delegateAgain);
                    };                    
                    this.dispatchEvent(BtnEventName.againGuide);
                }else if(sender.name == 'endGuide'){
                    platformFun.reportDataGameOut(gameData.getValue(gameData.key.curGameId)||0);
                    if (typeof(this._handleEnd) == 'function') {
                        this.removeFromParent(true);
                        this._handleEnd(this._delegateEnd);
                    };
                }
                break;
            default:
                break;
        }
    },

    setGuideVisible: function () {
        this._lblResTip.removeFromParent(true);
        this.btnQuit.removeFromParent(true);
        this.btnAgain.removeFromParent(true);
        for (var i = 0; i < 3; i++) {
            this.darkStar[i].setVisible(false);
        };
    },

    setHandleAgain:function(self,handleAgain){
        this._delegateAgain = self;
        this._handleAgain = handleAgain;
    },

    setHandleEnd:function(self,handleEnd){
        this._delegateEnd = self;
        this._handleEnd = handleEnd;
    },
    onExit : function(){
        this._super();
        cc.log("------onExit---GuideSettle");
    }
});