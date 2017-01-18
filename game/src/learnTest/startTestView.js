
var StartTestView = cc.LayerColor.extend({
    _testEnergyLevel:null,
    ctor:function () {
        this._super();

        this.color = cc.color(255,255,255,255);

        this._args = {};
        this._args.doneGameCount = 0;
        this._args.doingGameId = 1;

        this._testEnergyLevel = 0;

        this._clickTest = false;

        this.initTop();
        this.initCenter(); 
        this.initBottom();

        cc.eventManager.addListener({
            event: cc.EventListener.TOUCH_ONE_BY_ONE,
            swallowTouches: true,
            onTouchBegan:function(touch, event){
                return true;
            },
        }, this);
    },

    initTop: function () {
    	var args = {
            title:'学能测试',
            isShowBackBtn:true,
        };
        this._viewTop = new SubViewTop(args);
        // this._viewTop.TOP_LAYER_HEIGHT = 128;
        // this._viewTop.height = this._viewTop.TOP_LAYER_HEIGHT;
        this.addChild(this._viewTop,2);
        this._viewTop.attr({
            anchorY:1,
            y:cc.winSize.height-this._viewTop.height,
        });
    },

    initCenter: function () {
    	var size = cc.winSize;
        var scale = size.width / 750;

    	var testPic = new cc.Sprite(res.learnTest.lc_pic);
        testPic.setAnchorPoint(cc.p(0.5, 1));
        testPic.attr({
            x:size.width * 0.5,
            y:size.height - this._viewTop.height - 180,
            scale:scale
        });
        this.addChild(testPic);


        var string = "       学能测试是测量你的学习能力商数，通过学能测" + "\n" + "试你可以了解自己在各个能力上的等级以及变化，你" + "\n" + "也可以和班级其他用户比较，做出最好的训练计划。" + "\n" + "学能测试每月只有两次机会哦，请认真做答。";
        var testIntroduce = new cc.LabelTTF(string, "Arial", 30);
        testIntroduce.ignoreAnchorPointForPosition(false);
        testIntroduce.setAnchorPoint(cc.p(0.5, 1));
        testIntroduce.x = this.width*0.5;
        testIntroduce.y = testPic.y - testPic.height - 180;
        testIntroduce.color = cc.color(72, 72, 72);
        this.addChild(testIntroduce);
    },

    initBottom: function () {
		var size = cc.winSize;
        var scale = size.width / 750;

        var bottomBg = new cc.Sprite(res.learnTest.LearnWork_bg_lower);
        bottomBg.setAnchorPoint(cc.p(0.5, 0));
        bottomBg.attr({
            x:size.width * 0.5,
            y:0,
            scale:scale
        });
        this.addChild(bottomBg);

        var color = cc.color(65, 195, 255);
        this.startBtn = new ccui.Button();
        this.startBtn.setTouchEnabled(true);
        this.startBtn.loadTextures(res.learnTest.bnt_lc_starttest_n, res.learnTest.bnt_lc_starttest_s, "");
        this.startBtn.ignoreAnchorPointForPosition(false);
        this.startBtn.attr({
            titleText:'开始测评',
            titleFontSize:38,
            titleFontName:'Arial',
            titileColor:cc.color(255,255,255),
            //anchorPoint:cc.p(0.5,0.5),
            x:bottomBg.width*0.5,
            y:bottomBg.height*0.5,
            name:'starttest'
        });
        bottomBg.addChild(this.startBtn);
        
        platformFun.setBtnPicColor(this.startBtn,color);
        // this.startBtn._buttonNormalRenderer.color = color;
        // this.startBtn._buttonClickedRenderer.color = color;
    },

    setHandleStart:function(self,handle){
        this._delegate = self;
        this._handleStart = handle;
        var _self = this;
        this.startBtn.addClickEventListener(function(){

            if (_self._clickTest == false) {
                _self._clickTest = true;
                if(typeof(_self._handleStart) == 'function'){
                    _self._handleStart(_self._delegate);
                }
            }
            
        });
    },

    onExit: function () {
        this._super();
    },

});