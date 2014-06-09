var VWO = window.VWOInjected || window.VWO || {};

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
