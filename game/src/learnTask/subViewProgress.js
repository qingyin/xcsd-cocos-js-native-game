
var SubViewProgress = cc.Layer.extend({
    CURRENT : 0,
    RIGHT : 1,
    WRONG : 2,
    IDLE : 3,
    ctor: function(args){
        this._super();
        this.roundNum = args.roundNum;
        this.pic = [];
        this.pic[this.CURRENT] = res.learnTask.LearnWork_nav_current;
        this.pic[this.RIGHT] = res.learnTask.LearnWork_nav_pass;
        this.pic[this.WRONG] = res.learnTask.LearnWork_nav_wrong;
        this.pic[this.IDLE] = res.learnTask.LearnWork_nav_normal;
        
        this.init();
    },
    init:function(){
    	var dot = new cc.Sprite(res.learnTask.LearnWork_Thedottedline02);
    	var circle = new cc.Sprite(this.pic[this.IDLE]);

    	var width = dot.width*9+circle.width*10;
    	var size = cc.winSize;
    	var scale = size.width/width;    	
    	if(scale>1){
    		scale = 1;
    	}
    	this.height = circle.height;
    	var startPosX = (size.width - (dot.width+circle.width) * (this.roundNum-1))*0.5;
    	this.spriteCircle =[];
    	for (var i = 0; i < this.roundNum; i++) {
    		this.spriteCircle[i] = new cc.Sprite(this.pic[this.IDLE]);
    		this.spriteCircle[i].attr({
    			x:startPosX+(dot.width+circle.width)*i,
    			y:this.height * 0.5,
    		});
    		this.addChild(this.spriteCircle[i]);
    	};
    	startPosX = startPosX + (dot.width+circle.width) * 0.5;
    	for (var i = 0; i < this.roundNum-1; i++) {
    		var tempDot = new cc.Sprite(res.learnTask.LearnWork_Thedottedline02);
    		tempDot.attr({
    			x:startPosX+(dot.width+circle.width)*i,
    			y:this.height * 0.5,
    		});
    		this.addChild(tempDot);
    	};
        // var test = new cc.LayerColor(cc.color(255, 0, 0,10));
        // test.attr({
        //      anchor:cc.p(0.5,0.5),
        //      x:0,
        //      y:0,
        //      width:this.width,
        //      height:this.height,
        // });
        // this.addChild(test);
    },
    setCircleTexture:function(index,state){
    	this.spriteCircle[index].setTexture(this.pic[state]);
    },

});
