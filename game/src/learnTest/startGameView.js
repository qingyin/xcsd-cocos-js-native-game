
var StartGameView = cc.LayerColor.extend({ 
    ctor:function (args) {
        this._super();
        this.color = cc.color(255,255,255,255);
        this._gameID = args.gameID;

        this._gameCount = args.gameCount;
        this._gameIndex = args.gameIndex;

         cc.eventManager.addListener({
            event: cc.EventListener.TOUCH_ONE_BY_ONE,
            swallowTouches: true,
            onTouchBegan:function(touch, event){
                return true;
            },
        }, this);

        this.initTop();
		this.initCenter();
		return true;
    },

    initTop:function(){
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
        this._viewTop.setHelpVisible();
    },

    initCenter: function () {
        var size = cc.winSize;
        var scale = size.width / 750;

        var Flag = new cc.Sprite(res.learnTest.lc_nav_normal);
        var Line = new cc.Sprite(res.learnTask.LearnWork_Thedottedline02);

        var width_flag_line = (Flag.width + Line.width) * scale * (this._gameCount - 1) + Flag.width * scale;
        var row = Math.ceil(width_flag_line / (size.width - 60));
        var rowFlagCount = Math.ceil(this._gameCount / row);
        var flagCount = 0;
        
        for (var i = 0; i < row; i++) {
            flagCount = flagCount + rowFlagCount;
            if (i == row - 1) {
                rowFlagCount = this._gameCount - flagCount;
            }
            var rowFlagCount = Math.ceil(this._gameCount / row);
            var gameFlag_width;
            for (var j = 0; j < rowFlagCount; j++) {
                var gameFlag_res;
                if (j == (this._gameIndex)) {
                    gameFlag_res = res.learnTest.lc_nav_current;
                }else if (j < this._gameIndex) {
                    gameFlag_res = res.learnTest.lc_nav_pass;
                }else {
                    gameFlag_res = res.learnTest.lc_nav_normal;
                }
                var gameFlag = new cc.Sprite(gameFlag_res);
                gameFlag_width = gameFlag.width;
                gameFlag.setAnchorPoint(cc.p(0.5, 0.5));
                gameFlag.attr({
                    x:size.width/2 + (j - rowFlagCount/2 + 1/2) * 3/2 * gameFlag.width * scale,
                    y:size.height * 3 / 4 - (gameFlag.height + 10) * i,
                    scale:scale
                });
                this.addChild(gameFlag);
            };
            
            var left_width = ((rowFlagCount/2 - 1) * 3) / 2;
            for (var k = 0; k < (rowFlagCount - 1); k++) {
                var pointLine = new cc.Sprite(res.learnTask.LearnWork_Thedottedline02);
                pointLine.setAnchorPoint(cc.p(0.5, 0.5));
                pointLine.attr({
                    x:size.width/2 + (gameFlag_width * scale) * (k*3/2 - left_width),
                    y:size.height * 3 / 4 - (gameFlag.height + 10) * i,
                    scale:scale
                });
                this.addChild(pointLine);
            };
        };
 
        this.initTestGame();
    },

    initTestGame: function () {
        var size = cc.winSize;
        var scale = size.width / 750;

        //gameBg
        var gameBg = new cc.Sprite(res.comLearn_panel_bg);
        gameBg.setAnchorPoint(cc.p(0.5, 0.5));
        gameBg.attr({
            x:size.width / 2,
            y:size.height * 15/32,
            scale:scale
        });
        this.addChild(gameBg);

        //gameIcon
        var unit = UNIT_CONFIG[String(this._gameID)]; 
        var gameIcon = new cc.Sprite(unit.gameIcon);
        gameIcon.setAnchorPoint(cc.p(0.5, 0.5));
        gameIcon.attr({
            x:gameBg.width / 2,
            y:gameBg.height * 3/4,
            scale:scale
        });
        gameBg.addChild(gameIcon);

        //testGameName
        var testGameName = new cc.LabelTTF(unit.gameName, "Arial", 45);
        testGameName.setAnchorPoint(cc.p(0.5, 0.5));
        testGameName.attr({
            x: gameBg.width / 2,
            y: gameBg.height * 1/2,
            scale:scale
        });
        testGameName.color = cc.color(255, 150, 125);
        gameBg.addChild(testGameName);

        //testType
        var testGameType = new cc.LabelTTF(unit.type, "Arial", 40);
        testGameType.setAnchorPoint(cc.p(0.5, 0.5));
        testGameType.attr({
            x: gameBg.width / 2,
            y: gameBg.height * 5/16,
            scale:scale
        });
        testGameType.color = cc.color(150, 150, 150);
        gameBg.addChild(testGameType);

        //startBtn
        var color = cc.color(65, 195, 255);
        this.startBtn = new ccui.Button();
        this.startBtn.setTouchEnabled(true);
        this.startBtn.loadTextures(res.learnTest.bnt_lc_btc_n, res.learnTest.bnt_lc_btc_s, "");
        this.startBtn.ignoreAnchorPointForPosition(false);
        this.startBtn.attr({
            titleText:'开始挑战',
            titleFontSize:38,
            titleFontName:'Arial',
            titileColor:cc.color(255,255,255),
            anchorPoint:cc.p(0.5,0),
            x:gameBg.width*0.5,
            y:0,
            name:'startgame'
        });
        gameBg.addChild(this.startBtn);
        
        // this.startBtn._buttonNormalRenderer.color = color;
        // this.startBtn._buttonClickedRenderer.color = color;
        
        platformFun.setBtnPicColor(this.startBtn,color);
        // this.startBtn._buttonNormalRenderer.color = color;
        // this.startBtn._buttonClickedRenderer.color = color;
    }, 
    setHandleStart:function(self,handle){
        this._delegate = self;
        this._handleStart = handle;
        var _self = this;
        this.startBtn.addClickEventListener(function(){
            if(typeof(_self._handleStart) == 'function'){
                _self._handleStart(_self._delegate);
            }
        });
    },
    setBtnTitleText:function(){
        this.startBtn.setTitleText("继续挑战");
    },

    onExit: function () {
        this._super();
    },

});

