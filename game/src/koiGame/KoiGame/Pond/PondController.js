
var PondController = cc.Class.extend(
{
    _setting : null,
    model:null,
    view:null,

    ctor: function(setting, index)
    {
        this._setting = setting;
        this.model = this._createModel(index);
        this.view = this._createView();
    },

    _createModel: function(index)
    {
        return new PondModel(index);
    },
    
    _createView: function()
    {
        return new PondView( this.model, this);
    },

    updateView: function( delta )
    {
        this.view.updateView(delta);
    },

    init: function()
    {
      this.view.init();
    }, 


} );