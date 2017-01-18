
var LevelView = cc.Layer.extend({
    _touchEnable:false,
    _levelIndex:-1,
    _isClicked:null,
    ctor:function () {
        this._super();

        this.ignoreAnchorPointForPosition(false);
        this.setAnchorPoint(cc.p(0.5, 0.5));
        this.init();
    }, 
    init : function(){
        var headShade = new cc.Sprite(res.game_x_frame);
        var size = headShade.getContentSize();
        headShade.attr({
            x:size.width*0.5,
            y:size.height*0.5,
            //color:this._color,
        });
        this.addChild(this.headShade,1);
        this.setContentSize(size);

        this._head = new cc.Sprite(res.game_x_head);
        this._head.attr({
            x:size.width*0.5,
            y:size.height*0.5,
            //color:this._color,
        });
        this.addChild(this.this._head,0);
        this.setContentSize(size);

        this._ranking = new cc.Sprite(res.game_x_ranking_03);
        this._ranking.attr({
            x:size.width*0.5,
            y:size.height*0.5,
            //color:this._color,
        });
        this.addChild(this._ranking,3);

        this._lbl_name = new cc.LabelTTF("虚位以待", "Arial", 38);
        this._lbl_name.attr({
            anchorPoint:cc.p(0.5,0.5),
            x:this.ballBG.x,
            y:this.ballBG.y,
            color:cc.color(255,150,0),
        });
        this.ballBG.addChild(this._lbl_name); 

        this._star = new cc.Sprite(res.game_x_star_least);
        this._star.attr({
            x:size.width*0.5,
            y:size.height*0.5,
            //color:this._color,
        });
        this.addChild(this._star,3);

        this._lbl_score = new cc.LabelTTF("0", "Arial", 38);
        this._lbl_score.attr({
            anchorPoint:cc.p(0.5,0.5),
            x:this.ballBG.x,
            y:this.ballBG.y,
            color:cc.color(255,150,0),
        });
        this.ballBG.addChild(this._lbl_score);
    },

});