/*global require*/

//get Array functionality from this
//require( "src/Utility/LumosityUtils.js" );

/**
 * This is a simple enum/class for handling the disabling of animation
 * playbacks. You can ignore certain changes on your node to
 * keep the AnimationController and/or LayoutLoader from doing
 * anything to those changes.
 *
 *  @name AnimationChanges
 *  @class
 */
var AnimationChanges =
{
    Position: 0,
    Scale: 1,
    Rotation: 2,
    Visibility: 3,
    Alpha: 4,
    Skew: 5,
    Count: 6,
    
    /**
     *  You can call this on a given node in order to ignore changes animation changes and layout. Use
     *  The AnimationChanges enum to choose which to ignore. You can pass in an array in order
     *  to ignore multiple changes per node.
     *
     *  @param {cc.Node} node The node to ignore those changes on.
     *  @param {Array|AnimationChanges} changes The changes to ignore.
     */
    setNodeIgnoredChanges:function( node, changes )
    {
        if ( !( changes instanceof Array ) )
        {
            changes = [changes];
        }
        node.ignoredChanges = changes;
    },
    
    /**
     * Add changes to a node's already ignored changes. This is safe to call regardless of the node's
     * state. Even if it has no ignored changes, it will create them. 
     *
     *  @param {cc.Node} node The node to ignore those changes on.
     *  @param {Array|AnimationChanges} changes The changes to ignore.
     */
    addNodeIgnoredChanges:function( node, changes )
    {
        if ( !node.ignoredChanges )
        {
            this.setNodeIgnoredChanges( node, changes );
        }
        else
        {
            if ( !( node.ignoredChanges instanceof Array ) )
            {
                node.ignoredChanges = [ node.ignoredChanges ];
            }
            
            if ( changes instanceof Array )
            {
                node.ignoredChanges.addAll( changes, true );
            }
            else if ( !node.ignoredChanges.contains( changes ) )
            {
                node.ignoredChanges.push( changes );
            }
        }
    },
    
    /**
     * Remove changes from a node's ignored changes. This is safe to call regardless of the node's
     * state. If there are no ignored changes, it does nothing. 
     *
     *  @param {cc.Node} node The node to unignore those changes on.
     *  @param {Array|AnimationChanges} changes The changes to unignore.
     */
    removeNodeIgnoredChanges:function( node, changes )
    {
        if ( !node.ignoredChanges )
        {
            return;
        }
        
        if ( node.ignoredChanges instanceof Array )
        {
            if ( changes instanceof Array )
            {
                node.ignoredChanges.removeAll( changes );
            }
            else
            {
                node.ignoredChanges.remove( changes );
            }
        }
        else if ( node.ignoredChanges === changes )
        {
            node.ignoredChanges = undefined;
        }
    },
    
    /**
     * Returns whether or not a node ignores a given change. Unlike the other functions,
     * this cannot be an array parameter (why would you want it to be?).
     *
     * @param {cc.Node} node The node that you want to check for the change of.
     * @param {AnimationChanges} change The change you want to check for,.
     */
    nodeIgnoresChange:function( node, change )
    {
        if ( !node.ignoredChanges )
        {
            return false;
        }
        
        var ignore = node.ignoredChanges;
        
        if ( ignore instanceof Array )
        {
            return ignore.contains( change );
        }
        
        return ignore === change;
    }
};