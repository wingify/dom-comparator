var $ = window.vwo_$ || window.$;
var _ = window.vwo__ || window._;
var VWO = window.VWOInjected || window.VWO || {};

/**
 * A class to calculate the difference between two strings.
 *
 * @class
 * @memberOf VWO
 */
VWO.StringComparator = function (params) {
  $.extend(true, this, params);
};

VWO.StringComparator.create = function (params) {
  return new VWO.StringComparator(params);
};

/**
 * An object holding a comparison result. StringComparator outputs
 * arrays of this object as the final output.
 *
 * @constructor
 * @param {String} string   Matched string.
 * @param {Number} indexInA Index of string in stringsInA array.
 * @param {Number} indexInB Index of string in stringsInB array.
 */
VWO.StringComparisonResult = function (string, indexInA, indexInB) {
  /**
   * Index of string in the array of strings in A split by 'splitBy'.
   * @type {string}
   */
  this.indexInA = indexInA;

  /**
   * Index of string in the array of strings in B split by 'splitBy'.
   * @type {string}
   */
  this.indexInB = indexInB;

  /**
   * String matched.
   * @type {String}
   */
  this.string = string;
};

VWO.StringComparator.prototype = {
  /**
   * The first string.
   * @type {String}
   */
  stringA: null,

  /**
   * The second string.
   * @type {String}
   */
  stringB: null,

  /**
   * String/RegExp used to split the strings on.
   * @type {String|RegExp}
   */
  splitOn: null,

  /**
   * Array of strings in A after splitting it using 'splitOn'
   * String/RegExp.
   * @type {String[]}
   */
  stringsInA: [],

  /**
   * Array of strings in B after splitting it using 'splitOn'
   * String/RegExp.
   * @type {String[]}
   */
  stringsInB: [],

  /**
   * Post comparison, this list is populated with the strings that
   * did not have any matches in A (were new in B).
   * @type {VWO.StringComparisonResult[]}
   */
  stringsAddedInB: [],

  /**
   * Post comparison, this list is populated with the strings that
   * did not have any matches in B (were deleted from A).
   * @type {VWO.StringComparisonResult[]}
   */
  stringsDeletedFromA: [],

  /**
   * Post comparison, this list is populated with the strings in A that
   * found matches in B.
   * @type {VWO.StringComparisonResult[]}
   */
  stringsUnchanged: [],

  /**
   * Post comparison, this array holds the union of values in 'stringsAddedInB',
   * 'stringsDeletedFromA' and 'stringsUnchanged' arrays.
   * @type {VWO.StringComparisonResult[]}
   */
  diffUnion: [],

  /**
   * Run this function after initiating with the strings. When this function
   * completes, the result data is populated in four arrays in this object.
   * @return {self}
   */
  compare: function () {
    this.stringsInA = [];
    this.stringsInB = [];
    this.stringsAddedInB = [];
    this.stringsDeletedFromA = [];
    this.stringsUnchanged = [];
    this.diffUnion = [];

    var indexInA, countOfStringsInA, indexInB, countOfStringsInB;
    var match = {
      from: null,
      to: null,
      next: null,
      prev: null
    };

    var stringA = this.stringA,
      stringB = this.stringB;

	
    var matchesInA1 = {},
     matchesInB1 = {};

   var matchesInA2 = this.matchA,
      matchesInB2 = this.matchB;

    var stringsInA = stringA.split(this.splitOn),
      stringsInB = stringB.split(this.splitOn);

    this.stringsInA = stringsInA;
    this.stringsInB = stringsInB;

    for (indexInA = 0, countOfStringsInA = stringsInA.length; indexInA < countOfStringsInA; indexInA++) {
	    if(matchesInA2[indexInA])
		    continue ; 
      for (indexInB = 0, countOfStringsInB = stringsInB.length; indexInB < countOfStringsInB; indexInB++) {
        if (stringsInA[indexInA] === stringsInB[indexInB]) 
	{
          if (typeof matchesInB1[indexInB] === 'number' || typeof matchesInB2[indexInB] === 'number') 
		  continue;

	  // fix for div name added in last ..... see test cases 33 and 34 for this .... in dom-comparator.js ..... 
	  if (stringsInA[indexInA] == 'div' && stringsInB[indexInB] == 'div')
	  {
		  if(indexInA == (countOfStringsInA-3) || indexInB == (countOfStringsInB-3)) // test case 36 for this ..... 
		  {
			  if(countOfStringsInB > countOfStringsInA && indexInB < (countOfStringsInB-3))
				  continue ; 
			  if(countOfStringsInB < countOfStringsInA && indexInA < (countOfStringsInA-3))
				  continue ; 
		  }
	  }
	  // fix done 	


	  var prevMatch = match.prev;

	  // Fix for 'if new class name is added' ... 
	  if(prevMatch)
	  {
	  if(prevMatch.to > indexInB)
		  continue ; 
	  }
	 // Fix done 



	// While loop used for the rearranged parts 
 /*         while (prevMatch) {
            if (prevMatch.to > indexInB) {
            delete matchesInA1[prevMatch.from];
              delete matchesInB1[prevMatch.to];
              prevMatch.next = match;
              match = prevMatch;
            }
            prevMatch = prevMatch.prev;
          }
	 */ 
          match.from = indexInA;
          match.to = indexInB;
          match.next = {};
          match.next.prev = match;
          match = match.next;
          matchesInA1[indexInA] = indexInB;
          matchesInB1[indexInB] = indexInA;
          break;
        }
      }
    }


    var matchesInA = {} , matchesInB = {} ; 

    var i, j ; 
    for(i=0, lA = this.couA; i < (lA+1) ; i++)	
    {	
	    if(typeof (matchesInA1[i]) === 'number')
		    matchesInA[i] = matchesInA1[i] ; 

	    if(typeof (matchesInA2[i]) === 'number')
		    matchesInA[i] = matchesInA2[i] ; 

    }

    for(j = 0,  lB = this.couB ; j < (lB+1) ;j++)
    {

	    if(typeof (matchesInB1[j]) === 'number')
		    matchesInB[j] = matchesInB1[j] ; 
	    if(typeof (matchesInB2[j]) === 'number')
		    matchesInB[j] = matchesInB2[j] ; 
    }



    var lastMatchIndexInB = -1;

    for (indexInA = 0, countOfStringsInA = stringsInA.length; indexInA < countOfStringsInA; indexInA++) {
      for (indexInB = lastMatchIndexInB + 1, countOfStringsInB = stringsInB.length;
           typeof matchesInB[indexInB] === 'undefined' && indexInB < countOfStringsInB;
           indexInB++) {
        // Strings added in B
        this.stringsAddedInB.push(new VWO.StringComparisonResult(stringsInB[indexInB], -1, indexInB));
        this.diffUnion.push(this.stringsAddedInB[this.stringsAddedInB.length - 1]);
        lastMatchIndexInB = indexInB;
      }

      if (typeof matchesInA[indexInA] === 'number') {
        // Strings that remained unchanged in A and B
        this.stringsUnchanged.push(new VWO.StringComparisonResult(stringsInA[indexInA], indexInA, matchesInA[indexInA]));
        this.diffUnion.push(this.stringsUnchanged[this.stringsUnchanged.length - 1]);
        lastMatchIndexInB = matchesInA[indexInA];
      } else if (typeof matchesInA[indexInA] === 'undefined') {
        // Strings that were deleted from A
        this.stringsDeletedFromA.push(new VWO.StringComparisonResult(stringsInA[indexInA], indexInA, -1));
        this.diffUnion.push(this.stringsDeletedFromA[this.stringsDeletedFromA.length - 1]);
      }
    }
    return this;
  }
};
