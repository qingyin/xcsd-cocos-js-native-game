var ParticleBubble = cc.Layer.extend({
    bubbleArray:null,
	ctor: function () {
    	this._super();

    	this.width = cc.winSize.width;
    	this.height = cc.winSize.height;

        this.bubbleArray = new Array();

    	// this.init();
    },

    initBubble: function () {
    	cc.log('------------  initBubble  --------------', res.seabed.seabed_bubble);
    	// 创建粒子系统，创建n个粒子
    	this._emitter = new cc.ParticleSystem(1); 
    	this.addChild(this._emitter);
    	// 加载图片做为粒子系统的纹理。
    	this._emitter.texture = cc.textureCache.addImage(res.seabed.seabed_bubble);

    	this._emitter.shapeType = cc.ParticleSystem.BALL_SHAPE;

    	// 设置粒子系统永远更新，宏cc.ParticleSystem.DURATION_INFINITY值为-1。
    	this._emitter.duration = cc.ParticleSystem.DURATION_INFINITY;

        // 设置粒子系统运动模式为环型模式。
        this._emitter.emitterMode = cc.ParticleSystem.MODE_RADIUS;

        // 环型模式的起始和结束半径以及相应的半径随机加成范围值。
        this._emitter.startRadius = 100;
        this._emitter.startRadiusVar = 0;
        this._emitter.endRadius = cc.ParticleSystem.START_RADIUS_EQUAL_TO_END_RADIUS;
        this._emitter.endRadiusVar = 0;

        // 设置环型运动模式的每秒旋转角度及相应的随机加成范围值。
        this._emitter.rotatePerS = 0;
        this._emitter.rotatePerSVar = 0;

        // 设置初始时粒子系统的角度以及相应的随机加成范围值。
        this._emitter.angle = 90;
        this._emitter.angleVar = 0;

        // 设置粒子系统的位置居于屏幕中央。
        // var size = director.getWinSize();
        this._emitter.x = this.width / 2;
        this._emitter.y = this.height / 2;
        this._emitter.posVar = cc.p(0, 0);

        // 设置初始时粒子的生命值为5。
        this._emitter.life = 30;
        this._emitter.lifeVar = 0;

        // 设置粒子本身起始和结束状态不旋转。
        this._emitter.startSpin = 0;
        this._emitter.startSpinVar = 0;
        this._emitter.endSpin = 0;
        this._emitter.endSpinVar = 0;

        // //设置粒子系统发射粒子的起始颜色和随机加值范围。
        this._emitter.startColor = cc.color(128, 128, 128, 255);
        this._emitter.startColorVar = cc.color(128, 128, 128, 255);

        //设置粒子系统发射粒子的终止颜色和随机加值范围。
        this._emitter.endColor = cc.color(26, 26, 26, 50);
        this._emitter.endColorVar = cc.color(26, 26, 26, 50);

        // 设置粒子系统发射粒子的起始大小和随机加值范围，
        // 结束值指定为宏cc.ParticleSystem.START_SIZE_EQUAL_TO_END_SIZE代表大小在粒子运动时不变化。
        this._emitter.startSize = 28;
        this._emitter.startSizeVar = 0;
        this._emitter.endSize = cc.ParticleSystem.START_SIZE_EQUAL_TO_END_SIZE;

        // 设置粒子系统的发射速率。
        this._emitter.emissionRate = 3;//this._emitter.totalParticles / this._emitter.life;

        cc.log(this._emitter.totalParticles);

        // 设置不使用高亮模式。
        this._emitter.setBlendAdditive(true);

        // 让粒子系统的发射器运行一个无限旋转的动画。
        var rot = cc.rotateBy(16, 360);
        // var scl = cc.scaleTo(30, 3.0);
        this._emitter.runAction(cc.RepeatForever.create(rot));
        // cc.log("--------- emittle ---------", this._emitter);
    },

    gravityBubble: function () {
        this._emitter = new cc.ParticleSystem(10); 
        this.addChild(this._emitter);

        // 加载图片做为粒子系统的纹理。
        this._emitter.texture = cc.textureCache.addImage(res.seabed.seabed_bubble);

        this._emitter.shapeType = cc.ParticleSystem.BALL_SHAPE;
        // 设置粒子系统永远更新，宏cc.ParticleSystem.DURATION_INFINITY值为-1。
        this._emitter.duration = cc.ParticleSystem.DURATION_INFINITY;
        // 设置为重力加速模式。  
        this._emitter.emitterMode = cc.ParticleSystem.MODE_GRAVITY;
        // 设置重力加速度的值。  
  
        this._emitter.gravity = cc.p(0,1); 

         // 设置速度及其用于随机初始化的范围值。  
        this._emitter.speed = 10;  
        this._emitter.speedVar = 1;    
  
         // 设置半径变化值及其用于随机初始化的范围值。  
        this._emitter.radialAccel = 0;  
        this._emitter.radialAccelVar = 1;  
  
        // 设置切角变化值及其用于随机初始化的范围值。  
        this._emitter.tangentialAccel = 0;  
        this._emitter.tangentialAccelVar = 1;  
  
          // 设置起始角度及其用于随机初始化的范围值。  
        this._emitter.angle = 90;
        this._emitter.angleVar = 5;

        // 设置粒子系统的位置居于屏幕中央。
        // var size = director.getWinSize();
        this._emitter.x = this.width*0.5;
        var disY = (this.height * 0.2 - 50) * 0.5;
        this._emitter.y = 50 + disY;
        this._emitter.posVar = cc.p(this.width*0.5, disY);

        // 设置初始时粒子的生命值为5。
        this._emitter.life = 25;
        this._emitter.lifeVar = 5;

        // //设置粒子系统发射粒子的起始颜色和随机加值范围。
        this._emitter.startColor = cc.color(255, 255, 255, 255);
        this._emitter.startColorVar = cc.color(0, 0, 0, 0);

        //设置粒子系统发射粒子的终止颜色和随机加值范围。
        this._emitter.endColor = cc.color(255, 255, 255, 255);
        this._emitter.endColorVar = cc.color(0, 0, 0, 0);

        // 设置粒子系统发射粒子的起始大小和随机加值范围，
        // 结束值指定为宏cc.ParticleSystem.START_SIZE_EQUAL_TO_END_SIZE代表大小在粒子运动时不变化。
        this._emitter.startSize = 28;
        this._emitter.startSizeVar = 5;
        this._emitter.endSize = cc.ParticleSystem.START_SIZE_EQUAL_TO_END_SIZE;

        // 设置粒子系统的发射速率。
        this._emitter.emissionRate = 10;//this._emitter.totalParticles / this._emitter.life;

        // 设置不使用高亮模式。
        this._emitter.setBlendAdditive(true);

    },

    delBoundsBubble: function () {
        
    }
});