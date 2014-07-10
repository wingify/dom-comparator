describe('module: DOMNode', function () {
	describe('method: nodeName', function () {
		it('gets the name of the node', function () {
			var domNode = VWO.DOMNode.create({
el: $('<div class="a" style=color:blue> <div class="b" style=color:red><span>span</span><ul><li>item 1</li><li>item 2</li></ul> <a href="about.com/">Design</a> <p style=color:red></p></div> <div class="c"></div></div>').get(0)
			});

			expect(domNode.nodeName()).toBe('DIV');
			expect(domNode.nodeType()).toBe(Node.ELEMENT_NODE); 
			//expect(domNode.innerText()).toBe('span content item 1item 2'); 
			//expect(domNode.innerHTML()).toBe('<span>span content </span><ul><li style="color:red">item 1</li><li>item 2</li></ul>'); 
			//expect(domNode.outerHTML()).toBe('<div><span>span content </span><ul><li style="color:red">item 1</li><li>item 2</li></ul></div>'); 

		 	expect(domNode.attributes()).toEqual({ class : 'a' });
		 	expect(domNode.styles()).toEqual({ color : 'blue' });
		 	expect(domNode.children().length).toEqual(2); // Gives all the nodes 
			var domNode1 = domNode.children()[0] ;

		 	expect(domNode1.nextSibling().outerHTML()).toEqual('<div class="c"></div>');
		 	expect(domNode1.ancestors().length).toEqual(1);
		 expect(domNode1.ancestors()[0].outerHTML()).toEqual('<div class="a" style="color:blue"> <div class="b" style="color:red"><span>span</span><ul><li>item 1</li><li>item 2</li></ul> <a href="about.com/">Design</a> <p style="color:red"></p></div> <div class="c"></div></div>');
		 	
		 	expect(domNode1.nextElementSibling().outerHTML()).toEqual('<div class="c"></div>');
			expect(domNode1.masterIndex()).toBe('0:0');
			expect(domNode1.selectorPath()).toBe('DIV > DIV:first-child');
			domNode1 = domNode1.children()[0] ;
			expect(domNode1.selectorPath()).toBe('DIV > DIV:first-child > SPAN:first-child');

			// Node added 
			domNode.addChild(VWO.DOMNode.create({el:$('<div class="d"></div>').get(0)}));
			//expect(domNode.outerHTML()).toBe()
			domNode.removeChildAt(2);
		 	//expect(domNode.outerHTML()).toBe()
			domNode.addChild(VWO.DOMNode.create({el:$('<div class="d"></div>').get(0)}));
			domNode.swapChildrenAt(0,2);
		 	//expect(domNode.outerHTML()).toBe()
	
		});
	});

	describe('method: Master Index', function () {
		it('gets the name of the node', function () {
			var domNode = VWO.DOMNode.create({
			el: $('<div class="chapter"><h2>Tutorial</h2> <div> Himanshu </div> </div>    <div class="a">HI</div>').get(0)
			});

			expect(domNode.children().length).toBe(2);
			expect(domNode.children()[0].outerHTML()).toBe('<h2>Tutorial</h2>');
			expect(domNode.nextSibling().outerHTML()).toBe('<div class="a">HI</div>') ; 
		  // 	expect(domNode.children()[0].ancestors()[0].outerHTML()).toBe('<div class="chapter"><h2>Tutorial</h2></div>'); 
			expect(domNode.masterIndex()).toBe('0') ; 
			expect(domNode.children()[0].masterIndex()).toBe('0:0') ; 
			expect(domNode.children()[1].masterIndex()).toBe('0:1') ; 

		});
	});

	describe('method: Master Index', function () {
		it('Master index details', function () {
			var domNode = VWO.DOMNode.create({
			el: $('<div class="chapter"> <h2>Tutorial</h2> <div class="a"></div>  </div>').get(0)
			});

			expect(domNode.children().length).toBe(2);
			expect(domNode.children()[0].masterIndex()).toBe('0:0') ; 
			expect(domNode.children()[1].masterIndex()).toBe('0:1') ; 

		});
	});

	describe('method: Master Index', function () {
		it('gets the details of the master index', function () {
			var domNode = VWO.DOMNode.create({
			el: $('<div class="chapter">\n<h2>Tutorial</h2>\n<div class="a">\n</div>\n</div>\n').get(0)
			});

			expect(domNode.children().length).toBe(2);
			expect(domNode.children()[0].masterIndex()).toBe('0:0') ; 
			expect(domNode.children()[1].masterIndex()).toBe('0:1') ; 

		});
	});


	describe('method: Children', function () {
		it('Children details', function () {
			var domNode = VWO.DOMNode.create({
			el: $('<ul><p>IT1</p><li>IT12</li></ul>').get(0)
			});

			expect(domNode.children().length).toBe(2);
			expect(domNode.children()[0].outerHTML()).toBe('<p>IT1</p>');
			expect(domNode.children()[1].outerHTML()).toBe('<li>IT12</li>');


		});
	});


})
