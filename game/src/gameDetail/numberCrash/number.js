
var NumberCrashNumber = cc.Layer.extend({
    _numbre_value:null,
    _number_expression:null,
    _controller:null,
    _settleTrigger:null,
    _dropArray:null,
    warnAction:null,
    _clickSettle:null,
    ctor:function (args) {
        //////////////////////////////
        // 1. super init first
        this._super();
        this._numbre_value = args.number_value;
        this._number_expression = args.number_expression;
        this._number_state = state.un_Select;
        this._controller = args.delegate;
        this._settleTrigger = args.settleHandle;
        this._number_type = args.number_type;
        this._number_length = args.number_length;
        this._number_side = args.number_side;
        this._dropArray = new Array();
        this._dropArray._dropDistance = 0;
        this._dropArray._dropPosY = 0;
        this._dropArray._dropTime = 0;
        this.warnAction = false;
        this._clickSettle = false;

        this.setHandle();

        if (args.number_type == numberData[3].typeId || args.number_type == numberData[4].typeId) {
        	this._number_state = state.on_disappear;
        }

        this.logicPos = new Array();
        this.getLogicPos(this._number_type);
        this.init();
        
        cc.eventManager.addListener({
            event: cc.EventListener.TOUCH_ONE_BY_ONE,
            swallowTouches: false,
            onTouchBegan: this.onTouchBegan,
            onTouchMoved: this.onTouchMoved,
            onTouchEnded: this.onTouchEnded
        }, this);
    },
    init:function() {
    	this.initCell(this._number_type);
    },
    initCell:function (ntype) {
    	//cellNode
        this._cellNode = new cc.Node();
        this._cellNode.setAnchorPoint(cc.p(0.5, 0.5));
        this._cellNode.attr({
            x: 0,
            y: 0 
        });
        this.addChild(this._cellNode);

        //cell_bg
        this._cell_bg = new cc.Sprite(cell_bg[ntype].res);
        this._cellNode.addChild(this._cell_bg);

        var cell_size = this._cell_bg.getContentSize();
        
        var scale = 0;
        var node_width = 0;
        var node_height = 0;
        if (ntype == numberData[2].typeId) {
            scale = this._number_side / (cell_size.width / 2);
            node_width = this._number_side * 2;
            node_height = this._number_side;
        }else {
            scale = this._number_side / cell_size.width;
            node_width = this._number_side;
            node_height = this._number_side;
        }
        this._cell_bg.setScale(scale);
        this._cellNode.x = node_width * 0.5;
        this._cellNode.y = node_height * 0.5;
        this._cellNode.setContentSize(node_width, node_height);
        this.setContentSize(node_width, node_height);
        this._cell_bg.setPosition(node_width/2, node_height/2);

        //cell_label
        var node_size = this._cellNode.getContentSize();
        this._show_value = new cc.LabelTTF(this._number_expression, "Arial", 36);
        this._show_value.setAnchorPoint(cc.p(0.5, 0.5));
        this._show_value.attr({
            x: node_size.width / 2, 
            y: node_size.height / 2,
            scale:scale
        });
        this._show_value.color = cc.color(29, 210, 178);
        this._cellNode.addChild(this._show_value);

        if (ntype == numberData[3].typeId){
            this._show_value.removeFromParent(true);
        }else if (ntype == numberData[4].typeId){
            this._show_value.removeFromParent(true);
        }

        
    },

    setHandle:function(delegate, handle){
    	this._handle = handle;
    	this._delegate = delegate;
    },
    
    onTouchBegan:function (touch, event) {
    	 var target = event.getCurrentTarget();
    	 //var parent = target.getParent();
        
        var size = target.getContentSize();
        var targetRect = cc.rect(0,0, size.width, size.height);
		var pos = target.convertToNodeSpace(touch.getLocation());
        if ( cc.rectContainsPoint(targetRect,pos) && target._clickSettle == false) {
            if (target._number_state == state.un_Select) {
                target.onSelectCell();
                target._handle(target._delegate, target);
            } 
            else if (target._number_state == state.on_Select) {
               target.unSelectCell();
               target._handle(target._delegate, target);
                
            }
        }
        return true;
    },
    onTouchMoved:function (touch, event) {
    },
    onTouchEnded:function (touch, event) {
    },
    setSettleTrigger:function (handle) {
        this._settleTrigger = handle;
    },
    setNumberLabel:function (number) {
    	this._show_value.setString(number);
    },
    onSelectCell:function () {

        if (this._number_type == numberData[1].typeId) {
        	this._cell_bg.setTexture(cell_bg[5].res);
        	this._show_value.color = cc.color(255, 255, 255);
        }else if (this._number_type == numberData[2].typeId) {
        	//this._cell_bg.setOpacity(150);
            this._cell_bg.color = cc.color(59, 212, 182);
            this._show_value.color = cc.color(255, 255, 255);
        }
        this._number_state = state.on_Select;
    },
    unSelectCell:function () {
    	if (this._number_type == numberData[1].typeId) {
        	this._cell_bg.setTexture(cell_bg[1].res);
        	this._show_value.color = cc.color(29, 210, 178);
        }else if (this._number_type == numberData[2].typeId) {
        	//this._cell_bg.setOpacity(255);
            this._cell_bg.color = cc.color(255, 255, 255);
            this._show_value.color = cc.color(29, 210, 178);
        }
        this._number_state = state.un_Select;

    },
    onDisappearCell:function () {

        this._number_state = state.onDisappear;

    	this._cell_bg.setOpacity(150);
    	var scaleE = cc.ScaleBy.create(12/30, 1.0, 1.0);
	    var scaleS = cc.ScaleBy.create(4/30, 0, 0);

	    var rotateBy = cc.RotateBy.create(4/30, 3);
	    var rotaBack = rotateBy.reverse();

	    var fadeIn = cc.FadeIn.create(4/30);   
	    var fadeBack = fadeIn.reverse();

	    var seqS = cc.Sequence.create(scaleE, scaleS);
	    var seqR = cc.Sequence.create(rotateBy, rotaBack);
	    var seqF = cc.Sequence.create(fadeIn, fadeBack);

	    var repR = cc.Repeat.create(seqR, 2);
	    var repF = cc.Repeat.create(seqF, 2);

        var spa = cc.Spawn.create(seqS, repR, repF);
    
        this._cell_bg.runAction(spa);
        //this._cellNode.runAction(spa);

        return actionTime;
    },
    getLogicPos:function(ntype) {
        var logicTypePos = logicPos[ntype];
        var posCount = util.getArrycount(logicTypePos);
        for (var i = 1; i <= posCount; i++) {
        	this.logicPos[i] = new Array();
	        this.logicPos[i][1] = logicTypePos[i][1];
	        this.logicPos[i][2] = logicTypePos[i][2];
        };
	    return this.logicPos;
    },
    upLogicPos:function (dtCol, dtRow) {
    	var logicCount = util.getArrycount(this.logicPos);
    	for (var i = 1; i <= logicCount; i++) {
    		this.logicPos[i][1] = this.logicPos[i][1] + dtCol;
            this.logicPos[i][2] = this.logicPos[i][2] + dtRow;
    	};
	    return this.logicPos;
    },
    getReferBlock:function (ntype) {
        var logicPosType = logicPos[ntype];
	    var posIndex = 0;
	    var pCount = util.getArrycount(logicPosType);
	    for (var i = 1; i <= pCount - 1; i++) {
	    	var blockX = logicPosType[i];
	        posIndex = i;
	        if (blockX[1] > logicPosType[i + 1][1]) {
	        	blockX = logicPosType[i + 1];
	            posIndex = i + 1;
	        }else if (blockX[1] == logicPosType[i + 1][1]) {
	        	if (blockX[2] > logicPosType[i + 1][2]) {
	        		blockX = logicPosType[i + 1];
	                posIndex = i + 1;
	        	}
	        }
	    };
	    return posIndex;
    },
    successAction: function () {
        this._clickSettle = true;
        this._cell_bg.setColor(cc.color(255,255,255));
    },
});