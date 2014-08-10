/*!
The MIT License (MIT)
http://opensource.org/licenses/MIT

Copyright (c) 2014 Wingify Software Pvt. Ltd.
http://wingify.com
*/

var VWO = window.VWO || {};
(function(){
var $ = window.vwo_$ || window.$;
var _ = window.vwo__ || window._;
var VWO = window.VWOInjected || window.VWO || {};

/**
 * Compare two DOM trees and computes the final result
 * of changes.
 *
 * @class
 * @memberOf VWO
 */
VWO.DOMComparator = function (params) {
  // clear the DOMNodePool before we begin
  VWO.DOMNodePool.clear();

  $.extend(true, this, params);

  if (this.nodeA) {
    this.elA = this.nodeA.el;
  }
  if (this.nodeB) {
    this.elB = this.nodeB.el;
  }


  /*
    Removing extra #text coming as inputs via textarea .
  */
  var h, leA = this.elA.length,
    leB = this.elB.length;
  for (h = 0; h < leA; h++) {
    if (this.elA[h].data) {
      this.elA.splice(h, 1);
      h--;
      leA--;
    }
  }

  for (h = 0; h < leB; h++) {
    if (this.elB[h].data) {
      this.elB.splice(h, 1);
      h--;
      leB--;
    }
  }

  /*
  Striping the nodes and removing extra spaces and line breaks
  taking care of all escape characters

*/

  var outA = stripNodes($(this.elA).outerHTML());
  var outB = stripNodes($(this.elB).outerHTML());

  /*

   Wrapper method is set to  "<him *** </him>"
   Because it is not standard as <div> *** </div>

*/

  this.nodeA = VWO.DOMNodePool.create({
    el: $("<him id='DOMComparisonResult'>" + outA + "</him>").get(0)
  });
  this.nodeB = VWO.DOMNodePool.create({
    el: $("<him id='DOMComparisonResult'>" + outB + "</him>").get(0)
  });
  this.elAClone = $("<him id='DOMComparisonResult'>" + outA + "</him>").get(0);
};


function stripNodes(node) {
  var ans = node.replace(/(?:\r\n|\r|\n)/g, '');
  ans = ans.replace(/\>\s+\</g, '><')
  var out = '',
    l = ans.length,
    i = 0;
  while (i < l) {
    if (ans[i] == '"') {
      out += ans[i];
      while (1) {
        i = i + 1;
        if (ans[i] == '"') {
          out += ans[i];
          break;
        }
        if ((i + 1) < l && ans[i + 1] == "'") {
          out += ans[i];
          out += '\\';
          continue;
        }
        if (ans[i] == ' ') {
          if (ans[i + 1].search(/[^A-Z0-9a-z\s]/) == -1) {
            out += ans[i];
            continue;
          } else
            continue;
        }

        out += ans[i];
      }
    } else {
      if ((i + 1) < l && ans[i + 1] == "'") {
        out += ans[i];
        out += '\\';
      } else
        out += ans[i];
    }
    i = i + 1;
  }

  return out;
};


VWO.DOMComparator.create = function (params) {
  return new VWO.DOMComparator(params);
};

VWO.DOMComparator.prototype = {
  /** @type {Node} First of the two elements to compare. */
  elA: null,

  /** @type {Node} Second of the two elements to compare. */
  elB: null,

  /** @type {VWO.DOMNode} First of the two nodes to compare. */
  nodeA: null,

  /** @type {VWO.DOMNode} Second of the two nodes to compare. */
  nodeB: null,

  /**
   * Uses VWO.DOMMatchFinder to find matches between the two nodes.
   * The matches are used to set a 'matchedWith' property on each
   * of the nodes in two trees for comparison later. On the nodes in
   * the second tree, additional properties 'matchScore' and
   * 'matchDifference' are also set.
   */


  analyzeMatches: function () {
    var matches = VWO.DOMMatchFinder.create({
      nodeA: this.nodeA,
      nodeB: this.nodeB
    }).compare().matches;

    var nodeADescendants = this.nodeA.descendants();
    var nodeBDescendants = this.nodeB.descendants();

    for (var i in matches)
      if (matches.hasOwnProperty(i)) {
        var j = matches[i];

        var comparison = VWO.DOMNodeComparator.create({
          nodeA: nodeADescendants[i],
          nodeB: nodeBDescendants[j]
        });

        var matchScore = comparison.finalScore();

        if (matchScore) {
          nodeADescendants[i].matchedWith = nodeBDescendants[j];
          nodeBDescendants[j].matchedWith = nodeADescendants[i];
          nodeBDescendants[j].matchScore = comparison.finalScore();
          nodeBDescendants[j].matchDifference = comparison.difference();
        }
      }
  },

  /**
   * Detects newly inserted nodes in the second tree based on nodes
   * in the tree that do not have any matches in the initial tree.
   *
   * @return {Object[][]} A list of inital and final states
   *                                 of the operations performed.
   */
  detectInserts: function () {
    var finalTree = this.nodeB.descendants();
    var finalOperationsList = [];

    // this loop runs for objects that are newly inserted
    _(finalTree).each(function (node, i) {
      var adjacentNode, nodeI;

      // if node has a match, nothing to do
      if (node.matchedWith) return;

      // if my parent doesn't have a match, I have already been
      // implicitly inserted.
      if (node.parent() && !node.parent().matchedWith) return;

      // node insertion at node.masterIndex
      adjacentNode = null;
      // get my match's next sibling who actually has a match
      // if found, node = thus found node
      // if no such sibling is found,
      // node = my match's parent's match

      // find
      nodeI = node;
      while (nodeI = nodeI.nextSibling()) {
        if (nodeI.matchedWith) break;
      }

      // match found
      var insertedNode = node.copy();

      if (nodeI && nodeI.matchedWith) {
        adjacentNode = nodeI.matchedWith;
        //   adjacentNode.parent().addChildAt(insertedNode, adjacentNode.index());
        adjacentNode.parent().addChildAt(insertedNode, node.index());

      } else {
        adjacentNode = node.parent().matchedWith;
        adjacentNode.addChild(insertedNode);
      }

      var parentSelectorPath = insertedNode.parent().selectorPath();
      var indexInParent = insertedNode.index();

      // set a flag on the node
      insertedNode.isInserted = true;

      finalOperationsList.push(({
        name: 'insertNode',
        // an inserted node does not have a selector path
        selectorPath: null,
        content: {
          html: insertedNode.outerHTML(),
          parentSelectorPath: parentSelectorPath,
          indexInParent: indexInParent,
          existsInDOM: true
        }
      }));
    });

    return finalOperationsList;
  },

  /**
   * Detects text nodes that matched in both trees and may have their
   * 'textContent' changed.
   *
   * @return {Object[][]} A list of inital and final states
   *                                 of the operations performed.
   */
  detectTextNodeChanges: function () {
    var initialTree = this.nodeA.descendants();
    var finalOperationsList = [];

    _(initialTree).each(function (node, i) {
      // if node isn't matched, nothing to do (it will be removed in the next iteration)
      if (!node.matchedWith) return;

      // if node is matched but its a 100% match, nothing to do still,
      // rearranges will happen in the next iteration
      if (node.matchedWith.matchScore === 1) return;

      // finally get the matchDifference (a set of attr and css changes)
      var matchDifference = node.matchedWith.matchDifference;

      // figure out changes for changeTextBefore, changeCommentBefore
      if (node.nodeType() !== Node.ELEMENT_NODE && matchDifference.newInnerText) { // insert new text and comment nodes
        var parentSelectorPath = node.parent().selectorPath();
        var indexInParent = node.index();

        finalOperationsList.push(({
          name: 'change' + (node.nodeType() === Node.TEXT_NODE ? 'Text' : 'Comment'),
          // a text / comment node does not have a selector path
          selectorPath: null,
          content: {
            text: matchDifference.newInnerText,
            parentSelectorPath: parentSelectorPath,
            indexInParent: indexInParent
          }
        }));

        node.el.textContent = matchDifference.newInnerText;
      }
    });

    return finalOperationsList;
  },

  /**
   * For all the nodes that matched, detects if the attributes changed.
   * If so, returns them.
   *
   * @return {Object[][]} A list of inital and final states
   *                                 of the operations performed.
   */
  detectAttributeChanges: function () {
    var initialTree = this.nodeA.descendants();
    var finalOperationsList = [];

    _(initialTree).each(function (node, i) {
      // if node isn't matched, nothing to do (it will be removed in the next iteration)
      if (!node.matchedWith) return;

      // if node is matched but its a 100% match, nothing to do still,
      // replacements will happen in the next iteration
      if (node.matchedWith.matchScore === 1) return;

      // finally get the matchDifference (a set of attr and css changes
      var matchDifference = node.matchedWith.matchDifference;

      var attr = $.extend({},
        matchDifference.addedAttributes,
        matchDifference.changedAttributes);
      var oldattr;


      // Runs over all the attributes  for e.g ._(attr).keys() = class
      if (_(attr).keys().length) {
        oldattr = {};
        _(attr).each(function (attr, key) {
          oldattr[key] = node.$().attr(key);
        });

        // node.$().attr('class') = class_name
        node.$().attr(attr);
        finalOperationsList.push(({
          name: 'attr',
          selectorPath: node.selectorPath(),
          content: attr
        }));
      }


      // Gets the list of all attributes removed
      var removedAttr = matchDifference.removedAttributes;
      if (_(removedAttr).keys().length) {
        oldattr = {};
        _(removedAttr).each(function (attr, key) {
          oldattr[key] = node.$().attr(key);
          node.$().removeAttr(key);
        });

        finalOperationsList.push(({
          name: 'removeAttr',
          selectorPath: node.selectorPath(),
          content: matchDifference.removedAttributes
        }));
      }
    });

    VWO.DOMNodePool.uncacheAll();
    VWO.DOMNodePool.cacheAll();

    return finalOperationsList;
  },

  /**
   * For all the nodes that matched, detects if the styles changed.
   * If so, returns them.
   *
   * @return {Object[][]} A list of inital and final states
   *                                 of the operations performed.
   */
  detectStyleChanges: function () {
    var initialTree = this.nodeA.descendants();
    var finalOperationsList = [];

    _(initialTree).each(function (node, i) {
      // if node isn't matched, nothing to do (it will be removed in the next iteration)
      if (!node.matchedWith) return;

      // if node is matched but its a 100% match, nothing to do still,
      // replacements will happen in the next iteration
      if (node.matchedWith.matchScore === 1) return;

      // finally get the matchDifference (a set of attr and css changes
      var matchDifference = node.matchedWith.matchDifference;

      var css = $.extend({}, matchDifference.addedStyles, matchDifference.changedStyles);
      var oldcss;

      if (_(css).keys().length) {
        oldcss = {};
        _(css).each(function (css, key) {
          oldcss[key] = node.$().css(key);
        });

        node.$().css(css);
        finalOperationsList.push(({
          name: 'css',
          selectorPath: node.selectorPath(),
          content: css
        }));
      }

      var removedCss = matchDifference.removedStyles;
      if (_(removedCss).keys().length) {
        oldcss = {};
        _(removedCss).each(function (css, key) {
          oldcss[key] = node.$().css(key);
          node.$().css(key, '');
        });

        _(removedCss).each(function (css) {
          node.$().css(css, '');
        });
        finalOperationsList.push(({
          name: 'removeCss',
          selectorPath: node.selectorPath(),
          content: removedCss
        }));
      }
    });

    VWO.DOMNodePool.uncacheAll();
    VWO.DOMNodePool.cacheAll();

    return finalOperationsList;
  },

  /**
   * If the position (indexes) of the two matched nodes differs, it is
   * detected as a rearrange.
   *
   * @return {Object[][]} A list of inital and final states
   *                                 of the operations performed.
   */
  detectRearranges: function () {
    var initialTree = this.nodeA.descendants();
    var finalOperationsList = [];

    _(initialTree).each(function (node, i) {
      var adjacentNode, nodeI;

      // if the node is not matched with anything, return
      // it has already been removed/will be removed in detectRemoves
      if (!node.matchedWith) return;

      // if my parent has matched with my match's parent, and my index is unchanged, continue.
      if (node.parent() && node.parent().matchedWith &&
        node.parent().matchedWith === node.matchedWith.parent()) {
        if (node.index() === node.matchedWith.index()) return;

        // if my index changed, and yet, my next sibling... wtf?
      }

      // if both me and my match are root nodes without any parent, continue
      if (!node.parent() && !node.matchedWith.parent()) return;

      // match found, begin replacement
      adjacentNode = null;

      var oldParentSelectorPath = node.parent().selectorPath();
      var oldIndexInParent = node.index();

      // get my match's next sibling who actually has a match
      // if found, node = thus found node
      // if no such sibling is found,
      // node = my match's parent's match
      nodeI = node.matchedWith;
      while (nodeI = nodeI.nextSibling()) {
        if (nodeI.matchedWith) break;
      }

      if (nodeI && nodeI.matchedWith) {
        adjacentNode = nodeI.matchedWith;
        adjacentNode.parent().addChildAt(node, adjacentNode.index());
      } else {
        var parentNodeOfMatch = node.matchedWith.parent();

        // well what if parent node of match was a new node
        // solution: insertion should happen beforehand
        // so that new elements in the final dom are actually a part of the
        // initial dom.
        if (parentNodeOfMatch.matchedWith) {
          adjacentNode = parentNodeOfMatch.matchedWith;
        } else {
          adjacentNode = parentNodeOfMatch;
        }
        adjacentNode.addChild(node);
      }

      var parentSelectorPath = node.parent().selectorPath();
      var indexInParent = node.index();

      finalOperationsList.push(({
        name: 'rearrange',
        // since text nodes can also be rearranged, selector path
        // is always set to null
        selectorPath: null,
        content: {
          parentSelectorPath: parentSelectorPath,
          indexInParent: indexInParent,
          oldParentSelectorPath: oldParentSelectorPath,
          oldIndexInParent: oldIndexInParent,
          existsInDOM: true
        }
      }));
      VWO.DOMNodePool.uncacheAll();
      VWO.DOMNodePool.cacheAll();

    });

    return finalOperationsList;
  },

  /**
   * For all nodes in the initial tree that do not have a match in the
   * final tree, a remove is detected.
   *
   * @return {Object[][]} A list of inital and final states
   *                                 of the operations performed.
   */
  detectRemoves: function () {
    var initialTree = this.nodeA.descendants();
    var finalOperationsList = [];

    _(initialTree).each(function (node, i) {
      if (node.matchedWith) return;

      // if the node has been just inserted by detectInserts, ignore
      if (node.isInserted) return;

      // if my parent is removed, i am implicitly removed too.
      // removed = !matchedWith
      if (node.parent() && !node.parent().matchedWith) return;

      var parentSelectorPath = node.parent().selectorPath();
      var indexInParent = node.index();

      // this node has no match, this should be removed
      node.parent().removeChild(node);

      finalOperationsList.push(({
        name: 'deleteNode',
        // a remove operation cannot have a selector path,
        // a text node could also be removed
        selectorPath: null,
        content: {
          html: node.outerHTML(),
          parentSelectorPath: parentSelectorPath,
          indexInParent: indexInParent,
          existsInDOM: false
        }
      }));
    });

    return finalOperationsList;
  },

  detectRemovesInB: function () {
    var initialTree = this.nodeB.descendants();
    var finalOperationsList = [];

    _(initialTree).each(function (node, i) {
      if (node.matchedWith) return;

      // if the node has been just inserted by detectInserts, ignore
      if (node.isInserted) return;

      // if my parent is removed, i am implicitly removed too.
      // removed = !matchedWith
      if (node.parent() && !node.parent().matchedWith) return;

      var parentSelectorPath = node.parent().selectorPath();
      var indexInParent = node.index();

      // this node has no match, this should be removed
      node.parent().removeChild(node);

      finalOperationsList.push(({
        name: 'deleteNodeInB',
        // a remove operation cannot have a selector path,
        // a text node could also be removed
        selectorPath: null,
        content: {
          html: node.outerHTML(),
          node: node,
          parentSelectorPath: parentSelectorPath,
          indexInParent: indexInParent,
          existsInDOM: false
        }
      }));
    });

    VWO.DOMNodePool.uncacheAll();
    VWO.DOMNodePool.cacheAll();

    return finalOperationsList;
  },



  /**
   * Finally, verify if the comparison was successful.
   * (A console.log message is sent.)
   */
  verifyComparison: function () {
    console.log('comparison successful: ' + this.nodeA.equals(this.nodeB));
    return this.nodeA.equals(this.nodeB);
  },

  /**
   * Assuming the two nodes are set, begin the comparison.
   *
   * @return {Object[][]} A list of inital and final states
   *                                 of the operations performed.
   */
  compare: function () {
    var self = this;

    this.analyzeMatches();

    var final_results = [];

    var result1 = [
      this.detectRemovesInB(),
      this.detectRearranges()
    ];

    VWO.DOMNodePool.uncacheAll();
    VWO.DOMNodePool.cacheAll();

    result1 = _(result1).flatten();

    function getActualIndex(parentSelectorPath, indexInParent) {
      var parentNode = VWO.DOMNode.create({
        el: self.nodeB.el.parentNode.querySelector(parentSelectorPath)
      });
      if (indexInParent < 0)
        return -1;
      var childNode = parentNode.children()[indexInParent];
      return Array.prototype.slice.apply(parentNode.el.childNodes).indexOf(childNode.el);
    };

    var output = [],
      index, path, html, text, val, attr, css, index1, index2, path1, path2;
    var l = result1.length;
    for (var i = (l - 1); i >= 0; i--) {
      var op = result1[i];
      if (op.name == 'deleteNodeInB') {
        index = getActualIndex(op.content.parentSelectorPath, op.content.indexInParent - 1);
        path = op.content.parentSelectorPath.split('DOMComparisonResult > ')[1];
        if (!path)
          path = op.content.parentSelectorPath;
        html = op.content.html;
        if (index == -1)
          output[i] = '$(' + JSON.stringify(path) + ').prepend(' + JSON.stringify(html) + ');';
        else
          output[i] = '$($(' + JSON.stringify(path) + ').get(0).childNodes[' + index + ']).after(' + JSON.stringify(html) + ');';

        var ctx = self.nodeB.el;
        var $ = function (selector) {
          if (selector == "HIM#DOMComparisonResult")
            return jQuery(ctx);
          return jQuery(selector, ctx);
        };
        eval(output[i]);
      } else
        final_results.push(result1[i]);
    }
    VWO.DOMNodePool.uncacheAll();
    VWO.DOMNodePool.cacheAll();


    var result = [
      this.detectInserts(),
      this.detectRemoves(),
      this.detectTextNodeChanges(),
      this.detectAttributeChanges(),
      this.detectStyleChanges(),
    ];

    result = _(result).flatten();

    var le = result.length;

    for (i = 0; i < le; i++)
      final_results.push(result[i]);

    console.log(final_results);

    this.verifyComparison();



    result.toJqueryCode = function toJqueryCode() {
      function getActualIndex(parentSelectorPath, indexInParent) {
        var parentNode = VWO.DOMNode.create({
          el: self.elAClone.parentNode.querySelector(parentSelectorPath)
        });
        if (indexInParent < 0)
          return -1;
        var childNode = parentNode.children()[indexInParent];
        return Array.prototype.slice.apply(parentNode.el.childNodes).indexOf(childNode.el);
      }

      var output = [],
        index, path, html, text, val, attr, css, index1, index2, path1, path2;
      for (var i = 0, l = this.length; i < l; i++) {
        var op = this[i];
        switch (op.name) {
        case 'insertNode':
          index = getActualIndex(op.content.parentSelectorPath, op.content.indexInParent - 1);
          path = op.content.parentSelectorPath.split('DOMComparisonResult > ')[1];
          html = op.content.html;
          if (index == -1)
            output[i] = '$(' + JSON.stringify(path) + ').append(' + JSON.stringify(html) + ');';
          else
            output[i] = '$($(' + JSON.stringify(path) + ').get(0).childNodes[' + index + ']).after(' + JSON.stringify(html) + ');';
          break;

        case 'rearrange':
          index1 = getActualIndex(op.content.parentSelectorPath, op.content.indexInParent - 1);
          index2 = getActualIndex(op.content.oldParentSelectorPath, op.content.oldIndexInParent);
          path1 = op.content.parentSelectorPath.split('DOMComparisonResult > ')[1];
          path2 = op.content.oldParentSelectorPath.split('DOMComparisonResult > ')[1];
          var node = '$(' + path2 + ').get(0).childNodes[' + index2 + ']';
          if (index1 == -1)
            output[i] = '$(' + JSON.stringify(path1) + ').append(' + node + ');';
          else
            output[i] = '$($(' + JSON.stringify(path1) + ').get(0).childNodes[' + index1 + ']).after(' + node + ');';
        case 'deleteNode':
          index = getActualIndex(op.content.parentSelectorPath, op.content.indexInParent);
          path = op.content.parentSelectorPath.split('DOMComparisonResult > ')[1];
          html = op.content.html;
          output[i] = '$($(' + JSON.stringify(path) + ').get(0).childNodes[' + index + ']).remove();';
          break;
        case 'changeText':
        case 'changeComment':
          index = getActualIndex(op.content.parentSelectorPath, op.content.indexInParent);
          path = op.content.parentSelectorPath.split('DOMComparisonResult > ')[1];
          text = op.content.text;
          output[i] = '$($(' + JSON.stringify(path) + ').get(0).childNodes[' + index + ']).remove();';
          var ctx = self.elAClone;
          var $ = function (selector) {
            return jQuery(selector, ctx);
          };
          eval(output[i]);
          output[i] = '$(' + JSON.stringify(path) + ').append(' + JSON.stringify(text) + ');';
          break;
        case 'attr':
        case 'css':
          path = op.selectorPath.split('DOMComparisonResult > ')[1];
          val = op.content;
          output[i] = '$(' + JSON.stringify(path) + ').' + op.name + '(' + JSON.stringify(val) + ');';
          break;
        case 'removeAttr':
          path = op.selectorPath.split('DOMComparisonResult > ')[1];
          attr = Object.keys(op.content);
          output[i] = '$(' + JSON.stringify(path) + ')' + attr.map(function (attr) {
            return '.removeAttr(' + JSON.stringify(attr) + ')';
          }).join('') + ';';
          break;
        case 'removeCss':
          path = op.selectorPath.split('DOMComparisonResult > ')[1];
          css = Object.keys(op.content);
          output[i] = '$(' + JSON.stringify(path) + ')' + css.map(function (css) {
            return '.css(' + JSON.stringify(css) + ', "")';
          }).join('') + ';';
          break;
        }
        var ctx = self.elAClone;
        var $ = function (selector) {
          return jQuery(selector, ctx);
        };
        eval(output[i]);
      }
      return self.elAClone;
    };

    return final_results;
  }
};
})();
/*!
The MIT License (MIT)
http://opensource.org/licenses/MIT

Copyright (c) 2014 Wingify Software Pvt. Ltd.
http://wingify.com
*/

