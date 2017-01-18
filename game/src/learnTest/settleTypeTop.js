var SettleTypeTop = cc.Layer.extend({
    ctor:function (resultType) {
        this._super();
        
        this._typeStr = resultType;
        

        this.initTop();
    },

    initTop: function () {
    	var size = cc.winSize;
        var scale = size.width / 750;

        var colorLayerHeight = 60;

    	var colorLayer = new cc.LayerColor(cc.color(247,247,247,255), size.width, colorLayerHeight);
    	this.addChild(colorLayer);

        this.width = size.width;
        this.height = colorLayerHeight; 

 		var learnNumber = new cc.LabelTTF(this._typeStr, "Arial", 30);
 		learnNumber.ignoreAnchorPointForPosition(false);
        learnNumber.setAnchorPoint(cc.p(0, 0.5));
        learnNumber.x = 20;
        learnNumber.y = colorLayer.height /2;
        learnNumber.color = cc.color(72, 72, 72);
        colorLayer.addChild(learnNumber);

        this.questionBtn = new ccui.Button();
        this.questionBtn.setTouchEnabled(true);
        this.questionBtn.loadTextures(res.learnTest.lc_explain, res.learnTest.lc_explain, "");
        this.questionBtn.ignoreAnchorPointForPosition(false);
        this.questionBtn.attr({
            anchorPoint:cc.p(1,0.5),
            x:colorLayer.width - 40,
            y:colorLayer.height*0.5,
            name:'question'
        });
        colorLayer.addChild(this.questionBtn);
        this.questionBtn.addTouchEventListener(this.btnEvent,this);
    },

    btnEvent: function (sender, type) {
        switch (type) {
            case ccui.Widget.TOUCH_BEGAN:
                var args = {};
                if (this._typeStr == '学能商数') {
                    args.titlestr = tipArray[1].title;
                    args.explainStr = tipArray[1].content;
                }else if (this._typeStr == '学能训练积分') {
                    args.titlestr = tipArray[2].title;
                    args.explainStr = tipArray[2].content;
                }else {
                    args.titlestr = tipArray[3].title;
                    args.explainStr = tipArray[3].content;
                }
                var queation = new questionExplainView(args);
                // var startGame = new StartGameView(this._args);
                // cc.director.getRunningScene().removeAllChildren();
                 cc.director.getRunningScene().addChild(queation);
                cc.log("question help!");
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