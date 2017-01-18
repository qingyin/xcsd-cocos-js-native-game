var WL_PINYIN = {
    'yi' : '一伊衣医依咿义仪夷怡宜姨乙已以尾蚁倚椅亿艺忆议屹亦异抑呓邑役译易诣驿绎轶疫弈羿奕益逸溢意',
    'yu' : '与鱼语于玉雨余宇遇欲羽预育予域裕浴喻郁御渔愈愚豫狱寓娱驭淤誉',
    'ba' : '八巴吧芭疤拔跋把坝爸罢耙跁靶霸笆',
    'ma' : '嘛蟆妈抹麻嘛马犸吗玛码蚂骂',
    'da' : '大哒耷答嗒搭打达妲沓答瘩',
    'di' : '敌第低地底迪递抵帝弟滴狄笛嘀的堤邸蒂',
    'ke' : '可课颗科克客刻壳渴棵咳磕蝌瞌苛轲',
    'he' : '贺何禾鹤河合盒呵嗬狢阂吓荷和喝阖赫涸饸壑',
    'hu' : '胡虎户湖呼壶糊互护乎弧唬忽狐沪葫蝴浒',
    'jia' : '加甲夹价夾伽郏茄迦岬驾佳架珈玾胛荚浃枷家贾钾痂假戛笳颊葭嫁',
    'xi' : '吸习洗西系戏细喜息兮希锡惜熙曦席溪夕稀悉嘻袭析膝熄媳汐',
    'si' : '四死思斯似丝司私撕寺肆厮泗嘶饲驷伺锶',
    'zhi' : '只至值知支止之职指直纸制治智致质置织芝汁痣址脂执侄滞肢',
    'chi' : '吃迟尺池持翅痴赤齿驰耻斥炽嗤侈饬叱',
    'shi' : '是时使视十士试适事师识市室石屎诗实施始湿示拾史仕势释',
    'zhu' : '嘱主祝注住助珠驻著猪朱煮竹筑诸株烛柱铸逐竺蛀蛛瞩',
    'shu' : '数树书叔输熟属术舒鼠述梳束竖淑署蜀黍疏暑恕殊赎薯墅',
    'chu' : '处出除初触楚储畜厨锄雏橱础怵绌黜躇褚',
    'bei' : '倍背被呗北悲辈贝杯钡卑蓓碑备焙惫狈悖',
    'fei' : '非飞费废妃肺菲肥沸霏吠斐匪翡扉狒啡绯痱',
    'mei' : '每没美眉妹枚霉煤媚梅镁玫魅酶寐莓昧嵋',
    'hui' : '荟会回灰辉汇慧惠毁悔挥晖徽绘卉恢蕙烩',
    'jiu' : '揪就九久酒玖究纠舅救旧韭疚灸鸠咎厩鹫臼揪阄',
    'xiao' : '哮小笑晓校孝销萧肖骁消潇宵筱削效嚣硝霄啸逍',
    'yao' : '要药咬腰妖摇尧邀瑶耀姚吆谣窑幺遥舀钥肴窈',
    'you' : '幽有右由幼游油友又忧尤呦邮优柚鱿悠佑',
    'yuan' : '袁员原远元圆园院愿媛怨苑缘源援猿渊冤',
    'shen' : '绅深甚肾审沈申神伸身莘婶参慎渗珅呻',
    'yin' : '荫印尹瘾淫隐阴音银因引姻茵吟殷饮龈蚓',
    'zhang' : '张胀丈杖掌仗账帐章涨长漳彰蟑障樟',
    'jing' : '竟景精静经晶镜井净京靖警敬惊境菁颈径睛茎荆鲸竞憬',
    'xing' : '杏性幸兴姓醒行形省猩腥刑邢惺悻星型擤',
    'yang' : '仰氧杨扬样洋央痒羊阳养恙殃烊鸯佯漾徉鞅',
    'yun' : '酝允匀蕴孕陨芸韵云晕熨昀耘运殒雲',
    'ban' : '绊班板扳伴般搬办瓣半斑扮拌颁阪癍',
    'tan' : '毯坛碳叹探摊谭贪弹谈炭潭痰坦滩袒瘫檀忐昙',
}
var WL_PINYIN_KEY = [
    'yi',
    'yu',
    'ba',
    'ma',
    'da',
    'di',
    'ke',
    'he',
    'hu',
    'jia',
    'xi',
    'si',
    'zhi',
    'chi',
    'shi',
    'zhu',
    'shu',
    'chu',
    'bei',
    'fei',
    'mei',
    'hui',
    'jiu',
    'xiao',
    'yao',
    'you',
    'yuan',
    'shen',
    'yin',
    'zhang',
    'jing',
    'xing',
    'yang',
    'yun',
    'ban',
    'tan'
]

