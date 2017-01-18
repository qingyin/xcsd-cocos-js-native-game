var LumosityMath =
{
    /** @lends LumosityMath */


    /**
     * Rounds number to specified decimal count.
     *
     * @param num
     * @param decimals
     * @returns {string}
     */
    preciseRound: function ( num, decimals )
    {
        "use strict";

        var sign = num >= 0 ? 1 : -1;
        return ( Math.round( ( num * Math.pow( 10, decimals ) ) + ( sign * 0.001 ) ) / Math.pow( 10, decimals ) ).toFixed( decimals );
    },


    /**
     * Clamps a number between and min and max value.
     *
     * @param val   Number to clamp.
     * @param min   Minimum value for number.
     * @param max   Maximum value for number.
     * @returns {number}
     */
    clamp: function ( val, min, max )
    {
        "use strict";

        return Math.max( min, Math.min( max, val ) );
    },


    /**
     * Calculates distance between two points.
     *
     * @param p1
     * @param p2
     * @returns {number}
     */
    distance: function ( p1, p2 )
    {
        "use strict";

        if ( p1 && p2 )
        {
            return Math.sqrt( (p2.x - p1.x) * (p2.x - p1.x) + (p2.y - p1.y) * (p2.y - p1.y) );
        }

        return 0;
    },


    /**
     * Calculates length of a vector.
     *
     * @param v
     * @returns {number}
     */
    length: function ( v )
    {
        "use strict";

        return Math.sqrt ( v.x * v.x + v.y * v.y );
    },


    /**
     * Linearly interpolates between two numbers, given a parametric time value.
     * @param t     Parametric time (0-1 is between min and max).
     * @param min   Minumum bound, corresponding to t = 0.
     * @param max   Maximum bound, corresonding to t = 1.
     * @returns {number}    Interpolated value.
     */
    lerp: function ( t, min, max )
    {
        "use strict";

        return min * (1.0 - t) + t * max;
    },

    /**
     * Same as normal lerp, but can specify total time which maps into 0-1 period.
     * @param deltaTime
     * @param totalTime
     * @param start
     * @param end
     * @returns {number}
     */
    betterLerp: function ( deltaTime, totalTime, start, end )
    {
        "use strict";

        var timeScale = 1 / totalTime;
        var newDeltaTime = deltaTime * timeScale;

        //return min * (totalTime - deltaTime) + deltaTime * max;
        return (1 - newDeltaTime) * start + newDeltaTime * end;
    },


    /**
     * Computes dot product of 2-element vectors.
     * @param p1    First vector.
     * @param p2    Second vector
     * @returns {number}    Dot products of vectors.
     */
    dot: function ( p1, p2 )
    {
        "use strict";

        return p1.x * p2.x + p1.y * p2.y;
    },


    /**
     * Computes smallest angle between two angles.
     *
     * @param deg1  First angle (in degrees).
     * @param deg2  Second angle (in degrees).
     * @returns {number} Smallest angle between angles (always returns angle greater than or equal to 0).
     */
    smallestAngleBetween: function ( deg1, deg2 )
    {
        "use strict";

        var angle = ( ( ( deg2 - deg1 + 180 ) % 360 ) + 360 ) % 360 - 180;
        if ( angle < 0 )
        {
            angle += 360;
        }
        return angle;
    },

     /**
     * Rotates a point counter clockwise by the angle around a pivot
     *
     * @param {cc.Point} v v is the point to rotate
     * @param {cc.Point} pivot pivot is the pivot, naturally
     * @param {Number} angle angle is the angle of rotation cw in radians
     * @return {cc.Point} the rotated point
     */
    rotateVectorByAngle:function(v, pivot, angle)
    {
        "use strict";

        var r = cc.pSub(v, pivot);
        var cosa = Math.cos(angle), sina = Math.sin(angle);
        var t = r.x;
        r.x = t * cosa - r.y * sina + pivot.x;
        r.y = t * sina + r.y * cosa + pivot.y;
        return r;
    },

    /**
     * Checks if a point is within a polygon
     *
     * @param {cc.Point} pt     The point in question
     * @param {Array} poly      The polygon to check
     * @return {boolean}        Whether the point is within the polygon
     */
    isPointInPolygon:function( pt, poly )
    {
        "use strict";

        var c;
        var i;
        var l;
        var j;
        for(c = false, i = -1, l = poly.length, j = l - 1; ++i < l; j = i)
        {
            if ( ((poly[i].y <= pt.y && pt.y < poly[j].y) || (poly[j].y <= pt.y && pt.y < poly[i].y))
                && (pt.x < (poly[j].x - poly[i].x) * (pt.y - poly[i].y) / (poly[j].y - poly[i].y) + poly[i].x) )
            {
                c = !c;
            }
        }
        return c;
    }
};

var lm = LumosityMath;
