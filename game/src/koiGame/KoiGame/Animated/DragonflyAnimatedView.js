var DragonflyAnimatedView = AnimatedEntityView.extend({
    /** @lends KoiView.prototype */

    ctor:function( preRoll )
    {
        this._super( "res/koiGame/distractors/dragonfly/DragonFly", this._createAnimationNames(), null, true );

    },

    playWithPreRoll:function( anim, loop )
    {
        this.play(anim, loop);
    },

    /**
     *  Creates a new array with all the animation names that we care about.
     *
     *  @returns {Array} The array of names. Pass these into the super constructor.
     */
    _createAnimationNames:function()
    {
        var animations = [];
        animations.push("DragonFly_animationsflyloop");

        return animations;
    },

    init: function()
    {

    },
       
    onExit : function(){
        this._super();
    },
    
} );