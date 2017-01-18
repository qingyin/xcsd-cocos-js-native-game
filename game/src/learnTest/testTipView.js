var testTipView = cc.Layer.extend({
    ctor:function (args) {
        this._super();

        this._tipString = args.tipString;

        this.init();
    },

    init: function () {
    	var size = cc.winSize;
        var bg = new cc.Sprite(res.panel_LC_smalltips);
        bg.setAnchorPoint(cc.p(0.5,0.5));
        bg.attr({
            x:size.width * 0.5,
            y:size.height * 0.5,
        });    
        bg.setOpacity(200);
        this.addChild(bg); 

    	//var tipStr = '学能测试每月开放两次' + '\n' + '下个月再来测吧';
    	var tipLabel = new cc.LabelTTF(this._tipString, "Arial", 30);
        tipLabel.attr({
            anchorX:0.5,
            x:bg.width * 0.5,
            y:bg.height * 0.5,
            color: cc.color(243,243,243),
        });
        tipLabel.setHorizontalAlignment(1);
        bg.addChild(tipLabel);
    },
});