var WL_PIANPANG = {
    '阝' : '邓队阠阡邢那邦邪阵阮阱防阳阴阶邮邯邰邱邵邸邹邺邻陃阹阺阻阼阽阾阿陀陁陂附际陆陇陈陉郁郇郈郊郎郏郑陋陌降限陑陔陕郀陏郙郚郝郡郦郧陛陟陡院除陨险部郭郸都陪陲陴陵陶陷郾鄂隋階随隐',
    '讠' : '订讥计认记让讨讯训议讬讹访讽讲论设词诋诂评诎识诉译诈诊证诅诧诚诞该诟诡话诙诗试详询诣诲诫诳说诵诬误诱语谄调读课谅诺请谁谊谀诸谈谗谍谎谏谜谋谓谐谚谤谦谥谡谢谣谨谬谪谱谭谴',
    '刂' : '刊创刚划列刘刑则刨别刬判删別刹刺到剁刮刿剂刻刷制剑前剃削剥割剩',
    '辶' : '远进近迟辽迓逛途迫这逐速逊逃迹巡逅迁逢适追迦通迪遐邀逼遏边过达迈迄选送迷逝逗',
    '彳' : '微德徵徐得御徽很彻待徼徒径彼律循役徊彷徜徘徉徨徭徍徛彾徏徯徦',
    '扌' : '扎扒打扑扛扣扫扬把扳扮报抄扯扶抚护技抗抛批抢扰折投拗拔拌抱拆担拣拉拦拢抹抿拇抬拖拥招拋抺持挡拱挂挤拮拷挎括拼拾拭拴挑挺挖挟拽挓指振捉掉接控掠描捺排捧掐探推掀掖插搀搓搭提搁搂握援摆搬搞摊携摇摘播撑撕操擦',
    '氵' : '江河流湖海淅浙漠渣酒洒沏满污没洞油渗汉溅洛漆溃泛滥汪法浊渎洋滂深沱泥泞汀湘浩潮瀚汐溜泽滋泣润溢注汇池洗滞澡浮溪涧汾瀑洄潺活泼洽治淡浓津汤滚漾滑泄浪涯波涛泡涌涣涌洁澎湃深沉涉渺漂沸滤消汉汗沪洲游泳滴洪港湾',
    '忄' : '忆忉忙忧怅快怀性怯怪恼悄惬惮惯悰惭悸情惆惋愉惺愡慨愤惰愣慌慎慛慢慬慘慷憬憧懂懒',
    '犭' : '犯犸狈狂狐狒狗狭狲狮狠独狰狱狸狼猕猛猜猪猫猎猢猩猴猻猿獭獾',
    '亻' : '任仁仞你亿什仃仆仉仇化仍仅仨仕仗代付仙仡仟仪他伟仔伏优伐价件伤',
    '纟' : '经约给级绵纺纱继综红缥绑线细绿绌纪纲绸绮纤纯组绒绫缩纳练编终绀缚缅缘缠缛纭纣纵纫纯',
    '宀' : '宁它安宅守宇完宋宏宛宕宝宓宜审实宗官定宠宙室宫宥宣宪客宦',
    '攵' : '收改攻攸放玫故政敖敇敌效敗敝敕敢教救敛敏敞敦敬散',
    '艹' : '花草艺莫芒芮芩苏茂苗蔡苟范苑茅荃茶荀荣茹荫莽荷莱营萨艾蒋慕蓝苍蓟莘董薄蒲蒙蔚蔺藤蕴薛萧藉藏藩芦',
    '钅' : '钆钇针钉钓钗钙钛钞钟钩钠钢钾铁铂钩铅钥钱钻铜铝铛铠银',
    '疒' : '疗疟疤疯疫病疾痉疱疼疹症痕痊痒痔痤痘痞痛痣痩痰瘸癌',
    '灬' : '点杰热烈羔蒸烝焘焉烹煮然焦煦照煞熙罴熏熊熟熹燕黑',
    '尸' : '尺尼尽屁尿局层尾屇居屈届屉屌屏屎屋屑屖展屠属屟屡屣履',
    '禾' : '秃秀私秆和季委秒香种科秋秤秦租积秧秩秘秸移程酥稀税稞稣稖称种稳稷稻黎稼积穆穗秽穤稳穰',
}
var WL_PIANPANG_KEY = [
    '阝',
    '讠',
    '刂',
    '辶',
    '彳',
    '扌',
    '氵',
    '忄',
    '犭',
    '亻',
    '纟',
    '宀',
    '攵',
    '艹',
    '钅',
    '疒',
    '灬',
    '尸',
    '禾'
]

