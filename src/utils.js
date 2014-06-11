var VWO = window.VWOInjected || window.VWO || {};
var jQuery_fn = jQuery.fn;

VWO.FunctionUtils = {
	cache: function cache(fn) {
		var _cache = {};
		function cached() {
			cached.isCached = true;
			var args = [].slice.apply(arguments);
			/* jshint -W040 */ // no strict mode violation here, its needed
			return _cache[args] || (_cache[args] = fn.apply(this, args));
		}
		cached.fn = fn;
		cached.uncache = function () {
			_cache = {};
		};
		return cached;
	}
}

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
  if (this.get(0).nodeType !== VWO.Utils.NodeTypes.ELEMENT_NODE) {
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
  if ('outerHTML' in $t[0]) {
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