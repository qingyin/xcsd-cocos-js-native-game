var SeaFish = cc.Layer.extend({
    _fish_pic:null,
    _swim_direction:null,
    _typeId:null,
    _speed:null,
    ctor: function (args) {
    	this._super();

        this._fish_pic = args.fishRes;
        this._swim_direction = args.swim_direction;
        this._typeId = args.fishId;
        this._speed = args.fishSpeed;

        this.init();

        return true;
    },

    init: function () {

        var size = cc.winSize;
        var scale = size.width / 750;

    	//fish
        this.swim_fish = new cc.Sprite(this._fish_pic);
        this.swim_fish.setAnchorPoint(cc.p(0, 0));
        var fish_size = this.swim_fish.getContentSize();
        this.swim_fish.attr({
            x:0,
            y:0,
            scale:scale
        });
        this.addChild(this.swim_fish);

        //cc.FlipX
        if (this._swim_direction == 2) {
            var fish_flipX = cc.FlipX.create(true);
            this.swim_fish.runAction(fish_flipX);
        }

        this.width = this.swim_fish.width*scale;
        this.height = this.swim_fish.height*scale;

    },

    swingAction: function (speed) {
        var frameIndex = null;
        for (var i = 0; i < FISH_ACTION_COUNT; i++) {
            if (actionFrame[i].id == this._typeId) {
                frameIndex = i;
                break;
            }
        };

        var initTime = 1;
        var swingTime = initTime * 100 / speed;

        if (swingTime >= 0.5) {
            swingTime = 0.25;
        }

        //animation
        var animation = new cc.Animation();
        for (var i = 1; i < 3; i++) {
            var resIndex = "res_" + i.toString();
            var frameName = actionFrame[frameIndex][resIndex];
            animation.addSpriteFrameWithFile(frameName);
        };

        animation.setDelayPerUnit(swingTime / 2);
        animation.setRestoreOriginalFrame(true);

        var action = cc.animate(animation);
        this.swim_fish.runAction(cc.RepeatForever.create(action));
    },

    fishStopSwing: function () {
        this.swim_fish.stopAllActions();
        this.swim_fish.setTexture(this._fish_pic);
    },

    addFishTouch: function () {
        cc.eventManager.addListener({
            event: cc.EventListener.TOUCH_ONE_BY_ONE,
            swallowTouches: false,
            onTouchBegan: this.onTouchBegan,
            onTouchMoved: this.onTouchMoved,
            onTouchEnded: this.onTouchEnded
        }, this); 
    },

    onTouchBegan:function (touch, event) {
        var target = event.getCurrentTarget();
        var parent = target.getParent();
        var touchPos = touch.getLocation();
        var touchPoint = parent.convertToNodeSpace(touchPos);
        // var touchPoint = target.convertToNodeSpace(touch.getLocation());

        if ((touchPoint.x - target.x) <= target.width && (touchPoint.x - target.x) >= 0 && (touchPoint.y - target.y) <= target.height && (touchPoint.y - target.y) >= 0) {
            target._handleFish(target._delegateFish, target, touchPos);
            // target.onDisappearFish(touchPos);
        }
        return true;  
    },

    onTouchMoved:function (touch, event) {
    },

    onTouchEnded:function (touch, event) {
    },

    onGoalDisappearFish: function (tPos) {
        this.swim_fish.stopAllActions();
        this.stopAllActions();
        var call1 = cc.CallFunc.create(function () {
            this._handle(this._delegate, tPos, this._typeId);
        }, this);
        var fadeOut = cc.FadeOut.create(0.5);
        var call2 = cc.CallFunc.create(function () {
            // this.swim_fish.stopAllActions();
            this.swim_fish.removeFromParent(true);
            this.swim_fish = null;
            this.removeFromParent(true);
           
        }, this);
        var seq = cc.Sequence.create(call1, fadeOut, call2);
        this.swim_fish.runAction(seq);
    },

    onOtherDisappearFish: function (tPos) {
        // this.swim_fish.stopAllActions();
        this.stopAllActions();
        var move1 = cc.MoveBy.create(0.05, cc.p(10, -10));
        var move2 = cc.MoveBy.create(0.05, cc.p(-10, 10));
        var seq = cc.Sequence.create(move1, move2);

        // var scaleBig = cc.ScaleTo.create(0.1, 1.1);
        // var scaleNormal = cc.ScaleTo.create(0.1, 1.0);
        // var seq = cc.Sequence.create(scaleBig, scaleNormal);
        var repeat = cc.Repeat.create(seq, 3);
        var call1 = cc.CallFunc.create(function () {
            this._handle(this._delegate, tPos, this._typeId);
        }, this);
        var call2 = cc.CallFunc.create(function () {
            this._handleOther(this._delegateOther, this);
        }, this);
        var seq1 = cc.Sequence.create(repeat, call1, call2);
        this.runAction(seq1);
    },

    handleFish: function (delegate, handle) {
        this._delegateFish = delegate;
        this._handleFish = handle;
    },

    handleTouch: function (delegate, handle) {
        this._delegate = delegate;
        this._handle = handle;
    },

    handleRun: function (delegate, handle) {
        this._delegateOther = delegate;
        this._handleOther = handle;
    },

});