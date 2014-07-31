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