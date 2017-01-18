//laterlHeight : 侧视图的高度
//answerNumber : 答案个数
//isEqualColor : 1 否，2 是   //干扰答案与正确答案颜色集合是否一致
//isCone : 1 否，2 是   //侧视图是否锥形
//层数一致

var dict_sc_level_round = {
	'10000': {id : 10000, laterlHeight : 2, answerNumber : 2, isEqualColor : 1, isCone : 2,changeRoundCount : -1},

	'10001': {id : 10001, laterlHeight : 2, answerNumber : 2, isEqualColor : 1, isCone : 2,changeRoundCount : 6},
	'10002': {id : 10002, laterlHeight : 2, answerNumber : 3, isEqualColor : 1, isCone : 2,changeRoundCount : -1},

	'20001': {id : 20001, laterlHeight : 3, answerNumber : 2, isEqualColor : 1, isCone : 2,changeRoundCount : 6},
	'20002': {id : 20002, laterlHeight : 3, answerNumber : 3, isEqualColor : 1, isCone : 2,changeRoundCount : -1},

	'30001': {id : 30001, laterlHeight : 3, answerNumber : 3, isEqualColor : 1, isCone : 2,changeRoundCount : 6},
	'30002': {id : 30002, laterlHeight : 4, answerNumber : 3, isEqualColor : 1, isCone : 2,changeRoundCount : -1},

	'40001': {id : 40001, laterlHeight : 3, answerNumber : 3, isEqualColor : 1, isCone : 2,changeRoundCount : 4},
	'40002': {id : 40002, laterlHeight : 4, answerNumber : 3, isEqualColor : 1, isCone : 2,changeRoundCount : 4},
	'40003': {id : 40003, laterlHeight : 4, answerNumber : 4, isEqualColor : 1, isCone : 2,changeRoundCount : -1},

	'50001': {id : 50001, laterlHeight : 2, answerNumber : 2, isEqualColor : 1, isCone : 2,changeRoundCount : 4},
	'50002': {id : 50002, laterlHeight : 2, answerNumber : 3, isEqualColor : 1, isCone : 2,changeRoundCount : 4},
	'50003': {id : 50003, laterlHeight : 3, answerNumber : 2, isEqualColor : 1, isCone : 2,changeRoundCount : -1},

	'60001': {id : 60001, laterlHeight : 3, answerNumber : 3, isEqualColor : 1, isCone : 2,changeRoundCount : 4},
	'60002': {id : 60002, laterlHeight : 3, answerNumber : 4, isEqualColor : 1, isCone : 2,changeRoundCount : 4},
	'60003': {id : 60003, laterlHeight : 4, answerNumber : 2, isEqualColor : 1, isCone : 2,changeRoundCount : -1},

	'70001': {id : 70001, laterlHeight : 4, answerNumber : 3, isEqualColor : 1, isCone : 2,changeRoundCount : 4},
	'70002': {id : 70002, laterlHeight : 4, answerNumber : 4, isEqualColor : 1, isCone : 2,changeRoundCount : 4},
	'70003': {id : 70003, laterlHeight : 5, answerNumber : 2, isEqualColor : 1, isCone : 2,changeRoundCount : -1},

	'80001': {id : 80001, laterlHeight : 3, answerNumber : 3, isEqualColor : 1, isCone : 2,changeRoundCount : 6},
	'80002': {id : 80002, laterlHeight : 3, answerNumber : 4, isEqualColor : 1, isCone : 2,changeRoundCount : 6},
	'80003': {id : 80003, laterlHeight : 4, answerNumber : 2, isEqualColor : 1, isCone : 2,changeRoundCount : -1},

	'90001': {id : 90001, laterlHeight : 4, answerNumber : 3, isEqualColor : 1, isCone : 2,changeRoundCount : 6},
	'90002': {id : 90002, laterlHeight : 4, answerNumber : 3, isEqualColor : 1, isCone : 2,changeRoundCount : 6},
	'90003': {id : 90003, laterlHeight : 5, answerNumber : 2, isEqualColor : 1, isCone : 2,changeRoundCount : -1},

	'10010': {id : 10010, laterlHeight : 5, answerNumber : 2, isEqualColor : 1, isCone : 2,changeRoundCount : 6},
	'10011': {id : 10011, laterlHeight : 5, answerNumber : 3, isEqualColor : 1, isCone : 2,changeRoundCount : 6},
	'10012': {id : 10012, laterlHeight : 5, answerNumber : 4, isEqualColor : 1, isCone : 2,changeRoundCount : -1},

	'20010': {id : 20010, laterlHeight : 2, answerNumber : 2, isEqualColor : 2, isCone : 2,changeRoundCount : 4},
	'20011': {id : 20011, laterlHeight : 2, answerNumber : 3, isEqualColor : 2, isCone : 2,changeRoundCount : 4},
	'20012': {id : 20012, laterlHeight : 3, answerNumber : 3, isEqualColor : 2, isCone : 2,changeRoundCount : -1},

	'30010': {id : 30010, laterlHeight : 3, answerNumber : 4, isEqualColor : 2, isCone : 2,changeRoundCount : 4},
	'30011': {id : 30011, laterlHeight : 4, answerNumber : 2, isEqualColor : 2, isCone : 2,changeRoundCount : 4},
	'30012': {id : 30012, laterlHeight : 4, answerNumber : 3, isEqualColor : 2, isCone : 2,changeRoundCount : -1},

	'40010': {id : 40010, laterlHeight : 3, answerNumber : 4, isEqualColor : 2, isCone : 2,changeRoundCount : 6},
	'40011': {id : 40011, laterlHeight : 4, answerNumber : 2, isEqualColor : 2, isCone : 2,changeRoundCount : 6},
	'40012': {id : 40012, laterlHeight : 4, answerNumber : 3, isEqualColor : 2, isCone : 2,changeRoundCount : -1},

	'50010': {id : 50010, laterlHeight : 4, answerNumber : 3, isEqualColor : 2, isCone : 2,changeRoundCount : 6},
	'50011': {id : 50011, laterlHeight : 4, answerNumber : 4, isEqualColor : 2, isCone : 2,changeRoundCount : 6},
	'50012': {id : 50012, laterlHeight : 5, answerNumber : 2, isEqualColor : 2, isCone : 2,changeRoundCount : -1},

	'60010': {id : 60010, laterlHeight : 5, answerNumber : 2, isEqualColor : 2, isCone : 2,changeRoundCount : 6},
	'60011': {id : 60011, laterlHeight : 5, answerNumber : 3, isEqualColor : 2, isCone : 2,changeRoundCount : 6},
	'60012': {id : 60012, laterlHeight : 5, answerNumber : 4, isEqualColor : 2, isCone : 2,changeRoundCount : -1},

	'70010': {id : 70010, laterlHeight : 5, answerNumber : 2, isEqualColor : 2, isCone : 2,changeRoundCount : 8},
	'70011': {id : 70011, laterlHeight : 5, answerNumber : 3, isEqualColor : 2, isCone : 2,changeRoundCount : 8},
	'70012': {id : 70012, laterlHeight : 5, answerNumber : 4, isEqualColor : 2, isCone : 2,changeRoundCount : -1},

	'80010': {id : 80010, laterlHeight : 3, answerNumber : 4, isEqualColor : 1, isCone : 1,changeRoundCount : 4},
	'80011': {id : 80011, laterlHeight : 4, answerNumber : 2, isEqualColor : 1, isCone : 1,changeRoundCount : 4},
	'80012': {id : 80012, laterlHeight : 4, answerNumber : 3, isEqualColor : 1, isCone : 1,changeRoundCount : -1},

	'90010': {id : 90010, laterlHeight : 4, answerNumber : 3, isEqualColor : 1, isCone : 1,changeRoundCount : 4},
	'90011': {id : 90011, laterlHeight : 4, answerNumber : 4, isEqualColor : 1, isCone : 1,changeRoundCount : 4},
	'90012': {id : 90012, laterlHeight : 5, answerNumber : 2, isEqualColor : 1, isCone : 1,changeRoundCount : -1},

	'20020': {id : 20020, laterlHeight : 4, answerNumber : 3, isEqualColor : 1, isCone : 1,changeRoundCount : 6},
	'20021': {id : 20021, laterlHeight : 4, answerNumber : 4, isEqualColor : 1, isCone : 1,changeRoundCount : 6},
	'20022': {id : 20022, laterlHeight : 5, answerNumber : 2, isEqualColor : 1, isCone : 1,changeRoundCount : -1},

	'30020': {id : 30020, laterlHeight : 5, answerNumber : 2, isEqualColor : 1, isCone : 1,changeRoundCount : 6},
	'30021': {id : 30021, laterlHeight : 5, answerNumber : 3, isEqualColor : 1, isCone : 1,changeRoundCount : 6},
	'30022': {id : 30022, laterlHeight : 5, answerNumber : 4, isEqualColor : 1, isCone : 1,changeRoundCount : -1},

	'40020': {id : 40020, laterlHeight : 5, answerNumber : 2, isEqualColor : 1, isCone : 1,changeRoundCount : 8},
	'40021': {id : 40021, laterlHeight : 5, answerNumber : 3, isEqualColor : 1, isCone : 1,changeRoundCount : 8},
	'40022': {id : 40022, laterlHeight : 5, answerNumber : 4, isEqualColor : 1, isCone : 1,changeRoundCount : -1},

	'50020': {id : 50020, laterlHeight : 5, answerNumber : 4, isEqualColor : 1, isCone : 1,changeRoundCount : 8},
	'50021': {id : 50021, laterlHeight : 6, answerNumber : 2, isEqualColor : 1, isCone : 1,changeRoundCount : 8},
	'50022': {id : 50022, laterlHeight : 6, answerNumber : 3, isEqualColor : 1, isCone : 1,changeRoundCount : -1},

	'60020': {id : 60020, laterlHeight : 4, answerNumber : 3, isEqualColor : 2, isCone : 1,changeRoundCount : 6},
	'60021': {id : 60021, laterlHeight : 4, answerNumber : 4, isEqualColor : 2, isCone : 1,changeRoundCount : 6},
	'60022': {id : 60022, laterlHeight : 5, answerNumber : 2, isEqualColor : 2, isCone : 1,changeRoundCount : -1},

	'70020': {id : 70020, laterlHeight : 5, answerNumber : 2, isEqualColor : 2, isCone : 1,changeRoundCount : 6},
	'70021': {id : 70021, laterlHeight : 5, answerNumber : 3, isEqualColor : 2, isCone : 1,changeRoundCount : 6},
	'70022': {id : 70022, laterlHeight : 5, answerNumber : 4, isEqualColor : 2, isCone : 1,changeRoundCount : -1},

	'80020': {id : 80020, laterlHeight : 5, answerNumber : 4, isEqualColor : 2, isCone : 1,changeRoundCount : 8},
	'80021': {id : 80021, laterlHeight : 6, answerNumber : 2, isEqualColor : 2, isCone : 1,changeRoundCount : 8},
	'80022': {id : 80022, laterlHeight : 6, answerNumber : 3, isEqualColor : 2, isCone : 1,changeRoundCount : -1},

	'90020': {id : 90020, laterlHeight : 6, answerNumber : 2, isEqualColor : 2, isCone : 1,changeRoundCount : 8},
	'90021': {id : 90021, laterlHeight : 6, answerNumber : 3, isEqualColor : 2, isCone : 1,changeRoundCount : 8},
	'90022': {id : 90022, laterlHeight : 6, answerNumber : 4, isEqualColor : 2, isCone : 1,changeRoundCount : -1},

	'30030': {id : 30030, laterlHeight : 6, answerNumber : 2, isEqualColor : 1, isCone : 2,changeRoundCount : 10},
	'30031': {id : 30031, laterlHeight : 6, answerNumber : 3, isEqualColor : 1, isCone : 2,changeRoundCount : 10},
	'30032': {id : 30032, laterlHeight : 6, answerNumber : 4, isEqualColor : 1, isCone : 2,changeRoundCount : -1},

	'40030': {id : 40030, laterlHeight : 6, answerNumber : 2, isEqualColor : 2, isCone : 2,changeRoundCount : 10},
	'40031': {id : 40031, laterlHeight : 6, answerNumber : 3, isEqualColor : 2, isCone : 2,changeRoundCount : 10},
	'40032': {id : 40032, laterlHeight : 6, answerNumber : 4, isEqualColor : 2, isCone : 2,changeRoundCount : -1},

	'50030': {id : 50030, laterlHeight : 6, answerNumber : 2, isEqualColor : 1, isCone : 1,changeRoundCount : 10},
	'50031': {id : 50031, laterlHeight : 6, answerNumber : 3, isEqualColor : 1, isCone : 1,changeRoundCount : 10},
	'50032': {id : 50032, laterlHeight : 6, answerNumber : 4, isEqualColor : 1, isCone : 1,changeRoundCount : -1},

	'60030': {id : 60030, laterlHeight : 6, answerNumber : 2, isEqualColor : 2, isCone : 2,changeRoundCount : 10},
	'60031': {id : 60031, laterlHeight : 6, answerNumber : 3, isEqualColor : 2, isCone : 2,changeRoundCount : 10},
	'60032': {id : 60032, laterlHeight : 6, answerNumber : 4, isEqualColor : 2, isCone : 2,changeRoundCount : -1},
}