/*global cc*/
/*global require*/
/*global lumosity*/
/*global localize*/

// require( "src/Utility/LumosityUtils.js" );
// /*global LumosityUtils*/

// require( "src/View/LumosityLabel.js" );
// /*global LumosityLabel*/

// require( "src/Animation/AnimationChanges.js" );
// /*global AnimationChanges*/

// require( "src/View/LumosityButton.js" );
// /*global LumosityButton*/
// /*global LumosityButtonState*/

var __layoutDebugLogging = false;
var __layoutDebugLoggingNodeName = "";
var __layoutDebugLog = function( string, nodeName )
{
    "use strict";
    if ( __layoutDebugLogging && ( __layoutDebugLoggingNodeName === "" || __layoutDebugLoggingNodeName === nodeName ) )
    {
        cc.log( "[LayoutLoader] " + nodeName + " " + string );
    }
};

var LayoutNodeFlags =
{
    /* Scale applied to root object ( Device Resolution Scale )*/
    RootScale: 1 << 1,
    /* Scale applied by sliders in the layout GUI*/
    FactorScale: 1 << 2,
    /* Apply default ignoredChanges to the node*/
    IgnoredAnimationChanges: 1 << 3,
    /* Apply label dimension to any labels*/
    LabelDimensions: 1 << 4,
    /* Set the localized text key*/
    LocalizedTextKey: 1 << 5,
    /* Set the color*/
    Color: 1 << 6,
    /* Set the alpha*/
    Alpha: 1 << 7
};

/**
 * The LayoutLoader takes layout data and instantiates nodes based on it.
 * This includes resizing data, which the animation controller will use for animation.
 * If the Flash file isn't structured correctly to create the right type of node, or if
 * you want to override the behavior of creating a specific node, you can pass a funciton
 * into the creation function. That function will get the node data from the layout file so
 * you can do as you wish. If your funciton returns a node, the default creation will not happen.
 *
 * Instead of a create function, you may also pass in a delegate. The delegate can control
 * literally everything the LayoutLoader tries to do, if desired. Delegate functions are:
 *
 * layout_readingData( nodeName, nodeData )
 * layout_creatingNode( nodeName, nodeData )
 * layout_addingNodeToParent( nodeName, nodeData, node, parentNode )
 * layout_writingNodeToDictionary( nodeName, nodeData, node, viewDictionary )
 * layout_settingNodeSize( nodeName, nodeData, node, size )
 * layout_settingNodeAnchor( nodeName, nodeData, node, anchor )
 * layout_settingNodeResizingInfo( nodeName, nodeData, node, resizingData )
 * layout_settingNodeFlags( nodeName, nodeData, node )
 * layout_settingNodeFrame( nodeName, nodeData, node, origin, size )
 * layout_wrappingUp( nodeName, nodeData, node )
 *
 * @class
 */