var MORE_WL_PIANPANG = {
    0:{'radical': {0:'禾',1:'刂'}, 'characters':'利'},
    1:{'radical': {0:'钅',1:'刂'}, 'characters':'钊'},
    2:{'radical': {0:'氵',1:'刂'}, 'characters':'测'},
    3:{'radical': {0:'扌',1:'阝'}, 'characters':'挪'},    
}

var MORE_WL_CONTENT = {
    0:{'radical': {0:'雨',1:'田'}, 'characters':'雷'},
    1:{'radical': {0:'马',1:'日'}, 'characters':'驲'},
    2:{'radical': {0:'月',1:'日'}, 'characters':'胆脂'},
    3:{'radical': {0:'车',1:'日'}, 'characters':'辒'},
    4:{'radical': {0:'女',1:'马'}, 'characters':'妈'},
    5:{'radical': {0:'虫',1:'马'}, 'characters':'蚂'},
    6:{'radical': {0:'月',1:'鸟'}, 'characters':'鹏'},
    7:{'radical': {0:'田',1:'月'}, 'characters':'胃'},
    8:{'radical': {0:'田',1:'力'}, 'characters':'男'},
    9:{'radical': {0:'田',1:'心'}, 'characters':'思'},
    10:{'radical': {0:'目',1:'心'}, 'characters':'想'},
    11:{'radical': {0:'月',1:'力'}, 'characters':'肋'},
}

var MORE_WL_PINYIN = {
    0:{'radical': {0:'shi',1:'si'}, 'characters':'食'},
    1:{'radical': {0:'shi',1:'shen'}, 'characters':'什'},
    2:{'radical': {0:'he',1:'hu'}, 'characters':'核'},
}

