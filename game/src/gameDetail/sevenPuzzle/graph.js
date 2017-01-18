
//var small_triangle_array = [8,8,4,2,2,4,4];

var SevenGraph = cc.Layer.extend({
	_isMoveCenter:null,
    ctor:function (graphRes, scale, id, smallTriangleArray) {
        this._super();
        this._isTouchEnable = false;
        this._graphRes = graphRes;
        this._scale = scale;
        this._id = id;
        this._isMoveCenter = false;
        this.equalPos = false;
        this._small_triangle_Array = smallTriangleArray;

        this.init();

        return true;
    },

    init: function () {

    	this.graph_puzzle = new cc.Sprite(this._graphRes);
        this.graph_puzzle.ignoreAnchorPointForPosition(false);
        this.graph_puzzle.setAnchorPoint(cc.p(0.5, 0.5));
        this.graph_puzzle.attr({
        	x:this.graph_puzzle.width * this._scale * 0.5,
        	y:this.graph_puzzle.height * this._scale * 0.5,
        	scale:this._scale
        });
        
        this.addChild(this.graph_puzzle);
        this.getSmallTrianglePos();
    },

    initShadowGraph: function (node, spriteRes) {
    	this._shadowGraph = new cc.Sprite(spriteRes);
    	this._shadowGraph.ignoreAnchorPointForPosition(false);
        this._shadowGraph.setAnchorPoint(cc.p(0, 0));
        var gap = this._shadowGraph.width - node.width;
        this._shadowGraph.attr({
            x:0 - gap * this._scale * 0.5,
            y:0 - gap * this._scale * 0.5,
        });
        node.addChild(this._shadowGraph);
        this._isMoveCenter = true;
    },

    removeShadowGraph: function () {
        this._shadowGraph.removeFromParent(true);
        this._isMoveCenter = false;
    },

    getSmallTrianglePos: function () {
    	var pos_index = this._small_triangle_Array.length;
    	for (var i = 0; i < small_triangle_array[this._id - 1]; i++) {
    		this._small_triangle_Array[pos_index + i] = {};

    	};
    	switch (this._id) {
    		case 1:
		        
    		    this.getSmallTriganlePos1(pos_index);
    			break;
    		case 2:
			    
    		    this.getSmallTriganlePos2(pos_index);
    			break;
    		case 3:
		    	
    			this.getSmallTriganlePos3(pos_index);
    			break;
    		case 4:
    			
    			this.getSmallTriganlePos4(pos_index);
    			break;
    		case 5:
    			
    			this.getSmallTriganlePos5(pos_index);
    			break;
    		case 6:
    			
    			this.getSmallTriganlePos6(pos_index);
    			break;
    		case 7:
    			this.graph_puzzle.setRotation(45);
    			this.getSmallTriganlePos7(pos_index);
    			break;
    	}
    },

    getSmallTriganlePos1: function (pos_index) {


        // this._small_triangle_Array[pos_index]._x = 1/4;
        // this._small_triangle_Array[pos_index]._y = 1/8;
        // this._small_triangle_Array[pos_index + 1]._x = 3/8;
        // this._small_triangle_Array[pos_index + 1]._y = 1/4;
        // this._small_triangle_Array[pos_index + 2]._x = 5/8;
        // this._small_triangle_Array[pos_index + 2]._y = 1/4;
        // this._small_triangle_Array[pos_index + 3]._x = 3/4;
        // this._small_triangle_Array[pos_index + 3]._y = 1/8;
        // this._small_triangle_Array[pos_index + 4]._x = 7/8;
        // this._small_triangle_Array[pos_index + 4]._y = 1/4;
        // this._small_triangle_Array[pos_index + 5]._x = 3/4;
        // this._small_triangle_Array[pos_index + 5]._y = 3/8;
        // this._small_triangle_Array[pos_index + 6]._x = 3/4;
        // this._small_triangle_Array[pos_index + 6]._y = 5/8;
        // this._small_triangle_Array[pos_index + 7]._x = 7/8;
        // this._small_triangle_Array[pos_index + 7]._y = 3/4;


    	// this._small_triangle_Array[pos_index]._x = 1/4;
    	// this._small_triangle_Array[pos_index]._y = 1/8;
    	// this._small_triangle_Array[pos_index + 1]._x = 3/8;
    	// this._small_triangle_Array[pos_index + 1]._y = 1/4;
     //    this._small_triangle_Array[pos_index + 2]._x = 3/8;
     //    this._small_triangle_Array[pos_index + 2]._y = 1/8;
    	// this._small_triangle_Array[pos_index + 3]._x = 5/8;
    	// this._small_triangle_Array[pos_index + 3]._y = 1/4;
    	// this._small_triangle_Array[pos_index + 4]._x = 3/4;
    	// this._small_triangle_Array[pos_index + 4]._y = 1/8;
     //    this._small_triangle_Array[pos_index + 5]._x = 5/8;
     //    this._small_triangle_Array[pos_index + 5]._y = 1/8;
    	// this._small_triangle_Array[pos_index + 6]._x = 7/8;
    	// this._small_triangle_Array[pos_index + 6]._y = 1/4;
    	// this._small_triangle_Array[pos_index + 7]._x = 3/4;
    	// this._small_triangle_Array[pos_index + 7]._y = 3/8;
     //    this._small_triangle_Array[pos_index + 8]._x = 7/8;
     //    this._small_triangle_Array[pos_index + 8]._y = 3/8;
    	// this._small_triangle_Array[pos_index + 9]._x = 3/4;
    	// this._small_triangle_Array[pos_index + 9]._y = 5/8;
    	// this._small_triangle_Array[pos_index + 10]._x = 7/8;
    	// this._small_triangle_Array[pos_index + 10]._y = 3/4;
     //    this._small_triangle_Array[pos_index + 11]._x = 7/8;
     //    this._small_triangle_Array[pos_index + 11]._y = 5/8;


        this._small_triangle_Array[pos_index]._x = 3/16;
        this._small_triangle_Array[pos_index]._y = 1/16;
        this._small_triangle_Array[pos_index + 1]._x = 5/16;
        this._small_triangle_Array[pos_index + 1]._y = 1/16;
        this._small_triangle_Array[pos_index + 2]._x = 7/16;
        this._small_triangle_Array[pos_index + 2]._y = 3/16;
        this._small_triangle_Array[pos_index + 3]._x = 7/16;
        this._small_triangle_Array[pos_index + 3]._y = 5/16;

        this._small_triangle_Array[pos_index + 4]._x = 9/16;
        this._small_triangle_Array[pos_index + 4]._y = 5/16;
        this._small_triangle_Array[pos_index + 5]._x = 9/16;
        this._small_triangle_Array[pos_index + 5]._y = 3/16;
        this._small_triangle_Array[pos_index + 6]._x = 11/16;
        this._small_triangle_Array[pos_index + 6]._y = 1/16;
        this._small_triangle_Array[pos_index + 7]._x = 13/16;
        this._small_triangle_Array[pos_index + 7]._y = 1/16;

        this._small_triangle_Array[pos_index + 8]._x = 15/16;
        this._small_triangle_Array[pos_index + 8]._y = 3/16;
        this._small_triangle_Array[pos_index + 9]._x = 15/16;
        this._small_triangle_Array[pos_index + 9]._y = 5/16;
        this._small_triangle_Array[pos_index + 10]._x = 13/16;
        this._small_triangle_Array[pos_index + 10]._y = 7/16;
        this._small_triangle_Array[pos_index + 11]._x = 11/16;
        this._small_triangle_Array[pos_index + 11]._y = 7/16;

        this._small_triangle_Array[pos_index + 12]._x = 11/16;
        this._small_triangle_Array[pos_index + 12]._y = 9/16;
        this._small_triangle_Array[pos_index + 13]._x = 13/16;
        this._small_triangle_Array[pos_index + 13]._y = 9/16;
        this._small_triangle_Array[pos_index + 14]._x = 15/16;
        this._small_triangle_Array[pos_index + 14]._y = 11/16;
        this._small_triangle_Array[pos_index + 15]._x = 15/16;
        this._small_triangle_Array[pos_index + 15]._y = 13/16;

    },

    getSmallTriganlePos2: function (pos_index) {

        // this._small_triangle_Array[pos_index]._x = 1/8;
        // this._small_triangle_Array[pos_index]._y = 3/4;
        // this._small_triangle_Array[pos_index + 1]._x = 1/4;
        // this._small_triangle_Array[pos_index + 1]._y = 5/8;
        // this._small_triangle_Array[pos_index + 2]._x = 1/4;
        // this._small_triangle_Array[pos_index + 2]._y = 3/8;
        // this._small_triangle_Array[pos_index + 3]._x = 1/8;
        // this._small_triangle_Array[pos_index + 3]._y = 1/4;
        // this._small_triangle_Array[pos_index + 4]._x = 1/4;
        // this._small_triangle_Array[pos_index + 4]._y = 1/8;
        // this._small_triangle_Array[pos_index + 5]._x = 3/8;
        // this._small_triangle_Array[pos_index + 5]._y = 1/4;
        // this._small_triangle_Array[pos_index + 6]._x = 5/8;
        // this._small_triangle_Array[pos_index + 6]._y = 1/4;
        // this._small_triangle_Array[pos_index + 7]._x = 3/4;
        // this._small_triangle_Array[pos_index + 7]._y = 1/8;


    	// this._small_triangle_Array[pos_index]._x = 1/8;
    	// this._small_triangle_Array[pos_index]._y = 3/4;
    	// this._small_triangle_Array[pos_index + 1]._x = 1/4;
    	// this._small_triangle_Array[pos_index + 1]._y = 5/8;
     //    this._small_triangle_Array[pos_index + 2]._x = 1/8;
     //    this._small_triangle_Array[pos_index + 2]._y = 5/8;
    	// this._small_triangle_Array[pos_index + 3]._x = 1/4;
    	// this._small_triangle_Array[pos_index + 3]._y = 3/8;
    	// this._small_triangle_Array[pos_index + 4]._x = 1/8;
    	// this._small_triangle_Array[pos_index + 4]._y = 1/4;
     //    this._small_triangle_Array[pos_index + 5]._x = 1/8;
     //    this._small_triangle_Array[pos_index + 5]._y = 3/8;
    	// this._small_triangle_Array[pos_index + 6]._x = 1/4;
    	// this._small_triangle_Array[pos_index + 6]._y = 1/8;
    	// this._small_triangle_Array[pos_index + 7]._x = 3/8;
    	// this._small_triangle_Array[pos_index + 7]._y = 1/4;
     //    this._small_triangle_Array[pos_index + 8]._x = 3/8;
     //    this._small_triangle_Array[pos_index + 8]._y = 1/8;
    	// this._small_triangle_Array[pos_index + 9]._x = 5/8;
    	// this._small_triangle_Array[pos_index + 9]._y = 1/4;
    	// this._small_triangle_Array[pos_index + 10]._x = 3/4;
    	// this._small_triangle_Array[pos_index + 10]._y = 1/8;
     //    this._small_triangle_Array[pos_index + 11]._x = 5/8;
     //    this._small_triangle_Array[pos_index + 11]._y = 1/8;


        this._small_triangle_Array[pos_index]._x = 1/16;
        this._small_triangle_Array[pos_index]._y = 13/16;
        this._small_triangle_Array[pos_index + 1]._x = 1/16;
        this._small_triangle_Array[pos_index + 1]._y = 11/16;
        this._small_triangle_Array[pos_index + 2]._x = 3/16;
        this._small_triangle_Array[pos_index + 2]._y = 9/16;
        this._small_triangle_Array[pos_index + 3]._x = 5/16;
        this._small_triangle_Array[pos_index + 3]._y = 9/16;

        this._small_triangle_Array[pos_index + 4]._x = 5/16;
        this._small_triangle_Array[pos_index + 4]._y = 7/16;
        this._small_triangle_Array[pos_index + 5]._x = 3/16;
        this._small_triangle_Array[pos_index + 5]._y = 7/16;
        this._small_triangle_Array[pos_index + 6]._x = 1/16;
        this._small_triangle_Array[pos_index + 6]._y = 5/16;
        this._small_triangle_Array[pos_index + 7]._x = 1/16;
        this._small_triangle_Array[pos_index + 7]._y = 3/16;

        this._small_triangle_Array[pos_index + 8]._x = 3/16;
        this._small_triangle_Array[pos_index + 8]._y = 1/16;
        this._small_triangle_Array[pos_index + 9]._x = 5/16;
        this._small_triangle_Array[pos_index + 9]._y = 1/16;
        this._small_triangle_Array[pos_index + 10]._x = 7/16;
        this._small_triangle_Array[pos_index + 10]._y = 3/16;
        this._small_triangle_Array[pos_index + 11]._x = 7/16;
        this._small_triangle_Array[pos_index + 11]._y = 5/16;

        this._small_triangle_Array[pos_index + 12]._x = 9/16;
        this._small_triangle_Array[pos_index + 12]._y = 5/16;
        this._small_triangle_Array[pos_index + 13]._x = 9/16;
        this._small_triangle_Array[pos_index + 13]._y = 3/16;
        this._small_triangle_Array[pos_index + 14]._x = 11/16;
        this._small_triangle_Array[pos_index + 14]._y = 1/16;
        this._small_triangle_Array[pos_index + 15]._x = 13/16;
        this._small_triangle_Array[pos_index + 15]._y = 1/16;

    	
    },

	getSmallTriganlePos3: function (pos_index) {

        // this._small_triangle_Array[pos_index]._x = 1/4;
        // this._small_triangle_Array[pos_index]._y = 3/4;
        // this._small_triangle_Array[pos_index + 1]._x = 3/8;
        // this._small_triangle_Array[pos_index + 1]._y = 1/2;
        // this._small_triangle_Array[pos_index + 2]._x = 5/8;
        // this._small_triangle_Array[pos_index + 2]._y = 1/2;
        // this._small_triangle_Array[pos_index + 3]._x = 3/4;
        // this._small_triangle_Array[pos_index + 3]._y = 3/4;

    	// this._small_triangle_Array[pos_index]._x = 1/4;
    	// this._small_triangle_Array[pos_index]._y = 3/4;
    	// this._small_triangle_Array[pos_index + 1]._x = 3/8;
    	// this._small_triangle_Array[pos_index + 1]._y = 1/2;
     //    this._small_triangle_Array[pos_index + 2]._x = 3/8;
     //    this._small_triangle_Array[pos_index + 2]._y = 3/4;
    	// this._small_triangle_Array[pos_index + 3]._x = 5/8;
    	// this._small_triangle_Array[pos_index + 3]._y = 1/2;
    	// this._small_triangle_Array[pos_index + 4]._x = 3/4;
    	// this._small_triangle_Array[pos_index + 4]._y = 3/4;
     //    this._small_triangle_Array[pos_index + 5]._x = 5/8;
     //    this._small_triangle_Array[pos_index + 5]._y = 3/4;

        this._small_triangle_Array[pos_index]._x = 3/16;
        this._small_triangle_Array[pos_index]._y = 14/16;
        this._small_triangle_Array[pos_index + 1]._x = 5/16;
        this._small_triangle_Array[pos_index + 1]._y = 14/16;
        this._small_triangle_Array[pos_index + 2]._x = 7/16;
        this._small_triangle_Array[pos_index + 2]._y = 10/16;
        this._small_triangle_Array[pos_index + 3]._x = 7/16;
        this._small_triangle_Array[pos_index + 3]._y = 6/16;

        this._small_triangle_Array[pos_index + 4]._x = 9/16;
        this._small_triangle_Array[pos_index + 4]._y = 6/16;
        this._small_triangle_Array[pos_index + 5]._x = 9/16;
        this._small_triangle_Array[pos_index + 5]._y = 10/16;
        this._small_triangle_Array[pos_index + 6]._x = 11/16;
        this._small_triangle_Array[pos_index + 6]._y = 14/16;
        this._small_triangle_Array[pos_index + 7]._x = 13/16;
        this._small_triangle_Array[pos_index + 7]._y = 14/16;

	},

	getSmallTriganlePos4: function (pos_index) {

        // this._small_triangle_Array[pos_index]._x = 1/2;
        // this._small_triangle_Array[pos_index]._y = 3/4;
        // this._small_triangle_Array[pos_index + 1]._x = 3/4;
        // this._small_triangle_Array[pos_index + 1]._y = 1/2;

    	// this._small_triangle_Array[pos_index]._x = 1/2;
    	// this._small_triangle_Array[pos_index]._y = 3/4;
    	// this._small_triangle_Array[pos_index + 1]._x = 3/4;
    	// this._small_triangle_Array[pos_index + 1]._y = 1/2;
     //    this._small_triangle_Array[pos_index + 2]._x = 3/4;
     //    this._small_triangle_Array[pos_index + 2]._y = 3/4;

        this._small_triangle_Array[pos_index]._x = 3/8;
        this._small_triangle_Array[pos_index]._y = 7/8;
        this._small_triangle_Array[pos_index + 1]._x = 5/8;
        this._small_triangle_Array[pos_index + 1]._y = 7/8;
        this._small_triangle_Array[pos_index + 2]._x = 7/8;
        this._small_triangle_Array[pos_index + 2]._y = 5/8;
        this._small_triangle_Array[pos_index + 3]._x = 7/8;
        this._small_triangle_Array[pos_index + 3]._y = 3/8;

	},

	getSmallTriganlePos5: function (pos_index) {

     //    this._small_triangle_Array[pos_index]._x = 1/4;
     //    this._small_triangle_Array[pos_index]._y = 1/2;
     //    this._small_triangle_Array[pos_index + 1]._x = 1/2;
     //    this._small_triangle_Array[pos_index + 1]._y = 3/4;

    	// this._small_triangle_Array[pos_index]._x = 1/4;
    	// this._small_triangle_Array[pos_index]._y = 1/2;
    	// this._small_triangle_Array[pos_index + 1]._x = 1/2;
    	// this._small_triangle_Array[pos_index + 1]._y = 3/4;
     //    this._small_triangle_Array[pos_index + 2]._x = 1/4;
     //    this._small_triangle_Array[pos_index + 2]._y = 3/4;

        this._small_triangle_Array[pos_index]._x = 1/8;
        this._small_triangle_Array[pos_index]._y = 3/8;
        this._small_triangle_Array[pos_index + 1]._x = 1/8;
        this._small_triangle_Array[pos_index + 1]._y = 5/8;
        this._small_triangle_Array[pos_index + 2]._x = 3/8;
        this._small_triangle_Array[pos_index + 2]._y = 7/8;
        this._small_triangle_Array[pos_index + 3]._x = 5/8;
        this._small_triangle_Array[pos_index + 3]._y = 7/8;

	},

	getSmallTriganlePos6: function (pos_index) {


        // this._small_triangle_Array[pos_index]._x = 1/4;
        // this._small_triangle_Array[pos_index]._y = 3/4;
        // this._small_triangle_Array[pos_index + 1]._x = 1/2;
        // this._small_triangle_Array[pos_index + 1]._y = 5/8;
        // this._small_triangle_Array[pos_index + 2]._x = 1/2;
        // this._small_triangle_Array[pos_index + 2]._y = 3/8;
        // this._small_triangle_Array[pos_index + 3]._x = 3/4;
        // this._small_triangle_Array[pos_index + 3]._y = 1/4; 

    	// this._small_triangle_Array[pos_index]._x = 1/4;
    	// this._small_triangle_Array[pos_index]._y = 3/4;
    	// this._small_triangle_Array[pos_index + 1]._x = 1/2;
    	// this._small_triangle_Array[pos_index + 1]._y = 5/8;
     //    this._small_triangle_Array[pos_index + 2]._x = 1/4;
     //    this._small_triangle_Array[pos_index + 2]._y = 5/8;
    	// this._small_triangle_Array[pos_index + 3]._x = 1/2;
    	// this._small_triangle_Array[pos_index + 3]._y = 3/8;
    	// this._small_triangle_Array[pos_index + 4]._x = 3/4;
    	// this._small_triangle_Array[pos_index + 4]._y = 1/4;	
     //    this._small_triangle_Array[pos_index + 5]._x = 3/4;
     //    this._small_triangle_Array[pos_index + 5]._y = 3/8;

        this._small_triangle_Array[pos_index]._x = 2/16;
        this._small_triangle_Array[pos_index]._y = 13/16;
        this._small_triangle_Array[pos_index + 1]._x = 2/16;
        this._small_triangle_Array[pos_index + 1]._y = 11/16;
        this._small_triangle_Array[pos_index + 2]._x = 6/16;
        this._small_triangle_Array[pos_index + 2]._y = 9/16;
        this._small_triangle_Array[pos_index + 3]._x = 10/16;
        this._small_triangle_Array[pos_index + 3]._y = 9/16;

        this._small_triangle_Array[pos_index + 4]._x = 6/16;
        this._small_triangle_Array[pos_index + 4]._y = 7/16;
        this._small_triangle_Array[pos_index + 5]._x = 10/16;
        this._small_triangle_Array[pos_index + 5]._y = 7/16;
        this._small_triangle_Array[pos_index + 6]._x = 14/16;
        this._small_triangle_Array[pos_index + 6]._y = 5/16;
        this._small_triangle_Array[pos_index + 7]._x = 14/16;
        this._small_triangle_Array[pos_index + 7]._y = 3/16;
	},

	getSmallTriganlePos7: function (pos_index) {


        // this._small_triangle_Array[pos_index]._x = 1/4;
        // this._small_triangle_Array[pos_index]._y = 1/2;
        // this._small_triangle_Array[pos_index + 1]._x = 1/2;
        // this._small_triangle_Array[pos_index + 1]._y = 1/4;
        // this._small_triangle_Array[pos_index + 2]._x = 1/2;
        // this._small_triangle_Array[pos_index + 2]._y = 3/4;
        // this._small_triangle_Array[pos_index + 3]._x = 3/4;
        // this._small_triangle_Array[pos_index + 3]._y = 1/2;

    	// this._small_triangle_Array[pos_index]._x = 1/4;
    	// this._small_triangle_Array[pos_index]._y = 1/2;
    	// this._small_triangle_Array[pos_index + 1]._x = 1/2;
    	// this._small_triangle_Array[pos_index + 1]._y = 1/4;
     //    this._small_triangle_Array[pos_index + 2]._x = 1/4;
     //    this._small_triangle_Array[pos_index + 2]._y = 1/4;
    	// this._small_triangle_Array[pos_index + 3]._x = 1/2;
    	// this._small_triangle_Array[pos_index + 3]._y = 3/4;
    	// this._small_triangle_Array[pos_index + 4]._x = 3/4;
    	// this._small_triangle_Array[pos_index + 4]._y = 1/2;
     //    this._small_triangle_Array[pos_index + 5]._x = 3/4;
     //    this._small_triangle_Array[pos_index + 5]._y = 3/4;

        this._small_triangle_Array[pos_index]._x = 1/8;
        this._small_triangle_Array[pos_index]._y = 5/8;
        this._small_triangle_Array[pos_index + 1]._x = 1/8;
        this._small_triangle_Array[pos_index + 1]._y = 3/8;
        this._small_triangle_Array[pos_index + 2]._x = 3/8;
        this._small_triangle_Array[pos_index + 2]._y = 1/8;
        this._small_triangle_Array[pos_index + 3]._x = 5/8;
        this._small_triangle_Array[pos_index + 3]._y = 1/8;

        this._small_triangle_Array[pos_index + 4]._x = 7/8;
        this._small_triangle_Array[pos_index + 4]._y = 3/8;
        this._small_triangle_Array[pos_index + 5]._x = 7/8;
        this._small_triangle_Array[pos_index + 5]._y = 5/8;
        this._small_triangle_Array[pos_index + 6]._x = 5/8;
        this._small_triangle_Array[pos_index + 6]._y = 7/8;
        this._small_triangle_Array[pos_index + 7]._x = 3/8;
        this._small_triangle_Array[pos_index + 7]._y = 7/8;


	},

    getSmallTriganlePosFlipX3: function (pos_index) {

        // this._small_triangle_Array[pos_index]._x = 3/4;
        // this._small_triangle_Array[pos_index]._y = 3/4;
        // this._small_triangle_Array[pos_index + 1]._x = 5/8;
        // this._small_triangle_Array[pos_index + 1]._y = 1/2;
        // this._small_triangle_Array[pos_index + 2]._x = 3/8;
        // this._small_triangle_Array[pos_index + 2]._y = 1/2;
        // this._small_triangle_Array[pos_index + 3]._x = 1/4;
        // this._small_triangle_Array[pos_index + 3]._y = 3/4;

    	// this._small_triangle_Array[pos_index]._x = 3/4;
    	// this._small_triangle_Array[pos_index]._y = 3/4;
    	// this._small_triangle_Array[pos_index + 1]._x = 5/8;
    	// this._small_triangle_Array[pos_index + 1]._y = 1/2;
     //    this._small_triangle_Array[pos_index + 2]._x = 5/8;
     //    this._small_triangle_Array[pos_index + 2]._y = 3/4;
    	// this._small_triangle_Array[pos_index + 3]._x = 3/8;
    	// this._small_triangle_Array[pos_index + 3]._y = 1/2;
    	// this._small_triangle_Array[pos_index + 4]._x = 1/4;
    	// this._small_triangle_Array[pos_index + 4]._y = 3/4;
     //    this._small_triangle_Array[pos_index + 5]._x = 3/8;
     //    this._small_triangle_Array[pos_index + 5]._y = 3/4;

        
        this._small_triangle_Array[pos_index]._x = 13/16;
        this._small_triangle_Array[pos_index]._y = 14/16;
        this._small_triangle_Array[pos_index + 1]._x = 11/16;
        this._small_triangle_Array[pos_index + 1]._y = 14/16;
    	this._small_triangle_Array[pos_index + 2]._x = 9/16;
        this._small_triangle_Array[pos_index + 2]._y = 10/16;
        this._small_triangle_Array[pos_index + 3]._x = 9/16;
        this._small_triangle_Array[pos_index + 3]._y = 6/16;

        this._small_triangle_Array[pos_index + 4]._x = 7/16;
        this._small_triangle_Array[pos_index + 4]._y = 6/16;
        this._small_triangle_Array[pos_index + 5]._x = 7/16;
        this._small_triangle_Array[pos_index + 5]._y = 10/16;
        this._small_triangle_Array[pos_index + 6]._x = 5/16;
        this._small_triangle_Array[pos_index + 6]._y = 14/16;
        this._small_triangle_Array[pos_index + 7]._x = 3/16;
        this._small_triangle_Array[pos_index + 7]._y = 14/16;
	},

	getSmallTriganlePosFlipX6: function (pos_index) {



        // this._small_triangle_Array[pos_index]._x = 3/4;
        // this._small_triangle_Array[pos_index]._y = 3/4;
        // this._small_triangle_Array[pos_index + 1]._x = 1/2;
        // this._small_triangle_Array[pos_index + 1]._y = 5/8;
        // this._small_triangle_Array[pos_index + 2]._x = 1/2;
        // this._small_triangle_Array[pos_index + 2]._y = 3/8;
        // this._small_triangle_Array[pos_index + 3]._x = 1/4;
        // this._small_triangle_Array[pos_index + 3]._y = 1/4; 

    	// this._small_triangle_Array[pos_index]._x = 3/4;
    	// this._small_triangle_Array[pos_index]._y = 3/4;
    	// this._small_triangle_Array[pos_index + 1]._x = 1/2;
    	// this._small_triangle_Array[pos_index + 1]._y = 5/8;
     //    this._small_triangle_Array[pos_index + 2]._x = 3/4;
     //    this._small_triangle_Array[pos_index + 2]._y = 5/8;
    	// this._small_triangle_Array[pos_index + 3]._x = 1/2;
    	// this._small_triangle_Array[pos_index + 3]._y = 3/8;
    	// this._small_triangle_Array[pos_index + 4]._x = 1/4;
    	// this._small_triangle_Array[pos_index + 4]._y = 1/4;	
     //    this._small_triangle_Array[pos_index + 5]._x = 1/4;
     //    this._small_triangle_Array[pos_index + 5]._y = 3/8;

        this._small_triangle_Array[pos_index]._x = 14/16;
        this._small_triangle_Array[pos_index]._y = 13/16;
        this._small_triangle_Array[pos_index + 1]._x = 14/16;
        this._small_triangle_Array[pos_index + 1]._y = 11/16;
        this._small_triangle_Array[pos_index + 2]._x = 10/16;
        this._small_triangle_Array[pos_index + 2]._y = 9/16;
        this._small_triangle_Array[pos_index + 3]._x = 6/16;
        this._small_triangle_Array[pos_index + 3]._y = 9/16;
        
        this._small_triangle_Array[pos_index + 4]._x = 10/16;
        this._small_triangle_Array[pos_index + 4]._y = 7/16;
        this._small_triangle_Array[pos_index + 5]._x = 6/16;
        this._small_triangle_Array[pos_index + 5]._y = 7/16;
        this._small_triangle_Array[pos_index + 6]._x = 2/16;
        this._small_triangle_Array[pos_index + 6]._y = 5/16;
        this._small_triangle_Array[pos_index + 7]._x = 2/16;
        this._small_triangle_Array[pos_index + 7]._y = 3/16;

	},

    
});