var LayoutLoader;
( function()
{
    "use strict";
    
    LayoutLoader =
    {
        sourceSizeKey: "sourceSize",
        typeKey: "type",
        imageKey: "image",
        zOrderKey: "zOrder",
        sizeKey: "size",
        
        textDataKey: "textData",
        textStringKey: "string",
        textKeyKey: "textKey",
        fontKey: "face",
        fontSizeKey: "size",
        fontAlignmentKey: "alignment",
        fontAlignsLeftKey: "left",
        fontAlignsRightKey: "right",
        fontAlignsCenterKey: "center",
        fontVerticalAlignmentKey: "verticalAlignment",
        fontAlignsTopKey: "top",
        fontAlignsBottomKey: "bottom",
        fontStyleKey: "style",
        fontColorKey: "color",
        fontColorRedKey: "Red",
        fontColorGreenKey: "Green",
        fontColorBlueKey: "Blue",
        fontColorAlphaKey: "Alpha",
        
        resizingKey: "resizing",
        pinsKey: "pins",
        pinsNorthKey: "north",
        pinsEastKey: "east",
        pinsSouthKey: "south",
        pinsWestKey: "west",
        widthChangeKey: "widthChange",
        heightChangeKey: "heightChange",
        maintainsAspectKey: "maintainAspect",
        aspectTypeKey: "aspectType",
        aspectMaxKey: "max",
        aspectMinKey: "min",
        aspectWidthKey: "x",
        aspectHeightKey:"y",
        spritesheetFormatKey: "spritesheetFormat",

        viewPortPosition: "viewPortPosition",
        
        colorKey: "color",
        colorRedKey: "r",
        colorGreenKey: "g",
        colorBlueKey: "b",
        
        alphaKey: "alpha",
        
        buttonDataKey: "buttonData",
        buttonTitleKey: "title",
        buttonStateNormalKey: "normal",
        buttonStateHighlightedKey: "highlighted",
        buttonStateDisabledKey: "disabled",
        buttonStateSelectedKey: "selected",
        buttonBackgroundImageKey: "backgroundImage",
        buttonIconImageKey: "iconImage",
        buttonTitleColorKey: "titleColor",
        buttonEnabledKey: "enabled",
        buttonCallbackPressedKey: "pressedCallback",
        buttonCallbackHeldKey: "heldCallback",
        buttonCallbackReleasedKey: "releasedCallback",
        buttonLabelKey: "titleLabel",
        
        childrenKey: "children",
        
        //for now, this should always be false. we can toggle it on to resize the entire view hierarchy
        resizeHierarchy: false,
        
        /**
         * Loads a layout from a JSON file. Will create all the required nodes
         * and will assign the resizing data to the object as another property.
         *
         * @param {string} filePath The path of the file to laod the layout from.
         * @param {cc.Node} [rootNode] If provided, all nodes will be created here. If not, a new node will be created.
         * @param {Object} [viewDictionary=rootNode] Created nodes will be put into this object, with their nodeName as the key.
         * @param {function|Object} [createFunctionOrDelegate] If provided, this function will be called whenever we try to create a node.
         * @returns {cc.Node} The parent node that the layout was created in. Same as parentNode if it was passed in.
         */
        loadLayoutFile: function( filePath, rootNode, viewDictionary, createFunctionOrDelegate )
        {            
            //var fileContents = lumosity.io_read( filePath );
            var fileContents = cc.loader._loadTxtSync( filePath );
            var fileData = JSON.parse( fileContents, null );
            
            return this.loadLayout( fileData, rootNode, viewDictionary, createFunctionOrDelegate );
        },
        
        /**
         * Loads a layout from a layout data object. Will create all the required nodes
         * and will assign the resizing data to the object as another property. Note that this
         * will overwrite any elements called nodeName that already exist in the parentNode.
         *
         * @param {Object} layoutData The data to load the layout from.
         * @param {cc.Node} [rootNode] If provided, all nodes will be created here. If not, a new node will be created.
         * @param {Object} [viewDictionary=rootNode] Created nodes will be put into this object, with their nodeName as the key.
         * @param {function|Object} [createFunctionOrDelegate] If provided, this function will be called whenever we try to create a node.
         * @returns {cc.Node} The parent node that the layout was created in. Same as rootNode if it was passed in.
         */
        loadLayout: function( layoutData, rootNode, viewDictionary, createFunctionOrDelegate )
        {
            if ( !layoutData )
            {
                return null;
            }
            
            if ( !rootNode )
            {
                rootNode = cc.Node.create();
                rootNode.setContentSize( cc.Director.getInstance().getWinSize() );
            }
            viewDictionary = viewDictionary || rootNode;
            
            rootNode.sourceSize = layoutData[ this.sourceSizeKey ] || rootNode.getContentSize();
            //rootNode.layoutSize = rootNode.sourceSize;
            
            //find our global scale
            var viewSize = rootNode.getContentSize();
            rootNode.globalScale =      cc.p( viewSize.width / rootNode.sourceSize.width, viewSize.height / rootNode.sourceSize.height );
            rootNode.globalSizeChange = cc.p( viewSize.width - rootNode.sourceSize.width, viewSize.height - rootNode.sourceSize.height );
            viewDictionary.globalScale = rootNode.globalScale;
            viewDictionary.globalSizeChange = rootNode.globalSizeChange;

            //cc.log( "rootNode NodeName: " + rootNode.nodeName + " globalScale: " + JSON.stringify( rootNode.globalScale ) );
            //cc.log( "viewSize.width: " + viewSize.width + " rootNode.sourceSize.width: " + JSON.stringify( rootNode.sourceSize.width ) );
            
            LumosityUtils.forEachIn( layoutData.nodes, function( createFunctionOrDelegate, nodeName, nodeData )
            {
                this.doNodeDataRead( nodeName, nodeData, createFunctionOrDelegate );
            }.bind( this, createFunctionOrDelegate ) );
            
            LumosityUtils.forEachIn( layoutData.nodes, function( rootNode, viewDictionary, createFunctionOrDelegate, nodeName, nodeData )
            {
                this.createNodeFromData( nodeData, nodeName, rootNode, rootNode, viewDictionary, createFunctionOrDelegate );
            }.bind( this, rootNode, viewDictionary, createFunctionOrDelegate ) );
            
            return rootNode;
        },
        
        /**
         * Creates a node from layout data.
         *
         * @param {Object} nodeData The data for the node.
         * @param {string} nodeName The name of this node.
         * @param {cc.Node} rootNode The root node, where we'll be putting references to each node.
         * @param {cc.Node} parentNode The parent node where we'll add this node as a child.
         * @param {Object} [viewDictionary=rootNode] Created nodes will be put into this object, with their nodeName as the key.
         * @param {function|Object} [createFunctionOrDelegate] The function to call for creating nodes.
         * @returns {Array} An array of cc.Node objects, since multiple nodes can be created if children are created.
         */
        createNodeFromData: function( nodeData, nodeName, rootNode, parentNode, viewDictionary, createFunctionOrDelegate )
        {
            var createdNodes = [];
            
            //if there is no node data, just return an empty array
            if ( !nodeData )
            {
                return createdNodes;
            }
            
            var node = this._doNodeCreation( nodeData, nodeName, parentNode, createFunctionOrDelegate );

            //it's possible we didn't want a node created, or there could have been mangled JSON, so make sure we have a node
            if ( node )
            {
                //put the node in the list, add it to its parent, and make it referenced in the root
                createdNodes.push( node );

                //it's very useful for the node to have a name so you can know what node you're looking at
                //if ( !node.nodeName )
                //{
                    node.nodeName = nodeName;
                //}

                node.isRootNode = ( rootNode === parentNode );

                //add the node to its parent
                this._doAddToParent( node, nodeData, parentNode, createFunctionOrDelegate );

                //write the node into the view dictionary so it can be accessed later
                this._doWriteToDictionary( node, nodeData, viewDictionary || rootNode, createFunctionOrDelegate );
                
                //we need to set the size of the node so that we know how much to scale it by on different devices
                this._doSetNodeSize( node, nodeData, createFunctionOrDelegate );

                //the anchor also needs to be set to correctly handle children and the like
                this._doSetAnchor( node, nodeData, createFunctionOrDelegate );

                //dump in the resizing data so the animation controller can get at it
                this._doAssignResizingInfo( node, nodeData, createFunctionOrDelegate );

                //any nodes that are a direct child of the root should always be resized
                this._doSetFlags( node, nodeData, rootNode, parentNode, createFunctionOrDelegate );
                
                //now give our nodes their initial frame on the screen
                this._doSetFrame( node, nodeData, rootNode.globalSizeChange, rootNode.globalScale, createFunctionOrDelegate );
                
                //wrap it up
                this._doWrapUp( node, nodeData, createFunctionOrDelegate );
            }
        
            //if we have children, create all of them as well
            if ( nodeData[ this.childrenKey ] )
            {
                var self = this;
                var createdChildren;
                LumosityUtils.forEachIn( nodeData[ this.childrenKey ], function( childNodeName, childData )
                {
                    createdChildren = self.createNodeFromData( childData, childNodeName, rootNode, node, viewDictionary, createFunctionOrDelegate );
                    createdNodes.addAll( createdChildren );
                } );
            }
            
            return createdNodes;
        },
        
        doNodeDataRead:function( nodeName, nodeData, createFunctionOrDelegate )
        {
            //if you have a create delegate, instead call a function on that object
            if ( createFunctionOrDelegate && createFunctionOrDelegate.layout_readingData )
            {
                createFunctionOrDelegate.layout_readingData( nodeName, nodeData );
                
                //if we have children, do all their data as well
                if ( nodeData[ this.childrenKey ] )
                {
                    LumosityUtils.forEachIn( nodeData[ this.childrenKey ], function( createFunctionOrDelegate, childNodeName, childData )
                    {
                        this.doNodeDataRead( childNodeName, childData, createFunctionOrDelegate );
                    }.bind( this, createFunctionOrDelegate ) );
                }
            }
        },
        
        _doNodeCreation:function( nodeData, nodeName, parentNode, createFunctionOrDelegate )
        {
            var node;
            
            //if you have a create delegate, instead call a function on that object
            if ( createFunctionOrDelegate )
            {
                if ( createFunctionOrDelegate.layout_creatingNode )
                {
                    node = createFunctionOrDelegate.layout_creatingNode( nodeName, nodeData );
                }
                //if you have a create function, assign the node from the value we got there
                else if ( typeof createFunctionOrDelegate === "function" )
                {
                    node = createFunctionOrDelegate( nodeName, nodeData );
                }
            }
            
            //if the create function didn't create the node, do the default behavior based on the data we have
            if ( parentNode && ( node === undefined || node === null ) )
            {
                switch ( nodeData[ this.typeKey ] )
                {
                    case "sprite":
                        node = cc.Sprite.prototype.createSprite( nodeData[ this.imageKey ], nodeData[ this.spriteSheetNameKey ], nodeData[ this.spritesheetFormatKey ] );
                    break;
                    case "text":
                        //node = this.createLabel( nodeData[ this.textDataKey ] );
                    break;
                    case "button":
                        node = this.createButton( nodeData[ this.buttonDataKey ], createFunctionOrDelegate );
                    break;
                    case "node":
                        node = cc.Node.create();
                    break;
                }
            }

            if ( node )
            {
                __layoutDebugLog( "was created.", nodeName );
            }
            else
            {
                __layoutDebugLog( "was not created.", nodeName );
            }
            
            return node;
        },
        
        _doAddToParent:function( node, nodeData, parentNode, createFunctionOrDelegate )
        {
            var add = true;
            if ( createFunctionOrDelegate && createFunctionOrDelegate.layout_addingNodeToParent )
            {
                add = createFunctionOrDelegate.layout_addingNodeToParent( node.nodeName, nodeData, node, parentNode );
            }
            
            if ( add )
            {
                if ( parentNode && !node.doNotAdd )
                {
                    if ( node.getParent() )
                    {
                        __layoutDebugLog( "was removed from its previous parent " + node.getParent().nodeName, node.nodeName );
                        node.removeFromParent( false );
                    }
                    
                    parentNode.addChild( node, nodeData[ this.zOrderKey ] || 0 );
                    __layoutDebugLog( "was added to parent " + parentNode.nodeName + " at Z-order " + (nodeData[ this.zOrderKey ] || 0), node.nodeName );
                }
                else
                {
                    __layoutDebugLog( "was not added to the parent because there was no parent to add to", node.nodeName );
                }
            }
            else
            {
                __layoutDebugLog( "was not added to the parent because it was told not to", node.nodeName );
            }
        },
        
        _doWriteToDictionary:function( node, nodeData, viewDictionary, createFunctionOrDelegate )
        {
            var write = true;
            if ( createFunctionOrDelegate && createFunctionOrDelegate.layout_writingNodeToDictionary )
            {
                write = createFunctionOrDelegate.layout_writingNodeToDictionary( node.nodeName, nodeData, node, viewDictionary );
            }

            if ( write && viewDictionary )
            {
                if ( viewDictionary[ node.nodeName ] && viewDictionary[ node.nodeName ] !== node )
                {
                    cc.log( "[LayoutLoader] WARNING: There is already an element with the key of \"" + node.nodeName + "\"! Refusing to replace it. Careful of namespace conflicts." );
                }
                else
                {
                    viewDictionary[ node.nodeName ] = node;
                    __layoutDebugLog( "was assigned to the view dictionary.", node.nodeName );
                }
            }
        },
        
        _doSetNodeSize:function( node, nodeData, createFunctionOrDelegate )
        {
            var setSize = true;
            if ( createFunctionOrDelegate && createFunctionOrDelegate.layout_settingNodeSize )
            {
                setSize = createFunctionOrDelegate.layout_settingNodeSize( node.nodeName, nodeData, node, nodeData.size );
            }
            
            //the content size needs to be set from the layout data so that it can be resized properly
            if ( setSize && nodeData.size )
            {
                if ( !( node instanceof cc.LabelTTF ) && ( node instanceof cc.Sprite ) )
                {
                    node.layoutSize = cc.size( node.getContentSize().width, node.getContentSize().height );
                    __layoutDebugLog( "is setting only layoutSize to " + JSON.stringify( node.layoutSize ), node.nodeName );
                }
                else
                {
                    node.setContentSize( cc.size( nodeData.size.width, nodeData.size.height ) );
                    node.layoutSize = cc.size( nodeData.size.width, nodeData.size.height );
                    __layoutDebugLog( "is setting layoutSize and contentSize to " + JSON.stringify( node.layoutSize ), node.nodeName );
                }

                // Whenever we are setting dimensions for text, we need to know original text box size.
                if ( node instanceof cc.LabelTTF )
                {
                    node.textBoxSize = cc.size( nodeData.size.width, nodeData.size.height );
                }
            }
            else
            {
                __layoutDebugLog( "is not setting size either because we have no size data for it or our delegate told us not to.", node.nodeName );
            }
        },
        
        _doSetAnchor:function( node, nodeData, createFunctionOrDelegate )
        {
            var localAnchor;

            if ( nodeData[ this.viewPortPosition ] )
            {
                localAnchor = nodeData.anchor;
            }
            else
            {
                //the Y must be flipped because the openGL and Flash contexts are opposite
                localAnchor = nodeData.anchor ? cc.p( nodeData.anchor.x, 1.0 - nodeData.anchor.y ) : undefined;
            }
            
            var setAnchor = true;
            if ( createFunctionOrDelegate && createFunctionOrDelegate.layout_settingNodeAnchor )
            {
                setAnchor = createFunctionOrDelegate.layout_settingNodeAnchor( node.nodeName, nodeData, node, localAnchor );
            }
            
            if ( setAnchor && localAnchor )
            {
                node.setAnchorPoint( localAnchor );
                __layoutDebugLog( "is setting anchor to " + JSON.stringify( localAnchor ), node.nodeName );
            }
            else
            {
                __layoutDebugLog( "is not setting anchor either because we have no anchor for it or our delegate told us not to.", node.nodeName );
            }
        },
        
        _doAssignResizingInfo:function( node, nodeData, createFunctionOrDelegate )
        {
            var assign = true;
            if ( createFunctionOrDelegate && createFunctionOrDelegate.layout_settingNodeResizingInfo )
            {
                assign = createFunctionOrDelegate.layout_settingNodeResizingInfo( node.nodeName, nodeData, node, nodeData[ this.resizingKey ] );
            }
            
            if ( assign && !node[ this.resizingKey ] )
            {
                node[ this.resizingKey ] = nodeData[ this.resizingKey ];
                __layoutDebugLog( "is setting resizing info to " + JSON.stringify( nodeData[ this.resizingKey ] ), node.nodeName );
            }
            else
            {
                __layoutDebugLog( "is not setting resizing info either because we have no resizing info for it or our delegate told us not to.", node.nodeName );
            }
        },
        
        _doSetFlags:function( node, nodeData, rootNode, parentNode, createFunctionOrDelegate )
        {
            var nodeFlags = 0xFF;
            if( createFunctionOrDelegate && createFunctionOrDelegate.layout_settingNodeFlags )
            {
                nodeFlags = createFunctionOrDelegate.layout_settingNodeFlags( node.nodeName, nodeData, node, rootNode === parentNode, node instanceof cc.LabelTTF );
            }

            node.layoutNodeFlags = nodeFlags;

            // Currently only rootNodes can be resized.
            if( !node.isRootNode )
            {
                node.layoutNodeFlags &= ~( LayoutNodeFlags.RootScale | LayoutNodeFlags.FactorScale );
            }

            //scales as a root element
            if( node.layoutNodeFlags & LayoutNodeFlags.RootScale )
            {
                __layoutDebugLog( "enable resolution scale.", node.nodeName );
            }
            else
            {
                __layoutDebugLog( "disable resolution scale.", node.nodeName );
            }

            //factor scale... what does that mean?
            // Factor scale is the scale that comes from the flash files slider values.
            if( node.layoutNodeFlags & LayoutNodeFlags.FactorScale )
            {
                __layoutDebugLog( "enable factor scale.", node.nodeName );
            }
            else
            {
                __layoutDebugLog( "disable factor scale.", node.nodeName );
            }

            //default ignored animation changes
            if( node.layoutNodeFlags & LayoutNodeFlags.IgnoredAnimationChanges )
            {
                if( node instanceof cc.LabelTTF )
                {
                    AnimationChanges.addNodeIgnoredChanges( node, AnimationChanges.Scale );
                    __layoutDebugLog( "disable scale for label.", node.nodeName );
                }
                
                __layoutDebugLog( "enable default ignored changes.", node.nodeName );
            }
            else
            {
                __layoutDebugLog( "disable default ignored changes.", node.nodeName );
            }
            
            //label dimensions
            if( node.layoutNodeFlags & LayoutNodeFlags.LabelDimensions )
            {
                if( node.setDimensions )
                {
                    var dim = cc.size( node.layoutSize.width, 0 );
                    node.setDimensions( dim );
                    
                    __layoutDebugLog( "enable label dimensions.", node.nodeName );
                }
            }
            else
            {
                __layoutDebugLog( "disable label dimensions.", node.nodeName );
            }

            //label text key
            if ( node.layoutNodeFlags & LayoutNodeFlags.LocalizedTextKey )
            {
                if( nodeData[ this.textDataKey ] && nodeData[ this.textDataKey ][ this.textKeyKey ] && node.setString )
                {
                    node.setString( localize( nodeData[ this.textDataKey ][ this.textKeyKey ], nodeData[ this.textDataKey ][ this.textStringKey ] ) );
                    node.localizationKey = nodeData[ this.textDataKey ][ this.textKeyKey ];
                    
                    __layoutDebugLog( "is setting localized string to key " + nodeData[ this.textDataKey ][ this.textKeyKey ] + " with default string " + nodeData[ this.textDataKey ][ this.textStringKey ], node.nodeName );
                }
            }
            else
            {
                __layoutDebugLog( "disable localized string setting.", node.nodeName );
            }
            
            if ( node.layoutNodeFlags & LayoutNodeFlags.Color )
            {
                if ( nodeData[ this.colorKey ] && node.setColor )
                {
                    var color = this.getColor( nodeData[ this.colorKey ] );
                    node.setColor( color );
                    
                    __layoutDebugLog( "is setting color to " + JSON.stringify( nodeData[ this.colorKey ] ), node.nodeName );
                }
            }
            else
            {
                __layoutDebugLog( "disable color setting.", node.nodeName );
            }
            
            if ( node.layoutNodeFlags & LayoutNodeFlags.Alpha )
            {
                if ( nodeData[ this.alphaKey ] !== undefined && node.setOpacity )
                {
                    var alpha255 = Math.floor( nodeData[ this.alphaKey ] * 255 );
                    node.setOpacity( alpha255 );
                    
                    __layoutDebugLog( "is setting alpha to " + alpha255, node.nodeName );
                }
            }
            else
            {
                __layoutDebugLog( "disable alpha setting.", node.nodeName );
            }
            
        },
        
        _doSetFrame:function( node, nodeData, globalSizeChange, globalScale, createFunctionOrDelegate )
        {
            var setFrame = true;
            if ( createFunctionOrDelegate && createFunctionOrDelegate.layout_settingNodeFrame )
            {
                setFrame = createFunctionOrDelegate.layout_settingNodeFrame( node.nodeName, nodeData, node, nodeData.origin, nodeData.size );
            }
            
            if ( setFrame )
            {
                var pos;
                if ( nodeData[ this.viewPortPosition ] )
                {
                    var windowSize = cc.Director.getInstance().getWinSize();
                    var viewPortPosition = nodeData[ this.viewPortPosition ];
                    node.viewPortPosition = nodeData[ this.viewPortPosition ];

                    pos = cc.p ( windowSize.width * viewPortPosition.x, windowSize.height * viewPortPosition.y );
                }

                if ( nodeData.origin && nodeData.size )
                {
                    if ( pos === undefined )
                    {
                        pos = LayoutLoader.convertDesignPointToWorldPoint( node, nodeData.origin, nodeData.size, globalSizeChange );
                    }

                    var scale = LayoutLoader.convertDesignSizeToWorldScale( node, nodeData.size, globalScale );
                    
                    if ( !AnimationChanges.nodeIgnoresChange( node, AnimationChanges.Position ) )
                    {
                        node.setPosition( pos );
                    }
                    
                    if ( !AnimationChanges.nodeIgnoresChange( node, AnimationChanges.Scale ) )
                    {
                        node.setScaleX( scale.x );
                        node.setScaleY( scale.y );
                    }
                    
                     __layoutDebugLog( "is setting the frame to " + JSON.stringify( pos ) + " " + JSON.stringify( scale ), node.nodeName );
                }
                else
                {
                    __layoutDebugLog( "is not setting the frame because our nodeData didn't have both an origin and a size.", node.nodeName );
                }
            }
            else
            {
                __layoutDebugLog( "is not setting the frame becuase our delegate told us not to.", node.nodeName );
            }
        },
        
        _doWrapUp:function( node, nodeData, createFunctionOrDelegate )
        {
            if ( createFunctionOrDelegate && createFunctionOrDelegate.layout_wrappingUp )
            {
                createFunctionOrDelegate.layout_wrappingUp( node.nodeName, nodeData, node );
            }
        },
        
        assignLayoutDataToNode:function( node, nodeName, layoutSize, resizingData )
        {
            node.nodeName = nodeName;
            node.layoutSize = layoutSize;
            
            if ( !( node instanceof cc.Sprite ) )
            {
                node.setContentSize( cc.size( layoutSize.width, layoutSize.height ) );
            }
            
            node[ this.resizingKey ] = resizingData;
        },
        
        createResizingData:function( pinsNorth, pinsEast, pinsSouth, pinsWest, widthChange, heightChange, maintainsAspect, aspectType )
        {
            var data = {};
            
            data[ this.pinsKey ] = {};
            data[ this.pinsKey ][ this.pinsNorthKey ] = !!pinsNorth;
            data[ this.pinsKey ][ this.pinsEastKey ] = !!pinsEast;
            data[ this.pinsKey ][ this.pinsSouthKey ] = !!pinsSouth;
            data[ this.pinsKey ][ this.pinsWestKey ] = !!pinsWest;
            
            data[ this.widthChangeKey ] = widthChange;
            data[ this.heightChangeKey ] = heightChange;
            
            data[ this.maintainsAspectKey ] = maintainsAspect;
            data[ this.aspectTypeKey ] = aspectType;
            
            return data;
        },
        
        /**
         * This function does the important job of storing relative scales based upon the differences
         * from the root sceen size. It must be called after the layout is created in order to ensure
         * the proper resizing happens as animations play. For example, if the root needs to be scaled
         * (2,2), then we must propegate to the children the actual scale they should apply based on
         * their own widthScaleChange and heightScaleChange.
         *
         * @param {cc.Node} rootNode The node that is the root of the hierarchy.
         * @param {cc.Size} [rootSize=rootNode.getContentSize()] The size of the root node. This will be compared to the sourceSize.
         * @param {cc.Size} [sourceSize=rootNode.sourceSize] The source size of the root node. Compared to the rootSize.
         */
        applyResizingInformationToHierarchy:function( rootNode, rootSize, sourceSize )
        {
            rootSize = rootSize || rootNode.getContentSize();
            sourceSize = sourceSize || rootNode.sourceSize || rootSize;
            
            var scale = cc.p( rootSize.x / sourceSize.x, rootSize.y / sourceSize.y );
            //this.resizeScale( rootNode, s)
            rootNode.setScaleX( scale.x );
            rootNode.setScaleY( scale.y );
            
            //TODO - this is on hold for the moment. Essentially, we need to calculate scale to apply to
            //all of our children upon creation so that we can properly pin, etc. when our parent is scaled.
            //Since scale automatically applies to children, there is no way to do behavior that is beyond
            //simply scaling up without doing something like this.
        },
        
        /**
         * Recursive helper for applyResizingInformationToHierarchy().
         * 
         * @param {cc.Node} node The node to apply scale to.
         * @param {cc.Node} parentNode The parent node to compare to. If null, we do nothing to the node.
         */
        _applyResizingInformationToNode:function( /* node, parentNode */ )
        {
            cc.log( "LayoutLoader::_applyResizingInformationToNode" );
        },
        
        /**
         * Converts a point from the design resolution into world space.
         * This includes an anchor change and layout auto-resizing.
         * Note that the actual point passed in is changed.
         *
         * @param {cc.Node} node The node that the point corresponds to.
         * @param {cc.Point} point The point to convert.
         * @param {cc.Point} [designSize] The size of the element in the design resolution. If it does not exist, we will assume the point is already converted for the anchor.
         * @param {cc.Point} globalSizeChange The size that is the difference between the device size and the design size.
         * @returns {cc.Point} The adjusted point.
         */
        convertDesignPointToWorldPoint:function( node, point, designSize, globalSizeChange )
        {
            if ( !node.getParent() )
            {
                return point;
            }
            
            var position = cc.p( point.x, point.y );
            
            if ( node.nodeName === __layoutDebugLoggingNodeName )
            {
                __layoutDebugLog( "started with position of " + JSON.stringify( position ), node.nodeName );
            }
            
            //the layout may or may not change the position, based on the resizing information in this node.
            //this must happen in the space of the Flash file, so before we translate
            LayoutLoader.resizePosition( node, position, globalSizeChange );
            
            if ( node.nodeName === __layoutDebugLoggingNodeName )
            {
                __layoutDebugLog( "auto-resized position became " + JSON.stringify( position ), node.nodeName );
            }
            
            //use the layout size to determine size for flipping the Y, if possible
            var parentSize = node.getParent().getContentSize();
            var parentHeight = parentSize ? parentSize.height : 0;
            var nodeAnchor = node.getAnchorPoint();
            
            if ( designSize )
            {
                //because the position that is passed in is the top-left, we need to move it based on our anchor point.
                position.x += designSize.width * nodeAnchor.x;
            }
            
            //we also need to flip both the Y relative to the parent and the parent's anchor adjustment because of openGL vs Flash
            position.y = parentHeight - ( position.y + ( designSize ? designSize.height * ( 1.0 - nodeAnchor.y ) : 0.0 ) );   //distance from bottom of screen to center of sprite
      
            if ( node.nodeName === __layoutDebugLoggingNodeName )
            {
                __layoutDebugLog( "anchor adjustment gave a position of " + JSON.stringify( position ), node.nodeName );
            }
            
            return position;
        },
        
        /**
         * Converts a size from the design resolution into world space.
         * This includes an adjustment for the difference in the node's size from the design.
         * Note that the actual size passed in is changed.
         *
         * @param {cc.Node} node The node that the size corresponds to.
         * @param {cc.Size} size The point to convert.
         * @param {cc.Point} globalScale The scale that is the difference between the device and the design.
         */
        convertDesignSizeToWorldScale:function( node, size, globalScale )
        {
            //should eliminate this, I think.... commented out for now because I don't think we want it.
            //Instead, when actually applying scale you should check for ignored changes
            // if ( AnimationChanges.nodeIgnoresChange( AnimationChanges.Scale ) ) 
//             {
//                 return { x: 1, y: 1 };
//             }
            
            //the scale starts with the layout determining how it should differ, using its resizing info
            var scale = cc.p( 1.0, 1.0 );
            var contentSize = node.layoutSize || node.getContentSize();
            
            if ( node.nodeName === __layoutDebugLoggingNodeName )
            {
                __layoutDebugLog( "started with size of " + JSON.stringify( size ) + " and a layoutSize of " + JSON.stringify( contentSize ), node.nodeName );
            }
            
            //once we have a base scale, we want to multiply that by the desired size versus the content size
            if ( contentSize.width !== 0 && contentSize.height !== 0 )
            {
                scale.x *= ( size.width  / contentSize.width  );
                scale.y *= ( size.height / contentSize.height );
            }
            
            if ( node.nodeName === __layoutDebugLoggingNodeName )
            {
                __layoutDebugLog( "contentSize gave a scale of " + JSON.stringify( scale ), node.nodeName );
            }
            
            //the layout may or may not change the scale, based on the resizing information in this node.
            //this must happen after we've calculated the difference in scale for the layout
            LayoutLoader.resizeScale( node, scale, globalScale );
            
            if ( node.nodeName === __layoutDebugLoggingNodeName )
            {
                __layoutDebugLog( "auto-resized scale became " + JSON.stringify( scale ), node.nodeName );
            }
            
            return scale;
        },
        
        /**
         * If the passed node has resizing data, this function will modify the passed point by
         * transforming it with the resizing data.
         *
         * @param {cc.Node} node The node to check the resizing data for.
         * @param {cc.Point} point The point to modify.
         * @param {cc.Point} sizeChange The change in size from the source file to the target.
         */
        resizePosition:function( node, point, sizeChange )
        {
            if ( node[ this.resizingKey ] )
            {
                if ( this.resizeHierarchy || node.isRootNode )
                {
                    //maybe need to do something like this...
                    // var scale = cc.p( 1.0, 1.0 );
                    // var myScale = this.resizeScale( node, scale, scaleChange );
                    // point.x *= scale.x;
                    // point.y *= scale.y;
                    
                    var pins = node[ this.resizingKey ][ this.pinsKey ];
                    if ( pins )
                    {
                        //var usedSizeChange = cc.p( sizeChange.x * ( point.x < 0 ? -1 : 1 ), sizeChange.y * ( point.y < 0 ? -1 : 1 ) );
                        var usedSizeChange = cc.p( sizeChange.x, sizeChange.y );

                        //with no east or west pinning, that means that X is centered
                        if ( !pins[ this.pinsEastKey ] && !pins[ this.pinsWestKey ] )
                        {
                            point.x += usedSizeChange.x / 2.0;
                        }
                        //with just east pinning, that means that X must shift the entire change
                        else if ( pins[ this.pinsEastKey ] )
                        {
                            point.x += usedSizeChange.x;
                        }
                        //with just west pinning, that means we don't change the X at all
                    
                        //with no north or south pinning, that means that Y is centered
                        if ( !pins[ this.pinsNorthKey ] && !pins[ this.pinsSouthKey ] )
                        {
                            point.y += usedSizeChange.y / 2.0;
                        }
                        //with just south pinning, that means that Y must shift the entire change
                        else if ( pins[ this.pinsSouthKey ] )
                        {
                            point.y += usedSizeChange.y;
                        }
                        //with just north pinning, that means we don't change the Y at all
                    }
                }
            }
        },

        /**
         * If the passed node has resizing data, this function will modify the passed point by
         * transforming it with the resizing data.
         *
         * @param {cc.Node} node The node to check the resizing data for.
         * @param {cc.Point} startScale The scale that we started with, this will be modified.
         * @param {cc.Point} resolutionScale The scale change to apply.
         */
        resizeScale:function( node, startScale, resolutionScale )
        {
            var factorScale = cc.p( 1, 1 );
            var rootScale = cc.p( 1, 1 );
            var aspectScale = cc.p( 1, 1 );
            var layoutNodeFlags = 0xFF;
            var maintainsAspect = true;
            var aspectType = "min";

            if( ( !node.isRootNode ) ||
                ( !node[ this.resizingKey ] ) )
            {
                __layoutDebugLog( "bailing out of resizeScale with start scale of " + JSON.stringify( startScale ) + " and a resolution scale of " + JSON.stringify( resolutionScale ), node.nodeName );
                return;
            }

            __layoutDebugLog( "resizeScale began with start scale of " + JSON.stringify( startScale ) + " and a resolution scale of " + JSON.stringify( resolutionScale ), node.nodeName );

            layoutNodeFlags = node.layoutNodeFlags;
            if( this.resizeHierarchy )
            {
                layoutNodeFlags |= ( LayoutNodeFlags.RootScale | LayoutNodeFlags.FactorScale );
            }

            if( resolutionScale.x < 1.0 || resolutionScale.y < 1.0 )
            {
                // Disable factor scaling for devices smaller than design resolution.
                layoutNodeFlags &= ~( LayoutNodeFlags.FactorScale );
                __layoutDebugLog( "disabling factor scale because device is smaller than design resolution. Start scale of " + JSON.stringify( startScale ) + " and a resolution scale of " + JSON.stringify( resolutionScale ), node.nodeName );
            }

            if( ( layoutNodeFlags & LayoutNodeFlags.FactorScale ) )
            {
                factorScale = cc.p( node[ this.resizingKey ][ this.widthChangeKey ], 
                                    node[ this.resizingKey ][ this.heightChangeKey ] );
            }

            rootScale = this._calculateRootScale( startScale, resolutionScale, factorScale );
            if( !( layoutNodeFlags & LayoutNodeFlags.RootScale ) )
            {
                // Not a root scale node and maintains aspect.
                rootScale.x = rootScale.x / resolutionScale.x;
                rootScale.y = rootScale.y / resolutionScale.y;
            }

            maintainsAspect = !!node[ this.resizingKey ][ this.maintainsAspectKey ];

            if( maintainsAspect === true )
            {
                aspectType = node[ this.resizingKey ][ this.aspectTypeKey ];
                aspectScale = this._calculateAspectScale( aspectType, rootScale );
                startScale.x = aspectScale.x;
                startScale.y = aspectScale.y;
            }
            else
            {
                startScale.x = rootScale.x;
                startScale.y = rootScale.y;
            }

            __layoutDebugLog( "resizeScale applied with start scale of " + JSON.stringify( startScale ) + " and a resolution scale of " + JSON.stringify( resolutionScale ), node.nodeName );
        },

        _calculateRootScale: function( startScale, resolutionScale, factorScale )
        {
            var rootScale = cc.PointZero();

            // This formula may have issues such as not factor scaling correctly
            // if startScale comes in under 1.0. This can occur if the object is
            // a scaled down sprite in the layout. Be warned.
            // ( Also fail if resolutionScale is less than 1, but method already protects agains this within resizeScale method ).
            rootScale = cc.p( factorScale.x * ( ( startScale.x * resolutionScale.x ) - 1.0 ) + 1.0,
                              factorScale.y * ( ( startScale.y * resolutionScale.y ) - 1.0 ) + 1.0 );

            return rootScale;
        },

        _calculateAspectScale: function( aspectType, rootScale )
        {
            var aspectScale = cc.PointZero();
            var scale = 1;

            if( !aspectType )
            {
                return rootScale;
            }

            // Scale by the smaller dimension.
            if( aspectType === this.aspectMinKey )
            {
                scale = rootScale.x < rootScale.y ? rootScale.x : rootScale.y;
            }
            // Scale by the larger dimension.
            else if( aspectType === this.aspectMaxKey )
            {
                scale = rootScale.x > rootScale.y ? rootScale.x : rootScale.y;
            }
            // Always scale by the width.
            else if( aspectType === this.aspectWidthKey )
            {
                scale = rootScale.x;
            }
            // Always scale by the height.
            else if( aspectType === this.aspectHeightKey )
            {
                scale = rootScale.y;
            }
      
            aspectScale.x = scale;
            aspectScale.y = scale;

            return aspectScale;
        },
        
        /**
         * Returns an actual Cocos text alignment constant from a string that
         * was grabbed from layout data.
         *
         * @param {string} alignmentString The layout data's alignment string.
         * @returns {cc.TEXT_ALIGNMENT_LEFT|cc.TEXT_ALIGNMENT_RIGHT|cc.TEXT_ALIGNMENT_CENTER} The Cocos text alignment.
         */
        getTextAlignment:function( alignmentString )
        {
            switch( alignmentString )
            {
                case this.fontAlignsLeftKey:
                    return cc.TEXT_ALIGNMENT_LEFT;
                case this.fontAlignsRightKey:
                    return cc.TEXT_ALIGNMENT_RIGHT;
                case this.fontAlignsCenterKey:
                    return cc.TEXT_ALIGNMENT_CENTER;
            }
            return cc.TEXT_ALIGNMENT_LEFT;
        },
        
        /**
         * Returns an actual Cocos vertical text alignment constant from a string that
         * was grabbed from layout data.
         *
         * @param {string} alignmentString The layout data's alignment string.
         * @returns {cc.VERTICAL_TEXT_ALIGNMENT_TOP|cc.VERTICAL_TEXT_ALIGNMENT_CENTER|cc.VERTICAL_TEXT_ALIGNMENT_BOTTOM} The Cocos vertical text alignment.
         */
        getVerticalTextAlignment:function( alignmentString )
        {
            switch( alignmentString )
            {
                case this.fontAlignsTopKey:
                    return cc.VERTICAL_TEXT_ALIGNMENT_TOP;
                case this.fontAlignsBottomKey:
                    return cc.VERTICAL_TEXT_ALIGNMENT_BOTTOM;
                case this.fontAlignsCenterKey:
                    return cc.VERTICAL_TEXT_ALIGNMENT_CENTER;
            }
            return cc.VERTICAL_TEXT_ALIGNMENT_CENTER;
        },
        
        /**
         * Creates a Cocos color from a layout color data object.
         *
         * @param {Object} colorData The layout color object.
         * @returns {cc.Color} The cocos color represented by the layout data.
         */
        getColor:function( colorData )
        {
            //legacy "Red" "Green" "Blue" "Alpha"
            if ( colorData[ this.fontColorRedKey ] !== undefined )
            {
                return cc.color( colorData[ this.fontColorRedKey ], colorData[ this.fontColorGreenKey ], colorData[ this.fontColorBlueKey ], colorData[ this.fontColorAlphaKey ] );
            }
            
            //new "r" "g" "b"
            return cc.c3b( colorData[ this.colorRedKey ], colorData[ this.colorGreenKey ], colorData[ this.colorBlueKey ] );
        },
        
        /**
         * Creates a cc.LabelTTF object given the passed layout text data.
         *
         * @param {Object} textData The text data to use for creating the label.
         * @returns {cc.LabelTTF} A new label that represents the data.
         */
        createLabel:function( textData )
        {
            // Get font location
            var font = textData[ this.fontKey ];
            if ( font.indexOf( "fonts/" ) < 0 )
            {
                font = LumosityUtils.getFontLocation( font );
            }
            
            var node = LumosityLabel.create( textData[ this.textStringKey ], font, textData[ this.fontSizeKey ] );
            this.assignDataToLabel( node, textData );
            return node;
        },
        
        assignDataToLabel:function( node, textData )
        {
            // Get font location
            var font = textData[ this.fontKey ];
            if ( font.indexOf( "fonts/" ) < 0 )
            {
                font = LumosityUtils.getFontLocation( font );
            }

            node.setString( textData[ this.textStringKey ] );
            node.setFontName( font );
            node.setFontSize( textData[ this.fontSizeKey ] );
            node.setHorizontalAlignment( this.getTextAlignment( textData[ this.fontAlignmentKey ] ) );
            node.setVerticalAlignment( this.getVerticalTextAlignment( textData[ this.fontVerticalAlignmentKey ] ) );
            
            //legacy, this is now handled in every node separately
            if ( textData[ this.fontColorKey ] )
            {
                var color = this.getColor( textData[ this.fontColorKey ] );
                node.setColor( color );
                if ( color.a )
                {
                    node.setOpacity( color.a );
                }
            }
            
            //dimensions are set in the flags area so it can be easily stopped from being set
            //not sure how to set font style, other than maybe loading a different font
            return node;
        },
        
        createButton:function( buttonData, delegate )
        {
            var node = new LumosityButton();
            this.assignDataToButton( node, buttonData, delegate );
            return node;
        },
        
        assignDataToButton:function( node, buttonData, delegate )
        {
            var allStateKeys =
            [
                this.buttonStateNormalKey,
                this.buttonStateHighlightedKey,
                this.buttonStateDisabledKey,
                this.buttonStateSelectedKey
            ];
            
            var allStateValues =
            [
                LumosityButtonState.ButtonStateNormal,
                LumosityButtonState.ButtonStateHighlighted,
                LumosityButtonState.ButtonStateDisabled,
                LumosityButtonState.ButtonStateSelected
            ];
            
            var stateIndex;
            
            //if there is title label data, create a title label and assign it
            if ( buttonData[ this.buttonLabelKey ] )
            {
                buttonData[ this.buttonLabelKey ][ this.typeKey ] = "text";
                var newTitleLabel = this._doNodeCreation( buttonData[ this.buttonLabelKey ], node.nodeName + ".titleLabel", node, delegate );
                if ( newTitleLabel )
                {
                    node.setTitleLabel( newTitleLabel );
                }
            }
            
            //title
            for ( stateIndex = 0; stateIndex < allStateKeys.length; stateIndex++ )
            {
                node.setTitleForState( buttonData[ this.buttonTitleKey ][ allStateKeys[ stateIndex ] ] || "", allStateValues[ stateIndex ] );
            }
            
            //background image
            for ( stateIndex = 0; stateIndex < allStateKeys.length; stateIndex++ )
            {
                if ( buttonData[ this.buttonBackgroundImageKey ][ allStateKeys[ stateIndex ] ] )
                {
                    node.setBackgroundImageForState( cc.Sprite.create( buttonData[ this.buttonBackgroundImageKey ][ allStateKeys[ stateIndex ] ] ), allStateValues[ stateIndex ] );
                }
            }
            
            //icon image
            for ( stateIndex = 0; stateIndex < allStateKeys.length; stateIndex++ )
            {
                if ( buttonData[ this.buttonIconImageKey ][ allStateKeys[ stateIndex ] ] )
                {
                    node.setImageForState( cc.Sprite.create( buttonData[ this.buttonIconImageKey ][ allStateKeys[ stateIndex ] ] ), allStateValues[ stateIndex ] );
                }
            }
            
            //title color
            for ( stateIndex = 0; stateIndex < allStateKeys.length; stateIndex++ )
            {
                if ( buttonData[ this.buttonTitleColorKey ][ allStateKeys[ stateIndex ] ] )
                {
                    node.setTitleColorForState( this.getColor( buttonData[ this.buttonTitleColorKey ][ allStateKeys[ stateIndex ] ] ), allStateValues[ stateIndex ] );
                }
            }
            
            node.setEnabled( buttonData[ this.buttonEnabledKey ] === true || buttonData[ this.buttonEnabledKey ] === "true" );
            
            if ( delegate )
            {
                node.setTarget( delegate );
                
                if ( buttonData[ this.buttonCallbackPressedKey ] && delegate[ buttonData[ this.buttonCallbackPressedKey ] ] )
                {
                    node.setPressedCallback( delegate[ buttonData[ this.buttonCallbackPressedKey ] ] );
                }
    
                if ( buttonData[ this.buttonCallbackHeldKey ] && delegate[ buttonData[ this.buttonCallbackHeldKey ] ] )
                {
                    node.setHeldCallback( delegate[ buttonData[ this.buttonCallbackHeldKey ] ] );
                }
    
                if ( buttonData[ this.buttonCallbackReleasedKey ] && delegate[ buttonData[ this.buttonCallbackReleasedKey ] ] )
                {
                    node.setReleasedCallback( delegate[ buttonData[ this.buttonCallbackReleasedKey ] ] );
                }
            }
        }
    };
}() );
