describe('module: DOMNode-Comparator', function () {
	describe('method: nodeName', function () {
		it('compares how closely doms are related', function () {
			var domNode = VWO.DOMMatchFinder.create({
			nodeA: VWO.DOMNode.create({el:$('<div class="chapter"><h2>Tutorial</h2><div class="a"></div></div>').get(0)}), 
			nodeB: VWO.DOMNode.create({el:$('<div class="chapter"><h2>Tutorial311</h2><div class="b"></div></div>').get(0)})
			});

//		expect(domNode.compare().matches).toEqual('') ; 


		});
	});
})
