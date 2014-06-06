var VWO = window.VWOInjected || window.VWO || {};

VWO.FunctionUtils = {
	cache: function cache(fn) {
		var _cache = {};
		function cached() {
			cached.isCached = true;
			var args = Array.prototype.apply(null, arguments);
			/* jshint -W040 */ // no strict mode violation here, its needed
			return _cache[args] || (_cache[args] = fn.apply(this, [].slice.apply(arguments)));
		}
		cached.fn = fn;
		cached.uncache = function () {
			_cache = {};
		};
		return cached;
	};
}
