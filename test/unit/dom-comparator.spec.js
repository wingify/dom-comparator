describe('module: DOMNode-Comparator', function () {

		describe('method: Compare', function () {
			it('case 1:compares the dom trees and outputs the final result', function () {

		var el1 = $('<ul class="features-list"><li class="testingfl"><div class="titlemediumbold">Testing</div><div class="text">Easily run A/B tests on your website</div></li><li class="heatmapsfr"><div class="titlemediumbold">Heatmaps</div><div class="text">Track visitors click behavior</div></li><div class="clr"></div><li class="personalizationfl"><div class="titlemediumbold">Personalization</div><div class="text">Show targeted offers to visitors</div></li><li class="user-insightsfr"><div class="titlemediumbold">User Insights</div><div class="text">Get feedback from people on your website</div></li><div class="clr"></div></ul>').get(0) ; 
		var el2 = $('<ul class="features-list"><li class="testingfl"><div class="titlemediumbold">Testing</div><div class="text">Easily run A/B tests on your website</div><h3>Himanshu </h3></li><li class="heatmapsfr"><div class="titlemediumbold">Heatmaps</div><div class="text">Track visitors click behavior</div></li><div class="clr"></div><li class="personalizationfl"><div class="titlemediumbold">Personalization</div><div class="text" style="color: red;">Show targeted offers to visitors</div></li><li class="user-insightsfr"><div class="titlemediumbold">User Insights</div><div class="himanshu">Get feedback people on your website</div></li><div class="clr"></div></ul>').get(0) ; 

		var domComparator = VWO.DOMComparator.create({
		elA : el1, 
		elB : el2 
		}) ; 



		expect(domComparator.compare().slice()).toEqual([ { name : 'insertNode', selectorPath : null, content : { html : '<h3>Himanshu </h3>', parentSelectorPath : 'HIM#DOMComparisonResult > UL:first-child > LI:first-child', indexInParent : 2, existsInDOM : true } }, { name : 'insertNode', selectorPath : null, content : { html : 'Get feedback people on your website', parentSelectorPath : 'HIM#DOMComparisonResult > UL:first-child > LI:first-child + LI + DIV + LI + LI > DIV:first-child + DIV', indexInParent : 1, existsInDOM : true } }, { name : 'attr', selectorPath : 'HIM#DOMComparisonResult > UL:first-child > LI:first-child + LI + DIV + LI + LI > DIV:first-child + DIV', content : { class : 'himanshu' } }, { name : 'css', selectorPath : 'HIM#DOMComparisonResult > UL:first-child > LI:first-child + LI + DIV + LI > DIV:first-child + DIV', content : { color : 'red' } }, { name : 'deleteNode', selectorPath : null, content : { parentSelectorPath : 'HIM#DOMComparisonResult > UL:first-child > LI:first-child + LI + DIV + LI + LI > DIV:first-child + DIV', indexInParent : 0, existsInDOM : false } } ]);

		});
		
	});




		describe('method: Compare', function () {
			it('case 2:compares the dom trees and outputs the final result', function () {


		var el1 = $('<section class="section" style="color:red"><div class="container"><div class="main-heading"><h2 class="vwo_1403262964840">The</h2><div class="tagline">optimization</div></div></div><a href="google.com"></a></section>').get(0) ; 
		var el2 = $('<section class="section" style="color: blue;"><div class="container12"><div class="main-heading"><h2 class="vwo_1403262964840">The</h2><div class="tagline">optimization</div></div></div><a href="google.com"></a></section>').get(0) ; 

		var domComparator = VWO.DOMComparator.create({
		elA : el1, 
		elB : el2 
		}) ; 

		expect(domComparator.compare().slice()).toEqual([ { name : 'attr', selectorPath : 'HIM#DOMComparisonResult > SECTION:first-child > DIV:first-child', content : { class : 'container12' } }, { name : 'css', selectorPath : 'HIM#DOMComparisonResult > SECTION:first-child', content : { color : 'blue' } } ]) ; 
		});
		
	});



		describe('method: Compare', function () {
			it('case 3:compares the dom trees and outputs the final result', function () {


		var el1 = $('<section class="a" style="color: blue;"><div class="b"><div class="c"><h2 class="d">The</h2></div></div></a></section>').get(0) ; 
		var el2 = $('<section class="a1" style="color: red;"><div class="b"><div class="c"><h2 class="d">The</h2></div></div></a></section>').get(0) ; 

		var domComparator = VWO.DOMComparator.create({
		elA : el1, 
		elB : el2 
		}) ; 

		expect(domComparator.compare().slice()).toEqual([ { name : 'attr', selectorPath : 'HIM#DOMComparisonResult > SECTION:first-child', content : { class : 'a1' } }, { name : 'css', selectorPath : 'HIM#DOMComparisonResult > SECTION:first-child', content : { color : 'red' } } ]) ; 
		});
		
	});


		describe('method: Compare', function () {
			it('case 4:compares the dom trees and outputs the final result', function () {


		var el1 = $('<ul><li><a href="/about">Our Team</a></li><li><a href="/lab" style="color:red">Labs</a></li><li><a href="/careers">Careers</a></li><li class="trigger-contact"><a href="/contact" class="">Contact</a></li></ul>').get(0) ; 
		var el2 = $('<ul><li><a href="/about">Our Team</a></li><li><a href="/labs">Labs</a></li><li><a href="/careers">Careers</a></li><li class="trigger-contact"><a href="/contact" class="">Contact Us</a></li></ul>').get(0) ; 

		var domComparator = VWO.DOMComparator.create({
		elA : el1, 
		elB : el2 
		}) ; 

		expect(domComparator.compare().slice()).toEqual([ { name : 'insertNode', selectorPath : null, content : { html : 'Contact Us', parentSelectorPath : 'HIM#DOMComparisonResult > UL:first-child > LI:first-child + LI + LI + LI > A:first-child', indexInParent : 1, existsInDOM : true } }, { name : 'attr', selectorPath : 'HIM#DOMComparisonResult > UL:first-child > LI:first-child + LI > A:first-child', content : { href : '/labs' } }, { name : 'removeCss', selectorPath : 'HIM#DOMComparisonResult > UL:first-child > LI:first-child + LI > A:first-child', content : { color : 'red' } }, { name : 'deleteNode', selectorPath : null, content : { parentSelectorPath : 'HIM#DOMComparisonResult > UL:first-child > LI:first-child + LI + LI + LI > A:first-child', indexInParent : 0, existsInDOM : false } } ]) ; 
		});
		
	});


		describe('method: Compare', function () {
			it('case 5:compares the dom trees and outputs the final result', function () {


		var el1 = $('<div class="a"></div>').get(0) ; 
		var el2 = $('<div class="ta-c"><a href="vwo.com" style="color: red;">Learn</a><h2>Himanshu</h2></div>').get(0) ; 

		var domComparator = VWO.DOMComparator.create({
		elA : el1, 
		elB : el2 
		}) ;

		expect(domComparator.compare().slice()).toEqual([ { name : 'insertNode', selectorPath : null, content : { html : '<a href="vwo.com" style="color: red;">Learn</a>', parentSelectorPath : 'HIM#DOMComparisonResult > DIV:first-child', indexInParent : 0, existsInDOM : true } }, { name : 'insertNode', selectorPath : null, content : { html : '<h2>Himanshu</h2>', parentSelectorPath : 'HIM#DOMComparisonResult > DIV:first-child', indexInParent : 1, existsInDOM : true } }, { name : 'attr', selectorPath : 'HIM#DOMComparisonResult > DIV:first-child', content : { class : 'ta-c' } } ]);

		});
		
	});



		describe('method: Compare', function () {
			it('case 6:compares the dom trees and outputs the final result', function () {


		var el1 = $('<ul><li>ITEM1</li><li>ITEM4</li><li>ITEM3</li><li>ITEM2</li><li>ITEM5</li></ul>').get(0) ; 
		var el2 = $('<ul><li>ITEM1</li><li>ITEM2</li><li>ITEM3</li><li>ITEM4</li><li>ITEM5</li></ul>').get(0) ; 

		var domComparator = VWO.DOMComparator.create({
		elA : el1, 
		elB : el2 
		}) ; 

		
		expect(domComparator.compare().slice()).toEqual([ { name : 'rearrange', selectorPath : null, content : { parentSelectorPath : 'HIM#DOMComparisonResult > UL:first-child', indexInParent : 3, oldParentSelectorPath : 'HIM#DOMComparisonResult > UL:first-child', oldIndexInParent : 1, existsInDOM : true } }, { name : 'rearrange', selectorPath : null, content : { parentSelectorPath : 'HIM#DOMComparisonResult > UL:first-child', indexInParent : 2, oldParentSelectorPath : 'HIM#DOMComparisonResult > UL:first-child', oldIndexInParent : 1, existsInDOM : true } } ]);

		});
		
	});


		describe('method: Compare', function () {
			it('case 7:compares the dom trees and outputs the final result', function () {


		var el1 = $('<div id="bottom-mid"><h2><a href="http://www.paraschopra.com/personal.php">Personal</a></h2></div>').get(0) ; 
		var el2 = $('<div class="a"></div>').get(0) ; 

		var domComparator = VWO.DOMComparator.create({
		elA : el1, 
		elB : el2 
		}) ; 


		expect(domComparator.compare().slice()).toEqual([ { name : 'attr', selectorPath : 'HIM#DOMComparisonResult > DIV#bottom-mid:first-child', content : { class : 'a' } }, { name : 'removeAttr', selectorPath : 'HIM#DOMComparisonResult > DIV#bottom-mid:first-child', content : { id : 'bottom-mid' } }, { name : 'deleteNode', selectorPath : null, content : { parentSelectorPath : 'HIM#DOMComparisonResult > DIV:first-child', indexInParent : 0, existsInDOM : false } } ]);
		});
		
	});


		describe('method: Compare', function () {
			it('case 8:compares the dom trees and outputs the final result', function () {


		var el1 = $('<div class="meta            "><div class="buttons"><a class="btn btn-large btn-primary open-gallery" href="#">Open Gallery</a><a class="btn btn-large btn-primary next" href="#">Next</a><a class="nice" href="#">Prev</a><span class="slides"><span class="current">1</span><span class="total">9</span></span></div><h2 class="title">The Face of Android Wear</h2><div class="caption"><p>The Motorola Moto 500 is the first Android Wear smartwatch with a round face. And it\'s beautiful.</p></div><div class="credit"></div></div>').get(0) ; 
		var el2 = $('<div class="meta            "><div class="buttons"><a class="btn btn-large btn-primary open-gallery" href="#">Open Gallery</a><a class="btn btn-large btn-primary next" href="#">Next</a><a class="btn btn-large btn-primary prev" href="#">Prev</a><span class="slides"><span class="current">1</span><span class="total">9</span></span></div><h2 class="title">The Face of Android Wear</h2><div class="caption"><p>The Motorola Moto 360 is the first Android Wear smartwatch with a round face. And it\'s beautiful.</p></div><div class="credit"></div></div>').get(0) ; 

		var domComparator = VWO.DOMComparator.create({
		elA : el1, 
		elB : el2 
		}) ; 

		expect(domComparator.compare().slice()).toEqual([ { name : 'changeText', selectorPath : null, content : { text : 'The Motorola Moto 360 is the first Android Wear smartwatch with a round face. And it\'s beautiful.', parentSelectorPath : 'HIM#DOMComparisonResult > DIV:first-child > DIV:first-child + H2 + DIV > P:first-child', indexInParent : 0 } }, { name : 'attr', selectorPath : 'HIM#DOMComparisonResult > DIV:first-child > DIV:first-child > A:first-child + A + A', content : { class : 'btn btn-large btn-primary prev' } } ]) ; 

		});
		
	});


		describe('method: Compare', function () {
			it('case 9:compares the dom trees and outputs the final result', function () {


		var el1 = $('<nav class="head_nav"><ul><li><a href="/welcome">Home</a></li><li><a href="/home_bolly">Bollywood</a></li><li><a href="/home_tolly">Tollywood</a></li></ul></nav>').get(0) ; 
		var el2 = $('<nav class="head_nav"><ul><li><a href="/welcome" style="color: blue;">Home</a></li><li><a href="/home_bolly">Boll</a></li><li><a href="/home_tolly" class="hello">Tollywood</a></li></ul></nav>').get(0) ; 

		var domComparator = VWO.DOMComparator.create({
		elA : el1, 
		elB : el2 
		}) ; 


		var ret = domComparator.compare() ; 
		//              expect(ret).toEqual() ;   
		expect(domComparator.verifyComparison()).toEqual(true) ; 



		});
		
	});


		describe('method: Compare', function () {
			it('case 10:compares the dom trees and outputs the final result', function () {


		var el1 = $('<ul><li><a href="http://www.reddit.com/user/316nuts" class="author may-blank id-t2_4x3zj">316nuts</a><span class="flair flair-bulb" title=""></span><span class="userattrs"></span></li></ul>').get(0) ; 
		var el2 = $('<ul><li style="color: red;"><a href="http://www.a.com" class="author may-blank id-t2_4x3zj">316nuts</a><span class="flair flair-bulb" title=""></span><span class="Hello">HEloooooo</span></li></ul>').get(0) ; 

		var domComparator = VWO.DOMComparator.create({
		elA : el1, 
		elB : el2 
		}) ; 
		
		 var ret = domComparator.compare() ; 
		                 //              expect(ret).toEqual() ;   
		                 expect(domComparator.verifyComparison()).toEqual(true) ; 

		});
		
	});



		describe('method: Compare', function () {
			it('case 11:compares the dom trees and outputs the final result', function () {


		var el1 = $('<div><p>T1</p><p>T2</p></div>').get(null) ; 
		var el2 = $('<div><p>T2</p><p>T1</p></div>').get(null) ; 

		var domComparator = VWO.DOMComparator.create({
		elA : el1, 
		elB : el2 
		}) ; 

		expect(domComparator.compare().slice()).toEqual([ { name : 'rearrange', selectorPath : null, content : { parentSelectorPath : 'HIM#DOMComparisonResult > DIV:first-child', indexInParent : 1, oldParentSelectorPath : 'HIM#DOMComparisonResult > DIV:first-child', oldIndexInParent : 0, existsInDOM : true } } ]);
			
		});
	});





		describe('method: Compare', function () {
			it('case 12:compares the dom trees and outputs the final result', function () {


		var el1 = $('<ul class="features-list"><li class="testingfl"><div class="titlemediumbold">Testing</div><div class="text">Easily run A/B tests on your website</div></li><li class="heatmapsfr"><div class="titlemediumbold">Heatmaps</div><div class="text">Track visitors click behavior</div></li><div class="clr"></div><li class="personalizationfl"><div class="titlemediumbold">Personalization</div><div class="text">Show targeted offers to visitors</div></li><li class="user-insightsfr"><div class="titlemediumbold">User Insights</div><div class="text">Get feedback from people on your website</div></li><div class="clr"></div></ul>').get(null) ; 
		var el2 = $('<ul class="features-list"><li class="testingfl"><div class="titlemediumbold">Testing</div><div class="text">Easily run A/B tests on your website</div></li><li class="heatmapsfr"><div class="titlemediumbold">Heatmaps</div><div class="text">Track visitors click behavior</div></li><div class="clr"></div><li class="personalizationfl"><div class="titlemediumbold">Personalization</div><div class="text">Show targeted offers to visitors</div></li><li class="user-insightsfr"><div class="text">Get feedback from people on your website</div><div class="titlemediumbold">User Insights</div></li><div class="clr"></div></ul>').get(null) ; 

		var domComparator = VWO.DOMComparator.create({
		elA : el1, 
		elB : el2 
		}) ; 

		expect(domComparator.compare().slice()).toEqual([ { name : 'rearrange', selectorPath : null, content : { parentSelectorPath : 'HIM#DOMComparisonResult > UL:first-child > LI:first-child + LI + DIV + LI + LI', indexInParent : 1, oldParentSelectorPath : 'HIM#DOMComparisonResult > UL:first-child > LI:first-child + LI + DIV + LI + LI', oldIndexInParent : 0, existsInDOM : true } } ]);
			
		});
	});



		describe('method: Compare', function () {
			it('case 13:compares the dom trees and outputs the final result', function () {


		var el1 = $('<div id="block-menu-menu-global-footer" class="block block-menu first odd" role="navigation"><ul class="menu"><li class="menu__item is-expanded first expanded"><strong>About us</strong><ul class="menu"><li class="menu__item is-leaf first leaf"><a href="/about-us/our-mission" class="menu__link">Who we are</a></li><li class="menu__item is-leaf leaf"><a href="/about-us/our-mission/about-our-ratings" class="menu__link">How we rate and review</a></li><li class="menu__item is-leaf leaf"><a href="/about-us/supporters" class="menu__link">Our supporters</a></li><li class="menu__item is-leaf leaf"><a href="/about-us/press-room/common-sense-media-news" class="menu__link">Press room</a></li><li class="menu__item is-leaf leaf"><a href="/about-us/jobs" class="menu__link">Join our team</a></li><li class="menu__item is-leaf leaf"><a href="/getinvolved" class="menu__link">Donate</a></li><li class="menu__item is-leaf leaf"><a href="/espanol" class="menu__link">Sitio en español</a></li><li class="menu__item is-leaf last leaf"><a href="/contact" class="menu__link">Contact us</a></li></ul><div class="clear"></div></li><li class="menu__item is-expanded expanded"><strong>Our properties and programs</strong><ul class="menu"><li class="menu__item is-leaf first leaf"><a href="http://www.commonsensemedia.org" class="menu__link">Common Sense Media</a></li><li class="menu__item is-leaf leaf"><a href="/educators" class="menu__link">Common Sense Education</a></li><li class="menu__item is-leaf leaf"><a href="/about-us/policy-advocacy/policy-priorities" class="menu__link">Common Sense Advocacy</a></li><li class="menu__item is-leaf leaf"><a href="http://www.graphite.org" class="menu__link">Graphite™ by Common Sense Media</a></li><li class="menu__item is-leaf leaf"><a href="https://www.digitalpassport.org/" class="menu__link">Digital Passport™ by Common Sense Media</a></li><li class="menu__item is-leaf last leaf"><a href="/research" class="menu__link">Program for the Study of Children and Media</a></li></ul><div class="clear"></div></li><li class="menu__item is-expanded last expanded"><strong>Our policies</strong><ul class="menu"><li class="menu__item is-leaf first leaf"><a href="/about-us/our-mission/privacy-policy" class="menu__link">Privacy policy</a></li><li class="menu__item is-leaf leaf"><a href="/about-us/our-mission/site-terms-use" class="menu__link">Terms of use</a></li><li class="menu__item is-leaf last leaf"><a href="/about-us/our-mission/community-guidelines" class="menu__link">Community guidelines</a></li></ul><div class="clear"></div></li></ul><div class="clear"></div></div>').get(0) ; 
		var el2 = $('<ul class="menu"><li class="menu__item is-expanded first expanded"><strong>About us</strong><ul class="menu"><li class="menu__item is-leaf first leaf"><a href="/about-us/our-mission" class="menu__link">Who we are</a></li><li class="menu__item is-leaf leaf"><a href="/about-us/our-mission/about-our-ratings" class="menu__link">How we rate and review</a></li><li class="menu__item is-leaf leaf"><a href="/about-us/supporters" class="menu__link">Our supporters</a></li><li class="menu__item is-leaf leaf"><a href="/about-us/press-room/common-sense-media-news" class="menu__link">Press room</a></li><li class="menu__item is-leaf leaf"><a href="/about-us/jobs" class="menu__link">Join our team</a></li><li class="menu__item is-leaf leaf"><a href="/getinvolved" class="menu__link">Donate</a></li><li class="menu__item is-leaf leaf"><a href="/espanol" class="menu__link">Sitio en español</a></li><li class="menu__item is-leaf last leaf"><a href="/contact" class="menu__link">Contact us</a></li></ul><div class="clear"></div></li><li class="menu__item is-expanded expanded"><strong>Our properties and programs</strong><ul class="menu"><li class="menu__item is-leaf first leaf"><a href="http://www.commonsensemedia.org" class="menu__link">Common Sense Media</a></li><li class="menu__item is-leaf leaf"><a href="/educators" class="menu__link">Common Sense Education</a></li><li class="menu__item is-leaf leaf"><a href="/about-us/policy-advocacy/policy-priorities" class="menu__link">Common Sense Advocacy</a></li><li class="menu__item is-leaf leaf"><a href="http://www.graphite.org" class="menu__link">Graphite™ by Common Sense Media</a></li><li class="menu__item is-leaf leaf"><a href="https://www.digitalpassport.org/" class="menu__link">Digital Passport™ by Common Sense Media</a></li><li class="menu__item is-leaf last leaf"><a href="/research" class="menu__link">Program for the Study of Children and Media</a></li></ul><div class="clear"></div></li><li class="menu__item is-expanded last expanded"><strong>Our policies</strong><ul class="menu"><li class="menu__item is-leaf first leaf"><a href="/about-us/our-mission/privacy-policy" class="menu__link">Privacy policy</a></li><li class="menu__item is-leaf last leaf"><a href="/about-us/our-mission/community-guidelines" class="menu__link">Community guidelines</a></li><li class="menu__item is-leaf leaf"><a href="/about-us/our-mission/site-terms-use" class="menu__link">Terms of use</a></li></ul><div class="clear"></div></li></ul>').get(0) ; 

		var domComparator = VWO.DOMComparator.create({
		elA : el1, 
		elB : el2 
		}) ; 

		var ret = domComparator.compare() ; 
		//              expect(ret).toEqual() ;   
		expect(domComparator.verifyComparison()).toEqual(true) ; 


		});
	});





		describe('method: Compare', function () {
			it('case 14:compares the dom trees and outputs the final result', function () {


		var el1 = $('<ul><p>IT1</p><li>IT12</li></ul>').get(0) ; 

		var el2 = $('<ul><li>IT12</li><p>IT1</p></ul>').get(0) ; 

		var domComparator = VWO.DOMComparator.create({
		elA : el1, 
		elB : el2 
		}) ; 

		expect(domComparator.compare().slice()).toEqual([ { name : 'rearrange', selectorPath : null, content : { parentSelectorPath : 'HIM#DOMComparisonResult > UL:first-child', indexInParent : 1, oldParentSelectorPath : 'HIM#DOMComparisonResult > UL:first-child', oldIndexInParent : 0, existsInDOM : true } } ]);
		});
	});



		describe('method: Compare', function () {
			it('case 15:compares the dom trees and outputs the final result', function () {


		var el1 = $('<div><p>Hello</p><span>IT12</span></div>').get(0) ; 

		var el2 = $('<div><span>IT12</span><p>IT1</p></div>').get(0) ; 

		var domComparator = VWO.DOMComparator.create({
		elA : el1, 
		elB : el2 
		}) ; 

		expect(domComparator.compare().slice()).toEqual([ { name : 'insertNode', selectorPath : null, content : { html : 'IT1', parentSelectorPath : 'HIM#DOMComparisonResult > DIV:first-child > P:first-child', indexInParent : 1, existsInDOM : true } }, { name : 'deleteNode', selectorPath : null, content : { parentSelectorPath : 'HIM#DOMComparisonResult > DIV:first-child > P:first-child', indexInParent : 0, existsInDOM : false } }, { name : 'rearrange', selectorPath : null, content : { parentSelectorPath : 'HIM#DOMComparisonResult > DIV:first-child', indexInParent : 1, oldParentSelectorPath : 'HIM#DOMComparisonResult > DIV:first-child', oldIndexInParent : 0, existsInDOM : true } } ]);
		});
	});

		describe('method: Compare', function () {
			it('case 16:compares the dom trees and outputs the final result', function () {


		var el1 = $('<ul><li class="menu__item is-leaf first leaf"><a href="/about-us/our-mission/privacy-policy" class="menu__link">Privacy policy</a></li><li class="menu__item is-leaf leaf"><a href="/about-us/our-mission/site-terms-use" class="menu__link">Terms of use</a></li><li class="menu__item is-leaf last leaf"><a href="/about-us/our-mission/community-guidelines" class="menu__link">Co</a></li></ul>').get(null) ;

		var el2 = $('<ul><li class="menu__item is-leaf first leaf"><a href="/about-us/our-mission/privacy-policy" class="menu__link">Privacy policy</a></li><li class="menu__item is-leaf last leaf"><a href="/about-us/our-mission/community-guidelines" class="menu__link">Co</a></li><li class="menu__item is-leaf leaf"><a href="/about-us/our-mission/site-terms-use" class="menu__link">Terms of use</a></li></ul>').get(null) ; 

		var domComparator = VWO.DOMComparator.create({
		elA : el1, 
		elB : el2 
		}) ; 

		var ret = domComparator.compare() ; 
		//              expect(ret).toEqual() ;   
		expect(domComparator.verifyComparison()).toEqual(true) ; 

			
		});
	});

		describe('method: Compare', function () {
			it('case 17:compares the dom trees and outputs the final result', function () {


		var el1 = $('<div><li>T1</li><li>T2</li><li>T3</li><li>T4</li></div>').get(0) ; 
		var el2 = $('<div><li>T4</li><li>T1</li><li>T2</li><li>T3</li></div>').get(0) ; 

		var domComparator = VWO.DOMComparator.create({
		elA : el1, 
		elB : el2 
		}) ; 


		expect(domComparator.compare().slice()).toEqual( [ { name : 'rearrange', selectorPath : null, content : { parentSelectorPath : 'HIM#DOMComparisonResult > DIV:first-child', indexInParent : 0, oldParentSelectorPath : 'HIM#DOMComparisonResult > DIV:first-child', oldIndexInParent : 0, existsInDOM : true } }, { name : 'rearrange', selectorPath : null, content : { parentSelectorPath : 'HIM#DOMComparisonResult > DIV:first-child', indexInParent : 1, oldParentSelectorPath : 'HIM#DOMComparisonResult > DIV:first-child', oldIndexInParent : 1, existsInDOM : true } }, { name : 'rearrange', selectorPath : null, content : { parentSelectorPath : 'HIM#DOMComparisonResult > DIV:first-child', indexInParent : 3, oldParentSelectorPath : 'HIM#DOMComparisonResult > DIV:first-child', oldIndexInParent : 2, existsInDOM : true } }, { name : 'rearrange', selectorPath : null, content : { parentSelectorPath : 'HIM#DOMComparisonResult > DIV:first-child', indexInParent : 0, oldParentSelectorPath : 'HIM#DOMComparisonResult > DIV:first-child', oldIndexInParent : 2, existsInDOM : true } } ]);
		});
	});



		describe('method: Compare', function () {
			it('case 18 :compares the dom trees and outputs the final result', function () {


		var el1 = $('<div class="post clearfix post-image"><a href="http://fleon.org/post/82789978372" class="post-type" id="post-type-82789978372">Photo</a><div class="image-item"><a href="http://fleon.org/image/82789978372"><img src="http://31.media.tumblr.com/00f1a4fc65fd1c7a76af5959e92338ad/tumblr_n42sb4kTJT1sn2jbfo1_500.jpg" alt="Feels great after long to take a long walk in a nearby park!" /></a></div><h4 class="date">15th April 2014</h4><div class="copy"><p>Feels great after long to take a long walk in a nearby park!</p></div></div>').get(0) ; 
		var el2 = $('<div class="post clearfix post-image"><h4 class="date">15th April 2014</h4><div class="image-item"><a href="http://fleon.org/image/82789978372"><img src="http://31.media.tumblr.com/00f1a4fc65fd1c7a76af5959e92338ad/tumblr_n42sb4kTJT1sn2jbfo1_500.jpg" alt="Feels great after long to take a long walk in a nearby park!" /></a></div><div class="copy"><p>Feels great after long to take a long walk in a nearby park!</p><a href="http://fleon.org/post/82789978372" class="post-type" id="post-type-82789978372">Photo</a></div></div>').get(0) ; 

		var domComparator = VWO.DOMComparator.create({
		elA : el1, 
		elB : el2 
		}) ; 

		expect(domComparator.compare().slice()).toEqual([ { name : 'rearrange', selectorPath : null, content : { parentSelectorPath : 'HIM#DOMComparisonResult > DIV:first-child > DIV:first-child + H4 + DIV', indexInParent : 1, oldParentSelectorPath : 'HIM#DOMComparisonResult > DIV:first-child', oldIndexInParent : 0, existsInDOM : true } }, { name : 'rearrange', selectorPath : null, content : { parentSelectorPath : 'HIM#DOMComparisonResult > DIV:first-child', indexInParent : 1, oldParentSelectorPath : 'HIM#DOMComparisonResult > DIV:first-child', oldIndexInParent : 0, existsInDOM : true } } ]);


		});
	});


		describe('method: Compare', function () {
			it('case 19:compares the dom trees and outputs the final result', function () {


		var el1 = $('<ul id="tabs-subject"><li><a href="#" id="subject-1" name="subject-1">Arts</a></li><li><a href="#" id="subject-2" name="subject-2">Hobbies</a></li><li><a href="#" id="subject-3" name="subject-3">Language &amp; Reading</a></li><li><a href="#" id="subject-4" name="subject-4">Math</a></li><li><a href="#" id="subject-5" name="subject-5">Preschool</a></li><li><a href="#" id="subject-6" name="subject-6">Science</a></li><li><a href="#" id="subject-7" name="subject-7">Social Studies</a></li></ul>').get(0) ; 
		var el2 = $('<ul id="tabs-subject"><li>Nice</li><li><a href="#" id="subject-1" name="subject-1">Arts</a></li><li><a href="google.com" id="subject-2" name="subject-2">Hobbies</a></li><li><a href="#" id="subject-6" name="subject-6">Science</a></li><li><a href="#" id="subject-3" name="subject-3">Language &amp; Reading</a></li><li><a href="#" id="subject-4" name="subject-4">Math</a></li><li><a href="#" id="subject-5" name="subject-5">Preschool</a></li><li><a href="#" id="subject-7" name="subject-7">Social Studies</a></li></ul>').get(0) ; 

		var domComparator = VWO.DOMComparator.create({
		elA : el1, 
		elB : el2 
		}) ; 

		var ret = domComparator.compare() ; 
		expect(ret.slice()).toEqual([ { name : 'insertNode', selectorPath : null, content : { html : '<li>Nice</li>', parentSelectorPath : 'HIM#DOMComparisonResult > UL#tabs-subject:first-child', indexInParent : 0, existsInDOM : true } }, { name : 'attr', selectorPath : 'HIM#DOMComparisonResult > UL#tabs-subject:first-child > LI:first-child + LI + LI > A#subject-2:first-child', content : { href : 'google.com' } }, { name : 'rearrange', selectorPath : null, content : { parentSelectorPath : 'HIM#DOMComparisonResult > UL#tabs-subject:first-child', indexInParent : 3, oldParentSelectorPath : 'HIM#DOMComparisonResult > UL#tabs-subject:first-child', oldIndexInParent : 3, existsInDOM : true } }, { name : 'rearrange', selectorPath : null, content : { parentSelectorPath : 'HIM#DOMComparisonResult > UL#tabs-subject:first-child', indexInParent : 4, oldParentSelectorPath : 'HIM#DOMComparisonResult > UL#tabs-subject:first-child', oldIndexInParent : 4, existsInDOM : true } }, { name : 'rearrange', selectorPath : null, content : { parentSelectorPath : 'HIM#DOMComparisonResult > UL#tabs-subject:first-child', indexInParent : 6, oldParentSelectorPath : 'HIM#DOMComparisonResult > UL#tabs-subject:first-child', oldIndexInParent : 5, existsInDOM : true } }, { name : 'rearrange', selectorPath : null, content : { parentSelectorPath : 'HIM#DOMComparisonResult > UL#tabs-subject:first-child', indexInParent : 3, oldParentSelectorPath : 'HIM#DOMComparisonResult > UL#tabs-subject:first-child', oldIndexInParent : 5, existsInDOM : true } } ]) ;   
		expect(domComparator.verifyComparison()).toEqual(true) ; 

		});
	});



		describe('method: Compare', function () {
			it('case 19_copy:compares the dom trees and outputs the final result', function () {


		var el1 = $('<ul><li>1</li><li class="a">2</li><li>3</li></ul>').get(0) ; 
		var el2 = $('<ul><li>In</li><li>1</li><li>3</li><li class="av">2</li></ul>').get(0) ; 

		var domComparator = VWO.DOMComparator.create({
		elA : el1, 
		elB : el2 
		}) ; 

		var ret = domComparator.compare() ; 
		expect(ret.slice()).toEqual([ { name : 'insertNode', selectorPath : null, content : { html : '<li>In</li>', parentSelectorPath : 'HIM#DOMComparisonResult > UL:first-child', indexInParent : 0, existsInDOM : true } }, { name : 'attr', selectorPath : 'HIM#DOMComparisonResult > UL:first-child > LI:first-child + LI + LI', content : { class : 'av' } }, { name : 'rearrange', selectorPath : null, content : { parentSelectorPath : 'HIM#DOMComparisonResult > UL:first-child', indexInParent : 3, oldParentSelectorPath : 'HIM#DOMComparisonResult > UL:first-child', oldIndexInParent : 2, existsInDOM : true } } ]) ;   
		expect(domComparator.verifyComparison()).toEqual(true) ; 

		});
	});





		describe('method: Compare', function () {
			it('case 20 : compares the dom trees and outputs the final result', function () {


		var el1 = $('<div width="205" height="325" align="left" valign="top"><p class="text"><a href="sites-fun/activities.htm">Activities</a></p><p class="text"><a href="sites-fun/coloring.htm">Coloring</a></p><p class="text"><a href="sites-fun/comics.htm">Comics</a></p><p class="text"><a href="sites-fun/crafts.htm">Crafts</a></p><p class="text"><a href="sites-fun/girls.htm">Girls\' Interests</a></p><p class="text"><a href="sites-fun/online-games.htm">Online Games</a></p><p class="text"><a href="sites-fun/sports.htm">Sports</a></p><p class="text"><a href="sites-fun/stories.htm">Stories</a></p><p class="text">&nbsp;</p></div>').get(0) ; 
		var el2 = $('<div width="205" height="325" align="left" valign="top"><p class="text"><a href="sites-fun/activities.htm">Activities</a></p><p class="text"><a href="sites-fun/coloring.htm">Coloring</a></p><p class="text"><a href="sites-fun/comics.htm">Comics</a></p><p class="text"><a href="sites-fun/crafts.htm">Crafts</a></p><p class="text"><a href="sites-fun/girls.htm">Girls\' Interests</a></p><p class="text"><a href="sites-fun/online-games.htm">Online Games</a></p><p class="text"><a href="sites-fun/sports.htm">Sports</a></p><p class="text">&nbsp;</p><p class="text"><a href="sites-fun/stories.htm">Stories</a></p></div>').get(0) ; 

		var domComparator = VWO.DOMComparator.create({
		elA : el1, 
		elB : el2 
		}) ; 


		expect(domComparator.compare().slice()).toEqual([ { name : 'rearrange', selectorPath : null, content : { parentSelectorPath : 'HIM#DOMComparisonResult > DIV:first-child', indexInParent : 8, oldParentSelectorPath : 'HIM#DOMComparisonResult > DIV:first-child', oldIndexInParent : 7, existsInDOM : true } } ]);


		});
	});




		describe('method: Compare', function () {
			it('case 21:compares the dom trees and outputs the final result', function () {


		var el1 = $('<div>Hello</div>').get(null) ; 
		var el2 = $('<div>First</div><div>Hello</div>').get(null) ; 

		var domComparator = VWO.DOMComparator.create({
		elA : el1, 
		elB : el2 
		}) ; 

		expect(domComparator.compare().slice()).toEqual([ { name : 'insertNode', selectorPath : null, content : { html : '<div>First</div>', parentSelectorPath : 'HIM#DOMComparisonResult', indexInParent : 0, existsInDOM : true } } ]);
		});
	});



		describe('method: Compare', function () {
			it('case 22 :compares the dom trees and outputs the final result', function () {


		var el1 = $('<div class="campaign-video clearfix"><h2 class="character vwo_1405078498666"><span class="header-background"><img src="http://i.cdn.turner.com/v5cache/CARTOON/site/Images/i83/moba_180x180.png" class="icon"></span>Adventure Time Battle Party</h2><div class="hero-wrapper animation" style="top:0px; visibility: inherit; opacity:1;"><img class="hero" src="http://i.cdn.turner.com/v5cache/CARTOON/site/Images/i83/atbattleparty_hpad.jpg" alt=""><div class="button-play"></div></div><div class="text-wrapper animation" style="top:0px; visibility: inherit; opacity:1;"><h3>Multiplayer Game</h3><h4>Join the Party!</h4></div><div class="button-wrapper animation" style="top:0px; visibility: inherit; opacity:1;"><!-- if the card link contains separate tracking data, change the ? in clickTrackHomepage to & --><a href="/games/adventuretime/adventure-time-battle-party/index.html?atclk_hp=hpg_Adventure-Time-Battle-Party_Campaign-AT-MOBA_Play-Now" class="button">Play Now<span class="cn_symbols">z</span></a></div></div>').get(null) ; 

		var el2 = $('<div class="campaign-video clearfix"><div class="hero-wrapper animation" style="top:0px; visibility: inherit; opacity:1;"><img class="hero" src="http://i.cdn.turner.com/v5cache/CARTOON/site/Images/i83/atbattleparty_hpad.jpg" alt=""><div class="button-play"></div></div><div class="text-wrapper animation" style="top:0px; visibility: inherit; opacity:1;"><h3>Multiplayer Game</h3></div><div class="button-wrapper animation" style="top:0px; visibility: inherit; opacity:1;"><a href="/games/adventuretime/adventure-time-battle-party/index.html?atclk_hp=hpg_Adventure-Time-Battle-Party_Campaign-AT-MOBA_Play-Now" class="button"></a></div></div><h4>Join the Party!</h4>').get(null) ; 
			
		var domComparator = VWO.DOMComparator.create({
		elA : el1, 
		elB : el2 
		}) ; 

  var ret = domComparator.compare() ; 
  //              expect(ret).toEqual() ;   
                  expect(domComparator.verifyComparison()).toEqual(true) ; 


		});
	});





		describe('method: Compare', function () {
			it('case 23:compares the dom trees and outputs the final result', function () {


		var el1 = $('<div>Hello</div>').get(null) ; 
		var el2 = $('<div>First</div><div>Hello</div>').get(null) ; 

		var domComparator = VWO.DOMComparator.create({
		elA : el1, 
		elB : el2 
		}) ; 


		expect(domComparator.compare().slice()).toEqual([ { name : 'insertNode', selectorPath : null, content : { html : '<div>First</div>', parentSelectorPath : 'HIM#DOMComparisonResult', indexInParent : 0, existsInDOM : true } } ]);

		expect(domComparator.verifyComparison()).toEqual(true) ; 

		});
	});


		describe('method: Compare', function () {
			it('case 24:compares the dom trees and outputs the final result', function () {


		var el1 = $('<div>T3</div><div>S2</div>').get(null) ; 
		var el2 = $('<div>F1</div><div>S2</div><div>T3</div>').get(null) ; 

		var domComparator = VWO.DOMComparator.create({
		elA : el1, 
		elB : el2 
		}) ; 

		expect(domComparator.compare().slice()).toEqual([ { name : 'insertNode', selectorPath : null, content : { html : '<div>F1</div>', parentSelectorPath : 'HIM#DOMComparisonResult', indexInParent : 1, existsInDOM : true } }, { name : 'rearrange', selectorPath : null, content : { parentSelectorPath : 'HIM#DOMComparisonResult', indexInParent : 2, oldParentSelectorPath : 'HIM#DOMComparisonResult', oldIndexInParent : 0, existsInDOM : true } } ]);

		});
	});

		describe('method: Compare', function () {
			it('case 25:compares the dom trees and outputs the final result', function () {


		var el1 = $('<div>T</div><div class="a"></div>').get(null) ; 

		var el2 = $('<div>First</div><div class="b"></div><div>T</div>').get(null) ; 


		var domComparator = VWO.DOMComparator.create({
		elA : el1, 
		elB : el2 
		}) ; 
		  var ret = domComparator.compare() ; 
		  //              expect(ret).toEqual() ;   
		                  expect(domComparator.verifyComparison()).toEqual(true) ; 

		});
	});





		describe('method: Compare', function () {
			it('case 26:compares the dom trees and outputs the final result', function () {


		var el1 = $('<div>Third</div><form method="POST" class="login-form" id="login-form-modal" action="https://app.vwo.com/login"><div class="form-item"><label class="label">Email address</label><input type="text" name="username" class="input-text email"/><span class="error-message">The email address you entered is incorrect.</span></div><div class="form-item"><label class="label">Password</label><input type="password" name="password" class="input-text"/><span class="error-message">The password you entered is incorrect.</span></div><div class="form-submit-block"><input type="checkbox" class="checkbox"  name="remember" id="checkbox-remember" value="true"><label for="checkbox-remember">Remember me</label></div><div class="form-submit-block"><input type="submit" value="Submit" class="button" /><a href="https://app.vwo.com/#/forgot-password" class="forgot-pwd">Forgot Password?</a><div class="clr"></div></div><input type="hidden" value="1" name="fromVWO"/></form>').get(null) ; 

		var el2 = $('<div>First</div><form method="POST" class="login-form" id="login-form-modal" action="https://app.vwo.com/login"><div class="form-item"><label class="label">Email address</label><input type="text" name="username" class="input-text email"/><span class="error-message">The email address you entered is incorrect.</span></div><div class="form-item"><label class="label">Password</label><input type="password" name="password" class="input-text"/><span class="error-message">The password you entered is incorrect.</span></div><div class="form-submit-block"><input type="checkbox" class="checkbox"  name="remember" id="checkbox-remember" value="true"><label for="checkbox-remember">Remember me</label></div><div class="form-submit-blk"><input type="submit" value="Submit" class="button" /><a href="https://app.vwo.com/#/forgot-password" class="forgot-pwd">Forgot Password?</a><div class="clr"></div></div><input type="hidden" value="1" name="fromVWO"/></form><div>Third</div>').get(null) ; 
		var domComparator = VWO.DOMComparator.create({
		elA : el1, 
		elB : el2 
		}) ; 

		
		var ret = domComparator.compare() ; 
//		expect(ret).toEqual() ;   
		expect(domComparator.verifyComparison()).toEqual(true) ; 

		});
	});





		describe('method: Compare', function () {
			it('case 27:compares the dom trees and outputs the final result', function () {


		var el1 = $('<tr><td><table class="NavBarMenu" cellspacing="0" border="0"><tr><td><a href="http://www.asciitable.com/">ASCII</a> &nbsp;&nbsp; | &nbsp;&nbsp;</td><td><a href="http://www.lookuptables.com/ebcdic_scancodes.php">Scan Codes / EBCDIC</a> &nbsp;&nbsp; | &nbsp;&nbsp;</td><td><a href="http://www.lookuptables.com/">HTML Codes</a> &nbsp;&nbsp; | &nbsp;&nbsp;</td><td><a href="http://www.lookuptables.com/phoneticalphabet.php">Phonetic Alphabet</a> &nbsp;&nbsp; | &nbsp;&nbsp;</td><td><a href="http://www.unicodetables.com/">Unicode v4</a> &nbsp;&nbsp; | &nbsp;&nbsp;</td><td><a href="http://www.DialingCode.com/">Dialing Codes</a> &nbsp;&nbsp; | &nbsp;&nbsp;</td><td><a href="http://www.Fezy.com/">Voucher Codes</a></td></tr></table></td></tr>').get(null) ; 
		var el2 = $('<div>A</div><tr><td><table class="NavBarMenu" cellspacing="0" border="0"><tr><td><a href="http://www.asciitable.com/">ASCII</a> &nbsp;&nbsp; | &nbsp;&nbsp;</td><td><a href="http://www.lookuptables.com/ebcdic_scancodes.php">Scan Codes / EBCDIC</a> &nbsp;&nbsp; | &nbsp;&nbsp;</td><td><a href="http://www.lookuptables.com/">HTML Codes</a> &nbsp;&nbsp; | &nbsp;&nbsp;</td><td><a href="http://www.lookuptables.com/phoneticalphabet.php">Phonetic Alphabet</a> &nbsp;&nbsp; | &nbsp;&nbsp;</td><td><a href="http://www.Fezy.com/">Voucher Codes</a></td><td><a href="http://www.unicodetables.com/">Unicode v4</a> &nbsp;&nbsp; | &nbsp;&nbsp;</td><td><a href="http://www.DialingCode.com/">Dialing Codes</a> &nbsp;&nbsp; | &nbsp;&nbsp;</td></tr></table></td><div>Class</div></tr>').get(null) ; 

		var domComparator = VWO.DOMComparator.create({
		elA : el1, 
		elB : el2 
		}) ; 

		var ret = domComparator.compare() ; 
	//	expect(ret).toEqual() ;   
		expect(domComparator.verifyComparison()).toEqual(true) ; 

		});
	});




		describe('method: Compare', function () {
			it('case 28:compares the dom trees and outputs the final result', function () {


		var el1 = $('<div>A</div><div id="login-form"><div class="box-inner"><img src="skins/larry/images/IIIT_logo.png" id="logo" border="0" alt="Students Mail Server"><form name="form" action="./" method="post"><input type="hidden" name="_token" value="9ee7585f5f4a65588958d0cbed211649"><input type="hidden" name="_task" value="login"><input type="hidden" name="_action" value="login"><input type="hidden" name="_timezone" id="rcmlogintz" value="_default_"><input type="hidden" name="_dstactive" id="rcmlogindst" value="_default_"><input type="hidden" name="_url" id="rcmloginurl" value=""><table><tbody><tr><td class="title"><label for="rcmloginuser">Username</label></td><td class="input"><input name="_user" id="rcmloginuser" size="40" autocapitalize="off" type="text"></td></tr><tr><td class="title"><label for="rcmloginpwd">Password</label></td><td class="input"><input name="_pass" id="rcmloginpwd" size="40" autocapitalize="off" type="password"></td></tr></tbody></table><p class="formbuttons"><input type="submit" class="button mainaction" value="Login" /></p></form></div><div class="box-bottom"><div id="message"></div></div>').get(null) ; 

		var el2 = $('<div id="login-form"><div class="box-inner"><form name="form" action="./" method="post"><input type="hidden" name="_task" value="login"><input type="hidden" name="_action" value="login"><input type="hidden" name="_timezone" id="rcmlogintz" value="_default_"><input type="hidden" name="_dstactive" id="rcmlogindst" value="_default_"><input type="hidden" name="_url" id="rcmloginurl" value=""><table><tbody><tr><td class="title"><label for="rcmloginuser">Username</label></td><td class="input"><input name="_user" id="rcmloginuser" size="40" autocapitalize="off" type="text"></td></tr><tr><td class="title"><label for="rcmloginpwd">Password</label></td><td class="input"><input name="_pass" id="rcmloginpwd" size="40" autocapitalize="off" type="password"></td></tr></tbody></table>NICE<p class="formbuttons"><input type="submit" class="button mainaction" value="Login" /></p></form></div><img src="skins/larry/images/IIIT_logo.png" id="logo" border="0" alt="Students Mail Server"><div class="box-bottom" style="color:red;"><div id="m"></div></div>').get(null) ; 
		var domComparator = VWO.DOMComparator.create({
		elA : el1, 
		elB : el2 
		}) ; 

			
		var ret = domComparator.compare() ; 
		//expect(ret).toEqual() ;   
		expect(domComparator.verifyComparison()).toEqual(true) ; 

		});
	});









	/*	
		describe('method: Compare', function () {
			it('case :compares the dom trees and outputs the final result', function () {


		var el1 = $('').get(0) ; 
		var el2 = $('').get(0) ; 

		var domComparator = VWO.DOMComparator.create({
		elA : el1, 
		elB : el2 
		}) ; 

		var ret = domComparator.compare() ; 
	//	expect(ret).toEqual() ;   
		expect(domComparator.verifyComparison()).toEqual(true) ; 

		});
	});


*/

})
