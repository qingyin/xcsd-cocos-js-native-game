
var GameSetting = cc.LayerColor.extend({
    ctor:function (args) {
        this._super();

        this.gameID = args.gameID;
        this.param_delegate = args.delegate; 
        this.isTest = args.isTest;
        this.userId = args.userId;
        this.token = args.token;
        this.isGameTest = args.isGameTest;
        this.starsList = args.starsList;
        this.level = args.level;
        this.color = cc.color(247,247,247);
        this.setName('GameSettingView');

        this.init();

        return true;
    },
    init:function (){
        var size = cc.winSize;
        var spaceY = 30;
        var btnNum = 4;
        var posY = size.height - (size.height-126*btnNum - spaceY * (btnNum-1))/2;
        //cc.log('posY',posY,size.height);

        var btnContinue = new ccui.Button();
        btnContinue.loadTextures(res.game_btn_continue_n,res.game_btn_continue_s,'');        
        btnContinue.attr({
            anchorPoint:cc.p(0.5,1),
            x:size.width*0.5,
            y:posY,
            name:'continue',
        });
        this.addChild(btnContinue);
        btnContinue.addTouchEventListener(this.BtnEvent,this);

        var btnRestart = new ccui.Button();
        btnRestart.loadTextures(res.game_btn_restart_n,res.game_btn_restart_s,'');        
        btnRestart.attr({
            anchorPoint:cc.p(0.5,1),
            x:size.width*0.5,
            y:btnContinue.y-btnContinue.height-spaceY,
            name:'restart',
        });
        this.addChild(btnRestart);
        btnRestart.setTag(111);
        //btnRestart.addTouchEventListener(this.BtnEvent,this);
        
        var btnHelp = new ccui.Button();
        btnHelp.loadTextures(res.game_btn_help_n,res.game_btn_help_s,'');        
        btnHelp.attr({
            anchorPoint:cc.p(0.5,1),
            x:size.width*0.5,
            y:btnRestart.y-btnRestart.height-spaceY,
            name:'help',
        });
        this.addChild(btnHelp);
        btnHelp.setTag(728);
        btnHelp.addTouchEventListener(this.BtnEvent,this);
                
        var btnBackMenu = new ccui.Button();
        btnBackMenu.loadTextures(res.game_btn_menuBack_n,res.game_btn_menuBack_s,'');        
        btnBackMenu.attr({
            anchorPoint:cc.p(0.5,1),
            x:size.width*0.5,
            y:btnHelp.y-btnHelp.height-spaceY,
            name:'backMenu',
        });
        this.addChild(btnBackMenu);
        btnBackMenu.setTag(1411);
        btnBackMenu.addTouchEventListener(this.BtnEvent,this);

        var btnBackLobby = new ccui.Button();
        btnBackLobby.loadTextures(res.game_btn_help_n,res.game_btn_help_s,'');        
        btnBackLobby.attr({
            anchorPoint:cc.p(0.5,1),
            x:size.width*0.5,
            y:btnBackMenu.y-btnBackMenu.height-spaceY,
            name:'backLobby',
        });
        this.addChild(btnBackLobby);
        btnBackLobby.setTag(72811);
        btnBackLobby.addTouchEventListener(this.BtnEvent,this);
        btnBackLobby.setVisible(false);

        if (this.isTest == true) {
            this.setTestPauseView();
        }else {
            btnRestart.addTouchEventListener(this.BtnEvent,this);
        }

        cc.eventManager.addListener({
            event:cc.EventListener.TOUCH_ONE_BY_ONE,
            swallowTouches:true,
            onTouchBegan:function(touch,event){
                return true;
            },
        },this);
    },

    BtnEvent: function (sender, type) {
        switch (type) {
            case ccui.Widget.TOUCH_ENDED:
            	if(sender.name == 'continue'){
            		cc.log('continue',typeof(this._handleContinue));
                    if (typeof(this._handleContinue) == 'function'){
                        this._handleContinue(this._delegate);
                    }
                    this.dispatchEvent(BtnEventName.resume);
            	}else if (sender.name == 'restart') {
                    cc.log('restart',typeof(this._handleRestart));
                    if (typeof(this._handleRestart) == 'function'){
                        this._handleRestart(this._delegate);
                    }
                    this.dispatchEvent(BtnEventName.restart);
            	}else if (sender.name == 'help') {
            		cc.log('help');
                    if (this.gameID === 11) {
                        this.dispatchEvent(BtnEventName.howToPlay);
                    } else {                        
                        var args = {
                            userId : this.userId,
                            token : this.token,
                            level:this.level,
                            gameID:this.gameID,
                            isTest : this.isGameTest,
                            starsList : this.starsList,
                            isGuide : true,
                            delegate : this.param_delegate,
                            delegateLearnTest : this.param_delegate,
                            isLearnTest : this.isTest,
                        };
                        GameController.gotoScene(args);
                    }
                }else if (sender.name == 'backLobby') {
                    platformFun.reportDataGameOut(this.gameID);
                    var scene = new cc.Scene();
                    var args = {
                        userId : userData.getValue(userData.key.memberId),
                        token : userData.getValue(userData.key.token),
                    }
                    scene.addChild(new GameLobbyLayer(args));
                    cc.director.runScene(scene);
            	}else if (sender.name == 'backMenu') {
            		cc.log('backMenu');
                    platformFun.reportDataGameOut(this.gameID);                    
                    if(this.param_delegate == false){
                        var scene = new cc.Scene();
                        scene.addChild(new GameLobbyLayer());
                        cc.director.runScene(scene);
                    }else{
                        this.param_delegate.showViewTip(this.param_delegate,this,this._delegate);
                    }
            	}else{

            	}
                break;
            case ccui.Widget.TOUCH_MOVED:
                break;
            case ccui.Widget.TOUCH_BEGAN:
                break;
            case ccui.Widget.TOUCH_CANCELED:
                break;
            default:
                break;
        }
    },

    setHandle:function(self,handleContinue,handleRestart){
        this._delegate = self;
        this._handleContinue = handleContinue;
        this._handleRestart = handleRestart;
    },
   
    setTestPauseView: function () {
        var reStart = this.getChildByTag(111);
        var help = this.getChildByTag(728);
        var back = this.getChildByTag(1411);

        var startY = reStart.y;
        reStart.removeFromParent(true);
        var btnY = help.y;
        help.y = startY;
        back.y = btnY;
    },

    setGuideHelp: function () {
        var help = this.getChildByTag(728);
        var back = this.getChildByTag(1411);
        var btnY = help.y;
        back.y = btnY;
        help.setVisible(false);
    },

    onExit: function () {
        //var load = new LoadResource();
        // LoadResource.unLoadResourses(res.pauseView);
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