// /**
//  * Removes the passed element from the array.
//  * Removes all occurrences.
//  *
//  * @param element The element to remove from the array.
//  */
// Array.prototype.remove = function( element )
// {
//     "use strict";

//     var index;
//     for ( index = this.length - 1; index >= 0 ; index-- )
//     {
//         if ( this[ index ] === element )
//         {
//             this.splice( index, 1 );
//         }
//     }
// };


// Array.prototype.indexOf = function(val) {
//     for (var i = 0; i < this.length; i++) {
//         if (this[i] == val) return i;
//     }
//     return -1;
// };
//
// /**
//  * Removes element at the specified index.
//  *
//  * @param index The index of the element to remove from the array.
//  */
// Array.prototype.removeAt = function( index )
// {
//     "use strict";

//     if ( index < this.length )
//     {
//         this.splice( index, 1 );
//     }
// };

// /**
//  * Returns whether or not this array contains the passed element.
//  *
//  * @param element The element to check for in the array.
//  */
// Array.prototype.contains = function( element )
// {
//     "use strict";

//     return this.indexOf( element ) >= 0;
// };

// /**
//  *  Adds all the elements of an array into this one.
//  *
//  *  @param {Array} otherArray The array to copy elements from.
//  *  @param {boolean} [forceUniques=false] If true, will force uniques. This is much slower to do.
//  */
// Array.prototype.addAll = function( otherArray, forceUniques )
// {
//     "use strict";

//     var index;
//     for ( index = 0; index < otherArray.length; index++ )
//     {
//         if ( !forceUniques || this.indexOf( otherArray[ index ] ) < 0 )
//         {
//             this.push( otherArray[ index ] );
//         }
//     }
// };

// /**
//  *  Removes all the elements of an array from this one.
//  *
//  *  @param {Array} otherArray The array to get elements from.
//  *  @param {boolean} [onlyRemoveFirst=false] If true, will only remove the first occurance of each element.
//  */
// Array.prototype.removeAll = function( otherArray, onlyRemoveFirst )
// {
//     "use strict";

//     var index;
//     var myIndex;
//     for ( index = 0; index < otherArray.length; index++ )
//     {
//         myIndex = this.indexOf( otherArray[ index ] );
        
//         while ( myIndex >= 0 )
//         {
//             this.splice( myIndex, 1 );
            
//             if ( onlyRemoveFirst )
//             {
//                 break;
//             }
            
//             myIndex = this.indexOf( otherArray[ index ] );
//         }
//     }
// };

// /**
//  *  Calls a function on every element in this array.
//  *
//  *  @param {function} func The function to call.
//  *  @param {Array} [params=[]] Arguments to be applied to the function, if desired.
//  */
// Array.prototype.callFunctionOnAllElements = function( func, params )
// {
//     "use strict";

//     params = params || [];
//     var index;
//     for ( index = 0; index < this.length; index++ )
//     {
//         func.apply( this[ index ], params );
//     }
// };

// /**
//  *  Returns a random element from this array, using Math.random().
//  *
//  *  @returns The randomly selected element.
//  */
// Array.prototype.getRandomElement = function()
// {
//     "use strict";

//     return this[ this.getRandomIndex() ];
// };

// /**
//  *  Returns a random element from this array, using Math.random().
//  *
//  *  @returns The randomly selected element.
//  */
// Array.prototype.getRandomIndex = function()
// {
//     "use strict";

//     return Math.floor( Math.random() * this.length );
// };

// /**
//  *  Swaps an element with another element in the array.
//  */
// Array.prototype.swap = function( i, j )
// {
//     "use strict";

//     var temp = this[ i ];
//     this[ i ] = this[ j ];
//     this[ j ] = temp;
// };

// /**
//  * The default reverse() function provided has shitty performance. This
//  * implementation performs better as detailed:
//  *
//  * http://jsperf.com/js-array-reverse-vs-while-loop/5
//  *
//  * This is intended only arrays with integer elements! 
//  * 
//  * @return {array} The original array, reversed.
//  */
// Array.prototype.fasterReverse = function()
// {
//     "use strict";

//     var left = null,
//         right = null,
//         start = null,
//         end = null;
//     for( start = 0, end = ( this.length - 1 ); start < end; start += 1, end -= 1 )
//     {
//         left = this[ start ];
//         right = this[ end ];
//         left ^= right;
//         right ^= left;
//         left ^= right;
//         this[ start ] = left;
//         this[ end ] = right;
//     }
// };

// /**
//  * Returns whether or not the array contains a specific cc point
//  * @param point The point to look for.
//  * @returns {boolean}   Whether the point is in the array.
//  */
// Array.prototype.containsPoint = function( point )
// {
//     "use strict";

//     return this.indexOfPoint( point ) >= 0;
// };

// /**
//  * Returns of point in array.
//  * @param point The point to look for.
//  * @returns {boolean}   Index of point if contained in array; -1 if not.
//  */
// Array.prototype.indexOfPoint = function( point )
// {
//     "use strict";

//     if( point && point.x !== undefined && point.y !== undefined )
//     {
//         var i = 0;
//         for ( i = 0; i < this.length; i++ )
//         {
//             if( this[i] && this[i].x === point.x && this[i].y === point.y )
//             {
//                 return i;
//             }
//         }
//     }
//     return -1;
// };

// /**
//  * Returns a boolean determining whether two arrays are equal.
//  *
//  * @param point The array to compare against.
//  * @returns {boolean}   Whether or not the two arrays are equal.
//  */
// Array.prototype.equals = function( array ) 
// {
//     // if the other array is a falsy value, return
//     if (!array)
//         return false;

//     // compare lengths - can save a lot of time 
//     if (this.length != array.length)
//         return false;

//     for (var i = 0, l=this.length; i < l; i++) {
//         // Check if we have nested arrays
//         if (this[i] instanceof Array && array[i] instanceof Array) {
//             // recurse into the nested arrays
//             if (!this[i].equals(array[i]))
//                 return false;       
//         }           
//         else if (this[i] != array[i]) { 
//             // Warning - two different object instances will never be equal: {x:20} != {x:20}
//             return false;   
//         }           
//     }       
//     return true;
// }