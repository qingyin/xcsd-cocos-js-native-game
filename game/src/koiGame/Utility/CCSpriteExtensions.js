/*global cc*/

/**
 * Creates a sprite given a path to an image or an image name
 * and spritesheet name.
 * 
 * @param  {[type]} imageName       Name of the image to be used.
 * @param  {[type]} spritesheetName Name of spritesheet this image may belong to. [OPTIONAL]
 * @param  {[type]} format          String name of new format type.
 * @return {[type]}                 New instance of cc.Sprite object or NULL if no image was found.
 */
cc.Sprite.prototype.createSprite = function( imageName, spritesheetName, format )
{
    "use strict";

    var sprite = null;
    //
    // Try creating a sprite using a spritesheet.
    //
    if( imageName && spritesheetName )
    {
        if( format )
        {
            cc.SpriteFrameCache.getInstance().addSpriteFrames( spritesheetName + ".plist", spritesheetName + format );
        }
        //
        // If unsuccessful, try loading the spritesheet into the frame cache first.
        //
        else if( !cc.SpriteFrameCache.getInstance().getSpriteFrame( imageName ) )
        {
            cc.SpriteFrameCache.getInstance().addSpriteFrames( spritesheetName + ".plist", spritesheetName + ".png" );
        }
        sprite = cc.Sprite.createWithSpriteFrameName( imageName );
    }
    //
    // If the sprite is still null, try creating it using just the imageName (in
    // this case interpreted as the filename).
    //
    if( imageName && !sprite )
    {
        sprite = cc.Sprite.create( imageName );
    }
    return sprite; 
};