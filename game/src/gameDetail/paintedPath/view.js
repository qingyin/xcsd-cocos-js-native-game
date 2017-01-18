var PaintedPathView = cc.LayerColor.extend({
	ctor: function (bgColor) {
		this._super();

		this.color = bgColor;

		this.init();
	},

	init: function () {
		this.initTop();
		this.initCenter();
	},

	initTop: function () {
		this._topView = new CommonTopPauseProgress();
		this.addChild(this._topView);

		//progress bar long
        this._progressBar = new cc.ProgressTimer(new cc.Sprite(res.paintedPath.Painting__nva_progressBar));
        this._progressBar.ignoreAnchorPointForPosition(false);
        this._progressBar.setAnchorPoint(cc.p(0.5, 1));

        this._progressBar.type = cc.ProgressTimer.TYPE_BAR;
        this._progressBar.midPoint = cc.p(1, 0);
        this._progressBar.barChangeRate = cc.p(1, 0);
        this._progressBar.x = this._topView.topBg.width/2;
        this._progressBar.y = 0;

        this._topView.topBg.addChild(this._progressBar);
        this._progressBar.setPercentage(100);
	},

	initCenter: function () {
		var size = cc.winSize;
        var scale = size.width / 750;

        this.centerNode = new cc.Node();
        this.centerNode.attr({
        	anchorX:0,
    		anchorY:0,
        	x:0,
        	y:0,
        });
        this.addChild(this.centerNode);
        this.centerNode.width = size.width;
        this.centerNode.height = size.height - this._topView.topBg.height - this._progressBar.height;

        this.centerBg = new cc.Scale9Sprite(res.paintedPath.Painting_bg_white, cc.rect(0,0, 602, 695), cc.rect(25, 25, 552, 645));
        this.centerBg.ignoreAnchorPointForPosition(false);
        this.centerBg.setAnchorPoint(cc.p(0.5, 0.5));
        this.centerBg.attr({
        	x:this.centerNode.width*0.5,
        	y:this.centerNode.height*0.5,
        });
        this.centerNode.addChild(this.centerBg);

	},

    addPathAnswerView: function (pathsArray) {
        this.answerView = new cc.LayerColor(cc.color(255,255,255,255));
        this.answerView.width = this.width;
        this.answerView.height = this.height;
        this.answerView.attr({
            anchorX:0,
            anchorY:0,
            x:0,
            y:0,
        });
        this.addChild(this.answerView);

        var tipHeight = this.answerView.height-50;
        for (var i = 0; i < pathsArray.length; i++) {
            var showPathStr = 'path ' + (i+1).toString() + ':\n';
            var tipPath = new cc.LabelTTF(showPathStr, "Arial", 35);
            tipPath.setAnchorPoint(cc.p(0,1));
            tipPath.attr({
                x:50,
                y:tipHeight,
                color:cc.color(0, 0, 0, 255),
            });
            this.answerView.addChild(tipPath); 

            var posStr = '';
            var colNum = 0;
            var path = pathsArray[i].getIdealPath();
            for (var j = 0; j < path.length; j++) {
                var cellPosStr = (j+1).toString() + ':(' + path[j].getPos().getX().toString() + ', ' + path[j].getPos().getY().toString() + ') ';
                colNum = colNum + 1;
                if (colNum % 4 == 0 && j < path.length-1) {
                    cellPosStr = cellPosStr + '\n'; 
                }
                posStr = posStr + cellPosStr;
            };

            showPathStr = showPathStr + posStr;
            tipPath.setString(showPathStr);
            var tipH = tipPath.height;
            tipHeight = tipHeight - tipH;
            showPathStr = null;
            posStr = null;
            colNum = null;
        };
    },

    guideVisible: function (isShow) {
        this.centerBg.setVisible(isShow);
    },

    delAnswerView: function () {
        this.answerView.removeAllChildren();
        this.answerView.removeFromParent(true);
    },

    setGuideHand: function (posList) {
        var size = cc.winSize;
        var scale = size.width / 750;

        this.hand = new cc.Sprite(res.Helper_hand);
        this.hand.setAnchorPoint(cc.p(0.5, 1));
        this.hand.attr({
            x:posList[0].x,
            y:posList[0].y,
            scale:scale,
        });
        this.centerBg.addChild(this.hand, 3);
        this.addHandAction(posList);
    },

    setGuideArraw: function () {
        var size = cc.winSize;
        var scale = size.width / 750;

        this.handArraw = new cc.Sprite(res.Helper_arrow_Left);
        this.handArraw.setAnchorPoint(cc.p(0.5, 0.5));
        this.handArraw.attr({
            x:this.centerBg.width*0.5,
            y:this.centerBg.height*0.5,
            scale:scale,
        });
        this.centerBg.addChild(this.handArraw, 2);
        this.handArraw.setRotation(-90);
    },

    addHandAction: function (movesPos) {
        var size = cc.winSize;
        var scale = size.width / 750;

        var action = [];
        action[action.length] = cc.DelayTime.create(0.5);
        for (var i = 1; i < movesPos.length; i++) {
            action[action.length] = cc.MoveTo.create(0.3, movesPos[i]); 
        };

        action[action.length] = cc.DelayTime.create(0.3);

        action[action.length] = cc.CallFunc.create(function () {
            this.hand.removeFromParent(true);
            this.hand = null;
            if (this.handArraw) {
                this.handArraw.removeFromParent(true);
                this.handArraw = null;
            }
            this._handleGrid(this._delegateGrid, true);
        }, this);

        this.hand.runAction(cc.sequence(action));
    },

    setGridHandle: function (delegate, handle) {
        this._delegateGrid = delegate;
        this._handleGrid = handle;
    },
});