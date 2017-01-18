var GridCell = cc.Layer.extend({
	grid:null,
	_pos:null,
	_pathId:null,
	_blocked:null,
	_gridType:null,
	_operaValue:null,
	_moveDirection:null,
	_isCanMove:null,
	_sideArray:null,
	ctor: function () {
		this._super();

		this._pathId = -1;
		this._blocked = false;
		this._gridType = 0;
		this._operaValue = 0;
		this._moveDirection = 0;
		this._isCanMove = false;
		this._sideArray = new Array();
		this.init();

		cc.eventManager.addListener({
            event: cc.EventListener.TOUCH_ONE_BY_ONE,
            swallowTouches: false,
            onTouchBegan: this.onTouchBegan,
            onTouchMoved: this.onTouchMoved,
            onTouchEnded: this.onTouchEnded
        }, this); 
	},

	init: function () {
		var size = cc.winSize;
        var scale = size.width / 750;

		this.gridNode = new cc.Node();
		this.gridNode.attr({
			anchorX:0,
    		anchorY:0,
        	x:0,
        	y:0,
		});
		this.addChild(this.gridNode);

		this.grid = new cc.Sprite(res.paintedPath.Painting_Block_white);
		this.grid.attr({
			anchorX:0,
    		anchorY:0,
        	x:0,
        	y:0,
        	scale:scale,
        	color:cc.color(255,255,255,0),
		});
		this.gridNode.addChild(this.grid);
		//this.gridColor.setVisible(false);

		this.gridNode.width = this.grid.width * scale;
		this.gridNode.height = this.grid.height * scale;

		for (var i = 0; i < 4; i++) {
			var side = new cc.Sprite(res.paintedPath.Painting_Block_0);
			if (i == 0) {
				side.setAnchorPoint(0, 0);
				side.x = 0;
				side.y = this.grid.height*scale;
				side.setRotation(90);
			}else if (i == 1) {
				side.setAnchorPoint(0, 0);
				side.x = 0;
				side.y = side.width;
				side.setRotation(90);
			}else if (i == 2) {
				side.setAnchorPoint(0, 0);
				side.x = 0;
				side.y = 0;
			}else if (i == 3) {
				side.setAnchorPoint(1, 0);
				side.x = this.grid.width*scale;
				side.y = 0;
			}
			side.setScaleY(scale);
			this.gridNode.addChild(side);
			this._sideArray.push(side);
		};

		this.width = this.gridNode.width;
		this.height = this.gridNode.height;
	},

	setStartingGrid: function (colorId, value, pathId) {
		// this.grid.setTexture(res);
		this.setGridColor(colorId);
		this._blocked = true;
		this._pathId = pathId;
		var moveValue = value.toString();
		this.pathValue = new cc.LabelTTF(moveValue, "Arial", 35);
        this.pathValue.setAnchorPoint(cc.p(0.5,0.5));
        this.pathValue.attr({
            x:this.gridNode.width * 0.5,
            y:this.gridNode.height * 0.5,
            color:cc.color(255,255,255,255),
        });
        this.grid.addChild(this.pathValue);
	},

	setBalkGrid: function (colorId) {
		this._blocked = true;
		this.setGridColor(colorId);
		// this.grid.setTexture(res);
	},

	setEndsGrid: function () {
		var size = cc.winSize;
        var scale = size.width / 750;

        this._gridType = 1;
		this.endFork = new cc.Sprite(res.paintedPath.Painting_fork);
		this.endFork.attr({
			anchorX:0.5,
    		anchorY:0.5,
        	x:this.gridNode.width * 0.5,
        	y:this.gridNode.height * 0.5,
        	scale:scale,
		});
		this.grid.addChild(this.endFork,2);
	},

	setColorPointGrid: function (pathId, colorId) {
		var size = cc.winSize;
        var scale = size.width / 750;
        
		this._pathId = pathId;
		this._gridType = 2;
		this.point = new cc.Sprite(res.paintedPath.Painting_circular_1);
		this.point.attr({
			anchorX:0.5,
    		anchorY:0.5,
        	x:this.gridNode.width * 0.5,
        	y:this.gridNode.height * 0.5,
        	scale:scale,
        	color: colorValue[colorId],
		});
		this.grid.addChild(this.point,2);
	},

	setArrowGrid: function (direction) {
		//上下左右
		var size = cc.winSize;
        var scale = size.width / 750;

		var rotateAngle = 0;
		switch (direction) {
			case 1: 
				rotateAngle = 90;
				break;
			case 2: 
				rotateAngle = -90;
				break;
			case 3: 
				rotateAngle = 0;
				break;
			case 4: 
				rotateAngle = 180;
				break;
		}

		this._gridType = 3;
		this._moveDirection = direction;
		this.arrow = new cc.Sprite(res.paintedPath.Painting_leftarrow_big);
		this.arrow.attr({
			anchorX:0.5,
    		anchorY:0.5,
        	x:this.gridNode.width * 0.5,
        	y:this.gridNode.height * 0.5,
        	scale:scale,
		});
		this.arrow.setRotation(rotateAngle);
		this.grid.addChild(this.arrow,2);
	},

	setOperationGrid: function (operaType, number) {
		var size = cc.winSize;
        var scale = size.width / 750;

		if (operaType == 'add') {
			this._operaValue = number;
		}else if (operaType == 'sub') {
			this._operaValue = (-1) * number;
		}
		this._gridType = 4;
		var showNumber = this._operaValue.toString();
		if (this._operaValue > 0) {
			showNumber = '+' + showNumber;
		}

		this.operaColor = new cc.Sprite(res.paintedPath.Painting_diamond03);
		this.operaColor.attr({
			anchorX:0.5,
    		anchorY:0.5,
        	x:this.gridNode.width * 0.5,
        	y:this.gridNode.height * 0.5,
        	scale:scale,
        	color:cc.color(255,255,255,0),
		});
		this.grid.addChild(this.operaColor, 2);

		this.operaBg = new cc.Sprite(res.paintedPath.Painting_diamond);
		this.operaBg.attr({
			anchorX:0.5,
    		anchorY:0.5,
        	x:this.gridNode.width * 0.5,
        	y:this.gridNode.height * 0.5,
        	scale:scale,
		});
		this.grid.addChild(this.operaBg, 3);

		this.operaValue = new cc.LabelTTF(showNumber, "Arial", 25);
        this.operaValue.setAnchorPoint(cc.p(0.5,0.5));
        this.operaValue.attr({
            x:this.operaBg.width * scale * 0.5,
            y:this.operaBg.height * scale * 0.5,
            color:cc.color(109, 109, 109, 255),
        });
        this.operaBg.addChild(this.operaValue);		
	},

	setMoveLine: function (res) {
		var size = cc.winSize;
        var scale = size.width / 750;

		this.moveLine = new cc.Sprite(res);
		this.moveLine.attr({
			anchorX:0.5,
    		anchorY:0.5,
        	x:0,
        	y:0,
        	scale:scale,
		});

		this.grid.addChild(this.moveLine);
	},

	adjustLine2: function (res, direction) {
		var size = cc.winSize;
        var scale = size.width / 750;

        this.moveLine.setTexture(res);

		var gridHeight = this.gridNode.height;
		var gridWidth = this.gridNode.width;
		var lineWidth = this.moveLine.width * scale;
		var rotateAngle = 0;
		switch (direction) {
			case 1: 
				rotateAngle = -90;
				this.moveLine.x = gridWidth * 0.5;
				this.moveLine.y = lineWidth * 0.5;
				break;
			case 2: 
				rotateAngle = 90;
				this.moveLine.x = gridWidth * 0.5;
				this.moveLine.y = gridHeight - lineWidth * 0.5;
				break;
			case 3: 
				rotateAngle = 180;
				this.moveLine.x = gridWidth - lineWidth * 0.5;
				this.moveLine.y = gridHeight * 0.5;
				break;
			case 4: 
				rotateAngle = 0;
				this.moveLine.x = lineWidth * 0.5;
				this.moveLine.y = gridHeight * 0.5;
				break;
		}

		this.moveLine.setRotation(rotateAngle);
	},

	adjustLine1: function (res, direction) {
		this.moveLine.setTexture(res);

		var gridHeight = this.gridNode.height;
		var gridWidth = this.gridNode.width;
		this.moveLine.x = gridWidth * 0.5;
		this.moveLine.y = gridHeight * 0.5;
		if (direction <= 2) {
			this.moveLine.setRotation(90);
		}
	},

	adjustLine3: function (res, direction) {
		var size = cc.winSize;
        var scale = size.width / 750;

		this.moveLine.setTexture(res);

		var gridHeight = this.gridNode.height;
		var gridWidth = this.gridNode.width;
		var lineWidth = this.moveLine.width * scale;
		var lineHeigth = this.moveLine.height * scale;

		var rotateAngle = 0;
		switch (direction) {
			case 1:
				rotateAngle = 0;
				this.moveLine.x = gridWidth - lineWidth * 0.5;
				this.moveLine.y = gridHeight - lineHeigth * 0.5;
				break;
			case 2:
				rotateAngle = -90;
				this.moveLine.x = lineWidth * 0.5;
				this.moveLine.y = gridHeight - lineHeigth * 0.5;
				break;
			case 3:
				rotateAngle = 90;
				this.moveLine.x = gridWidth - lineWidth * 0.5;
				this.moveLine.y = lineHeigth * 0.5;
				break;
			case 4:
				rotateAngle = 180;
				this.moveLine.x = lineWidth * 0.5;
				this.moveLine.y = lineHeigth * 0.5;
				break;
		}
		this.moveLine.setRotation(rotateAngle);
	},

	delLine: function () {
		this.moveLine.removeFromParent(true);
	},

	onTouchBegan:function (touch, event) {
		var target = event.getCurrentTarget();
		var targetRect = cc.rect(0,0, target.width, target.height);
        var touchPoint = target.convertToNodeSpace(touch.getLocation());
        if (target._pathId != -1 && target._blocked == true && cc.rectContainsPoint(targetRect, touchPoint)) {
        	target._isCanMove = true;
        	target._beganHandle(target._beganDelegate, target);
        }
		return true;
	},

	onTouchMoved:function (touch, event) {
        var target = event.getCurrentTarget();
        if (target._isCanMove == true) {
	        target._movedHandle(target._movedDelegate, touch);
	    }
    },

    onTouchEnded:function (touch, event) {
    	var target = event.getCurrentTarget();
    	if (target._isCanMove == true) {
	        target._isCanMove = false;
    		target._endedHandle(target._endedDelegate);
	    }
    },

    setBeganHandle: function (delegate, handle) {
    	this._beganDelegate = delegate;
    	this._beganHandle = handle;
    },

    setMovedHandle: function (delegate, handle) {
    	this._movedDelegate = delegate;
    	this._movedHandle = handle;
    },

    setEndedHandle: function (delegate, handle) {
    	this._endedDelegate = delegate;
    	this._endedHandle = handle;
    },

	setPathValue: function (value) {
		this.pathValue.setString(value);
	},

	getPathValue: function () {
		return parseInt(this.pathValue.getString());
	},

	setGridColor: function (colorId) {
		this.grid.color = colorValue[colorId];
	},

	delGridColor: function (color) {
		this.grid.color = color;
	},

	setOperaStr: function (value) {
		var showValue = '';
		if (value > 0) {
			showValue = '+' + value.toString();
		}else {
			showValue = value.toString()
		}
		this.operaValue.setString(showValue);
	},

	delOperaGrid: function () {
		this.operaColor.removeFromParent(true);
		this.operaValue.removeFromParent(true);
		this.operaBg.removeFromParent(true);
	},

	setMoveOpera: function (isGo, colorId) {
		if (isGo) {
			this.operaColor.color = colorValue[colorId];
			this.operaBg.setTexture(res.paintedPath.Painting_diamond02);
			this.operaValue.color = cc.color(255,255,255,255);
		}else {
			this.operaColor.color = cc.color(255,255,255,0);
			this.operaBg.setTexture(res.paintedPath.Painting_diamond);
			this.operaValue.color = cc.color(109, 109, 109,255);
		}
	},

	setMovePoint: function (isGo) {
		if (isGo) {
			this.point.setTexture(res.paintedPath.Painting_circular_02);
			this.point.setOpacity(150);
		}else {
			this.point.setTexture(res.paintedPath.Painting_circular_1);
			this.point.setOpacity(255);
		}
	},

	setMoveEnd: function (isGo) {
		// cc.log(this.endFork);
		if (isGo) {
			this.endFork.setOpacity(150);
		}else {
			this.endFork.setOpacity(255);
		}
	},

	setMoveArrow: function (isGo) {
		if (isGo) {
			this.arrow.setOpacity(150);
		}else {
			this.arrow.setOpacity(255);
		}
	},

	delArrowGrid: function () {
		this.arrow.removeFromParent(true);
	},

	delPointGrid: function () {
		this.point.removeFromParent(true);
	},

	setSideVisible: function (i, isShow) {
		this._sideArray[i-1].setVisible(isShow);
	},

	getPos: function () {
		return this._pos;
	},

	setPos: function (pos) {
		this._pos = pos;
	},

	isBlocked: function () {
		return this._blocked;
	},

	setBlocked: function (blocked) {
		this._blocked = blocked;
	},

	getValue: function () {
		return this._operaValue;
	},

	setValue: function (Value) {
		this._operaValue = Value;
	},

	getPathId: function () {
		return this._pathId;
	},

	setPathId: function (pathId) {
		this._pathId = pathId;
	},

	getType: function () {
		return this._gridType;
	},

	setType: function (type) {
		this._gridType = type;
	},

	getDirection: function () {
		return this._moveDirection;
	},

	setDirection: function (direction) {
		this._moveDirection = direction;
	},
});