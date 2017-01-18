
var SubViewTop = cc.LayerColor.extend({
    ctor: function(args){
        this._super();
        this.TOP_LAYER_HEIGHT = 128;
        this.height = this.TOP_LAYER_HEIGHT;
        this.width = cc.winSize.width;
        this.color = cc.color(255,255,255);

        this.args = {};
        this.args.title = args.title;
        this.args.isShowBackBtn = args.isShowBackBtn;
        // this.args.isTeacherApp = args.isTeacherApp;

        this.isShowArrow = false;
        this.isBack = true;
        this.isClickTest = true;
        this.isClickTitle = false;
        this.init();
    },
    init:function(){
        var posY = 44;
        var size = cc.winSize;

        this.lblTitle = new cc.LabelTTF('',"Arial-BoldMT",36);
        this.lblTitle.attr({
        	string:this.args.title,
        	x:size.width/2,
        	y:posY,
            color: cc.color(72,72,72),
            name: "title",
        });
        this.addChild(this.lblTitle);

        this.backNode = new cc.Node();
        this.backNode.attr({
            anchorX:0,
            anchorY:0,
            x:28,
            y:0,
            width:100,
            height:60,
            name:"back",
        });
        this.addChild(this.backNode);
        this.backNode.setVisible(this.args.isShowBackBtn);

        var _sprite_back = new cc.Sprite(res.comLearn_go_back);
        _sprite_back.attr({
            anchorX:0,
            x:0,
            y:posY,
        });
        this.backNode.addChild(_sprite_back);

        this._lbl_back = new cc.LabelTTF("返回", "Arial", 32);
        this._lbl_back.attr({
            anchorX:0,
            x:_sprite_back.x+_sprite_back.width,
            y:posY,
            color:cc.color(50,185,255),
        });
        this.backNode.addChild(this._lbl_back);
        
        this.backNode.width = this._lbl_back.x + this._lbl_back.width;
        this.backNode.height = posY * 2;
        this.addUIListener(this.backNode);

        var draw = new cc.DrawNode();
        this.addChild(draw);
        draw.drawSegment(cc.p(0, 2), cc.p(this.width, 2), 1, cc.color(216, 216, 216, 255));


        this.helpNode = new cc.Node();
        this.helpNode.attr({
            anchorX:1,
            anchorY:0,
            x:size.width-10,
            y:0,
            width:100,
            height:60,
            name:"help",
        });
        this.addChild(this.helpNode);
        this.helpNode.setVisible(false);
        
        this._lbl_help = new cc.LabelTTF("帮助", "Arial", 30);
        this._lbl_help.attr({
            anchorX:0.5,
            anchorY:0.5,
            x:this.helpNode.width * 0.5,
            y:posY,
            color:cc.color(50,185,255),
        });
        this.helpNode.addChild(this._lbl_help);

        this.helpNode.width = this._lbl_help.width + 22;
        this.helpNode.height = posY * 2;
        this._lbl_help.x = this.helpNode.width * 0.5;
        this.addUIListener(this.helpNode);

        // if (this.args.isTeacherApp == 1) {
        //     this.isFollow = false;
        //     this.helpNode.removeFromParent(true);
        // }

        cc.eventManager.addListener({
            event: cc.EventListener.TOUCH_ONE_BY_ONE,
            swallowTouches: false,
            onTouchBegan:function(touch, event){
                return true;},
        }, this);
        
    },

    addTriangleBtn: function () {
        this._btnTriangle = new ccui.Button();
        this._btnTriangle.loadTextures(res.learnTask.LearnWork_triangle_n,res.learnTask.LearnWork_triangle_s);
        this._btnTriangle.setAnchorPoint(cc.p(0.5,0.5));
        this._btnTriangle.attr({
            x:this.lblTitle.x + this.lblTitle.width *0.5 + this._btnTriangle.width*0.5,
            y:this.lblTitle.y,
            //color: cc.color(159, 168, 176),
        });
        this.addChild(this._btnTriangle);
        this.isClickTitle = true;
        this.addUIListener(this.lblTitle);
    },
    
    addTestArrow: function () {
        var size = cc.winSize;
        this.isShowArrow = true;
        this.testArrow = new cc.Sprite(res.learnTask.LC_smallarrow_n);
        this.testArrow.setAnchorPoint(cc.p(1,0.5));
        this.testArrow.attr({
        	x:this.helpNode.width,
       		y:this._lbl_help.y,
            //name: "arrow",
        });    
        this.helpNode.addChild(this.testArrow); 
        this._lbl_help.setFontSize(36);
        this._lbl_help.x = this._lbl_help.width * 0.5;//   this.testArrow.x - this.testArrow.width - 10;
        this.helpNode.width = this._lbl_help.width + 10 + this.testArrow.width;
        this.testArrow.x = this.helpNode.width;
        this.helpNode.name = "arrow";
        //this.addUIListener(this.testArrow);
    },

    addUIListener: function (node) {
        var self = this;
        var listener = cc.EventListener.create({
            event:cc.EventListener.TOUCH_ONE_BY_ONE,
            onTouchBegan:function(touch,event){return true;},
            onTouchEnded:function(touch,event){
                var target = event.getCurrentTarget();
                var rect = cc.rect(0,0,target.width,target.height);
                var pos = target.convertToNodeSpace(touch.getLocation());
                if(cc.rectContainsPoint(rect,pos)){
                    if (target.name == "back") {
                        if(typeof(self._handleBack) == "function"){
                            if (self.isBack == true) {
                                self._handleBack(self._delegate);
                            } 
                        }
                    }else if (target.name == "follow") {
                        // if (self.isFollow == false) {
                        //     self.isFollow = true;
                        //     self.followSprite.setTexture(res.teacherTest.a_keysymbol_s);
                        // }else {
                        //     self.isFollow = false;
                        //     self.followSprite.setTexture(res.teacherTest.a_keysymbol_n);
                        // }
                        // self.setTeacherFollow(self._delegateFollow, self.isFollow);
                    }else if (target.name == "title") {
                        if(typeof(self._handleChildren) == "function"){
                            if (self.isClickTitle == true) {
                                self._handleChildren(self._delegateChildren);
                            }
                        }
                    }else if (target.name == "arrow") {
                        if(typeof(self._handleTest) == "function"){
                            if (self.isClickTest == true) {
                                self._handleTest(self._delegateTest);
                            }
                        }
                    }else if (target.name == "help") {
                        if(typeof(self._handleHelp) == "function"){
                            self._handleHelp(self._delegateHelp);
                        }
                    }
                }
            }
        });
        cc.eventManager.addListener(listener,node);
    },

    setHandleBack:function(delegate,handle){
    	this._delegate = delegate;
    	this._handleBack = handle;
    },
    setHandleHelp:function(delegate,handle){
    	this._delegateHelp = delegate;
    	this._handleHelp = handle;
        this.helpNode.setVisible(true);
    },

    setHandleTest: function (delegate,handle, testCount) {
        this._delegateTest = delegate;
        this._handleTest = handle;
        
        this.helpNode.setVisible(true);
        this._lbl_help.setString("去测试");
        if (this.isShowArrow == false) {
            this.addTestArrow();
        }
        this.setTestBtnColor(testCount);
    },

    setTeacherFollow: function (delegate,handle) {
        this._delegateFollow = delegate;
        this._handleFollow = handle;
    },

    setHandleChildren: function (delegate,handle) {
        this._delegateChildren = delegate;
        this._handleChildren = handle;
        var self = this;
        this._btnTriangle.addClickEventListener(function(){
            self._handleChildren(self._delegateChildren);
        });
    },

    setTestBtnColor: function (testCount) {

        if (testCount > 0) {
            this._lbl_help.setColor(cc.color(65, 195, 255));
            this.testArrow.setTexture(res.learnTask.LC_smallarrow_n);
        }else {
            this._lbl_help.setColor(cc.color(218, 218, 218));
            this.testArrow.setTexture(res.learnTask.LC_smallarrow_d);
        }
    },

    setHideBtnBack:function(){
        this.backNode.setVisible(false);
    },

    setShowBtnBack: function () {
        this.backNode.setVisible(true);
    },

    setTitleText: function (title) {
        this.lblTitle.setString(title);
    },  

    setTriangleRotate: function (rotateAngle) {
        this._btnTriangle.setRotation(rotateAngle);
    },  

    setHelpVisible: function () {
        this.helpNode.removeFromParent(true);
    },

});
