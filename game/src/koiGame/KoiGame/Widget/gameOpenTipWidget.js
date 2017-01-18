
//var GameOpenTipWidget = cc.LayerColor.extend({
var GameOpenTipWidget = cc.Node.extend({
    _height : 0,
    ctor : function(){
    	this._super();
        // this.attr({
        //     anchorX : 0.5,
        //     anchorY : 0.5,
        //     width : 400,
        //     height : 400,
        //     color : cc.color(255,0,0),
        //     x : 0,
        //     y : 0,
        // });
    	this._init();
        //cc.log("-----openTip==",this.getContentSize());
    },
    _init : function(){
        this._lblPond = new cc.LabelTTF();
        this._lblPond.attr({
            string:"Pond 1 of 5",
            fontName:'Arial',
            fontSize:52,
            x:0,
            y:0,
            color:cc.color.BLACK,
            anchorX : 0.5,
            anchorY : 0.5,
        });
        this.addChild(this._lblPond);

        this._lblFish = new cc.LabelTTF();
        this._lblFish.attr({
            string:"3 Fish",
            fontName:'Arial',
            fontSize:52,
            x:0,
            y:-this._lblPond.getContentSize().height*1.5,
            color:cc.color.BLACK,
            anchorX : 0.5,
            anchorY : 0.5,
        });
        this.addChild(this._lblFish);
        this._height = this._lblPond.getContentSize().height * 3 ;

    },
 
    onEnter:function () {
        this._super();
        
    },
    onExit : function(){
    	this._super();
    },
    setPondAndFish : function(pond,fish){
        // this._lblPond.setString("Pond "+pond+" of 5");
        // this._lblFish.setString(fish+" Fish");

        this._lblPond.setString("第"+pond+"回合");
        this._lblFish.setString(fish+"条鱼");
    },
    doEaseInOutAnim : function(node,displayTime){
        var time = displayTime/3; 

        this._lblPond.setOpacity(0);
        this._lblFish.setOpacity(0);

        var fadeIn = cc.EaseInOut.create(cc.fadeIn(time),2);
        var fadeOut = cc.EaseIn.create(cc.fadeOut(time),2);
        var seq = cc.sequence(fadeIn,cc.delayTime(time),fadeOut);
        this._lblPond.runAction(seq);

        var fadeIn2 = cc.EaseInOut.create(cc.fadeIn(time),2);
        var fadeOut2 = cc.EaseIn.create(cc.fadeOut(time),2);
        var seq2 = cc.sequence(fadeIn2,cc.delayTime(time),fadeOut2);
        this._lblFish.runAction(seq2);

        var moveIn = cc.EaseInOut.create(cc.moveBy(time,cc.p(0,-node._height)),2);
        var moveOut = cc.EaseIn.create(cc.moveBy(time,cc.p(0,-node._height)),2);
        // var cb = cc.callFunc(function(){
        //     node.removeFromParent(true);
        // },this);
        var nodeSeq = cc.sequence(moveIn,cc.delayTime(time),moveOut);
        node.runAction(nodeSeq);
    },

    onExit : function(){
        this._super();
        cc.log("GameOpenTipWidget  view   onExit");
    },
});