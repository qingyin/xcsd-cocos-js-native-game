
var ViewResult = cc.LayerColor.extend({
    ctor: function(args){
        this._super();
        this.taskList = args.taskList;
        this.isTaskState = args.isTaskState || -1;
        this.totalScore = args.totalScore;

        this.color = cc.color(255,255,255);
        this.init();

        cc.eventManager.addListener({
            event: cc.EventListener.TOUCH_ONE_BY_ONE,
            swallowTouches: true,
            onTouchBegan:function(touch, event){
                return true;},
        }, this);
    },
    init:function(){
        if (this.isTaskState == -1) {
            this.initTop();
        }
    	this.initCenter();
    },
    initTop:function(){
    	var size = cc.winSize;
    	var args = {
    		title:'学能作业成绩',
    		isShowBackBtn:true,
    	};
    	this._viewTop = new SubViewTop(args);
    	this.addChild(this._viewTop,1);
        this._viewTop.attr({
            anchorY:1,
            y:cc.winSize.height-this._viewTop.height,
        });
        this._viewTop.setHandleBack(this, this.HandleBack);
        // this._viewTop.setHideBtnBack();
    },
    initCenter:function(){
        this.initScrollView();
        this.initScoreLayer();
        this.initTaskList();
    },
    initScrollView:function(){
        var size = cc.winSize;
        this.scrollView = new ccui.ScrollView();
        this.addChild(this.scrollView);
        this.scrollView.setDirection(ccui.ScrollView.DIR_VERTICAL);
        this.scrollView.setTouchEnabled(true);
        
        var height;
        if (this.isTaskState == -1) {
            height = size.height-this._viewTop.height;
        }else {
            height = size.height;
        }
        this.scrollView.attr({
            anchorX:0.5,
            anchorY:0.5,
            x:size.width * 0.5,
            y:height*0.5,
        });
        this.scrollView.setContentSize(cc.size(size.width,height));
        var h = this.getScoreViewInnerHeight();
        this.scrollView.setInnerContainerSize(cc.size(size.width, h));
    },
    initScoreLayer:function(){
    	this.layerScore = new cc.LayerColor(cc.color(243,243,243));
    	this.layerScore.attr({
    		width:cc.winSize.width,
    		height:84,
    		y:this.scrollView.getInnerContainerSize().height-84,
    	});
        this.scrollView.addChild(this.layerScore);

        var lblTemp = new cc.LabelTTF("本次作业成绩:  ", "Arial", 30);
        lblTemp.attr({
            anchorX:0,
            x:20,
            y:this.layerScore.height*0.5,
            color: cc.color(83, 83, 83),
        });
        this.layerScore.addChild(lblTemp);

        var score = this.getScore();
        // if (this.isTaskState != -1) {
        //     score = this.totalScore;
        // }
        this.lblScore = new cc.LabelTTF(score+"分", "Arial", 30);
        this.lblScore.attr({
            anchorX:0,
            x:20+lblTemp.width,
            y:this.layerScore.height*0.5,
            color: cc.color(253, 162, 32),
        });
        this.layerScore.addChild(this.lblScore);

        lblTemp = new cc.LabelTTF("作业满分为10分", "Arial", 30);
        lblTemp.attr({
            anchorX:1,
            x:this.layerScore.width-20,
            y:this.layerScore.height*0.5,
            color: cc.color(67, 109, 129),
        });
        this.layerScore.addChild(lblTemp);
        
        platformFun.reportFinishHomework(userData.getValue(userData.key.memberId),score);
    },
    initTaskList:function(){        
        var posY = this.layerScore.y - this.layerScore.height*0.5;
        for(var i=0;i<this.taskList.length;i++){
            var cell = new CellViewTask(this.taskList[i]);
            cell.attr({
                y:posY - (i+1) * cell.height,
            });
            if(i == this.taskList.length-1){
                cell.hideDot();
            }
            this.scrollView.addChild(cell);
            cell.showStar(this.taskList[i].stars);
            //cell.setLabelAttribute();
        }
    },
    getScore:function(){
        var num = 0;
        for(var i=0;i<this.taskList.length;i++){
            num += this.taskList[i].stars;
        }
        var score = Math.round(num/(this.taskList.length*3)*10);
        return score;
    },
    getScoreViewInnerHeight:function(){
        var h = 0;
        h = 84 + (this.taskList.length+1)*120;
        return h;
    },
    HandleBack:function(self){
        self.removeFromParent(true);
        platformFun.backToApp();
        cc.log('ViewResult--removeFromParent');
    },

});
