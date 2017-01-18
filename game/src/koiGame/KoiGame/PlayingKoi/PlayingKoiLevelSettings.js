
var PlayingKoiLevelSettings = cc.Class.extend({
    _all_level_list : null,
    keyName : {
        level_id : "level_id",
        level_round_num : "level_round_num",
        pass_round_num : "pass_round_num",
        all_fish_num : "all_fish_num",
        all_fish_color : "all_fish_color",
        fish_speed : "fish_speed",
        feed_interval_time : "feed_interval_time",
        food_sort_type : "food_sort_type",
    },
    ctor:function()
    {
        this._all_level_list = {};
        var txtData = Platform.loadFileSync(res.JsonPath.koi_level);        
        var jsonObjdata = JSON.parse(txtData);
        var level_id = null;
        for (var k in jsonObjdata )
        {                        
            if ({}.hasOwnProperty.call(jsonObjdata, k)) {
                level_id = jsonObjdata[k]["level_id"];
                this._all_level_list["level_"+level_id] = jsonObjdata[k];
            }
        }
    },

    getLevelConfig : function(level){
        var level_conf = this._all_level_list["level_"+level];
        var temp = {};
        for (var k in level_conf) {
            if ({}.hasOwnProperty.call(level_conf, k)) {
                temp[k] = this._strToObject(level_conf[k]);
            }
        }
        //cc.log("temp---",temp);
        return temp;
    },
    getLevelKeyValue : function(level,key){
        return this._strToObject(this._all_level_list["level_"+level][key]);
    },
    _strToObject : function(str) {
        return eval("(" + str + ")"); 
    },    

});