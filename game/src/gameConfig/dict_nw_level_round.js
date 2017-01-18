var dict_nw_target_desc = {
    1: '找出包含以下偏旁部首的生字',
    2: '找出包含以下汉字的生字',
    3: '找出与以下汉字偏旁部首相同的生字',
    4: '找出与以下生字结构一致的生字',
    5: '找出与以下读音一致的生字',
    6: '找出以下生字的同音字',
    7: '找出刚才出现过的所有生字',
    8: '找出刚才没有出现过的所有生字',
}
var WL_PINYIN_KEY_LIST = [];
for(var k in WL_PINYIN){
    WL_PINYIN_KEY_LIST[WL_PINYIN_KEY_LIST.length] = k;
}
var WL_PIANPANG_KEY_LIST = [];
for(var k in WL_PIANPANG){
    WL_PIANPANG_KEY_LIST[WL_PIANPANG_KEY_LIST.length] = k;
}
var WL_STRUCTURE_KEY_LIST = [];
for(var k in WL_STRUCTURE){
    WL_STRUCTURE_KEY_LIST[WL_STRUCTURE_KEY_LIST.length] = k;
}

var WL_PINYIN_STR = '';
for(var k in WL_PINYIN){
    WL_PINYIN_STR += WL_PINYIN[k];
}

