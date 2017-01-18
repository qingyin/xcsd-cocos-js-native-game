var SeabedNumber = cc.Layer.extend({
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

});