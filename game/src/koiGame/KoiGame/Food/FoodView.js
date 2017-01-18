var FoodView = cc.Node.extend(
{
    /** @lends FoodView.prototype */

    _foodHolder:null,
    _food:null,
    //_foodTemp:null,
    _basePos:null,
    _controller:null,
    _readyFunc:null,
    _timerBar:null,

    _centerContainer:null,
    _pipContainer:null,
    _pipHolder:null,
    _pips:null,
    _pipsUsed:null,
    _foodTimer:null,
    _foodLocked:null,
    _foodPos:null,

    _parentView:null,

    pWt:null,
    pHt:null,

    viewHeight : 0,
    ctor:function(controller)
    {
        this._super();
        this._controller = controller;
    },

    layoutFood:function(parentView)
    {
        this._parentView = parentView;

        this._centerContainer = new LumositySprite(res.koiGame.food_centerContainer);
        this._centerContainer.setAnchorPoint(cc.p(0.0, 0.0));

        var cHt = this._centerContainer._sprite.getContentSize().height;
        var cWt = this._centerContainer._sprite.getContentSize().width;

        var cSX = 1;// * parentView.foodUI.getScaleX()/ cWt;    // XXX WHAT FUNSIES
        var cSY = 1;//  * parentView.foodUI.getScaleY()/ cHt;   // XXX FIGURE OUT A WAY TO NOT HARDCODE
        this._centerContainer.setScaleX(cSX);
        this._centerContainer.setScaleY(cSY);

        cHt = cHt * cSX;
        cWt = cWt * cSY;

        this.addChild(this._centerContainer);

        this._pipContainer = new LumositySprite(res.koiGame.food_pipContainer);
        this._pipContainer.setAnchorPoint(cc.p(0.5,1.0));
        this.pHt = this._pipContainer._sprite.getContentSize().height;
        this.pWt = this._pipContainer._sprite.getContentSize().width;

        var sX = 1;// * parentView.foodUI.getScaleX()/ this.pWt; // XXX FIGURE OUT A WAY TO NOT HARDCODE
        var sY = 1;//  * parentView.foodUI.getScaleY()/ this.pHt; // XXX FIGURE OUT A WAY TO NOT HARDCODE
        this._pipContainer.setScaleX(sX);
        this._pipContainer.setScaleY(sY);

        this.pHt = this.pHt * sY;
        this.pWt = this.pWt * sX;

        this.viewHeight = cHt + this.pHt;

        this._basePos = cc.p(0,  this.pHt + cHt * 0.5 );
        this._centerContainer.setPosition(cc.p(this.pWt * 0.5 - cWt *0.5, this.pHt));

        this._pipHolder = new cc.Node();
        this._pipHolder.addChild(this._pipContainer);
        this._pipHolder.setPosition(cc.p(this.pWt * 0.5, this.pHt));
        this.addChild(this._pipHolder);

        this._foodHolder = new cc.Node();
        this._foodHolder.setAnchorPoint(cc.p(0.5, 0.5)) ;
        this._food = new LumositySprite( res.koiGame.foodUnlocked );

        var endIndex = this._controller.model._foodColorList.length-1;

        this._food._sprite.setColor(this._controller.model._foodColorList[endIndex]);

        this._food.setAnchorPoint( cc.p( 0.5, 0.5 ) );
        var fW = this._food._sprite.getContentSize().width;
        var fH = this._food._sprite.getContentSize().height;

        // design_Scale * parentScale / exporter_Scale
        var fX = 1;// * parentView.foodUI.getScaleX() / fW; // XXX FIGURE OUT A WAY TO NOT HARDCODE
        var fY = 1;// * parentView.foodUI.getScaleX() / fH; // XXX FIGURE OUT A WAY TO NOT HARDCODE

        this._food.setScaleX(fX);
        this._food.setScaleY(fY);

        fW = fW * fX;
        fH = fH * fY;

        this._foodPos = cc.p(this.pWt * 0.5 , this.pHt + fH * 0.5);

        this._foodHolder.addChild(this._food);
        this.addChild(this._foodHolder,5);

        this._foodLocked = new LumositySprite( res.koiGame.foodLocked );
        this._foodLocked.setAnchorPoint( cc.p( 0.5, 0.5 ) );
        this._foodLocked.setPosition(this._foodPos);
        this._foodLocked.setScaleX(fX);
        this._foodLocked.setScaleY(fY);
        this.addChild(this._foodLocked);

        this._foodLocked._sprite.setColor(this._controller.model._foodColorList[endIndex]);

        this._foodTimer = new FoodAnimatedView();
        this._foodTimer.setPosition(this._foodPos);
        this._foodTimer.setScaleX(fX);
        this._foodTimer.setScaleY(fY);
        this.addChild(this._foodTimer);

        this._pips = new Array();
        this._pipsUsed = new Array();

    },

    onPause:function()
    {
        this._foodTimer.pause();
        this.pause();
        this._pausedTargets = cc.director.getActionManager().pauseAllRunningActions();
    },

    onResume:function()
    {
        this._foodTimer.resume();
        this.resume();

        cc.director.getActionManager().resumeTargets(this._pausedTargets);
    },

    nextLevel:function(numFish, parentView)
    {
        if(numFish == 1)
        {
            ll.verbose("BAAAAAD!!! need more than one fish");
        }

        // this stupidity to get the size
        var newPip = new LumositySprite(res.koiGame.food_pipRemaining);
        newPip.setAnchorPoint(cc.p(0.5, 0.5));
        var pW = newPip._sprite.getContentSize().width;
        var stepSize = pW * 1.8;/// (numFish + 1);

        var collectPos = 0;
        for(var i = 0; i < numFish; i++)
        {
            var newPip = new LumositySprite(res.koiGame.food_pipRemaining);
            newPip.setAnchorPoint(cc.p(0.5, 0.5));
            var newPipUsed = new LumositySprite(res.koiGame.food_pipUsed);
            newPipUsed.setAnchorPoint(cc.p(0.5, 0.5));
            var pos =  i *  stepSize;
            collectPos = pos;
            newPip.setPosition(cc.p(pos, this.pHt * 0.5));

            newPip._sprite.setColor(this._controller.model._foodColorList[i]);

            newPipUsed.setPosition(cc.p(pos, this.pHt * 0.5));
            this.addChild(newPipUsed);
            this.addChild(newPip);
            this._pips.push(newPip);
            this._pipsUsed.push(newPipUsed);
        }

        var startPos = this.pWt * 0.5 - collectPos * 0.5 ;
        for(var i = 0; i < numFish; i++)
        {
            var pos = this._pips[i].getPosition();
            this._pips[i].setPosition(cc.p(pos.x + startPos, pos.y));
            this._pipsUsed[i].setPosition(cc.p(pos.x + startPos, pos.y));
        }

        this._pipsUsed = this._pips.length;

        var scaleFactor = (collectPos + pW * 2) / this.pWt;
        if(scaleFactor > 1)
        {
            this._pipHolder.runAction(cc.ScaleTo.create(1, scaleFactor, 1));
        }

    },

    _ready:function()
    {
        this._controller.model._state = FoodStates.Ready;
    },

    backToBase:function()
    {
        this._readyFunc =  cc.CallFunc.create(this._ready.bind(this), this);
        var mv = cc.EaseBounceOut.create(cc.MoveTo.create(0.4, this._foodPos));
        var seq = cc.Sequence.create(mv, this._readyFunc);
        this._foodHolder.runAction(seq);
    },

    reset:function()
    {
        this._foodHolder.runAction(cc.Place.create( this._foodPos));
    },

    setFoodTimerColor : function(){
        // this._foodTimer._sprite.setColor(this._controller.model._foodColorList[this._pipsUsed-1]);

        this._foodLocked._sprite.setColor(this._controller.model._foodColorList[this._pipsUsed-1]);        
        this._food._sprite.setColor(this._controller.model._foodColorList[this._pipsUsed-1]);
    },

    onExit : function(){
        this._super();
    },
} );