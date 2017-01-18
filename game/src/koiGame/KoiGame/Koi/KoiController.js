
var KoiController = cc.Class.extend(
{
    model:null,
    view:null,

    ctor: function(parent, index, pos, outpos, koiLength,fishColor,fishColorValue)
    {
        this.parent = parent;
        this.model = this._createModel(index,fishColor,fishColorValue);
        this.view = this._createView(parent, pos, outpos, koiLength);

    },

    _createModel: function(index,fishColor,fishColorValue)
    {
        return new KoiModel(index,fishColor,fishColorValue);
    },
    
    _createView: function( parent, pos, outpos, koiLength)
    {
        return new KoiView( this.model, this, parent , pos, outpos, koiLength);
    },

    checkHit: function(hitPoint)
    {
        return this.view.checkHit(hitPoint);
    },

    updateView: function( delta )
    {
        this.view.updateView(delta); // scared to call it update in case that's implicitliy called
    },

    init: function()
    {
      this.view.init();
    },

    setState:function(state)
    {
        var prevState = this.model._state;
        this.model._state = state;
        if(this.model._state === KoiStates.Swimming)
        {
        }
        else if(this.model._state === KoiStates.Eating)
        {
        }
    },


    wasHit: function(isCorrect)
    {
        if(this.model._hit === 0 && isCorrect === true)
        {
            this.model._hit = this.model._hit + 1;
            this.model.onClickCorrect = true;
            this.view.doHighlight(Highlights.Correct);
        }
        else
        {
            this.view.doHighlight(Highlights.Incorrect);
        }
        this.parent.model.isDataFull = true;
        //this.model._hit = this.model._hit + 1;
    },
    setFishCanClick : function(canClick){
        this.model.canClick = canClick;
    },
    getFishCanClick : function(){
        return this.model.canClick;
    },

} );