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
