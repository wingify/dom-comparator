describe('module: DOMNode-Comparator', function () {
		describe('method: Compare', function () {
			it('case 1:compares the dom trees and outputs the final result', function () {
				var domNode = VWO.DOMComparator.create({
nodeA: VWO.DOMNode.create({el:$('<div class="chapter">\n<h2>Tutorial</h2>\n<div class="a" style=color:red>\n</div>\n</div>\n').get(0)}), 
nodeB: VWO.DOMNode.create({el:$('<div class="chapter">\n<h2>Tutorial311</h2>\n<div class="b style=color:blue">\n</div>\n</div>\n').get(0)})
		});

				// Suggested changes are the steps need to be followded to go for nodeA to nodeB .. ... 
				expect(domNode.compare().length).toBe(4) ;
				//expect(domNode.compare()).toBe('') ;

		});
	});

		describe('method: Compare', function () {
			it('case2 : compares the dom trees and outputs the final result', function () {
		var domNode = VWO.DOMComparator.create({
nodeA: VWO.DOMNode.create({el:$('<li class="testing fl "><div class="title" style="color:red">Testing</div><div class="text">Himanshu</div><h2>Hello</h2></li> ').get(0)}), 
nodeB: VWO.DOMNode.create({el:$('<li class="testing fl "><div class="title" style="color:blue">Testing</div><div class="text">Himanshu</div><h2>Hello guys</h2></li>').get(0)})
		});
				
		//		expect(domNode.compare()).toBe(1) ; // css-> color:blue change ...  

// { name : 'insertNode', selectorPath : null, content : { html : 'Hello guys', parentSelectorPath : 'DIV#DOMComparisonResult > LI:first-child > DIV:first-child + DIV + H2', indexInParent : 1, existsInDOM : true } }, { name : 'css', selectorPath : 'DIV#DOMComparisonResult > LI:first-child > DIV:first-child', content : { color : 'blue' } }, { name : 'deleteNode', selectorPath : null, content : { parentSelectorPath : 'DIV#DOMComparisonResult > LI:first-child > DIV:first-child + DIV + H2', indexInParent : 0, existsInDOM : false 

		 // Ok works fine .....  

		});
	});

		describe('method: Compare', function () {
			it('case2 : compares the dom trees and outputs the final result', function () {
		var domNode = VWO.DOMComparator.create({
		
		nodeA: VWO.DOMNode.create({el:$('<ul><li><a href="item1">IT1</a></li><li><a href="item2">IT2</a></li><li class="c"><a href="item3">IT3</a></li><li><a class="d" href="item4">IT4</a></li></ul>').get(0)}),
	
		nodeB: VWO.DOMNode.create({el:$('<ul><li><a href="item">IT1</a></li><li><a href="item2">IT2</a></li><li class="c"><a href="item3">IT</a></li><li><a class="e" href="item4">IT4</a></li></ul>').get(0)})
												    
		});
				
	//		expect(domNode.compare()).toBe() ; 
		
		// Output is ---> 
// { name : 'insertNode', selectorPath : null, content : { html : 'IT', parentSelectorPath : 'DIV#DOMComparisonResult > UL:first-child > LI:first-child + LI + LI > A:first-child', indexInParent : 1, existsInDOM : true } }, { name : 'attr', selectorPath : 'DIV#DOMComparisonResult > UL:first-child > LI:first-child > A:first-child', content : { href : 'item' } }, { name : 'attr', selectorPath : 'DIV#DOMComparisonResult > UL:first-child > LI:first-child + LI + LI + LI > A:first-child', content : { class : 'e' } }, { name : 'deleteNode', selectorPath : null, content : { parentSelectorPath : 'DIV#DOMComparisonResult > UL:first-child > LI:first-child + LI + LI > A:first-child', indexInParent : 0, existsInDOM : false } }
		

		// Checked for - 1. attr(class,href) 2. style 3. html content 4. Rearrangment 5. Exactly same  
		// Works fine 

		});
	});


		describe('method: Compare', function () {
			it('case3 : compares the dom trees and outputs the final result', function () {
		var domNode = VWO.DOMComparator.create({
		
		nodeA: VWO.DOMNode.create({el:$('<ul><li><a href="item1">IT1</a></li><li><a href="item2">IT2</a></li><li class="c"><a href="item3">IT3</a></li><li><a class="d" href="item4">IT4</a></li></ul>').get(0)}),
												    
		nodeB: VWO.DOMNode.create({el:$('<ul><li><a href="item1">IT1</a></li><li></li><li class="c"><a href="item3">IT3</a></li><li><a href="item4">IT4</a></li></ul>').get(0)})
		});
				
			//expect(domNode.compare()).toBe('') ; 

			// Output is --> 
			// [ { name : 'removeAttr', selectorPath : 'DIV#DOMComparisonResult > UL:first-child > LI:first-child + LI + LI + LI > A:first-child', content : { class : 'd' } }, { name : 'deleteNode', selectorPath : null, content : { parentSelectorPath : 'DIV#DOMComparisonResult > UL:first-child > LI:first-child + LI', indexInParent : 0, existsInDOM : false } } ]

			// checked for -->  1. removeattr 2. deleteNode 
			// Works fine 

		});
	});


		describe('method: Compare', function () {
			it('case4 : compares the dom trees and outputs the final result', function () {
		var domNode = VWO.DOMComparator.create({
		
		nodeA: VWO.DOMNode.create({el:$('<section class="section" style="color:red"><div class="container"><div class="main-heading"><h2 class="vwo_1403262964840">The</h2><div class="tagline">optimization</div></div></div><a href="google.com"></a></section>').get(0)}),												    		
		nodeB: VWO.DOMNode.create({el:$('<section class="section" style="color:blue"><div class="container12"><div class="main-heading"><h2 class="vwo_1403262964840">The</h2><div class="tagline">optimization</div></div></div><a href="google.com"></a></section>').get(0)})		
		
		});
				
	// 		expect(domNode.compare()).toBe('') ; 

			// checked for 1. insertNode 2. css 3. removecss  
			// Works fine 
		});
	});

		describe('method: Compare', function () {
			it('case5 : compares the dom trees and outputs the final result', function () {
		var domNode = VWO.DOMComparator.create({
		
		nodeA: VWO.DOMNode.create({el:$('<section class="a" style="color:blue"><div class="b"><div class="c"><h2 class="d">The</h2></div></div></a></section>').get(0)}),												    		
		
		nodeB: VWO.DOMNode.create({el:$('<section class="a1" style="color:red"><div class="b"><div class="c"><h2 class="d">The</h2></div></div></a></section>').get(0)})

		});
				
			//expect(domNode.compare()).toBe('') ; 
			// 1. Attr 2. css   3.inserNode  
			// Works fine 

		});
	});

		describe('method: Compare', function () {
			it('case6 : compares the dom trees and outputs the final result', function () {
		var domNode = VWO.DOMComparator.create({
		
		nodeA: VWO.DOMNode.create({el:$('<ul><li><a href="/about">Our Team</a></li><li><a href="/lab" style="color:red">Labs</a></li><li><a href="/careers">Careers</a></li><li class="trigger-contact"><a href="/contact" class="">Contact</a></li></ul>').get(0)}),												    		
		
		nodeB: VWO.DOMNode.create({el:$('<ul><li><a href="/about">Our Team</a></li><li><a href="/labs">Labs</a></li><li><a href="/careers">Careers</a></li><li class="trigger-contact"><a href="/contact" class="">Contact Us</a></li></ul>').get(0)})										    		
		});
		        		
//			expect(domNode.compare()).toBe('') ; 

		});
	});

		describe('method: Compare', function () {
			it('case7 : compares the dom trees and outputs the final result', function () {
		var domNode = VWO.DOMComparator.create({
		
		nodeA: VWO.DOMNode.create({el:$('<ul><li><a href="/hello">Hello</a></li><li><a href="/about">Our</a></li><li><a href="/lab">Labs</a></li><li><a href="/careers">Careers</a></li></ul>').get(0)}),												    		
		
		nodeB: VWO.DOMNode.create({el:$('<ul><li><a href="/about">Our Team</a></li><li><a href="/lab">Labs</a></li><li><a href="/careers">Careers</a></li><li><a href="/hello">Hello</a></li></ul>').get(0)}) 											    		
		});
		        		
	//		expect(domNode.compare()).toBe('') ; 
			
		// Output -> 
			// { name : 'insertNode', selectorPath : null, content : { html : 'Our Team', parentSelectorPath : 'DIV#DOMComparisonResult > UL:first-child > LI:first-child + LI > A:first-child', indexInParent : 1, existsInDOM : true } }, { name : 'insertNode', selectorPath : null, content : { html : '<li><a href="/hello">Hello</a></li>', parentSelectorPath : 'DIV#DOMComparisonResult > UL:first-child', indexInParent : 4, existsInDOM : true } }, { name : 'deleteNode', selectorPath : null, content : { parentSelectorPath : 'DIV#DOMComparisonResult > UL:first-child', indexInParent : 0, existsInDOM : false } }, { name : 'deleteNode', selectorPath : null, content : { parentSelectorPath : 'DIV#DOMComparisonResult > UL:first-child > LI:first-child > A:first-child', indexInParent : 0, existsInDOM : false } }


		});
	});

		describe('method: Compare', function () {
			it('case8 : compares the dom trees and outputs the final result', function () {
		var domNode = VWO.DOMComparator.create({
		
		nodeA: VWO.DOMNode.create({el:$('<div class="a"></div>').get(0)}),												    		
		nodeB: VWO.DOMNode.create({el:$('<div class="ta-c"><a href="vwo.com" style="color:red">Learn</a><h2>Himanshu</h2></div>').get(0)})												    		
		});

		// 	expect(domNode.compare()).toBe('') ; 

	//	Output --> 
			// { name : 'insertNode', selectorPath : null, content : { html : '<a href="vwo.com" style="color:red">Learn</a>', parentSelectorPath : 'DIV#DOMComparisonResult > DIV:first-child', indexInParent : 0, existsInDOM : true } }, { name : 'insertNode', selectorPath : null, content : { html : '<h2>Himanshu</h2>', parentSelectorPath : 'DIV#DOMComparisonResult > DIV:first-child', indexInParent : 1, existsInDOM : true } }, { name : 'attr', selectorPath : 'DIV#DOMComparisonResult > DIV:first-child', content : { class : 'ta-c' } }

		});
	});


		describe('method: Compare', function () {
			it('case9 : compares the dom trees and outputs the final result', function () {
		var domNode = VWO.DOMComparator.create({
			
		nodeA: VWO.DOMNode.create({el:$('<div id="sub_menu_campuslife" style="display: block;"><ul><li><a onfocus="if(this.blur)this.blur()" id="sub" href="http://iiit.ac.in/content/students_attendance">Student Attendance</a></li><li><a onfocus="if(this.blur)this.blur()" id="sub" href="http://iiit.ac.in/studentscorner/campus-life">Campus Life</a></li><!--li><a  onfocus="if(this.blur)this.blur()" id=sub href="http://iiit.ac.in/studentscorner/students" >Students</a></li--><li><a onfocus="if(this.blur)this.blur()" id="sub" href="http://iiit.ac.in/studentscorner/clubs">Clubs</a></li></ul></div>').get(0)}),							

		nodeB: VWO.DOMNode.create({el:$('<div id="sub_menu_campuslife" style="display: block;"><ul><li><a onfocus="if(this.blur)this.blur()" id="sub" href="http://iiit.ac.in/content/students_attendance">Student Attendance</a></li><li><a onfocus="if(this.blur)this.blur()" id="sub" href="http://iiit.ac.in/studentscorner/campus-life">Campus Life</a></li><!--li><a  onfocus="if(this.blur)this.blur()" id=sub href="http://iiit.ac.in/studentscorner/students" >Students</a></li--><li><a onfocus="if(this.blur)this.blur()" id="sub" href="http://iiit.ac.in/studentscorner/clubs">Clubs</a></li></ul></div>').get(0)})							
		});

//		 	expect(domNode.compare()).toBe('') ; 
			
			// Comments are assumed to be inserted ........  
			// 1. insertNode    2.deleteNode 

			// Output --> 
			// { name : 'insertNode', selectorPath : null, content : { html : '<a onfocus="if(this.blur)this.blur()" id="sub" href="http://iiit.ac.in/studentscorner/clubs">Clubs</a>', parentSelectorPath : 'DIV#DOMComparisonResult > DIV#sub_menu_campuslife:first-child > UL:first-child > LI:first-child + LI + LI', indexInParent : 1, existsInDOM : true } }, { name : 'deleteNode', selectorPath : null, content : { parentSelectorPath : 'DIV#DOMComparisonResult > DIV#sub_menu_campuslife:first-child > UL:first-child > LI:first-child + LI + LI', indexInParent : 0, existsInDOM : false }

		});
	});


		describe('method: Compare', function () {
			it('case10 : compares the dom trees and outputs the final result', function () {
		var domNode = VWO.DOMComparator.create({
			
		
		nodeA: VWO.DOMNode.create({el:$('<ul class="tabs "><li id="news_tab" class=""><a href="javascript:void(0);" onmouseover="ShowTabContent(1);"><span>News</span></a></li><li id="events_tab" class=""><a href="javascript:void(0);" onmouseover="ShowTabContent(2);"><span>Events</span></a></li><li id="notice_tab" class=""><a href="javascript:void(0);" onmouseover="ShowTabContent(3);"><span>Notice</span></a></li><li id="fop_tab" class="active"><a href="javascript:void(0);" onmouseover="ShowTabContent(4);"><span>Careers</span></a></li><li id="academic_tab" class=""><a href="javascript:void(0);" onmouseover="ShowTabContent(511);"><span>Academics</span></a></li></ul>').get(0)}),												    		
		nodeB: VWO.DOMNode.create({el:$('<ul class="tabs "><li id="news_tab" class=""><a href="javascript:void(0);" onmouseover="ShowTabContent(1);"><span>News</span></a></li><li id="events_tab" class=""><a href="javascript:void(0);" onmouseover="ShowTabContent(2);"><span>Events</span></a></li><li id="notice_tab" class=""><a href="javascript:void(0);" onmouseover="ShowTabContent(3);"><span>Notice</span></a></li><li id="fop_tab" class="active"><a href="javascript:void(0);" onmouseover="ShowTabContent(4);"><span>Careers</span></a></li><li id="academic_tab" class=""><a href="javascript:void(0);" onmouseover="ShowTabContent(5);"><span>Academics</span></a></li></ul>').get(0)})												    		

		});

		// 	expect(domNode.compare()).toBe('') ; 
			
		// Random attr changes  .... 
		// Works fine 
			
		});
	});

		describe('method: Compare', function () {
			it('case11 : compares the dom trees and outputs the final result', function () {
		var domNode = VWO.DOMComparator.create({
		
		nodeA: VWO.DOMNode.create({el:$('<ul><li>ITEM2</li><li>ITEM3</li><li>ITEM4</li><li>ITEM5</li></ul>').get(0)}),												    		
		nodeB: VWO.DOMNode.create({el:$('<ul><li>ITEM1</li><li>ITEM2</li><li>ITEM3</li><li>ITEM4</li><li>ITEM5</li></ul>').get(0)})												    		
		});
		        		
		// 	expect(domNode.compare()).toBe('') ; 
		// Output -> 
		// Asks to insert all the nodes , so not optimized ... But the steps are right 	

		});
	});

		describe('method: Compare', function () {
			it('case12 : compares the dom trees and outputs the final result', function () {
		var domNode = VWO.DOMComparator.create({
		
		nodeA: VWO.DOMNode.create({el:$('<div id="footer"><div>&nbsp;</div>(c) Paras Chopra |  <a href="http://visualwebsiteoptimizer.com/" title="A/B Testing Software">A/B Testing Software</a> | <a href="http://visualwebsiteoptimizer.com/" title="Multivariate Testing Software">Multivariate Testing Software</a> | <a href="http://visualwebsiteoptimizer.com/" title="Split Testing Software">Split Testing Software</a><div class="vwo_1403601793422 vwo_1403601805554">&nbsp;</div></div>').get(0)}),												    		

	
		nodeB: VWO.DOMNode.create({el:$('<div id="footer"><div>&nbsp;</div>Paras Chopra |  <a href="http://visualwebsiteoptimizer.com/" title="A/B Testing Software">A/B Testing Software</a> | <a href="http://visualwebsiteoptimizer.com/" title="Multivariate Testing Software">Multivariate Testing Software</a> | <a href="http://visualwebsiteoptimizer.com/" title="Split Testing Software" style="color:red">Split Testing</a><div class="vwo_1403601793422 vwo_1403601805554">&nbsp;</div></div>').get(0)})												    		
	//	nodeB: VWO.DOMNode.create({el:$('').get(0)})												    		


		});
		        		
	//	 	expect(domNode.compare()).toBe('') ;

			// Output ---> 
			// { name : 'insertNode', selectorPath : null, content : { html : 'Split Testing', parentSelectorPath : 'DIV#DOMComparisonResult > DIV#footer:first-child > DIV:first-child + A + A + A', indexInParent : 1, existsInDOM : true } }, { name : 'changeText', selectorPath : null, content : { text : 'Paras Chopra |  ', parentSelectorPath : 'DIV#DOMComparisonResult > DIV#footer:first-child', indexInParent : 1 } }, { name : 'css', selectorPath : 'DIV#DOMComparisonResult > DIV#footer:first-child > DIV:first-child + A + A + A', content : { color : 'red' } }, { name : 'deleteNode', selectorPath : null, content : { parentSelectorPath : 'DIV#DOMComparisonResult > DIV#footer:first-child > DIV:first-child + A + A + A', indexInParent : 0, existsInDOM : false } }

			// Works fine 
		});
	});

		describe('method: Compare', function () {
			it('case13 : compares the dom trees and outputs the final result', function () {
		var domNode = VWO.DOMComparator.create({

		nodeA: VWO.DOMNode.create({el:$('<div id="bottom-mid"><h2><a href="http://www.paraschopra.com/personal.php">Personal</a></h2></div>').get(0)}), 												    		
		nodeB: VWO.DOMNode.create({el:$('<div class="a"></div>').get(0)})												    		
		});
		        		
		// 	expect(domNode.compare()).toBe('') ;

		// 	*** for almost different nodes , if the parent structure is same, then works ...... 
		// 	***  If parent is not same, then typeError or SelectorPath error is shown ... 


			// Output --->
			// { name : 'attr', selectorPath : 'DIV#DOMComparisonResult > DIV#bottom-mid:first-child', content : { class : 'a' } }, { name : 'removeAttr', selectorPath : 'DIV#DOMComparisonResult > DIV#bottom-mid:first-child', content : { id : 'bottom-mid' } }, { name : 'deleteNode', selectorPath : null, content : { parentSelectorPath : 'DIV#DOMComparisonResult > DIV:first-child', indexInParent : 0, existsInDOM : false }

			// Works Fine 

		});
	});
	
		describe('method: Compare', function () {
			it('case14 : compares the dom trees and outputs the final result', function () {
		var domNode = VWO.DOMComparator.create({

		nodeA: VWO.DOMNode.create({el:$('<a href="#" data-suid="30345976" class="tab-change " data-b="_ylt=A2KLtXJObqlTcGEAflGuitIF" id="tab-p_30345976">               <span class="world-cup"><b class="wc-text">World Cup</b><span class="next-game fz-xxs">Next up</span><span class="name ell">Costa Rica</span><img src="https://sp.yimg.com/j/assets/i/us/sp/v/soccer/teams/70x70/443.png" alt="" class="team-icon"><span class="vs">v</span><img src="https://sp.yimg.com/j/assets/i/us/sp/v/soccer/teams/70x70/377.png" alt="" class="team-icon"><span class="name ell">England</span></span></a>').get(0)}), 						

		nodeB: VWO.DOMNode.create({el:$('<a class="a"></a>').get(0)})												    		
		});
		        		
		// 	expect(domNode.compare()).toBe('') ;


		// Output --> 
		// { name : 'attr', selectorPath : 'DIV#DOMComparisonResult > A#tab-p_30345976:first-child', content : { class : 'a' } }, { name : 'removeAttr', selectorPath : 'DIV#DOMComparisonResult > A#tab-p_30345976:first-child', content : { href : '#', data-suid : '30345976', data-b : '_ylt=A2KLtXJObqlTcGEAflGuitIF', id : 'tab-p_30345976' } }, { name : 'deleteNode', selectorPath : null, content : { parentSelectorPath : 'DIV#DOMComparisonResult > A:first-child', indexInParent : 0, existsInDOM : false } }

		});
	});


		describe('method: Compare', function () {
			it('case15 : compares the dom trees and outputs the final result', function () {
		var domNode = VWO.DOMComparator.create({

		nodeA: VWO.DOMNode.create({el:$('<a href="da" class="tab" data-b="ylt" id="tab"><span class="world"><b class="wc">World</b><span class="n">Next up</span><span class="n">Costa Rica</span><img src="hi" class="team-icon"><span class="vs">v</span><img src="Hi" alt="" class="team-icon"><span class="name">Eng</span></span></a>').get(0)}), 						

		nodeB: VWO.DOMNode.create({el:$('<a href="da" class="tab" data-b="ylt" id="tab"><span class="world"><b class="wc">World</b><span class="n">Next up</span><span class="n">Costa Rica</span><img src="hi" class="team-icon"><span class="vs">v</span><img src="Hi" alt="" class="team-icon"><span class="name">Eng</span></span></a>').get(0)}) 						

		});
			// One letter issue .... e.g here <span class="vs">v .... "v" was not considered as a word .. 		 			
			expect(domNode.compare()).toMatch([ ]) ;
			
			// Works fine 
		});
	});
	

})
