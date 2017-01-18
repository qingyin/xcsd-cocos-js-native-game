
var NewWordsView = cc.LayerColor.extend({
    _upLayer:null,
    _downLayer:null,
    _upCellNum:null,
    ctor:function (bgColor) {
        this._super();

        this._downCellArray = [];
        this._upCellArray = [];
        this._UPCELLNUM = 10;
        this._upCellNum = 0;

        this.color = bgColor;
        this.init();
        return true;
    },

    init:function (){
        this.initTop();
        this.initCenter();
        this.initLayoutConfig();
        this.layout();
        this.addCell();
        //this.showUpCell(10);
    },
    initTop:function (){ 
        this._topView = new CommonTopPauseProgress();
        //this._topView.createPassProgress(6);
        this.addChild(this._topView);

        //progress bar long
        this._progressBar = new cc.ProgressTimer(new cc.Sprite(res.newWords.newWorlds_nav_progressbar));
        this._progressBar.ignoreAnchorPointForPosition(false);
        this._progressBar.setAnchorPoint(cc.p(0.5, 1));

        this._progressBar.type = cc.ProgressTimer.TYPE_BAR;
        this._progressBar.midPoint = cc.p(1, 0);
        this._progressBar.barChangeRate = cc.p(1, 0);
        this._progressBar.x = this._topView.topBg.width/2;
        this._progressBar.y = 0;

        this._topView.topBg.addChild(this._progressBar);
        this._progressBar.setPercentage(100);
    },
    initCenter:function(){
        var size = cc.winSize;
        //var scale = size.width / 750;
        this._lblTargetDes = new cc.LabelTTF("", "Arial", 38);
        this._lblTargetDes.setAnchorPoint(cc.p(0.5,0.5));
        this._lblTargetDes.attr({
            x:size.width / 2,
            y:size.height*3/4,
            color:cc.color(95,95,95,255),
        });
        this.addChild(this._lblTargetDes);

        this._upLayer = new cc.Layer();
        this._upLayer.ignoreAnchorPointForPosition(false);
        this._upLayer.attr({
            anchorPoint:cc.p(0.5,0.5),
            x: size.width / 2,
            y: size.height * 0.53,
            width: size.width * 0.99,
            height: 200,
            // color: cc.color(255, 0, 0),
            // opacity:0,
        });
        this.addChild(this._upLayer,1);

        this._downLayer = new cc.Layer();
        this._downLayer.ignoreAnchorPointForPosition(false);
        this._downLayer.attr({
            anchorPoint:cc.p(0.5,1),
            x: size.width / 2,
            y: size.height * 0.20,
            width: size.width * 0.99,
            height: 200,
            //color: cc.color(255, 0, 0),
            //opacity:0,
            //visible:false,
        });
        this.addChild(this._downLayer,1);
    },
    initLayoutConfig:function(){
        this._cellRow = 2;
        this._cellCol = 7;
        this._cellSpaceX = 5;
        this._cellSpaceY = 15;
        this._upCellSize = 142;
        this._downCellSize = 95;
        this._downCellWidth = (this._downLayer.width-this._cellSpaceX*(this._cellCol-1)) / this._cellCol;
        this._downCellHeight = (this._downLayer.width-this._cellSpaceX*(this._cellCol-1)) / this._cellCol;

        this._upCellWidth = (this._upLayer.width-this._cellSpaceX*4) / 5;
        this._upCellHeight = (this._upLayer.width-this._cellSpaceX*4) / 5;

        this._downCellScale = this._downCellSize/this._downCellWidth;
        this._upCellScale = this._upCellSize/this._upCellWidth;
        //cc.log('initLayoutConfig',this._downCellScale,this._upCellScale);

        this._UpCellStartPosX = [];
        this._UpCellStartPosX[0]=0;
        this._UpCellStartPosX[1]=this._upCellWidth*2.5;
        this._UpCellStartPosX[2]=(this._upLayer.width-(this._upCellWidth+this._cellSpaceX)*1)/2;
        this._UpCellStartPosX[3]=this._upCellWidth*1.5;
        this._UpCellStartPosX[4]=(this._upLayer.width-(this._upCellWidth+this._cellSpaceX)*3)/2;
        this._UpCellStartPosX[5]=this._upCellWidth*0.5;
        this._UpCellStartPosY = [];
        this._UpCellStartPosY[0]=this._upCellWidth*1.5+this._cellSpaceY;
        this._UpCellStartPosY[1]=this._upCellWidth*0.5;
    },
    layout:function(){
        this._downLayer.height = this._downCellWidth*2+this._cellSpaceY;
        this._upLayer.height = this._upCellWidth*2+this._cellSpaceY;
        this._lblTargetDes.y = this._upLayer.y + this._upLayer.height / 2 + 40;
    },
    addCell:function(){
        for (var i = 0; i < this._UPCELLNUM; i++) {
            var cell = new NewWordCell({isUpPic:true}); 
            var row = 0;
            if(i > 4){
                row = 1;
            }
            cell.attr({
                x:this._upCellWidth*(0.5+i%5)+this._cellSpaceX*i%5,
                y:this._upCellWidth*(0.5+row)+this._cellSpaceY*row,
                visible : false,
                //scale:this._upCellScale,
            });
            this._upCellArray[i] = cell;            
            this._upLayer.addChild(cell);
        }

        for (var i = 0; i < this._cellRow; i++) {
            for (var j = 0; j < this._cellCol; j++) {
                var cell = new NewWordCell({isUpPic:false});
                cell.attr({
                    x:this._downCellWidth*(0.5+j)+this._cellSpaceX*j,
                    y:this._downCellWidth*(0.5+i)+this._cellSpaceY*i,
                    //scale:this._downCellScale,
                });

                this._downCellArray[this._downCellArray.length] = cell;
                this._downLayer.addChild(cell);
            };
        };
    },
    showUpCell:function(num){        
        for (var i = 0; i < this._UPCELLNUM; i++) {
            if(i+1>num){
                this._upCellArray[i].setVisible(false);
            }else{
                this._upCellArray[i].setVisible(true);
            }
        }
        var row_1_num = 0,row_2_num = 0;
        if(num < 4){
            row_1_num = num;
            row_2_num = 0;
        }else{
            row_1_num = Math.floor(num/2);
            row_2_num = Math.ceil(num/2);            
        }
        for (var i = 0; i < row_1_num; i++) {
            var x = this._UpCellStartPosX[row_1_num]+(this._cellSpaceX+this._upCellWidth)*i;
            this._upCellArray[i].attr({
                x:x,
                y:this._UpCellStartPosY[0],
            });
        }        
        for (var i = 0; i < row_2_num; i++) {
            var x = this._UpCellStartPosX[row_2_num]+(this._cellSpaceX+this._upCellWidth)*i;
            this._upCellArray[i+row_1_num].attr({
                x:x,
                y:this._UpCellStartPosY[1],
            });
        }

    },
    setCellShowStr:function(upCellStr,downCellStr){
        for (var i = 0; i < upCellStr.length; i++) {
            this._upCellArray[i].setShowStr(upCellStr[i]);
        };
        this.showUpCell(upCellStr.length);
        this._upCellNum = upCellStr.length;
        for (var i = 0; i < downCellStr.length; i++) {
            this._downCellArray[i].setShowStr(downCellStr[i]);
        };
    },
    setCellIdle:function(){        
        for (var i = 0; i < this._upCellArray.length; i++) {
            this._upCellArray[i].setIdle();
        };
        for (var i = 0; i < this._downCellArray.length; i++) {
            this._downCellArray[i].setIdle();
        };
    },
    runCellAction:function(isUp,isTurnOpen,actionTime){
        if(isUp == true){         
            for (var i = 0; i < this._upCellNum; i++) {
                this._upCellArray[i].runOverturnAction(isTurnOpen,actionTime)
            };
        }else{
            for (var i = 0; i < 14; i++) {
                this._downCellArray[i].runOverturnAction(isTurnOpen,actionTime)
            };
        }
    },
    runOtherRightCellAction:function(actionTime){        
        for (var i = 0; i < 14; i++) {
            this._downCellArray[i].runOpenAction(actionTime)
        };        
        for (var i = 0; i < this._upCellNum; i++) {
            this._upCellArray[i].runOverturnAction(true,actionTime)
        };
    },
    setCellHandle:function(self,handle){
        for (var i = 0; i < 14; i++) {
            this._downCellArray[i].setTouchHandle(self,handle);
        };
    },
    appearRotateScale:function(node,actionTime){ 
        node.setScale(0);   
        var seq = cc.spawn(
            cc.scaleTo(actionTime,1,1),
            cc.rotateBy(actionTime,360)
        );
        node.runAction(seq);
    },
    disappearRotateScale:function(node,actionTime){
        var seq = cc.spawn(
            cc.scaleTo(actionTime,0,0),
            cc.rotateBy(actionTime,-360)
        );
        node.runAction(seq);
    },
    runActionFade:function(isAppear,actionTime){
        if(isAppear == true){
            this._lblTargetDes.setOpacity(0);
            this._lblTargetDes.runAction(cc.fadeTo(actionTime,255));
            for (var i = 0; i < this._upCellNum; i++) {        
                this._upCellArray[i].runActionFade(isAppear,actionTime);
            };
            for (var i = 0; i < 14; i++) {
                this._downCellArray[i].runActionFade(isAppear,actionTime);
            };
        }else{
            this._lblTargetDes.runAction(cc.fadeTo(actionTime,0));
            for (var i = 0; i < this._upCellNum; i++) {                
                this._upCellArray[i].runActionFade(isAppear,actionTime);
            };
            for (var i = 0; i < 14; i++) {
                this._downCellArray[i].runActionFade(isAppear,actionTime);
            };
        }
    },
    setTargetDesc:function(desc){
        this._lblTargetDes.setString(desc);
    },
    setViewVisible:function(isShow){
        this._topView.setVisible(isShow); 
        this._lblTargetDes.setVisible(isShow);
        this._upLayer.setVisible(isShow);
        this._downLayer.setVisible(isShow);
    },

    hideProgress: function () {
        this._topView.hideParallelPic();
    },

    showProgress: function () {
        this._topView.showParallelPic();
    },

    addGuideHand: function (targetPos, targetSize) {
        var size = cc.winSize;
        var scale = size.width / 750;

        this.hand = new cc.Sprite(res.Helper_hand);
        this.hand.setAnchorPoint(cc.p(0.5, 1));
        this.hand.attr({
            x:targetPos.x + 10*scale,
            y:targetPos.y - 100*scale,
            scale:scale
        });
        this.addChild(this.hand, 6);

        this.addHandAction();
    },

    addHandAction: function () {
        var size = cc.winSize;
        var scale = size.width / 750;
        this.hand.stopAllActions();

        var move = cc.MoveBy.create(0.3, cc.p(0, 100*scale));
        var delay1 = cc.DelayTime.create(0.3);
        var seq2 = cc.Sequence.create(move, delay1);
        this.hand.runAction(seq2);

        this.scheduleOnce(this.handClick,0.6);
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

});

