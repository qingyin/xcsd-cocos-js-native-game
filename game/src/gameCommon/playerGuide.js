var PlayerGuide = cc.Layer.extend({
    ctor:function (args) {
        this._super();

        this.view_scaleX = cc.winSize.width / 750;
        this._hornHeight = 20 * this.view_scaleX;

        this.draw = new cc.DrawNode();
        this.addChild(this.draw);

        this.init(args);
    },

    init: function (args) {

        this.tip = args.tip;
        this.isRect = args.isRect;
        this.verticesType = args.verticesType;

        this.createTipLabel();
        if (this.isRect) {
            this.createRectangle();
        }else {
            this.createIndicate();
        }
    },

    createTipLabel: function () {
        this._tip = new cc.LabelTTF(this.tip, "Arial", 30);
        this._tip.setAnchorPoint(cc.p(0.5, 0.5));
        this._tip.attr({
            scale:this.view_scaleX,
            color:cc.color(0,0,0,255),
        });
        if (this._tip.width > 300*this.view_scaleX) {
            this._tip._setBoundingWidth(300*this.view_scaleX);
        }
        this.addChild(this._tip);
    },

    createRectangle: function () {
        var rectWidth = (this._tip.width + 30)*this.view_scaleX;
        var rectHeight = (this._tip.height + 30)*this.view_scaleX;
        this.draw.drawRect(cc.p(0, 0), cc.p(rectWidth, rectHeight), cc.color(255, 255, 255, 255), 2, cc.color(230, 230, 230, 255));
        this.width = rectWidth;
        this.height = rectHeight;
        this._tip.x = this.width*0.5;
        this._tip.y = this.height*0.5;
    },

    createIndicate: function () {
        var rectWidth = (this._tip.width + 30)*this.view_scaleX;
        var rectHeight = (this._tip.height + 30 + 20)*this.view_scaleX;
        var vertices = this.getVertices(rectWidth, rectHeight);
        this.draw.drawPoly(vertices, cc.color(255, 255, 255, 255), 2, cc.color(230, 230, 230, 255));

        this.width = rectWidth;
        this.height = rectHeight;

        this.setVerticesTipPos();
    },

    getVertices: function (rectWidth, rectHeight) {
        var vertices = new Array();
        // var hornHeight = 20 * this.view_scaleX;
        switch (this.verticesType) {
            case 1: 
                vertices = [cc.p(rectWidth*0.5+this._hornHeight*0.5, rectHeight-this._hornHeight), cc.p(rectWidth*0.5, rectHeight), cc.p(rectWidth*0.5-this._hornHeight*0.5, rectHeight-this._hornHeight), cc.p(0, rectHeight-this._hornHeight), cc.p(0, 0), cc.p(rectWidth, 0), cc.p(rectWidth, rectHeight-this._hornHeight)];
                break;
            case 2: 
                vertices = [cc.p(this._hornHeight*1.5, rectHeight-this._hornHeight), cc.p(this._hornHeight, rectHeight), cc.p(this._hornHeight*0.5, rectHeight-this._hornHeight), cc.p(0, rectHeight-this._hornHeight), cc.p(0, 0), cc.p(rectWidth, 0), cc.p(rectWidth, rectHeight-this._hornHeight)];
                break;
            case 3: 
                vertices = [cc.p(rectWidth, 0), cc.p(rectWidth, rectHeight-this._hornHeight), cc.p(rectWidth-this._hornHeight*0.5, rectHeight-this._hornHeight), cc.p(rectWidth-this._hornHeight, rectHeight), cc.p(rectWidth-this._hornHeight*1.5, rectHeight-this._hornHeight), cc.p(0, rectHeight-this._hornHeight), cc.p(0, 0)];
                break;
            case 4: 
                vertices = [cc.p(rectWidth*0.5-this._hornHeight*0.5, this._hornHeight), cc.p(rectWidth*0.5, 0), cc.p(rectWidth*0.5+this._hornHeight*0.5, this._hornHeight), cc.p(rectWidth, this._hornHeight), cc.p(rectWidth, rectHeight), cc.p(0, rectHeight), cc.p(0, this._hornHeight)];
                break;
            case 5: 
                vertices = [cc.p(this._hornHeight*0.5, this._hornHeight), cc.p(this._hornHeight, 0), cc.p(this._hornHeight*1.5, this._hornHeight), cc.p(rectWidth, this._hornHeight), cc.p(rectWidth, rectHeight), cc.p(0, rectHeight), cc.p(0, this._hornHeight)];
                break;
            case 6: 
                vertices = [cc.p(rectWidth-this._hornHeight*1.5, this._hornHeight), cc.p(rectWidth-this._hornHeight, 0), cc.p(rectWidth-this._hornHeight*0.5, this._hornHeight), cc.p(rectWidth, this._hornHeight), cc.p(rectWidth, rectHeight), cc.p(0, rectHeight), cc.p(0, this._hornHeight)];
                break;
        }
        return vertices;
    },

    setVerticesTipPos: function () {
        // var hornHeight = 20 * this.view_scaleX;
        switch (this.verticesType) {
            case 1: 
            case 2: 
            case 3:
                this._tip.x = this.width*0.5;
                this._tip.y = (this.height - this._hornHeight)*0.5;
                break;
            case 4: 
            case 5:
            case 6: 
                this._tip.x = this.width*0.5;
                this._tip.y = (this.height + this._hornHeight)*0.5;
                break;
        }
    },

    removeTip: function () {
        if (this._tip) {
            this._tip.removeFromParent(true); 
            this._tip = null;
        }
        
        if (this.draw) {
            this.draw.clear();
        }
    },

    //ClippingNode
    addClipping: function (layer, shapeArray, sType) {

        var stencil = this.setStencil(shapeArray, sType);

        this.clipper = new cc.ClippingNode();   //创建不带模板的裁剪节点
        this.clipper.anchorX = 0.5;
        this.clipper.anchorY = 0.5;
        this.clipper.x = 0;
        this.clipper.y = 0;
        this.clipper.setAlphaThreshold(1);
        this.clipper.setInverted(true);
        this.clipper.stencil = stencil;
        layer.addChild(this.clipper, 5);
        
        var content = this.setContent();
        this.clipper.addChild(content);
    },

    setStencil: function (shapeArray, sType) {
        var shape;
        var green = cc.color(0, 255, 0, 255);
        if (sType == 1) {
            shape = new cc.DrawNode();
            shape.drawRect(shapeArray[0], shapeArray[1], green, 2, green); 
       }else if (sType == 2) {
            shape = new cc.Node();
            var draw = new cc.DrawNode();
            draw.drawPoly(shapeArray[0], green, 2, green);
            draw.drawRect(shapeArray[1][0], shapeArray[1][1], green, 2, green);
            shape.addChild(draw);
       }else if (sType == 3) {
            //Node
            // var green = cc.color(0, 255, 0, 255);
            shape = new cc.Node();

            var draw = new cc.DrawNode();
            draw.drawRect(shapeArray[0][0], shapeArray[0][1], green, 2, green);
            draw.drawRect(shapeArray[1][0], shapeArray[1][1], green, 2, green); 
            shape.addChild(draw);
       }
        
        return shape;
    },

    setContent: function () {
        var content = new cc.LayerColor();
        content.color = cc.color(0,0,0);
        content.x = 0;
        content.y = 0;
        content.setOpacity(125);
        return content;
    },

    removeClipping: function () {
        if (this.clipper) {
            this.clipper.removeFromParent(true);
            this.clipper = null;
        }
        
    },

    setClippingZOrder: function () {
        this.clipper.setLocalZOrder(8);
    },
});