var numberData = {
    1:{typeId:1, nLength:1, nHeight:1},
    2:{typeId:2, nLength:2, nHeight:1},
    3:{typeId:3, nLength:1, nHeight:1},
    4:{typeId:4, nLength:1, nHeight:1}
}

var logicPos = {
	1:{1:{1:0,2:0}},
	2:{1:{1:0,2:0},2:{1:1,2:0}},
	3:{1:{1:0,2:0}},
	4:{1:{1:0,2:0}},
}

var cell_bg = {
	1:{res:res.numberCrash.nc_square_01},
	2:{res:res.numberCrash.nc_square_04},
	3:{res:res.numberCrash.nc_square_03},
	4:{res:res.numberCrash.nc_square_05},
	5:{res:res.numberCrash.nc_square_02}
}

var state = {
    un_Select:0,
    on_Select:1,
    on_disappear:2
}

var DROP_SINGLE_NUM = 5
var COL_ROW_NIL = -1
var COL_ROW_MULTIPLE = -2
var STAR_NUM = 3

var gameSize = {
    gWidth:735,
    gHeight:1030
}

var actionTime = 16/30