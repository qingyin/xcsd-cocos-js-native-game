
//var PlayingKoiView = cc.Layer.extend({//BaseBG
//var PlayingKoiView = BaseBG.extend({//BaseBG
var PlayingKoiView = cc.Node.extend({
    pond : null,
    pondController : null,
    _food : null,
    _kois : null,
    _distractors:null,
    settings : null,
    model : null,
    controller : null,
    _containerView : null,//容器视图
    _gameOpenTipLayer : null,

    tintSprite: null,

    _koi : null,
    _koiLength : null,

    tintHUD:false,

    fadeTimer:0,
    fadeSeconds:3,

    musicFaderO:1,
    musicFaderI:0,
    fadeOutBGMusic:false,
    fadeInBGMusic:false,

    loonCtr: 0,
    randLoonTime:0,

    _center: null, // lame copy
    _dW:null, // design width
    _dH:null,  // design height

    koiRotator: null,
    winTimer:0,
    doingWinAnim:0,
    doingLoseAnim:0,
    loseTimer:0,

    shaders: null,

    rippleHolder: null,
    ripple: null,

    hudColors: null,

    foodWrongAnim: null,

    playingFoodNo:false,
    
    currentAlpha:0,
    pondMoveOutTime : 0.8,

    ctor:function ( settings, model,controller) {
        this._super();
        this.settings = settings;
        this.model = model;
        this.controller = controller;

        this.initData();
        this.initView();

        this.scheduleUpdate();
    },
    initData : function(){        
        this._koiLength = 154;

        this.koiRotator = 0;
        this.winTimer = 0;
        this.doingWinAnim = 0;
        this.doingLoseAnim = 0;
        this.loseTimer = 0;
        this.randLoonTime = 5 + Math.random()*50;


        this._dW = AppConfig.w;
        //this._dH = AppConfig.h;
        this._dH = AppConfig.fishRangeH;

        //this._center = cc.p(this._dW * 0.5, this._dH * 0.5);
        this._center = cc.p(this._dW * 0.5, AppConfig.h * 0.5);
        
        this.hudColors = new Array();
        this.hudColors.push(cc.color(50, 83, 0, 255));
        this.hudColors.push(cc.color(0, 82, 95, 255));
        this.hudColors.push(cc.color(0, 67, 59, 255));
        this.hudColors.push(cc.color(3, 61, 99, 255));
        this.hudColors.push(cc.color(0, 20, 78, 255));

        this.shaders = [];
        for (var i = 0; i < 1; i++) {
        //for (var i = 0; i < 5; i++) {
            var num = this.settings.fishShaderOrder[i];
            var shader = new cc.GLProgram('res/koiGame/Shaders/fish.vsh', "res/koiGame/Shaders/fish" + num + ".fsh");
            shader.retain();  // XXX must release!
            shader.addAttribute(cc.ATTRIBUTE_NAME_POSITION, cc.VERTEX_ATTRIB_POSITION);
            shader.addAttribute(cc.ATTRIBUTE_NAME_COLOR, cc.VERTEX_ATTRIB_COLOR);
            shader.addAttribute(cc.ATTRIBUTE_NAME_TEX_COORD, cc.VERTEX_ATTRIB_TEX_COORDS);
            shader.link();
            shader.updateUniforms();

            this.shaders.push(shader);
        }
    },
    initView : function(){
        this._containerView = new cc.Node();
        this.addChild(this._containerView,1);

        //this._bgSprite = new cc.Sprite(res.koiGame.background_jpg);
        this._bgSprite = new cc.Sprite(res.koiGame.fish_shade);
        var size = this._bgSprite.getContentSize();
        this._bgSprite.attr({
            anchorX:0,
            anchorY:0,
            scale : AppConfig.scaleX,
            // scaleX:cc.winSize.width/size.width,
            // scaleY:cc.winSize.height/size.height,
        });
        this._containerView.addChild(this._bgSprite,PondLayerIndex.kLayerBGSprite);
                
        this._createTintSprite();
        this._createPond();

        this._createRipple();
        this._createFoodWrongAnim();

        this._createGameTopTip();
        this._createGuideUI();
    },
    _createGuideUI : function(){
        this._createGuideUI = new GuideController();        
        this._containerView.addChild(this._createGuideUI,PondLayerIndex.kLayerGuideUI);
    },
    _createGameTopTip : function(){
        // this._containerView.addChild(this._gameTopHudWidgt,PondLayerIndex.kLayerHudTip);

        this._topWidget = new CommonTopPauseProgress();
        this._topWidget.addColorBGLayer();
        if(this.model.isGuide) {
            this._topWidget.addDeleteColorShadeLayer(true);
            this._topWidget.setBtnPauseEnable(false);
        }else{
            this._topWidget.addDeleteColorShadeLayer(false);
            this._topWidget.setBtnPauseEnable(true);            
        }

        this._topWidget.setVisible(false);
        this._containerView.addChild(this._topWidget,PondLayerIndex.kLayerHudTip);
    },
    _createTintSprite : function(){
        this.tintSprite = new LumositySprite(res.koiGame.tint);
        var c = this.settings.pondTints[this.model.assetIndex];
        this.tintSprite._sprite.setColor(cc.color(c[0], c[1], c[2]));
        this.tintSprite._sprite.setOpacity(c[3]);
        this.tintSprite.setLocalZOrder(2);
        var dw = this.tintSprite.getContentSize().width;
        var dh = this.tintSprite.getContentSize().height;
        this.tintSprite.setScale(AppConfig.w / dw, AppConfig.h / dh);

        this._containerView.addChild(this.tintSprite,PondLayerIndex.kLayerTintSprite);
    },

    makeNewLevel : function(){
        this._createFood();
        this._kois = new Array();

        for(var i= 0; i < this.model._numFish; i++)
        {
            this._addKoi();
        }

        this._createDistractors();
    },    

    _createFood : function(){
        var colorList = this.model.getColorList();
        var colorValueList = this.model.getColorValueList();
        this._food = new FoodController(this,colorList,colorValueList);
        this._food.model._spawnTime = this.model._spawnTime;
        this._food.view.nextLevel(this.model._numFish, this); 
        
        this._containerView.addChild(this._food.view,PondLayerIndex.kLayerFoodUI);
        var currPos = this._food.view.getPosition();
        this._food.view.setPosition(currPos.x,currPos.y-this._food.view.viewHeight);
        //this.doFoodViewInAnim();
        // this._food.view.setScaleX(1 / (this.foodUI.getScaleX()));
        // this._food.view.setScaleY(1 / (this.foodUI.getScaleY()));
    },

    _addKoi : function(){
        var w = this._dW;
        var h = this._dH;

        var padW = this._koiLength * 0.8;
        var padL = this._koiLength * 0.8;
        var tooClose = false;
        var randP = null;
        var numTries = 1000;
        do {
            randP = cc.p(padW + Math.random() * (w - 2 * padW), padL + Math.random() * (h - 2 * padL));
            tooClose = false;
            for (var i = 0; i < this._kois.length; i++) {
                var d = this._dist(randP, this._kois[i].view._currPos);
                if (d < this._koiLength) {
                    tooClose = true;
                    break;
                }
            }
            numTries = numTries - 1;
            if(numTries <= 0)
            {
                //ll.verbose("BROKE OUT");
                break;
            }
        }while(tooClose)

        // not used any more
        var outpos = cc.p(0,0);
        var fishID = this._kois.length;
        //cc.log("new KoiController-this",this);

        var fishColor = this.model.getColorList()[fishID];
        var fishColorValue = this.model.getColorValueList()[fishID];
        var newKoi = new KoiController(this, fishID, randP, outpos, this._koiLength,fishColor,fishColorValue);
        newKoi.init();
        newKoi.view.setAnchorPoint(cc.p(0.5, 0.5));

        //newKoi.view._animatedView._sprite.setShaderProgram(this.shaders[this.model.assetIndex]);
        newKoi.view._animatedView._sprite.setShaderProgram(this.shaders[0]);
        
        this.pond.addChild(newKoi.view, Layers.kLayerFish);

        this._kois.push(newKoi);
        this.model.md_numFish = this.model.md_numFish + 1;
    },

    _createFoodWrongAnim : function () {
        this.foodWrongAnim = new FoodAnimatedView();
        this.foodWrongAnim.runAction(cc.Hide.create());
        this.pond.addChild(this.foodWrongAnim, Layers.kLayerFish);
    },
    _createRipple : function () {
        this.ripple = new LumositySprite(res.koiGame.ripple);
        this.ripple.setAnchorPoint(cc.p(0.5, 0.5));

        this.rippleHolder = new cc.Node();
        this.rippleHolder.setAnchorPoint(cc.p(0.5, 0.5));
        this.rippleHolder.addChild(this.ripple);
        this.pond.addChild(this.rippleHolder, Layers.kLayerRipples);
        //this.rippleHolder.runAction(cc.Hide.create());
        this.rippleHolder.setVisible(false);
    },

    _createPond : function(){
        this.pondController = new PondController(this.settings,1);
        this.pond = this.pondController.view;
        this._containerView.addChild(this.pond,PondLayerIndex.kLayerPondScene);

        this.pond.setPositionY(AppConfig.h);
        this.currentAlpha = 0;
    },

    _createDistractors:function()
    {
        this._distractors = [];
        if(this.model.assetIndex === 0)
        {
            // raindrops
            for(var i =0 ;i < 5; i++) {
                var r = new DistractorView(this, DistractorTypes.raindrop);
                r.init();
                this._distractors.push(r);
                this.pond.addChild(r, Layers.kLayerRaindrops);
            }
        }
        else if(this.model.assetIndex === 1)
        {
            for(var i =0 ;i < 2; i++) {
                this.model.md_roundDistractors = this.model.md_roundDistractors + 1;
                var r = new DistractorView(this, DistractorTypes.dragonfly);
                r.init();
                this._distractors.push(r);
                this.pond.addChild(r, Layers.kLayerDragonfly);
            }
        }
        else if(this.model.assetIndex === 2)
        {
            for(var i =0 ;i < 2; i++) {
                this.model.md_roundDistractors = this.model.md_roundDistractors + 1;
                var r = new DistractorView(this, DistractorTypes.bottomfeeder);
                r.init();
                this._distractors.push(r);
                this.pond.addChild(r, Layers.kLayerBottomFeeder);
            }
        }
        else if(this.model.assetIndex === 3)
        {
            for(var i =0 ;i < 3; i++) {
                this.model.md_roundDistractors = this.model.md_roundDistractors + 1;
                var r = new DistractorView(this, DistractorTypes.bottomfeeder);
                r.init();
                this._distractors.push(r);
                this.pond.addChild(r, Layers.kLayerBottomFeeder);
            }

            for(var i =0 ;i < 5; i++) {
                var r = new DistractorView(this, DistractorTypes.raindrop);
                r.init();
                this._distractors.push(r);
                this.pond.addChild(r, Layers.kLayerRaindrops);
            }
        }
        else if(this.model.assetIndex === 4)
        {
            for(var i =0 ;i < 2; i++) {
                var r = new DistractorView(this, DistractorTypes.firefly);
                r.init();
                this._distractors.push(r);
                this.pond.addChild(r, Layers.kLayerFirefly);
            }
            for(var i =0 ;i < 3; i++) {
                this.model.md_roundDistractors = this.model.md_roundDistractors + 1;
                var r = new DistractorView(this, DistractorTypes.bottomfeeder);
                r.init();
                this._distractors.push(r);
                this.pond.addChild(r, Layers.kLayerBottomFeeder);
            }
        }
        else
        {
            ll.verbose("BAD ASSET INDEX " + this.model.assetIndex);
        }
    },


    update : function(delta){
        this.updateView(delta);
    },
    updateView : function(delta){
        //cc.log("updateView---");
        if(this.model.isGuideTipReadyCountDown){
            this.model.guideTipReadyDisplayTime = this.model.guideTipReadyDisplayTime + delta;
            if (this.model.guideTipReadyDisplayTime > this.model.guideTipReadyDisplayTimeTotal) {
          
                this.model.isGuideTipReadyCountDown = false;
                this.model.guideTipReadyDisplayTime = 0;
                this._createGuideUI.goalTip();
                //鱼静止
                for(var i = 0; i < this._kois.length; i++)
                {
                    this.model.isAllFishStandstill = true;
                    this._kois[i].view._koiHolder.pause();

                    //this._kois[i].view.stopAllActions();
                    //this._kois[i].view.onPause();
                }
                var pos = this._kois[this._kois.length-1].view._koiHolder.getPosition();
                //this.pond.setGuideHand(pos);
                this._createGuideUI.setGuideHand(pos);
                this._kois[this._kois.length-1].setFishCanClick(true);
            }
        }
        if (this.model.isPointToNextFish) {
            this.model.guideTipReadyDisplayTime = this.model.guideTipReadyDisplayTime + delta;
            if (this.model.guideTipReadyDisplayTime > 2) {
                this.model.isPointToNextFish = false;
                this.model.guideTipReadyDisplayTime = 0;
                
                this._createGuideUI.goalTip();
                var index = this.model._numFish - this.model._fishMarked - 1;
                this._kois[index].setFishCanClick(true);

                var pos = this._kois[index].view._koiHolder.getPosition();
                this._createGuideUI.setGuideHand(pos);
            }
        }

        if(this.pond)
        {
            if( this.currentAlpha < 255 )
            {
                this.currentAlpha = this.currentAlpha + Math.min(30, delta * 100);
                if(this.currentAlpha > 255)
                {
                    this.currentAlpha = 255;
                }
                this.recursiveAlphaChildren(this.pond, this.currentAlpha);
            }
        }
        if(this.tintHUD)
        {
            if(this.model.assetIndex >= 1) {
                this.fadeTimer = this.fadeTimer + delta;
                var p = this.hudColors[this.model.assetIndex-1];
                var n = this.hudColors[this.model.assetIndex-1];
                if(this.fadeTimer > this.fadeSeconds)
                {
                    this.fadeTimer = this.fadeSeconds;
                }
                var t = this.fadeTimer / this.fadeSeconds;
                var rLerp = LumosityMath.lerp(t, p.r, n.r);
                var gLerp = LumosityMath.lerp(t, p.g, n.g);
                var bLerp = LumosityMath.lerp(t, p.b, n.b);

                //this._gameTopHudWidgt.setTextColor(cc.color(rLerp, gLerp, bLerp, 255));
                if(this.fadeTimer >= this.fadeSeconds) {
                    this.tintHUD = false;
                    this.fadeTimer = 0;
                }
            }
            else if(this.model.assetIndex === 0)
            {
                //this._gameTopHudWidgt.setTextColor(this.hudColors[this.model.assetIndex]);
                this.tinHUD = false;
            }
        }

        if(this.fadeOutBGMusic)
        {
            cc.audioEngine.setMusicVolume(this.musicFaderO);
            this.musicFaderO = this.musicFaderO - delta;
            if(this.musicFaderO <= 0)
            {
                this.fadeOutBGMusic = false;
                this.fadeInBGMusic = true;
                this.musicFaderO = 1;
                //cc.audioEngine.playMusic("res/koiGame/sounds/PlayingKoi_Level" + (this.model.assetIndex + 1) + "_amb_lp.m4a", true);
            }
        }
        if(this.fadeInBGMusic)
        {
            cc.audioEngine.setMusicVolume(this.musicFaderI);
            this.musicFaderI = this.musicFaderI + delta;
            if(this.musicFaderI >= 1)
            {
                this.fadeInBGMusic = false;
                this.musicFaderI = 0;
                cc.audioEngine.setMusicVolume(1);
            }
        }
        if(this._kois === null) {
            return;
        }


        for(var i = 0; i < this._kois.length; i++)
        {
            this._kois[i].updateView(delta);
        }

        if(this._distractors !== null) {
            for (var i = 0; i < this._distractors.length; i++) {
                this._distractors[i].updateView(delta);
            }
        }

        if(this._food !== null) {
            this._food.update(delta);
        }
        this.koiRotator = this.koiRotator + delta * 60;

        if(this.model.assetIndex === 3)
        {
            this.loonCtr = this.loonCtr + delta;
            if(this.loonCtr > this.randLoonTime)
            {
                //cc.audioEngine.playEffect("res/koiGame/sounds/PlayingKoi_Level4_amb_loon.mp3");
                this.loonCtr = 0;
                this.randLoonTime = 5 + Math.random()* 50;
            }
        }

        /*
        if(this.doingWinAnim === 1)
        {
            this.winTimer = this.winTimer + delta;
            if(this.winTimer > 3)
            {
                this.winTimer = 0;
                this.doSwimOut();
                this.doingWinAnim =0;
            }
        }

        if(this.doingLoseAnim === 1)
        {
            this.loseTimer = this.loseTimer + delta;
            if(this.loseTimer > 3)
            {
                this.loseTimer = 0;
                this.doingLoseAnim = 0;
                this.doSwimOutLose();
            }
        }*/

    },

    // XXX me being stupid (does cc not have this?)
    _dist: function (p1, p2) {
        return Math.sqrt((p2.x - p1.x) * (p2.x - p1.x) + (p2.y - p1.y) * (p2.y - p1.y));
    },

    onClick: function (hitFishId,fishColorValue)
    {
        var mark = 0;
        if(this._food === null)
        {
            return mark;
        }
        //cc.log("this._food.model._state---=",this._food.model._state);

        if(this._food.model._state == FoodStates.None)
        {
            return mark;
        }

        if(this._food.model._state == FoodStates.Processing)
        {
            this.model.md_roundNumClicks = this.model.md_roundNumClicks + 1;
            this.model.md_numClicks = this.model.md_numClicks + 1;
            this.model.md_trialNumClicks = this.model.md_trialNumClicks + 1;
            this.playFoodNo();
            return mark;
        }
        if (this.model.isGuide && this.model.assetIndex === 0) {
            if(this._kois[hitFishId].getFishCanClick() === false){
                return mark;
            }
        }

        //cc.log("this._food.model._state==---",this._food.model._state);
        if(this._food.model._state == FoodStates.Ready || this._food.model._state == FoodStates.Dragging)
        {
            this.model.md_trialFishId = hitFishId;
            mark = 1; // hit but incorrect
            var isFoodCorrect = false;
            var foodColorValue = this.model.getColorValueList()[this._food.getFoodRemainNum()-1];                        
            if(this._kois[hitFishId].model._hit === 0 && foodColorValue === fishColorValue) {
                mark = 2; // hit but correct
                isFoodCorrect = true;
            }
            this._food.jumpToFish(this._kois[hitFishId].view,isFoodCorrect);
            this.model.isDataFull = false;
            //cc.audioEngine.playEffect("res/koiGame/sounds/PlayingKoi_feedfish.mp3");

            if (this.model.isGuide && this.model.assetIndex === 0) {                
                this._createGuideUI.removeHandleSprite();
                this._kois[hitFishId].setFishCanClick(false);
            }            
        }
        else
        {
            mark = -1; // ignore this click
        }
        return mark;
    },

    playFoodNo: function()
    {
        if(this.playingFoodNo)
        {
            ll.verbose("STILL PLAYING");
            return;
        }
        else
        {
            // matching anim timings and offsets
            // from flash file for raindrops2
            this.playingFoodNo = true;
            var t1 = 1 / 15.0;
            var t2 = 2 * t1;
            var sc = this.settings.foodShakeScale * this._dW/640;
            var off1 = cc.p(10 *sc,0);
            var off2 = cc.p(-18 * sc,0);
            var off3 = cc.p(14 * sc,0);
            var off4 = cc.p(-10 * sc,0);
            var off5 = cc.p(6 * sc,0);
            var off6 = cc.p(-2 * sc,0);
            var mv1 = cc.EaseInOut.create(cc.MoveBy.create( t1, off1), 3);
            var mv2 = cc.EaseInOut.create(cc.MoveBy.create( t2, off2), 3);
            var mv3 = cc.EaseInOut.create(cc.MoveBy.create( t2, off3), 3);
            var mv4 = cc.EaseInOut.create(cc.MoveBy.create( t2, off4), 3);
            var mv5 = cc.EaseInOut.create(cc.MoveBy.create( t2, off5), 3);
            var mv6 = cc.EaseInOut.create(cc.MoveBy.create( t2, off6), 3);

            var cb = cc.CallFunc.create( this.resetFoodAnim, this );

            var sq = cc.Sequence.create(mv1, mv2, mv3, mv4, mv5, mv6, cb);
            this._food.view.runAction(sq);
        }
    },

    resetFoodAnim:function()
    {
        this.playingFoodNo = false;
    },
    startTrialCue: function () {
        this._food._popFood();
    },

    setScore: function (sType) {
        //this._gameTopHudWidgt.setScore(this.model.score);
    },

    randomPtOffScreen: function(radMult)
    {
        if(!radMult)
        {
            radMult = 1.5;
        }
        var w = this._dW;
        var h = this._dH;
        var center = cc.p(w *0.5, h*0.5);

        var randAng = Math.random() * 360 * Math.PI / 180;
        var rad = radMult * Math.sqrt(w * w + h * h) ;
        var newPt = cc.p(center.x + rad * Math.cos(randAng), center.y + rad * Math.sin(randAng));
        //ll.verbose(",,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,, " + newPt.x + "  "  + newPt.y);
        return newPt;
    },

    doSwimOut: function()
    {
        for(var i = 0; i < this._kois.length; i++)
        {
            var pt = this.randomPtOffScreen();
            this._kois[i].view.swimOut();
        }
    },

    doSwimOutLose: function()
    {
        for(var i = 0; i < this._kois.length; i++)
        {
            var pt = this.randomPtOffScreen();
            this._kois[i].view.swimOutLose(pt.x, pt.y);
        }
    },
    doWinAnim: function()
    {
        this.winTimer = 0;
        this.doingWinAnim = 1;
         for(var i = 0; i < this._kois.length; i++)
         {
             this._kois[i].view.changeCourse();
         }
    },

    doFoodViewOutAnim: function()
    {
        var currPos = this._food.view.getPosition();
        var seq = cc.EaseInOut.create(cc.MoveTo.create(0.5, cc.p(currPos.x, currPos.y - this._food.view.  viewHeight)), 21);
        this._food.view.runAction(seq);
    },
    doFoodViewInAnim : function(){
        var currPos = this._food.view.getPosition();
        var seq = cc.EaseInOut.create(cc.MoveTo.create(0.5, cc.p(currPos.x, currPos.y + this._food.view.viewHeight)), 21);
        this._food.view.runAction(seq);
    },
    setProgressState : function(index,isWin){        
        var state = (isWin === true) ? this._topWidget._RIGHT : this._topWidget._WRONG;
        this._topWidget.setProgressState(index-1,state);
    },

    nextLevel: function (level, trialIndex, trialNum) {
        if (trialIndex === 1) {
            this._topWidget.createPassProgress(trialNum);
        }
        this._topWidget.setProgressState(trialIndex-1,this._topWidget._CURRENT);
    },

    recursiveAlphaChildren:function(node, alpha) {
        if (node.getChildrenCount() === 0) {
            if(node.setOpacity) {
                node.setOpacity(alpha);
            }
        }
        else {
            var children = node.getChildren();
            for (var i = 0; i < children.length; i++) {
                this.recursiveAlphaChildren(children[i], alpha);
            }
        }
    },

    transitionPondColorCue: function () {
        var c = this.settings.pondTints[this.model.assetIndex];
        var t = cc.TintTo.create(this.settings.pondTintTransitionTime, c[0], c[1], c[2]);
        var f = cc.FadeTo.create(this.settings.pondTintTransitionTime, c[3]);
        this.tintSprite.runAction(t);
        this.tintSprite.runAction(f);

        this.tintHUD = true;
        this.fadeOutBGMusic = true;
    },

    onPause:function()
    {
        this.unscheduleUpdate();
        if(this._kois != null) {
            for (var i = 0; i < this._kois.length; i++)
            {
                this._kois[i].view.onPause();
            }
        }
        if(this._food != null) {
            this._food.view.onPause();
        }
        if(this._distractors != null) {
            for (var i = 0; i < this._distractors.length; i++)
            {
                this._distractors[i].onPause();
            }
        }

        this._pausedTargets = cc.director.getActionManager().pauseAllRunningActions();
    },
    onResume:function()
    {
        if(this._kois != null) {
            for (var i = 0; i < this._kois.length; i++)
            {
                this._kois[i].view.onResume();
            }
        }
        if(this._food != null) {
            if(this._food.model._state == FoodStates.Dragging)
            {
                this._food.backToBase();
            }
            this._food.view.onResume();
        }
        if(this._distractors != null) {
            for (var i = 0; i < this._distractors.length; i++)
            {
                this._distractors[i].onResume();
            }
        }
        if (this._pausedTargets) {
            cc.director.getActionManager().resumeTargets(this._pausedTargets);
            this._pausedTargets = null;
        }
        this.scheduleUpdate();
    },
    onRestart : function(){
        this.onResume();
        cc.director.getActionManager().removeAllActions();
        this.destroyLevel();
    },
    changePondSceneCue: function () {
        this.destroyLevel();

        var c = this.settings.pondTints[this.model.assetIndex];
        //this._bgSprite.setColor(cc.color(c[0], c[1], c[2]));

        this.pondController.view.setPondBGIndex(this.model.assetIndex+1);

        this.makeNewLevel();
    },

    showPond:function()
    {
        this.recursiveAlphaChildren(this.pond, 255);
    },

    destroyLevel: function()
    {
        // cleanup existing level
        if (this._food) {          
            //this.pond.removeChild(this._food.view);
            this._food.view.removeFromParent(true);
        }

        if (this._kois) {
            for (var i = 0; i < this._kois.length; i++) {
                this._kois[i].view.removeAllChildren();
                this._kois[i].view.removePondSprite();
                this.pond.removeChild(this._kois[i].view);
            }
        }

        if(this._distractors)
        {
            for (var i = 0; i < this._distractors.length; i++) {
                this._distractors[i].removeAllChildren();
                this.pond.removeChild(this._distractors[i]);
            }
        }

        this._distractors = null;
        this._food = null;
        this._kois = null;
    },

    setViewVisible:function(isVisible){
        this._topWidget.setVisible(isVisible);
        this.pond.setVisible(isVisible);
        if (this._food) {
            this._food.view.setVisible(isVisible);
        }

        if(this._kois){
            for(var i = 0; i < this._kois.length; i++)
            {
                this._kois[i].view.setVisible(isVisible);
            }
        }
        if(this._distractors){
            for (var i = 0; i < this._distractors.length; i++) {
                this._distractors[i].setVisible(isVisible);
            }
        }
    },
    doPondMoveOutAndMoveIn : function(callback){
        var time = this.pondMoveOutTime;
        var cb = cc.callFunc(callback,this);

        var fadeOut = cc.EaseInOut.create(cc.fadeOut(time),2);
        var moveOut = cc.EaseInOut.create(cc.moveBy(time,cc.p(0,-AppConfig.h)),2);
        var funFoodViewOut = cc.callFunc(this.doFoodViewOutAnim.bind(this),this);
        var spawnOut = cc.spawn(moveOut,fadeOut,funFoodViewOut);

        var openGameTipDisplayTime = 1.5;
        var cbIn = cc.callFunc(function(){
            this.pond.setPositionY(AppConfig.h);
            this._food.model._state = 1;
            this.setGameOpenTipInfo();
            
            this.model.isAllFishStandstill = false;
            this._gameOpenTipLayer.doEaseInOutAnim(this._gameOpenTipLayer,openGameTipDisplayTime);
        },this);

        var fadeIn = cc.EaseInOut.create(cc.fadeIn(time),2);
        var moveIn = cc.EaseInOut.create(cc.moveBy(time,cc.p(0,-AppConfig.h)),2);
        var spawnIn = cc.spawn(moveIn,fadeIn);

        var funFoodViewIn = cc.callFunc(this.doFoodViewInAnim.bind(this),this);

        var modelFun = cc.callFunc(function(){
            this.model.isGameReady = true;  
        },this);
        var seq = cc.sequence(spawnOut,cb,cbIn,cc.delayTime(openGameTipDisplayTime),spawnIn,funFoodViewIn,modelFun);
        this.pond.runAction(seq);
    },
    doPondMoveIn : function(callback,delayTime){
        var openGameTipDisplayTime = 1.5;
        var cb = cc.callFunc(callback,this);
        var cbIn = cc.callFunc(function(){
            var h = this._topWidget.getPositionY() + this._topWidget.topBg.height * AppConfig.scaleX;
            this._topWidget.setPositionY(h);
            this._topWidget.setVisible(true);
            if(this.model.isGuide) {
                this._topWidget.addDeleteColorShadeLayer(true);
                this._topWidget.setBtnPauseEnable(false);
            }else{
                this._topWidget.addDeleteColorShadeLayer(false);
                this._topWidget.setBtnPauseEnable(true);            
            }
            cc.log("---_topWidget----",this._topWidget.getPositionY(), this._topWidget.topBg.height);

            this.pond.setPositionY(AppConfig.h);
            this.pond.setVisible(true);
            this.setGameOpenTipInfo();
            this._gameOpenTipLayer.doEaseInOutAnim(this._gameOpenTipLayer,openGameTipDisplayTime);

        },this);

        var time = this.pondMoveOutTime;
        var fade = cc.EaseInOut.create(cc.fadeIn(time),2);
        var move = cc.EaseOut.create(cc.moveBy(time,cc.p(0,-AppConfig.h)),2);
        var spawn = cc.spawn(move,fade);

        var cbGuide = cc.callFunc(function(){
            if (this.model.isGuide && this.model.assetIndex === 0) {
                this._createGuideUI.sureGuide();
                this.model.isGuideTipReadyCountDown = true;
                this.model.guideTipReadyDisplayTime = 0;
                for(var i = 0; i < this._kois.length; i++)
                {
                    this._kois[i].setFishCanClick(false);
                }
            }else{
                this.model.isAllFishStandstill = false;
            }
            this.model.isGameReady = true;            
        },this);

        var funFoodViewIn = cc.callFunc(this.doFoodViewInAnim.bind(this),this);

        var topWidgetAnim = cc.callFunc(function(){
            var currPos = this._topWidget.getPosition();
            var seq = cc.EaseInOut.create(cc.MoveBy.create(0.5, cc.p(0,-this._topWidget.topBg.height * AppConfig.scaleX)), 21);
            this._topWidget.runAction(seq);
        },this);

        var seq = cc.sequence(cc.delayTime(delayTime),cb,cbIn,cc.delayTime(openGameTipDisplayTime),spawn,funFoodViewIn,cc.delayTime(0.5),topWidgetAnim,cc.delayTime(0.5),cbGuide);
        this.pond.runAction(seq);
    },

    doPondMoveOut : function(callback){
        var time = this.pondMoveOutTime;
        var cb = cc.callFunc(callback,this);

        var fadeOut = cc.EaseInOut.create(cc.fadeOut(time),2);
        var moveOut = cc.EaseInOut.create(cc.moveBy(time,cc.p(0,-AppConfig.h)),2);
        var funFoodViewOut = cc.callFunc(this.doFoodViewOutAnim.bind(this),this);
        var spawnOut = cc.spawn(moveOut,fadeOut,funFoodViewOut);

        var seq = cc.sequence(spawnOut,cb);
        this.pond.runAction(seq);
    },
    setGameOpenTipInfo : function(){
        if (this._gameOpenTipLayer) {
            this._gameOpenTipLayer.removeFromParent(true);
            this._gameOpenTipLayer = null;
        }
        this._gameOpenTipLayer = new GameOpenTipWidget();
        this._containerView.addChild(this._gameOpenTipLayer,PondLayerIndex.kLayerGameOpen);
        var h = this._gameOpenTipLayer._height*2;
        this._gameOpenTipLayer.setPosition(AppConfig.w_2,AppConfig.h_2+h);

        this._gameOpenTipLayer.setPondAndFish(this.model._trial,this.model._numFish);
    },
    randomPtOnScreen: function()
    {
        var w = this._dW;
        var h = this._dH;

        var padW = this._koiLength;
        var padL = this._koiLength * 1.6;
        var randP = cc.p(padW + Math.random() * (w - 2 * padW), padL + Math.random() * (h - 2 * padL));
        return randP;
     },

    onExit: function () {
        cc.log("PlayingKoiView  view   onExit");
        this._super();
        this.unscheduleUpdate();

        //cc.director.getActionManager().removeAllActions();
        this.destroyLevel();

        this.controller.onExit();
    },
});

 
