describe('module: DOMNode', function () {
	describe('method: nodeName', function () {
		it('gets the name of the node', function () {
			var domNode = VWO.DOMNode.create({
				el: $('<div><span>span content</span><ul><li>item 1</li><li>item 2</li></ul></div>').get(0)
			});

			expect(domNode.nodeName()).toBe('DIV');
		});
	});
})