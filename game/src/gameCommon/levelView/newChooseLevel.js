
var NewChooseLevel = cc.LayerColor.extend({
    difficultyTxt1 : "本年级难度",
    difficultyTxt2 : "进阶难度",
    difficultyTxt3 : "高阶难度",
    _ballArray:null,
    starsListLenght : null,
    allLevelNum : 30,
    ctor:function (args) {
        this._super();

        this._args = {};
        this._args.gameId = args.gameID;

        this._args.viewConfig = VIEW_CONFIG[String(this._args.gameId)];
        this._args.starsList = args.starsList || null;
        this.starsListLenght = 0;
        this.myStarNum = 0;
        for(var k in this._args.starsList){
            this.starsListLenght += 1;
            var num = this._args.starsList[k]["stars"];
            if(num > 0){
                this.myStarNum = this.myStarNum + num;
            }
        }
        var color = this._args.viewConfig.bg_color;
        this.color = cc.color(color.r,color.g,color.b,color.Opacity);

        this._ballArray = [];
        this._cellBallSpaceX = 20;
        this._cellBallSpaceY = 50;
 
        this.init();

        return true;
    },
    onEnter : function(){
        this._super();        
        cc.eventManager.addListener({
            event: cc.EventListener.TOUCH_ONE_BY_ONE,
            swallowTouches: true,
            onTouchBegan:function(touch, event){
                return true;},
        }, this);

        var self = this;
        if (this._headListener) {
            cc.eventManager.removeListener(this._headListener);
            this._headListener = null;
        }
        this._headListener = cc.EventListener.create({
            event: cc.EventListener.CUSTOM,
            eventName: "_rankHeadInfoEvent",
            callback: function(event){
                var ud = event.getUserData();
                cc.log("-----_addListener--ud=",ud);
                if (ud.gameId == self._args.gameId) {                    
                    self.showSelfScore(self._rankSubTitleLayer,gameData.getMySelfRankScore(self._args.gameId));
                    for (var i = 0; i < 5; i++) {
                        self._head[i].setData(gameData.getRankInfo(self._args.gameId,i + 1));
                    }
                }
            }
        });
        cc.eventManager.addListener(this._headListener, 1);

    },
    onExit : function(){
        this._super();
        cc.eventManager.removeListener(this._headListener);
        this._headListener = null;

    },
    init:function (){
        this.initTop();
        this._createViewRank();
        this._createViewLevel();
    },
    initTop:function (){        
        var size = cc.winSize;
        var scale = size.width / 750;

        var args = {
            delegate:this._delegate,
            handleBack:this._handleBack,
        };
        this.topView = new CommonTopBack(args);
        this.addChild(this.topView);

        var posY = 44;
        var lblChooseLevel = new cc.LabelTTF("选择关卡","Arial",36);
        var color = this._args.viewConfig.mainColor;
        lblChooseLevel.attr({
            anchorY:0,
            x:this.topView.width/2,
            y:posY,
            color:cc.color(color.r,color.g,color.b,color.Opacity),
        });
        this.topView.addMyChild(lblChooseLevel);
        // this.topView.addHelp();
        // this.topView.setHandleHelp(this, this.topHelpClick);        
    },
    showSelfScore : function(parent,score){
        parent.removeAllChildren();
        var rankPlayerLbl = new cc.LabelTTF("班级高手榜","Arial",34);
        rankPlayerLbl.attr({
            color : cc.color(49,49,49),
            tag : 1,
            anchorX : 0,
            anchorY : 1,
            x : rankPlayerLbl.width * 0,
            y : parent.height - 7,
        });
        parent.addChild(rankPlayerLbl);

        var node = new cc.Node();
        var yourLbl = new cc.LabelTTF("你的","Arial",28);
        yourLbl.attr({
            color : cc.color(49,49,49),
            tag : 1,
            anchorX : 0,
            anchorY : 1,
            x : 0,
            y : 0,
        });
        node.addChild(yourLbl);
        var spaceX = 5;
        var star = new cc.Sprite(res.game_x_star_least);
        star.attr({
            x:yourLbl.width + spaceX,
            y:0,
            anchorX : 0,
            anchorY : 1,
        });
        node.addChild(star);

        var scoreLbl = new cc.LabelTTF(score+"","Arial",28);
        scoreLbl.attr({
            color : cc.color(49,49,49),
            tag : 1,
            anchorX : 0,
            anchorY : 1,
            x : yourLbl.width + star.width + spaceX * 2,
            y : 0,
        });
        node.addChild(scoreLbl);
        node.width = yourLbl.width + star.width + scoreLbl.width;
        node.anchorX = 1;
        node.attr({
            anchorX : 1,
            anchorY : 1,
            width : yourLbl.width + star.width + scoreLbl.width + spaceX * 2,
            x : parent.width,
            y : parent.height - 10,
        });
        parent.addChild(node);
    },
    _createViewRank : function(){
        var size = cc.winSize;
        var scale = size.width / 750;
        // if (scale < 1) {
        //     scale = 1;
        // }

        //this._rankSubTitleLayer = new cc.LayerColor();
        this._rankSubTitleLayer = new cc.Layer();
        this._rankSubTitleLayer.attr({
            color : cc.color.RED,
            width : size.width * 0.95,
            height : 60,
            anchorX : 0.5,
            //anchorY : 0.5,
            x : size.width * 0.025, 
            y : size.height - this.topView.height * scale - 60,
        });
        this.addChild(this._rankSubTitleLayer,6);
        this.showSelfScore(this._rankSubTitleLayer,this.myStarNum);


        this._scrollViewRank = new cc.LayerColor();
        this._scrollViewRank.attr({
            color : cc.color(255,0,0),
            anchorX : 0.5,
        });

        this._scrollViewRank = new ccui.ScrollView();
        this._scrollViewRank.setDirection(ccui.ScrollView.DIR_HORIZONTAL);
        this._scrollViewRank.setTouchEnabled(true);
        var H = 210 + 60*0;
        this._scrollViewRank.setContentSize(cc.size(this._rankSubTitleLayer.width, H));
        var y = size.height - this.topView.height * scale - this._scrollViewRank.getContentSize().height - this._rankSubTitleLayer.height;
        this._scrollViewRank.setPosition(this._rankSubTitleLayer.x,y);
        this.addChild(this._scrollViewRank,5);

        var args = {
            height : H - 60*0,
            rankIndex : 0,
        };
        this._head = [];
        for (var i = 0; i < 5; i++) {
            args.rankIndex = i + 1;
            this._head[i] = new HeadCell(args);
            this._head[i].x = this._head[i].width * (i+0);
            this._head[i].setData(gameData.getRankInfo(this._args.gameId,i + 1));
            this._head[i].setHeadFrameColor(this._args.viewConfig.bg_color);
            this._scrollViewRank.addChild(this._head[i]);
        }
        this._scrollViewRank.setInnerContainerSize(cc.size(this._head[0].width * 5,this._scrollViewRank.height));
    },

    _createViewLevel : function(){
        var size = cc.winSize;
        var scale = size.width / 750;
        // this._scrollViewLevel = new cc.LayerColor();
        // this._scrollViewLevel.attr({
        //     color : cc.color(255,255,0),
        // });
        var layoutSpaceY = 10;
        this._scrollViewLevel = new ccui.ScrollView();
        this._scrollViewLevel.setDirection(ccui.ScrollView.DIR_VERTICAL);
        this._scrollViewLevel.setTouchEnabled(true);
        var visbleHight = size.height - this.topView.height * scale - this._scrollViewRank.getContentSize().height - layoutSpaceY - this._rankSubTitleLayer.height;

        this._scrollViewLevel.setContentSize(cc.size(size.width, visbleHight));
        this._scrollViewLevel.setPosition(0,5);
        this.addChild(this._scrollViewLevel);

        
        var layoutHeight = 108 * 5;
        var lockLayoutHeight = 177 * 1.5;        

        // var df1 = 16;//gameData.getLevelDifficulty(this._args.gameId,0);
        // var df2 = 8;//gameData.getLevelDifficulty(this._args.gameId,1);
        // var df3 = 8;//gameData.getLevelDifficulty(this._args.gameId,2);

        var df1 = gameData.getLevelDifficulty(this._args.gameId,0);
        var df2 = gameData.getLevelDifficulty(this._args.gameId,1);
        var df3 = gameData.getLevelDifficulty(this._args.gameId,2);

        cc.log("df1-----",df1,df2,df3);

        var colNum = 4;
        var rowNum = Math.ceil(df1/colNum);
        layoutHeight = this._getLayoutHeight(rowNum);
        this._createLayout23(layoutHeight,0,true);

        this._addCell(rowNum,colNum,this._layout1,0,df1);
        
        //this.starsListLenght = 15;


        if (this.starsListLenght >= df1 && this.starsListLenght < df1+df2) {
            rowNum = Math.ceil(df2/colNum);
            layoutHeight = this._getLayoutHeight(rowNum);          
            this._createLayout23(layoutHeight,lockLayoutHeight);
            this._layout3.getChildByTag(1).setVisible(false);
            
            this._addCell(rowNum,colNum,this._layout2,df1,df1+df2);

            var btn = this._createLockBtn(this._layout3,this.difficultyTxt3);
            this._addSpriteListener(btn,this.difficultyTxt2,this.difficultyTxt1);
        }else if (this.starsListLenght >= df1+df2){
            this._createLayout23(this._getLayoutHeight(Math.ceil(df2/colNum)),this._getLayoutHeight(Math.ceil(df3/colNum)));
            
            rowNum = Math.ceil(df2/colNum);
            this._addCell(rowNum,colNum,this._layout2,df1,df1+df2);

            rowNum = Math.ceil(df3/colNum);
            this._addCell(rowNum,colNum,this._layout3,df1 + df2,df1+df2+df3);
        }else{
            this._createLayout23(lockLayoutHeight,lockLayoutHeight);
            this._layout2.getChildByTag(1).setVisible(false);
            this._layout3.getChildByTag(1).setVisible(false);

            var btn = this._createLockBtn(this._layout2,this.difficultyTxt2);
            this._addSpriteListener(btn,this.difficultyTxt2,this.difficultyTxt1);
            var btn2 = this._createLockBtn(this._layout3,this.difficultyTxt3);
            this._addSpriteListener(btn2,this.difficultyTxt3,this.difficultyTxt2);
        }

        var innerWidth = this._scrollViewLevel.width;
        var innerHeight = this._layout1.height + this._layout2.height + this._layout3.height + 3 * layoutSpaceY;
        this._scrollViewLevel.setInnerContainerSize(cc.size(innerWidth, innerHeight));
        var diff = innerHeight - visbleHight;
        this._layout1.y = this._layout1.y + diff;
        this._layout2.y = this._layout2.y + diff;
        this._layout3.y = this._layout3.y + diff;
    },
    _createLayout23 : function(layoutHeight2,layoutHeight3,isOnlyLayout1){
        var layoutSpaceY = 10;
        if (isOnlyLayout1 === true) {
            this._layout1 = this.createLayout(layoutHeight2);
            this._layout1.attr({
            x : (this._scrollViewLevel.width - this._layout1.width) * 0.5,
            y : this._scrollViewLevel.height - this._layout1.height * 0.5 - layoutSpaceY,
            });
            this._scrollViewLevel.addChild(this._layout1);
            this._layout1.getChildByTag(1).setString(this.difficultyTxt1);
            return;
        }

        this._layout2 = this.createLayout(layoutHeight2);
        this._layout2.attr({
            x : (this._scrollViewLevel.width - this._layout2.width) * 0.5,
            y : this._layout1.y - this._layout1.height * 0.5 - this._layout2.height * 0.5 - layoutSpaceY,
        });
        this._scrollViewLevel.addChild(this._layout2);
        this._layout2.getChildByTag(1).setString(this.difficultyTxt2);
 
        this._layout3 = this.createLayout(layoutHeight3);
        this._layout3.attr({
            x : (this._scrollViewLevel.width - this._layout3.width) * 0.5,
            y : this._layout2.y - this._layout2.height * 0.5 - this._layout3.height * 0.5 - layoutSpaceY,
        });
        this._scrollViewLevel.addChild(this._layout3);
        this._layout3.getChildByTag(1).setString(this.difficultyTxt3);
    },
    createLayout: function (layoutHeight) {
        var layout = new ccui.Layout();
        // layout.setBackGroundColorType(ccui.Layout.BG_COLOR_SOLID);
        // layout.setBackGroundColor(cc.color(128, 128, 128));
        layout.attr({
            width : cc.winSize.width * 0.9,
            height : layoutHeight,
            anchorX : 0,
            anchorY : 0.5,
        });

        this.draw = new cc.DrawNode();
        layout.addChild(this.draw,2);
        this.draw.drawSegment(cc.p(0,layout.height-2), cc.p(layout.width,layout.height-2), 1, cc.color(204,204,204,255));

        var difficultyLbl = new cc.LabelTTF(this.difficultyTxt1,"Arial",34);
        difficultyLbl.attr({
            color : cc.color(49,49,49),
            tag : 1,
            x : difficultyLbl.width * 0.5,
            y : layout.height - difficultyLbl.height,
        });
        layout.addChild(difficultyLbl,2);

        return layout;
    },
    _getLayoutHeight : function(row){
        var h = 0;
        if (row == 1) {
            h = 108 * 2.2;
        }else if (row == 2){
            h = 108 * 3.9;
        }else if(row == 3){
            h = 108 * 5.3;
        }else if(row == 4){
            h = 108 * 6.8;            
        }else if(row == 5){
            h = 108 * 8.2;
        }else if(row == 6){
            h = 108 * 9.6;            
        }else{
            h = 108 * 11;  
        }
        return h;
    },
    _createLockBtn : function(parent,btnTitle){
        var star = new cc.Sprite(res.game_x_lock_01);
        star.attr({
            anchorX : 0.5,
            anchorY : 0.5,
            x : parent.width * 0.5,
            y : parent.height * 0.5,
        });
        parent.addChild(star);

        var starChild = new cc.Sprite(res.game_x_lock_02);
        starChild.attr({
            x : star.width * 0.5,
            y : star.height * 0.5,
            anchorX : 0.5,
            anchorY : 0.5,
        });
        starChild.setColor(this._args.viewConfig.mainColor);
        star.addChild(starChild);

        var lbl = new cc.LabelTTF(btnTitle,"Arial",34);
        lbl.attr({
            color : cc.color(255,255,255,255),
            tag : 11,
            anchorX : 0.5,
            anchorY : 1,
            x : star.width * 0.5,
            y : star.height * 0.5 - 15,
        });
        star.addChild(lbl);

        return star;
    },
    _addSpriteListener : function(sprite,titleTile,contentTitile){
        var self = this;
        cc.eventManager.addListener({
            event: cc.EventListener.TOUCH_ONE_BY_ONE,
            swallowTouches: false,
            onTouchBegan:function(touch, event){
                return true;
            },
            onTouchEnded: function(touch, event){         
                var target = event.getCurrentTarget();
                var rect = cc.rect(0,0,target.width,target.height);
                var pos = target.convertToNodeSpace(touch.getLocation());
                if (cc.rectContainsPoint(rect,pos)){
                    var view = new LevelLockView();
                    view.setTxt(titleTile,contentTitile);
                    view.setBtnColor(self._args.viewConfig.mainColor);
                    self.addChild(view,20);
                }
            },
        }, sprite);
    },
    _addCell : function(rowNum,colNum,parent,startIndex,endIndex){
        this._cellHeight = 108;
        this._cellWidth = (this._layout1.width-(colNum-1)*this._cellBallSpaceX)/colNum;
        this._cellBallSpaceX = 20;
        this._cellBallSpaceY = 50;

        var levelIndex = 1;
        for (var row = 0; row < rowNum; row++) {
            for (var col = 0; col < colNum; col++) {
                if(levelIndex + startIndex > this.allLevelNum){
                    break;
                }
                if(levelIndex + startIndex > endIndex){
                    break;
                }
                var ball = new ChooseLevelCell({viewConfig:this._args.viewConfig});
                ball.setParentHandle(this,this.callHandle);
                ball.attr({                    
                    x:this._cellWidth*(col+0.5)+this._cellBallSpaceX*col,
                    y:this._cellHeight*(rowNum-row-0.50)+this._cellBallSpaceY*(rowNum-row),
                });                
                parent.addChild(ball);
                this._ballArray.push(ball);
                ball.lbl_ball_number.setString(levelIndex + startIndex);
                ball._levelIndex = levelIndex + startIndex;

                //if(GameGlobals.getOnDebug() || this._args.gameId == 11){
                if(GameGlobals.getOnDebug()){
                    ball.unLock();
                    ball.showStar(Math.round(Math.random())*100%3);
                    //ball.showStar(0);
                    //ball.hideStar();
                }else{
                    if(this.starsListLenght == 0 && levelIndex == 1){                                
                        ball.unLock();
                        ball.fockCurLevel();
                    }else{                           
                        //var set = this._args.starsList[levelIndex-0];
                        var set = this._args.starsList[ball._levelIndex-0];
                        if(typeof(set) == "object"){
                            ball.unLock();
                            var starNum = set["stars"];
                            if(starNum > 0){
                                ball.showStar(starNum);
                            }else{
                                ball.fockCurLevel();
                            }
                        }else{
                            //set = this._args.starsList[levelIndex-1];
                            set = this._args.starsList[ball._levelIndex-1];
                            if(typeof(set) == "object"){
                                if(set["stars"] > 0){
                                    ball.unLock();
                                    ball.fockCurLevel();
                                }else {
                                    ball.lock();
                                }
                            }else{
                                ball.lock();
                            }
                        }
                    }
                }   
                levelIndex += 1;
            };     
        };
    },     
    topHelpClick: function (self) {
        self._handleHelp(self._delegateHelp);
    },
    setHelpHandle: function (delegate, handle) {
        this._delegateHelp = delegate;
        this._handleHelp = handle;
    },
    callHandle:function(self,ball){
        self._handleSelectedLevel(self._delegate,ball._levelIndex);
    },
    setHandleSelectedLevel:function(self,handle){
        this._delegate = self;
        this._handleSelectedLevel = handle;
    },    
    setHandleBack:function(self,handle){
        this.topView.setHandleBack(self,handle);
    }, 

});