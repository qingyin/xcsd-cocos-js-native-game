var AnimatedEntityView = cc.Node.extend(
{
    /** @lends AnimatedEntityView.prototype */
    
    /** The sprite to draw into. It's a SpriteBatchNode. */
    _sprite:null,
    
    /** The size of the visible cropped sprite sheet image. Use this to apply proper scale. */
    _visibleSize:null,
    
    /** The names of all the animations that exist in this animation. This must be set manually in the constructor. */
    _animationNames:[],
    
    /** The frame counts for each animation name, will be automatically found from the sprite sheet. */
    _animationFrameCounts:{},
    
    /** Unless specified otherwise per animation, each animation is given this frame delay (default 1 / 30). */
    _globalFrameDelay: 1.0 / 30.0,
    
    /** These will all get animatedEntity_finishedAnimation( animation ) function calls, and cue calls. */
    _listeners:[],
    
    /** The currentely executing animation action. */
    _animationAction:null,
    
    /** The name of the animation in progress, if one exists. */
    _animationNameInProgress:"",
    
    /**
     *  An AnimatedEntityView is a node that contains a sprite which has a single texture atlas.
     *  It can play handle multiple animations in the same file. Also has support for handling
     *  "triple zero" numbering, which is like 000, 001, etc. When it creates an animation, it
     *  will go through the atlas until a frame of a number isn't returned, and store off that frame count.
     *  The first animation in the array of animationNames is considered the default animation,
     *  and will be played on load and if no other animation is playing.
     *
     *  @constructs
     *  @param {string} atlasPlistPath The path to the plist that holds the Cocos sprite sheet data. A same-named png must exist in the same dir.
     *  @param {Array} animationNames An array of animation names to load. These must exist in the atlas.
     *  @param {number} [frameDelay=1.0/30.0] How long to delay between frame playing. This is the inverse of the FPS.
     *  @param {boolean} [useTripleZeroNumbering=false] If true, will use numbers like 000, 001, etc. instead of 0, 1, etc.
     */
    ctor:function( spriteSheetName, animationNames, frameDelay, useTripleZeroNumbering )
    {
        this._super();
        this.init();

        this._listeners = [];
        this._animationFrameCounts = {};
        this._globalFrameDelay = frameDelay || this._globalFrameDelay;

        this._loadSpriteSheets( spriteSheetName );

        this._createAnimationCache( animationNames, useTripleZeroNumbering );
        this._animationNames = animationNames;
        
        this.setSprite( cc.Sprite.create() );
        
        this.nodeType = "AnimatedEntityView";
    },

    setSprite: function( sprite )
    {
        if ( this._sprite !== null )
        {
            this._sprite.removeFromParent();
            this._sprite = null;
        }

        this._sprite = sprite;
        this.addChild( this._sprite );
    },
    
    /**
     *  Play the passed animation. If it does not exist, this function will return false.
     *
     *  @param {string} animationName The name of the animation to play.
     *  @param {boolean} loop Whether or not to loop the animation.
     *  @returns {boolean} True if the animation is now playing, false otherwise.
     */
    play:function( animationName, loop, preRoll )
    {
        if ( !cc.animationCache.getAnimation( animationName ) )
        {
            cc.log("[AnimatedEntityView] Unable to play animation \"" + animationName + "\" because it doesn't exist in the animation cache. Was it in the plist file?" );
            return false;
        }
                
        //stop any currently executing animations
        if ( this._animationAction )
        {
            this._sprite.stopAction( this._animationAction );
        }
        
        //we need to call our finished animation function when we're done with one
        var animation = cc.animationCache.getAnimation( animationName );
        var animationAction = cc.Animate.create( animation );

        if( loop )
        {
            // repeat this animation action forever
            var repeatAction = cc.RepeatForever.create( animationAction );
            this._animationAction = repeatAction;
            this._sprite.runAction( repeatAction );
        }
        else
        {
            // no looping, so just play the thing and then notify the listener when done
            var finishedAction = cc.CallFunc.create( this._animationFinished.bind( this, animationName ), this );
            var sequence = cc.Sequence.create( animationAction, finishedAction );
            this._animationAction = sequence;
            this._sprite.runAction( sequence );
        }

        if(preRoll)
        {
          for(var i = 0; i < preRoll; i++)
          {
              this._animationAction.step(this._getFrameDelayForAnimation(animationName));
          }
        }

        //execute the action, and store it off so we can stop it later if necessary
        this._animationNameInProgress = animationName;
        
        return true;
    },

    pause:function()
    {
        if ( this._sprite )
        {
            //resumeSchedulerAndActions is deprecated, please use resume instead.
            //this._sprite.pauseSchedulerAndActions();
            this._sprite.pause();
        }
    },

    resume:function()
    {
        if ( this._sprite )
        {
            //resumeSchedulerAndActions is deprecated, please use resume instead.
            //this._sprite.resumeSchedulerAndActions();
            this._sprite.resume();
        }
    },
    
    /**
     *  Will notify all listeners when animations are finished playing.
     *  Attempts to call animatedEntity_finishedAnimation( animationName ) on its listeners.
     *
     *  @param {Object} listener The object to receive playing and cue functions.
     */
    addListener:function( listener )
    {
        this.removeListener( listener );
        this._listeners.push( listener );
    },
    
    /**
     *  Removes a listener from the list so it no longer receives updates.
     *
     *  @param {Object} listener The listener to remove.
     */
    removeListener:function( listener )
    {
        //this._listeners.remove( listener );
        
        var removeByValue = function(arr, val) {
          for(var i=0; i<arr.length; i++) {
            if(arr[i] == val) {
              arr.splice(i, 1);
              break;
            }
          }
        }
        removeByValue(this._listeners,listener);
    },
    
    /**
     *  The visible size of the entity is the texture size in pixels of a single sprite frame.
     *  You can use this for determining how much to scale this view.
     *
     *  @returns {cc.Size} The visible size.
     */
    getVisibleSize:function()
    {
        return this._visibleSize;
    },
    
    /**
     *  Returns whether or not an animation is being played. If animationName is
     *  undefined, returns if any animation is playing at all.
     *
     *  @param {string} [animationName] If this has a value, check to see if this is being played.
     *  @returns {boolean} Whether or not animationName is being played, or if it's undefined whether anything is being played.
     */
    isPlaying:function( animationName )
    {
        if ( !this._animationAction )
        {
            return false;
        }
        
        if ( animationName )
        {
            return this._animationNameInProgress === animationName;
        }
        
        return true;
    },
    
    /**
     *  Gives the currently playing animation's name, or an empty string if nothing is being played.
     *
     *  @returns {string} The name of the currently playing animation.
     */
    getPlayingAnimationName:function()
    {
        return this._animationNameInProgress;
    },
    
    /**
     *  Creates all the cc.Animation's and adds them to the cc.AnimationCache. Uses the array
     *  of animation names provided to properly load and name each animation. If you provide
     *  an animation name that does not exist in the atlas then you will have issues, but
     *  you don't need to provide every name that exists in the atlas.
     *
     *  @param {string} atlasPlistPath The location of the plist to load animations from. A PNG of the same name must exist in the same directory.
     *  @param {Array} animationNames All of the animations to load. These names must match what's in the atlas.
     *  @param {boolean} [useTripleZeroNumbering=false] If true, anim names will be numbered like 000, 001, etc. instead of naturally.
     */
    _createAnimationCache:function( animationNames, useTripleZeroNumbering )
    {
        var animationIndex;
        for ( animationIndex = 0; animationIndex < animationNames.length; animationIndex++ )
        {
            var animationName = animationNames[ animationIndex ];
            var frameDelay = this._getFrameDelayForAnimation( animationName );
        
            var frames = this._createAnimationFrames( animationName, useTripleZeroNumbering );
            if ( frames.length > 0 )
            {
                var anim = cc.Animation.create( frames, frameDelay );
                //var anim = cc.Animation.create();
                //anim.initWithAnimationFrames( frames, frameDelay, 1 );
                cc.animationCache.addAnimation( anim, animationName );
            }
            else
            {
                cc.log( "[AnimatedEntityView] Unable to create animation of name \"" + animationName + "\" because it didn't exist in the atlas." );
            }
        }
    },
    
    /**
     *  Gives the frame delay for a specific animation, used during initialization. By default
     *  it uses the global frame delay. If you want a different frame delay for a specific
     *  animation, you can override this function to return something else.
     *
     *  @param {string} animationName The animation to get the frame delay for.
     *  @returns {number} The frame delay for that animation. By default, this is always the global delay.
     */
    _getFrameDelayForAnimation:function( animationName )
    {
        return this._globalFrameDelay;
    },

    _loadSpriteSheets:function( spriteSheetName )
    {
        // build sprite sheet group file path
        var spriteSheetGroupFile = spriteSheetName + ".json";
        //var spriteSheetGroupPath = cc.FileUtils.getInstance().fullPathForFilename( spriteSheetGroupFile );
        var spriteSheetGroupPath = spriteSheetGroupFile;
        var spriteSheetGroupString = null;
        var spriteSheetGroup = null;
        var spriteSheetIndex = 0;

        // try to load spritesheet group file
        if( spriteSheetGroupPath !== spriteSheetGroupFile )
        {
            spriteSheetGroupString = lumosity.io_read( spriteSheetGroupPath );
            if( spriteSheetGroupString )
            {
                // sprite sheet group exists, so read its sprite sheets
                spriteSheetGroup = JSON.parse( spriteSheetGroupString, null );
                if( spriteSheetGroup && spriteSheetGroup.spriteSheets )
                {
                    // load each sprite sheet specified in sprite sheets group file
                    ll.verbose( "[AnimatedEntityView] Loading " + spriteSheetGroup.spriteSheets.length + " sprite sheets from sprite sheet group " + spriteSheetGroupPath );
                    var spriteSheetIndex = 0;
                    for( spriteSheetIndex = 0; spriteSheetIndex < spriteSheetGroup.spriteSheets.length; spriteSheetIndex++ )
                    {
                        cc.spriteFrameCache.addSpriteFrames(  spriteSheetGroup.spriteSheets[spriteSheetIndex] + ".plist",
                                                                            spriteSheetGroup.spriteSheets[spriteSheetIndex] + ".png" );
                    }
                }
                else
                {
                    ll.verbose( "[AnimatedEntityView] Invalid sprite sheet group: " + spriteSheetGroupPath );
                }
                return;
            }
        }

        // no sprite sheet group found; just load .plist file
        ll.verbose( "[AnimatedEntityView] Loading sprite sheet .plist from " + spriteSheetName );
        cc.spriteFrameCache.addSpriteFrames( spriteSheetName + ".plist", spriteSheetName + ".png" );
        //cc.log("--cc.spriteFrameCache.addSpriteFrames---",spriteSheetName + ".plist", spriteSheetName + ".png" );
    },
    
    /**
     *  Creates all the cc.AnimationFrame objects from a single sprite sheet PNG.
     *  You must pass in the column count, row count, and animation delay.
     *
     *  @param {string} plistName The name of the plist to load the atlas data from.
     *  @param {string} animationName The name of the animation to create. Will search the sprite atlas for this animation.
     *  @param {boolean} [useTripleZeroNumbering=false] Whether or not to use triple zero numbering. 000, 001, 002, etc.
     *  @returns {Array} All the cc.SpriteFrames in an array.
     */
    _createAnimationFrames:function( animationName, useTripleZeroNumbering )
    {
        //cc.log("AnimatedEntityView:_createAnimationFrames",animationName, useTripleZeroNumbering);
        var frames = [];
        var spriteIndex = 0;
        var spriteFrame = null;

        do
        {
            var numString = spriteIndex;
            if ( useTripleZeroNumbering )
            {
                if ( spriteIndex < 10 )
                {
                    numString = "00" + numString;
                }
                else if ( spriteIndex < 100 )
                {
                    numString = "0" + numString;
                }
            }
            
            spriteFrame = cc.spriteFrameCache.getSpriteFrame( animationName + numString + ".png" );
            
            //cc.log("png----",animationName + numString + ".png",spriteFrame );
            if ( spriteFrame )
            {
                if ( !this._visibleSize )
                {
                    this._visibleSize = spriteFrame.getOriginalSize();
                }
            
                //var animFrame = cc.AnimationFrame();
                //animFrame.initWithSpriteFrame( spriteFrame, 1, null );
                //frames.push( animFrame );
                frames.push( spriteFrame );
            }
            
            spriteIndex++;
        }
        while( spriteFrame );
        
        //store off how many frames there are for this animation
        this._animationFrameCounts[ animationName ] = frames.length;
        
        return frames;
    },
    
    _animationFinished:function( animationName )
    {
        animationName = animationName || this._animationNameInProgress;
        this._animationAction = null;
        this._animationNameInProgress = "";
        
        var listenerIndex;
        for ( listenerIndex = 0; listenerIndex < this._listeners.length; listenerIndex++ )
        {
            var listener = this._listeners[ listenerIndex ];
            if ( listener && listener.animatedEntity_finishedAnimation )
            {
                listener.animatedEntity_finishedAnimation( animationName );
            }
        }
    }
});