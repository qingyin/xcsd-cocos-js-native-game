
var PlayingKoiModel = cc.Class.extend({
    /** @lends PlayingKoiModel.prototype */
    _level:null,
    lastLevel:null,
    _numFish:null, // == numFood
    _spawnTime:null,
    _fishMarked:null,
    _fishSpeed:null,
    _state:null,
    _trial:null,
    bestStatKey: "NumberOfFish",
    _fishSpeedIncrement:null,
    assetIndex:null,
    settings:null,

    md_correctRounds:0,
    md_rounds:null,
    md_fish:null,
    md_distractors:null,

    playTime:0,

    // metadata    
    md_numTries:0,
    md_numCorrect:0,
    md_numFish:0,
    md_numFishCorrect:0,
    md_numClicks:0,
    // round_csv
    md_roundLevel:0,
    md_roundRound:0,
    md_roundFish:0,
    md_roundDistractors:0,
    md_roundNumCorrect:0,
    md_roundNumClicks:0,
    md_roundNumTries:0,
    md_roundStartTime:0,
    md_roundEndTime:0,
    // trial_csv each click
    md_trialX:0,
    md_trialY:0,
    md_trialFishId:0,
    md_trialRound:0,
    md_trialNumClicks:0,
    // distractor_csv
    md_distractorX:0,
    md_distractorY:0,
    md_distractorRound:0,
    md_distractorType:0,
    md_distractorTimeOffset:0,

    isPaused:false,

    StatsKeys:
    {
        CorrectStat: "correct", // Should represent the number of correct trials.
        TrialsStat:  "trials",  // The total number of trials a player reached in their playtime.
        TilesStat:   "tiles",   // The maximum number of tiles a player uncovered in a given trial (board).
        LevelStat:   "level",   // The maximum level a player reached.
        CardStat:    "cards",   // The total correct cards.
        BallStat:    "balls"    // The maximux number of balls player managed in the game.
    },

    /** Dictionary object that will be sent back to the app with the results. */
    metadata: {},


    _colorList : null,
    _colorValueList : null,

    _levelConf : null,
    _gameLength : 0,
    _pass_round_num : 0,
    _addFishMaxNum : 2,
    _addFishNum : 0,
    _colorIndexList : null,

    FOOD_SORT_TYPE : {
        shunXu : 1,
        shuiJi : 2,
        jiaoTi : 3,
    },
    isGuide : false,
    guideTipReadyDisplayTimeTotal : 4,
    guideTipReadyDisplayTime : 0,
    isGuideTipReadyCountDown : false,
    isPointToNextFish : false,
    isGameReady : false,
    isDataFull : true,
    isAllFishStandstill : false,

    ctor: function(settings,isGuide)
    {
        this.settings = settings;
        this.isGuide = isGuide;
        // for (var k in this.settings) {
        //     cc.log("k===------",k,this.settings[k]);
        // }
        this.guideTipReadyDisplayTime = 0;

        this._level = 1;
        this._numFish = this.settings.startFish;
        this._spawnTime = this.settings.foodTime;

        this._spawnTimeIncrement = this.settings.foodTimeIncrement;
        this._fishMarked = 0;
        this._fishSpeed = this.settings.fishSpeed;
        this._state = GameStates.TrialIntro;
        this._trial = 1;
        this._fishSpeedIncrement = this.settings.fishSpeedIncrement;
        this.assetIndex = 0;
        this.md_rounds = new Array();
        this.md_fish = new Array();
        this.md_distractors = new Array();
        this.score = 0;
 
        this._fishColorList = [
                cc.color(237,86,55),
                cc.color(237,86,55),
                cc.color(237,155,55),
                cc.color(55,84,237),
                //cc.color(59,200,199),
            ];

        this._levelConf = new PlayingKoiLevelSettings();
        this.makeLevelConfig(this._level);
    },

    resetLevel: function()
    {
        this._fishMarked = 0;
        this._trial = this._trial + 1;
    },

    makeLevelConfig: function(level)
    {
        this.isAllFishStandstill = false;
        this.isDataFull = true;
        this._fishMarked = 0;
        this._level =  level;
        if (level > 0) {
            this.lastLevel = level;
        }
        var levelConf = this._levelConf.getLevelConfig(level);

        this._gameLength = levelConf[this._levelConf.keyName.level_round_num];
        
        this._all_fish_num = levelConf[this._levelConf.keyName.all_fish_num];
        this._numFish = 0;
        for (var i = 0; i < this._all_fish_num.length; i++) {
            this._numFish = this._numFish + this._all_fish_num[i];
        }

        this._all_fish_color = levelConf[this._levelConf.keyName.all_fish_color];
        this._food_sort_type = levelConf[this._levelConf.keyName.food_sort_type];

        this._fishSpeed = levelConf[this._levelConf.keyName.fish_speed];
        var spawnTime = levelConf[this._levelConf.keyName.feed_interval_time];
        // if (spawnTime < 1.5) {
        //     spawnTime = 1.5;
        // }
        this._spawnTime = spawnTime;

        this._addFishNum = 0;

        this._colorIndexList = [];
        this._colorIndexEach = {};
        for (var i = 0; i < this._all_fish_num.length; i++) {
            var num = this._all_fish_num[i];
            this._colorIndexEach[i] = [];
            for (var j = 0; j < num; j++) {   
                this._colorIndexList.push(this._all_fish_color[i]);
                this._colorIndexEach[i].push(this._all_fish_color[i]);     
            }
        }
        this._colorIndexList.sort(this._sortFun);
    },

    _sortFun : function(a,b){
        return a-b;
    },

    makeAdvanceLevelConfig: function()
    {
        if (this.isGuide) {
            this.configColorList();
            return;
        }
        if(this._addFishNum < this._addFishMaxNum){
            this._numFish = this._numFish + 1;
            this._addFishNum = this._addFishNum + 1;

            var colorIndex = this._all_fish_color[this._addFishNum-1];
            colorIndex = colorIndex ? colorIndex : this._all_fish_color[0];
            cc.log("colorIndex---",colorIndex);
            this._colorIndexList.push(colorIndex);
            this._colorIndexList.sort(this._sortFun);
            
            if (this._all_fish_num.length === 1) {
                this._all_fish_num[0] = this._all_fish_num[0] + 1;
                this._colorIndexEach[0].push(colorIndex);
            } else {
                this._all_fish_num[this._addFishNum-1] = this._all_fish_num[this._addFishNum-1] + 1;
                this._colorIndexEach[this._addFishNum-1].push(colorIndex);                
            }

            this.configColorList();
        }else{
            this.makeDemoteLevelConfig();
        }
    },

    makeDemoteLevelConfig: function()
    {
        this.configColorList();
    },

    getColorList : function(){
        return this._colorList;
    },
    getColorValueList : function(){
        return this._colorValueList;
    },
    _ArraySwap : function(arr,index1,index2){
        var temp = arr[index1];
        arr[index1] = arr[index2];
        arr[index2] = temp;
    },
    configColorList : function(){
        this._colorValueList = [];
        this._colorList = [];

        if (this._food_sort_type === this.FOOD_SORT_TYPE.shuiJi) {
            for (var i = 0; i < this._colorIndexList.length; i++) {
                var v = Math.round(Math.random() *(this._colorIndexList.length-1));
                //this._colorIndexList.swap(i,v);
                this._ArraySwap(this._colorIndexList,i,v);
            }
        }else if (this._food_sort_type === this.FOOD_SORT_TYPE.jiaoTi) {
            var max = Math.max.apply(null,this._all_fish_num);
            var obj = {};
            for (var i = 0; i < max; i++) {
                obj[i] = [];
            }
            for (var i = 0; i < max; i++) {
                for (var j = 0; j < this._all_fish_color.length; j++) {
                    if(i < this._colorIndexEach[j].length){           
                        var v = this._colorIndexEach[j][i];
                        obj[i].push(v);
                    }
                }
            }

            var list = [];
            for (var i = 0; i < max; i++) {
                list = list.concat(obj[i]);
            }
            this._colorIndexList = [];
            this._colorIndexList = this._colorIndexList.concat(list);        
        }

        for (var i = 0; i < this._colorIndexList.length; i++) {
            var index = this._colorIndexList[i];
            var color = this._fishColorList[index];
            this._colorList.push(color);
            var colorValue = ""+color.r +","+ color.g +","+ color.b;
            this._colorValueList.push(colorValue);
        } 
        // cc.log("this._colorList=====",this._colorList);
        // cc.log("this._colorValueList=====",this._colorValueList);
    },
    getStarNum : function(){
        var starNum = 0;
        var diff = this._gameLength - this.md_correctRounds;
        if (diff == 0) {
            starNum = 3;
        }else if (diff == 1) {
            starNum = 2;
        }else if (diff == 2) {
            starNum = 1;
        }
        return starNum;
    },

    getGuideResult : function(){
        var good = false;
        if (this.md_correctRounds == this._gameLength){
            good = true;
        }        
        return good;
    },

});
