
var CommonTopPauseProgress = CommonTopPause.extend({
    ctor:function () {
        this._super();

        this._circleHeight = 40;
        this._RIGHT = 0;
        this._WRONG = 1;
        this._CURRENT = 2;
        this._IDLE = 3;
        this._picList = [];
        this._picList[this._RIGHT] = res.game_nav_pass;
        this._picList[this._WRONG] = res.game_nav_wrong;
        this._picList[this._CURRENT] = res.game_nav_current;
        this._picList[this._IDLE] = res.game_nav_normal;

        this.lbl_pass_progress = new cc.LabelTTF("通关进度: ", "Arial", 38);
        this.lbl_pass_progress.setAnchorPoint(cc.p(1,0.5));
        this.lbl_pass_progress.attr({
            x:0,
            y:this.topBg.height/4,
            color:cc.color(95,95,95,255),
        });
        this.topBg.addChild(this.lbl_pass_progress);

        //this.createPassProgress(4);
    },
    createPassProgress:function(num){
        var x = this.topBg.width - this._circleHeight * (num+0.5);
        this.lbl_pass_progress.x = x;
        if (!this._node_pass){
        }
        else{
            this._node_pass.removeAllChildren();
            this._node_pass.removeFromParent();
        }
        this._node_pass = new cc.Node();
        this._node_pass.attr({
            x:x,
            y:this.lbl_pass_progress.y
        });
        this.topBg.addChild(this._node_pass);
        this._pass_progress_sp = [];
        for (var i = 0; i < num; i++) {
            this._pass_progress_sp[i] = new cc.Sprite(this._picList[this._IDLE]);
            this._pass_progress_sp[i].attr({
                x:this._circleHeight*(i+0.5),
                y:0
            });
            this._node_pass.addChild(this._pass_progress_sp[i]);
        };

    },
    setProgressState:function(index,state){
        if (this._pass_progress_sp[index]) {
            this._pass_progress_sp[index].setTexture(this._picList[state]);
        }
    },  

    hideParallelPic: function () {
        this.lbl_pass_progress.setVisible(false);

        if (this._pass_progress_sp != null) {
            for (var i = 0; i < this._pass_progress_sp.length; i++) {
                this._pass_progress_sp[i].setVisible(false);
            };
        }
        
    },

    showParallelPic: function () {
        this.lbl_pass_progress.setVisible(true);

        if (this._pass_progress_sp != null) {
            for (var i = 0; i < this._pass_progress_sp.length; i++) {
                this._pass_progress_sp[i].setVisible(true);
            };
        }
        
    },

});