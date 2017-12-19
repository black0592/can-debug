var warned = false;

module.exports = function proxyNamescape(namespace) {
	return new Proxy(namespace, {
		get: function get(target, name) {
			if (!warned) {
				console.warn("Warning: use of 'can' global should be for debugging purposes only.");
				warned = true;
			}
			return target[name];
		}
	});
};