var WL_PIANPANG_STR = '';
for(var k in WL_PIANPANG){
    WL_PIANPANG_STR += WL_PIANPANG[k];
}
var dict_nw_level_round = {
    "100": {id:100,targetDesc:dict_nw_target_desc[1],shownTime:2,target:{eleKeyList:['阝', '刂', '讠'],eleKeyNum:[4]},wordSet:WL_PIANPANG,moreWordSet:MORE_WL_PIANPANG},

    "101": {id:101,targetDesc:dict_nw_target_desc[1],shownTime:2,target:{eleKeyList:['阝', '刂', '讠'],eleKeyNum:[6]},wordSet:WL_PIANPANG,moreWordSet:MORE_WL_PIANPANG},
    "201": {id:201,targetDesc:dict_nw_target_desc[1],shownTime:2,target:{eleKeyList:['彳', '辶', '扌'],eleKeyNum:[7]},wordSet:WL_PIANPANG,moreWordSet:MORE_WL_PIANPANG},
    "301": {id:301,targetDesc:dict_nw_target_desc[1],shownTime:2,target:{eleKeyList:['忄', '犭', '氵'],eleKeyNum:[8]},wordSet:WL_PIANPANG,moreWordSet:MORE_WL_PIANPANG},
    "401": {id:401,targetDesc:dict_nw_target_desc[1],shownTime:2,target:{eleKeyList:['亻', '纟', '宀', '攵', '艹'],eleKeyNum:[4,5]},wordSet:WL_PIANPANG,moreWordSet:MORE_WL_PIANPANG},
    "501": {id:501,targetDesc:dict_nw_target_desc[1],shownTime:2,target:{eleKeyList:['禾', '钅', '灬', '尸', '疒'],eleKeyNum:[5,5]},wordSet:WL_PIANPANG,moreWordSet:MORE_WL_PIANPANG},
    "601": {id:601,targetDesc:dict_nw_target_desc[2],shownTime:2,target:{eleKeyList:['雨', '日', '马'],eleKeyNum:[6]},wordSet:WL_CONTENT,moreWordSet:MORE_WL_CONTENT},
    "701": {id:701,targetDesc:dict_nw_target_desc[2],shownTime:2,target:{eleKeyList:['力', '田', '月', '心'],eleKeyNum:[3,4]},wordSet:WL_CONTENT,moreWordSet:MORE_WL_CONTENT},
    "801": {id:801,targetDesc:dict_nw_target_desc[2],shownTime:2,target:{eleKeyList:['目', '鸟', '虫', '车', '女'],eleKeyNum:[4,5]},wordSet:WL_CONTENT,moreWordSet:MORE_WL_CONTENT},
    "901": {id:901,targetDesc:dict_nw_target_desc[3],shownTime:2,target:{eleKeyList:WL_PIANPANG_KEY_LIST,eleKeyNum:[6]},wordSet:WL_PIANPANG,moreWordSet:MORE_WL_PIANPANG},

    "1001": {id:1001,targetDesc:dict_nw_target_desc[3],shownTime:2,target:{eleKeyList:WL_PIANPANG_KEY_LIST,eleKeyNum:[7]},wordSet:WL_PIANPANG,moreWordSet:MORE_WL_PIANPANG},
    "1101": {id:1101,targetDesc:dict_nw_target_desc[3],shownTime:2,target:{eleKeyList:WL_PIANPANG_KEY_LIST,eleKeyNum:[4,4]},wordSet:WL_PIANPANG,moreWordSet:MORE_WL_PIANPANG},
    "1201": {id:1201,targetDesc:dict_nw_target_desc[3],shownTime:2,target:{eleKeyList:WL_PIANPANG_KEY_LIST,eleKeyNum:[5,4]},wordSet:WL_PIANPANG,moreWordSet:MORE_WL_PIANPANG},
    "1301": {id:1301,targetDesc:dict_nw_target_desc[4],shownTime:2,target:{eleKeyList:WL_STRUCTURE_KEY_LIST,eleKeyNum:[6]},wordSet:WL_STRUCTURE,},
    "1401": {id:1401,targetDesc:dict_nw_target_desc[4],shownTime:2,target:{eleKeyList:WL_STRUCTURE_KEY_LIST,eleKeyNum:[7]},wordSet:WL_STRUCTURE,},
    "1501": {id:1501,targetDesc:dict_nw_target_desc[4],shownTime:2,target:{eleKeyList:WL_STRUCTURE_KEY_LIST,eleKeyNum:[4,4]},wordSet:WL_STRUCTURE,},
    "1601": {id:1601,targetDesc:dict_nw_target_desc[5],shownTime:2,target:{eleKeyList:['yi', 'yu', 'ba', 'ma', 'da', 'di', 'ke', 'he', 'hu', 'jia'],eleKeyNum:[6]},wordSet:WL_PINYIN,moreWordSet:MORE_WL_PINYIN},
    "1701": {id:1701,targetDesc:dict_nw_target_desc[5],shownTime:2,target:{eleKeyList:['xi', 'si', 'zhi', 'chi', 'shi', 'zhu', 'shu', 'chu', 'bei', 'fei', 'mei', 'hui'],eleKeyNum:[4,4]},wordSet:WL_PINYIN,moreWordSet:MORE_WL_PINYIN},
    "1801": {id:1801,targetDesc:dict_nw_target_desc[5],shownTime:2,target:{eleKeyList:['yuan', 'shen', 'yin', 'zhang', 'jing', 'xing', 'yang', 'yun', 'ban', 'tan', 'xiao', 'yao', 'you', 'jiu'],eleKeyNum:[3,3,3]},wordSet:WL_PINYIN,moreWordSet:MORE_WL_PINYIN},
    "1901": {id:1901,targetDesc:dict_nw_target_desc[6],shownTime:2,target:{eleKeyList:WL_PINYIN_KEY_LIST,eleKeyNum:[6]},wordSet:WL_PINYIN,moreWordSet:MORE_WL_PINYIN},

    "2001": {id:2001,targetDesc:dict_nw_target_desc[6],shownTime:2,target:{eleKeyList:WL_PINYIN_KEY_LIST,eleKeyNum:[4,4]},wordSet:WL_PINYIN,moreWordSet:MORE_WL_PINYIN},
    "2101": {id:2101,targetDesc:dict_nw_target_desc[6],shownTime:2,target:{eleKeyList:WL_PINYIN_KEY_LIST,eleKeyNum:[3,3,3]},wordSet:WL_PINYIN,moreWordSet:MORE_WL_PINYIN},
    "2201": {id:2201,targetDesc:dict_nw_target_desc[7],shownTime:2,target:{isFindTarget:true,ele:WL_PIANPANG_STR,eleKeyList:[],eleKeyNum:[4]},wordSet:WL_PIANPANG,moreWordSet:MORE_WL_PIANPANG},
    "2202": {id:2202,targetDesc:dict_nw_target_desc[7],shownTime:2,target:{isFindTarget:true,ele:WL_PIANPANG_STR,eleKeyList:[],eleKeyNum:[5]},wordSet:WL_PIANPANG,moreWordSet:MORE_WL_PIANPANG},
    "2301": {id:2301,targetDesc:dict_nw_target_desc[7],shownTime:2,target:{isFindTarget:true,ele:WL_PIANPANG_STR,eleKeyList:[],eleKeyNum:[5]},wordSet:WL_PIANPANG,moreWordSet:MORE_WL_PIANPANG},
    "2302": {id:2302,targetDesc:dict_nw_target_desc[7],shownTime:2,target:{isFindTarget:true,ele:WL_PIANPANG_STR,eleKeyList:[],eleKeyNum:[6]},wordSet:WL_PIANPANG,moreWordSet:MORE_WL_PIANPANG},
    "2303": {id:2303,targetDesc:dict_nw_target_desc[7],shownTime:2,target:{isFindTarget:true,ele:WL_PIANPANG_STR,eleKeyList:[],eleKeyNum:[7]},wordSet:WL_PIANPANG,moreWordSet:MORE_WL_PIANPANG},
    "2401": {id:2401,targetDesc:dict_nw_target_desc[7],shownTime:2,target:{isFindTarget:true,ele:WL_PIANPANG_STR,eleKeyList:[],eleKeyNum:[7]},wordSet:WL_PIANPANG,moreWordSet:MORE_WL_PIANPANG},
    "2402": {id:2402,targetDesc:dict_nw_target_desc[7],shownTime:2,target:{isFindTarget:true,ele:WL_PIANPANG_STR,eleKeyList:[],eleKeyNum:[8]},wordSet:WL_PIANPANG,moreWordSet:MORE_WL_PIANPANG},
    "2501": {id:2501,targetDesc:dict_nw_target_desc[7],shownTime:2,target:{isFindTarget:true,ele:WL_PIANPANG_STR,eleKeyList:[],eleKeyNum:[8]},wordSet:WL_PIANPANG,moreWordSet:MORE_WL_PIANPANG},
    "2502": {id:2502,targetDesc:dict_nw_target_desc[7],shownTime:2,target:{isFindTarget:true,ele:WL_PIANPANG_STR,eleKeyList:[],eleKeyNum:[9]},wordSet:WL_PIANPANG,moreWordSet:MORE_WL_PIANPANG},
    "2601": {id:2601,targetDesc:dict_nw_target_desc[7],shownTime:2,target:{isFindTarget:true,ele:WL_PIANPANG_STR,eleKeyList:[],eleKeyNum:[9]},wordSet:WL_PIANPANG,moreWordSet:MORE_WL_PIANPANG},
    "2602": {id:2602,targetDesc:dict_nw_target_desc[7],shownTime:2,target:{isFindTarget:true,ele:WL_PIANPANG_STR,eleKeyList:[],eleKeyNum:[10]},wordSet:WL_PIANPANG,moreWordSet:MORE_WL_PIANPANG},
    "2701": {id:2701,targetDesc:dict_nw_target_desc[8],shownTime:2,target:{isFindTarget:false,ele:WL_PINYIN_STR,eleKeyList:[],eleKeyNum:[6]},wordSet:WL_PINYIN,moreWordSet:MORE_WL_PINYIN},
    "2801": {id:2801,targetDesc:dict_nw_target_desc[8],shownTime:2,target:{isFindTarget:false,ele:WL_PINYIN_STR,eleKeyList:[],eleKeyNum:[7]},wordSet:WL_PINYIN,moreWordSet:MORE_WL_PINYIN},
    "2901": {id:2901,targetDesc:dict_nw_target_desc[8],shownTime:2,target:{isFindTarget:false,ele:WL_PINYIN_STR,eleKeyList:[],eleKeyNum:[8]},wordSet:WL_PINYIN,moreWordSet:MORE_WL_PINYIN},

    "3001": {id:3001,targetDesc:dict_nw_target_desc[8],shownTime:2,target:{isFindTarget:false,ele:WL_PINYIN_STR,eleKeyList:[],eleKeyNum:[9]},wordSet:WL_PINYIN,moreWordSet:MORE_WL_PINYIN},
}

isFindTarget:true

