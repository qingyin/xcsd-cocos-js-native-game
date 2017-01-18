
var HeadCell = cc.Layer.extend({
    rankIndex : 1,
//var HeadCell = cc.LayerColor.extend({
    ctor:function (args) {
        this._super();

        this.attr({
            width : 155,
            height : args.height,
            //color : cc.color(0,255,255),
        });
        this.rankIndex = args.rankIndex;
        this.init();
    }, 
    init : function(){
        var headShade = new cc.Sprite(res.game_x_frame);
        var size = headShade.getContentSize();
        headShade.attr({
            x:this.width*0.5,
            y:this.height - headShade.height * 0.5 - 3,
        });
        this.addChild(headShade,2);

        var headFrame = new cc.Sprite(res.game_x_frame_02);
        headFrame.attr({
            x:this.width*0.5,
            y:this.height - headShade.height * 0.5 - 3,
            tag : 12,
        });
        this.addChild(headFrame,1);

        this._head = new cc.Sprite(res.game_x_head);
        this._head.attr({
            x:headShade.x,
            y:headShade.y,
        });
        this.addChild(this._head,0);
        this._head.headSpriteH = this._head.height;
        this._head.headSpriteW = this._head.width;

        this._ranking = new cc.Sprite(res["game_x_ranking_0"+this.rankIndex]);
        this._ranking.attr({
            x:this._ranking.width*0.5,
            y:headShade.height-this._ranking.height*0.5,
        });
        headShade.addChild(this._ranking,3);

        this._lbl_holder = new cc.LabelTTF("虚位以待", "Arial", 28);
        this._lbl_holder.attr({
            anchorPoint:cc.p(0.5,0.5),
            x:headShade.x,
            y:-45,
            color:cc.color(98,98,98),
        });
        headShade.addChild(this._lbl_holder); 

        this._lbl_name = new cc.LabelTTF("峰峰", "Arial", 28);
        this._lbl_name.attr({
            anchorPoint:cc.p(0.5,0.5),
            x:headShade.width * 0.5,
            y:-8 - this._lbl_name.height * 0.5,
            color:cc.color(49,49,49),
        });
        headShade.addChild(this._lbl_name); 

        this._star = new cc.Sprite(res.game_x_star_least);
        this._star.attr({
            x:headShade.width * 0.5 - this._star.width*0.5-10,
            y:this._lbl_name.y - this._lbl_name.height * 0.5 - 6 - this._star.height * 0.5,
        });
        headShade.addChild(this._star,3);

        this._lbl_score = new cc.LabelTTF("1069", "Arial", 26);
        this._lbl_score.attr({
            anchorX:0,
            x:headShade.width * 0.5 - 5,
            y:this._star.y,
            color:cc.color(98,98,98),
        });
        this._lbl_score.textAlign = cc.TEXT_ALIGNMENT_LEFT;
        headShade.addChild(this._lbl_score);

        //this.handleHeadImg("https://www.baidu.com/img/baidu_jgylogo3.gif");

        this.setData();
    },
    setHeadFrameColor : function(color){
        this.getChildByTag(12).setColor(color);
    },
    handleHeadImg : function(img){
        //img = "http://resource.xcsdedu.com/AD8045E2-77C8-4FAA-B1BE-796B28DB26DC.jpg";
        //cc.log("cc.isCrossOrigin-----",cc.isCrossOrigin(img));
        this._loadImgFromUrl(this._head,img,cc.p(this._head.x,this._head.y),11);
    },
    setData : function(data){
        if (data) {
            this._lbl_name.setString(data.name);
            this._lbl_score.setString(data.score || 0);
            if (data.avatar) {
                this.handleHeadImg(data.avatar);
            }

            this._lbl_name.setVisible(true);
            this._lbl_score.setVisible(true);
            this._star.setVisible(true);
            this._lbl_holder.setVisible(false);
        }else{
            this._lbl_holder.setVisible(true);
            this._lbl_name.setVisible(false);
            this._lbl_score.setVisible(false);
            this._star.setVisible(false);
        }
    },

    _loadImgFromUrl: function (target, imgUrl, p, tag) {
        if(!imgUrl)return;  
        var self = target;  
        var loadCb = function(err, img){
            if(err) {
                cc.log("err------",err);
                return;
            }
            cc.log("img------",img);
            cc.textureCache.addImage(imgUrl);

            if (cc.sys.isNative) {
                self.initWithTexture(img);
                self.setScaleY(self.headSpriteH/img.height);
                self.setScaleX(self.headSpriteW/img.width);
            }else{                
                var texture2d = new cc.Texture2D();  
                
                texture2d.initWithElement(img);
                texture2d.handleLoadedTexture();  

                // var sp = new cc.Sprite();  
                // sp.initWithTexture(texture2d);  
                // self.addChild(sp);  
                // sp.x = p.x;  
                // sp.y = p.y;  
                // sp.tag = tag;  
                cc.log("texture2d---",texture2d);
                self.initWithTexture(texture2d);
                self.setScaleY(self.headSpriteH/texture2d.height);
                self.setScaleX(self.headSpriteW/texture2d.width);
            }  
        };  
        cc.loader.loadImg(imgUrl, {isCrossOrigin:true}, loadCb);
    },

});