
var ManagerGame = cc.Layer.extend({
    ctor:function (args) {
        this._super();
        this._args = args;
        this.gameId = args.gameId;
        //this.starsList = args.starsList;
        
        this.starsList = gameData.getGameValue(this.gameId,gameData.LevelInfoKey.starsList); 

        this._isTest = true;
        if(args.isTest === false){
            this._isTest = false;
        }
        this._viewChooseLevel = null;
        this._viewStart = null;
        
        //新手引导
        this._isGuide = args.isGuide || false;
        this._level = args.level || null;
        // this._isPassGuide = args.isPassGuide || false;

        this.init();
        return true;
    },
    init:function(){
        if (!this._isGuide) {
            this.showChooseLevelView();
        }else {
           this.showStartView(this, this._level); 
        }
        
        //this.startGame(this,1);
    },
    showChooseLevelView:function(){
        var args = {
            gameID:this.gameId,
            starsList : this.starsList,
            isTest : this._isTest,
        };
        
        //this._viewChooseLevel = new ChooseLevel(args);
        this._viewChooseLevel = new NewChooseLevel(args);

        this._viewChooseLevel.setHandleSelectedLevel(this,this.showStartView);
        this._viewChooseLevel.setHelpHandle(this,this.showGuide);
        if (this._args.isSettle == true){
            this._viewChooseLevel.setHandleBack(this,this.backLobby);
        }else {
            this._viewChooseLevel.setHandleBack(this,this.removeChooseLevelView);
        }
        
        this.addChild(this._viewChooseLevel);
        
    },
    removeChooseLevelView:function(self){
        self.delLevelsBall();
        self._viewChooseLevel.removeFromParent(true);
        self.removeFromParent(true);
    },

    backLobby: function (self) {
        var args = {
            userId : self._args.userId,
            token : self._args.token, 
        }
        self.showLobby = function () {
            self.delLevelsBall();
            self._viewChooseLevel.removeFromParent(true);
            self.removeFromParent(true);
            var scene = new cc.Scene();
            scene.addChild(new GameLobbyLayer());
            cc.director.runScene(scene);
        };
        LoadResource.loadingResourses(res.game, self, self.showLobby);
    },

    showStartView:function(self,level){
        var args = {
            level:level,
            gameID:self.gameId,
            isTest : self._isTest,
            starsList : self.starsList,
        };
        
        self._viewStart = new StartView(args);
        self.startGame = function(delegate){
            GameController.gotoScene(args);
        }
        self._viewStart.setHandleStartGame(self,self.startGame);
        self._viewStart.setHelpHandle(self,self.showGuide);
        self._viewStart.setHandleBack(self,self.removeStartView);
        self.addChild(self._viewStart);

        if (!self._isGuide) {
            for (var i = 0; i < self._viewChooseLevel._ballArray.length; i++) {
                var ball = self._viewChooseLevel._ballArray[i];
                if (ball._levelIndex == level) {
                    ball._isClicked = false;
                }
            };
        }
    },
    removeStartView:function(self){
        if (self._isGuide) {
            var args = {
                gameId : self.gameId,
                starsList : self.starsList,
                isTest : self._isTest,
                userId : self._args.userId,
                token : self._args.token,
                isSettle : true,
            };
            var manager = new ManagerGame(args);
            cc.director.getRunningScene().addChild(manager);
        }else {
            self._viewStart.removeFromParent(true);
        }
    },

    showGuide: function (self) {
        var args = {
            level:0,
            gameID:self.gameId,
            isTest : self._isTest,
            starsList : self.starsList,
            isGuide : true,
        };
        GameController.gotoScene(args);
    },

    delLevelsBall: function () {
        if (!this._isGuide && this._viewChooseLevel._ballArray != null) {
            var ballLength = this._viewChooseLevel._ballArray.length;
            for (var i = ballLength - 1; i >= 0; i--) {
                if (typeof(this._viewChooseLevel._ballArray[i]) == 'object') {
                    this._viewChooseLevel._ballArray[i].removeFromParent(true);
                    this._viewChooseLevel._ballArray[i] = null;
                }
            };
            this._viewChooseLevel._ballArray.splice(0, ballLength);
            this._viewChooseLevel._ballArray = null;
        }
    },

    onExit: function () {
        this.delLevelsBall();
        
        cc.log("-----onExitManager------");
        this._super();
    },
});