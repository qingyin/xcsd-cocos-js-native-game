var AlertTip = cc.Layer.extend({
	ctor:function(){
		this._super();

		this._isAlert = 0;

		var size = cc.winSize;
		var img_bg = new cc.LayerColor();
		img_bg.attr({
			x : 0,
			y : 0,
			width : size.width,
			height : size.height,
			color : cc.color(0,0,0, 170),
            opacity:170,
		});
		this.addChild(img_bg,0);

		// var texture_img_netlow = cc.textureCache.getTextureForKey(res.panel_small);
		this.img_netlow = new cc.Sprite(res.panel_small);
		// cc.log('texture_img_netlow -----',res.panel_small);
		// this.img_netlow.initWithTexture(texture_img_netlow);
		this.img_netlow.attr({
			x:img_bg.width*0.5,
			y:img_bg.height*0.5,
		});
		img_bg.addChild(this.img_netlow,0);

		var lblTitle = new cc.LabelTTF('',"Arial",45);
        lblTitle.attr({
        	string:"网络不稳定",
        	x:this.img_netlow.width * 0.5,
        	y:this.img_netlow.height*0.7,
            color: cc.color(72,72,72),
        });
        this.img_netlow.addChild(lblTitle);
        lblTitle.setTag(100);

        var lblContent = new cc.LabelTTF('',"Arial",30);
        lblContent.attr({
        	string:"未能连接到服务器，请检查您的网络",
        	x:this.img_netlow.width * 0.5,
        	y:this.img_netlow.height*0.48,
            color: cc.color(72,72,72),
        });
        this.img_netlow.addChild(lblContent);
        lblContent.setTag(101);

        var color = cc.color(65, 195, 255);
 		var btn_goon = new ccui.Button();
		btn_goon.loadTextures(res.comLearn_btn_n,res.comLearn_btn_s);
		btn_goon.attr({
			anchorX:0.5,
            anchorY:0,
			x:this.img_netlow.width*0.5,
			y:this.img_netlow.height*0.1,
			titleText:'重试',
            titleFontSize:30,
            titleFontName:"Arial",
            color:cc.color(255,255,255),
		})
		this.img_netlow.addChild(btn_goon,1);
		platformFun.setBtnPicColor(btn_goon,color);
		btn_goon.setTag(102);
		// btn_goon._buttonNormalRenderer.color = color;
  //       btn_goon._buttonClickedRenderer.color = color;
 
		var self = this;
        btn_goon.addClickEventListener(function(){
        	if (self._isAlert == 0) {
        		self.removeFromParent(true);
        		platformFun.repeatHttpPost();
        	}else if (self._isAlert == 1) {
        		platformFun.backToApp();
        	}            
        });

       	cc.eventManager.addListener({
            event:cc.EventListener.TOUCH_ONE_BY_ONE,
            swallowTouches:true,
            onTouchBegan:function(touch,event){return true;},
            onTouchMoved:function(){},
            onTouchEnded:function(){}  
        },this);
	},

	setUIAttr: function (isTask) {
		this._isAlert = 1;
		var title = this.img_netlow.getChildByTag(100);
		var content = this.img_netlow.getChildByTag(101);
		var btn = this.img_netlow.getChildByTag(102);
		if (isTask == true) {
			title.setString('');
			content.setString('布置的作业为空！');
			btn.setTitleText('退出作业');
		}else {
			title.setString('');
			content.setString('布置的测试为空！');
			btn.setTitleText('退出测试');
		}
	}
});