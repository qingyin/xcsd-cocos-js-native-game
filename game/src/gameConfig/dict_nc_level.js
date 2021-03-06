var dict_number_level = {
    0:{
        id:0,
        energy_level:-2,
        learning_ability:"困难学习力",
        level_tips:"",
        star_term:{oneStar:-1,twoStar:-1,threeStar:-1},
        single_number_max:5,
        cell_drop_time:1.5,
        target_result:{min_value:6,max_value:10},
        equation:{count:0,drop_way:0,typeIndex:[]},
        bar_remove:{count:0,drop_way:0},
        bar_not_remove:{count:0,drop_way:0}
    },
    1:{
        id:1,
        energy_level:-1,
        learning_ability:"困难学习力",
        level_tips:"",
        star_term:{oneStar:3,twoStar:4,threeStar:5},
        single_number_max:5,
        cell_drop_time:1.5,
        target_result:{min_value:6,max_value:10},
        equation:{count:0,drop_way:0,typeIndex:[]},
        bar_remove:{count:0,drop_way:0},
        bar_not_remove:{count:0,drop_way:0}
    },
    2:{
        id:2,
        energy_level:0,
        learning_ability:"困难学习力",
        level_tips:"",
        star_term:{oneStar:4,twoStar:6,threeStar:8},
        single_number_max:5,
        cell_drop_time:1.5,
        target_result:{min_value:6,max_value:15},
        equation:{count:0,drop_way:0,typeIndex:[]},
        bar_remove:{count:0,drop_way:0},
        bar_not_remove:{count:0,drop_way:0}
    },
    3:{
        id:3,
        energy_level:0,
        learning_ability:"困难学习力",
        level_tips:"",
        star_term:{oneStar:5,twoStar:8,threeStar:10},
        single_number_max:9,
        cell_drop_time:1.5,
        target_result:{min_value:10,max_value:15},
        equation:{count:0,drop_way:0,typeIndex:[]},
        bar_remove:{count:0,drop_way:0},
        bar_not_remove:{count:0,drop_way:0}
    },
    4:{
        id:4,
        energy_level:1,
        learning_ability:"困难学习力",
        level_tips:"",
        star_term:{oneStar:8,twoStar:10,threeStar:12},
        single_number_max:9,
        cell_drop_time:1.5,
        target_result:{min_value:10,max_value:20},
        equation:{count:0,drop_way:0,typeIndex:[]},
        bar_remove:{count:0,drop_way:0},
        bar_not_remove:{count:0,drop_way:0}
    },
    5:{
        id:5,
        energy_level:1,
        learning_ability:"困难学习力",
        level_tips:"5以内加法",
        star_term:{oneStar:10,twoStar:13,threeStar:15},
        single_number_max:10,
        cell_drop_time:1.5,
        target_result:{min_value:15,max_value:20},
        equation:{count:3,drop_way:3,typeIndex:[1]},
        bar_remove:{count:0,drop_way:0},
        bar_not_remove:{count:0,drop_way:0}
    },
    6:{
        id:6,
        energy_level:2,
        learning_ability:"较低学习力",
        level_tips:"5以内减法",
        star_term:{oneStar:14,twoStar:16,threeStar:18},
        single_number_max:12,
        cell_drop_time:1.5,
        target_result:{min_value:15,max_value:20},
        equation:{count:3,drop_way:3,typeIndex:[2]},
        bar_remove:{count:0,drop_way:0},
        bar_not_remove:{count:0,drop_way:0}
    },
    7:{
        id:7,
        energy_level:2,
        learning_ability:"较低学习力",
        level_tips:"6-10加法",
        star_term:{oneStar:14,twoStar:16,threeStar:18},
        single_number_max:12,
        cell_drop_time:1.3,
        target_result:{min_value:15,max_value:20},
        equation:{count:4,drop_way:3,typeIndex:[3]},
        bar_remove:{count:0,drop_way:0},
        bar_not_remove:{count:0,drop_way:0}
    },
    8:{
        id:8,
        energy_level:2,
        learning_ability:"较低学习力",
        level_tips:"6-10减法",
        star_term:{oneStar:14,twoStar:16,threeStar:18},
        single_number_max:12,
        cell_drop_time:1.3,
        target_result:{min_value:15,max_value:20},
        equation:{count:4,drop_way:3,typeIndex:[4]},
        bar_remove:{count:0,drop_way:0},
        bar_not_remove:{count:0,drop_way:0}
    },
    9:{
        id:9,
        energy_level:3,
        learning_ability:"较低学习力",
        level_tips:"20以内进位加法",
        star_term:{oneStar:14,twoStar:16,threeStar:18},
        single_number_max:15,
        cell_drop_time:1.3,
        target_result:{min_value:20,max_value:25},
        equation:{count:5,drop_way:2,typeIndex:[5]},
        bar_remove:{count:0,drop_way:0},
        bar_not_remove:{count:0,drop_way:0}
    },
    10:{
        id:10,
        energy_level:3,
        learning_ability:"较低学习力",
        level_tips:"20以内进位加法",
        star_term:{oneStar:14,twoStar:16,threeStar:18},
        single_number_max:15,
        cell_drop_time:1.2,
        target_result:{min_value:20,max_value:25},
        equation:{count:3,drop_way:4,typeIndex:[6]},
        bar_remove:{count:0,drop_way:0},
        bar_not_remove:{count:0,drop_way:0}
    },
    11:{
        id:11,
        energy_level:3,
        learning_ability:"较低学习力",
        level_tips:"20以内进位加法",
        star_term:{oneStar:14,twoStar:16,threeStar:18},
        single_number_max:15,
        cell_drop_time:1.2,
        target_result:{min_value:20,max_value:25},
        equation:{count:4,drop_way:3,typeIndex:[7]},
        bar_remove:{count:2,drop_way:4},
        bar_not_remove:{count:0,drop_way:0}
    },
    12:{
        id:12,
        energy_level:4,
        learning_ability:"较低学习力",
        level_tips:"20以内退位减法",
        star_term:{oneStar:14,twoStar:16,threeStar:18},
        single_number_max:15,
        cell_drop_time:1.3,
        target_result:{min_value:20,max_value:25},
        equation:{count:3,drop_way:4,typeIndex:[8]},
        bar_remove:{count:2,drop_way:5},
        bar_not_remove:{count:0,drop_way:0}
    },
    13:{
        id:13,
        energy_level:4,
        learning_ability:"较低学习力",
        level_tips:"20以内退位减法",
        star_term:{oneStar:14,twoStar:16,threeStar:18},
        single_number_max:20,
        cell_drop_time:1.2,
        target_result:{min_value:25,max_value:30},
        equation:{count:4,drop_way:3,typeIndex:[9]},
        bar_remove:{count:3,drop_way:4},
        bar_not_remove:{count:0,drop_way:0}
    },
    14:{
        id:14,
        energy_level:4,
        learning_ability:"较低学习力",
        level_tips:"20以内退位减法",
        star_term:{oneStar:15,twoStar:17,threeStar:19},
        single_number_max:20,
        cell_drop_time:1.2,
        target_result:{min_value:25,max_value:30},
        equation:{count:5,drop_way:3,typeIndex:[10]},
        bar_remove:{count:3,drop_way:4},
        bar_not_remove:{count:0,drop_way:0}
    },
    15:{
        id:15,
        energy_level:5,
        learning_ability:"一般学习力",
        level_tips:"5的乘法口诀",
        star_term:{oneStar:15,twoStar:17,threeStar:19},
        single_number_max:20,
        cell_drop_time:1.5,
        target_result:{min_value:25,max_value:30},
        equation:{count:3,drop_way:3,typeIndex:[11]},
        bar_remove:{count:3,drop_way:4},
        bar_not_remove:{count:2,drop_way:5}
    },
    16:{
        id:16,
        energy_level:5,
        learning_ability:"一般学习力",
        level_tips:"2.3.4的乘法口诀",
        star_term:{oneStar:15,twoStar:17,threeStar:19},
        single_number_max:20,
        cell_drop_time:1.3,
        target_result:{min_value:25,max_value:30},
        equation:{count:4,drop_way:3,typeIndex:[12]},
        bar_remove:{count:3,drop_way:4},
        bar_not_remove:{count:2,drop_way:5}
    },
    17:{
        id:17,
        energy_level:5,
        learning_ability:"一般学习力",
        level_tips:"6的乘法口诀",
        star_term:{oneStar:15,twoStar:17,threeStar:19},
        single_number_max:20,
        cell_drop_time:1.2,
        target_result:{min_value:25,max_value:30},
        equation:{count:4,drop_way:2,typeIndex:[13]},
        bar_remove:{count:4,drop_way:3},
        bar_not_remove:{count:2,drop_way:5}
    },
    18:{
        id:18,
        energy_level:5,
        learning_ability:"一般学习力",
        level_tips:"7.8.9的乘法口诀",
        star_term:{oneStar:15,twoStar:17,threeStar:19},
        single_number_max:20,
        cell_drop_time:1.2,
        target_result:{min_value:25,max_value:30},
        equation:{count:5,drop_way:2,typeIndex:[14]},
        bar_remove:{count:4,drop_way:3},
        bar_not_remove:{count:3,drop_way:4}
    },
    19:{
        id:19,
        energy_level:6,
        learning_ability:"一般学习力",
        level_tips:"2-6的乘法口诀求商",
        star_term:{oneStar:15,twoStar:17,threeStar:19},
        single_number_max:20,
        cell_drop_time:1.3,
        target_result:{min_value:25,max_value:35},
        equation:{count:4,drop_way:2,typeIndex:[15]},
        bar_remove:{count:4,drop_way:3},
        bar_not_remove:{count:3,drop_way:4}
    },
    20:{
        id:20,
        energy_level:6,
        learning_ability:"一般学习力",
        level_tips:"2-6的乘法口诀求商",
        star_term:{oneStar:15,twoStar:17,threeStar:19},
        single_number_max:20,
        cell_drop_time:1.2,
        target_result:{min_value:25,max_value:35},
        equation:{count:5,drop_way:2,typeIndex:[15]},
        bar_remove:{count:4,drop_way:3},
        bar_not_remove:{count:3,drop_way:4}
    },
    21:{
        id:21,
        energy_level:6,
        learning_ability:"一般学习力",
        level_tips:"7-9的乘法口诀求商",
        star_term:{oneStar:15,twoStar:17,threeStar:19},
        single_number_max:20,
        cell_drop_time:1.2,
        target_result:{min_value:25,max_value:40},
        equation:{count:5,drop_way:2,typeIndex:[16]},
        bar_remove:{count:4,drop_way:3},
        bar_not_remove:{count:3,drop_way:4}
    },
    22:{
        id:22,
        energy_level:6,
        learning_ability:"一般学习力",
        level_tips:"7-9的乘法口诀求商",
        star_term:{oneStar:15,twoStar:17,threeStar:19},
        single_number_max:20,
        cell_drop_time:1.2,
        target_result:{min_value:25,max_value:40},
        equation:{count:6,drop_way:2,typeIndex:[16]},
        bar_remove:{count:5,drop_way:3},
        bar_not_remove:{count:3,drop_way:4}
    },
    23:{
        id:23,
        energy_level:7,
        learning_ability:"较高学习力",
        level_tips:"两位数乘一位数",
        star_term:{oneStar:16,twoStar:18,threeStar:20},
        single_number_max:25,
        cell_drop_time:1.5,
        target_result:{min_value:30,max_value:40},
        equation:{count:4,drop_way:3,typeIndex:[17]},
        bar_remove:{count:5,drop_way:2},
        bar_not_remove:{count:4,drop_way:4}
    },
    24:{
        id:24,
        energy_level:7,
        learning_ability:"较高学习力",
        level_tips:"两位数乘一位数",
        star_term:{oneStar:16,twoStar:18,threeStar:20},
        single_number_max:25,
        cell_drop_time:1.3,
        target_result:{min_value:30,max_value:40},
        equation:{count:5,drop_way:3,typeIndex:[17]},
        bar_remove:{count:5,drop_way:2},
        bar_not_remove:{count:4,drop_way:4}
    },
    25:{
        id:25,
        energy_level:7,
        learning_ability:"较高学习力",
        level_tips:"两位数乘一位数",
        star_term:{oneStar:16,twoStar:18,threeStar:20},
        single_number_max:25,
        cell_drop_time:1.2,
        target_result:{min_value:30,max_value:40},
        equation:{count:6,drop_way:2,typeIndex:[17]},
        bar_remove:{count:5,drop_way:3},
        bar_not_remove:{count:4,drop_way:4}
    },
    26:{
        id:26,
        energy_level:8,
        learning_ability:"较高学习力",
        level_tips:"多位数除法",
        star_term:{oneStar:16,twoStar:18,threeStar:20},
        single_number_max:25,
        cell_drop_time:1.2,
        target_result:{min_value:30,max_value:40},
        equation:{count:4,drop_way:3,typeIndex:[18]},
        bar_remove:{count:5,drop_way:2},
        bar_not_remove:{count:4,drop_way:4}
    },
    27:{
        id:27,
        energy_level:8,
        learning_ability:"较高学习力",
        level_tips:"多位数除法",
        star_term:{oneStar:16,twoStar:18,threeStar:20},
        single_number_max:25,
        cell_drop_time:1.2,
        target_result:{min_value:30,max_value:40},
        equation:{count:5,drop_way:3,typeIndex:[18]},
        bar_remove:{count:5,drop_way:2},
        bar_not_remove:{count:4,drop_way:4}
    },
    28:{
        id:28,
        energy_level:8,
        learning_ability:"较高学习力",
        level_tips:"多位数除法",
        star_term:{oneStar:16,twoStar:18,threeStar:20},
        single_number_max:30,
        cell_drop_time:1.2,
        target_result:{min_value:35,max_value:40},
        equation:{count:6,drop_way:2,typeIndex:[18]},
        bar_remove:{count:5,drop_way:3},
        bar_not_remove:{count:4,drop_way:4}
    },
    29:{
        id:29,
        energy_level:9,
        learning_ability:"高学习力",
        level_tips:"四则运算",
        star_term:{oneStar:16,twoStar:18,threeStar:20},
        single_number_max:30,
        cell_drop_time:1,
        target_result:{min_value:35,max_value:45},
        equation:{count:5,drop_way:3,typeIndex:[19]},
        bar_remove:{count:6,drop_way:2},
        bar_not_remove:{count:4,drop_way:4}
    },
    30:{
        id:30,
        energy_level:10,
        learning_ability:"高学习力",
        level_tips:"四则运算",
        star_term:{oneStar:16,twoStar:18,threeStar:20},
        single_number_max:30,
        cell_drop_time:1,
        target_result:{min_value:35,max_value:45},
        equation:{count:6,drop_way:2,typeIndex:[19]},
        bar_remove:{count:6,drop_way:3},
        bar_not_remove:{count:4,drop_way:4}
    }
};