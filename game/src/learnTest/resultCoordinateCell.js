
var resultCoordinateCell = cc.Layer.extend({
    ctor:function (gradeArray, lastResult) {
        this._super();

        this.init(gradeArray, lastResult); 
    },

    init: function (gradeArray, lastResult) {
        this.initTop();
        this.runOneView(gradeArray, lastResult); 
        this.getLayerSize();
    },

    runOneView: function (gradeArray, lastResult) {
        var x_pointCount = 6;
        this.gradeArray = new Array();
        var gradeLength = gradeArray.length;
        for (var i = 0; i < gradeLength; i++) {
            this.gradeArray[i] = [];
            this.gradeArray[i].testId = gradeArray[i].x;
            this.gradeArray[i].grade = gradeArray[i].y;
        };

        for (var i = 0; i < gradeLength-1; i++) {
            for (var j = i; j < gradeLength; j++) {
                if (this.gradeArray[i].testId > this.gradeArray[j].testId) {
                    var testNumber;
                    testNumber = this.gradeArray[i];
                    this.gradeArray[i] = this.gradeArray[j];
                    this.gradeArray[j] = testNumber;
                }
            };
        };
        
        this.y_gradePosY = new Array();
        this.gradePos = new Array();
        var testCount = util.getArrycount(this.gradeArray);
        for (var i = 0; i < testCount; i++) {
            this.gradePos[i] = new Array();
        };

        this.xAxisPointArray = new Array();
        this.yAxisPointArray = new Array();

        this.initCenter();
        this.getXAxis(testCount, x_pointCount);
        this.getYAxis(testCount, x_pointCount);
        
        this.getGradePoint();
        
    },

    initTop: function () {
    	var learnQuotient = "学能商数进化图";
        this.topLayer = new SettleTypeTop(learnQuotient);
        this.addChild(this.topLayer);
    },

    initCenter: function () {
    	var size = cc.winSize;
        var scale = size.width / 750;

        this.draw = new cc.DrawNode();
	    this.addChild(this.draw);

    	var origin = cc.p(150, 100);
    	var x_endPoint = cc.p(size.width - 100, 100);
    	var up_arrowPoint = cc.p(x_endPoint.x - 10, 110);
    	var down_arrowPoint = cc.p(x_endPoint.x - 10, 90);

    	var y_endPoint = cc.p(150, 500);
    	var left_arrowPoint = cc.p(140, y_endPoint.y - 10);
    	var right_arrowPoint = cc.p(160, y_endPoint.y - 10);
    	var lineWidth = 1.5;
    	this.drawLine(origin, x_endPoint, lineWidth, cc.color(204,204,204,255));
	    this.drawLine(x_endPoint, up_arrowPoint, lineWidth, cc.color(204,204,204,255));
	    this.drawLine(x_endPoint, down_arrowPoint, lineWidth, cc.color(204,204,204,255));
	    this.drawLine(origin, y_endPoint, lineWidth, cc.color(204,204,204,255));
	    this.drawLine(y_endPoint, left_arrowPoint, lineWidth, cc.color(204,204,204,255));
	    this.drawLine(y_endPoint, right_arrowPoint, lineWidth, cc.color(204,204,204,255));

	    this.topLayer.y = y_endPoint.y + 50;

        var testNumLabel = new cc.LabelTTF("测试次数", "Arial", 30);
 		testNumLabel.ignoreAnchorPointForPosition(false);
        testNumLabel.setAnchorPoint(cc.p(0.5, 1));
        testNumLabel.x = x_endPoint.x;
        testNumLabel.y = 80;
        testNumLabel.color = cc.color(72,72,72,255);
        testNumLabel.setScale(scale);
        testNumLabel.setTag(111);
        this.addChild(testNumLabel);

        var gradeLabel = new cc.LabelTTF("得分", "Arial", 30);
 		gradeLabel.ignoreAnchorPointForPosition(false);
        gradeLabel.setAnchorPoint(cc.p(1, 1));
        gradeLabel.x = 145;
        gradeLabel.y = 480;
        gradeLabel.color = cc.color(72,72,72,255);
        gradeLabel.setScale(scale);
        gradeLabel.setTag(222);
        this.addChild(gradeLabel);

        this.x_length = size.width - 250 - testNumLabel.width;
        this.y_length = 380 - gradeLabel.height * 3;
        
    },

    getXAxis: function (testCount, x_pointCount) {
        var size = cc.winSize;
        var scale = size.width / 750;
        for (var i = 0; i < x_pointCount; i++) {
            var testNumStr;
            if (this.gradeArray.length < 6) {
                testNumStr = (i+1).toString();
            }else {
                testNumStr = String(this.gradeArray[i].testId);
            }
             
            var x_testNum = new cc.LabelTTF(testNumStr, "Arial", 30);
            x_testNum.ignoreAnchorPointForPosition(false);
            x_testNum.setAnchorPoint(cc.p(1, 1));
            x_testNum.x = 150 + (i+1) * this.x_length / x_pointCount;
            x_testNum.y = 90;
            x_testNum.color = cc.color(183,183,183,255);
            x_testNum.setScale(scale);
            this.addChild(x_testNum);
            this.xAxisPointArray.push(x_testNum);

            if (i < testCount) {
                this.gradePos[i]._x = 150 + (i+1) * this.x_length / x_pointCount;
            }
            
        };
    },

    getExtremum: function (testCount) {
        var maxGrade = 0;
        var minGrade = 0;
        if (testCount > 0) {
            minGrade = this.gradeArray[0].grade;
            maxGrade = this.gradeArray[0].grade;
            for (var i = 1; i < testCount; i++) {
                if (minGrade > this.gradeArray[i].grade) {
                    minGrade = this.gradeArray[i].grade;
                }
                if (maxGrade < this.gradeArray[i].grade) {
                    maxGrade = this.gradeArray[i].grade;
                }
            };
            minGrade = minGrade - 50;
            maxGrade = maxGrade + 50;

        }else {
            maxGrade = 650;
            minGrade = 0;
        }

        return {minGrade:minGrade, maxGrade:maxGrade};
    },

    getYAxis: function (testCount, x_pointCount, y_length) {
        var size = cc.winSize;
        var scale = size.width / 750;
        var extremumArray = this.getExtremum(testCount);
        var maxGrade = extremumArray.maxGrade;
        var minGrade = extremumArray.minGrade;
        var gradePosY = 0;
        var gradeInterval;
        var Interval_y; 

        for (var i = 0; i < x_pointCount; i++) {
            var unitGrade;
            if (testCount > 1) {
                if (minGrade <= 0) {
                    minGrade = 0;
                    gradeInterval = (i+1) * Math.floor(maxGrade / x_pointCount);
                    unitGrade = Math.floor(maxGrade / x_pointCount);
                    Interval_y = this.y_length / x_pointCount;
                    gradePosY = gradePosY + Interval_y;
                } else {
                    if (i == 0) {
                        gradeInterval = minGrade;
                        unitGrade = minGrade;
                        Interval_y = this.y_length / (x_pointCount - 1);
                        gradePosY = gradePosY + Interval_y;
                    } else {
                        var distance_grade = maxGrade - minGrade;
                        gradeInterval = minGrade + i * Math.floor(distance_grade / (x_pointCount - 1));
                        unitGrade = Math.floor(distance_grade / (x_pointCount - 1));
                        Interval_y = (this.y_length - Interval_y) / (x_pointCount - 1);
                        gradePosY = gradePosY + Interval_y;
                    }
                    
                }
                
            } else {
                minGrade = 0;
                maxGrade = 650;
                gradeInterval = (i+1) * Math.floor(maxGrade / x_pointCount);
                unitGrade = Math.floor(maxGrade / x_pointCount);
                Interval_y = this.y_length / x_pointCount;
                gradePosY = gradePosY + Interval_y;
            }

            var GradeStr = gradeInterval.toString(); 
            var y_gradeNum = new cc.LabelTTF(GradeStr, "Arial", 20);
            y_gradeNum.ignoreAnchorPointForPosition(false);
            y_gradeNum.setAnchorPoint(cc.p(1, 0.5));
            y_gradeNum.x = 140;
            y_gradeNum.y = 100 + gradePosY;
            y_gradeNum.color = cc.color(183,183,183,255);
            y_gradeNum.setScale(scale);
            this.addChild(y_gradeNum);
            this.yAxisPointArray.push(y_gradeNum);

            this.y_gradePosY[i] = new Array();
            this.y_gradePosY[i].gradeInterval = gradeInterval;
            this.y_gradePosY[i].gradePosY = 100 + gradePosY;
            this.y_gradePosY[i].unitGrade = unitGrade;
            this.y_gradePosY[i].Interval_y = Interval_y;
        };

        for (var i = 0; i < testCount; i++) {
            var testGrade = this.gradeArray[i].grade;
            for (var j = 0; j < x_pointCount; j++) {
                var y_coordinate = this.y_gradePosY[j];
                if (testGrade <= y_coordinate.gradeInterval) {
                    var dis_grade = y_coordinate.gradeInterval - testGrade;
                    var grade_y = y_coordinate.gradePosY - dis_grade/y_coordinate.unitGrade * y_coordinate.Interval_y;
                    this.gradePos[i]._y = grade_y;
                    break;
                }
            };
        };
    },

    getGradePoint: function () {
    	var testCount = util.getArrycount(this.gradeArray);
    	var radius = 7;
    	var fillColor = cc.color(253,162,32,255);
    	for (var i = 0; i < testCount; i++) {
    		var gradePoint = cc.p(this.gradePos[i]._x, this.gradePos[i]._y);
    		this.drawPoint(gradePoint, radius, fillColor);
    	};

    	var lineWidth = 3;
    	for (var i = 0; i < testCount - 1; i++) {
    		var gradePoint1 = cc.p(this.gradePos[i]._x, this.gradePos[i]._y);
    		var gradePoint2 = cc.p(this.gradePos[i+1]._x, this.gradePos[i+1]._y);
    		this.drawLine(gradePoint1, gradePoint2, lineWidth, fillColor);
    	};

    },

    drawPoint: function (point, radius, fillColor) {

    	this.draw.drawDot(point, radius, fillColor);
    },

    drawLine: function (node1, noded2, lineWidth, fillColor) {
    	this.draw.drawSegment(cc.p(node1.x, node1.y), cc.p(noded2.x, noded2.y), lineWidth, fillColor);
    },

    getLayerSize: function () {
        var size = cc.winSize;
        var scale = size.width / 750;

        this.width = cc.winSize.width;
        this.height = this.topLayer.height + this.topLayer.y;
    },

    updateCoordinate: function (gradeArray, lastResult) {
        var xCount = util.getArrycount(this.xAxisPointArray);
        for (var i = 0; i < xCount; i++) {
            this.xAxisPointArray[i].removeFromParent(true);
        };
        
        var yCount = util.getArrycount(this.yAxisPointArray);
        for (var i = 0; i < yCount; i++) {
            this.yAxisPointArray[i].removeFromParent(true);
        };
    
        this.draw.clear();
        var label1 = this.getChildByTag(111);
        label1.removeFromParent(true);
        var label2 = this.getChildByTag(222);
        label2.removeFromParent(true);

        this.runOneView(gradeArray, lastResult);
        
    },

});