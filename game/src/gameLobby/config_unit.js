var UNIT_LAYOUT = [
    [2],
    [3],
    [4],
    [1],
    [5],
    [6],
    [7],
    [8],
    [9],
    [11],
    // [10],
    [100],
];
 
var UNIT_CONFIG = {
    1:{gameID:1,gameName:'序列方阵',type:'注意力', res:res.game.game_icon_schultegrid, gameIcon:res.learnTask.LearnWork_schultegrid_small,levelCount:30},
    2:{gameID:2,gameName:'数字排排坐',type:'逻辑力', res:res.game.game_icon_numberCrash, gameIcon:res.learnTask.LearnWork_numberCrash_small,levelCount:30},
    3:{gameID:3,gameName:'颜色混淆',type:'反应力', res:res.game.game_icon_colorMachine, gameIcon:res.learnTask.colorMachine_icon_small,levelCount:30},
    4:{gameID:4,gameName:'海底世界',type:'注意力', res:res.game.game_icon_seabed,gameIcon:res.learnTask.LearnWork_seabed_small,levelCount:30},
    5:{gameID:5,gameName:'位置记忆',type:'记忆力', res:res.game.game_icon_positionmemory,gameIcon:res.learnTask.LearnWork_positionmemory_small,levelCount:30},
    6:{gameID:6,gameName:'生字大比拼',type:'记忆力', res:res.game.game_icon_newWorlds,gameIcon:res.learnTask.LearnWork_newWorlds_small,levelCount:30},
    7:{gameID:7,gameName:'七巧板',type:'空间思维', res:res.game.game_icon_tangram,gameIcon:res.learnTask.LearnWork_tangram_small,levelCount:30},
    8:{gameID:8,gameName:'堆叠圆盘',type:'空间思维', res:res.game.game_icon_stack,gameIcon:res.learnTask.LearnWork_stack_small,levelCount:30},
    9:{gameID:9,gameName:'画路迷宫',type:'逻辑力', res:res.game.game_icon_painting,gameIcon:res.learnTask.LearnWork_painting_small,levelCount:30},
    10:{gameID:10,gameName:'捕鱼达人',type:'注意力', res:res.game.game_icon_seabed,gameIcon:res.learnTask.LearnWork_seabed_small,levelCount:30},
    11:{gameID:11,gameName:'喂鱼大战',type:'记忆力', res:res.game.game_icon_fish,gameIcon:res.learnTask.LearnWork_fish_small,levelCount:30},
    100:{gameID:100,gameName:'ComeSoon',type:'ComeSoon', res:res.game.game_icon_pleaselook,gameIcon:"",levelCount:0},
}

var VIEW_CONFIG = {
    1:{
        gameName:'序列方阵',
        taskGameColor:{r:248, g:180, b:75,Opacity:255},
        mainColor:{r:255,g:179,b:63,Opacity:255},
        cupColor:{r:255,g:212,b:138,Opacity:255},
        bg_color:{r:252,g:246,b:236,Opacity:255},
      },
    2:{
        gameName:'数字排排坐',
        taskGameColor:{r:0, g:189, b:156,Opacity:255},
        mainColor:{r:59,g:212,b:182,Opacity:255},
        cupColor:{r:137,g:229,b:211,Opacity:255},
        bg_color:{r:244,g:251,b:235,Opacity:255},
      },
    3:{
        gameName:'颜色混淆',
        taskGameColor:{r:255, g:100, b:78,Opacity:255},
        mainColor:{r:240,g:123,b:106,Opacity:255},
        cupColor:{r:242,g:154,b:138,Opacity:255},
        bg_color:{r:252,g:243,b:236,Opacity:255},
      },
    4:{
        gameName:'海底世界',
        taskGameColor:{r:141, g:177, b:241,Opacity:255},
        mainColor:{r:107,g:176,b:195,Opacity:255},
        cupColor:{r:142,g:195,b:209,Opacity:255},
        bg_color:{r:211,g:226,b:233,Opacity:255},
      },
    5:{
        gameName:'位置记忆',
        taskGameColor:{r:181, g:137, b:207,Opacity:255},
        mainColor:{r:180,g:133,b:208,Opacity:255},
        cupColor:{r:222,g:202,b:233,Opacity:255},
        bg_color:{r:238,g:231,b:242,Opacity:255},
      },
    6:{
        gameName:'生字大比拼',
        taskGameColor:{r:61, g:192, b:129,Opacity:255},
        mainColor:{r:18,g:175,b:99,Opacity:255},
        cupColor:{r:143,g:230,b:190,Opacity:255},
        bg_color:{r:245,g:242,b:217,Opacity:255},
      },
    7:{
        gameName:'七巧板',
        taskGameColor:{r:255, g:162, b:214,Opacity:255},
        mainColor:{r:255,g:162,b:214,Opacity:255},
        cupColor:{r:255,g:191,b:227,Opacity:255},
        bg_color:{r:249,g:236,b:233,Opacity:255},
      },
    8:{
        gameName:'堆叠圆盘',
        taskGameColor:{r:242, g:203, b:49,Opacity:255},
        mainColor:{r:254,g:220,b:86,Opacity:255},
        cupColor:{r:242,g:203,b:49,Opacity:255},
        bg_color:{r:255,g:250,b:236,Opacity:255},
      },
      9:{
        gameName:'画路迷宫',
        taskGameColor:{r:101, g:185, b:9,Opacity:255},
        mainColor:{r:101,g:185,b:9,Opacity:255},
        cupColor:{r:101,g:185,b:9,Opacity:255},
        bg_color:{r:236,g:255,b:243,Opacity:255},
      },
      10:{
        gameName:'捕鱼达人',
        taskGameColor:{r:141, g:177, b:241,Opacity:255},
        mainColor:{r:107,g:176,b:195,Opacity:255},
        cupColor:{r:142,g:195,b:209,Opacity:255},
        bg_color:{r:211,g:226,b:233,Opacity:255},
      },

      11:{
        gameName:'喂鱼大战',
        taskGameColor:{r:141, g:177, b:241,Opacity:255},
        mainColor:{r:106,g:128,b:240,Opacity:255},
        cupColor:{r:106,g:128,b:240,Opacity:255},
        bg_color:{r:217,g:222,b:234,Opacity:255},
      },
    100:{
        gameName:'ComeSoon',
        mainColor:{r:123,g:123,b:123,Opacity:255},
        cupColor:{r:255,g:179,b:63,Opacity:255},
        bg_color:"",
        help_pic:"",
      },
}

