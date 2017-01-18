
var PositionLayer = cc.LayerColor.extend({
    sprite:null,
    _var:{
        repeat_num:null,
        topLayerHeight:153,
        circleHeight:40,
        targetLayerHeight : 180,
        targetPicWidth:119,
    },
    ctor:function(bgColor){
        this._super();
        this._var.repeat_num = 0;

        this.color = bgColor;
        var size = cc.winSize;

        this._coinListLayer = new cc.LayerColor();
        this._coinListLayer.ignoreAnchorPointForPosition(false);
        this._coinListLayer.setAnchorPoint(cc.p(0.5, 0.5));
        this._coinListLayer.attr({
            x: size.width / 2,
            y: size.height * 1.5 / 3,
            width: size.width * 0.9,
            height: size.width * 0.9 * 133/119,
            color: cc.color(255, 245, 238),
            opacity:0,
        });
        this.addChild(this._coinListLayer,1);

        this._picList = [];
        this._picList[PM_GE.pass_progress_state.win] = res.game_nav_pass;
        this._picList[PM_GE.pass_progress_state.fail] = res.game_nav_wrong;
        this._picList[PM_GE.pass_progress_state.current] = res.game_nav_current;
        this._picList[PM_GE.pass_progress_state.idle] = res.game_nav_normal;

        this.initTopLayer();
        this.initTargetTipLayer();
        
        return true;
    },
    initTopLayer:function(){
        var size = cc.winSize;

        this._bgTop = new cc.LayerColor();
        this._bgTop.ignoreAnchorPointForPosition(false);
        this._bgTop.setAnchorPoint(cc.p(0.5, 1));
        this._bgTop.attr({
            x: size.width / 2,
            y: size.height,
            width: size.width,
            height: this._var.topLayerHeight,
            color: cc.color(164, 164, 164),
            opacity:51,
        });

        this.addChild(this._bgTop);

        var bgSize = this._bgTop.getContentSize();
        this._btn_pause = new ccui.Button();
        this._btn_pause.loadTextures(res.game_btn_suspend_n, res.game_btn_suspend_s, "");
        this._btn_pause.setAnchorPoint(cc.p(0,0.5));
        this._btn_pause.attr({
            x:bgSize.width*0.05,
            y:bgSize.height*0.5-10,
        });
        this._btn_pause.setTouchEnabled(true);
        this._bgTop.addChild(this._btn_pause);

        var x = size.width - this._var.circleHeight * (this._var.repeat_num+0.5);

        this._lbl_remain_block = new cc.LabelTTF("剩余方块: ", "Arial", 28);
        //this._lbl_remain_block.ignoreAnchorPointForPosition(true);
        this._lbl_remain_block.setAnchorPoint(cc.p(1,0.5));
        this._lbl_remain_block.attr({
            x:x,
            y:bgSize.height/5*3,
            color:cc.color(95,95,95,255),
        });
        this._bgTop.addChild(this._lbl_remain_block);

        this._lbl_remain_block_num = new cc.LabelTTF("0", "Arial", 28);
        this._lbl_remain_block_num.setAnchorPoint(cc.p(0,0.5));
        this._lbl_remain_block_num.attr({
            x:x+10,
            y:bgSize.height/5*3,
            color:cc.color(164,114,196,255),
        });

        this._bgTop.addChild(this._lbl_remain_block_num);
        this.lbl_pass_progress = new cc.LabelTTF("通关进度: ", "Arial", 28);
        this.lbl_pass_progress.setAnchorPoint(cc.p(1,0.5));
        this.lbl_pass_progress.attr({
            x:x,
            y:bgSize.height/4,
            color:cc.color(95,95,95,255),
        });
        this._bgTop.addChild(this.lbl_pass_progress);
    },
    createPassProgress:function(num){
        if(this._var.repeat_num == num){
            return;
        }
        this._var.repeat_num = num;
        var x = cc.winSize.width - this._var.circleHeight * (num+0.5);
        if ((x - this._lbl_remain_block.width) - (this._btn_pause.x + this._btn_pause.width) < 100) {
            x = x + 100;
        }
        this._lbl_remain_block.x = x;
        this._lbl_remain_block_num.x = x+10;
        this.lbl_pass_progress.x = x;
        if (typeof(this._node_pass) == "object"){
            this._node_pass.removeAllChildren();
            this._node_pass.removeFromParent(true);
            this._node_pass = null;
        }
        this._node_pass = new cc.Node();
        this._node_pass.attr({
            x:x,
            y:this.lbl_pass_progress.y
        });
        this._bgTop.addChild(this._node_pass);
        this._pass_progress_sp = [];
        for (var i = 0; i < num; i++) {
            this._pass_progress_sp[i] = new cc.Sprite(this._picList[PM_GE.pass_progress_state.idle]);
            this._pass_progress_sp[i].attr({
                x:this._var.circleHeight*(i+0.5),
                y:0
            });
            this._node_pass.addChild(this._pass_progress_sp[i]);
        };
    },
    initTargetTipLayer:function(){
        this._targetTipLayer = new cc.LayerColor();
        this._targetTipLayer.ignoreAnchorPointForPosition(false);
        this._targetTipLayer.setAnchorPoint(cc.p(0.5,0));
        this._targetTipLayer.attr({
            x: cc.winSize.width / 2,
            y: 710,
            width: 300,
            height: this._var.targetLayerHeight,
            color: cc.color(255, 255, 255),
            opacity:125,
        });
        this.addChild(this._targetTipLayer,2);
        this._targetTipLayer.setVisible(false);

        var widgeSize = this._targetTipLayer.getContentSize();
        this.target_desc = new cc.LabelTTF("请点击所有此图标", "Arial", 28);
        this.target_desc.setAnchorPoint(cc.p(0.5,0));
        this.target_desc.attr({
            x:widgeSize.width/2,
            y:5,
            color: cc.color(0, 0, 0, 255)
        });
        this._targetTipLayer.addChild(this.target_desc);
        this._target_sp = [];
        for (var i = 0; i < 2; i++) {
            this._target_sp[i] = new cc.Sprite(res.posMem.pm_pattern_01);
            this._target_sp[i].attr({
                x:this._var.targetPicWidth*(i+0.5)+10,
                y:widgeSize.height/2+10
            });
            this._targetTipLayer.addChild(this._target_sp[i]);
        };
    },
    setRemainBlockNum:function(num){
        this._lbl_remain_block_num.setString(num);
    },
    setProgressState:function(index,state){
        this._pass_progress_sp[index].setTexture(this._picList[state]);
    },    
    setTargetPic:function(pic){        
        for (var i = 0; i < pic.length; i++) {
            this._target_sp[i].setTexture(pic[i]);
        };
    },   
    setCoinListLayerSize:function(size){
        this._coinListLayer.setContentSize(size);
    }, 
    adjustLayout:function(targetNum){        
        if (targetNum == 1)
        {
            this._targetTipLayer.width = this.target_desc.width+10;
            this.target_desc.x = this._targetTipLayer.width * 0.5;
            for (var i = 0; i < targetNum; i++) {
                this._target_sp[i].x = this._targetTipLayer.width * 0.5;
                this._target_sp[i].setVisible(true);
            };
            this._target_sp[1].setVisible(false);
        }
        else if (targetNum == 2)
        {
            this._targetTipLayer.width = this._var.targetPicWidth*2+10;
            if (this.target_desc.width > this._var.targetPicWidth*2){
                this._targetTipLayer.width = this.target_desc.width + 10;
            }
            this.target_desc.x = this._targetTipLayer.width * 0.5;
            for (var i = 0; i < targetNum; i++) {
                this._target_sp[i].x = this._targetTipLayer.width/4*(i*2+1);
                this._target_sp[i].setVisible(true);
            };
        }else{
            cc.log('error!!!!,adjustLayout-targetNum='+targetNum);
        }
    },

    hideParallelPic : function () {
        this.lbl_pass_progress.setVisible(false);
        for (var i = 0; i < this._pass_progress_sp.length; i++) {
            this._pass_progress_sp[i].setVisible(false);
        };

        // this._lbl_remain_block.setVisible(false);
        // this._lbl_remain_block_num.setVisible(false);
        this._lbl_remain_block.y = this._bgTop.height*0.5;
        this._lbl_remain_block_num.y = this._bgTop.height*0.5;
    },

    addGuideHand: function (targetAttr, cWidth, cHeight) {
        var size = cc.winSize;
        var scale = size.width / 750;

        this.hand = new cc.Sprite(res.Helper_hand);
        this.hand.setAnchorPoint(cc.p(0.5, 1));
        this.hand.attr({
            x:targetAttr.pos.x+10*scale,
            y:targetAttr.pos.y - 100*scale,
            scale:scale
        });
        this.addChild(this.hand, 6);

        this.addHandAction(targetAttr.grid);
    },

    addHandAction: function (grid) {
        var size = cc.winSize;
        var scale = size.width / 750;
        this.hand.stopAllActions();

        var move = cc.MoveBy.create(0.3, cc.p(0, 100*scale));
        var delay1 = cc.DelayTime.create(0.3);
        var call = cc.CallFunc.create(function () {
            this.handClick();
        }, this);
        var seq2 = cc.Sequence.create(move, delay1, call);
        this.hand.runAction(seq2);
    },

    handClick: function () {
        if (this.hand) {
            this.hand.stopAllActions();

            var scale1 = cc.ScaleTo.create(0.3, 0.8);
            var scale2 = cc.ScaleTo.create(0.3, 1.0);
            var seq1 = cc.Sequence.create(scale1, scale2);
            var repeat = cc.RepeatForever.create(seq1);
            this.hand.runAction(repeat); 
        }
    },

    setHandleFade: function (delegate, handle) {
        this.delegate = delegate;
        this.handle = handle;
    },

});

