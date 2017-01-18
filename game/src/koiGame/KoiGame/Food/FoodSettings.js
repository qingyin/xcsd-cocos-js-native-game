var FoodSettings = cc.Class.extend(
{
    ctor: function( settings )
    {

        var self = this;
        // Copies all the properties of settings and makes them
        // properties of this class.
        LumosityUtils.forEachIn( settings, function( name, value )
        {
            self[ name ] = value;
        } );
    }
} );