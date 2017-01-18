var LoggingLevel =
{
    Verbose : 0,
    Normal : 1,
    Warning : 2,
    Error : 3,
    None: 4
};

/**
 *  A bunch of logging functions.
 *  @name LumosityLogger
 *  @namespace
 */
var LumosityLogger =
{
    /** @lends LumosityUtils */

    CurrentLoggingLevel: LoggingLevel.Normal,
    

    _log:function( className, methodName, prefix, string )
    {
        var stringToPrint = "";

        // Add class name if there is one
        if ( className !== "" )
        {
            stringToPrint += className;
        }
        // Add function name if there is one
        if ( methodName !== "" )
        {
            stringToPrint += "." + methodName;
        }

        // If there was class name or function name
        if ( stringToPrint !== "" && (prefix || string) )
        {
            stringToPrint += ": ";
        }

        // Add prefix
        if ( prefix !== "" )
        {
            stringToPrint += prefix;
        }

        // Add the string itself
        if ( string )
        {
            stringToPrint += string;
        }

        // Print out
        cc.log( stringToPrint );
    },

    verbose: function( classNameOrString, methodName, string )
    {
        if ( this.CurrentLoggingLevel <= LoggingLevel.Verbose )
        {
            if ( classNameOrString && methodName )
            {
                this._log( classNameOrString, methodName, "", string );
            }
            else if ( classNameOrString )
            {
                this._log( "", "", "", classNameOrString );
            }
        }
    },

    log: function( classNameOrString, methodName, string )
    {
        if ( this.CurrentLoggingLevel <= LoggingLevel.Normal )
        {
            if ( classNameOrString && methodName )
            {
                this._log( classNameOrString, methodName, "", string );
            }
            else if ( classNameOrString )
            {
                this._log( "", "", "", classNameOrString );
            }
        }
    },

    warning: function( classNameOrString, methodName, string )
    {
        if ( this.CurrentLoggingLevel <= LoggingLevel.Warning )
        {
            var prefix = "Warning! ";
            if ( classNameOrString && methodName )
            {
                this._log( classNameOrString, methodName, prefix, string );
            }
            else if ( classNameOrString )
            {
                this._log( "", "", prefix, classNameOrString );
            }
        }
    },

    error: function( classNameOrString, methodName, string )
    {
        if ( this.CurrentLoggingLevel <= LoggingLevel.Error )
        {
            var prefix = "Error! ";
            if ( classNameOrString && methodName )
            {
                this._log( classNameOrString, methodName, prefix, string );
            }
            else if ( classNameOrString )
            {
                this._log( "", "", prefix, classNameOrString );
            }
        }
    }
};

var ll = LumosityLogger;
