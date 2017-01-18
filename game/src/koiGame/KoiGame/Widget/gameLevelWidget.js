
var GameLevelWidget = cc.Layer.extend({
    ctor : function(){
        this._super();
        this._init();
    },
    _init : function(){
        cc.MenuItemFont.setFontName("Arial");
        cc.MenuItemFont.setFontSize(50);

        for (var j = 0; j < 3; j++) {            
            var itemList = [];
            for (var i = 0; i < 10; i++) { 
                var level = j*10+1+i;           
                var item = new cc.MenuItemFont("level"+level, this.onLevelHandle, this);
                item.name = level;
                itemList.push(item);
            }            
            var menu = new cc.Menu(itemList);
            menu.alignItemsVerticallyWithPadding(25);
            menu.setPositionX(AppConfig.w_2 + 200*(j-1));
            this.addChild(menu);
        } 
    },
    onLevelHandle : function(sender){
        var cEvent = new cc.EventCustom(CustomEvent.chooseLevelEvent.name);
        var userData = {};
        userData[CustomEvent.chooseLevelEvent.userDataKey.levelIndex] = sender.name;
        cEvent.setUserData(userData);
        cc.eventManager.dispatchEvent(cEvent);
    },
 
    onEnter:function () {
        this._super();
    },
    onExit : function(){
        this._super();
        cc.log("GameLevelWidget  view   onExit");
    },

});