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

    for (var i in fn) if (fn.hasOwnProperty(i)) {
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

    for (var i in fn) if (fn.hasOwnProperty(i) && typeof this[fn[i]].uncache === 'function') {
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

    var el = this.el, attributes = {};

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

    var el = this.el, stylesHash = {};

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
    var el = this.el, children = [];

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

    var elA = nodeA.el, elB = nodeB.el;

    var elASibling = elA.nextSibling === elB ? elA : elA.nextSibling;
    elB.parentNode.insertBefore(elA, elB);
    elA.parentNode.insertBefore(elB, elASibling);
  },

  equals: function (domNode) {
    if (domNode.nodeName() !== this.nodeName() ||
      !_(domNode.attributes()).isEqual(this.attributes()) ||
      !_(domNode.styles()).isEqual(this.styles())) return false;

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
