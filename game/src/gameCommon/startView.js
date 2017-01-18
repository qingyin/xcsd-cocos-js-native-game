
var StartView = cc.LayerColor.extend({
    ctor:function (args) {
        // this.setName('StartView');
        this._super();
        this._args = {};
        this._args.level = args.level;
        this._args.gameID = args.gameID;
        this.viewConfig = VIEW_CONFIG[String(args.gameID)];
        cc.log(" ---- start ---- ", args.gameID);
        this._args.type = UNIT_CONFIG[String(args.gameID)].type;

        this.color = this.viewConfig.bg_color;
        this.init(); 
        return true;
    },
    init:function(){
        this.initTop();
        this.initCenter();
    },
    initTop:function(){
        var size = cc.winSize;
        this.topView = new CommonTopBack();
        this.addChild(this.topView);
        // this.topView.addHelp();
        // this.topView.setHandleHelp(this, this.topHelpClick);
    },
    topHelpClick: function (self) {
        self._handleHelp(self._delegateHelp);
        // var args = {
        //     gameID : self._args.gameID,
        // }
        // self.addHelpView = function () {
        //     var helpView = new HelpView(args);
        //     self.addChild(helpView);
        // }
        // var helpRes = res.gameHelp[args.gameID];
        // LoadResource.loadingResourses(helpRes, self, self.addHelpView);
        
    }, 

    setHelpHandle: function (delegate, handle) {
        this._delegateHelp = delegate;
        this._handleHelp = handle;
    },

    initCenter:function(){
        var size = cc.winSize;
        this.panel = new cc.Sprite(res.game_panel_start);
        var color = this.viewConfig.mainColor;
        this.addChild(this.panel);
        this.panel.attr({
            x:size.width*0.5,
            y:size.height*0.5,
        });

        var lblGameName = new cc.LabelTTF();
        lblGameName.attr({
            string:this.viewConfig.gameName,
            fontName:'Arial',
            fontSize:36,
            anchorPoint:cc.p(0.5,1),
            x:this.panel.width/2,
            y:this.panel.height-40,
            color:cc.color(color.r,color.g,color.b,color.Opacity),
        });
        this.panel.addChild(lblGameName);
        //cc.log('lblGameName',lblGameName.y,lblGameName.height,lblGameName);

        var lblLevel = new cc.LabelTTF();
        var lv = this._args.type + ' 第'+this._args.level+'关';
        lblLevel.attr({
            string:lv,
            fontName:'Arial',
            fontSize:30,
            anchorPoint:cc.p(0.5,1),
            x:this.panel.width/2,
            y:lblGameName.y-lblGameName.height-20,
            color:cc.color(172,172,172),
        });
        this.panel.addChild(lblLevel);

        var spriteCup = new cc.Sprite(res.game_start_cup);
        spriteCup.attr({
            x:this.panel.width*0.5,
            y:this.panel.height*0.5,
            color:cc.color(this.viewConfig.cupColor),
        });
        this.panel.addChild(spriteCup);

        var lblPassTag = new cc.LabelTTF();
        lblPassTag.attr({
            string:"通关目标",
            fontName:'Arial',
            fontSize:36,
            anchorPoint:cc.p(0.5,1),
            x:this.panel.width/2,
            y:((this.panel.height - 153) + (spriteCup.y + spriteCup.height*0.5)) * 0.5,
            color:cc.color(34,34,34),
        });
        this.panel.addChild(lblPassTag);

        this.btnStart = new ccui.Button();
        this.btnStart.loadTextures(res.game_btn_long_n,res.game_btn_long_s,'');        
        this.btnStart.attr({
            titleText:'开始游戏',
            titleFontSize:45,
            titleFontName:'Arial',
            titileColor:cc.color(255,255,255,255),
            anchorPoint:cc.p(0.5,0),
            x:this.panel.width*0.5,
            y:0,
            name:'start'
        });
        this.panel.addChild(this.btnStart);
        
        platformFun.setBtnPicColor(this.btnStart,color);
        // this.btnStart._buttonNormalRenderer.color = color;
        // this.btnStart._buttonClickedRenderer.color = color;


        var lblTargetText = new cc.LabelTTF();
        var _posY = (spriteCup.y - spriteCup.height*0.5)*0.5 + this.btnStart.height*0.5-20;
        lblTargetText.attr({
            string:this.getPassTargetText(this._args.gameID,this._args.level),
            fontName:'Arial',
            fontSize:30,
            anchorPoint:cc.p(0.5,1),
            x:this.panel.width/2,
            y:_posY,
            color:cc.color(color.r,color.g,color.b,color.Opacity),
        });
        this.panel.addChild(lblTargetText);

        cc.eventManager.addListener({
            event: cc.EventListener.TOUCH_ONE_BY_ONE,
            swallowTouches: false,
            onTouchBegan:function(touch, event){
                return true;},
        }, this);
    },
    setHandleStartGame:function(self,handle){
        this._delegate = self;
        this._handleStartGame = handle;

        var self = this;
        this.btnStart.addClickEventListener(function(){
            self._handleStartGame(self._delegate,self._args.level);
        });
    },
    setHandleBack:function(self,handle){
        this.topView.setHandleBack(self,handle);
    },

    getPassTargetText:function(gameId,level){
        var targetText = "",temp = "",temp2 = "";
        gameId = Number(gameId);
        level = String(level);
        switch(gameId){
            case 1 :{
                temp = dict_sg_level[level].get_star123_time[0];
                temp2 = dict_sg_level[level].round_id_list.length;             
                targetText = "在"+temp+"秒内给出"+temp2+"个正确答案";
                break;
            }
            case 2 :{
                temp = dict_number_level[level].star_term.oneStar;
                targetText = "最少解答"+temp+"题加法";
                break;
            }
            case 3 :{
                temp = dict_cm_level[level].limit_time;
                temp2 = dict_cm_level[level].star_term.oneStar;                
                targetText = "在"+temp+"秒内最少给出"+temp2+"个正确答案";
                break;
            }
            case 4 :{
                targetText = "统计与此模型相同的所有鱼的数量";
                break;
            }
            case 5 :{
                temp = dict_pm_level[level].round_id_list.length-2;
                targetText = "最少给出"+temp+"个正确答案";
                break;
            }
            case 6 :{
                temp = dict_nw_level[level].round_id_list.length-2;
                targetText = "最少给出"+temp+"个正确答案";
                break;
            }
            case 7 :{
                temp = dict_sp_level[level].limit_time;
                targetText = "在"+temp+"秒内完成拼图";
                break;
            }
            case 8 :{
                temp = dict_sc_level[level].countDown;
                temp2 = dict_sc_level[level].starCondition[0];  
                targetText = "在"+temp+"秒内最少给出"+temp2+"个正确答案";
                break;
            }
            case 9 :{
                temp = dict_pp_level[level].round_id_list.length-2;
                targetText = "最少画出"+temp+"条路";
                break;
            }
            case 10 :{
                temp = dict_cm_level[level].limit_time;
                temp2 = dict_cm_level[level].star_term.oneStar;                
                targetText = "在"+temp+"秒内最少给出"+temp2+"个正确答案";
                break;
            }
            case 11 :{
                var _levelConf = new PlayingKoiLevelSettings();
                var levelConf = _levelConf.getLevelConfig(level);
                temp = levelConf[_levelConf.keyName.level_round_num]-2;
                targetText = "最少正确完成"+temp+"次喂鱼任务";
                break;
            }
        }
        return targetText;
    },


});