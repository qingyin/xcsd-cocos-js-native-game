
var DistractorView = cc.Node.extend({
    /** @lends DistractorView.prototype */

    distractorType:null,
    _currPos: null,
    _prevPos: null, // make sure you init this to BottomFeeder's init pos
    _nextPos: cc.p(0,0),
    fishStartX:null,
    fishStartY:null,
    _nextAng:null,
    _targetAng:null,
    _distractorHolder: null,
    _bezierForward : null,
    _nextFunc: null,
    _oldNextPos:cc.p(0,0),
    _controlPoint1:cc.p(0,0),
    _controlPoint2:cc.p(0,0),

    _animatedView:null,
    _parentView: null,
    _angleBez:null,

    _moveForward:null,

    _foreverSeq:null,
    _halfWayAng:0,

    fireflyCtr:0,
    fireflyTime:0,
    fireflyTimeRange:3.0,

    raindropCtr:0,
    raindropTime:0,
    rainTimeRange:1.5,

    fishSeed:0,

    angArray:null,
    fishStep:null,
    dIndex:null,

    pathHistory:null,


    ctor:function(parent, dType)
    {
        this._super();
        this.dIndex = parent._distractors.length;
        this.distractorType = dType;
        this._parentView = parent;
        this._nextFunc =  cc.CallFunc.create(this._nextPoint.bind(this), this);

        if(this.distractorType === DistractorTypes.raindrop) {
            //this.randNextPos(0);
        }
        if(this.distractorType === DistractorTypes.dragonfly || this.distractorType === DistractorTypes.bottomfeeder)
        {
            var r = this._parentView.randomPtOnScreen();
            this._nextPos =  cc.p(r.x, r.y);
            this.fishStartX = Math.round(r.x);
            this.fishStartY = Math.round(r.y);
        }


        this.raindropTime = 1 + Math.random()*this.rainTimeRange;
        this.fireflyTime = 2 + Math.random()*this.fireflyTimeRange;

        this.angArray = new Array();
        for(var i = 0; i < 360; i++)
        {
            var ang = i * Math.PI / 180;
            this.angArray.push( ang );
        }
        this.pathHistory = new Array();

    },

    _ang: function(p1, p2)
    {
        return Math.atan2(-p2.y + p1.y, p2.x - p1.x)* 180/Math.PI;
    },

    // XXX me being stupid (does cc not have this?)
    _dist: function(p1, p2)
    {
        return Math.sqrt((p2.x - p1.x) * (p2.x - p1.x) + (p2.y - p1.y) * (p2.y - p1.y));
    },


    _genCurve:function(first)
    {
        var controlPoints = [  this._controlPoint1, this._controlPoint2, this._nextPos];
        if(first === 1)
        {

        }
        else {
            var tO = Math.floor(lumosity.game.frametime * 1000);
            this.pathHistory.push(tO);
            this.pathHistory.push(":");
            this.pathHistory.push(Math.round(this._controlPoint1.x));
            this.pathHistory.push(":");
            this.pathHistory.push(Math.round(this._controlPoint1.y));
            this.pathHistory.push(":");
            this.pathHistory.push(Math.round(this._controlPoint2.x));
            this.pathHistory.push(":");
            this.pathHistory.push(Math.round(this._controlPoint2.y));
            this.pathHistory.push(":");
            this.pathHistory.push(Math.round(this._nextPos.x));
            this.pathHistory.push(":");
            this.pathHistory.push(Math.round(this._nextPos.y));
            this.pathHistory.push(";");
        }
        var speed = 40;
        if(this.distractorType === DistractorTypes.dragonfly)
        {
            speed = 60;
        }
        var normTime =  this._dist(this._prevPos, this._nextPos) * 960 / (speed * this._parentView._dH);

        this._bezierForward = cc.BezierTo.create(normTime, controlPoints);
        this._nextFunc =  cc.CallFunc.create(this._nextPoint.bind(this), this);
        this._foreverSeq = cc.Sequence.create( this._bezierForward, this._nextFunc );

        this._distractorHolder.runAction(this._foreverSeq);

    },

    _firstPoint:function()
    {
        var diffX = this._nextPos.x - this._prevPos.x;
        var diffY = this._nextPos.y - this._prevPos.y;

        var cp1 = 0.25;
        var cp2 = 0.75;

        var scaleOffset = 0.15;
        var norm  = cc.p(-diffY * scaleOffset, diffX * scaleOffset);
        var cp1Project = cc.p(this._prevPos.x + diffX * cp1, this._prevPos.y + diffY * cp1);
        this._controlPoint1 = cc.p(cp1Project.x + norm.x, cp1Project.y + norm.y);

        var cp2Project = cc.p(this._prevPos.x + diffX * cp2, this._prevPos.y + diffY * cp2);
        this._controlPoint2 = cc.p(cp2Project.x + norm.x, cp2Project.y + norm.y);

        this._prevCP2 = cc.p(this._controlPoint2.x, this._controlPoint2.y);

        this._genCurve(1);
    },

    _genControlPoints:function()
    {
        var diffX = this._nextPos.x - this._prevPos.x;
        var diffY = this._nextPos.y - this._prevPos.y;

        var d = this._dist(this._nextPos, this._prevPos);
        // these two numbers completely control the quality of the motion
        var cp2 = 0.70;
        var scaleOffset = 0.13;

        //var norm  = this._getNorm(diffX, diffY, scaleOffset);

        // next control point +
        // should be on a line formed by previous end point and last cp or previous curve
        var lineDir = cc.p(this._prevPos.x - this._prevCP2.x, this._prevPos.y - this._prevCP2.y);
        this._controlPoint1 = cc.p(this._prevPos.x + lineDir.x, this._prevPos.y + lineDir.y);

        var norm = cc.p(-diffY*scaleOffset, diffX*scaleOffset);
        var cp2Project = cc.p(this._prevPos.x + diffX * cp2, this._prevPos.y + diffY * cp2);
        this._controlPoint2 = cc.p(cp2Project.x + norm.x, cp2Project.y + norm.y);

    },

    _nextPoint: function()
    {
        this._genWayPoint2(); // generates a new _nextPos

        //this._genControlPoints();

        var col = 0;

        var v1 = cc.p( this._prevPos.x - this._controlPoint1.x ,  this._prevPos.y - this._controlPoint1.y );
        var v2 = cc.p(this._controlPoint2.x - this._controlPoint1.x, this._controlPoint2.y - this._controlPoint1.y);

        var ang1 = Math.atan2(v1.y, v1.x) * 180 / Math.PI;
        var ang2 = Math.atan2(v2.y, v2.x) *  180 / Math.PI;

        var ang = ang2 - ang1;
        //ll.verbose("ANG WAS " + ang);


        this._prevCP2 = cc.p(this._controlPoint2.x, this._controlPoint2.y);

        this._genCurve(0, col);
        this._oldPrevPos = cc.p(this._prevPos.x ,this._prevPos.y);
    },


    updateView: function( delta )
    {
        if(this.distractorType === DistractorTypes.raindrop) {
            this.raindropCtr = this.raindropCtr + delta;
            if(this.raindropCtr > this.raindropTime)
            {
                this.randNextPos(0);
                this._distractorHolder.runAction(cc.Place.create( this._nextPos));
                this._animatedView.playWithPreRoll("raindrop_animationsraindrop", 0);
                this.raindropCtr = 0;
            }
            return;
        }

        if(this.distractorType === DistractorTypes.firefly) {
            this.fireflyCtr = this.fireflyCtr + delta;
            if(this.fireflyCtr > this.fireflyTime)
            {
                this.randNextPos(0);
                this._distractorHolder.setRotation(Math.random()*360);
                this._distractorHolder.runAction(cc.Place.create( this._nextPos));
                this._animatedView.playWithPreRoll("firefly_animationsfireflyloop", 0);
                this.fireflyCtr = 0;
            }
            return;
        }

        // During Regular Play
        var target = this._bezierForward.getTarget(); // XXX check if this is not null
        if(target)
        {
            // we do this because BezierTo doesn't have an autorotate/follow option
            var tP = target.getPosition();
            this._currPos = cc.p(tP.x, tP.y);
            this._angleBez = Math.atan2(this._currPos.y - this._prevPos.y, this._currPos.x - this._prevPos.x);
            this._targetAng = Math.atan2(-this._currPos.y + this._prevPos.y, this._currPos.x - this._prevPos.x) * 180.0 / Math.PI;


            this._targetAng = this._targetAng - 90;

            target.setRotation( this._targetAng );

            this._prevPos = cc.p(this._currPos.x, this._currPos.y);
        }
        else
        {
            ll.verbose("bottomFeeder update target was null!")
        }
    },

    checkEndPoint:function(point, type)
    {
        if(type !== this.distractorType)
        {
            return false;
        }
        var d = this._dist(point, this._nextPos);
        if( d < this._parentView._koiLength * 0.65 )
        {
            return true; // too close
        }
        return false;
    },


    _genWayPoint2:function()
    {
        var ang = 0;
        var ctr = 0;
        var curvePinchAngle = 35;
        var tempAngs = this.angArray.slice();
        tempAngs = LumosityUtils.shuffle(tempAngs);
        var w = this._parentView._dW;
        var h = this._parentView._dH;
        var padW = this._parentView._koiLength * 0.5;
        var padH = this._parentView._koiLength * 0.5 ;
        var screenRect = cc.rect(padW, padH, w - 2 * padW, h - 2 * padH );

        var goodPoint = cc.p(0,0);
        do{

            if(ctr > this.angArray.length -1)
            {
                this._nextPos.x = goodPoint.x;
                this._nextPos.y = goodPoint.y;

                //ll.verbose("BREAKING OUT");
                break;
            }

            var randAng = tempAngs[ctr];
            var fStep = this.fishStep + Math.random() * this._parentView._koiLength * 0.5;
            this._nextPos.x = this._prevPos.x + fStep * Math.cos(randAng);
            this._nextPos.y = this._prevPos.y + fStep * Math.sin(randAng);

            var onScreen =  LumosityUtils.rectContainsPoint(screenRect, this._nextPos);
            if(!onScreen)
            {
                //ll.verbose("point " + this._nextPos.x + " " + this._nextPos.y);
                ctr = ctr + 1;
                continue;
            }
            /*
            var tooClose = false;
            for(var i = 0; i < this._parentView._distractors.length; i++)
            {
                if(i === this.dIndex)
                {
                    continue;
                }
                tooClose = this._parentView._distractors[i].checkEndPoint(this._nextPos, this.distractorType);
                if(tooClose)
                {
                    break;
                }
            }
            if(tooClose)
            {
                ctr = ctr + 1;
                continue;
            }  */

            goodPoint.x = this._nextPos.x;
            goodPoint.y = this._nextPos.y;


            this._genControlPoints();
            var v1 = cc.p( this._prevPos.x - this._controlPoint1.x ,  this._prevPos.y - this._controlPoint1.y );
            var v2 = cc.p( this._controlPoint2.x - this._controlPoint1.x, this._controlPoint2.y - this._controlPoint1.y );

            var ang1 = Math.atan2(v1.y, v1.x) * 180 / Math.PI;
            var ang2 = Math.atan2(v2.y, v2.x) *  180 / Math.PI;

            ang = ang2 - ang1;
            ctr = ctr + 1;

            if(ctr > 25)
            {
                curvePinchAngle = 30;
            }
            if(ctr > 50)
            {
                curvePinchAngle = 20;
            }
            if(ctr > 75)
            {
                curvePinchAngle = 10;
            }

        }while(Math.abs(ang) < curvePinchAngle || Math.abs(ang)> 315)


    },

    randNextPos:function(t) {
        var x = this._parentView._dW * t + Math.random() * this._parentView._dW * (1.0 - 2 * t);
        var y = this._parentView._dH * t + Math.random() * this._parentView._dH * (1.0 - 2 * t);
        this._nextPos= cc.p(x,y);

        if(!this._parentView.controller.playingGame )
        {
            return;
        }

        var tO = Math.round(lumosity.game.frametime * 1000);
        var distractor = {
            round: this._parentView.model.md_roundRound,
            x: Math.round(x),
            y: Math.round(y),
            time_offset: tO
        };
        this._parentView.model.md_distractors.push(distractor);


    },

    animatedEntity_finishedAnimation:function(animationName)
    {
        if(animationName == "raindrop_animationsraindrop")
        {
            //this.raindropCtr = 0;
        }

    },

    _createDistractor: function()
    {
        if(this.distractorType === DistractorTypes.bottomfeeder) {
            this._animatedView = new BottomFeederAnimatedView();
            this._animatedView.playWithPreRoll("BottomFeeder_animationsswimloop", 1);

        }

        if(this.distractorType === DistractorTypes.dragonfly) {
            this._animatedView = new DragonflyAnimatedView();
            this._animatedView.playWithPreRoll("DragonFly_animationsflyloop", 1);
        }

        if(this.distractorType === DistractorTypes.raindrop) {
            this._animatedView = new RaindropAnimatedView();
            //this._animatedView.playWithPreRoll("raindrop_animationsraindrop", 0);
        }

        if(this.distractorType === DistractorTypes.firefly) {
            this._animatedView = new FireflyAnimatedView();
            //this._animatedView.playWithPreRoll("firefly_animationsfireflyloop", 0);
        }

        this._animatedView.addListener(this);
        this._distractorHolder.addChild(this._animatedView);

    },

    onPause:function()
    {
        this._animatedView.pause();
        this._distractorHolder.pause();
    },

    onResume:function()
    {
        this._animatedView.resume();
        this._distractorHolder.resume();
    },

    /**
     * Adds a bottomFeeder sprite to the view.
     */
    init: function()
    {
        this._distractorHolder = new cc.Node();
        this._distractorHolder.setAnchorPoint(cc.p(0.5, 0.5)) ;

        this.fishStep = this._parentView._koiLength * 2;

        this._createDistractor();

        this._distractorHolder.setScaleX(1);//(this._parentView.settings.fishScale / this._parentView.centeredContent.getScaleX());
        this._distractorHolder.setScaleY(1);//(this._parentView.settings.fishScale / this._parentView.centeredContent.getScaleY());


        this.addChild(this._distractorHolder);

        this._distractorHolder.runAction(cc.Place.create( this._nextPos ));
        this._currPos = cc.p(this._nextPos.x, this._nextPos.y);
        this._prevPos = cc.p(this._nextPos.x, this._nextPos.y);

        if(this.distractorType === DistractorTypes.raindrop || this.distractorType === DistractorTypes.firefly) {
            return;
        }
        this._firstPoint();
    },

    onExit : function(){
        this._super();
    },
} );