
var SG_GE = SG_GE || {};

SG_GE.GAME_STATE_ENUM = {
    BEGIN :'begin',
    ONGAME:'ongame',
    ONPAUSE:'onpause',
    OVER:'over',
};

SG_GE.coin_action_time_appear = 0.3;
SG_GE.coin_action_time_disappear = 0.3;
SG_GE.coin_action_time_wrong = 0.1;

SG_GE.CellState = {
	DEFAULT : 'DEFAULT',
	RIGHT : 'RIGHT',
	WRONG : 'WRONG',
	BLANK : 'BLANK',
}
SG_GE.CellStateBG = [];            
SG_GE.CellStateBG[SG_GE.CellState.DEFAULT] = res.schulte.sg_square_01;
SG_GE.CellStateBG[SG_GE.CellState.RIGHT] = res.schulte.sg_square_02;
SG_GE.CellStateBG[SG_GE.CellState.WRONG] = res.schulte.sg_square_03;
SG_GE.CellStateBG[SG_GE.CellState.BLANK] = res.schulte.sg_square_04;