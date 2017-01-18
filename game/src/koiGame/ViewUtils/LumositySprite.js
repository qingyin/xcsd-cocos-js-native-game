var LumositySprite = cc.Node.extend(
{
    _sprite: null,

    /** @lends LumositySprite.prototype */
    
    ctor: function( imageName )
    {
        this._super();

        this._sprite = cc.Sprite.create( imageName );
        this._sprite.setAnchorPoint( cc.p(0,0) );
        this.addChild( this._sprite );

        this.setContentSize( this._sprite.getContentSize(), false );
    },

    /**
     * Sets a new content size, optionally scaling sprite to match it.
     *
     * @param contentSize   New content size.
     * @param scaleSprite   Whether to scale sprite to match size.
     * @param absolute      Whether size is absolute.   Jayro - I think this should really be removed, as it should always be true.
     */
    setContentSize: function( contentSize, scaleSprite, absolute )
    {
        this._super( contentSize );

        if( scaleSprite === true )
        {
            LumosityUtils.scaleForContentSize( this._sprite, contentSize, absolute );
        }
    },

    setOpacity: function( opacity )
    {
        this._sprite.setOpacity( opacity );
    },

    getOpacity: function()
    {
        return this._sprite.getOpacity();
    },

    runAction: function( action )
    {
        this._sprite.runAction( action );
    },

    setTexture: function( imageFile )
    {
        if ( this._sprite )
        {
            this._sprite.setScaleX( 1 );
            this._sprite.setScaleY( 1 );

            var texture = cc.TextureCache.getInstance().addImage( imageFile );
            this._sprite.setTexture( texture );
            this._sprite.setTextureRect( cc.rect( 0, 0, texture.getContentSize().width, texture.getContentSize().height ) );

            this.setContentSize( this._sprite.getContentSize(), false );
        }
    },

    setFlipX: function( flipX )
    {
        if ( this._sprite )
        {
            this._sprite.setFlippedX( flipX );
        }
    },

    setFlipY: function( flipY )
    {
        if ( this._sprite )
        {
            this._sprite.setFlippedY( flipY );
        }
    },

    setColor: function ( color )
    {
        if ( this._sprite )
        {
            this._sprite.setColor ( color );
        }
    }
} );