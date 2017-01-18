
var GameCell = cc.Layer.extend({
    grandParent:null,
    ctor: function(args){
        this._super();

        this.grandParent = args.grandParent;

        var sprite = new cc.Sprite(args.res);
        var size = sprite.getContentSize();

        sprite.x = size.width/2;
        sprite.y = size.height/2;

        sprite.id = Math.random();

        this.setContentSize(size);
        this.addChild(sprite);

        if (args.gameID >= 8) {
            this._centerText = new cc.LabelTTF(args.gameName, "Arial-BoldMT", 50);
            this._centerText.x = sprite.width /2;
            this._centerText.y = sprite.height /6;
            this._centerText.color = cc.color(255, 0, 0);
            sprite.addChild(this._centerText);
        }

        this.ignoreAnchorPointForPosition(false);
        this.setAnchorPoint(cc.p(0.5, 0.5));

        cc.eventManager.addListener({
            event: cc.EventListener.TOUCH_ONE_BY_ONE,
            swallowTouches: false,
            onTouchBegan: this.onTouchBegan,
            onTouchMoved: this.onTouchMoved,
            onTouchEnded: this.onTouchEnded
        }, sprite);
        this._sprite = sprite;

    },

    containsTouchLocation:function (touch) {
        var getPoint = touch.getLocation();
        var myRect = this.rect();

        myRect.x += this.x;
        myRect.y += this.y;
        return cc.rectContainsPoint(myRect, getPoint);
    },

    onTouchBegan:function (touch, event) {
        var target = event.getCurrentTarget();
        var touchPoint = target.convertToNodeSpace(touch.getLocation());
        this._worldpos = target.convertToWorldSpace(touch.getLocation());

        this._x = touchPoint.x;
        this._y = touchPoint.y;        
        return true;
    },
    onTouchMoved:function (touch, event) {
        var target = event.getCurrentTarget();
        var touchPoint = target.convertToNodeSpace(touch.getLocation());

        this._x = touchPoint.x;
        this._y = touchPoint.y;
    },
    onTouchEnded:function (touch, event) {    
        var target = event.getCurrentTarget();
        var size = target.getContentSize();
        var targetRect = cc.rect(0,0, size.width, size.height);
        var touchPoint = target.convertToNodeSpace(touch.getLocation());
        var pos = target.convertToWorldSpace(touch.getLocation());

        var p = target.getParent();
        var ratio = cc.view.getDevicePixelRatio();
        var ClickDisX = 20 * ratio / 2;
        var ClickDisY = 20 * ratio / 2;
        var notOnMove = ((Math.abs(this._worldpos.x - pos.x) <= ClickDisX) && (Math.abs(this._worldpos.y - pos.y) <= ClickDisY));

        var listRect = cc.rect(0,0,p.grandParent.width, p.grandParent.height);
        var viewPoint = p.grandParent.convertToNodeSpace(touch.getLocation());
        
        if (notOnMove && cc.rectContainsPoint(targetRect, touchPoint) && cc.rectContainsPoint(listRect, viewPoint)){
            if(typeof(p._handle) == 'function'){
                p._handle(p._delegate,p.gameID);
            }
        };
    },
    setHandle:function(delegate,handle){
        this._delegate = delegate;
        this._handle = handle;
    },
    removeListener:function(){
        cc.eventManager.removeListeners(this._sprite);
    },

    js_getDPI: function () {
        var arrDPI = new Array;
        if (window.screen.deviceXDPI) {
            arrDPI[0] = window.screen.deviceXDPI;
            arrDPI[1] = window.screen.deviceYDPI;
        }else {
            var tmpNode = document.createElement("DIV");
            tmpNode.style.cssText = "width:1in;height:1in;position:absolute;left:0px;top:0px;z-index:99;visibility:hidden";
            document.body.appendChild(tmpNode);
            arrDPI[0] = parseInt(tmpNode.offsetWidth);
            arrDPI[1] = parseInt(tmpNode.offsetHeight);
            tmpNode.parentNode.removeChild(tmpNode); 
        }
        return arrDPI;
    },
    
});


