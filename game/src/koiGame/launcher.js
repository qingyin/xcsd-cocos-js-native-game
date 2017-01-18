
var LauncherScene = cc.Scene.extend({
	ctor : function(){
		this._super();
	},
    onEnter:function () {
        this._super();
        var game = new PlayingKoiController();
        this.addChild(game.view);
    },
    onExit : function(){
    	this._super();
    },
});