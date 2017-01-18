
var ChooseLevel = cc.LayerColor.extend({
    _pageNum:null,
    _ballArray:null,
    ctor:function (args) {
        this._super();

        this._args = {};
        this._args.gameID = args.gameID;
        this._args.levelNum = 30;
        this._args.viewConfig = VIEW_CONFIG[String(args.gameID)];
        this._args.starsList = args.starsList || null;
        this._args.starsListLenght = 0;
        for(var k in this._args.starsList){
            this._args.starsListLenght += 1;
        }

        this._pageNum = 2;

        this._ballArray = new Array();
        
        var color = this._args.viewConfig.bg_color;
        this.color = cc.color(color.r,color.g,color.b,color.Opacity);

        this._cellBallSpaceX=20;
        this._cellBallSpaceY=50;
 
        this.init();
        cc.eventManager.addListener({
            event: cc.EventListener.TOUCH_ONE_BY_ONE,
            swallowTouches: true,
            onTouchBegan:function(touch, event){
                return true;},
        }, this);

        return true;
    },
    init:function (){
        this.initTop();
        this.initCenter();
    },
    initTop:function (){        
        var size = cc.winSize;
        var scale = size.width / 750

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
            anchorPoint:cc.p(0.5,0),
            x:this.topView.width/2,
            y:posY,
            color:cc.color(color.r,color.g,color.b,color.Opacity),
        });
        this.topView.addMyChild(lblChooseLevel);
        // this.topView.addHelp();
        // this.topView.setHandleHelp(this, this.topHelpClick);
        
    },  
    topHelpClick: function (self) {
        self._handleHelp(self._delegateHelp);
        // var args = {
        //     gameID : self._args.gameID,
        // }
        // self.addHelpView = function () {
        //     var helpView = new HelpView(args);
        //     self.addChild(helpView);
        // }
        // var helpRes = res.gameHelp[args.gameID];
        // LoadResource.loadingResourses(helpRes, self, self.addHelpView);


    }, 

    setHelpHandle: function (delegate, handle) {
        this._delegateHelp = delegate;
        this._handleHelp = handle;
    },

    initCenter:function (){
        var size = cc.winSize;

        this._pageView = new ccui.PageView();
        this._pageView.setTouchEnabled(true);
        this._pageView.ignoreAnchorPointForPosition(false);
        this._pageView.setAnchorPoint(cc.p(0.5, 0.5));
        this._pageView.attr({
            x: size.width / 2,
            y: (size.height-this.topView.height)/2,
            width: size.width * 0.85,
            height: size.width * 0.38,
        });
        this._pageView.addEventListener(this.pageViewEvent, this);
        this.addChild(this._pageView);

        this._separator = [];
        var spaceX = 20;
        var separatorSize = 20;
        var posX = (size.width-(this._pageNum-1)*(spaceX+separatorSize))/2;
        for(var i =0;i<this._pageNum;i++){
            this._separator[i] = new cc.Sprite(res.game.game_pagebreak_01)
            this._separator[i].attr({
                anchorPoint:cc.p(0.5,0.5),
                x:posX+separatorSize*i+spaceX*i,
                y:this._pageView.x-this._pageView.height/2-80,
            });
            this.addChild(this._separator[i]);
        } 
        this._separator[0].setTexture(res.game.game_pagebreak_02);

        var rowNum=5;
        var colNum=4;
        this._cellHeight = 108;
        this._cellWidth = (this._pageView.width-(colNum-1)*this._cellBallSpaceX)/colNum;   
        this._pageView.height = rowNum * this._cellHeight + rowNum* this._cellBallSpaceY;
        this.addPageViewCell(rowNum,colNum);
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
    addPageViewCell:function(rowNum,colNum){
        // cc.log(this._args);
        var levelIndex = 1;
        for (var i = 0; i < 2; ++i) {
            var layout = new ccui.Layout();
            layout.setContentSize(this._pageView.getContentSize());
            for (var row = 0; row < rowNum; row++) {
                for (var col = 0; col < colNum; col++) {
                    if(levelIndex>this._args.levelNum){
                        break;
                    }
                    var ball = new ChooseLevelCell({viewConfig:this._args.viewConfig});
                    ball.setParentHandle(this,this.callHandle);
                    ball.attr({                    
                        x:this._cellWidth*(col+0.5)+this._cellBallSpaceX*col,
                        y:this._cellHeight*(rowNum-row-0.5)+this._cellBallSpaceY*(rowNum-row),
                    });                
                    layout.addChild(ball);
                    this._ballArray.push(ball);
                    ball.lbl_ball_number.setString(levelIndex);
                    ball._levelIndex = levelIndex;

                    //if(GameGlobals.getOnDebug() || this._args.gameID == 11){
                    if(GameGlobals.getOnDebug()){
                        ball.unLock();
                        //ball.showStar(Math.round(Math.random())*100%3);
                        ball.showStar(0);
                        ball.hideStar();
                    }else{
                        if(this._args.starsListLenght == 0 && levelIndex == 1){                                
                            ball.unLock();
                            ball.fockCurLevel();
                        }else{                           
                            var set = this._args.starsList[levelIndex-0];
                            if(typeof(set) == "object"){
                                ball.unLock();
                                var starNum = set["stars"];
                                if(starNum > 0){
                                    ball.showStar(starNum);
                                }else{
                                    ball.fockCurLevel();
                                }
                            }else{
                                set = this._args.starsList[levelIndex-1];
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
            this._pageView.addPage(layout);
        }
    },
    pageViewEvent: function (sender, type) {
        switch (type) {
            case ccui.PageView.EVENT_TURNING:
                var pageView = sender;
                for(var i =0;i<this._pageNum;i++){
                    this._separator[i].setTexture(res.game.game_pagebreak_01);
                } 
                this._separator[pageView.getCurrentPageIndex().valueOf()].setTexture(res.game.game_pagebreak_02);
                break;
            default:
                break;
        }
    }

});