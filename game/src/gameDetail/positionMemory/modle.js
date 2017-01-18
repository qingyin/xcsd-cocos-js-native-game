
var PositionModle = cc.Node.extend({
    _ele:{_color:null,_shape:null,_color_shape:null},
    _data:{
        row_num:null,
        column_num:null,
        shown_time:null,
        target_desc:null,
        target_show_flag : false,
        list_target_eleID:[],
        list_ele_below:[],
        list_ele_above:[],
        repeat_num:null,
        energyLevel:null,
    },
    ctor:function () {        
        this._super();
        this._ele._color = [];
        this._ele._shape = [];
        this._ele._color_shape = [];        
        
    },
    getEleList:function(){
        if (this._ele._color_shape.length > 0) {
            return;
        }
        for (var k in dict_pm_element) {
            if (dict_pm_element[k].type == 'color'){
                this._ele._color.push(k);
            }else if(dict_pm_element[k].type == 'shape'){
                this._ele._shape.push(k);
            }
        }
        this._ele._color_shape = this._ele._color.concat(this._ele._shape);
        return this._ele;
    },
    getConfig:function(level,repeat_index, isTest, isFirstTest, isGuide){
        this.getEleList();
        var unit = null;
        repeat_index = repeat_index - 1;

        if (isGuide || (isFirstTest == false && isTest == false)) {
            this._data.repeat_num = dict_pm_level[String(level)].round_id_list.length;
            var round_id = dict_pm_level[String(level)].round_id_list[repeat_index];
            unit = dict_pm_level_round[String(round_id)];
        }else if(isFirstTest == true) {
            this._data.repeat_num = first_test_pm_level[String(level)].round_id_list.length;
            var round_id = first_test_pm_level[String(level)].round_id_list[repeat_index];
            unit = first_test_pm_level_round[String(round_id)];
            this._data.energyLevel = unit.energy_level;

            if (repeat_index > 0) {
                var frontRoundId = first_test_pm_level[String(level)].round_id_list[repeat_index];
                this._data.currEnergyLevel = first_test_pm_level_round[String(frontRoundId)].energy_level;
            }
        }else if (isTest == true) {
            this._data.repeat_num = test_pm_level[String(level)].round_id_list.length;
            this._data.energyLevel = test_pm_level[String(level)].energy_level;
            var round_id = test_pm_level[String(level)].round_id_list[repeat_index];
            unit = test_pm_level_round[String(round_id)];  
        }
        
        //cc.log("unit", unit, level, repeat_index, isTest);
        
        if (unit == null || typeof(unit) == 'undefined'){
            cc.log("error!!!! pm config level=",level," index=",repeat_index);  
            return;          
        }

        this._data.shown_time = unit.shown_time;
        this._data.target_desc = unit.target.desc;

        if (typeof(unit.target.desc)=='string' && unit.target.desc.length > 0){

            this._data.target_show_flag = true;
        }else{
            this._data.target_show_flag = false;
        }

        var v2 = unit.row_range[1]||unit.row_range[0];
        this._data.row_num = unit.row_range[0]+Math.round(Math.random()*(v2-unit.row_range[0]));
        v2 = unit.column_range[1]||unit.column_range[0];
        this._data.column_num = unit.column_range[0]+Math.round(Math.random()*(v2-unit.column_range[0]));
        

        v2 = unit.total_ele_num_range[1]||unit.total_ele_num_range[0];
        var total_ele_num = unit.total_ele_num_range[0]+Math.round(Math.random()*(v2-unit.total_ele_num_range[0]));

        v2 = unit.ele1_num_range[1]||unit.ele1_num_range[0];
        var ele1_num=0,ele2_num=0,ele3_num=0;
        ele1_num = unit.ele1_num_range[0]+Math.round(Math.random()*(v2-unit.ele1_num_range[0])); 
        if (unit.ele_type_num < 2){
            ele1_num = total_ele_num;
        }else if (unit.ele_type_num == 2){       
            ele2_num = total_ele_num - ele1_num;
        }else{
            v2 = unit.ele2_num_range[1]||unit.ele2_num_range[0];
            ele2_num = unit.ele2_num_range[0] + Math.round(Math.random()*(v2-unit.ele2_num_range[0]));
            ele3_num = total_ele_num - ele1_num - ele2_num;
        }

        this.shuffle(this._ele._color);
        this.shuffle(this._ele._shape);
        this.shuffle(this._ele._color_shape);

        var ele = [];
        var total_ele_type = [];
        for (var i=0;i<unit.ele_type_num;i++){
            if (i < 1){
                if (unit.ele_type_num == 1){
                    ele.push(this._ele._color_shape[i]);
                }else{
                    ele.push(this._ele._color[i]);
                }
            }
            else{
                ele.push(this._ele._shape[i-1]);
            }

            for (var j=0;j<unit.target.target_list.length;j++){
                if ((i+1) == unit.target.target_list[j]){
                    total_ele_type.push(ele[i]);
                    break;
                }
            }
        }

        this.shuffle(total_ele_type);
        this._data.list_target_eleID = [];
        for (var i=0;i<unit.target.target_num;i++){
            this._data.list_target_eleID.push(total_ele_type[i]);
        }

        this._data.list_ele_below = [];
        for (var i=0;i<ele1_num;i++){
            this._data.list_ele_below.push(ele[0]);
        }
        for (var i=0;i<ele2_num;i++){
            this._data.list_ele_below.push(ele[1]);
        }
        for (var i=0;i<ele3_num;i++){
            this._data.list_ele_below.push(ele[2]);
        }
        
        this._data.list_ele_above = [];
        for (var i=0;i<unit.overlap_num;i++){
            var v = this._data.list_ele_below.pop();
            this._data.list_ele_above.push(String(v));
        }

        return this._data;
    },

    getRandomPosArray:function(row_num,col_num){
        var posArray = [];
        var len = 0;
        for (var i=0;i<row_num;i++){
            for (var j = 0; j < col_num; j++) {
                posArray[len] = {row:i,col:j};
                len += 1;
            }
        }
        this.shuffle(posArray);
        return posArray;
    },
    shuffle:function(arr){
        var temp=null,len = arr.length;
        var swap=function(array,index1,index2){            
            temp = array[index1];
            array[index1] = array[index2];
            array[index2] = temp;
        }
        while(len > 1){
            len = len - 1;
            var index1 = Math.round(Math.random()*len);
            swap(arr,index1,len);
        }
    },
});

