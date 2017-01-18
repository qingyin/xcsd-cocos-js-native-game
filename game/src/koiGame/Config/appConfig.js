
var AppConfig = AppConfig || {};

AppConfig.reload = function(){	
	AppConfig.h = cc.winSize.height;
	AppConfig.w = cc.winSize.width;
	AppConfig.w_2 = cc.winSize.width / 2 ;
	AppConfig.h_2 = cc.winSize.height / 2;

	AppConfig.fishRangeH = cc.winSize.height - 150;

	AppConfig.scaleX = cc.winSize.width / 750;
	AppConfig.scaleY = cc.winSize.height / 1334;

	AppConfig.topRectH = 120 * AppConfig.scaleX;
	AppConfig.bottomRectH = 120 * AppConfig.scaleX;
	AppConfig.centerRectH = cc.winSize.height - AppConfig.topRectH - AppConfig.bottomRectH;

	AppConfig.homePageHeaderLayerRectH = 180 * AppConfig.scaleX;

	AppConfig.topRect = cc.rect(0,cc.winSize.height,cc.winSize.width,AppConfig.topRectH);
	AppConfig.bottomRect = cc.rect(0,AppConfig.bottomRectH,cc.winSize.width,AppConfig.bottomRectH);
	AppConfig.centerRect = cc.rect(0,cc.winSize.height - AppConfig.topRectH,cc.winSize.width,AppConfig.centerRectH);
}
AppConfig.reload();

AppConfig.color = {
	WHITE : cc.color.WHITE,//白色
	YELLOW : cc.color.YELLOW,//黄色
	BLUE : cc.color.BLUE,//蓝色
	GREEN : cc.color.GREEN,//绿色
	RED : cc.color.RED,//红色
	MAGENTA : cc.color.MAGENTA,//紫红色
	BLACK : cc.color.BLACK,//黑色
	ORANGE : cc.color.ORANGE,//橙色
	GRAY : cc.color.GRAY,//灰色
	SILVERY : cc.color(234,234,234,255),//银白色，app的背景色
	BTN_BRIGHT : cc.color(17, 224, 224, 255),//pagingBtn高亮色
};

AppConfig.print = function(){	
	for(var k in AppConfig){
		cc.log(k,"--AppConfig-->",AppConfig[k]);
	}
}
//AppConfig.print();



