var FoodModel = cc.Class.extend(
{
    _state:null,
    _spawnTime:null,
    _targetScale:null,
    _foodColorList : null,
    _foodColorValueList : null,
    ctor: function(foodColorList,foodColorValueList)
    {
        this._state = FoodStates.Processing;
        this._spawnTime = 3;
        this._targetScale = 0.3;
        this._foodColorList = foodColorList;
        this._foodColorValueList = foodColorValueList;
        //cc.log("foodColorList,foodColorValueList",foodColorList,foodColorValueList);
    }
} );