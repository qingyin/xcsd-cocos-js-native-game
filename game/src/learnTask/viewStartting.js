
var ViewStartting = StartView.extend({
    ctor: function(args){
      	this.args = {};
      	this.args.level = args.level || 10;
      	this.args.gameID = args.gameID || 6;
        this.args.gameNum = args.gameNum || 10;
        this._super(args);
        this.topView.removeFromParent(true);
        this.setName('ViewStartting');
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
        //this.topView.setVisible(false);
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
        this._viewTop.setHelpVisible();
    },
    initCenterLayer:function(){
        //this.topView.setVisible(false);
        this.panel.y = this._viewTop.y * 0.5;

      	var args = {
  			    roundNum:this.args.gameNum,
      	}
      	this.progress = new SubViewProgress(args);
      	this.addChild(this.progress,3);
      	var posY = (this._viewTop.y-this.panel.height)/4;
      	this.progress.y = this._viewTop.y - posY-this.progress.height;
    },

    onExit: function () {
        this._super();
    },
});


