var KoiModel = cc.Class.extend(
{
    _hit:null,
    _index:null,
    _state:null,
    _fishColor : null,
    _fishColorValue : null,
    fishSeed:0,
    pathHistory:null,
    fishStartX:null,
    fistStartY:null,
    canClick : null,
    onClickCorrect : null,

    ctor: function(index,fishColor,fishColorValue)
    {
        this._hit = 0;
        this._index = index;
        this._state = KoiStates.Swimming;
        this.pathHistory = new Array();
        this._fishColor = fishColor || cc.color(125,125,125);
        this._fishColorValue = fishColorValue;
        this.canClick = true;
        this.onClickCorrect = false;
    }
} );