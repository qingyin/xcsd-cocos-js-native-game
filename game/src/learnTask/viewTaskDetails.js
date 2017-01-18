
var ViewTaskDetails = cc.LayerColor.extend({
    ctor: function(args){    	
        this._super();
        this._totalScore = args.totalScore;
        this._taskList = args.taskList;
        this._mail = args.mail;
        this._IsComplated = args._IsComplated || false;

        this._isStartGame = false;

        this.color = cc.color(255,255,255);
        this.init();
    },
    initEnum:function(){
        this.Enum = {
            upSpace1Sender : 30,
            upSpace2Line : 30,
            upSpace3Msg  : 30,
            upSpace4Date : 40,
            upSpace5ScoreLayer : 30,
            upSpace6TaskList : 30,
        };
        this.LableFont = {
            fontName : "Arial",
            fontSize : 30,
        };
        this.HeightLayerTaskScore = 84;
        this.MsgHeight = 250;
    },
    init:function(){
        this.initEnum();
    	this.initTop();
        this.initBottom();
    	this.initCenter();

        cc.eventManager.addListener({
            event: cc.EventListener.TOUCH_ONE_BY_ONE,
            swallowTouches: true,
            onTouchBegan:function(touch, event){
                return true;},
        }, this);
    },
    initTop:function(){
    	var size = cc.winSize;
    	var args = {
    		title:'学能作业详情',
    		isShowBackBtn:true,
    	};
    	this._viewTop = new SubViewTop(args);
    	this.addChild(this._viewTop);
        this._viewTop.attr({
            anchorY:1,
            y:cc.winSize.height-this._viewTop.height,
        });
    },
    initCenter:function(){
        this.initScrollView();
    	this.initMail();
        this.initScoreLayer();
    	this.initTaskList();
    },
    initBottom:function(){
        if(this._IsComplated == false){
            var size = cc.winSize;
            this.btnStart = new ccui.Button();
            this.btnStart.loadTextures(res.learnTask.bnt_LearnWork_StartJobs_n,res.learnTask.bnt_LearnWork_StartJobs_s);
            this.btnStart.attr({
                anchorY:0,
                x:size.width * 0.5,
                y:37*0.5,
            });     
            this.addChild(this.btnStart);

            var draw = new cc.DrawNode();
            this.addChild(draw,2);
            draw.drawSegment(cc.p(0,this.btnStart.height+37),cc.p(size.width,this.btnStart.height+37),0.5,cc.color(216,216,216,255));  
        }      
    },
    initScrollView:function(){
        var size = cc.winSize;
    	this.scrollView = new ccui.ScrollView();
        this.addChild(this.scrollView);
        this.scrollView.setDirection(ccui.ScrollView.DIR_VERTICAL);
        this.scrollView.setTouchEnabled(true);
        
        var height = size.height-this._viewTop.height;
        this.scrollView.attr({
            anchorX:0.5,
            anchorY:0.5,
            x:size.width * 0.5,
            y:height*0.5,
        });
        if(this._IsComplated == false){
            height = size.height-(this.btnStart.height+37)-this._viewTop.height;
            this.scrollView.y = height*0.5+this.btnStart.height+37;
        }
        this.scrollView.setContentSize(cc.size(size.width,height));
        var h = this.getScoreViewInnerHeight();
        this.scrollView.setInnerContainerSize(cc.size(size.width, h));
    },
    initMail:function(){
        var size = cc.winSize; 
        this.lblSender = new cc.LabelTTF("发件人:",this.LableFont.fontName,this.LableFont.fontSize);
        var posX = 25;
        this.lblSender.attr({
            anchorX:0,
            x:posX,
            y:this.scrollView.getInnerContainerSize().height-this.Enum.upSpace1Sender-this.lblSender.height*0.5,
            color: cc.color(121, 121, 121),
        });
        this.scrollView.addChild(this.lblSender);

        var lblSenderName = new cc.LabelTTF(this._mail.senderName,this.LableFont.fontName,this.LableFont.fontSize);
        lblSenderName.attr({
            anchorX:0,
            x:this.lblSender.x + this.lblSender.width + 10,
            y:this.lblSender.y,
            color: cc.color(67, 109, 129),
        });
        this.scrollView.addChild(lblSenderName);

        var draw = new cc.DrawNode();
        this.scrollView.addChild(draw);
        var posY = this.lblSender.y - this.lblSender.height*0.5 - this.Enum.upSpace2Line;
        draw.drawSegment(cc.p(posX, posY), cc.p(size.width-posX, posY), 1, cc.color(216, 216, 216, 255));

        var txtMsg = new ccui.Text(this._mail.msgText,this.LableFont.fontName,this.LableFont.fontSize);
        txtMsg.attr({
            anchorX:0.5,
            anchorY:1,
            x:size.width*0.5,
            y:posY - this.Enum.upSpace3Msg,
            color: cc.color(68, 68, 68),
        }); 
        txtMsg.ignoreContentAdaptWithSize(false);
        txtMsg.setContentSize(cc.size(size.width-50, this.MsgHeight));
        txtMsg.setTextHorizontalAlignment(cc.TEXT_ALIGNMENT_LEFT);
        this.scrollView.addChild(txtMsg);

        this.lblDateTime = new cc.LabelTTF(this._mail.dateTime,this.LableFont.fontName,this.LableFont.fontSize);
        this.lblDateTime.attr({
            anchorX:1,
            x:cc.winSize.width - 30,
            y:txtMsg.y - txtMsg.height - this.Enum.upSpace4Date-this.lblDateTime.height*0.5,
            color: cc.color(159, 160, 160),
        });
        this.scrollView.addChild(this.lblDateTime);
    },
    initScoreLayer:function(){
        this.layerScore = new cc.LayerColor(cc.color(243,243,243));
        this.layerScore.attr({
            width:cc.winSize.width,
            height:this.HeightLayerTaskScore,
            y:this.lblDateTime.y - this.lblDateTime.height*0.5 - this.Enum.upSpace5ScoreLayer-this.HeightLayerTaskScore,
        });
        this.scrollView.addChild(this.layerScore);

        var lblTemp = new cc.LabelTTF("本次作业成绩:  ",this.LableFont.fontName,this.LableFont.fontSize);
        lblTemp.attr({
            anchorX:0,
            x:20,
            y:this.layerScore.height*0.5,
            color: cc.color(83, 83, 83),
        });
        this.layerScore.addChild(lblTemp);

        if(this._IsComplated == false){
            this.layerScore.color = cc.color(255, 255, 255, 0);
            lblTemp.color = cc.color(72, 72, 72);
            lblTemp.setString("学能作业列表:");
        }else{
            this.lblScore = new cc.LabelTTF(this._totalScore+"分",this.LableFont.fontName,this.LableFont.fontSize);
            this.lblScore.attr({
                anchorX:0,
                x:20+lblTemp.width,
                y:this.layerScore.height*0.5,
                color: cc.color(253, 162, 32),
            });
            this.layerScore.addChild(this.lblScore);

            lblTemp = new cc.LabelTTF("作业满分为10分",this.LableFont.fontName,this.LableFont.fontSize);
            lblTemp.attr({
                anchorX:1,
                x:this.layerScore.width-20,
                y:this.layerScore.height*0.5,
                color: cc.color(67, 109, 129),
            });
            this.layerScore.addChild(lblTemp);
        }
    },
    initTaskList:function(){
        var posY = this.layerScore.y - this.Enum.upSpace6TaskList;
        for(var i=0;i<this._taskList.length;i++){
            var cell = new CellViewTask(this._taskList[i]);
            cell.attr({
                y:posY - (i+1) * cell.height,
            });
            this.scrollView.addChild(cell);
            if(this._IsComplated == true){
                cell.showStar(this._taskList[i].stars);
            }
            if(i == this._taskList.length-1){
                cell.hideDot();
            }
        }
    },
    setHandleShowViewStart:function(delegate,handle){
        if(this._IsComplated == false){
            this._delegate = delegate;
            this._handleStart = handle;
            var self = this;
            this.btnStart.addClickEventListener(function(){
                cc.log("--------- click start task ---------");
                if (self._isStartGame == false) {
                    cc.log("--------- start task game ----------");
                    self._isStartGame = true;
                    if(typeof(self._handleStart) == 'function'){
                        self._handleStart(self._delegate);
                    }
                }
                
            });
        }
    },
    getScoreViewInnerHeight:function(){
        var h = 0;
        for (var k in this.Enum) {
            h += this.Enum[k];
        };
        var lbl = new cc.LabelTTF('',this.LableFont.fontName,this.LableFont.fontSize);
        h = h + lbl.height * 2;
        h = h + this.MsgHeight;
        h = h + this.HeightLayerTaskScore;
        h = h + (this._taskList.length)*120;
        return h;
    },

    onExit: function () {
        this._super();
    },

});


