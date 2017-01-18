var LumosityUtils =
{
    /** @lends LumosityUtils */
    
    /**
     * Depricated: Use LumosityMath's implementation.
     */
    clamp: function( val, min, max ) { "use strict"; return LumosityMath.clamp( val, min, max ); },

    /**
     * Depricated: Use LumosityMath's implementation.
     */
    lerp: function(t, min, max) { "use strict"; return LumosityMath.lerp( t, min, max ); },

     /**
     * Depricated: Use LumosityMath's implementation.
     */
    betterLerp: function ( deltaTime, totalTime, start, end ) { "use strict"; return LumosityMath.betterLerp( deltaTime, totalTime, start, end ); },

    /**
     * Depricated: Use LumosityMath's implementation.
     */ 
    distanceBetweenPoints: function( point1, point2 ) { "use strict"; return LumosityMath.distance( point1, point2 ); },

    /**
     * Depricated: Use LumosityMath's implementation.
     */ 
    dot: function( p1, p2 ) { "use strict"; return LumosityMath.dot( p1, p2 ); },

    /**
     * Depricated: Use LumosityMath's implementation.
     */ 
    smallestAngleBetween: function( deg1, deg2 ) { "use strict"; return LumosityMath.smallestAngleBetween( deg1, deg2 ); },

    /**
     * Depricated: Use LumosityMath's implementation.
     */
    rotateVectorByAngle: function( v, pivot, angle ) { "use strict"; return LumosityMath.rotateVectorByAngle( v, pivot, angle ); },

    /**
     * Depricated: Use LumosityMath's implementation.
     */
    isPointInPolygon: function( pt, poly ) { "use strict"; return LumosityMath.isPointInPolygon( pt, poly ); },

    /**
     *  This array is used to decide the search path asset folders.
     *  The values are compared against the width of the screen, and the next
     *  largest size is chosen. If no larger size is found, the last is chosen.
     *  NOTE: Ensure that these are sorted from largest to smallest.
     */
    searchPathWidths:
    [
        1600,
        1200,
        800,
        640, //design size
        400
    ],
    
    /**
     * Takes a value and ensures that it has a set number of digits.
     * If the number of digits is greater than the value's number of digits,
     * then zeroes will be inserted at the front. If it is less than the value's
     * number of digits, then it will truncate the number.
     *
     * @name LumosityUtils#getNumberWithDigitCount
     * @function
     * @param {number} value The value we want to adjust digits to.
     * @param {number} desiredDigitCount How many digits we want in the number, extras will have zeroes.
     * @returns {number} The new value after having its digits adjusted.
     */
    getNumberWithDigitCount:function( value, desiredDigitCount )
    {
        "use strict";

        return( String( 1e15 + value ) ).slice( -desiredDigitCount );
    },
    
    /**
     * Takes a value and sets it to be the a certain number of digits in length
     * by adding zeroes at the front. If the value is longer than the desired
     * digit count, it will simply return the original value.
     *
     * @name LumosityUtils#padWithLeadingZeroes
     * @function
     * @param {number} value The value we want to pad.
     * @param {number} desiredDigitCount How many zeroes we want to add towards.
     * @returns {number} The new value after being padded.
     */
    padWithLeadingZeroes:function( value, desiredDigitCount )
    {
        "use strict";

        if ( String( value ).length >= desiredDigitCount )
        {
            return value;
        }
        
        return this.getNumberWithDigitCount( value, desiredDigitCount );
    },

    /**
     *  Returns an array of all the keys contained in obj.
     *
     * @name LumosityUtils#getAllKeys
     * @function
     * @param {Object} obj The object we want to get all the keys from.
     * @returns {Array} All the keys that were within obj.
     */
    getAllKeys:function( obj )
    {
        "use strict";

        var keys = [];
        var key;
        for ( key in obj )
        {
            keys.push( key );
        }
        return keys;
    },
    
    /**
     * Sometimes when you call setContentSize() on a node, it may not do what
     * you desired. Examples are sprites and labels. This function will calculate
     * the scale to apply to get the "content size" that you desire, and will
     * apply that scale. The contentSize will remain its previous value.
     *
     * @param {cc.Node} node The node to apply the scale to.
     * @param {cc.Size} size The content size that you want to set.
     * @param {boolean} [absolute=false] If true, the scale will be applied to a consistent value, regardless of the current scale.
     */
    scaleForContentSize: function( node, size, absolute )
    {
        "use strict";

        var currentSize = node.getContentSize();
        var currentScale = cc.p( 1, 1 );

        if ( !absolute )
        {
            currentScale.x = node.getScaleX();
            currentScale.y = node.getScaleY();
        }

        // NAF
        // Commenting out for now.
        // When using sprite sheets texture rect comes in as the trimed size.
        // This makes this code problematic.
        // if ( node instanceof cc.Sprite )
        // {
        //     var texRect = node.getTextureRect();
        //     currentSize.width = texRect.width;
        //     currentSize.height = texRect.height;
        // }
        
        if ( currentSize.x !== 0 && currentSize.y !== 0 )
        {
            node.setScaleX( currentScale.x * ( size.width / currentSize.width ) );
            node.setScaleY( currentScale.y * ( size.height / currentSize.height ) );
        }
    },

    /**
     *  Prints all the keys contained in obj.
     *
     * @name LumosityUtils#printAllKeys
     * @function
     * @param {Object} obj The object we want to print all the keys from.
     */
    printAllKeys:function( obj )
    {
        "use strict";

        cc.log( JSON.stringify( LumosityUtils.getAllKeys( obj ) ) );
    },

    convertSecondsToMilliseconds: function( seconds )
    {
        "use strict";

        return Math.floor( seconds * 1000 );
    },

    /**
     * A dictionary of all the fonts, corresponding with their locations on the disk.
     *
     * @name LumosityUtils#fontLocations
     */
    fontLocations:
    {
        'ReportSchoolRg-Bold' :             'fonts/Report School.ttf',
        'MuseoSans-700' :                   'fonts/MuseoSans-700.ttf',
        'MuseoSans-500' :                   'fonts/MuseoSans-500.ttf',
        'MuseoSans-300' :                   'fonts/MuseoSans-300.ttf',
        'MuseoSans-100' :                   'fonts/MuseoSans-100.ttf',
        'fonts/MuseoSans-700.ttf' :         'fonts/MuseoSans-700.ttf',
        'fonts/MuseoSans-500.ttf' :         'fonts/MuseoSans-500.ttf',
        'fonts/MuseoSans-300.ttf' :         'fonts/MuseoSans-300.ttf',
        'fonts/MuseoSans-100.ttf' :         'fonts/MuseoSans-100.ttf'
    },

    /**
     *  Returns the location of the passed font name on disk.
     *
     * @name LumosityUtils#getFontLocation
     * @function
     * @param {string} font The font we want to find the location of.
     * @returns {string} The font location.
     */
    getFontLocation:function( font )
    {
        "use strict";

        return LumosityUtils.fontLocations[ font ] || "Arial";
    },

    /**
     *  Converts a boolean to its correspoding STRING character.
     *  Primaily used for Metadata.
     *
     * @name LumosityUtils#getFontLocation
     * @function
     * @param {boolean} The boolean to be converted to a char.
     * @returns {string} The char version of the boolean.
     */
    booleanToChar: function ( bool )
    {
        "use strict";

        if ( bool )
        {
            return "T";
        }
        
        return "F";
    },

    /**
     *  Executes a given function after a delay.
     *
     * @name LumosityUtils#printAllKeys
     * @function
     * @param {function} func The function we want to call.
     * @param {number} delay How long in seconds to wait before calling the function.
     * @param {Object} target The object to call the function on.
     * @param {cc.Node} [cocosObj=target] The Cocos object to use to execute the delayed function. If not provided, uses target. 
     */
    executeDelayedFunction:function( func, delay, target, cocosObj )
    {
        "use strict";

        cocosObj = cocosObj || target;
        var action = cc.CallFunc.create( func, target );
        var interval = cc.DelayTime.create( delay );
        cocosObj.runAction( cc.Sequence.create( interval, action ) );
    },

    /**
     * Returns a random integer between min and max. Deprecated. Use Random.integer() instead.
     * For what it's worth, getRandomInt and Random.integer bias min and max.  See Random.value comment.
     *
     * @deprecated
     * @name LumosityUtils#getRandomInt
     * @function
     * @param {number} min Minimum number
     * @param {number} max Maximum number
     * @param {boolean} [exclusiveMin=false] If true, min is exclusive, otherwise it is inclusive (default).
     * @param {boolean} [exclusiveMax=false] If true, max is exclusive, otherwise it is inclusive (default).
     * @returns {number} Result
     */
    getRandomInt:function( min, max, exclusiveMin, exclusiveMax )
    {
        "use strict";

        return Random.integer( min, max, exclusiveMin, exclusiveMax );
    },
    
    /**
     *  Returns whether or not a rect contains a point.
     *
     *  @param {cc.Rect} rect The rect.
     *  @param {cc.Point} point The... what? I forget. Oh. You guessed it. The point.
     */
    rectContainsPoint:function( rect, point )
    {
        "use strict";

        return ( point.x >= rect.x && point.x <= rect.x + rect.width && point.y >= rect.y && point.y <= rect.y + rect.height );
    },

    /**
     *  Implements a simple assert function to be used in testing.
     *
     *  @param {expression} condition The conditional expression being evaluated.
     *  @param {string} message A human-readable message that describes why the assertion failed.
     *  @returns {trace} Prints a stack trace with a custom message.
     */
    assert:function( condition, message )
    {
        "use strict";

        if( !condition )
        {
            throw new Error( ( message ? message : "Unkown assertion failed!" ) );
        }
    },

    /**
     *  log the call stack with clickable links to function calls
     */
    logStack:function()
    {
        "use strict";

        cc.log("**************** LOGGING STACK ***************") ;

        var e = new Error('dummy');
        var lines = e.stack.split('\n');
        var i;
        var toks;
        for (i = 1; i < lines.length; i++) {
            toks = lines[i].split("/");
            if(toks && toks.length > 0)
            {
                cc.log(toks[0] + " " + toks[toks.length -1]);
            }
        }
        cc.log("***************** DONE LOGGING STACK **************");
    },
    
    /**
     * Iterates through a node and all its children. If you want, you may assign
     * a nodeName property to a node in order to have that printed rather than just type.
     *
     * @param {cc.Node} node The node to print.
     * @param {number} [indentLevel=0] You can indent the printouts if you want, mostly this is done automatically.
     * @returns {string} A multiline string that represents the node hierarchy.
     */
    getNodeHierarchyString:function( node, indentLevel )
    {
        "use strict";

        if ( !node )
        {
            return null;
        }
        
        indentLevel = indentLevel || 0;
        var str = "";
        var indentIndex;
        for ( indentIndex = 0; indentIndex < indentLevel; indentIndex++ )
        {
            str += "  ";
        }
        str += this.getNodeString( node );
        str += "\n";
        
        var childIndex;
        for( childIndex = 0; childIndex < node.getChildren().length; childIndex++ )
        {
            str += this.getNodeHierarchyString( node.getChildren()[ childIndex ], indentLevel + 1 );
        }
        
        return str;
    },
    
    /**
     * Iterates through a node and all its children. If you want, you may assign
     * a nodeName property to a node in order to have that printed rather than just type.
     *
     * @param {cc.Node} node The node to print.
     */
    printNodeHierarchy:function( node )
    {
        "use strict";

        cc.log( "\n" + this.getNodeHierarchyString( node ) );
    },
    
    printNode:function( node )
    {
        "use strict";

        cc.log( this.getNodeString( node ) );
    },
    
    getNodeString:function( node )
    {
        "use strict";

        var name = node.nodeName ? "\"" + node.nodeName + "\" " : "unnamed ";
        if ( name === "unnamed " && node.getName )
        {
            name = "\"" + node.getName() + "\" ";
        }
        var type = node.nodeType ? node.nodeType : ( node instanceof cc.LabelTTF ? "label" : ( node instanceof cc.Sprite ? "sprite" : ( node instanceof cc.LabelTTF ? "label" : "node" ) ) );
        return          name + 
                        type +
                        " pos:" + JSON.stringify( node.getPosition() ) +
                        " sc:{x:" + node.getScaleX() + ",y:" + node.getScaleY() + "}" +
                        " anc:" + JSON.stringify( node.getAnchorPoint() ) +
                        " con:" + JSON.stringify( node.getContentSize() ) +
                        " vis:" + node.isVisible() +
                        ( node.isRootNode && node.resizing ? " res:(" + node.resizing.widthChange + "," + node.resizing.heightChange + ")" : "" ) +
                        " [" + ( node.isRootNode ? " isRootNode " : "" ) + "]";
    },
    
    /**
     *  Sets the opacity on a Node. If that node has the function setOpacity(), then it will
     *  call that. Otherwise, it will drill down into its children and try to call it on them.
     *  This function will be fired recursively until setOpacity() has been called on each child.
     *  @param {cc.Node} node The node to set opacity on.
     *  @param {number} alpha The alpha to set.
     */
    setOpacityOnNode:function( node, alpha )
    {
        "use strict";

        if ( node.setOpacity )
        {
            node.setOpacity( alpha );
        }
        else
        {
            var childIndex;
            var children = node.getChildren();
            var child;
            for ( childIndex = 0; childIndex < children.length; childIndex++ )
            {
                child = children[ childIndex ];
                this.setOpacityOnNode( child, alpha );
            }
        }
    },

    /**
     *  Runs an action on a node and all of its children.
     */
    runActionOnNode: function( node, action )
    {
        "use strict";

        var childIndex;
        var children = node.getChildren();
        var child = null;
        for ( childIndex = 0; childIndex < children.length; childIndex++ )
        {
            child = children[ childIndex ];
            this.runActionOnNode( child, action );
        }

        node.runAction( action.clone() );
    },

    /**
     *  Stops an action on a node and all of it's children.
     */
    stopActionOnNodeByTag: function( node, tag )
    {
        "use strict";

        var childIndex;
        var children = node.getChildren();
        var child = null;
        for ( childIndex = 0; childIndex < children.length; childIndex++ )
        {
            child = children[ childIndex ];
            this.stopActionOnNodeByTag( child, tag );
        }

        node.stopActionByTag( tag );
    },
    
    /**
     *  Converts a point from one node's space into another's. Uses Cocos functions to convert to
     *  world space, then back into node space.
     *  @param {cc.Point} point The point to convert.
     *  @param {cc.Node} fromNode The node to convert from the space of.
     *  @param {cc.Node} toNode The node to convert to the space of.
     *  @returns {cc.Point|null} Returns the converted point, or null if there was no hierarchy match.
     */
    convertPointSpace:function( point, fromNode, toNode )
    {
        "use strict";

        var worldPoint = fromNode.convertToWorldSpace( point );
        return toNode.convertToNodeSpace( worldPoint );
    },
    
    /**
     *  Creates cc.FadeTo action(s) for a Node. If that node has the function setOpacity(), then it
     *  will return just that action for the node. Otherwise, it will drill down into its children and
     *  try to return the action for each of its children. These actions will be cloned.
     *
     *  @param {cc.Node} node The node to perform the fade on.
     *  @param {number} duration The duration to apply the fade.
     *  @param {number} endAlpha The alpha to fade to.
     *  @returns {Array} A list of Objects, where obj.node is the node and obj.action is the action, of all actions that must be applied.
     */
    getFadeToForNode:function( node, duration, endAlpha )
    {
        "use strict";

        return this._getFadeToForNodeHelper( node, duration, endAlpha, [] );
    },
    
    /**
     *  Helper function. Can't touch this. Pew pew. Use the real function.
     */
    _getFadeToForNodeHelper:function( node, duration, endAlpha, actionPairs )
    {
        "use strict";

        if ( node.setOpacity )
        {
            var action = cc.FadeTo.create( duration, endAlpha );
            actionPairs.push( { "node":node, "action":action } );
        }
        else
        {
            var childIndex;
            var children = node.getChildren();
            var child;
            for ( childIndex = 0; childIndex < children.length; childIndex++ )
            {
                child = children[ childIndex ];
                this._getFadeToForNodeHelper( child, duration, endAlpha, actionPairs );
            }
        }
        return actionPairs;
    },

    /**
     * Shuffles an array randomly according to the classic Fisher-Yates algorithm.
     * Resources:
     *       http://en.wikipedia.org/wiki/Fisher-Yates_shuffle
     *       http://www.codinghorror.com/blog/2007/12/the-danger-of-naivete.html
     * 
     * @param  {array} array The array of values that is shuffled in-place.
     * @return {array} Returns the shuffled array.
     */
    shuffle:function( array )
    {
        "use strict";

        var current_index = array.length,
            random_index = 0,
            temp_value = 0;
        while( current_index !== 0 ) 
        {
            random_index = Math.floor( Math.random() * current_index );
            current_index -= 1;

            temp_value = array[ current_index ];
            array[ current_index ] = array[ random_index ];
            array[ random_index ] = temp_value;
        }
        return array;
    },

    /**
     * Calls a function on each property of an object. The function will be given the
     * parameters: func( key, value )
     * 
     * @param  {object} object The object whose properties the function will run on.
     * @param  {function} func The function that is called on each property and value of the object.  
     */
    forEachIn:function( object, func )
    {
        "use strict";

        var property;
        for( property in object )
        {
            //test to see if this property is actually part of this object, not from the prototype
            if( Object.prototype.hasOwnProperty.call( object, property ) )
            {
                func( property, object[ property ] );
            }
        }
    },

     /**
     * Creates and returns a cc.DrawNode constructed by line segments.
     * 
     * @param  {array} array Points in space defining the shape of the poly.
     * @param  {float} float Radius of each line segment.
     * @param  {cc.c4f} cc.c4f Color of each line segment.
     *
     * @return {cc.DrawNode} cc.DrawNode DrawNode to be drawn by a view.
     */
    createDrawNodePoly:function( points, outlineRadius, outlineColor )
    {
        "use strict";

        var drawNode = cc.DrawNode.create();
        var curIndex;
        var nextIndex = 1;
        var pointsLength = points.length;
        
        // Draws bounding box in segments ( Draw Polygon doesn't exist in API )
        for( curIndex = 0; curIndex < pointsLength; curIndex++ )
        {
            if( nextIndex >= pointsLength )
            {
                nextIndex = 0;
            }
            
            drawNode.drawSegment( points[ curIndex ], points[ nextIndex ], outlineRadius, outlineColor );
            nextIndex++;
        }

        return drawNode;
    },

    /**
    * Renders a rect in a specified view.
    *
    * @param {cc.rect} Rect of points.
    * @param {float} Radius of the rect.
    * @param {cc.c4f} Color of the rect.
    * @param {int} Tag of the rect.
    * @param {cc.Node} Owner view of the rect.
    */
    drawRect: function( rect, outlineRadius, outlineColor, tag, view )
    {
        "use strict";

        view.removeChildByTag( tag, true );

        var points = [ cc.p( rect.x, rect.y), 
                       cc.p( rect.width, rect.y ),
                       cc.p( rect.width, rect.height ),
                       cc.p( rect.x, rect.height ) ];

        var drawNode = LumosityUtils.createDrawNodePoly( points, outlineRadius, outlineColor );
        view.addChild( drawNode, 0, tag);
    },

    /**
    * Returns a nodes uniform scale where the parents scale may be skewed.
    *
    * @param {cc.Node} Node whose scale is to be uniformed.
    * @param {cc.Node} Parent node whose scale is not uniform.
    * @param {bool} Whether to scale up or down based on parents scale delta.
    *
    * @return {cc.p} Node's uniform scale.
    */
    getNodeToParentUniformScale: function( node, parent, scaleToMin )
    {
        "use strict";

        var nodeScale = cc.PointZero();
        var parentScale = cc.PointZero();
        var scaleFactor = cc.PointZero();
        var newScale = cc.PointZero();
        var isXMin = false;

        parentScale.x = parent.getScaleX();
        parentScale.y = parent.getScaleY();
        nodeScale.x = node.getScaleX();
        nodeScale.y = node.getScaleY();
        newScale.x = nodeScale.x;
        newScale.y = nodeScale.y;
       
        // Determin whether the parents x or y is smaller.
        isXMin = ( parentScale.x < parentScale.y );
        scaleFactor.x = parentScale.x / parentScale.y;
        scaleFactor.y = parentScale.y / parentScale.x;


        // Check to see if we are scaling to min or max.
        if( scaleToMin === true )
        {  
            if( isXMin === true )
            {
                // Apply scale factor to nodes y since we are scaling to min and x is min.
                newScale.y = nodeScale.y * scaleFactor.x;
            }
            else
            {
                // Apply scale factor to nodes x since we are scaling to min and y is min.
                newScale.x = nodeScale.x * scaleFactor.y;
            }
        }
        else
        {
            if( isXMin === true )
            {
                // Apply scale factor to nodes x since we are not scaling to min and x is min.
                newScale.x = nodeScale.x * scaleFactor.y;
            }
            else
            {
                // Apply scale factor to nodes y since we are not scaling to min and y is min.
                newScale.y = nodeScale.y * scaleFactor.x;
            }
        }

        return newScale;
    },

    /**
    * Returns an inverse of the scale passed in.
    *
    * @param {cc.p} Scale.
    *
    * @return {cc.p} Inverse scale.
    */
    getInverseScale: function( scale )
    {
        "use strict";

        var reciprocal = cc.p( 1 / scale.x, 1 / scale.y );
        return reciprocal;
    },

    /**
    * Returns an inverse scale of the content size passed in.
    *
    * @param {cc.p} Scale.
    * @param {cc.size} Content size.
    *
    * @return {cc.size} Inverse scale.
    */
    getInverseScaleContentSize: function( scale, contentSize )
    {
        "use strict";

        var inverseScale = LumosityUtils.getInverseScale( scale );
        var inverseScaleContentSize = cc.size( contentSize.width * inverseScale.x, contentSize.height * inverseScale.y );

        return inverseScaleContentSize;
    },

    /**
    * Returns the hierarchical scale of a given node.
    *
    * @param {cc.Node} Node.
    *
    * @return {cc.p} Hierarchical scale.
    */
    getNodeHierarchicalScale: function( node )
    {
        "use strict";

        var parent = node.getParent();
        var newScale = cc.p( 1, 1 );

        while( parent !== null )
        {   
            newScale.x = newScale.x * parent.getScaleX();
            newScale.y = newScale.y * parent.getScaleY();

            parent = parent.getParent();
        }
        
        return newScale;
    },

    /**
    * Returns the hierarchical uniform scale of a given node.
    *
    * @param {cc.Node} Node.
    *
    * @return {cc.p} Hierarchical uniform scale.
    */
    getNodeHierarchyUniformScale: function( node, scaleToMin )
    {
        "use strict";

        var parent = node.getParent();
        var uniformScale = cc.p( 1, 1 );
        var newScale = cc.p( 1, 1 );

        while( parent !== null )
        {   
            uniformScale = LumosityUtils.getNodeToParentUniformScale( node, parent, scaleToMin );
            newScale.x = newScale.x * uniformScale.x;
            newScale.y = newScale.y * uniformScale.y;

            parent = parent.getParent();
        }
        
        return newScale;
    },

    /**
     * Calls the passed function name on all of the collections' components. You can also pass in
     * an array of params to apply those to the function. For any components that do not
     * implement the desired function, they are simply ignored.
     * 
     * @param  {Object} collection An array of things to optionally call funcName on.
     * @param  {String} funcName   Name of the function to call.
     * @param  {Array} params      An array of parameters that will be passed to the function called. Optional.
     */
    callFunctionOnCollection: function( collection, funcName, params )
    {
        "use strict";

        this.forEachIn( collection, function( name, value )
        {
            if( typeof value[ funcName ] === "function" )
            {
                value[ funcName ].apply( value, params );
            }
        } );
    },

    resizeNode: function( node, newSize )
    {
        "use strict";

        var newWidth = newSize.width;
        var newHeight = newSize.height;

        var startWidth = node.getContentSize().width;
        var startHeight = node.getContentSize().height;

        var newScaleX = newWidth/startWidth;
        var newScaleY = newHeight/startHeight;

        node.setScaleX( newScaleX );
        node.setScaleY( newScaleY );
    },

    createRectangularSprite: function( size, color )
    {
        "use strict";

        //var sprite = cc.Sprite.create( "empty.png" );
        var sprite = cc.Sprite.create( res.empty );
        sprite.setAnchorPoint( cc.p( 0.5, 0.5 ) );
        sprite.setColor( color );
        LumosityUtils.resizeNode( sprite, size );
        return sprite;
    },

    randomBool: function( true_probability )
    {
        "use strict";

        true_probability = true_probability || 0.5;
        return Math.random() < true_probability;
    },

    /**
     * Copied from web version. Grabs a random element from left_array
     * that IS NOT contained in right_array. Convoluted.
     * 
     * @param  { array } left_array Must contain at least one object that is also in right_array. 
     * @param  { array } right_array Must contain at least one object that is also in left_array.
     * @return { object }            Returns randomly selected object.
     *  
     */
    otherElement: function( left_array, right_array )
    {
        "use strict";

        var copied_array = left_array.concat(),
            element = null,
            counter = null,
            index = null;
        for( counter = 0; counter < right_array.length; counter += 1 )
        {
            element = right_array[ counter ];
            index = copied_array.indexOf( element );

            while( index >= 0 )
            {
                copied_array.splice( index, 1 );
                index = copied_array.indexOf( element );
            }
        }
        return copied_array[ Math.floor( Math.random() * copied_array.length ) ];
    },

 
    /**
     * Creates a cc.Sequence from an arbitrary number of actions.
     *
     * @param actionArray   Array of actions comprising sequence.
     * @returns {cc.Sequence}
     */
    createSequenceWithArray:function( actionArray )
    {
        "use strict";

        if ( actionArray )
        {
            var prevAction = actionArray[0];
            var i;
            for ( i = 1; i < actionArray.length; i++ )
            {
                if ( actionArray[i] )
                {
                    prevAction = cc.Sequence.create( prevAction, actionArray[i] );
                }
            }
            return prevAction;
        }
    },
  

    /**
     * Returns whether a value is a number.
     *
     * @param n Some value, whatever really.
     * @returns {boolean}   Whether it's a number.
     */
    isNumeric:function( n )
    {
        "use strict";

        return !isNaN( parseFloat ( n ) ) && isFinite( n );
    },

    /**
     * Returns whether we're in debug mode.
     *
     * @returns {boolean} Whether we're in debug mode.
     */
    isDebugModeOn: function()
    {
        "use strict";

        if ( lumosity.game.params && ( ( lumosity.game.params.debug_mode === "true" ) || ( lumosity.game.params.debug_mode === true ) ) )
        {
            return true;
        }

        return false;
    },

    isShortGamesModeOn: function ()
    {
        "use strict";

        if ( lumosity.game.params && ( ( lumosity.game.params.short_game === "true" ) || ( lumosity.game.params.short_game === true ) ) )
        {
            return true;
        }

        return false;
    },

    isFitTestModeOn: function ()
    {
        "use strict";

        if ( lumosity.game.params && ( ( lumosity.game.params.fit_test_mode === "true" ) || ( lumosity.game.params.fit_test_mode === true ) ) )
        {
            return true;
        }

        return false;
    },

    isCollectingData: function ()
    {
        "use strict";

        if ( lumosity.game.params && ( ( lumosity.game.params.collect_data === "true" ) || ( lumosity.game.params.collect_data === true ) ) )
        {
            return true;
        }

        return false;    
    },

    /**
     * Returns a copy of a cc.Point.
     *
     * @param point The point to copy.
     * @returns {*} A new cc.Point.
     */
    copyPoint:function( point )
    {
        "use strict";

        if( point && point.x !== undefined && point.y !== undefined )
        {
            return cc.p( point.x, point.y );
        }
        return null;
    },

    /**
     * Returns the length of the string with given fontName and fontSize.
     * 
     * @param  {[type]} string   The string.
     * @param  {[type]} fontName The font name.
     * @param  {[type]} fontSize The font size.
     * 
     * @return {[type]}          The length of the text in pixels.
     */
    measureText: function( string, fontName, fontSize )
    {
        "use strict";

        var label = null;
        var stringWidth = 0;

        if( !string || !fontName || !fontSize )
        {
            cc.log( "LumosityUtils measureText() - Unable to measure text. Invalid parameter." );
            return;
        }

        label = cc.LabelTTF.create( string, fontName, fontSize );
        stringWidth = label.getContentSize().width;

        return stringWidth;
    },
    
    /**
     * Performs a shallow or deep duplication of an object.
     *
     * @param {Object} obj The object to duplicate.
     * @param {boolean} [deep=false] If true, is a deep copy (recursively copies all sub-objects).
     * @returns {Object} A new object that is a copy of what was passed in.
     */
    duplicateObject: function( obj, deep )
    {
        "use strict";

        if( obj === undefined )
        {
            return undefined;
        }

        //this is faster that our previous manual method (which was very slow)
        if ( deep )
        {
            return JSON.parse( JSON.stringify( obj ) );
        }
        
        //shallow copy
        var copy = obj.constructor();

        var key;
        for ( key in obj )
        {
            if ( obj.hasOwnProperty( key ) )
            {
                copy[ key ] = obj[ key ];
            }
        }
        
        return copy;
    },

    /**
     * Converts array into a string and places delimiterCharacter character every delimiterFrequency.
     *
     * @param {Array} array The array to be turned into a string.
     * @param {string} [delimiterCharacter=","] A character or string that will be concatenated between array elements. 
     * @param {number} [delimiterFrequency=1] If the array element index is divisible by this value, then the delimiter will be inserted there.
     * @returns {string} The concatenated string.
     */
    stringifyArray: function ( array, delimiterCharacter, delimiterFrequency )
    {
        "use strict";

        var result = "";

        if ( delimiterCharacter === undefined )
        {
            delimiterCharacter = ",";
        }

        if ( delimiterFrequency === undefined )
        {
            delimiterFrequency = 1;
        }

        var i;
        for ( i = 0; i < array.length; i++ )
        {
            result += array[ i ];

            if ( ( (i + 1) % delimiterFrequency === 0 ) && i !== array.length - 1 )
            {
                result += delimiterCharacter;
            }
        }

        return result;
    },
    
    /**
     * Converts a JS array to a CSV string. Will go into the first element in the array,
     * and use that object to find the headers. This only works for objects that are
     * one-level deep (as it should). If you have a multi-level object, then
     * [Object] or something similar will result for that element (using toString).
     * After finding the headers, will loop through all objects and assign values.
     *
     * @param {Array} jsArray The array to convert.
     * @param {boolean} [allowNewlines=false] Our metadata does not like newlines, and will use / instead.
     * @returns {string} A CSV-formatted string.
     */
    jsToCsv: function( jsArray, allowNewlines )
    {
        "use strict";

        //if there's an empty array, nothing to return
        if ( jsArray.length <= 0 )
        {
            return "";
        }
        
        var csv = "";
        var keys = [];
        
        var key;
        for ( key in jsArray[ 0 ] )
        {
            if ( jsArray[ 0 ].hasOwnProperty( key ) )
            {
                keys.push( key );
                csv += key + ",";
            }
        }
        
        //if we found no keys, nothing to return
        if ( keys.length <= 0 )
        {
            return "";
        }
        
        //pull the extra comma off the headers, and put in a \n
        csv = csv.substring( 0, csv.length - 1 ) + ( allowNewlines ? "\n" : "/" );
        
        //now create the string from every element
        var objectIndex;
        var keyIndex;
        for ( objectIndex = 0; objectIndex < jsArray.length; objectIndex++ )
        {
            for ( keyIndex = 0; keyIndex < keys.length; keyIndex++ )
            {
                csv += jsArray[ objectIndex ][ keys[ keyIndex ] ];
                
                if ( keyIndex < keys.length - 1 )
                {
                    csv += ",";
                }
            }
            
            if ( objectIndex < jsArray.length - 1 )
            {
                csv += ( allowNewlines ? "\n" : "/" );
            }
        }
        
        //now replace all \n with a /
        if ( !allowNewlines )
        {
            csv.replace( "/\n/g", "/" );
        }
        
        return csv;
    },

    addTrailingSlashToPath: function( path )
    {
        path += ( path.charAt( path.length - 1 ) === "/" ) ? "" : "/";
        return path;
    },
    
    getSplitTestAssignment: function( splitTestName )
    {
        var assignment = "control";
        if(lumosity.game.params.hasOwnProperty("split_tests"))
        {
            var tests = JSON.parse(lumosity.game.params.split_tests);
            if( tests.hasOwnProperty( splitTestName ) )
            {
                assignment = tests[ splitTestName ];
            }
        }
        return assignment;
    },
    
    getAllSplitTestAssignments: function()
    {
        var tests = "";
        if(lumosity.game.params.hasOwnProperty("split_tests"))
        {
            tests = lumosity.game.params.split_tests;
        }
        return tests;
    },
 
    hasSplitTestAssignments: function()
    {
        return lumosity.game.params.hasOwnProperty("split_tests");
    },

    contains : function(arr, obj) {  
        var i = arr.length;  
        while (i--) {
            if (arr[i] === obj) {  
                return true;  
            }  
        }  
        return false;  
    },
};


var lu = LumosityUtils;
