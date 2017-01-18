var FoodController = cc.Class.extend(
{
    settings: null,
    model: null,
    view: null,
    _popCtr:null,
    _targetPos:null,
    _targetFish:null,
    _allDone:null,
    _parentView:null,
    _isFoodCorrect : null,

    ctor: function( parentView,colorList,colorValueList )
    {
        this._parentView = parentView;
        this._createSettings( parentView.settings );
        this._createModel(colorList,colorValueList);
        this._createView();
        this.view.layoutFood(parentView);
        this.view.reset();

        //var posX = (cc.winSize.width - this.view._pipContainer.getContentSize().width) * 0.5;
        var posX = (AppConfig.w - this.view._pipContainer.getContentSize().width) * 0.5;
        this.view.setPositionX( posX);

        //this._popFood();
        this._allDone = 0;
        this._isFoodCorrect = false;

        //this.scheduleUpdate();
    },


    onDrag:function(hitPoint)
    {
        cc.log("DRAG DISABLED THIS SHOULD NEVER HAPPEN");
        if(this.model._state == FoodStates.Ready || this.model._state == FoodStates.Dragging)
        {
            this.model._state = FoodStates.Dragging;
           // this._targetPos = this.view._parentView.foodUI.convertToNodeSpace(cc.p(hitPoint.x, hitPoint.y));
            this._targetPos = this.view.convertToNodeSpace(cc.p(hitPoint.x, hitPoint.y));
           // this._targetPos = LumosityUtils.convertPointSpace(cc.p(hitPoint.x, hitPoint.y), this.view._parentView.centeredContent, this.view._parentView.foodUI);
            //this._targetPos = LumosityUtils.convertPointSpace(cc.p(hitPoint.x, hitPoint.y), this.view._parentView.centeredContent, this.view._foodHolder);
        }
        else
        {
            //ll.verbose("state " + this.model._state);
        }
    },
    
    _createSettings: function( settings )
    {
        this.settings = settings;//new FoodSettings( settings );
    },
    
    _createModel: function(colorList,colorValueList)
    {
        this.model = new FoodModel(colorList,colorValueList);
    },

    _createView: function()
    {
        this.view = new FoodView(this);
        this.view.nodeName = "Food";
        this.view.setAnchorPoint( 0.5, 0.5 );
    },

    update:function(delta)
    {
        //cc.log("----update");
        if(this.model._state == FoodStates.Processing)
        {
            this._pushCtr = this._pushCtr - delta;
            if(this._pushCtr < 0)
            {
                this._popFood();
                this._pushCtr = this.model._spawnTime;
            }
        }
        if( this.model._state == FoodStates.Dragging)
        {
            cc.log("---------------FoodStates.Dragging");
            var currPos = this.view._foodHolder.getPosition();
            var diffX = currPos.x + (this._targetPos.x - currPos.x)*delta*20; // XXX this should be 20
            var diffY = currPos.y + (this._targetPos.y - currPos.y)*delta*20;

            this.view._foodHolder.setPosition(cc.p(diffX, diffY));
        }
        if(this.model._state == FoodStates.JumpToFish)
        {
            var currPos = this.view._foodHolder.getPosition();
            var currScale = this.view._foodHolder.getScale();
            var ang = this._targetFish._angleBez
            var fishFaceX = this._targetFish._currPos.x + this._targetFish._koiLength * 0.5 * Math.cos(ang) ;//- this.view._parentView.foodUI.getPositionX() * 0.5;
            var fishFaceY = this._targetFish._currPos.y + this._targetFish._koiLength * 0.5 * Math.sin(ang) ;//- this.view._parentView.foodUI.getPositionY() * 0.5;
            var tP = LumosityUtils.convertPointSpace(cc.p(fishFaceX, fishFaceY), this._targetFish, this.view);

            //this._targetFish._cp1.setPosition(cc.p(fishFaceX, fishFaceY));

            var diffX =   (tP.x - currPos.x);
            var diffY =   (tP.y - currPos.y);
            var diffScale = this.model._targetScale - currScale;

            var del = delta * 5;
            this.view._foodHolder.setPosition(cc.p(currPos.x + diffX * del, currPos.y + diffY * del ));
            // XXX SETSCALEX AND Y
            this.view._foodHolder.setScale(currScale + diffScale * del);
            var d = Math.sqrt(diffX * diffX + diffY * diffY);
            if(d < this._targetFish._koiLength*0.5)
            {
                this._feedFish();
            }
        }
    },

    _feedFish:function()
    {
        if(this._targetFish._model._hit === 0 && this._isFoodCorrect === true)
        {
            this._targetFish._animatedView.playWithPreRoll("koi_animationseat",0);
        }
        else
        {
            cc.log("this._targetFish._model._hit====",this._targetFish._model._hit);
            this._targetFish._animatedView.playWithPreRoll("koi_animationseatFull",0);
            this._targetFish.spitOutFood();
        }
        this._targetFish._controller.wasHit(this._isFoodCorrect);
        this._pushFood();
    },

    backToBase:function()
    {
        this.model._state = FoodStates.DragRelease;
        this.view.backToBase();
    },

    jumpToFish:function(fish,isFoodCorrect)
    {
        this.model._state = FoodStates.JumpToFish;
        this._targetFish = fish;
        //this.view.jumpToFish(hitPoint);
        this._isFoodCorrect = isFoodCorrect;
    },

    _popFood:function()
    {
        if(this.view._pipsUsed !== this.view._pips.length ) {
            //cc.audioEngine.playEffect("res/koiGame/sounds/PlayingKoi_newFoodAvail.mp3");
        }

        this._parentView.controller._beginMetadataTrial();

        // XXX SETSCALEX AND Y
        this.view._foodHolder.setScale(1.0);
        this.view._foodHolder.runAction(cc.Show.create());
        //var offset = cc.Place.create(cc.p(this.view._basePos.x, this.view._basePos.y - this.view._winSize.height*0.05));
        //var move = cc.EaseBounceOut.create(cc.MoveTo.create(0.5, this.view._basePos));
        //this.view._foodHolder.runAction(cc.Sequence.create(offset, move));
        //this.view._foodHolder.runAction(cc.Place.create(this.view._basePos));
        this.model._state = FoodStates.Ready;
        //this.view._timerBar.runAction(cc.Hide());
        this.view._foodTimer.runAction(cc.Hide.create());
        //this.view._foodTemp.runAction(cc.Hide());
        this.view._foodLocked.runAction(cc.Hide.create());
    },

    _pushFood:function()
    {
        //ll.verbose("push");
        this.view._pipsUsed = this.view._pipsUsed -1;
        if(this.view._pipsUsed < 0)
        {
            ll.verbose("BAD NEGATIVE PIPS");
        }
        else
        {
            this.view._pips[this.view._pipsUsed ].runAction(cc.Hide.create());
        }

        if(this._allDone === 1)
        {
            this.view._foodHolder.runAction(cc.Hide.create());
            this.model._state = FoodStates.None;
            return;
        }


        this.view._foodHolder.runAction(cc.Hide.create());
        this.model._state = FoodStates.Processing;
        this.view.reset();
        this._pushCtr = this.model._spawnTime;

       // this.view._timerBar.runAction(cc.Show());
       // this.view._timerBar.runAction(cc.Sequence.create(cc.ScaleTo.create(0,0.8,1), cc.ScaleTo.create(this.model._spawnTime, 0,1)));
       // this.view._foodTemp.runAction(cc.Show());

        this.view._foodLocked.runAction(cc.Show.create());
        this.view._foodTimer.runAction(cc.Show.create());
        cc.animationCache.getAnimation("food_timercountdown").setDelayPerUnit(this.model._spawnTime / (2 * 30));


        this.view._foodTimer.play("food_timercountdown");
        this.view.setFoodTimerColor();
    },
    getFoodRemainNum : function(){
        return this.view._pipsUsed;
    },
} );