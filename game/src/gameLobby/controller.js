
var GameLobbyLayer = cc.LayerColor.extend({
    _cellArray:null,
    ctor:function (args) {
        this._super();

        this._args = args || null;
        this.color = cc.color(255, 255, 253, 255);

        var winSize = cc.winSize;
        this.attr({
            x:0,
            y:0,
            anchorX: 0.5,
            anchorY: 0.5,
            width: winSize.width ,
            height: winSize.height,
        });

        this._cellArray = new Array();

        this._view = new GameLobbyView();
        this.addChild(this._view);
        this.addGameIcon();
        //this.test();
        return true;
    },
    addGameIcon:function(){
        var listView = new ccui.ListView();
        listView.setDirection(ccui.ScrollView.DIR_VERTICAL);
        listView.setTouchEnabled(true);
        listView.setBounceEnabled(true);
        listView.setBackGroundImageScale9Enabled(true);

        var listViewSize = this._view._gameListLayer.getContentSize();
        listView.setContentSize(cc.size(listViewSize.width, listViewSize.height));
        listView.x = 0;
        listView.y = 0;
        this._view._gameListLayer.addChild(listView);

        var listViewItemCount = UNIT_LAYOUT.length;

        // add custom item
        var scale = 1;
        var cellHeight = 368;
        for (i = 0; i < listViewItemCount; ++i) {
            var listViewItem = new ccui.Layout();
            listViewItem.height = cellHeight * scale;
            listViewItem.width = listView.width;
            var args = {
                res : UNIT_CONFIG[UNIT_LAYOUT[i]].res,
                gameName : UNIT_CONFIG[UNIT_LAYOUT[i]].gameName,
                grandParent: this._view._gameListLayer,
            }
            var gameCell = new GameCell(args);
            gameCell.x = listViewItem.width /2;
            gameCell.y = listViewItem.height /2;
            gameCell.setScale(scale);
            gameCell.setHandle(this,this.showGameLayer);
            gameCell.gameID = UNIT_LAYOUT[i][0];
            if(gameCell.gameID === 100){
                gameCell.removeListener();
            }

            listViewItem.addChild(gameCell);
            listView.pushBackCustomItem(listViewItem);

            this._cellArray.push(gameCell);
        }

        // set all items layout gravity
        listView.setGravity(ccui.ListView.GRAVITY_CENTER_VERTICAL);

        // set items margin
        listView.setItemsMargin(10);
        return true;
    },
    showGameLayer:function(self,gameId){
        if(gameId == 10003 || gameId == 10004){
            GameController.gotoScene({gameID:gameId});
        }else{   
            var starsList = gameData.getGameValue(gameId, gameData.LevelInfoKey.starsList);
            if (isLocalData == false && starsList == null) {
                self._args = {};
                self._args.userId = userData.getValue(userData.key.memberId);
                self._args.token = userData.getValue(userData.key.token);
            }

            for (var i = 0; i < self._cellArray.length; i++) {
                self._cellArray[i]._isClicked = true;
            };


            var args = {
                gameId : gameId,
                userId : null,
                token : null,
            }

            var gotoManager = function (argsManager) {
                for (var i = 0; i < self._cellArray.length; i++) {
                    self._cellArray[i]._isClicked = false;
                };

                var game = new ManagerGame(argsManager);
                cc.director.getRunningScene().addChild(game);
            };

            if (self._args != null) {
                args.userId = self._args.userId;
                args.token = self._args.token;
                self.deleteArgs();
                //LearnCS.getLevelStarNum(args, gotoManager);
                LearnCS.getLevelAndRanking(args, gotoManager);
            }else{                
                LearnCS.getRanking({gameId : gameId});
                var argsGame = null;
                if (isLocalData == true) {
                    argsGame = {
                        gameId : gameId,
                        userId : null,
                        token : null,
                    }
                }else {
                    gameData.setGameValue(gameId, gameData.LevelInfoKey.isSettle, false);
                    argsGame = {
                        gameId: gameData.getGameValue(gameId, gameData.LevelInfoKey.gameId),
                        starsList: gameData.getGameValue(gameId, gameData.LevelInfoKey.starsList),
                        isTest: gameData.getGameValue(gameId, gameData.LevelInfoKey.isTest),
                        userId: userData.getValue(userData.key.memberId),
                        token: userData.getValue(userData.key.memberId),
                        isSettle: gameData.getGameValue(gameId, gameData.LevelInfoKey.isSettle),
                    }

                }
                gotoManager(argsGame);
            }
        }
    }, 

    deleteArgs: function () {
        this._args = null;
    },

    onExit: function () {
        //var load = new LoadResource();
        for (var i = this._cellArray.length - 1; i >= 0; i--) {
            this._cellArray[i].removeFromParent(true);
            this._cellArray.pop();
        };
        this._cellArray = null;
        LoadResource.unLoadResourses(res.game);
        this._super();
    },

    test : function(){
        var startTime = new Date().getTime();  
        var count = 0;  
        var gameId = 0;
        this.schedule(function(){  
            var timePass = new Date().getTime() - startTime;  
            count++;  
            var delta = timePass - (count*100);  
            cc.log("time pass", timePass, "total delta", delta, "count", count);  
            var args = {};
            gameId = gameId +1;
            if(gameId > 10){
                gameId = 1;
            }
            args.gameId = gameId;
            LearnCS.getLevelStarNum(args);
        }, 0.15);  //参数一是调用函数 参数二是延迟几秒执行  
  
        this.scheduleUpdate(); 
    },
    update: function () {    //每一帧都调用这个函数  
        cc.log("update");  
    }, 

});


