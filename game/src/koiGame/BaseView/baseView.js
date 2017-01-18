var BaseView = BaseBG.extend({
	ctor: function (args) {
		this._super();
        this._view.attr({
            width:AppConfig.w * 0.85,
            height:AppConfig.h * 0.65, 
        });
        this._view.x = (AppConfig.w - this._view.width) * 0.5;
        this._view.y = (AppConfig.h - this._view.height) *0.5;

        args = args || {};
        this.title = args.title || "title";

		this.init_BaseView();
	},
	init_BaseView: function () {
		this.coinLbl = new cc.LabelTTF(this.title, "Arial", 30);
		this.coinLbl.attr({
			anchorX:0.5,
			anchorY:0.5,
			x:this._view.width * 0.5,
			y:this._view.height * 0.95,
			scale:AppConfig.scaleX,
			color:cc.color.RED,
		});
		this._view.addChild(this.coinLbl);

        var iconBtn = new ccui.Button();
        iconBtn.attr({        	
			anchorX:0.5,
			anchorY:0.5,
			x:this._view.width * 0.5,
			y:this._view.height * 0.1,
			scale:AppConfig.scaleX,
			titleText : "关 闭",
			titleColor : cc.color.BLACK,
			titleFontSize : 60,
        });
        iconBtn.setTouchEnabled(true);
        iconBtn.addTouchEventListener(this.setBtnEvent_BaseView ,this);           
        this._view.addChild(iconBtn);
	},
	setBtnEvent_BaseView : function(sender,type){
		this.removeFromParent(true);

	},
});