var WL_CONTENT = {
    '雨' : '雪雳雱雯雹零雾霆需霉霂霄霏霍霖霓霎霙霜霞雾霭霸露霹霾霁',
    '日' : '旦旧旮旯旭旬早旨旱旷时昂昌昊昏昆明昙旺昔易昀昇春昵是显星昼昨晋晒晓晕晨晗晧晦晶景晾普晴暑晰暂智晳晩暗暧',
    '马' : '骆驼驮骄骧骊冯驭驮驲驰驯驱驳驴驾驹驶驷驿驵驸驻骅骇骂骜骏骛骗骥骐闯吗妈骒骑腾骞驴骡',
    '月' : '胁有肌肓肘肙肚肛肝肠朋服肤股肢肥肩肪肯肱育肺肾胀胁背胎胖脉胚胜胞胡胧胫朔朕朗脑脐脓能脆脊膳脸脖胸臂胳膊臀腿脚腹',
    '力' : '办劝功夯励加务幼动劫助努劲劼势効劾勃勅勋勉勇勘劳勤',
    '田' : '田男甸町画界畏留畜畡畤略畦番畴疆',
    '目' : '盯盲省盼眉看盾盹眈相眨眠眛眬眩眝眿着眼眺眭眸眯眶眷眵睁眦督睬睿瞀睻瞁睸瞎瞒瞌',
    '鸟' : '鸠鸡鸢鸣鸥鸦鸧鸨鸩鸪鸫鸬鸭鸮鸯鸱鸳鸵鸶鸸鸹鸽鹁鹂鹃鹄鹅鹆鹈鹊鹌鹑鹙鹜鹝鹞鹟鹠鹡鹢鹣鹤鹥鹦鹫鹬鹭鹮鹰鹳鹙',
    '虫' : '虱虾蚀虽蚁蚤蚊蚜蚓蚕蚪蚣蚯蛇蚱蛆蛊蛋蛐蜓蛰蛔蛟蛮蛛蜗蜈蛹蜇蜀蜃蜂蝇蜘蝈蜜蝎',
    '心' : '忘忌忍态忠怂悠忽恙志念忿葱怨急总怒怠恐恶恩息恋恳恕忐忑悬患您悉惹惠惑悲崽惩惫感愈愚愁意慈',
    '女' : '奴奶她如好奸妇妃妄妆奷妥妩妍妖妤妪妞妒妨妓妙姊姗始委姓妾妻姑姐姆妹妮姚姨姻姿娆娜姜娇姣姥娄娱婉婆娶婶媒媚嫌媳嫔媲嫁嫉',
    '车' : '轧轨轩轫轰轮软转轱轲轻轴轿较辂辁轼载辅辆辄辈辍辉辇辐辑辔输',
}
var WL_STRUCTURE = {
 'WL_STRUCTURE_独体' : '一二三十木禾上下土个八入大天人火文六七儿九无口日中了子门月不开五目耳头米见白田电也长山出飞马鸟云公车牛羊小少巾牙尺毛卜又心力手水升走方半巴业本平书自已东片皮生里果几用今正两瓜衣来',
 'WL_STRUCTURE_左右' : '结构地使唤请到被纳知时坦提新旧投诉说话辉煌林羽你他报服能够吧呀吗持特料科政改放欣任都邓郭牧狗狼豹明暗助脑读销快慢张媒体清河冰汉版松柏指领规解教致和胡朝候经弘鸹刮钻鼓辆轮俏何河核',
 'WL_STRUCTURE_上下' : '草花皇肯胃委集季吉符斧芬奋焚忿宫贡琴芹覃芩吴务恶吕贺荷李忐忑吴华息悉留昊恏智暂恕望忘笑资',
 'WL_STRUCTURE_包围' : '团图囚四囙囘囜回囝囡囟因団囱囤囮囫囥困囵围园囯囬囧囨囲図囦囩固国囹囷囶囻囸囼囿圀圂圃圄圆',
 'WL_STRUCTURE_半包围' : '廉底鹿店度靡糜康匪医区匡叵匹匠巨匣匝匿凶函画风凤凰凡违边这遣退过迷进近迈床应庄府原幽函屌屏屎屋疯疫病',
}

var WORDLIBRARY = {
    'WL_PINYIN' : WL_PINYIN,
    'WL_PIANPANG' : WL_PIANPANG,
    'WL_CONTENT' : WL_CONTENT,
    'WL_STRUCTURE' : WL_STRUCTURE,
}