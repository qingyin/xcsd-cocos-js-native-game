
var ViewSettle = SettleView.extend({
    ctor: function(args){

    	// this.args = {};
    	// this.args.level = 10;
    	// this.args.gameID = 6;
    	// this.args.hasPassed = true;
        this._super(args);

        this._argsDelegate = args.delegate;

        this.setName('ViewSettle');
        this.initLayer();

        cc.eventManager.addListener({
            event: cc.EventListener.TOUCH_ONE_BY_ONE,
            swallowTouches: true,
            onTouchBegan:function(touch, event){
                return true;},
        }, this);
    },
    initLayer:function(){
    	this.initTopLayer();
    	this.initCenterLayer();
    },
    initTopLayer:function(){
    	var args = {
    		title:'学能训练作业',
    		isShowBackBtn:true,
    	};
    	this._viewTop = new SubViewTop(args);
    	this.addChild(this._viewTop,2);
        this._viewTop.attr({
            anchorY:1,
            y:cc.winSize.height-this._viewTop.height,
        });
        this._viewTop.setHideBtnBack();
    },
    initCenterLayer:function(){
        this.btnBackMenu.setVisible(false);
        this.panel.y = this._viewTop.y * 0.5;

    	var args = {
			roundNum:this._argsDelegate.getGameNum(this._argsDelegate),
    	}
    	this.progress = new SubViewProgress(args);
    	this.addChild(this.progress,3);
    	var posY = (this._viewTop.y-this.panel.height)/4;
    	this.progress.y = this._viewTop.y - posY-this.progress.height;

        var taskList = this._argsDelegate.getTaskList(this._argsDelegate);
        for (var i = 0; i < taskList.length; i++) {
            var state = taskList[i].isPassed;
            if(typeof(state) == 'boolean'){
                if(state == true){
                    this.progress.setCircleTexture(i,this.progress.RIGHT);
                }else{
                    this.progress.setCircleTexture(i,this.progress.WRONG);
                }
            }else{
                break;
            }
        };


        var color = this._args.viewConfig.mainColor;
        this.btnSubmit = new ccui.Button();
        this.btnSubmit.loadTextures(res.game_btn_right_n,res.game_btn_right_s);
        this.btnSubmit.ignoreAnchorPointForPosition(true);      
        this.btnSubmit.attr({
            x:this.panel.width-this.btnSubmit.width-7,
            y:10,
            name:'submit',
            titleText:'提交并查看结果',
            titleFontSize:38,
            titleFontName:'Arial',
            visible:false,
        });
        this.panel.addChild(this.btnSubmit);
        platformFun.setBtnPicColor(this.btnSubmit,color);
        // this.btnSubmit._buttonNormalRenderer.color = color;
        // this.btnSubmit._buttonClickedRenderer.color = color;

        var self = this;
        this.btnSubmit.addClickEventListener(function(){
            var del = self._argsDelegate;
            for (var i = 0; i < del.taskList.length; i++) {
                del.taskList[i].score = del.taskList[i].stars;
            };
            del.submitTask(del);
            self.removeFromParent();
            var args = {
                delegate : del,
                taskList : del.getTaskList(del),
            }
            var viewRes = new ViewResult(args);
            cc.director.getRunningScene().addChild(viewRes, 3);
        });
    },

    showBtnSubmit:function(){
        this.btnSubmit.setVisible(true);
        this.btnNext.setVisible(false);
    },

});