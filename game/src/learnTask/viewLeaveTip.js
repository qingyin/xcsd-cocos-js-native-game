
var ViewLeaveTip = cc.LayerColor.extend({
    ctor: function(args){
        this._super();
        var color = cc.color(0,0,0,150);
        cc.LayerColor.prototype.init.call(this, color);        
        this.tipText = args.tipText || "确定要放弃进度，离开学能作业吗？";
        this.init();
    },
    init:function(){
    	var size = cc.winSize;

        var color = cc.color(65, 195, 255);

    	var panelBG = new cc.Scale9Sprite(res.comLearn_panel_bg);
    	panelBG.attr({
    		anchorX: 0.5,
    		anchorY: 0.5,
    		x:size.width * 0.5,
    		y:size.height * 0.5,
    	});
    	this.addChild(panelBG);
    	panelBG.width = size.width*0.9;

        var tipText = new ccui.Text(this.tipText,'Arial',30);
        tipText.attr({
            anchorX:0.5,
            anchorY:0.5,
            x:panelBG.width*0.5,
            y:panelBG.height*0.5+30,
            color: cc.color(72, 72, 72),
        }); 
        //tipText.ignoreContentAdaptWithSize(false);
        //tipText.setContentSize(cc.size(panelBG.width*0.85, 80));
        //tipText.setTextHorizontalAlignment(cc.TEXT_ALIGNMENT_LEFT);
        panelBG.addChild(tipText);

        
        var btnCancel = new ccui.Button();
        btnCancel.setTouchEnabled(true);
        btnCancel.loadTextures(res.comLearn_btn_n, res.comLearn_btn_s, "");
        btnCancel.ignoreAnchorPointForPosition(false);
        btnCancel.attr({
            titleText:'取消',
            titleFontSize:30,
            titleFontName:'Arial',
            titleColor:cc.color(0,0,0),
            anchorPoint:cc.p(0.5,0.5),
            x:panelBG.width*0.25,
            y:70,
        });
        panelBG.addChild(btnCancel);
        
        platformFun.setBtnPicColor(btnCancel,color);
        // btnCancel._buttonNormalRenderer.color = color;
        // btnCancel._buttonClickedRenderer.color = color;

        var self = this;
        btnCancel.addClickEventListener(function(){
            self.removeFromParent();
        });

        this.btnLeave = new ccui.Button();
        this.btnLeave.setTouchEnabled(true);
        this.btnLeave.loadTextures(res.comLearn_btn_n, res.comLearn_btn_s, "");
        this.btnLeave.ignoreAnchorPointForPosition(false);
        this.btnLeave.attr({
            titleText:'离开，进度丢失',
            titleFontSize:30,
            titleFontName:'Arial',
            titleColor:cc.color(255,255,255),
            anchorPoint:cc.p(0.5,0.5),
            x:panelBG.width*0.75,
            y:70,
        });
        panelBG.addChild(this.btnLeave);
        platformFun.setBtnPicColor(this.btnLeave,color);
        // this.btnLeave._buttonNormalRenderer.color = color;
        // this.btnLeave._buttonClickedRenderer.color = color;
    },
    setHandleLeave:function(delegate,handle){
    	this._delegate = delegate;
    	this._handleLeave = handle;
    	var self = this;
    	this.btnLeave.addClickEventListener(function(){
    		if(typeof(self._handleLeave) == 'function'){
    			self._handleLeave(self._delegate);
    		}
    	});
    },
    setBtnLeaveTitle:function(){
        this.btnLeave.setTitleText("确定离开测试");
    },

});
