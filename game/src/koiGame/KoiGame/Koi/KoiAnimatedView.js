
var KoiStates =
{
    Swimming: 0,
    Eating:  1,
    Chewing: 2,
    EatingFull: 3,
};
var KoiAnimatedView = AnimatedEntityView.extend({
    /** @lends KoiView.prototype */

    ctor:function( preRoll )
    {
        this._super( "res/koiGame/koi/koiSwim", this._createAnimationNames(), null, true );

    },

    playWithPreRoll:function( anim, loop, preRoll )
    {
        this.play(anim, loop, preRoll);
    },

    /**
     *  Creates a new array with all the animation names that we care about.
     *
     *  @returns {Array} The array of names. Pass these into the super constructor.
     */
    _createAnimationNames:function()
    {
        var animations = [];
        animations.push(  this.getAnimForState(KoiStates.Swimming)  );
        animations.push(  this.getAnimForState(KoiStates.Eating));
        animations.push(  this.getAnimForState(KoiStates.EatingFull));
        return animations;
    },

    getAnimForState:function(state)
    {
        if(state == KoiStates.Swimming)
        {
            return "koi_animationsswimLoop";
        }
        else if(state == KoiStates.Eating)
        {
            return "koi_animationseat";
        }
        else if(state == KoiStates.EatingFull)
        {
            return "koi_animationseatFull";
        }
    },


    /**
     * Adds a Koi sprite to the view.
     */
    init: function()
    {

    },

    onExit : function(){
        this._super();
    },
} );
