
var GameLobbyView = cc.Layer.extend({
    ctor:function () {
        this._super();

        this._topBarNode = new cc.Node();
        this._gameListLayer = new cc.Layer();
        this._playerListNode = new cc.Node();

        var winSize = cc.winSize;
        this.attr({
            x:0,
            y:0,
            width: winSize.width,
            height: winSize.height
        });

        this.initTop();

        this._gameListLayer.ignoreAnchorPointForPosition(false);
        this._gameListLayer.setAnchorPoint(cc.p(0.5, 0));

        this._gameListLayer.attr({
            x: winSize.width / 2,
            y: 0,
            width: winSize.width * 0.99,
            height: winSize.height - this._viewTop.height,
            //color: cc.color(255, 245, 245, 255)
        });

        this.addChild(this._gameListLayer);
        return true;
    },

    initTop:function(){
        var args = {
            title:'游   戏',
            isShowBackBtn:true,
        };
        this._viewTop = new SubViewTop(args);
        this.addChild(this._viewTop);
        this._viewTop.attr({
            anchorY:1,
            y:cc.winSize.height-this._viewTop.height,
        });
        this._viewTop.setHandleBack(this, this.backAppView);
    },

    backAppView: function (self) {
        platformFun.backToApp();
    },

    onExit: function () {
        cc.log("gameLbby  view   onExit");
        this._gameListLayer.removeFromParent(true);
        this._super();
    },
});

