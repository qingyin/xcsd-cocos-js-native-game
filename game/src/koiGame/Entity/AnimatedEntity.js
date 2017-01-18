var AnimatedEntity = cc.Class.extend(
{
    /** @lends AnimatedEntity.prototype */
    
    /** The AnimatedEntityView that we'll be playing animations on. */
    view:null,
    
    /** The default animation that we play when other animations finish. By default, it will use its view's first animation. */
    defaultAnimationName:"",
    
    /**
     *  An AnimatedEntity is basically a character that contains logic for
     *  prioritizing different animations to play. It has an
     *  AnimatedEntityView and sets it up as that view's controller. You should
     *  probably subclass this, since by default it doesn't really do anything.
     *
     *  @constructs
     *  @param {AnimatedEntityView} view The entity we're controlling the animations of.
     */
    ctor: function( view )
    {
        this.view = view;
        
        if ( this.view )
        {
            this.view.addListener( this );
            
            if ( this.view._animationNames.length > 0 )
            {
                this.defaultAnimationName = this.view._animationNames[ 0 ];
            }
        }
    },
    
    /**
     *  Play the passed animation on our view. If it does not exist or it cannot be played due to priority,
     *  this function will return false. Will call this.shouldPlayAnimation() to see if it should play.
     *
     *  @param {string} animationName The name of the animation to play.
     *  @param {boolean} [force=false] If true, will force the animation to play, regardless of priority.
     *  @returns {boolean} True if the animation is now playing, false otherwise.
     */
    playAnimation:function( animationName, force )
    {
        if ( force || this.shouldPlayAnimation( animationName ) )
        {
            return this.view.play( animationName );
        }
        return false;
    },
    
    /**
     *  If you want to implement animation priority, like for example if animation A is playing
     *  then animation B should never play, then override this function. You can also use it
     *  to implement any game state checks you might want.
     *
     *  @param {string} animationName Check to see if this animation should be played.
     *  @returns {boolean} If true, then playAnimation() will be able to play this animation.
     */
    shouldPlayAnimation:function( animationName )
    {
        return true;
    },
    
    /**
     *  Called by the AnimatedEntityView when an animation has been finished because we're
     *  a listener for our view.
     *
     *  @param {string} animationName The name of the animation that just finished.
     */
    animatedEntity_finishedAnimation:function( animationName )
    {
        if ( this.defaultAnimationName )
        {
            this.playAnimation( this.defaultAnimationName, false );
        }
    }
});