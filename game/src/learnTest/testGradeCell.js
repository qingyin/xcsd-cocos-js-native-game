var TestGradeCell = cc.Layer.extend({
	_getGrade:null,
    ctor:function (getGrade, totalGrade) {
        this._super();

        this._getGrade = getGrade;
        this._totalGrade = totalGrade;

        this.init();
    },

    init: function () {
    	this.initTop();
    	this.initCenter();
    	this.getLayerSize();
    },

    initTop: function () {
    	var learnGrade = "学能商数得分";
        this.topLayer = new SettleTypeTop(learnGrade);
        this.addChild(this.topLayer);
    },

    initCenter: function () {
    	var size = cc.winSize;
        var scale = size.width / 750;

        this.grade_bg = new cc.Sprite(res.learnTest.LC_Level_01);
        this.grade_bg.ignoreAnchorPointForPosition(false);
        this.grade_bg.setAnchorPoint(cc.p(0.5, 0));
        this.grade_bg.attr({
        	x:cc.winSize.width*0.5,
        	y:26,
        	scale:scale,
        });
        this.addChild(this.grade_bg);

        this.topLayer.y = this.grade_bg.y + this.grade_bg.height*scale + 26;

        var maxString = this._totalGrade.toString();
        var lblMaxGrade = new cc.LabelTTF(maxString, "Arial", 30);
        lblMaxGrade.ignoreAnchorPointForPosition(false);
        lblMaxGrade.setAnchorPoint(cc.p(0.5, 1));
        lblMaxGrade.attr({
        	x:this.grade_bg.width*0.5,
        	y:this.grade_bg.height*0.5 - 20,
        	color:cc.color(183,183,183,255),
        });
        this.grade_bg.addChild(lblMaxGrade);

        this.lblGetGrade = new cc.LabelTTF("", "Arial", 60);
        this.lblGetGrade.ignoreAnchorPointForPosition(false);
        this.lblGetGrade.setAnchorPoint(cc.p(0.5, 0));
        this.lblGetGrade.attr({
        	x:this.grade_bg.width*0.5,
        	y:this.grade_bg.height*0.5 + 10,
        	color:cc.color(72,72,72,255),
        });
        this.grade_bg.addChild(this.lblGetGrade);

        this.setGradeAction();
    },

    setGradeAction: function () {
    	var showGrade = 0;
    	this._stopUpdate = false;
    	this.addGrade = function () {
    		showGrade = showGrade + 1;
            if (showGrade <= this._getGrade) {
                this.lblGetGrade.setString(showGrade.toString());
            }
    		if (showGrade >= this._getGrade) {
    			this.unschedule(this.addGrade);
    			this._stopUpdate = true;
    			return;
    		}
    	}
    	this.schedule(this.addGrade, 0.01);
    },

    getLayerSize: function () {
        var size = cc.winSize;
        var scale = size.width / 750;

        this.width = cc.winSize.width;
        //this.height = this.compareLabel.height * scale + this.compareLabel.y;
        this.height = this.topLayer.y + this.topLayer.height;
    },

    onExit: function () {
    	if (this._stopUpdate == false) {
    		this.unschedule(this.addGrade);
    		this._stopUpdate = true;
    	}
    	this._super();
    },
});