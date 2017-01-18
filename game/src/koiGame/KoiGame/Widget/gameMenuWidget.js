
var GameMenuWidget = cc.Layer.extend({
    ctor : function(){
    	this._super();
    	this._init();
        this.x = -AppConfig.w;
    },
    _init : function(){
        cc.MenuItemFont.setFontName("Arial");
        cc.MenuItemFont.setFontSize(50);
    	var item1 = new cc.MenuItemFont("Resume",this._OnBtnHandle,this);
    	item1.name = BtnEventName.resume;
    	var item2 = new cc.MenuItemFont("Restart",this._OnBtnHandle,this);
    	item2.name = BtnEventName.restart;
    	var item3 = new cc.MenuItemFont("Quit",this._OnBtnHandle,this);
    	item3.name = BtnEventName.quit;
    	var item4 = new cc.MenuItemFont("How To Play",this._OnBtnHandle,this);
    	item4.name = BtnEventName.howToPlay;
        var item5 = new cc.MenuItemFont("Choose Level",this._OnBtnHandle,this);
        item5.name = BtnEventName.chooseLevel;
		
    	var menu = new cc.Menu(item1,item2,item3,item4,item5);
        menu.alignItemsVerticallyWithPadding(55);

    	this.addChild(menu);
    },
    _OnBtnHandle : function(sender){
    	var cEvent = new cc.EventCustom(CustomEvent.settingBtnEvent.name);
        var userData = {};
        userData[CustomEvent.settingBtnEvent.userDataKey.btnEventName] = sender.name;
        cEvent.setUserData(userData);
        cc.eventManager.dispatchEvent(cEvent);
    },
 
    onEnter:function () {
        this._super();
    },
    onExit : function(){
        this._super();
        cc.log("GameMenuWidget  view   onExit");
    },

});