var GAME_GUIDE_TIP = {
    1:{
        gameName:'序列方阵',
        guideTip : {
            0: '准备好了吗？游戏马上开始喽！',
            1: '点击初始数字',
            2: '点击初始数字+1后的数字',
            3: '继续点击之后的数字',
        }
    },
    2:{
        gameName:'数字排排坐',
        guideTip : {
            0: '准备好了吗？游戏马上开始喽！',
            1: '这是目标数字',
            2: '点击方块，直至总和等于目标数字',
            3: '你可以点击重置按钮，删除总和',
            4: '不要让方块堆到顶！',
            5: '你也可以点击方块以取消选择',
            6: '失败了也不要气馁， 让我们再玩一次吧！',
            7: '点击单格数字方块',
        }
    },
    3:{
        gameName:'颜色混淆',
        guideTip : {
            0: '准备好了吗？游戏马上开始喽！',
            1: '文字颜色和长方形颜色相同吗？',
            2: '这次的答案是？',
            3: '通过手指移动来答题！',
            4: '再试试看！',
            5: '点击正确答案！',
            6: '卡片周围任意位置向右滑动回答“是”，向左滑动回答”否“。',
        }
    },
    4:{
        gameName:'海底世界',
        guideTip : {
            0: '准备好了吗？游戏马上开始喽！',
            1: '什么鱼被装到了鱼缸里？',
            2: '和鱼缸中相同的鱼出现了！',
            3: '看到相同的鱼后点击屏幕任意位置。',
            4: '有几条相同的鱼点击几次屏幕。',
            5: '失败了也不要气馁， 让我们再玩一次吧！',
        }
    },
    5:{
        gameName:'位置记忆',
        guideTip : {
            0: '准备好了吗？游戏马上开始喽！',
            1: '记住有颜色和带形状的格子位置',
            2: '点击其中有颜色和带形状的格子',
            3: '你点错了格子',
            4: '这次该点击哪些格子呢？',
        }
    },
    6:{
        gameName:'生字大比拼',
        guideTip : {
            0: '准备好了吗？游戏马上开始喽！',
            1: '记住偏旁部首',
            2: '点击对应偏旁部首的文字',
            3: '失败了也不要气馁， 让我们再玩一次吧！',
        }
    },
    7:{
        gameName:'七巧板',
        guideTip : {
            0: '准备好了吗？游戏马上开始喽！',
            1: '将三角板拖动重合上方三角形',
            2: '请根据演示操作一遍',
            3: '将平行四边形板拖动重合上方平行四边形',
            4: '双击图形板，使图形板水平翻转',
            5: '将剩余的图形板拖动重合上方对应的图形',
        }
    },
    8:{
        gameName:'堆叠圆盘',
        guideTip : {
            0: '准备好了吗？游戏马上开始喽！',
            1: '仔细观察侧视图的顺序、大小和颜色',
            2: '选择与侧视图完全匹配的顶视图',
            3: '这次要选择哪一个呢？',
        }
    },
    9:{
        gameName:'画路迷宫',
        guideTip : {
            0: '准备好了吗？游戏马上开始喽！',
            1: '向下拖动颜色方块画出一条路',
            2: '数字表示用这种颜色还要画几格。拖动方块填充格子！',
            3: '现在有2种颜色，拖动每个数字，填充空格！',
            4: '可以将路径往回拖或者点击数字，即可撤销。',
            
        }
    },
    10:{
        gameName:'捕鱼达人',
        guideTip : {
            0: '准备好了吗？游戏马上开始喽！',
            1: '什么鱼被装到了鱼缸里？',
            2: '和鱼缸中相同的鱼出现了！',
            3: '看到相同的鱼后点击屏幕任意位置。',
            4: '有几条相同的鱼点击几次屏幕。',
            5: '失败了也不要气馁， 让我们再玩一次吧！',
        }
    },
    11:{
        gameName:'喂鱼大战',
        guideTip : {
            0: '准备好了吗？游戏马上开始喽！',
            1: '点击鱼，用相应颜色的鱼食喂鱼。',
            2: '记住每条鱼的位置，一颗鱼食只能为一条鱼。',
        }
    },
}
