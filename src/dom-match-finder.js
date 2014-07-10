var $ = window.vwo_$ || window.$;
var _ = window.vwo__ || window._;
var VWO = window.VWOInjected || window.VWO || {};

/**
 * A class to find matches in two DOM trees. After comparison,
 * a key-value pair of master indexes in initial and final node
 * are set in the 'matches' property.
 *
 * @class
 * @memberOf VWO
 */
VWO.DOMMatchFinder = function (params) {
  $.extend(true, this, params);
};

VWO.DOMMatchFinder.create = function (params) {
  return new VWO.DOMMatchFinder(params);
};

VWO.DOMMatchFinder.prototype = {
  /**
   * The inital DOM tree.
   * @type {VWO.DOMNode}
   */
  nodeA: null,

  /**
   * The final DOM tree.
   * @type {[type]}
   */
  nodeB: null,

  /**
   * Post comparison, this property is populated with
   * a key value pair of master indexes in initial tree
   * to the respective matches in the final tree.
   * @type {Object}
   */
  matches: null,

  /**
   * Returns the outerHTML of the initial DOM tree. Carriage
   * returns are removed from the returned strings.
   * @return {String}
   */
  stringA: function () {
    return this.nodeA.outerHTML().replace(/\r\n|\r|\n/gi, "\n");
  },

  /**
   * Returns the outerHTML of the final DOM tree. Carriage
   * returns are removed from the returned strings.
   * @return {String}
   */
  stringB: function () {
    return this.nodeB.outerHTML().replace(/\r\n|\r|\n/gi, "\n");
  },

  /**
   * Initiate the comparison process. After the comparison is done,
   * the result is set in the 'matches' property on this object.
   *
   * @return {self}
   */
  compare: function () {
    var stringA1 = this.stringA();
    var stringB1 = this.stringB();

   // Storing the original string ... 
    var stringA_original = this.stringA();
    var stringB_original = this.stringB();

    var splitOn = '\n';

// Adding Code 

  var i  , A_len = stringA1.length , B_len = stringB1.length; 
  var start_comment_flag = 0 ; 
 
  var stringA = '', stringB = '';  

   for(i=0;i<A_len;i++)
   {
	   
	if((i+3) < A_len && stringA1[i] == '<' && stringA1[i+1] == '!' && stringA1[i+2] == '-' && stringA1[i+3] == '-')
	{
		start_comment_flag = 1 ; 
		i = i + 3 ; 
		continue ; 
	}
	if((i+2) < A_len && start_comment_flag == 1 && stringA1[i] == '-' && stringA1[i+1] == '-' && stringA1[i+2] == '>')
	{
		start_comment_flag = 0 ; 
		i = i + 2 ; 
		continue ; 
	}

	if(start_comment_flag == 0)
		stringA += stringA1[i] ; 
   }

   start_comment_flag = 0 ; 
   for(i=0;i<B_len;i++)
   {
	if((i+3) < B_len && stringB1[i] == '<' && stringB1[i+1] == '!' && stringB1[i+2] == '-' && stringB1[i+3] == '-')
	{
		start_comment_flag = 1 ; 
		i = i + 3 ; 
		continue ; 
	}
	if((i+2) < B_len && start_comment_flag == 1 && stringB1[i] == '-' && stringB1[i+1] == '-' && stringB1[i+2] == '>')
	{
		start_comment_flag = 0 ; 
		i = i + 2 ; 
		continue ; 
	}

	if(start_comment_flag == 0)
		stringB += stringB1[i] ; 
   }

// code Adding done 



    var f = function (i) {
      return i < 10 ? " " + i : i.toString();
    };

    var result = VWO.StringComparator.create({
      stringA: stringA,
      stringB: stringB,
      matchA :  {} , 
      matchB : {} , 
      splitOn: splitOn
    }).compare();

    var diffUnion = result.diffUnion;

// Define diffUnion.length 

    for (var i = 0; i < diffUnion.length; i++) {
      var diff = diffUnion[i];
      console.log(
        diff.indexInA < 0 ? ' +' : f(diff.indexInA),
        diff.indexInB < 0 ? ' -' : f(diff.indexInB),
        diff.string
      );
    }

// for  strings unchanged ... string pointer has been apllied for each unchanged node 

    var nodeMatches = {};
    var stringsInA = result.stringsInA;
    var stringsInB = result.stringsInB;

    for (i = 0; i < result.stringsUnchanged.length; i++) {
      var string = result.stringsUnchanged[i];
      var indexInA = string.indexInA;
      var indexInB = string.indexInB;

      var pointers = VWO.DOMNodeStringPointer.create({
        haystack:
          (indexInA > 0 ? splitOn: '') +
            stringsInA[indexInA] +
            (indexInA < stringsInA.length - 1 ? splitOn : '')
      }).allNodePointers();

      var startIndexInA = stringsInA.slice(0, indexInA).join(splitOn).length - 1;
      var startIndexInB = stringsInB.slice(0, indexInB).join(splitOn).length - 1;
      startIndexInA = startIndexInA.clamp(0);
      startIndexInB = startIndexInB.clamp(0);

      // Defining num for one letter isssue ... one letter in the text node was not considered as a word ... 
      var num; 
      for (var j = 0, jl = pointers.length; j < jl; j++) {
        var pointerInA, pointerInB;
	if((j+1) < jl && (pointers[j+1].index - pointers[j].index) == 1)
		num = 0 ; 
	else
		num = splitOn.length ; 
        pointerInA = VWO.DOMNodeStringPointer.create({
          index: startIndexInA + pointers[j].index + num,
          haystack: stringA
        });
        pointerInB = VWO.DOMNodeStringPointer.create({
          index: startIndexInB + pointers[j].index + num,
          haystack: stringB
        });
//	prev = pointers[j].index ; 
        nodeMatches[pointerInA.masterIndex()] = pointerInB.masterIndex();
      }
    }

 // for all the changed nodes , they are compared using the string comparator ..

    var innerNodeMatches = {};
    var stringsLastAddedInB = [];
    for (i = 0; i < diffUnion.length; i++) {
      diff = diffUnion[i];
      if (diff.indexInA >= 0 && diff.indexInB >= 0) {
        stringsLastAddedInB = [];
      }
      if (diff.indexInA < 0) { // string added in B
        stringsLastAddedInB.push(diff);
      }
      if (diff.indexInB < 0) { // string removed from A
        if (!stringsLastAddedInB.length) continue;

        // strings to compare are below:
        var stringInStringInA = diff.string;
        var stringInStringInB = stringsLastAddedInB[0].string;

        indexInA = diff.indexInA;
        indexInB = stringsLastAddedInB[0].indexInB;

	// for storing index .. which node at which place after regex ... 

	var valA = [] , valB = [];
	var len_A = stringA.length , len_B = stringB.length ; 
	var c1 , c2 , co = 1 , f = 0 ;
	valA[0] = 0 ; 
	for(i=0;i<len_A;i++)
	{
		c1 = stringA[i];
		c2 = c1.charCodeAt(0);
		if((c2>47 && c2<58) || (c2>64 && c2<91) || (c2>96 && c2<123) || c2 == 32)
		{
			if(f)
			{
				valA[co] = i; 
				co = co + 1 ; 
				f = 0 ; 
			}
			continue ;
		}
		else
			f = 1 ; 
	}
	
	f = 0 ; co = 1 ; 
	valB[0] = 0 ; 
	for(i=0;i<len_B;i++)
	{
		c1 = stringB[i];
		c2 = c1.charCodeAt(0);
		if((c2>47 && c2<58) || (c2>64 && c2<91) || (c2>96 && c2<123) || c2 == 32)
		{
			if(f)
			{
				valB[co] = i; 
				co = co + 1 ; 
				f = 0 ; 
			}
			continue ;
		}
		else
			f = 1 ; 
	}
//   stroing index done .... 


	// matching the exact indexes  .... 


	var p = this.nodeA.children()[0] ; 
	var num_childs = p.children().length ; 
	var sA , sB , indA, indB ;  
	var matching = [] ; 
	for(i=0;i<num_childs;i++)
	{
		sA = p.children()[i].el.outerHTML ; 
		indB = stringB.indexOf(sA) ; 
		if(indB != -1)
		{
			matching.push({
				InA: [stringA.indexOf(sA), stringA.indexOf(sA) + sA.length],
				InB: [stringB.indexOf(sA) , stringB.indexOf(sA) + sA.length]
				});
		}
	}	

	var matching_len = matching.length ; 
	var st , en , j , flag = 0 ;
	var indexA1 , indexA2 , indexB1 , indexB2;
	var matchesInA = {} , matchesInB = {} ; 
	for(i=0;i<matching_len;i++)
	{	
		// For A 
		st = matching[i].InA[0] ; 
		for(j=0;j<valA.length;j++)
		{
			if(valA[j] > st)
			{
				indexA1 = j ; 
				break ; 
			}
		}
		en = matching[i].InA[1] ; 
		for(j=0;j<valA.length;j++)
		{
			if(valA[j] > en)
			{
				indexA2 = j - 1 ; 
				break ; 
			}
		}

		// for B 
		st = matching[i].InB[0] ; 
		for(j=0;j<valB.length;j++)
		{
			if(valB[j] > st)
			{
				indexB1 = j ; 
				break ; 
			}
		}
		en = matching[i].InB[1] ; 
		for(j=0;j<valB.length;j++)
		{
			if(valB[j] > en)
			{
				indexB2 = j - 1 ; 
				break ; 
			}
		}

		// Storing the indexes .... 
		var lo = indexA2 - indexA1 + 1; 
		for(j=0;j<lo;j++)
		{
			matchesInA[indexA1] = indexB1 ; 
			matchesInB[indexB1] = indexA1 ; 
			indexA1++ ; indexB1++ ; 
		}
	}

	

        var splitOnRegExpA = /[^a-z0-9_ \r\n]+/gi;
        var splitOnRegExpB = /[^a-z0-9_ \r\n]+/gi;

        var innerResult = VWO.StringComparator.create({
          stringA: stringInStringInA,
          stringB: stringInStringInB,
	  matchA: matchesInA , 
	  matchB: matchesInB,
          splitOn: /[^a-z0-9_ \r\n]+/gi
        }).compare();

        console.log(innerResult);

        var matchRatio = 0;
        var unchangedRanges = [];
        var indexInStringInA, indexInStringInB;
        var matchInA, matchInB;

	

	


        for (j = 0; j < innerResult.diffUnion.length; j++) {
          var innerDiff = innerResult.diffUnion[j];
          if (innerDiff.indexInA >= 0) {
            matchInA = splitOnRegExpA.exec(stringInStringInA);
            if (matchInA) {
         //     indexInStringInA = splitOnRegExpA.lastIndex - matchInA[0].length - innerDiff.string.length;
		indexInStringInA =  valA[innerDiff.indexInA] ;  
            } else {
              indexInStringInA = stringInStringInA.length - innerDiff.string.length;
            }
          }
          if (innerDiff.indexInB >= 0) {
            matchInB = splitOnRegExpB.exec(stringInStringInB);
            if (matchInB) {
             // indexInStringInB = splitOnRegExpB.lastIndex - matchInB[0].length - innerDiff.string.length;
	      indexInStringInB =  valB[innerDiff.indexInB] ;  
            } else {
              indexInStringInB = stringInStringInB.length - innerDiff.string.length;
            }
          }
          if (innerDiff.indexInA >= 0 && innerDiff.indexInB >= 0) {
            if (!innerDiff.string.length) continue;

            unchangedRanges.push({
              rangeInA: [indexInStringInA, indexInStringInA + innerDiff.string.length],
              rangeInB: [indexInStringInB, indexInStringInB + innerDiff.string.length]
            });

            if (innerDiff.string.length > 1) {
              matchRatio += innerDiff.string.length / stringInStringInB.length;
            }
          }
        }

        if (matchRatio > 3 / stringInStringInB.length) { // good match
          stringsLastAddedInB.shift();


          for (j = 0; j < unchangedRanges.length; j++) {
            var rangeInA = unchangedRanges[j].rangeInA;
            var rangeInB = unchangedRanges[j].rangeInB;

            if (rangeInA[0] < 0) continue;

            startIndexInA = stringsInA.slice(0, indexInA).join(splitOn).length;
            startIndexInB = stringsInB.slice(0, indexInB).join(splitOn).length;
            startIndexInA = startIndexInA.clamp(0);
            startIndexInB = startIndexInB.clamp(0);

            console.log(rangeInA[0], rangeInB[0]);

            var pointersInString = VWO.DOMNodeStringPointer.create({
              haystack: unchangedRanges[j].string
            }).allNodePointers();

            for (var k = 0, kl = pointersInString.length; k < kl; k++) {
	
		// code added for a 1 letter word to take into consideration 
		
	      var num = 1 ; 
	      if((rangeInA[1] - rangeInA[0]) == 1)
		      num = 0 ; 

              var pointerInStringInA = VWO.DOMNodeStringPointer.create({
                index: startIndexInA + rangeInA[0] + pointersInString[k].index + num,
                haystack: stringA
              });
              var pointerInStringInB = VWO.DOMNodeStringPointer.create({
                index: startIndexInB + rangeInB[0] + pointersInString[k].index + num,
                haystack: stringB
              });
              var mi1 = pointerInStringInA.masterIndex(), mi2 = pointerInStringInB.masterIndex();
              innerNodeMatches[mi1] = mi2;
              var a = pointersInString[k], b = pointerInStringInA, c = pointerInStringInB;
              console.log(unchangedRanges[j].string, '-->>' , a.nodeName(), a.haystack.substr(a.index, 5), '->', mi1, b.nodeName(),
                b.haystack.substr(b.index, 5), "->", mi2, c.nodeName(), c.haystack.substr(c.index, 5));
            }
          }
        }
      }
    }

    nodeMatches = _(nodeMatches).chain().invert().invert().value();
    innerNodeMatches = _(innerNodeMatches).chain().invert().invert().value();

    console.log('nodeMatchesCount:', _(nodeMatches).keys().length);
    console.log('nodeMatches:', nodeMatches);
    console.log('innerNodeMatchesCount:', _(innerNodeMatches).keys().length);
    console.log('innerNodeMatches:', innerNodeMatches);
    console.log('totalCount:', _($.extend(nodeMatches, innerNodeMatches)).keys().length);

    this.matches = nodeMatches;
    this.stringA = stringA_original ; 
    this.stringB = stringB_original ; 
    return this;
  }
};
