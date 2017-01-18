var spiderAttribute = {
	0:{spider_type: "空间思维", type_color:cc.color(236,22,68,255)}, 
	1:{spider_type:"反应力", type_color:cc.color(244,193,2,255)}, 
	2:{spider_type:"记忆力", type_color:cc.color(23,215,127,255)}, 
	3:{spider_type:"注意力", type_color:cc.color(30,162,255,225)}, 
	4:{spider_type:"逻辑力", type_color:cc.color(189,79,235,255)}
}

var TEST_TYPE_COUNT = 5;

var tipArray = {
	1:{
		title:"学能商数是什么？",
		content:"       与IQ类似，学能商数是通过测试得出你孩子在学习方面的各项能力，每个孩子的学习成绩好坏，其实和他的学习能力直接相关，根据大脑学习加工的认知功能，将学习能力分为五大能力，分别是注意力 、记忆力、反应力、逻辑力、空间思维。每种能力分为12个等级，从-1到10。"
				 + "\n" + "       五种能力分别对应着不同的训练游戏，我们会根据学生的学能商数水平去适配学生的训练计划， 所以赶紧让你的孩子点击去测试吧。",
	},
	3:{
		title:"学能训练积分是什么？",
		content:"       学能训练积分与根据孩子做游戏与作业时获得的成绩相关，如果通关的游戏越多，则孩子的学能训练积分越高。",
	},
	2:{
		title:"学习商数进化图是什么？",
		content:"       学能商数进化图与孩子的测试成绩相关，展示了学习能力的变化曲线，根据每月两次的学能测试，孩子可以看到自己班级里的相应学能水平，有针对性的训练自己哦。",
	},
}

var fullMarkArray = [
	[60,60,30,60,60],
	[120,120,60,120,120],
	[180,180,90,180,180],
	[240,240,120,240,240],
	[300,300,150,300,300],
	[360,360,180,360,360]
]


var testChildAttr = [
    {
        userId : 123456,
        name:"张小玲",
        ability : {1:2,2:-2,3:-2,4:-2,5:-2},
        abilityQuotient : 10,
        abilityScores : {1:45,2:92,3:100,4:200,5:160},
        abilityHistory : [
            // {testId:1, grade:140},
            // {testId:2, grade:240},
            // {testId:3, grade:320},
            // {testId:4, grade:420},
            // {testId:5, grade:430},   
            // {testId:6, grade:680}
        ],
        abilityTotalScore : 110,
        rankRate : 0,
        remainTestCount : 0,
        isFirstTest : true,
        testList : [
            // {gameId:1},
            // {gameId:2},
            // {gameId:3},
            // {gameId:4},
            // {gameId:5},
            {gameId:1,level:1},
            {gameId:3,level:1},
            // {gameId:4,level:1},
            // {gameId:2,level:1}
            //{gameId:5,level:1}
        ],
    },
    {
        userId : 234567,
        name:"张小媛",
        ability : {1:1,2:2,3:3,4:4,5:5},
        abilityQuotient : 20,
        abilityScores : {1:75,2:60,3:130,4:190,5:120}, 
        abilityHistory : [
            {key:1, value:160},
            {key:2, value:200},
            {key:5, value:402},
            {key:3, value:340},
            {key:4, value:370},
            
            {key:6, value:580}
        ],
        abilityTotalScore : 100,
        rankRate : 0.50,
        remainTestCount : 2,
        isFirstTest : false,
        testList : [
            {gameId:1,level:1},
            {gameId:3,level:1},
            {gameId:4,level:1},
            {gameId:2,level:1},
            {gameId:5,level:1}
        ],
    },
]