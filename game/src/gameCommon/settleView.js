
var SettleView = cc.LayerColor.extend({
    _clickNext:null,
    ctor:function(args) {
        this._super();
        var size = cc.winSize;

        this._args = {};
        this._args.userId = args.userId;
        this._args.token = args.token;
        this._args.isGameTest = args.isGameTest;
        this._args.starsList = args.starsList;
        this._args.level = args.level;
        this._args.gameID = args.gameID;
        this._args.viewConfig = VIEW_CONFIG[String(args.gameID)];
        this._args.type = UNIT_CONFIG[String(args.gameID)].type;
        this._args.hasPassed = args.hasPassed;
        this._args.delegate = args.delegate || 1;
        
        this.color = this._args.viewConfig.bg_color;

        this._args.starNum = args.starNum;
        this.starDelay = args.starNum*0.1 + 0.9;

        this._args.incScore = args.incScore || 0;
        this._args.displayRank = args.displayRank || false;
        this._args.rankPercentage = args.rankPercentage || 0;

        this._clickNext = false;

        cc.eventManager.addListener({
            event: cc.EventListener.TOUCH_ONE_BY_ONE,
            swallowTouches: true,
            onTouchBegan: function () {return true;},
        }, this); 

        this.init();
        return true;
    },
    init:function (){
        this.initCenter();
    },
    initCenter:function(){
        var size = cc.winSize;
        this.panel = new cc.Sprite(res.game_panel_settleaccounts);
        this.addChild(this.panel);
        this.panel.attr({
            anchorPoint:cc.p(0.5,0.5),
            x:size.width*0.5,
            y:size.height*0.5,
        });

        var lblGameName = new cc.LabelTTF();
        var color = this._args.viewConfig.mainColor;
        lblGameName.attr({
            string:this._args.viewConfig.gameName,
            fontName:'Arial',
            fontSize:38,
            anchorPoint:cc.p(0.5,1),
            x:this.panel.width/2,
            y:this.panel.height-60,
            color:cc.color(color),
        });
        this.panel.addChild(lblGameName);
        //cc.log('lblGameName',lblGameName.y,lblGameName.height,lblGameName);

        var lblLevel = new cc.LabelTTF();
        lblLevel.attr({
            string:this._args.type + ' 第'+this._args.level+'关',
            fontName:'Arial',
            fontSize:29,
            anchorPoint:cc.p(0.5,1),
            x:this.panel.width/2,
            y:lblGameName.y-lblGameName.height-20,
            color:cc.color(172,172,172),
        });
        lblLevel.setTag(33);
        this.panel.addChild(lblLevel);

        var lblPassState = new cc.LabelTTF();
        lblPassState.attr({
            string:'未过关',
            fontName:'Arial',
            fontSize:55,
            anchorPoint:cc.p(0.5,1),
            x:this.panel.width/2,
            //y:lblLevel.y-lblLevel.height-80,
            y:this.panel.height*0.5+110,
            color:cc.color(color),
        });
        lblPassState.setTag(666);
        this.panel.addChild(lblPassState);

        this.brightStar = [];
        this.brightStar[1] = new cc.Sprite(res.game_star_big_01);
        this.brightStar[1].attr({
            x:this.panel.width*0.5,
            y:this.panel.height*0.5-30,
            visible:false,
        });
        this.panel.addChild(this.brightStar[1]);

        this.brightStar[0] = new cc.Sprite(res.game_star_big_01);
        this.brightStar[0].attr({
            x:this.panel.width*0.5-this.brightStar[1].width-20,
            y:this.panel.height*0.5-30,
            visible:false,          
        });
        this.panel.addChild(this.brightStar[0]);

        this.brightStar[2] = new cc.Sprite(res.game_star_big_01);
        this.brightStar[2].attr({
            x:this.panel.width*0.5+this.brightStar[1].width+20,
            y:this.panel.height*0.5-30,
            visible:false,
        });
        this.panel.addChild(this.brightStar[2]);

        this.darkStar = [];
        for(var i=0;i<3;i++){  

            this.darkStar[i] = new cc.Sprite(res.game_star_big_02);
            this.darkStar[i].attr({
                x:this.brightStar[i].x,
                y:this.panel.height*0.5-30,            
            });
            this.panel.addChild(this.darkStar[i]);
        }

        this._lblResTip = new cc.LabelTTF();
        this._lblResTip.attr({
            string:'答对13题',
            fontName:'Arial',
            fontSize:32,
            anchorPoint:cc.p(0.5,1),
            x:this.panel.width/2,
            y:this.panel.height*0.5-160,
            color:cc.color(color),
        });
        this.panel.addChild(this._lblResTip);

        this.btnAgain = new ccui.Button();
        this.btnAgain.loadTextures(res.game_btn_left_n,res.game_btn_left_s);  
        this.btnAgain.ignoreAnchorPointForPosition(true);      
        this.btnAgain.attr({
            x:7,
            y:10,
            name:'again',
            titleText:'再试一次',
            titleFontSize:38,
            titleFontName:'Arial',
        });
        this.panel.addChild(this.btnAgain);
        this.btnAgain.addTouchEventListener(this.btnEvent,this);
        
        platformFun.setBtnPicColor(this.btnAgain,color);
        // btnAgain._buttonNormalRenderer.color = color;
        // btnAgain._buttonClickedRenderer.color = color;

        if(this._args.hasPassed == true){            
            lblPassState.setString('已通关');
        }

        if(this._args.hasPassed == true || this._args.delegate != 1){
            this.btnNext = new ccui.Button();
            this.btnNext.loadTextures(res.game_btn_right_n,res.game_btn_right_s);
            this.btnNext.ignoreAnchorPointForPosition(true);      
            this.btnNext.attr({
                x:this.panel.width-this.btnNext.width-7,
                y:10,
                name:'next',
                titleText:'下一关',
                titleFontSize:38,
                titleFontName:'Arial',
            });
            this.panel.addChild(this.btnNext);
            this.btnNext.addTouchEventListener(this.btnEvent,this);

            platformFun.setBtnPicColor(this.btnNext,color);
            // this.btnNext._buttonNormalRenderer.color = color;
            // this.btnNext._buttonClickedRenderer.color = color;

            this.btnBackMenu = new ccui.Button();     
            this.btnBackMenu.attr({
                titleText:'返回菜单',
                titleFontSize:45,
                x:this.panel.width*0.5,
                y:this.panel.y-this.panel.height-100,
                name:'backMenu',
                color:cc.color(172,172,172),
            });
            this.panel.addChild(this.btnBackMenu);
            this.btnBackMenu.addTouchEventListener(this.btnEvent,this);

            if (this._args.hasPassed == true && this._args.level == 30) {
                this.btnNext.setTitleText('完成');
                this.btnBackMenu.removeFromParent(true);
            }
            //cc.log('this.btnBackMenu',this.btnBackMenu);
        }else{
            this.btnQuit = new ccui.Button();
            this.btnQuit.loadTextures(res.game_btn_right_n,res.game_btn_right_s);  
            this.btnQuit.ignoreAnchorPointForPosition(true);      
            this.btnQuit.attr({
                x:this.panel.width-this.btnQuit.width-7,
                y:10,
                name:'quit',
                titleText:'退出游戏',
                titleFontSize:38,
                titleFontName:'Arial',
            });
            this.panel.addChild(this.btnQuit);
            this.btnQuit.addTouchEventListener(this.btnEvent,this);
            
            platformFun.setBtnPicColor(this.btnQuit,color);
            // this.btnQuit._buttonNormalRenderer.color = color;
            // this.btnQuit._buttonClickedRenderer.color = color;
        }
        // lblPassState.setVisible(false);

        if (this._args.delegate == 1) {
            if (this._args.incScore > 0) {
                this.addGrade();
            }
            
            if (this._args.displayRank == true) {
                this.addGradeTage();
            }
        }
        
    },

    addGradeTage: function () {
        var rankTage = Math.round(this._args.rankPercentage*1000) / 10;
        var tageString = rankTage.toString() + '%';
        var lalTage = new cc.LabelTTF();
        lalTage.setAnchorPoint(0.5,0.5);
        lalTage.attr({
            string:tageString,
            fontName:'Arial',
            fontSize:48,
            x:this.panel.width/2,
            y:this.panel.height*0.5+110,
            color:cc.color(255,102,0),
        });
        this.panel.addChild(lalTage);

        var passState = this.panel.getChildByTag(666);
        passState.setFontSize(36);
        passState.color = cc.color(255,102,0);
        passState.setAnchorPoint(1,0.5);
        var passString = '您超过了';
        passState.setString(passString);
        passState.x = lalTage.x - lalTage.width/2 - 20;

        var lalStudent = new cc.LabelTTF();
        lalStudent.setAnchorPoint(0,0.5);
        lalStudent.attr({
            string:'的学生',
            fontName:'Arial',
            fontSize:36,
            x:lalTage.x + lalTage.width/2 + 20,
            y:this.panel.height*0.5+110,
            color:cc.color(255,102,0),
        });
        this.panel.addChild(lalStudent);
    },

    addGrade: function () {
        //addtaskScore
        var taskScore = new cc.Sprite(res.game_icon_seal);
        taskScore.attr({
            anchorX:1,
            anchorY:1,
            x:this.panel.width - 30,
            y:this.panel.height - 30,
        });
        this.panel.addChild(taskScore);
        taskScore.setTag(110);

        var scoreString = '+' + this._args.incScore.toString();
        var scoreLbl = new cc.LabelTTF();
        scoreLbl.attr({
            string:scoreString,
            fontName:'Arial',
            fontSize:36,
            anchorPoint:cc.p(0.5,0),
            x:taskScore.width/2,
            y:taskScore.height*0.5+25,
            color:cc.color(255,102,0),
        });
        taskScore.addChild(scoreLbl);

        taskScore.setVisible(false);
        taskScore.x = taskScore.x + 60;
        taskScore.y = taskScore.y - 100;
        taskScore.setOpacity(0);
        taskScore.setScale(0);

        this.scoreAction(taskScore);

    },

    scoreAction: function (node) {
        var delay = cc.DelayTime.create(this.starDelay);
        var call = cc.CallFunc.create(function () {
            node.setVisible(true);
        }, this);
        var move = cc.MoveBy.create(0.1, cc.p(-60, 100));
        var fadeIn = cc.FadeIn.create(0.1);
        var scale = cc.ScaleTo.create(0.1, 1.1);
        var delay1 = cc.DelayTime.create(0.2);
        var scale1 = cc.ScaleTo.create(0.1, 1);
        var spawn = cc.Spawn.create(move, fadeIn, scale);
        var seq = cc.Sequence.create(delay, call, spawn,delay1, scale1);
        node.runAction(seq);
    },

    btnEvent:function(sender,type){
        switch (type) {
            case ccui.Widget.TOUCH_ENDED:
                if(sender.name == 'again'){                    
                    if (typeof(this._handleAgain) == 'function') {
                        this.removeFromParent(true);
                        this._handleAgain(this._delegateAgain);
                    };
                    this.dispatchEvent(BtnEventName.restart);
                }else if(sender.name == 'next'){
                    if (this._clickNext == false && typeof(this._handleNext) == 'function') {
                        this._clickNext = true;
                        if (this._args.gameID != 7) {
                            this._clickNext = false;
                            this.removeFromParent(true);
                        }
                        if (this._args.hasPassed == true && this._args.level == 30) {
                            this._clickNext = false;
                            this.backChooseLevel();
                        }else {
                            this._handleNext(this._delegateNext);
                        }                   
                    };
                    var action = userData.getValue(userData.key.action);
                    if (action == userData.actionEnum.GameLobby) {
                        this.dispatchEvent(BtnEventName.next);
                    }
                }else if(sender.name == 'quit'){
                    platformFun.reportDataGameOut(this._args.gameID);
                    var self = this; 
                    this.backLobby(self);
                    this.removeFromParent(true);
                }else if(sender.name == 'backMenu'){
                    platformFun.reportDataGameOut(this._args.gameID);
                    this.backChooseLevel();
                    this.removeFromParent(true);
                }
                break;
            default:
                break;
        }
    },

    backChooseLevel: function () {
        var scene = new cc.Scene();

        gameData.setGameValue(this._args.gameID, gameData.LevelInfoKey.isSettle, true);
        var argsGame = {
            gameId: gameData.getGameValue(this._args.gameID, gameData.LevelInfoKey.gameId) || this._args.gameID,
            starsList: gameData.getGameValue(this._args.gameID, gameData.LevelInfoKey.starsList),
            isTest: gameData.getGameValue(this._args.gameID, gameData.LevelInfoKey.isTest),
            userId: userData.getValue(userData.key.memberId),
            token: userData.getValue(userData.key.memberId),
            isSettle: gameData.getGameValue(this._args.gameID, gameData.LevelInfoKey.isSettle),
        }
        var layer = new ManagerGame(argsGame);
        layer._viewChooseLevel.setHandleBack(this,this.backLobby);
        scene.addChild(layer);
        cc.director.runScene(scene);
    },   

    backLobby: function (self) {
        self.showLobby = function () {
            var scene = new cc.Scene();
            scene.addChild(new GameLobbyLayer());
            cc.director.runScene(scene);
        };
        LoadResource.loadingResourses(res.game, self, self.showLobby);
    },

    showStar:function(num){
        for (var i = 0; i < num; i++) {
            this.starAction(this.brightStar[i], i); 
        };
    },
    starAction: function (star, i) {
        var dTime = 0.5 + i * 0.1;
        var delay = cc.DelayTime.create(dTime);
        var call = cc.CallFunc.create(function () {
            star.setVisible(true);
            star.x = star.x - 30;
            star.y = star.y - 30;
            this.darkStar[i].setVisible(false);
        }, this);
        var rotate = cc.RotateBy.create(0.05, 360);
        var move = cc.MoveBy.create(0.05, cc.p(30, 30));
        var spawn = cc.Spawn.create(rotate, move);
        var seq = cc.Sequence.create(delay, call, spawn);
        star.runAction(seq);
    },

    setHandle:function(self,handleNext,handleAgain){
        this._delegateNext = self;
        this._delegateAgain = self;
        this._handleNext = handleNext;
        this._handleAgain = handleAgain;
    },
    setHandleNext:function(self,handleNext){
        this._delegateNext = self;
        this._handleNext = handleNext;
    },
    setHandleAgain:function(self,handleAgain){
        this._delegateAgain = self;
        this._handleAgain = handleAgain;
    },
    setResTipText:function(txt){
        this._lblResTip.setString(txt);
    },

    onExit: function () {
        //var load = new LoadResource();
        for (var i = 0; i < this._args.starNum; i++) {
            this.brightStar[i].stopAllActions();
        };
        if (this._args.delegate == 1 && this._args.incScore > 0) {
            var scoreShow = this.panel.getChildByTag(110);
            scoreShow.stopAllActions();
        }
        // LoadResource.unLoadResourses(res.settleView);
        this._super();
    },    
    dispatchEvent : function(eventName){
        var cEvent = new cc.EventCustom(CustomEvent.settingBtnEvent.name);
        var userData = {};
        userData[CustomEvent.settingBtnEvent.userDataKey.btnEventName] = eventName;
        cEvent.setUserData(userData);
        cc.eventManager.dispatchEvent(cEvent);
    },
});