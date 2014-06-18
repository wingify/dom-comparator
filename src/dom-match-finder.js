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
    var stringA = this.stringA();
    var stringB = this.stringB();
    var splitOn = '\n';

    var f = function (i) {
      return i < 10 ? " " + i : i.toString();
    };

    var result = VWO.StringComparator.create({
      stringA: stringA,
      stringB: stringB,
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

      for (var j = 0, jl = pointers.length; j < jl; j++) {
        var pointerInA, pointerInB;
        pointerInA = VWO.DOMNodeStringPointer.create({
          index: startIndexInA + pointers[j].index + splitOn.length,
          haystack: stringA
        });
        pointerInB = VWO.DOMNodeStringPointer.create({
          index: startIndexInB + pointers[j].index + splitOn.length,
          haystack: stringB
        });
        nodeMatches[pointerInA.masterIndex()] = pointerInB.masterIndex();
      }
    }

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

        var splitOnRegExpA = /[^a-z0-9_ \r\n]+/gi;
        var splitOnRegExpB = /[^a-z0-9_ \r\n]+/gi;

        var innerResult = VWO.StringComparator.create({
          stringA: stringInStringInA,
          stringB: stringInStringInB,
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
              indexInStringInA = splitOnRegExpA.lastIndex - matchInA[0].length - innerDiff.string.length;
            } else {
              indexInStringInA = stringInStringInA.length - innerDiff.string.length;
            }
          }
          if (innerDiff.indexInB >= 0) {
            matchInB = splitOnRegExpB.exec(stringInStringInB);
            if (matchInB) {
              indexInStringInB = splitOnRegExpB.lastIndex - matchInB[0].length - innerDiff.string.length;
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
              var pointerInStringInA = VWO.DOMNodeStringPointer.create({
                index: startIndexInA + rangeInA[0] + pointersInString[k].index + 1,
                haystack: stringA
              });
              var pointerInStringInB = VWO.DOMNodeStringPointer.create({
                index: startIndexInB + rangeInB[0] + pointersInString[k].index + 1,
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

    return this;
  }
};
