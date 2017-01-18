
var PM_GE = PM_GE || {};

PM_GE.GAME_STATE_ENUM = {
    BEGIN :'begin',
    ONGAME:'ongame',
    ONPAUSE:'onpause',
    OVER:'over',
};
PM_GE.pass_progress_state = {
    win :"win",
    fail : "fail",
    current : "current",
    idle : "idle",
};

PM_GE.coin_action_time_add = 0.4;
PM_GE.coin_action_time_remove = 0.4;
PM_GE.coin_action_time_open = 0.25;
PM_GE.coin_action_time_cover = 0.25;