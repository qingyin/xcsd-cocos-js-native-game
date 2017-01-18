var LevelLockView = cc.Layer.extend({
	ctor:function(){
		this._super();

		var size = cc.winSize;
		var img_bg = new cc.LayerColor();
		img_bg.attr({
			x : 0,
			y : 0,
			width : size.width,
			height : size.height,
			color : cc.color(125,125,125),
            opacity:125,
		});
		this.addChild(img_bg,0);

		var panel = new cc.Sprite(res.game_panel_lock);
		panel.attr({
			x:img_bg.width*0.5,
			y:img_bg.height*0.5,
		});
		img_bg.addChild(panel,0);

		this._lblTitle = new cc.LabelTTF('',"Arial",45);
        this._lblTitle.attr({
        	string:"已锁定",
        	anchorX : 0.5,
        	anchorY : 1,
        	x:panel.width * 0.5,
        	y:panel.height *0.9,
            color: cc.color(0,0,0),
        });
        panel.addChild(this._lblTitle);
 
 		this._btnOk = new ccui.Button();
		this._btnOk.loadTextures(res.game_btn_lock_n,res.game_btn_lock_s);
		this._btnOk.attr({
			anchorX:0.5,
            anchorY:0,
			x:panel.width*0.5,
			y:panel.height*0.1,
			titleText:'确定',
            titleFontSize:46,
            titleFontName:"Arial",
            color:cc.color(255,255,255),
		})
		panel.addChild(this._btnOk,1);
 
		var self = this;
        this._btnOk.addClickEventListener(function(){
        	self.removeFromParent(true);            
        });


		this._lblTxt = new cc.LabelTTF('',"Arial",36,cc.size(this._btnOk.width,this._btnOk.height * 1.2), cc.TEXT_ALIGNMENT_LEFT);
        this._lblTxt.attr({
        	string:"本年级难度通关后，才能解锁次技能水平",
        	anchorX : 0.5,
        	anchorY : 0.5,
        	x:panel.width * 0.5,
        	y:panel.height * 0.5,
            color: cc.color(112,112,112),
        });
        panel.addChild(this._lblTxt); 
	}, 
	setTxt : function(titleTxt,contentTxt){
		titleTxt = titleTxt + "已锁定";
		contentTxt = contentTxt + "通关后，才能解锁次技能水平";
		this._lblTitle.setString(titleTxt);
		this._lblTxt.setString(contentTxt);
	},
	setBtnColor : function(color){
		platformFun.setBtnPicColor(this._btnOk,color);
	},
	onEnter : function(){
		this._super();
        cc.eventManager.addListener({
            event: cc.EventListener.TOUCH_ONE_BY_ONE,
            swallowTouches: true,
            onTouchBegan:function(touch, event){
                return true;
            },
            onTouchEnded: function(touch, event){
            },
        }, this);
	},


});