var VWO = window.VWO || {};
(function(){
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


    /*

Manually removing the comments in both strings ..

*/
    var i, A_len = stringA1.length,
      B_len = stringB1.length;
    var start_comment_flag = 0;

    var stringA = '',
      stringB = '';



    for (i = 0; i < A_len; i++) {

      if ((i + 3) < A_len && stringA1[i] == '<' && stringA1[i + 1] == '!' && stringA1[i + 2] == '-' && stringA1[i + 3] == '-') {
        start_comment_flag = 1;
        i = i + 3;
        continue;
      }
      if ((i + 2) < A_len && start_comment_flag == 1 && stringA1[i] == '-' && stringA1[i + 1] == '-' && stringA1[i + 2] == '>') {
        start_comment_flag = 0;
        i = i + 2;
        continue;
      }

      if (start_comment_flag == 0)
        stringA += stringA1[i];
    }

    start_comment_flag = 0;
    for (i = 0; i < B_len; i++) {
      if ((i + 3) < B_len && stringB1[i] == '<' && stringB1[i + 1] == '!' && stringB1[i + 2] == '-' && stringB1[i + 3] == '-') {
        start_comment_flag = 1;
        i = i + 3;
        continue;
      }
      if ((i + 2) < B_len && start_comment_flag == 1 && stringB1[i] == '-' && stringB1[i + 1] == '-' && stringB1[i + 2] == '>') {
        start_comment_flag = 0;
        i = i + 2;
        continue;
      }

      if (start_comment_flag == 0)
        stringB += stringB1[i];
    }


    var f = function (i) {
      return i < 10 ? " " + i : i.toString();
    };

    var couA = 0,
      couB = 0;

    var result = VWO.StringComparator.create({
      stringA: stringA,
      stringB: stringB,
      matchA: {},
      matchB: {},
      couA: 0,
      couB: 0,
      ignoreA: [],
      ignoreB: [],
      splitOn: splitOn
    }).compare();

    var diffUnion = result.diffUnion;

    /*
    for (var i = 0; i < diffUnion.length; i++) {
      var diff = diffUnion[i];
      console.log(
        diff.indexInA < 0 ? ' +' : f(diff.indexInA),
        diff.indexInB < 0 ? ' -' : f(diff.indexInB),
        diff.string
      );
    }

*/



    /*
   for  strings unchanged ... string pointer has been apllied for each unchanged node

*/

    var nodeMatches = {};
    var stringsInA = result.stringsInA;
    var stringsInB = result.stringsInB;

    for (i = 0; i < result.stringsUnchanged.length; i++) {
      var string = result.stringsUnchanged[i];
      var indexInA = string.indexInA;
      var indexInB = string.indexInB;

      var pointers = VWO.DOMNodeStringPointer.create({
        haystack: (indexInA > 0 ? splitOn : '') +
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
        if ((j + 1) < jl && (pointers[j + 1].index - pointers[j].index) == 1)
          num = 0;
        else
          num = splitOn.length;
        pointerInA = VWO.DOMNodeStringPointer.create({
          index: startIndexInA + pointers[j].index + num,
          haystack: stringA
        });
        pointerInB = VWO.DOMNodeStringPointer.create({
          index: startIndexInB + pointers[j].index + num,
          haystack: stringB
        });
        nodeMatches[pointerInA.masterIndex()] = pointerInB.masterIndex();
      }
    }

    /*
    for all the changed nodes , they are compared using the string comparator ..
*/

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

        /*

   Storing pointers of the strings after applying the regex breaking ...
   For e.g
   stringA = <him id="DOMComparisonResult">
   valA = [0, 1, 9, 31]

*/
        var valA = [],
          valB = [];
        var len_A = stringA.length,
          len_B = stringB.length;
        var c1, c2, co = 1,
          f = 0;
        valA[0] = 0;
        for (i = 0; i < len_A; i++) {
          c1 = stringA[i];
          c2 = c1.charCodeAt(0);
          if ((c2 > 47 && c2 < 58) || (c2 > 64 && c2 < 91) || (c2 > 96 && c2 < 123) || c2 == 32 || c2 == 95) // chaecking for alpha_numeric character
          {
            if (f) {
              valA[co] = i;
              co = co + 1;
              f = 0;
            }
            continue;
          } else
            f = 1;
        }

        couA = co;
        f = 0;
        co = 1;
        valB[0] = 0;
        for (i = 0; i < len_B; i++) {
          c1 = stringB[i];
          c2 = c1.charCodeAt(0);
          if ((c2 > 47 && c2 < 58) || (c2 > 64 && c2 < 91) || (c2 > 96 && c2 < 123) || c2 == 32 || c2 == 95) {
            if (f) {
              valB[co] = i;
              co = co + 1;
              f = 0;
            }
            continue;
          } else
            f = 1;
        }
        couB = co;


        /*

   * recForB() and recForA() are the functions for finding ignore matches
   * These matches are useful for finding nodes which are in A but not in B and vice-versa
   * Each children is visited recurssively and searched for corresponding match in alternate node. So, basically if node not found, then
     it is included in ignore node.

*/
        var str;
        var pB = this.nodeB;
        var num_childsB = pB.children().length;
        var sA, sB, indA, indB;
        var ignoreB = [],
          coB = 0;


        /*

  * finding nodes which are only in nodeB and not in nodeA .
  * counted as for insertNode()

*/

        var recForB = function (num_childsB, pB) {

          // if number of childs = 0, back-track for the longest node(do not have any attributes included) which does not have match in nodeA
          if (num_childsB == 0) {
            sA = pB.el.outerHTML;
            if (sA)
              indB = stringA.indexOf(sA);
            else {
              // if "sA" = text
              sA = pB.el.nodeValue;
              indB = stringA.indexOf(sA);
            }
            // indB != -1 means match has been found and hence return
            if (indB != -1)
              return;
            else {

              // If children node has some attributes, they should not be ignored ...
              if (sA.indexOf("class") != -1 || sA.indexOf("href") != -1 || sA.indexOf("style") != -1)
                return;
              // Go to the outer parent from IN-to-OUT in order to find the longest non-matching children
              while (pB.parent()) {
                pB = pB.parent();
                str = pB.el.outerHTML;
                if (str.indexOf("class") != -1 || str.indexOf("href") != -1 || str.indexOf("style") != -1)
                  break;
                sA = pB.el.outerHTML;
                indB = stringA.indexOf(sA);
                if (indB == -1 && pB.parent() && pB.parent().children().length == 1)
                  prev = sA;
                else
                  break;
              }

              // Store matching indexes from start to end
              var matching = [];
              matching.push({
                InB: [stringB.indexOf(sA), stringB.indexOf(sA) + sA.length]
              });

              var matching_len = matching.length;
              var st, en, j, indexB1, indexB2;
              for (i = 0; i < matching_len; i++) {
                st = matching[i].InB[0];
                for (j = 0; j < valB.length; j++) {
                  if (valB[j] > st) {
                    indexB1 = j;
                    break;
                  }
                }
                en = matching[i].InB[1];
                for (j = 0; j < valB.length; j++) {
                  if (valB[j] > en) {
                    indexB2 = j - 1;
                    break;
                  }
                }

                // Storing the indexes ....
                var lo = indexB2 - indexB1 + 1;
                for (j = 0; j < lo; j++) {
                  ignoreB[coB] = indexB1;
                  indexB1++;
                  coB++;
                }
              }
            }
            return;
          }

          // recursing for every children of nodeB
          var y;
          for (y = 0; y < num_childsB; y++) {
            recForB(pB.children()[y].children().length, pB.children()[y]);
          }
        };


        recForB(num_childsB, pB);

        /*

  * finding nodes which are only in nodeA and not in nodeB .
  * counted as for deleteNode()

*/

        var pA = this.nodeA;
        var num_childsA = pA.children().length;
        var ignoreA = [],
          coA = 0;

        var recForA = function (num_childsA, pA) {

          // if number of childs = 0, back-track for the longest node(do not have any attributes included) which does not have match in nodeB
          if (num_childsA == 0) {
            sA = pA.el.outerHTML;
            if (sA)
              indB = stringB.indexOf(sA);
            else {
              // if "sA" = text
              sA = pA.el.nodeValue;
              indB = stringB.indexOf(sA);
            }
            if (indB != -1)
              return;
            else {
              // If children node has some attributes, they should not be ignored ...
              if (sA.indexOf("class") != -1 || sA.indexOf("href") != -1 || sA.indexOf("style") != -1)
                return;
              // Go to the outer parent from IN-to-OUT in order to find the longest non-matching children
              while (pA.parent()) {
                pA = pA.parent();
                str = pA.el.outerHTML;
                if (str.indexOf("class") != -1 || str.indexOf("href") != -1 || str.indexOf("style") != -1)
                  break;
                sA = pA.el.outerHTML;
                indB = stringB.indexOf(sA);
                if (indB == -1 && pA.parent() && pA.parent().children().length == 1)
                  prev = sA;
                else
                  break;
              }

              // Store matching indexes from start to end
              var matching = [];
              matching.push({
                InA: [stringA.indexOf(sA), stringA.indexOf(sA) + sA.length]
              });

              var matching_len = matching.length;
              var st, en, j, indexA1, indexA2;
              for (i = 0; i < matching_len; i++) {
                st = matching[i].InA[0];
                for (j = 0; j < valA.length; j++) {
                  if (valA[j] > st) {
                    indexA1 = j;
                    break;
                  }
                }
                en = matching[i].InA[1];
                for (j = 0; j < valA.length; j++) {
                  if (valA[j] > en) {
                    indexA2 = j - 1;
                    break;
                  }
                }

                // Storing the indexes ....
                var lo = indexA2 - indexA1 + 1;
                for (j = 0; j < lo; j++) {
                  ignoreA[coA] = indexA1;
                  indexA1++;
                  coA++;
                }
              }
            }
            return;
          }

          // recursing for every children of nodeA
          var y;
          for (y = 0; y < num_childsA; y++) {
            recForA(pA.children()[y].children().length, pA.children()[y]);
          }
        };

        recForA(num_childsA, pA);



        /**

*   Doing the exact matches ..
*   These matches are used for finding the exact position of some children of nodeA in nodeB
*   For this, each children of nodeA is visited recurssively and it's exact position in nodeB is stored
*   Exact matches helps for finding re-arrangments
*   Since, indexOf() method is used, if two duplicate children appears in nodeA, results may be bad. So we have assume that the keys are almost
    unique, which is relevant to most prqactical cases.

*/


        var p = this.nodeA;
        var num_childs = p.children().length;
        var matchesInA = {},
          matchesInB = {};


        function allIndexOf(str, toSearch) {
          var indices = [];
          for (var pos = str.indexOf(toSearch); pos !== -1; pos = str.indexOf(toSearch, pos + 1)) {
            indices.push(pos);
          }
          return indices;
        };


        var rec = function (num_childs, p) {

          if (num_childs == 0)
            return;
          var x;
          for (x = 0; x < num_childs; x++) {
            var matching = [];
            sA = p.children()[x].el.outerHTML;
            //indB = stringB.indexOf(sA) ;
            var instances = allIndexOf(stringB, sA);
            if (instances.length == 1) {

              matching.push({
                InA: [stringA.indexOf(sA), stringA.indexOf(sA) + sA.length],
                InB: [stringB.indexOf(sA), stringB.indexOf(sA) + sA.length]
              });

              var matching_len = matching.length;
              var st, en, j, flag = 0;
              var indexA1, indexA2, indexB1, indexB2;
              for (i = 0; i < matching_len; i++) {
                // For A
                st = matching[i].InA[0];
                for (j = 0; j < valA.length; j++) {
                  if (valA[j] > st) {
                    indexA1 = j;
                    break;
                  }
                }
                en = matching[i].InA[1];
                for (j = 0; j < valA.length; j++) {
                  if (valA[j] > en) {
                    indexA2 = j - 1;
                    break;
                  }
                }

                // for B
                st = matching[i].InB[0];
                for (j = 0; j < valB.length; j++) {
                  if (valB[j] > st) {
                    indexB1 = j;
                    break;
                  }
                }
                en = matching[i].InB[1];
                for (j = 0; j < valB.length; j++) {
                  if (valB[j] > en) {
                    indexB2 = j - 1;
                    break;
                  }
                }

                // Storing the indexes ....
                var lo = indexA2 - indexA1 + 1;
                for (j = 0; j < lo; j++) {
                  matchesInA[indexA1] = indexB1;
                  matchesInB[indexB1] = indexA1;
                  indexA1++;
                  indexB1++;
                }
              }

              continue;

            }

            rec(p.children()[x].children().length, p.children()[x]);
          }
        };

        rec(num_childs, p);


        /*

   After doing exact and ignore matches, flow passes to string-comparator for partial matches

*/
        var splitOnRegExpA = /[^a-z0-9_ \r\n]+/gi;
        var splitOnRegExpB = /[^a-z0-9_ \r\n]+/gi;

        var innerResult = VWO.StringComparator.create({
          stringA: stringInStringInA,
          stringB: stringInStringInB,
          matchA: matchesInA,
          matchB: matchesInB,
          couA: couA,
          couB: couB,
          ignoreA: ignoreA,
          ignoreB: ignoreB,
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
              indexInStringInA = valA[innerDiff.indexInA];
            } else {
              indexInStringInA = stringInStringInA.length - innerDiff.string.length;
            }
          }
          if (innerDiff.indexInB >= 0) {
            matchInB = splitOnRegExpB.exec(stringInStringInB);
            if (matchInB) {
              // indexInStringInB = splitOnRegExpB.lastIndex - matchInB[0].length - innerDiff.string.length;
              indexInStringInB = valB[innerDiff.indexInB];
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

              var num = 1;
              if ((rangeInA[1] - rangeInA[0]) == 1)
                num = 0;

              var pointerInStringInA = VWO.DOMNodeStringPointer.create({
                index: startIndexInA + rangeInA[0] + pointersInString[k].index + num,
                haystack: stringA
              });
              var pointerInStringInB = VWO.DOMNodeStringPointer.create({
                index: startIndexInB + rangeInB[0] + pointersInString[k].index + num,
                haystack: stringB
              });
              var mi1 = pointerInStringInA.masterIndex(),
                mi2 = pointerInStringInB.masterIndex();
              innerNodeMatches[mi1] = mi2;
              var a = pointersInString[k],
                b = pointerInStringInA,
                c = pointerInStringInB;
              console.log(unchangedRanges[j].string, '-->>', a.nodeName(), a.haystack.substr(a.index, 5), '->', mi1, b.nodeName(),
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
    this.stringA = stringA_original;
    this.stringB = stringB_original;
    return this;
  }
};
})();
/*!
The MIT License (MIT)
http://opensource.org/licenses/MIT

Copyright (c) 2014 Wingify Software Pvt. Ltd.
http://wingify.com
*/

var VWO = window.VWO || {};
(function(){
var $ = window.vwo_$ || window.$;
var _ = window.vwo__ || window._;
var VWO = window.VWOInjected || window.VWO || {};

/**
 * Compares two DOMNodes and determines how closely they
 * match.
 *
 * @class
 * @memberOf VWO
 */
VWO.DOMNodeComparator = function (params) {
  $.extend(true, this, params);
};

VWO.DOMNodeComparator.create = function (params) {
  return new VWO.DOMNodeComparator(params);
};

VWO.DOMNodeComparator.prototype = {
  /** @type {VWO.DOMNode} First of the two nodes to compare. */
  nodeA: null,

  /** @type {VWO.DOMNode} Second of the two nodes to compare. */
  nodeB: null,

  /**
   * Determines if the indexes of the two nodes match.
   *
   * @return {Number} 1 = match, 0 = not a match.
   */
  indexScore: function () {
    return Number(this.nodeA.masterIndex() === this.nodeB.masterIndex());
  },

  /**
   * Determines if the node types of the two nodes match.
   *
   * @return {Number} 1 = match, 0 = not a match.
   */
  nodeTypeScore: function () {
    return Number(this.nodeA.nodeType() === this.nodeB.nodeType());
  },

  /**
   * Determines if the inner texts of the two nodes match.
   *
   * @return {Number} 1 = match, 0 = not a match.
   */
  innerTextScore: function () {
    return Number(this.nodeA.innerText() === this.nodeB.innerText());
  },

  /**
   * Determines if the innerHTML of the two nodes match.
   *
   * @return {Number} 1 = match, 0 = not a match.
   */
  innerHTMLScore: function () {
    return Number(this.nodeA.innerHTML() === this.nodeB.innerHTML());
  },

  /**
   * Determines if the node names of the two nodes match.
   *
   * @return {Number} 1 = match, 0 = not a match.
   */
  nodeNameScore: function () {
    if (!this.nodeTypeScore()) return 0;
    if (this.nodeA.nodeType() !== Node.ELEMENT_NODE) return 0;

    return Number(this.nodeA.nodeName() === this.nodeB.nodeName());
  },

  /**
   * Determines a score based on the number of ancestors that
   * match. (Between 0 - 1)
   *
   * @return {Number} A score greater than 0.5 indicates a good score.
   */
  parentScore: function () {
    if (!this.nodeA.parent() || !this.nodeB.parent()) return 0;

    return 0.5 + VWO.DOMNodeComparator.create({
      nodeA: this.nodeA.parent(),
      nodeB: this.nodeB.parent()
    }).parentScore() / 2;

    return this.nodeA.parent().nodeName() === this.nodeB.parent().nodeName();
  },

  /**
   * Determines a score based on the number of next siblings that
   * match. (Between 0 - 1)
   *
   * @return {Number} A score greater than 0.5 indicates a good score.
   */
  nextSiblingScore: function () {
    if (this.nodeA.nextSibling() && !this.nodeB.nextSibling()) return 0;
    if (!this.nodeA.nextSibling() && this.nodeB.nextSibling()) return 0;
    if (!this.nodeA.nextSibling() && !this.nodeB.nextSibling()) return 1;

    return 0.5 + VWO.DOMNodeComparator.create({
      nodeA: this.nodeA.nextSibling(),
      nodeB: this.nodeB.nextSibling()
    }).nextSiblingScore() / 2;

    return this.nodeA.nextSibling().nodeName() === this.nodeB.nextSibling().nodeName();
  },

  /**
   * Determines a score based on the number of previous siblings that
   * match. (Between 0 - 1)
   *
   * @return {Number} A score greater than 0.5 indicates a good score.
   */
  previousSiblingScore: function () {
    if (this.nodeA.previousSibling() && !this.nodeB.previousSibling()) return 0;
    if (!this.nodeA.previousSibling() && this.nodeB.previousSibling()) return 0;
    if (!this.nodeA.previousSibling() && !this.nodeB.previousSibling()) return 1;

    return 0.5 + VWO.DOMNodeComparator.create({
      nodeA: this.nodeA.previousSibling(),
      nodeB: this.nodeB.previousSibling()
    }).previousSiblingScore() / 2;

    return this.nodeA.previousSibling().nodeName() === this.nodeB.previousSibling().nodeName();
  },

  /**
   * An average of the previousSiblingScore and the nextSiblingScore
   * @return {Number} The average of the two scores.
   */
  siblingsScore: function () {
    return (this.nextSiblingScore() + this.previousSiblingScore()) / 2;
  },

  /**
   * An average of the previousSiblingScore, nextSiblingScore and parentScore
   * @return {Number} The average of the three scores.
   */
  adjacentElementsScore: function () {
    return (
      this.previousSiblingScore() +
      this.nextSiblingScore() +
      this.parentScore()
    ) / 3;
  },

  /**
   * A score determining how many children of the initial node match with
   * the children of the final.
   *
   * @return {Number} The number of children that match divided by total children.
   */
  childrenScore: function () {
    if (this.nodeA.children().length && !this.nodeB.children().length) return 0;
    if (!this.nodeA.children().length && this.nodeB.children().length) return 0;
    if (!this.nodeA.children().length && !this.nodeB.children().length) return 1;

    var score = 0;
    this.nodeA.children().forEach(function (childInNodeA) {
      score += Number(Boolean(this.nodeB.children().filter(function (childInNodeB) {
        return childInNodeB.nodeName() === childInNodeA.nodeName()
      })[0]));
    }.bind(this));
    return score / this.nodeA.children().length;
  },

  /**
   * A score determining how many attributes match.
   *
   * @return {Number} Number of matched attributes divided by total attributes.
   */
  attributeScore: function () {
    if (!this.nodeNameScore()) return 0;

    var nodeA = this.nodeA,
      nodeB = this.nodeB;

    var nodeAAttributeKeys = _.keys(nodeA.attributes());
    var nodeBAttributeKeys = _.keys(nodeB.attributes());

    var totalAttributes = _.union(nodeBAttributeKeys, nodeAAttributeKeys).length;

    if (!totalAttributes) return 1;

    var addedAttributes = _(this.addedAttributes()).keys().length;
    var removedAttributes = _(this.removedAttributes()).keys().length;
    var changedAttributes = _(this.changedAttributes()).keys().length;

    return (totalAttributes - addedAttributes - removedAttributes - changedAttributes) / totalAttributes || 0;
  },

  /**
   * A hashmap of attributes added in the final node.
   *
   * @return {Object} The resulting hashmap.
   */
  addedAttributes: function () {
    if (!this.nodeNameScore()) return {};

    var nodeA = this.nodeA,
      nodeB = this.nodeB;

    var nodeAAttributeKeys = _.keys(nodeA.attributes());
    var nodeBAttributeKeys = _.keys(nodeB.attributes());

    var addedAttributeKeys = _.difference(nodeBAttributeKeys, nodeAAttributeKeys);

    return _.pick.apply(_, [nodeB.attributes()].concat(addedAttributeKeys));
  },

  /**
   * A hashmap of attributes changed.
   *
   * @return {Object} The resulting hashmap.
   */
  changedAttributes: function () {
    if (!this.nodeNameScore()) return {};

    var nodeA = this.nodeA,
      nodeB = this.nodeB;

    var nodeAAttributes = nodeA.attributes();
    var nodeBAttributes = nodeB.attributes();

    var nodeAAttributeKeys = _.keys(nodeAAttributes);
    var nodeBAttributeKeys = _.keys(nodeBAttributes);

    var commonAttributeKeys = _.intersection(nodeBAttributeKeys, nodeAAttributeKeys);

    var changedAttributeKeys = commonAttributeKeys.filter(function (item) {
      return nodeAAttributes[item] !== nodeBAttributes[item];
    });

    return _.pick.apply(_, [nodeBAttributes].concat(changedAttributeKeys));
  },

  /**
   * A hashmap of attributes removed from the intial node.
   *
   * @return {Object} The resulting hashmap.
   */
  removedAttributes: function () {
    if (!this.nodeNameScore()) return {};

    var nodeA = this.nodeA,
      nodeB = this.nodeB;

    var nodeAAttributeKeys = _.keys(nodeA.attributes());
    var nodeBAttributeKeys = _.keys(nodeB.attributes());

    var removedAttributeKeys = _.difference(nodeAAttributeKeys, nodeBAttributeKeys);

    return _.pick.apply(_, [nodeA.attributes()].concat(removedAttributeKeys));
  },

  /**
   * A score determining how many styles match.
   *
   * @return {Number} Number of matched styles divided by total styles.
   */
  styleScore: function () {
    if (!this.nodeNameScore()) return 0;

    var nodeA = this.nodeA,
      nodeB = this.nodeB;

    var nodeAStyleKeys = _.keys(nodeA.styles());
    var nodeBStyleKeys = _.keys(nodeB.styles());

    var totalStyles = _.union(nodeBStyleKeys, nodeAStyleKeys).length;

    if (!totalStyles) return 1;

    var addedStyles = _(this.addedStyles()).keys().length;
    var removedStyles = _(this.removedStyles()).keys().length;
    var changedStyles = _(this.changedStyles()).keys().length;

    return (totalStyles - addedStyles - removedStyles - changedStyles) / totalStyles || 0;
  },

  /**
   * A hashmap of styles added in the final node.
   *
   * @return {Object} The resulting hashmap.
   */
  addedStyles: function () {
    if (!this.nodeNameScore()) return {};

    var nodeA = this.nodeA,
      nodeB = this.nodeB;

    var nodeAStyleKeys = _.keys(nodeA.styles());
    var nodeBStyleKeys = _.keys(nodeB.styles());

    var addedStyleKeys = _.difference(nodeBStyleKeys, nodeAStyleKeys);

    return _.pick.apply(_, [nodeB.styles()].concat(addedStyleKeys));
  },

  /**
   * A hashmap of styles changed.
   *
   * @return {Object} The resulting hashmap.
   */
  changedStyles: function () {
    if (!this.nodeNameScore()) return {};

    var nodeA = this.nodeA,
      nodeB = this.nodeB;

    var nodeAStyles = nodeA.styles();
    var nodeBStyles = nodeB.styles();

    var nodeAStyleKeys = _.keys(nodeAStyles);
    var nodeBStyleKeys = _.keys(nodeBStyles);

    var commonStyleKeys = _.intersection(nodeBStyleKeys, nodeAStyleKeys);

    var changedStyleKeys = commonStyleKeys.filter(function (item) {
      return nodeAStyles[item] !== nodeBStyles[item];
    });

    return _.pick.apply(_, [nodeBStyles].concat(changedStyleKeys));
  },

  /**
   * A hashmap of styles removed from the initial node.
   *
   * @return {Object} The resulting hashmap.
   */
  removedStyles: function () {
    if (!this.nodeNameScore()) return {};

    var nodeA = this.nodeA,
      nodeB = this.nodeB;

    var nodeAStyleKeys = _.keys(nodeA.styles());
    var nodeBStyleKeys = _.keys(nodeB.styles());

    var removedStyleKeys = _.difference(nodeAStyleKeys, nodeBStyleKeys);

    return _.pick.apply(_, [nodeA.styles()].concat(removedStyleKeys));
  },

  /**
   * If the matched nodes are text nodes and the innerText does not
   * match, returns the new innerText.
   *
   * @return {String} The new innerText of the final node.
   */
  newInnerText: function () {
    if (!this.nodeTypeScore() ||
      this.nodeA.nodeType() === Node.ELEMENT_NODE ||
      this.innerTextScore()) return null;

    return this.nodeB.innerText();
  },

  /**
   * An aggregate score based on the products of arbitrary weights
   * and various other scores. A greater score indicates a better
   * match.
   *
   * @return {Number} The final score.
   */
  finalScore: function () {
    var nodeA = this.nodeA,
      nodeB = this.nodeB;

    if (!nodeA || !nodeB) return 0;

    var indexScore = this.indexScore(),
      nodeTypeScore = this.nodeTypeScore(),
      nodeNameScore = this.nodeNameScore(),
      attributeScore = this.attributeScore(),
      styleScore = this.styleScore(),
      innerHTMLScore = this.innerHTMLScore(),
      innerTextScore = this.innerTextScore();


    if (nodeTypeScore && nodeA.nodeType() === Node.TEXT_NODE) {
      if (innerTextScore) return 1;
      if (indexScore) return 0.9;
      return 0;
    }

    if (!nodeNameScore) return 0;

    // input tags with their type attributes changed are not valid matches.
    if (nodeA.nodeName().toUpperCase() === 'INPUT' &&
      nodeA.attributes()['type'] !== nodeB.attributes()['type']) return 0;

    if (innerHTMLScore) {
      return (8 + indexScore + (2 * attributeScore + styleScore) / 3) / 10;
    }

    return (indexScore + 8 * innerHTMLScore +
      (2 * attributeScore + styleScore) / 3) / 10;
  },

  /**
   * A hashmap of changes that happened from the initial node to the final node.
   *
   * @return {Object} A hashmap consisting of attribute changes, style changes,
   *                  and the new inner text (if any).
   */
  difference: function () {
    return {
      addedAttributes: this.addedAttributes(),
      removedAttributes: this.removedAttributes(),
      changedAttributes: this.changedAttributes(),
      addedStyles: this.addedStyles(),
      removedStyles: this.removedStyles(),
      changedStyles: this.changedStyles(),
      newInnerText: this.newInnerText()
    };
  }
};
})();
/*!
The MIT License (MIT)
http://opensource.org/licenses/MIT

Copyright (c) 2014 Wingify Software Pvt. Ltd.
http://wingify.com
*/

var VWO = window.VWO || {};
(function(){
var $ = window.vwo_$ || window.$;
var _ = window.vwo__ || window._;
var VWO = window.VWOInjected || window.VWO || {};

/**
 * Using a string haystack containing DOM/XML nodes,
 * this object helps determine the node at a particular
 * index, and can also be used to traverse the DOM tree without
 * needing a DOM parser.
 *
 * @class
 * @memberOf VWO
 */
VWO.DOMNodeStringPointer = function (params) {
  $.extend(true, this, params);
};

VWO.DOMNodeStringPointer.create = function (params) {
  return new VWO.DOMNodeStringPointer(params);
};

VWO.DOMNodeStringPointer.prototype = {
  /**
   * The haystack of DOM/XML nodes. Various methods in this
   * object compute on character at 'index' in this 'haystack'.
   *
   * @type {String}
   */
  haystack: '',

  /**
   * The index this pointer points to in the haystack. The methods
   * in this object compute on the character at 'index' in the
   * 'haystack'.
   *
   * @type {String}
   */
  index: 0,

  /**
   * @private
   */
  _pointerWithIndex: function (i) {
    return VWO.DOMNodeStringPointer.create({
      haystack: this.haystack,
      index: i
    });
  },

  /**
   * Returns a list of all node pointers in the current haystack.
   *
   * @return {VWO.DOMNodeStringPointer[]} An array containing all the
   *                                      node pointers.
   */
  allNodePointers: function () {
    var pointers = [];
    var pointer = this._pointerWithIndex(0);
    pointers.push(pointer);
    while (pointer = pointer.nextPointer()) {
      pointers.push(pointer);
    }

    return pointers;
  },

  /**
   * Gets the node type at the index the pointer is pointing
   * to in the haystack.
   *
   * @return {Number} One of the standard node types.
   */
  nodeType: function () {
    var i = this.index,
      haystack = this.haystack;
    if (haystack.lastIndexOf('<!--', i) > haystack.lastIndexOf('-->', i) || haystack.substr(i, 3) === '-->') {
      return Node.COMMENT_NODE;
    }
    if (haystack.lastIndexOf('<![CDATA[', i) > haystack.lastIndexOf(']]>', i) || haystack.substr(i, 3) === ']]>') {
      return Node.CDATA_SECTION_NODE;
    }
    if (haystack.lastIndexOf('<', i) > haystack.lastIndexOf('>', i) || haystack.charAt(i) === '>') {
      return Node.ELEMENT_NODE;
    }
    return Node.TEXT_NODE;
  },

  /**
   * Gets the node name at the index the pointer is pointing to
   * in the haystack.
   *
   * @return {String} The node name.
   */
  nodeName: function () {
    var i = this.index,
      haystack = this.haystack;
    var nodeType = this.nodeType();

    if (nodeType === Node.ELEMENT_NODE) {
      var j = haystack.lastIndexOf('<', i) + 1;
      var k = haystack.indexOf(' ', j);
      var l = haystack.indexOf('>', j);
      var nodeName = haystack.substring(j, Math.min(
        k === -1 ? l : k,
        l === -1 ? k : l
      ));

      if (nodeName.charAt(0) === '/') {
        nodeName = nodeName.substr(1);
      }

      if ($('<div/>').get(0).nodeName === 'DIV') {
        nodeName = nodeName.toUpperCase();
      }

      return nodeName;
    }

    return nodeType;
  },

  /**
   * Determines whether the node at the current index
   * points to a closing tag. Returns false if the node at
   * index is not an Element node.
   *
   * @return {Boolean} True, if it is a closing tag.
   */
  pointsToClosingTag: function () {
    if (this.nodeType() !== Node.ELEMENT_NODE) return false;

    var j = this.haystack.lastIndexOf('<', this.index);
    return this.haystack.charAt(j + 1) === '/';
  },

  /**
   * Determines whether the node at the current index points
   * to an empty tag. Empty tags include: area, base, br, col,
   * hr, img, input, link, meta, param. Empty tags don't have
   * closing tags.
   *
   * @return {Boolean} True, if the node at index is an empty tag.
   */
  pointsToEmptyTag: function () {
    var emptyTags = /area|base|br|col|hr|img|input|link|meta|param/i;
    return emptyTags.test(this.nodeName());
  },

  /**
   * Returns a new pointer with the same haystack pointing to the node
   * previous to this node. The previous node isn't necessarily the
   * previous DOM sibling. It could be the parent as well. Returns
   * null if there is no previous node.
   *
   * @return {VWO.DOMNodeStringPointer} Pointer to the previous node.
   */
  previousPointer: function () {
    var i = this.index,
      haystack = this.haystack;
    var nodeType = this.nodeType();
    var j;
    var pointer;
    if (nodeType === Node.TEXT_NODE) {
      j = haystack.lastIndexOf('>', i);
      pointer = this._pointerWithIndex(j);
    } else if (nodeType === Node.COMMENT_NODE) {
      j = haystack.lastIndexOf('<!--', i);
      pointer = this._pointerWithIndex(j - 1);
    } else if (nodeType === Node.CDATA_SECTION_NODE) {
      j = haystack.lastIndexOf('<![CDATA[', i);
      pointer = this._pointerWithIndex(j - 1);
    } else {
      j = haystack.lastIndexOf('<', i);
      pointer = this._pointerWithIndex(j - 1);
    }

    if (pointer.index < 0 || pointer.index >= haystack.length) return null;

    return pointer;
  },

  /**
   * Returns a new pointer with the same haystack pointing to the previous
   * DOM sibling of this node. If no previous sibling is found, it returns
   * null.
   *
   * @return {VWO.DOMNodeStringPointer} Pointer to the previous sibling node.
   */
  previousSiblingPointer: function () {
    var i = this.index,
      haystack = this.haystack;
    var nodeType = this.nodeType();
    var nodeName = this.nodeName();
    var j;
    var pointer;

    if (nodeType === Node.TEXT_NODE) {
      j = haystack.lastIndexOf('>', i);
      pointer = this._pointerWithIndex(j);
    } else if (nodeType === Node.COMMENT_NODE) {
      j = haystack.lastIndexOf('<!--', i);
      pointer = this._pointerWithIndex(j - 1);
    } else if (nodeType === Node.CDATA_SECTION_NODE) {
      j = haystack.lastIndexOf('<![CDATA[', i);
      pointer = this._pointerWithIndex(j - 1);
    } else {
      j = haystack.lastIndexOf('<', i);

      if (!this.pointsToClosingTag()) {
        pointer = this._pointerWithIndex(j - 1);
      } else {
        // it is a closing tag, where does this begin?
        var k = j + 1;
        var closingTags = [];
        var l = 0;
        while (closingTags) {
          k = haystack.toLowerCase().lastIndexOf('<' + nodeName.toLowerCase(), k - 1);
          closingTags = haystack.substring(k, j).match(new RegExp('<\\/' + nodeName, 'gi'));
          if (closingTags && l++ == closingTags.length) break;
        }
        pointer = this._pointerWithIndex(k - 1);
      }
    }

    if (pointer.index < 0) return null;

    // if previous node isn't an empty tag, and isn't a closing tag
    if (pointer.nodeType() === Node.ELEMENT_NODE && !pointer.pointsToEmptyTag()) {
      if (haystack.charAt(haystack.lastIndexOf('<', pointer.index) + 1) !== '/') {
        return null;
      }
    }

    return pointer;
  },

  /**
   * Returns a new pointer with the same haystack pointing to the node
   * next to this node. The next node isn't necessarily the
   * next DOM sibling. It could be the parent as well. Returns
   * null if there is no next node.
   *
   * @return {VWO.DOMNodeStringPointer} The next node.
   */
  nextPointer: function () {
    var i = this.index,
      haystack = this.haystack;
    var nodeType = this.nodeType();
    var j;
    var pointer;
    if (nodeType === Node.TEXT_NODE) {
      j = haystack.indexOf('<', i);
      pointer = this._pointerWithIndex(j);
    } else if (nodeType === Node.COMMENT_NODE) {
      j = haystack.indexOf('-->', i);
      if (j === -1) return null;
      pointer = this._pointerWithIndex(j + 3);
    } else if (nodeType === Node.CDATA_SECTION_NODE) {
      j = haystack.indexOf(']]>', i);
      if (j === -1) return null;
      pointer = this._pointerWithIndex(j + 3);
    } else {
      j = haystack.indexOf('>', i);
      if (j === -1) return null;
      pointer = this._pointerWithIndex(j + 1);
    }

    if (pointer.index < 0 || pointer.index >= haystack.length) return null;

    return pointer;
  },

  /**
   * Returns a new pointer with the same haystack pointing to the next
   * DOM sibling of this node. If no next sibling is found, it returns
   * null.
   *
   * @return {VWO.DOMNodeStringPointer} Pointer to the next sibling node.
   */
  nextSiblingPointer: function () {
    var i = this.index,
      haystack = this.haystack;
    var nodeType = this.nodeType();
    var nodeName = this.nodeName();
    var j;
    var pointer;

    if (nodeType === Node.TEXT_NODE) {
      j = haystack.indexOf('<', i);
      pointer = this._pointerWithIndex(j);
    } else if (nodeType === Node.COMMENT_NODE) {
      j = haystack.indexOf('-->', i);
      if (j === -1) return null;
      pointer = this._pointerWithIndex(j + 3);
    } else if (nodeType === Node.CDATA_SECTION_NODE) {
      j = haystack.indexOf(']]>', i);
      if (j === -1) return null;
      pointer = this._pointerWithIndex(j + 3);
    } else {
      j = haystack.indexOf('>', i);
      if (j === -1) return null;

      if (this.pointsToClosingTag()) {
        pointer = this._pointerWithIndex(j + 1);
      } else {
        // it is NOT a closing tag, where does this close?
        var k = j - 1;
        var openingTags = [];
        var l = 0;
        while (openingTags) {
          k = haystack.toLowerCase().indexOf('</' + nodeName.toLowerCase(), k + 1);
          k = haystack.indexOf('>', k);
          openingTags = haystack.substring(j, k).match(new RegExp('<' + nodeName, 'gi'));
          if (openingTags && l++ == openingTags.length) break;
        }
        pointer = this._pointerWithIndex(k + 1);
      }
    }

    if (pointer.index < 0 || pointer.index >= haystack.length) return null;

    // if next node IS an empty tag, or IS a closing tag
    if (pointer.nodeType() === Node.ELEMENT_NODE && (pointer.pointsToEmptyTag() ||
      haystack.charAt(haystack.indexOf('<', pointer.index) + 1) === '/')) {
      return null;
    }

    return pointer;
  },

  /**
   * Returns a new pointer with the same haystack pointing to the parent
   * DOM node of this node. If no parent is found, it returns null.
   *
   * @return {VWO.DOMNodeStringPointer} Pointer to the parent node.
   * @return {VWO.DOMNodeStringPointer} Pointer to the parent node.
   */
  parentPointer: function () {
    var i = this.index,
      haystack = this.haystack;
    var nodeType = this.nodeType();
    var nodeName = this.nodeName();
    var j;
    var prev = this.previousSiblingPointer();
    if (prev) {
      return prev.parentPointer();
    }
    var pointer;

    if (nodeType === Node.TEXT_NODE) {
      j = haystack.lastIndexOf('>', i);
      pointer = this._pointerWithIndex(j);
    } else if (nodeType === Node.COMMENT_NODE) {
      j = haystack.lastIndexOf('<!--', i);
      pointer = this._pointerWithIndex(j - 1);
    } else if (nodeType === Node.CDATA_SECTION_NODE) {
      j = haystack.lastIndexOf('<![CDATA[', i);
      pointer = this._pointerWithIndex(j - 1);
    } else {
      j = haystack.lastIndexOf('<', i);
      pointer = this._pointerWithIndex(j - 1);
      var isClosingTag = haystack.charAt(j + 1) === '/';

      if (!isClosingTag) {
        pointer = this._pointerWithIndex(j - 1);
      } else {
        // it is a closing tag, where does this begin?
        var k = j + 1;
        var closingTags = [];
        var l = 0;
        while (closingTags) {
          k = haystack.toLowerCase().lastIndexOf('<' + nodeName.toLowerCase(), k - 1);
          closingTags = haystack.substring(k, j).match(new RegExp('<\\/' + nodeName, 'gi'));
          if (closingTags && l++ == closingTags.length) break;
        }
        pointer = this._pointerWithIndex(k - 1);
      }
    }

    if (pointer.index < 0 || pointer.index >= haystack.length) return null;

    // parent can't be a closing tag
    if (haystack.charAt(haystack.lastIndexOf('<', pointer.index) + 1) === '/') {
      return null;
    }

    return pointer;
  },

  /**
   * Returns a colon delimited master index of node at the current index. Whitespaces
   * and comment nodes are included when calculating the index.
   *
   * @return {String} The master index, e.g.: 0:1:1:0:2
   */
  masterIndex: function () {
    var i = 0;
    var prev = this;
    while (prev = prev.previousSiblingPointer()) {
      i++;
    }

    var parent = this.parentPointer();

    if (parent) {
      return parent.masterIndex() + ':' + i;
    }

    return i.toString();
  }
};
})();
/*!
The MIT License (MIT)
http://opensource.org/licenses/MIT

Copyright (c) 2014 Wingify Software Pvt. Ltd.
http://wingify.com
*/

var VWO = window.VWO || {};
(function(){
var $ = window.vwo_$ || window.$;
var _ = window.vwo__ || window._;
var VWO = window.VWOInjected || window.VWO || {};

VWO.DOMNodePool = {
  content: [],

  create: function (params) {
    return this.content.filter(function (domNode) {
      return domNode.el === params.el;
    })[0] || VWO.DOMNode.create(params);
  },

  uncacheAll: function () {
    this.content.forEach(function (domNode) {
      domNode.uncache();
    });
  },

  cacheAll: function () {
    this.content.forEach(function (domNode) {
      domNode.cache();
    });
  },

  pushObject: function (obj) {
    return this.content.push(obj);
  },

  clear: function () {
    this.content = [];
  }
};
/**
 * A wrapper around a traditional DOM element to use for comparison
 * of two DOM nodes.
 *
 * @class
 * @memberOf VWO
 */
VWO.DOMNode = function (params) {
  $.extend(true, this, params);
  VWO.DOMNodePool.pushObject(this);
  this.cache();
};

VWO.DOMNode.create = function (params) {
  return new VWO.DOMNode(params);
};

VWO.DOMNode.prototype = {
  /**
   * Whether this node's children should ignore only whitespace text
   * nodes.
   *
   * @type Boolean
   */
  ignoreWhitespace: true,

  /**
   * Whether this node's children should ignore comment nodes.
   *
   * @type Boolean
   */
  ignoreComments: true,

  /**
   * Replaces all the getter functions in this class with cached
   * versions. The functions will execute just once and return the
   * same output each time unless they are uncached.
   */
  cache: function () {
    var fn = [
      'index', 'parent', 'previousSibling',
      'previousElementSibling', 'nextSibling', 'nextElementSibling',
      'adjacentElementNode', 'vwoMarker', 'nodeType', 'nodeName',
      'innerText', 'innerHTML', 'outerHTML', 'attributes',
      'styles', 'children', 'ancestors', 'descendants',
      'masterIndex', 'selectorPath'
    ];

    for (var i in fn)
      if (fn.hasOwnProperty(i)) {
        this[fn[i]] = this[fn[i]].cache();
      }
  },

  /**
   * Replaces all the cached functions in this class with the uncached
   * versions. The functions results are no longer cached.
   */
  uncache: function () {
    var fn = [
      'index', 'parent', 'previousSibling',
      'previousElementSibling', 'nextSibling', 'nextElementSibling',
      'adjacentElementNode', 'vwoMarker', 'nodeType', 'nodeName',
      'innerText', 'innerHTML', 'outerHTML', 'attributes',
      'styles', 'children', 'ancestors', 'descendants',
      'masterIndex', 'selectorPath'
    ];

    for (var i in fn)
      if (fn.hasOwnProperty(i) && typeof this[fn[i]].uncache === 'function') {
        this[fn[i]] = this[fn[i]].uncache();
      }
  },

  /**
   * The index of this node in its parent's children list.
   *
   * @return {Number}
   */
  index: function () {
    if (!this.parent()) return 0;

    return this.parent().children().indexOf(this);
  },

  /**
   * The parent DOMNode of this node.
   *
   * @return {VWO.DOMNode}
   */
  parent: function () {
    if (!this.$().parent().length) return null;

    return VWO.DOMNodePool.create({
      el: this.$().parent().get(0)
    });
  },

  /**
   * The previous sibling of this DOMNode holding
   * an Element object.
   *
   * @return {VWO.DOMNode}
   */
  previousElementSibling: function () {
    if (!this.$().prev().get(0)) return null;

    return VWO.DOMNodePool.create({
      el: this.$().prev().get(0)
    });
  },

  /**
   * The immediate previous sibling of this DOMNode. It
   * can be an element, text or comment node.
   *
   * @return {VWO.DOMNode}
   */
  previousSibling: function () {
    if (!this.el.previousSibling) return null;

    var previousSibling = VWO.DOMNodePool.create({
      el: this.el.previousSibling
    });

    // if previous sibling is whitespace, get previous element node
    if (this.ignoreWhitespace &&
      this.el.previousSibling instanceof Text &&
      !this.el.previousSibling.textContent.trim()) {
      return previousSibling.previousSibling();
    }

    // if previous sibling is a comment node, get previous element node
    if (this.ignoreComments &&
      this.el.previousSibling instanceof Comment) {
      return previousSibling.previousSibling();
    }

    return previousSibling;
  },

  /**
   * The next sibling of this DOMNode holding
   * an Element object.
   *
   * @return {VWO.DOMNode}
   */
  nextElementSibling: function () {
    if (!this.$().next().get(0)) return null;

    return VWO.DOMNodePool.create({
      el: this.$().next().get(0)
    });
  },

  /**
   * The immediate next sibling of this DOMNode. It
   * can be an element, text or comment node.
   *
   * @return {VWO.DOMNode}
   */
  nextSibling: function () {
    if (!this.el.nextSibling) return null;

    var nextSibling = VWO.DOMNodePool.create({
      el: this.el.nextSibling
    });

    // if next sibling is whitespace, get next element node
    if (this.ignoreWhitespace &&
      this.el.nextSibling instanceof Text &&
      !this.el.nextSibling.textContent.trim()) {
      return nextSibling.nextSibling();
    }

    // if next sibling is a comment node, get next element node
    if (this.ignoreComments &&
      this.el.nextSibling instanceof Comment) {
      return nextSibling.nextSibling();
    }

    return nextSibling;
  },

  proximity: 0,
  relationship: null,

  adjacentElementNode: function () {
    var $adjacent = this.$().adjacent();

    if (!$adjacent) return null;

    var adjacentNode = VWO.DOMNodePool.create({
      el: $adjacent.get(0)
    });

    adjacentNode.relationship = $adjacent.relationship;
    adjacentNode.proximity = $adjacent.proximity;

    return adjacentNode;
  },

  /**
   * The Element object this DOMNode is wrapped around.
   * It can be an HTMLElement, HTMLDivElement, Text, or
   * Comment
   *
   * @type Element|Text|Comment
   */
  el: null,

  /**
   * The vwo marker for this node.
   *
   * @type String
   */
  vwoMarker: function () {
    return VWO.ElementMarkerStore.getMarkerForElement(this.el);
  },

  /**
   * The type of this node. Returns a number as per standard node types
   * defined by W3C.
   *
   * @type Number
   */
  nodeType: function () {
    return this.el.nodeType;
  },

  /**
   * The node name of this node. If it is an Element node,
   * it returns the node name of the node. Else it returns
   * the node type.
   *
   * @type String
   * @readonly
   */
  nodeName: function () {
    return this.el.nodeName;
  },

  /**
   * The innerText of this node.
   *
   * @type String
   * @readonly
   */
  innerText: function () {
    var el = this.el;

    return el.innerText || el.textContent;
  },

  /**
   * The innerHTML of this node.
   *
   * @type String
   * @readonly
   */
  innerHTML: function () {
    var el = this.el;

    return el.innerHTML || el.textContent;
  },

  /**
   * The outerHTML of this node.
   *
   * @type String
   * @readonly
   */
  outerHTML: function () {
    var el = this.el;

    return (
      el.outerHTML ||
      $("<div></div>").append($(el).clone(true)).html()
    );
  },


  /**
   * A key-value pair of attributes this node holds.
   * The resulting hashmap excludes the 'style' attribute.
   *
   * @type Object
   * @readonly
   */
  attributes: function () {
    if (this.nodeType() !== Node.ELEMENT_NODE) return {};

    var el = this.el,
      attributes = {};

    for (var i = 0; i < el.attributes.length; i++) {
      var attr = el.attributes[i];
      if (attr.name === 'style') continue;
      attributes[attr.name] = attr.value;
    }

    return attributes;
  },

  /**
   * A key-value pair of styles this node holds.
   *
   * @type Object
   * @readonly
   */
  styles: function () {
    if (this.nodeType() !== Node.ELEMENT_NODE) return {};

    var el = this.el,
      stylesHash = {};

    for (var i = 0; i < el.attributes.length; i++) {
      var attr = el.attributes[i];
      if (attr.name !== 'style') continue;

      var styles = attr.value.trim().split(';');

      for (var j = 0; j < styles.length; j++) {
        var style = styles[j].trim();
        if (!style) continue;
        style = style.split(':');
        stylesHash[style[0].trim()] = style[1].trim();
      }
    }

    return stylesHash;
  },

  /**
   * An array of children in this node.
   *
   * @type Array
   * @readonly
   */
  children: function () {
    var el = this.el,
      children = [];

    for (var node = el.firstChild; node; node = node.nextSibling) {
      // ignore text nodes with only whitespace
      if (this.ignoreWhitespace && node instanceof Text && !node.textContent.trim()) continue;

      // ignore comment nodes
      if (this.ignoreComments && node instanceof Comment) continue;

      children.push(VWO.DOMNodePool.create({
        el: node,
        ignoreWhitespace: this.ignoreWhitespace,
        ignoreComments: this.ignoreComments
      }));
    }

    return this._children = children;
  },

  /**
   * An array of all the ancestors to this node, starting with
   * the most adjacent ancestor to the farthest one.
   *
   * @type Array
   * @readonly
   */
  ancestors: function () {
    if (!this.parent()) return [];

    return [this.parent()].concat(this.parent().ancestors());
  },

  /**
   * A key value pair of all the descendants to this node, found using
   * BFS (Breadth First Search). The key in this hashmap is the master
   * index of the node, and the value is a DOMNode object.
   *
   * @type Object
   * @readonly
   */
  descendants: function () {
    var descendants = {},
      masterIndex = this.masterIndex(),
      children = this.children();

    descendants[masterIndex] = this;

    for (var i = 0, l = children && children.length; i < l; i++) {
      $.extend(descendants, children[i].descendants());
    }

    return descendants;
  },

  /**
   * The master index of this node. The last component of this index
   * is the element's index in its parent, preceded by each of its
   * ancestors' indices.
   *
   * @type String
   * @readonly
   */
  masterIndex: function () {
    var parent = this.parent();
    var parentMasterIndex = parent && parent.masterIndex();
    if (parentMasterIndex === null || parentMasterIndex === undefined) {
      return this.index().toString();
    }

    return parentMasterIndex + ":" + this.index().toString();
  },

  /**
   * The selector path of this node upto the nearest orphan parent.
   *
   * @type String
   * @readonly
   */
  selectorPath: function () {
    return $(this.el).selectorPath();
  },

  /**
   * Returns a copy of this DOMNode object. The Element this DOMNode
   * is wrapped around will also be cloned.
   *
   * @return VWO.DOMNode
   */
  copy: function () {
    return VWO.DOMNode.create({
      el: $(this.el).clone().get(0)
    });
  },

  /**
   * Executes the jQuery function on the element this DOMNode is wrapped
   * around.
   *
   * @param {String} selector The selector to select an element in this node's children
   * @param {*} target The target object within this node.
   * @return {jQuery} A jQuery wrapper around the selected element(s)
   */
  $: function (selector, target) {
    if (arguments.length) {
      target = target || this.el;
      return $(selector, target);
    }
    return $(this.el);
  },

  /**
   * Adds a child node to the last position in this node's children, and
   * also appends it to the node's markup.
   *
   * @param {VWO.DOMNode} node The DOMNode to insert.
   * @return {VWO.DOMNode} Returns the object just added.
   */
  addChild: function (node) {
    return this.addChildAt(node, this.children().length);
  },

  /**
   * Removes the given child from this node's children list, and also
   * removes it from the node's markup.
   *
   * @param {VWO.DOMNode} node The DOMNode to remove.
   * @throws {Error} Throws an error if the node to remove isn't a child
   * of this node.
   * @return {VWO.DOMNode} The node just removed.
   */
  removeChild: function (node) {
    var index = this.children().indexOf(node);

    if (index < 0) {
      throw new Error('removeChild: node is not a child of this node.');
    }

    return this.removeChildAt(index);
  },

  /**
   * Adds a child to this node's children at a particular index. Also
   * adds the markup of that node to this node's markup at that index.
   *
   * @param {VWO.DOMNode} node The DOMNode to insert.
   * @param {Number} index The index to insert the node at.
   * @throws {RangeError} Throws an error if the index is out of bounds.
   * @return {VWO.DOMNode} The DOMNode just inserted.
   */
  addChildAt: function (node, index) {
    node.ignoreWhitespace = this.ignoreWhitespace;
    node.ignoreComments = this.ignoreComments;

    if (index < 0 || index > this.children().length) {
      throw new RangeError('addChildAt: index is out of bounds.');
    }

    var nextSibling = this.children()[index];

    if (nextSibling) {
      nextSibling.$().before(node.$());
    } else {
      this.$().append(node.$());
    }

    VWO.DOMNodePool.uncacheAll();
    VWO.DOMNodePool.cacheAll();

    return node;
  },

  /**
   * Removes a child node in this node's children and markup at a particular
   * index.
   *
   * @param {Number} index The index to remove element at.
   * @throws {RangeError} Throws an error if the index is out of bounds.
   * @return {VWO.DOMNode} The DOMNode just removed.
   */
  removeChildAt: function (index) {
    var node = this.children()[index];

    if (!node) {
      throw new RangeError("removeChildAt: index is out of bounds.");
    }

    node.$().remove();

    VWO.DOMNodePool.uncacheAll();
    VWO.DOMNodePool.cacheAll();

    return node;
  },

  /**
   * Swaps two children within this node.
   *
   * @param {VWO.DOMNode} nodeA The source node to swap.
   * @param {VWO.DOMNode} nodeB The destination node to swap with.
   * @throws {Error} Throws an error if either of the nodes provided are
   * not the children of this node.
   */
  swapChildren: function (nodeA, nodeB) {
    var indexA = this.children().indexOf(nodeA);
    var indexB = this.children().indexOf(nodeB);

    if (indexA < 0 || indexA > this.children().length) {
      throw new Error("swapChildren: nodeA is not a child of this node.");
    }

    if (indexB < 0 || indexB > this.children().length) {
      throw new Error("swapChildren: nodeB is not a child of this node.");
    }

    this.swapChildrenAt(indexA, indexB);
  },

  /**
   * Swaps two children within this node at the given indices.
   *
   * @param {Number} indexA The index of the source node to swap.
   * @param {Number} indexB The index of the destination node to swap.
   * @throws {RangeError} Throws an error if either indexA or indexB is
   * out of bounds.
   */
  swapChildrenAt: function (indexA, indexB) {
    var nodeA = this.children()[indexA];
    var nodeB = this.children()[indexB];

    if (!nodeA) {
      throw new RangeError("swapChildrenAt: indexA is out of bounds.");
    }

    if (!nodeB) {
      throw new RangeError("swapChildrenAt: indexB is out of bounds.");
    }

    var children = this.children();

    // swap
    children[indexB] = nodeA;
    children[indexA] = nodeB;

    var elA = nodeA.el,
      elB = nodeB.el;

    var elASibling = elA.nextSibling === elB ? elA : elA.nextSibling;
    elB.parentNode.insertBefore(elA, elB);
    elA.parentNode.insertBefore(elB, elASibling);
  },

  equals: function (domNode) {
    if (domNode.nodeName() !== this.nodeName() ||
      !_(domNode.attributes()).isEqual(this.attributes())
      //     || !_(domNode.styles()).isEqual(this.styles())
    ) return false;

    for (var i = 0, il = this.children().length; i < il; i++) {
      if (!domNode.children()[i]) return false;
      if (!domNode.children()[i].equals(this.children()[i])) return false;
    }

    return true;
  },

  isWhitespace: function () {
    return this.isText() && !this.innerText().trim();
  },

  isComment: function () {
    return this.nodeType() === Node.COMMENT_NODE;
  },

  isText: function () {
    return this.nodeType() === Node.TEXT_NODE;
  },

  /**
   * @type VWO.DOMNode
   * @private
   */
  matchedWith: null,

  /**
   * @type Number
   * @private
   */
  matchScore: null,

  /**
   * @type Object
   * @private
   */
  matchDifference: null,

  /**
   * @type Boolean
   * @private
   */
  isInserted: false
};
})();
/*!
The MIT License (MIT)
http://opensource.org/licenses/MIT

Copyright (c) 2014 Wingify Software Pvt. Ltd.
http://wingify.com
*/

var VWO = window.VWO || {};
(function(){
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
    var ignoreA = this.ignoreA;
    var ignoreB = this.ignoreB;


    /*

  * Applying simple n^2 loop for finding partial matches
  * Here, after finding one match point, next match point is found only after the previous match point.
*/

    for (indexInA = 0, countOfStringsInA = stringsInA.length; indexInA < countOfStringsInA; indexInA++) {
      if (matchesInA2[indexInA]) {
        match.from = indexInA;
        match.to = matchesInA2[indexInA];
        match.next = {};
        match.next.prev = match;
        match = match.next;
        continue;
      }
      if (ignoreA.indexOf(indexInA) != -1)
        continue;
      for (indexInB = 0, countOfStringsInB = stringsInB.length; indexInB < countOfStringsInB; indexInB++) {
        if (stringsInA[indexInA] === stringsInB[indexInB]) {
          if (typeof matchesInB1[indexInB] === 'number' || typeof matchesInB2[indexInB] === 'number')
            continue;

          if (ignoreB.indexOf(indexInB) != -1)
            continue;

          /*
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

*/


          var prevMatch = match.prev;

          if (prevMatch) {
            if (prevMatch.to > indexInB)
              continue;
          }


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


    /*

   matchesIn*2 = ignore + exact matches
   matchesIn*1 = partial matches
   merging the matches of matchesInA1 + matchesInA2 = matchesInA in sorted manner

*/

    var matchesInA = {},
      matchesInB = {};

    var i, j;
    for (i = 0, lA = this.couA; i < (lA + 1); i++) {
      if (typeof (matchesInA1[i]) === 'number')
        matchesInA[i] = matchesInA1[i];

      if (typeof (matchesInA2[i]) === 'number')
        matchesInA[i] = matchesInA2[i];

    }

    for (j = 0, lB = this.couB; j < (lB + 1); j++) {

      if (typeof (matchesInB1[j]) === 'number')
        matchesInB[j] = matchesInB1[j];
      if (typeof (matchesInB2[j]) === 'number')
        matchesInB[j] = matchesInB2[j];
    }


    /*

   calculating diffUnion and other things with matchesInA and matchesInB

*/

    var lastMatchIndexInB = -1;

    for (indexInA = 0, countOfStringsInA = stringsInA.length; indexInA < countOfStringsInA; indexInA++) {
      for (indexInB = lastMatchIndexInB + 1, countOfStringsInB = stringsInB.length; typeof matchesInB[indexInB] === 'undefined' && indexInB < countOfStringsInB; indexInB++) {
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
})();
/*!
The MIT License (MIT)
http://opensource.org/licenses/MIT

Copyright (c) 2014 Wingify Software Pvt. Ltd.
http://wingify.com
*/

var VWO = window.VWO || {};
(function(){
var VWO = window.VWOInjected || window.VWO || {};
var jQuery_fn = jQuery.fn;

/**
 * Returns a function that caches the return value of a function
 * on the first call and sends the same value for the subsequent
 * calls.
 *
 * @return {Function} The cached version of the function.
 */
Function.prototype.cache = function () {
  var cachedValue, callee = this, fn = function () {
    if (cachedValue !== undefined) return cachedValue;
    return cachedValue = callee.apply(this, Array.prototype.slice.call(arguments));
  };

  fn.uncache = function () {
    return callee;
  };

  return fn;
};

/**
 * @class
 * @name String
 */

/**
 * Trims any leading and trailing spaces and returns a new string.
 *
 * @return {String} The trimmed string
 */
String.prototype.trim = function () {
  return this.rtrim().ltrim();
};

/**
 * Trims any leading spaces and returns a new string.
 *
 * @return {String} The trimmed string
 */
String.prototype.ltrim = function () {
  return this.replace(/^[ \r\n]*/, '');
};

/**
 * Trims any trailing spaces and returns a new string.
 *
 * @return {String} The trimmed string
 */
String.prototype.rtrim = function () {
  return this.replace(/[ \n\r]*$/, '');
};

/**
 * Finds the nth index of a needle in a haystack.
 *
 * @param  {String} needle The string to search for.
 * @param  {Number} index  Index where to begin the search
 * @return {Number}        The nth index of the string.
 */
String.prototype.nthIndexOf = function (needle, index) {
  var pos = this.indexOf(needle, 0);
  while (index-- > 0 && pos !== -1) {
    pos = this.indexOf(needle, pos + 1);
  }
  return pos;
};

var STR_PAD_LEFT = 1;
var STR_PAD_RIGHT = 2;
var STR_PAD_BOTH = 3;

String.prototype.lpad = function (len, pad) {
  return this.pad(len, pad, STR_PAD_LEFT);
};

String.prototype.rpad = function (len, pad) {
  return this.pad(len, pad, STR_PAD_RIGHT);
};

String.prototype.pad = function pad(len, pad, dir) {
  var str = this;

  if (typeof(len) == "undefined") { len = 0; }
  if (typeof(pad) == "undefined") { pad = ' '; }
  if (typeof(dir) == "undefined") { dir = STR_PAD_RIGHT; }

  if (len + 1 >= str.length) {
    switch (dir) {
      case STR_PAD_LEFT:
        str = new Array(len + 1 - str.length).join(pad) + str;
        break;

      case STR_PAD_BOTH:
        var padlen = len - str.length;
        var right = Math.ceil(padlen / 2);
        var left = padlen - right;
        str = new Array(left+1).join(pad) + str + new Array(right+1).join(pad);
        break;

      default:
        str = str + new Array(len + 1 - str.length).join(pad);
        break;
    }
  }
  return str;
};

/**
 * @class
 * @name Number
 */

/**
 * Makes sure the number is within a specified range. If not, it
 * returns the upper or lower limit of that range.
 *
 * @param {Number} [min] The lower limit of the range to clamp in.
 * @param {Number} [max] The upper limit of the range to clamp in.
 * @return {Number}
 */
Number.prototype.clamp = function (min, max) {
  if (typeof min !== 'number') min = -Infinity;
  if (typeof max !== 'number') max = Infinity;
  return Math.max(min, Math.min(max, this));
};

/**
 * Checks if the number is within a range.
 *
 * @param {Number} min The lower limit of the range.
 * @param {Number} max The upper limit of the range.
 * @return {Boolean}
 */
Number.prototype.isWithinRange = function (min, max) {
  return this > min && this < max;
};

/**
 * The nodeName of this element.
 *
 * @memberOf jQuery_fn
 * @return {String} The node name.
 */
jQuery_fn.nodeName = function () {
  var USE_LOWERCASE = false;

  var el = this.get(0);
  if (!el) return null;

  if (USE_LOWERCASE)
    return el.nodeName && el.nodeName.toLowerCase();
  else
    return el.nodeName && el.nodeName.toUpperCase();
};

/**
 * The unique selector path of an element. The selector path is a combination
 * of > and + CSS operators to determine a path that is unique only to that
 * element.
 *
 * Each tag in the selector path is in uppercase, and the IDs on them
 * are as they appear in the DOM. Each tag starts with a BODY. Each tag after
 * a > sign has a :first-child pseudo selector added to it.
 *
 * @example BODY > DIV:first-child + DIV + P > UL:first-child > LI:first-child
 * @example BODY > P:first-child + P + P > STRONG:first-child + A
 *
 * @memberOf jQuery_fn
 * @return {String} The selector path thus computed
 */
jQuery_fn.selectorPath = function () {
  if (!this.length) return '';

  if (this.nodeName().match(/^(body|head)$/i)) {
    return this.nodeName();
  }

  // for text nodes return a blank selector path
  if (this.get(0).nodeType !== Node.ELEMENT_NODE) {
    return '';
  }

  var currentPath = this.nodeName();

  // for elements with xmlns in their tag names, fall back to *
  if(currentPath.match(/^((?:[\w\u00c0-\uFFFF\*\-]|\\.)+)/)[0] !== currentPath) {
    currentPath = "*";
  }

  if (this.attr('id')) {
    // try getting id using attr and getAttribute
    // fix for a form having an input tag with name=id
    var id = this.attr('id');

    if (typeof id !== 'string') {
      id = this.get(0).getAttribute(id);
    }

    // append the id to the currentPath only if one or no
    // elements in the DOM exist with that id
    if (typeof id === 'string' && $(currentPath + '#' + id).length <= 1) {
      // escape the id first for edge case where id contains a . or a :
      // @see http://bit.ly/Uc9Az0
      id = id.replace(/(:|\.)/g,'\\$1');
      currentPath += "#" + id;
    }
  }

  if (this.prev().length) {
    return this.prev().selectorPath() + " + " + currentPath;
  }

  if (this.parent().length) {
    return this.parent().selectorPath() + " > " + currentPath + ":first-child";
  }

  return currentPath;
};

/**
 * Checks whether an element exists in the DOM or not by checking
 * if any of the parents of this node is an <html> node.
 *
 * @memberOf jQuery_fn
 * @return {Boolean} A boolean indicating whether this element is present
 * in the DOM or not.
 */
jQuery_fn.existsInDOM = function () {
  return this.parents('html').length > 0;
};

/**
 * Checks whether this object is an ancestor of the element provided in
 * the parameter.
 *
 * @param {jQuery} el The element to compare with
 * @return {Boolean} True if this object is an ancestor of the element.
 */
jQuery_fn.isAncestorOf = function(el) {
  return $(el).parents().is(this);
};

/**
 * Checks whether this object is a descendant of the element provided in
 * the parameter.
 *
 * @param {jQuery} el The element to compare with.
 * @return {Boolean} True if this object is an ancestor of the element.
 */
jQuery_fn.isDescendantOf = function(el) {
  return $(el).isAncestorOf(this);
};

/**
 * Gets the concatenated outer html of all the elements in this list.
 *
 * @return {String} The outer html.
 */
jQuery_fn.outerHTML = function () {
  var $t = $(this), content;
  if ($t[0] && 'outerHTML' in $t[0]) {
    content = '';
    $t.each(function (i) {
      content += this.outerHTML;
    });
    return content;
  } else {
    content = $t.wrap('<div></div>').parent().html();
    $t.unwrap();
    return content;
  }
};

})();