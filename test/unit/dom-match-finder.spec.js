describe('module: DOMNode-Comparator', function () {
	describe('method: nodeName', function () {
		it('Case1 : compares how closely doms are related', function () {
			var domNode = VWO.DOMMatchFinder.create({
			nodeA: VWO.DOMNode.create({el:$('<div class="chapter">\n<h2>Tutorial</h2>\n<div class="a">\n</div>\n</div>\n').get(0)}), 
			nodeB: VWO.DOMNode.create({el:$('<div class="chapter">\n<h2>Tutorial311</h2>\n<div class="b">\n</div>\n</div>\n').get(0)})
			});

		//expect(domNode.compare().matches).toEqual('') ; 

		});
	});

	
	describe('method: nodeName', function () {
		it('case2 : compares how closely doms are related', function () {
			var domNode = VWO.DOMMatchFinder.create({

		nodeA: VWO.DOMNode.create({el:$('<div class="ta"><a href="vw.com" style="color:blue">Learn</a><a href="google"></a></div>').get(0)}),												    		
		nodeB: VWO.DOMNode.create({el:$('<div class="ta-c"><a href="vwo.com" style="color:red">Learn</a><h2>Himanshu</h2></div>').get(0)})												    		

		});

	//		expect(domNode.compare().matches).toEqual('') ; 

		});
	});


	describe('method: nodeName', function () {
		it('case3 : compares how closely doms are related', function () {
			var domNode = VWO.DOMMatchFinder.create({

		nodeA: VWO.DOMNode.create({el:$('<a href="da" class="tab" data-b="ylt" id="tab"><span class="world"><b class="wc">World</b><span class="n">Next up</span><span class="n">Costa Rica</span><img src="hi" class="team-icon"><span class="vs">v</span><img src="Hi" alt="" class="team-icon"><span class="name">Eng</span></span></a>').get(0)}), 						

		nodeB: VWO.DOMNode.create({el:$('<a href="da" class="tab" data-b="ylt" id="tab"><span class="world"><b class="wc">World</b><span class="n">Next up</span><span class="n">Costa Rica</span><img src="hi" class="team-icon"><span class="vs">v</span><img src="Hi" alt="" class="team-icon"><span class="name">Eng</span></span></a>').get(0)}) 						

		});
			// one letter word problem ....  letter 'v' was not considered ..... 
			// Code added to dom-match-finder 
			//expect(domNode.compare().matches).toEqual('') ; 

		/*	output 
0 : '0', 0:0 : '0:0', 0:0:0 : '0:0:0', 0:0:0:0 : '0:0:0:0', 0:0:1 : '0:0:1', 0:0:1:0 : '0:0:1:0', 0:0:2 : '0:0:2', 0:0:2:0 : '0:0:2:0', 0:0:3 : '0:0:3', 0:0:4 : '0:0:4', 0:0:4:0 : '0:0:4:0', 0:0:5 : '0:0:5', 0:0:6 : '0:0:6', 0:0:6:0 : '0:0:6:0
		*/ 


		});
	});


})
