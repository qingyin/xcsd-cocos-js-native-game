var KoiView = cc.Node.extend({
    /** @lends KoiView.prototype */
    
    _rad:null,
    _currPos: null,
    _prevPos: null, // make sure you init this to Koi's init pos
    _nextPos: cc.p(0,0),
    _outPos: null,
    _nextAng:null,
    _targetAng:null,
    _koi: null,
    _koiHolder: null,
    _bezierForward : null,
    _nextFunc: null,
    _target: null, // debug
    _cp1:null,   // debug
    _cp2:null, // debug
    _prevCP1:null,
    _prevCP2:null,
    _oldNextPos:cc.p(0,0),
    _controlPoint1:cc.p(0,0),
    _controlPoint2:cc.p(0,0),

    _animatedView:null,
    _parentView: null,
    _model:null,
    _controller:null,
    _koiLength:null,
    _angleBez:null,

    _fbCorrect:null,
    _fbCorrectHolder:null,
    _fbIncorrect:null,
    _fbIncorrectHolder:null,
    _fbHungry:null,
    _fbHungryHolder:null,
    _fbState:null,
    _fbHideFunc:null,
    _fbTime:null,
    _fbHW:null,
    _fbGrow:null,
    _fbShrink:null,

    _moveForward:null,

    _debug:0,
    _foreverSeq:null,
    _halfWayAng:0,

    _doingCircle:0,
    _swimOut:0,
    _swimOutLose:0,

    angArray:null,
    fishStep:null,

    outRad:0,

    ctor:function(model, controller, parent, pos, outpos, koiLength)
    {
        //cc.log("ctor---",model, controller, parent, pos, outpos, koiLength);
        this._super();
        this._parentView = parent;
        this._model = model;
        this._controller = controller;
        this._koiLength = koiLength;
        this._nextFunc =  cc.CallFunc.create(this._nextPoint.bind(this), this);
        this._createFunc =  cc.CallFunc.create(this._createKoi.bind(this), this);

        this._nextPos = cc.p(pos.x, pos.y);
        this._model.fishStartX = Math.round(pos.x);
        this._model.fishStartY = Math.round(pos.y);
        this._outPos = cc.p(outpos.x, outpos.y);
        this._fbState = KoiFeedbackStates.None;
        this._fbTime = 0.75;
        this._doingCircle = 0;
        this._swimOut = 0;
        this._swimOutLose = 0;

        this.angArray = new Array();
        for(var i = 0; i < 360; i++)
        {
            var ang = i * Math.PI / 180;
            this.angArray.push( ang );
        }
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



    drawCubicBezier:function( origin, control1, control2, destination, segments, col)
    {
        var d = cc.DrawNode.create();
        var t = 0.0;
        var prevPt = null;
        for(var i = 0; i < segments; i++)
        {
            var x = Math.pow(1 - t, 3) * origin.x + 3.0 * Math.pow(1 - t, 2) * t * control1.x + 3.0 * (1 - t) * t * t * control2.x + t * t * t * destination.x;
            var y = Math.pow(1 - t, 3) * origin.y + 3.0 * Math.pow(1 - t, 2) * t * control1.y + 3.0 * (1 - t) * t * t * control2.y + t * t * t * destination.y;
            if(prevPt !== null) {
                d.drawSegment(cc.p(x, y), cc.p(prevPt.x, prevPt.y), 2, cc.color(col, 0, 0, 150));
            }
            prevPt = cc.p(x, y);
            t += 1.0 / segments;
        }
        this._parentView.centeredContent.addChild(d);

    },

    _genCurve:function(first, col)
    {
        var controlPoints = [  this._controlPoint1, this._controlPoint2, this._nextPos];

        var normTime =  this._dist(this._prevPos, this._nextPos) * 960 / (this._parentView.model._fishSpeed * this._parentView._dH);
        if(first === 1)
        {
           normTime = normTime * 0.5;
        }
        else
        {
            var tO = Math.floor(lumosity.game.frametime * 1000);
            this._model.pathHistory.push(tO);
            this._model.pathHistory.push(":");
            this._model.pathHistory.push(Math.round(this._controlPoint1.x));
            this._model.pathHistory.push(":");
            this._model.pathHistory.push(Math.round(this._controlPoint1.y));
            this._model.pathHistory.push(":");
            this._model.pathHistory.push(Math.round(this._controlPoint2.x));
            this._model.pathHistory.push(":");
            this._model.pathHistory.push(Math.round(this._controlPoint2.y));
            this._model.pathHistory.push(":");
            this._model.pathHistory.push(Math.round(this._nextPos.x));
            this._model.pathHistory.push(":");
            this._model.pathHistory.push(Math.round(this._nextPos.y));
            this._model.pathHistory.push(";");

        }

        //this._bezierForward = cc.EaseInOut.create(cc.BezierTo.create(normTime, controlPoints), 2);

        //this._moveForward = cc.MoveTo.create(normTime, this._nextPos);


        //this.drawCubicBezier(this._currPos, this._controlPoint1, this._controlPoint2, this._nextPos, 100, col);

        this._bezierForward = cc.BezierTo.create(normTime, controlPoints);
        this._nextFunc =  cc.CallFunc.create(this._nextPoint.bind(this), this);
        this._foreverSeq = cc.Sequence.create( this._bezierForward, this._nextFunc );

        this._koiHolder.runAction(this._foreverSeq);

        //this._target.setPosition(this._nextPos);

    },

    swimOutLose: function(x, y)
    {
        this._koiHolder.stopAllActions();
        this._swimOutLose = 1;
        this._doingCircle = 0;
        this.outPos = cc.p(x, y);
    },

    swimOut: function()
    {
        this._swimOut = 1;
        this._swimOutLose = 0;
        this.outRad = 0;
    },

    changeCourse:function()
    {
        this._koiHolder.stopAllActions();
        this._doingCircle = 1;
        this._swimOut = 0;
        this._swimOutLose = 0;
    },

    onPause:function()
    {
       this._animatedView.pause();
       this.pause();
       this._koiHolder.pause();

       this._pausedTargets = cc.director.getActionManager().pauseAllRunningActions();
    },

    onResume:function()
    {
       this._animatedView.resume();
       this.resume();
       this._koiHolder.resume();
       cc.director.getActionManager().resumeTargets(this._pausedTargets);
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

    _getNorm: function(diffX, diffY, scaleOffset)
    {
        // of the two possible normals
        // pick the direction closer to the center
        // of our bounding ellipse
        var norm1 = cc.p(-diffY, diffX);
        var norm2 = cc.p(diffY, -diffX);
        var smallOffset = 0.1;
        var cpProject = cc.p(this._prevPos.x + diffX*0.5, this._prevPos.y + diffY*0.5 );
        var np1 = cc.p(cpProject.x + norm1.x * smallOffset, cpProject.y + norm1.y * smallOffset);
        var np2 = cc.p(cpProject.x + norm2.x * smallOffset, cpProject.y + norm2.y * smallOffset);
        var d1 = this._dist(this._parentView._center, np1);
        var d2 = this._dist(this._parentView._center, np2);
        if(d1 > d2)
        {
            return cc.p(norm2.x * scaleOffset, norm2.y * scaleOffset);
        }
        else
        {
            return cc.p(norm1.x * scaleOffset, norm1.y * scaleOffset);
        }
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


    animatedEntity_finishedAnimation:function(animationName)
    {
       if(animationName == this._animatedView.getAnimForState(KoiStates.Swimming))
       {
           // do nothing
       }
       else if(animationName == this._animatedView.getAnimForState(KoiStates.Eating))
       {
           this._animatedView.playWithPreRoll(this._animatedView.getAnimForState(KoiStates.Swimming), 1, 0);
           this._controller.setState(KoiStates.Swimming);
       }
       else if(animationName == this._animatedView.getAnimForState(KoiStates.EatingFull))
       {

           this._animatedView.playWithPreRoll(this._animatedView.getAnimForState(KoiStates.Swimming), 1, 0);
           this._controller.setState(KoiStates.Swimming);

       }
    },

    checkHit: function(hitPoint)
    {
        //this._cp1.setPosition(hitPoint);
        var d = this._dist(this._currPos, hitPoint);
        if(d < this._rad)
        {
            return d;
        }
        return -1; // or INT_MAX
    },

    doHighlightScale:function(fbNode)
    {
        var origScale = fbNode.getScale();
        this._fbHideFunc = cc.CallFunc.create(this._hideFeedback.bind(this),this);
        fbNode.runAction(cc.ScaleTo.create(0,0.1 * fbNode.getScale()));

        this._fbGrow = cc.EaseBounceInOut.create(cc.ScaleTo.create(0.25, fbNode.getScale()));
        this._fbShrink = cc.EaseBounceInOut.create(cc.ScaleTo.create(0.25, 0.1 * fbNode.getScale()));
        this._fbResetScale = cc.ScaleTo.create(0, origScale);
        var seq = cc.Sequence.create(cc.DelayTime.create(this._fbTime*0.1), cc.Show.create(),  this._fbGrow, cc.DelayTime.create(this._fbTime), this._fbShrink, this._fbHideFunc, this._fbResetScale);
        fbNode.runAction(seq);
    },

    doHighlight: function(hState)
    {
        if(hState == Highlights.MouseOver)
        {
          // this._animatedView._sprite.setOpacity(200);
        }
        else if(hState == Highlights.None)
        {
           //this._animatedView._sprite.setOpacity(40);
        }
        else if(hState == Highlights.Correct)
        {
            // cc.audioEngine.playEffect("res/koiGame/sounds/PlayingKoi_answerCorrect.mp3");
            // cc.audioEngine.playEffect("res/koiGame/sounds/PlayingKoi_fishEat.mp3");
            this._controller.setState(KoiStates.Eating);

            this._fbState = KoiFeedbackStates.CorrectShowing;

            this.doHighlightScale(this._fbCorrectHolder);

            var ang = this._angleBez;
            var fishFaceX = this._currPos.x + this._koiLength * 0.5 * Math.cos(ang) ;//- this.view._parentView.foodUI.getPositionX() * 0.5;
            var fishFaceY = this._currPos.y + this._koiLength * 0.5 * Math.sin(ang) ;//- this.view._parentView.foodUI.getPositionY() * 0.5;

            var wP = cc.p(fishFaceX, fishFaceY);//this._parentView.pond.convertToNodeSpace(cc.p(fishFaceX, fishFaceY));

            this._parentView.rippleHolder.runAction(cc.Place.create(cc.p(wP.x, wP.y)));
            this._parentView.ripple.runAction(cc.FadeIn.create(0.5));
            this._parentView.rippleHolder.runAction(cc.Sequence.create(  cc.ScaleTo.create(0,0.1), cc.Show.create(), cc.ScaleTo.create(2, 1.0),  cc.Hide.create() ));
            this._parentView.ripple.runAction(cc.FadeOut.create(2));
            if(LumosityUtils.isDebugModeOn())
            {
                this._animatedView._sprite.setColor(cc.c3b(0,255,0));
            }

        }
        else if(hState == Highlights.Incorrect)
        {
            //cc.audioEngine.playEffect("res/koiGame/sounds/PlayingKoi_answerIncorrect.mp3");
            this._fbState = KoiFeedbackStates.IncorrectShowing;
            this.doHighlightScale(this._fbIncorrectHolder);
        }
        else if(hState == Highlights.Reveal)
        {
            this._fbState = KoiFeedbackStates.MissedShowing;
            this.doHighlightScale(this._fbHungryHolder);
        }
        else if(hState == Highlights.AllCorrect)
        {
            this._fbState = KoiFeedbackStates.AllCorrectShowing;
            this.doHighlightScale(this._fbCorrectHolder);
        }
        else
        {
            ll.verbose("INVALID HIGHLIGHT" + hState);
        }
    },

    _hideFeedback:function()
    {
        // this means eating is complete        
        cc.log("--_hideFeedbac--this._fbState=",this._fbState);
        if(this._fbState != KoiFeedbackStates.MissedShowing && this._fbState != KoiFeedbackStates.AllCorrectShowing)
        {
            this._parentView.controller.doneEating();
        }

        if(this._fbState == KoiFeedbackStates.CorrectShowing)
        {
            this._parentView.setScore(ScoreTypes.Correct);
        }
        if(this._fbState == KoiFeedbackStates.IncorrectShowing);
        {
            this._parentView.setScore(ScoreTypes.Incorrect);
        }

        this._fbCorrectHolder.runAction(cc.Hide.create());
        this._fbIncorrectHolder.runAction(cc.Hide.create()); // XXX make this better so you hide only the ones showing
        this._fbHungryHolder.runAction(cc.Hide.create());
        this._fbState = KoiFeedbackStates.None;
    },


    spitOutFood: function()
    {
        this._parentView.foodWrongAnim.runAction(cc.Show.create());
        var ang = this._angleBez;
        var fishFaceX = this._currPos.x + this._koiLength * 0.6 * Math.cos(ang) ;//- this.view._parentView.foodUI.getPositionX() * 0.5;
        var fishFaceY = this._currPos.y + this._koiLength * 0.6 * Math.sin(ang) ;//- this.view._parentView.foodUI.getPositionY() * 0.5;
        var wP = cc.p(fishFaceX, fishFaceY);//this._parentView.pond.convertToNodeSpace(cc.p(fishFaceX, fishFaceY));
        this._parentView.foodWrongAnim.setPosition(cc.p(wP.x, wP.y));
        this._parentView.foodWrongAnim.play("food_eateneaten");
    },
    
    updateView: function( delta )
    {
        if(this._doingCircle === 1)
        {
            // End of Level
            var numKois = this._parentView._kois.length;
            var koiNum = this._model._index;
            var koiAng = (this._parentView.koiRotator + (360 / numKois) * koiNum)%360;

            var t = Math.min(15, numKois) / 15;
            var radMul = LumosityMath.lerp(t, 0.25, 0.55);
            var rad = this._parentView._dW * radMul;
            if(this._swimOut === 1)
            {
                rad = rad + this.outRad;
                this.outRad = 1.05 * this.outRad + delta*400;
            }
            var circPos = cc.p(this._parentView._center.x + rad * Math.cos(koiAng * Math.PI/180), this._parentView._center.y + rad * Math.sin(koiAng * Math.PI/180));
            this._currPos.x = this._currPos.x + (circPos.x - this._currPos.x) * delta;
            this._currPos.y = this._currPos.y + (circPos.y - this._currPos.y) * delta;

            this._targetAng = Math.atan2(-this._currPos.y + this._prevPos.y, this._currPos.x - this._prevPos.x) * 180.0 / Math.PI;
            this._targetAng = this._targetAng - 90;
            this._koiHolder.setRotation( this._targetAng );

            this._koiHolder.setPosition(this._currPos);
            this._prevPos = cc.p(this._currPos.x, this._currPos.y);
        }
        else if (this._swimOutLose === 1)
        {
            this._currPos.x = this._currPos.x + (this.outPos.x - this._currPos.x) * delta * 0.25;
            this._currPos.y = this._currPos.y + (this.outPos.y - this._currPos.y) * delta * 0.25;

            this._targetAng = Math.atan2(-this._currPos.y + this._prevPos.y, this._currPos.x - this._prevPos.x) * 180.0 / Math.PI;
            this._targetAng = this._targetAng - 90;
            this._koiHolder.setRotation( this._targetAng );

            this._koiHolder.setPosition(this._currPos);
            this._prevPos = cc.p(this._currPos.x, this._currPos.y);
        }
        else
        {
            // During Regular Play
            if(!this._bezierForward)
            {
                return;
            }
            var target = this._bezierForward.getTarget(); // XXX check if this is not null
            if(target && this._parentView.model.isAllFishStandstill === false)
            {
                // we do this because BezierTo doesn't have an autorotate/follow option
                var tP = target.getPosition();
                this._currPos = cc.p(tP.x, tP.y);
                this._angleBez = Math.atan2(this._currPos.y - this._prevPos.y, this._currPos.x - this._prevPos.x);
                this._targetAng = Math.atan2(-this._currPos.y + this._prevPos.y, this._currPos.x - this._prevPos.x) * 180.0 / Math.PI;

                this._targetAng = this._targetAng - 90;

                //var currAng = target.getRotation();
                //target.setRotation( currAng + (this._targetAng - currAng) * delta  );
                //ll.verbose("TARGET ANG" + this._targetAng + " ANGLEBEZ " + this._angleBez * 180.0 / Math.PI);
                target.setRotation( this._targetAng );

                this._prevPos = cc.p(this._currPos.x, this._currPos.y);
            }
            else
            {
                ll.verbose("Koi update target was null!")
            }
        }

        // Feedback positioning

        if(this._fbState > KoiFeedbackStates.None)
        {
            var b = Math.abs(Math.abs(this._angleBez * 180.0 / Math.PI) - 90) / 90.0;
            b = Math.max(0,Math.min(1, b));
            var d = LumosityMath.lerp(1.0 - b, this._koiLength * 0.5, this._koiLength * 0.9);

            var fbP = cc.p(this._currPos.x , Math.min(this._parentView._dH - this._koiLength *0.2, this._currPos.y + d ) );
            //var fbPTrans = LumosityUtils.convertPointSpace(fbP, this, this._parentView.centeredContent);
            //var fbPTrans = cc.p(fbP.x, fbP.y);//this._parentView.centeredContent.convertToNodeSpace(cc.p(fbP.x, fbP.y));
            var fbPTrans = cc.p(fbP.x, fbP.y);//this._parentView.pond.convertToNodeSpace(cc.p(fbP.x, fbP.y));
            if(this._fbState == KoiFeedbackStates.CorrectShowing)
            {
                this._fbCorrectHolder.runAction(cc.Place.create(fbPTrans));
            }
            else if(this._fbState == KoiFeedbackStates.IncorrectShowing)
            {
                this._fbIncorrectHolder.runAction(cc.Place.create(fbPTrans));
            }
            else if(this._fbState == KoiFeedbackStates.MissedShowing)
            {
                this._fbHungryHolder.runAction(cc.Place.create(fbPTrans));
            }
            else if(this._fbState == KoiFeedbackStates.AllCorrectShowing)
            {
                this._fbCorrectHolder.runAction(cc.Place.create(fbPTrans));
            }
        }

    },

    checkEndPoint:function(point)
    {
        var d = this._dist(point, this._nextPos);
        if( d < this._koiLength * 0.65 )
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
        var padW = this._koiLength * 0.5;
        var padH = this._koiLength * 0.5;
        var screenRect = cc.rect(padW, padH, w - 2 * padW, h - 2 * padH);

        var goodPoint = cc.p(0, 0);

        do {

           if (ctr > this.angArray.length - 1) {
               this._nextPos.x = goodPoint.x;
               this._nextPos.y = goodPoint.y;
               //ll.verbose("BREAKING OUT");
               break;
           }

           var randAng = tempAngs[ctr];

           var fStep = this.fishStep + Math.random() * this._koiLength * 0.5;
           this._nextPos.x = this._prevPos.x + fStep * Math.cos(randAng);
           this._nextPos.y = this._prevPos.y + fStep * Math.sin(randAng);

           var onScreen = LumosityUtils.rectContainsPoint(screenRect, this._nextPos);
           if (!onScreen) {
               //ll.verbose("point " + this._nextPos.x + " " + this._nextPos.y);
               ctr = ctr + 1;
               continue;
           }

           goodPoint.x = this._nextPos.x;
           goodPoint.y = this._nextPos.y;

           var tooClose = false;
           for (var i = 0; i < this._parentView._kois.length; i++) {
               if (i === this._model._index) {
                   continue;
               }
               tooClose = this._parentView._kois[i].view.checkEndPoint(this._nextPos);
               if (tooClose) {
                   break;
               }
           }
           if (tooClose) {
               ctr = ctr + 1;
               continue;
           }

           this._genControlPoints();
           var v1 = cc.p(this._prevPos.x - this._controlPoint1.x, this._prevPos.y - this._controlPoint1.y);
           var v2 = cc.p(this._controlPoint2.x - this._controlPoint1.x, this._controlPoint2.y - this._controlPoint1.y);

           var ang1 = Math.atan2(v1.y, v1.x) * 180 / Math.PI;
           var ang2 = Math.atan2(v2.y, v2.x) * 180 / Math.PI;

           ang = ang2 - ang1;
           ctr = ctr + 1;

           if (ctr > 25) {
               curvePinchAngle = 30;
           }
           if (ctr > 50) {
               curvePinchAngle = 20;
           }
           if (ctr > 75) {
               curvePinchAngle = 10;
           }

        } while (Math.abs(ang) < curvePinchAngle || Math.abs(ang) > 315)

        //ll.verbose("CHOSEN " + this._nextPos.x + " " + this._nextPos.y);
        //ll.verbose("ctr " + ctr + "and angle " + ang + " and point " + this._nextPos.x + " " + this._nextPos.y);
    },

    _createKoi: function()
    {
        var preRoll = Math.floor(Math.random()*1000);

        this._animatedView = new KoiAnimatedView();
        this._animatedView.playWithPreRoll("koi_animationsswimLoop", 1, preRoll);
        
        this._animatedView._sprite.setColor(this._model._fishColor);

        this._animatedView.addListener(this);
        this._animatedView.setAnchorPoint(cc.p(0.5, 0.5));
        this._koiHolder.addChild(this._animatedView);

        var self = this;
        cc.eventManager.addListener({
            event: cc.EventListener.TOUCH_ONE_BY_ONE,
            swallowTouches: false,
            onTouchBegan:function(touch, event){
                //cc.log("touch, event",touch, event);
                var target = event.getCurrentTarget();
                var size = target.getContentSize();

                var rect = cc.rect(0,0,size.width,size.height);
                var pos = target.convertToNodeSpace(touch.getLocation());
                //cc.log("---====--target----_animatedView",rect,pos,self._animatedView);
                //cc.log("hit touch fishId=",self._model._index);
                if (cc.rectContainsPoint(rect,pos)){
                    //cc.log("---====--target---123-",target);
                    var cEvent = new cc.EventCustom(CustomEvent.touchFishEvent.name);
                    //cc.log("-----cEvent===--",cEvent);
                    var userData = {
                        touchPoint : touch.getLocation(),
                        controller : self._controller,
                        parentView : self._parentView,
                        hitFishId : self._model._index,
                        fishColorValue : self._model._fishColorValue,
                    };
                    cEvent.setUserData(userData);
                    cc.eventManager.dispatchEvent(cEvent);
                }
                return true;
            },
            onTouchEnded: function(touch, event){           
            },
        }, this._animatedView._sprite);
    },

    /**
     * Adds a Koi sprite to the view.
     */
    init: function()
    {
        this._koiHolder = new cc.Node();
        this._koiHolder.setAnchorPoint(cc.p(0.5, 0.5)) ;

        this._rad = this._koiLength * 0.5; // don't change this, change it where its used
        this.fishStep = this._koiLength * 2;
        this._createKoi();

        this._koiHolder.setScaleX(1);//(this._parentView.settings.fishScale / this._parentView.centeredContent.getScaleX());
        this._koiHolder.setScaleY(1);//(this._parentView.settings.fishScale / this._parentView.centeredContent.getScaleY());
        this.addChild(this._koiHolder);

        // Correct Feedback
        this._fbCorrect = new LumositySprite(res.koiGame.feedback_correct);
        this._fbCorrect.setAnchorPoint(cc.p(0.5, 0.5));

        this._fbCorrectHolder = new cc.Node();
        this._fbCorrectHolder.setAnchorPoint(cc.p(0.5, 0.5));
        this._fbCorrectHolder.runAction(cc.Hide.create());
        this._fbCorrectHolder.addChild(this._fbCorrect);
        this._parentView.pond.addChild(this._fbCorrectHolder,Layers.kLayerFeedback);
        this._fbCorrectHolder.setScaleX(1);//(1 / this._parentView.centeredContent.getScaleX());
        this._fbCorrectHolder.setScaleY(1);//(1 / this._parentView.centeredContent.getScaleY());

        // Incorrect Feedback
        this._fbIncorrect = new LumositySprite(res.koiGame.feedback_incorrect);
        this._fbIncorrect.setAnchorPoint(cc.p(0.5, 0.5));

        this._fbIncorrectHolder = new cc.Node();
        this._fbIncorrectHolder.setAnchorPoint(cc.p(0.5, 0.5));
        this._fbIncorrectHolder.runAction(cc.Hide.create());
        this._fbIncorrectHolder.addChild(this._fbIncorrect);
        this._parentView.pond.addChild(this._fbIncorrectHolder,Layers.kLayerFeedback);
        this._fbIncorrectHolder.setScaleX(1);//(1 / this._parentView.centeredContent.getScaleX());
        this._fbIncorrectHolder.setScaleY(1);//(1 / this._parentView.centeredContent.getScaleY());

        // Went Hungry Feedback
        this._fbHungry = new LumositySprite(res.koiGame.feedback_empty);
        this._fbHungry.setAnchorPoint(cc.p(0.5, 0.5));

        this._fbHungryHolder = new cc.Node();
        this._fbHungryHolder.setAnchorPoint(cc.p(0.5, 0.5));
        this._fbHungryHolder.runAction(cc.Hide.create());
        this._fbHungryHolder.addChild(this._fbHungry);
        //this._parentView.pond.addChild(this._fbHungryHolder,Layers.kLayerFeedback);
        this._parentView.pond.addChild(this._fbHungryHolder,Layers.kLayerFeedback);
        this._fbHungryHolder.setScaleX(1);//(1 / this._parentView.centeredContent.getScaleX());
        this._fbHungryHolder.setScaleY(1);//(1 / this._parentView.centeredContent.getScaleY());

        if(this._debug == 1)
        {
            ll.verbose("********************** DEBUG MODE IS ON PLAYING KOI *********************");

            this._target = new LumositySprite( res.koiGame.koi );
            this._target.setAnchorPoint(cc.p(0.5, 0.5));
            this._target._sprite.setColor(cc.color(255, 0, 0, 255));

            this._cp1 = new LumositySprite( res.koiGame.koi );
            this._cp1.setAnchorPoint(cc.p(0.5, 0.5));
            // XXX SETSCALEX AND Y
            this._cp1.setScale(0.5);
            this._cp1._sprite.setColor(cc.color(0,0,255,255));

            this._cp2 = new LumositySprite( res.koiGame.koi );
            this._cp2.setAnchorPoint(cc.p(0.5, 0.5));
            // XXX SETSCALEX AND Y
            this._cp2.setScale(0.5);
            this._cp2._sprite.setColor(cc.color(0,255,0,255));

            this.addChild(this._target);
            this.addChild(this._cp1);
            this.addChild(this._cp2);
            this._cp1.setPosition(cc.p(this._nextPos.x, this._nextPos.y));
        }

        //var pt = this._parentView.randomPtOffScreen(0.5);
        //this._outPos = cc.p(pt.x, pt.y);
        this._koiHolder.runAction(cc.Place.create( this._nextPos ));
        this._currPos = cc.p(this._nextPos.x, this._nextPos.y);
        this._prevPos = cc.p(this._nextPos.x, this._nextPos.y);


        this._firstPoint();
    },
    removePondSprite : function(){
        this._fbCorrectHolder.removeFromParent(true);
        this._fbCorrectHolder = null;

        this._fbIncorrectHolder.removeFromParent(true);
        this._fbIncorrectHolder = null;
        
        this._fbHungryHolder.removeFromParent(true);
        this._fbHungryHolder = null;
    },

    onExit : function(){
        this._super();
    },
} );