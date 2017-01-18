
var SettleTestView = cc.LayerColor.extend({
    _spiderChartArray:null,
    ctor:function (args, isSettle) {
        this._super();

        this.color = cc.color(255,255,255,255);
        
        this.initData(args, isSettle);

        this.initTop();
        this.initCenter();

        cc.eventManager.addListener({
            event: cc.EventListener.TOUCH_ONE_BY_ONE,
            swallowTouches: true,
            onTouchBegan: function(touch, event) {
                return true;   
            },
        }, this);
    },

    initData: function (args, isSettle) {
        // this._spiderChartArray = new Array();
        // this.result = args.abilityQuotient;
        // this.isSettle = isSettle;
        // this.getSpiderArray(args.ability);
        this._curTestGrade = args.testGrade;
        this._gradeArray = args.abilityHistory;
        this._totalGrade = args.totalGrade;
        // this._rankRate = args.rankRate;
        // if (this.isSettle == false) {
            // this.titleStr = args.name + "的学能成绩"; 
            // this.isTeacherApp = args.isChildState; 
        // }else {
            this.titleStr ='评估结果';
        // }
    },

    initTop: function () {
    	var args = {
            title:this.titleStr,
            isShowBackBtn:true,
            // isTeacherApp:this.isTeacherApp,
        };
        this._viewTop = new SubViewTop(args);
        // this._viewTop.TOP_LAYER_HEIGHT = 128;
        // this._viewTop.height = this._viewTop.TOP_LAYER_HEIGHT;
        this.addChild(this._viewTop,2);
        this._viewTop.attr({
            anchorY:1,
            y:cc.winSize.height-this._viewTop.height,
        });
    },

    initCenter: function () {
    	var listView = new ccui.ListView();
        listView.setDirection(ccui.ScrollView.DIR_VERTICAL);
        listView.setTouchEnabled(true);
        listView.setBounceEnabled(true);
        listView.setBackGroundImageScale9Enabled(true);

        var listViewSize = cc.size(cc.winSize.width, cc.winSize.height-this._viewTop.height);
        listView.setContentSize(cc.size(listViewSize.width, listViewSize.height));
        listView.x = 0;
        listView.y = 0;
        listView.tag = 111;
        this.addChild(listView);

        var listViewItemCount = 2;

        // add custom item
        for (i = 0; i < listViewItemCount; ++i) {
            var scale = 1;
            var cellHeight = 500;
            var listViewItem = new ccui.Layout();
            listViewItem.height = cellHeight * scale;
            listViewItem.width = listView.width;

            switch(i) {
            	case 0:
                    /*
                    var args = {
                        result: this.result,
                        learnQuotient:"学能商数",
                        studyStr:"你的学习能力总商数为：",
                        isPractice:false,
                    };
                    if (this.isSettle == false && this.isTeacherApp == 1) {
                        args.studyStr = "学习能力总商数为：";
                    } 
                    //cc.log("--this._spiderChartArray-",this._spiderChartArray,typeof(this._spiderChartArray));
            		this.spiderIQ = new SpiderChartCell(this._spiderChartArray, args);
		            this.spiderIQ.x = 0;
		            this.spiderIQ.y = 0;
		            listViewItem.addChild(this.spiderIQ);
                    listViewItem.height = this.spiderIQ.height;
                    */
                    this.testGradeCell = new TestGradeCell(this._curTestGrade, this._totalGrade);
                    this.testGradeCell.x = 0;
                    this.testGradeCell.y = 0;
                    listViewItem.addChild(this.testGradeCell);
                    listViewItem.height = this.testGradeCell.height;

            	 	break;
            	 case 1:
                    // if (this.isSettle == false) {
                    //     this.result = -1;
                    // }
                    this.coordinate = new resultCoordinateCell(this._gradeArray, this.result);
                    this.coordinate.x = 0;
                    this.coordinate.y = 0;
                    listViewItem.addChild(this.coordinate);
                    listViewItem.height = this.coordinate.height;
            	 	break;
                /*
            	 case 1:
                    var isTeacher = false;
                    if (this.isSettle == false && this.isTeacherApp == 1) {
                        isTeacher = true;
                    }
                    this.resultCell = new CompareProgressCell(this._rankRate, isTeacher);
                    this.resultCell.x = listViewItem.width /2;
                    this.resultCell.y = 0;
                    listViewItem.addChild(this.resultCell);
                    listViewItem.height = this.resultCell.height;
            	 	break;
                */
            }

            listView.pushBackCustomItem(listViewItem);
        }

        // set all items layout gravity
        listView.setGravity(ccui.ListView.GRAVITY_CENTER_VERTICAL);

        // set items margin
        listView.setItemsMargin(20);

    },

    getSpiderArray: function (chartArray) {
        this._spiderChartArray = [];
        for(var k in chartArray){
            this._spiderChartArray[Number(k)-1] = chartArray[k];
        }
    },

    updateResult: function (args, isSettle) {
        this.initData(args, isSettle);
        this._viewTop.setTitleText(this.titleStr);
        var isPractice = false;
        this.spiderIQ.updateSpider(this._spiderChartArray, this.result, isPractice);
        if (this.isSettle == false) {
            this.result = -1;
        }
        this.coordinate.updateCoordinate(this._gradeArray, this.result);
        this.resultCell.updateCompare(this._rankRate);
    },

    delTeacherTop: function () {
        var listView = this.getChildByTag(111);
        var listViewSize = cc.size(cc.winSize.width, cc.winSize.height);
        listView.setContentSize(cc.size(listViewSize.width, listViewSize.height));
    },

    onExit: function () {
        this._super();
    },
});