
var CellViewTask = cc.LayerColor.extend({
    _clickX:null,
    _clickY:null,
    ctor: function(args, chooseArray){
        this._super();
        this._args = {};
        this.color = cc.color(255,255,255);
        
        var unit = UNIT_CONFIG[String(args.gameId)];

        this._args.gameId = args.gameId;

        this._args.gameIcon = unit.gameIcon;
        this._args.gameName = unit.gameName;
        this._args.subTitle = unit.type+' 第'+args.level+'关';
        var colorArray = VIEW_CONFIG[String(args.gameId)].taskGameColor;
        this._args.mainColor = cc.color(colorArray.r, colorArray.g,colorArray.b,colorArray.Opacity);

        this._chooseArray = chooseArray;

        this.isClickSend = true;

        this.height = 120;
        this.init();
    },
    init:function(){
    	var spriteGameIcon = new cc.Sprite(this._args.gameIcon);
    	spriteGameIcon.attr({
    		anchorX:0,
            anchorY:1,
    		x:50,
    		y:this.height,
    	});
    	this.addChild(spriteGameIcon);

        this.spriteDot = new cc.Sprite(res.learnTask.LearnWork_Thedottedline);
        this.spriteDot.attr({
            anchorX:0.5,
            anchorY:0.5,
            x:spriteGameIcon.x + spriteGameIcon.width*0.5,
            y:15,
        });
        this.addChild(this.spriteDot);
        
    	var lblGameName = new cc.LabelTTF(this._args.gameName,'Arial',32);
    	lblGameName.attr({
    		anchorX:0,
    		anchorY:0,
    		x:spriteGameIcon.x + spriteGameIcon.width+20,
    		y:this.height * 0.5+10,
    		color:this._args.mainColor,
    	});
    	this.addChild(lblGameName);

    	this.lblSubTitle = new cc.LabelTTF(this._args.subTitle,'Arial',28);
    	this.lblSubTitle.attr({    	
    		anchorX:0,
    		anchorY:1,
    		x:lblGameName.x,
    		y:this.height * 0.5,
    		color:cc.color(183,183,183),
    	});
    	this.addChild(this.lblSubTitle);

        this.initStar();
    }, 
    initStar:function(){   
        this.dark_star = [];
        this.bright_star = [];
        
        var startPosX = cc.winSize.width - 30;

        for (var i = 0; i < 3; i++) {          
            this.dark_star[i] = new cc.Sprite(res.game_star_small_01);
            this.dark_star[i].attr({
                anchorX:1,
                x:startPosX - (2-i)* (28 + this.dark_star[i].width),
                y:this.height * 0.5,
            });   
            this.dark_star[i].setVisible(false); 
            this.addChild(this.dark_star[i]); 

            this.bright_star[i] = new cc.Sprite(res.game_star_small_02);
            this.bright_star[i].attr({
                anchorX:1,
                x:startPosX - (2-i)* (28 + this.dark_star[i].width),
                y:this.height * 0.5,
            });
            this.bright_star[i].setVisible(false); 
            this.addChild(this.bright_star[i]);  
        };
    },
    showStar:function(num){
        if (num == 0) {
            var startPosX = cc.winSize.width - 30;
            var lblNotPass = new cc.LabelTTF("未通关",'Arial',30);
            lblNotPass.attr({      
                anchorX:1,
                anchorY:0.5,
                x:startPosX,
                y:this.height * 0.5,
                color:cc.color(253,162,32),
            });
            this.addChild(lblNotPass);
        }else {
            for (var i = 0; i < num; i++) {            
                this.dark_star[i].setVisible(false); 
                this.bright_star[i].setVisible(true); 
            };
            for (var i = num; i < 3; i++) {            
                this.dark_star[i].setVisible(true); 
                this.bright_star[i].setVisible(false); 
            }; 
        }
        
    },
    hideDot:function(){
        this.spriteDot.setVisible(false);
    },
    /*
    addEventListener: function () {
        cc.eventManager.addListener({
            event: cc.EventListener.TOUCH_ONE_BY_ONE,
            swallowTouches: false,
            onTouchBegan:function(touch, event){
                var target = event.getCurrentTarget();
                if (target.isClickSend == true) {
                    target.isMove = false;
                    target._clickX = touch.getLocation().x;
                    target._clickY = touch.getLocation().y;
                }
                return true;},
            onTouchMoved:function (touch, event) {
                var target = event.getCurrentTarget();
                if (target.isClickSend == true) {
                    target.isMove = true;
                }
            },
            onTouchEnded:function (touch, event) {
                var target = event.getCurrentTarget();
                if (target.isClickSend == true) {
                    var movedX = touch.getLocation().x - target._clickX;
                    var movedY = touch.getLocation().y - target._clickY;
                    if (Math.abs(movedX) < 3 && Math.abs(movedY) < 3) {
                        target.isMove = false;
                    }
                    var parent = target.getParent().getParent();
                    if (target.isMove == false) {
                        var rect = cc.rect(0,0,target.width,target.height);
                        var pos = target.convertToNodeSpace(touch.getLocation());
                        var rectParent = cc.rect(0,0,parent.width, parent.height);
                        var touchPos = parent.convertToNodeSpace(touch.getLocation());
                        if(cc.rectContainsPoint(rect,pos)){
                            if(cc.rectContainsPoint(rectParent,touchPos)){
                                target._handleClick(target._delegateClick, target._args.gameId);
                            } 
                        }
                    }
                }
            },
        }, this);
    },

    
    addAssignUI: function () {
        // this.color = cc.color(255,249,230);
        var unit = UNIT_CONFIG[String(this._args.gameId)];
        var subTitle = unit.type;
        this.lblSubTitle.setString(subTitle);
        var leftArrow = new cc.Sprite(res.TeacherTask.hw_arrow_Leftsmall);
        leftArrow.attr({
            anchorX:1,
            x:this.width - 32,
            y:this.height * 0.5,
        });
        this.addChild(leftArrow);

        this.levelLabel = new cc.LabelTTF("无", "Arial", 30);
        this.levelLabel.anchorX = 1;
        this.levelLabel.anchorY = 0.5;
        this.levelLabel.x = leftArrow.x - leftArrow.width - 50;
        this.levelLabel.y = this.height * 0.5;
        this.levelLabel.color = cc.color(183, 183, 183);
        this.addChild(this.levelLabel);

        this.addEventListener();
    }, 
    */

    handleGameClick: function (delegate, handleClick) {
        this._delegateClick = delegate;
        this._handleClick = handleClick;
    },

    setLevelLabelText: function (levelString, color, fontSize) {
        this.levelLabel.setString(levelString);
        this.levelLabel.color = color;
        this.levelLabel.setFontSize(fontSize);
    },

});
