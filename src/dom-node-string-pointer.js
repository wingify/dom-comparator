var $ = window.vwo_$ || window.$;
var _ = window.vwo__ || window._;
var VWO = window.VWOInjected || window.VWO;

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
    var i = this.index, haystack = this.haystack;
    if (haystack.lastIndexOf('<!--', i) > haystack.lastIndexOf('-->', i) || haystack.substr(i, 3) === '-->') {
      return VWO.Utils.NodeTypes.COMMENT_NODE;
    }
    if (haystack.lastIndexOf('<![CDATA[', i) > haystack.lastIndexOf(']]>', i) || haystack.substr(i, 3) === ']]>') {
      return VWO.Utils.NodeTypes.CDATA_SECTION_NODE;
    }
    if (haystack.lastIndexOf('<', i) > haystack.lastIndexOf('>', i) || haystack.charAt(i) === '>') {
      return VWO.Utils.NodeTypes.ELEMENT_NODE;
    }
    return VWO.Utils.NodeTypes.TEXT_NODE;
  },

  /**
   * Gets the node name at the index the pointer is pointing to
   * in the haystack.
   *
   * @return {String} The node name.
   */
  nodeName: function () {
    var i = this.index, haystack = this.haystack;
    var nodeType = this.nodeType();

    if (nodeType === VWO.Utils.NodeTypes.ELEMENT_NODE) {
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
    if (this.nodeType() !== VWO.Utils.NodeTypes.ELEMENT_NODE) return false;

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
    var i = this.index, haystack = this.haystack;
    var nodeType = this.nodeType();
    var j;
    var pointer;
    if (nodeType === VWO.Utils.NodeTypes.TEXT_NODE) {
      j = haystack.lastIndexOf('>', i);
      pointer = this._pointerWithIndex(j);
    }
    else if (nodeType === VWO.Utils.NodeTypes.COMMENT_NODE) {
      j = haystack.lastIndexOf('<!--', i);
      pointer = this._pointerWithIndex(j - 1);
    }
    else if (nodeType === VWO.Utils.NodeTypes.CDATA_SECTION_NODE) {
      j = haystack.lastIndexOf('<![CDATA[', i);
      pointer = this._pointerWithIndex(j - 1);
    }
    else {
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
    var i = this.index, haystack = this.haystack;
    var nodeType = this.nodeType();
    var nodeName = this.nodeName();
    var j;
    var pointer;

    if (nodeType === VWO.Utils.NodeTypes.TEXT_NODE) {
      j = haystack.lastIndexOf('>', i);
      pointer = this._pointerWithIndex(j);
    }
    else if (nodeType === VWO.Utils.NodeTypes.COMMENT_NODE) {
      j = haystack.lastIndexOf('<!--', i);
      pointer = this._pointerWithIndex(j - 1);
    }
    else if (nodeType === VWO.Utils.NodeTypes.CDATA_SECTION_NODE) {
      j = haystack.lastIndexOf('<![CDATA[', i);
      pointer = this._pointerWithIndex(j - 1);
    }
    else {
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
    if (pointer.nodeType() === VWO.Utils.NodeTypes.ELEMENT_NODE && !pointer.pointsToEmptyTag()) {
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
    var i = this.index, haystack = this.haystack;
    var nodeType = this.nodeType();
    var j;
    var pointer;
    if (nodeType === VWO.Utils.NodeTypes.TEXT_NODE) {
      j = haystack.indexOf('<', i);
      pointer = this._pointerWithIndex(j);
    }
    else if (nodeType === VWO.Utils.NodeTypes.COMMENT_NODE) {
      j = haystack.indexOf('-->', i);
      if (j === -1) return null;
      pointer = this._pointerWithIndex(j + 3);
    }
    else if (nodeType === VWO.Utils.NodeTypes.CDATA_SECTION_NODE) {
      j = haystack.indexOf(']]>', i);
      if (j === -1) return null;
      pointer = this._pointerWithIndex(j + 3);
    }
    else {
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
    var i = this.index, haystack = this.haystack;
    var nodeType = this.nodeType();
    var nodeName = this.nodeName();
    var j;
    var pointer;

    if (nodeType === VWO.Utils.NodeTypes.TEXT_NODE) {
      j = haystack.indexOf('<', i);
      pointer = this._pointerWithIndex(j);
    }
    else if (nodeType === VWO.Utils.NodeTypes.COMMENT_NODE) {
      j = haystack.indexOf('-->', i);
      if (j === -1) return null;
      pointer = this._pointerWithIndex(j + 3);
    }
    else if (nodeType === VWO.Utils.NodeTypes.CDATA_SECTION_NODE) {
      j = haystack.indexOf(']]>', i);
      if (j === -1) return null;
      pointer = this._pointerWithIndex(j + 3);
    }
    else {
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
    if (pointer.nodeType() === VWO.Utils.NodeTypes.ELEMENT_NODE && (pointer.pointsToEmptyTag() ||
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
    var i = this.index, haystack = this.haystack;
    var nodeType = this.nodeType();
    var nodeName = this.nodeName();
    var j;
    var prev = this.previousSiblingPointer();
    if (prev) {
      return prev.parentPointer();
    }
    var pointer;

    if (nodeType === VWO.Utils.NodeTypes.TEXT_NODE) {
      j = haystack.lastIndexOf('>', i);
      pointer = this._pointerWithIndex(j);
    }
    else if (nodeType === VWO.Utils.NodeTypes.COMMENT_NODE) {
      j = haystack.lastIndexOf('<!--', i);
      pointer = this._pointerWithIndex(j - 1);
    }
    else if (nodeType === VWO.Utils.NodeTypes.CDATA_SECTION_NODE) {
      j = haystack.lastIndexOf('<![CDATA[', i);
      pointer = this._pointerWithIndex(j - 1);
    }
    else {
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
