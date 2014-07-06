var $ = window.vwo_$ || window.$;
var _ = window.vwo__ || window._;
var VWO = window.VWOInjected || window.VWO;

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

  // store nodes after wrapping them in a wrapper node.
  this.nodeA = VWO.DOMNodePool.create({
    el: $("<div id='DOMComparisonResult'>" + $(this.elA).outerHTML() + "</div>").get(0)
  });
  this.nodeB = VWO.DOMNodePool.create({
    el: $("<div id='DOMComparisonResult'>" + $(this.elB).outerHTML() + "</div>").get(0)
  });
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

    for (var i in matches) if (matches.hasOwnProperty(i)) {
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
   * @return {VWO.OperationInfo[][]} A list of inital and final states
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
        adjacentNode.parent().addChildAt(insertedNode, adjacentNode.index());

      } else {
        adjacentNode = node.parent().matchedWith;
        adjacentNode.addChild(insertedNode);
      }

      var parentSelectorPath = insertedNode.parent().selectorPath();
      var indexInParent = insertedNode.index();

      // set a flag on the node
      insertedNode.isInserted = true;

      finalOperationsList.push(VWO.OperationInfo.create({
        name: VWO.Locale.OperationNames.INSERT_NODE,
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
   * @return {VWO.OperationInfo[][]} A list of inital and final states
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
      if (node.nodeType() !== VWO.Utils.NodeTypes.ELEMENT_NODE && matchDifference.newInnerText) { // insert new text and comment nodes
        var parentSelectorPath = node.parent().selectorPath();
        var indexInParent = node.index();

        finalOperationsList.push(VWO.OperationInfo.create({
          name: 'change' + (node.nodeType() === VWO.Utils.NodeTypes.TEXT_NODE ? 'Text' : 'Comment'),
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
   * @return {VWO.OperationInfo[][]} A list of inital and final states
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

      if (_(attr).keys().length) {
        oldattr = {};
        _(attr).each(function (attr, key) {
          oldattr[key] = node.$().attr(key);
        });

        node.$().attr(attr);
        finalOperationsList.push(VWO.OperationInfo.create({
          name: 'attr',
          selectorPath: node.selectorPath(),
          content: attr
        }));
      }

      var removedAttr = matchDifference.removedAttributes;
      if (_(removedAttr).keys().length) {
        oldattr = {};
        _(removedAttr).each(function (attr, key) {
          oldattr[key] = node.$().attr(key);
          node.$().removeAttr(key);
        });

        finalOperationsList.push(VWO.OperationInfo.create({
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
   * @return {VWO.OperationInfo[][]} A list of inital and final states
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
        finalOperationsList.push(VWO.OperationInfo.create({
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
        finalOperationsList.push(VWO.OperationInfo.create({
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
   * @return {VWO.OperationInfo[][]} A list of inital and final states
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

      finalOperationsList.push(VWO.OperationInfo.create({
        name: VWO.Locale.OperationNames.REARRANGE,
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
    });

    return finalOperationsList;
  },

  /**
   * For all nodes in the initial tree that do not have a match in the
   * final tree, a remove is detected.
   *
   * @return {VWO.OperationInfo[][]} A list of inital and final states
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

      finalOperationsList.push(VWO.OperationInfo.create({
        name: VWO.Locale.OperationNames.DELETE_NODE,
        // a remove operation cannot have a selector path,
        // a text node could also be removed
        selectorPath: null,
        content: {
          parentSelectorPath: parentSelectorPath,
          indexInParent: indexInParent,
          existsInDOM: false
        }
      }));
    });

    return finalOperationsList;
  },

  /**
   * Finally, verify if the comparison was successful.
   * (A console.log message is sent.)
   */
  verifyComparison: function () {
    console.log('comparison successful: ' + this.nodeA.equals(this.nodeB));
  },

  /**
   * Assuming the two nodes are set, begin the comparison.
   *
   * @return {VWO.OperationInfo[][]} A list of inital and final states
   *                                 of the operations performed.
   */
  compare: function () {
    this.analyzeMatches();

    var result = [
      this.detectInserts(),
      this.detectTextNodeChanges(),
      this.detectAttributeChanges(),
      this.detectStyleChanges(),
      this.detectRemoves(),
      this.detectRearranges()
    ];

    result = _(result).flatten();

    this.verifyComparison();

    console.log(result);

    return result;
  }
};