describe('module: DOMNode-Comparator', function () {

/*		
		describe('method: Compare', function () {
			it('case 1:compares the dom trees and outputs the final result', function () {

		var el1 = $('<ul class="features-list"><li class="testingfl"><div class="titlemediumbold">Testing</div><div class="text">Easily run A/B tests on your website</div></li><li class="heatmapsfr"><div class="titlemediumbold">Heatmaps</div><div class="text">Track visitors click behavior</div></li><div class="clr"></div><li class="personalizationfl"><div class="titlemediumbold">Personalization</div><div class="text">Show targeted offers to visitors</div></li><li class="user-insightsfr"><div class="titlemediumbold">User Insights</div><div class="text">Get feedback from people on your website</div></li><div class="clr"></div></ul>').get(0) ; 
		var el2 = $('<ul class="features-list"><li class="testingfl"><div class="titlemediumbold">Testing</div><div class="text">Easily run A/B tests on your website</div><h3>Himanshu </h3></li><li class="heatmapsfr"><div class="titlemediumbold">Heatmaps</div><div class="text">Track visitors click behavior</div></li><div class="clr"></div><li class="personalizationfl"><div class="titlemediumbold">Personalization</div><div class="text" style="color: red;">Show targeted offers to visitors</div></li><li class="user-insightsfr"><div class="titlemediumbold">User Insights</div><div class="himanshu">Get feedback people on your website</div></li><div class="clr"></div></ul>').get(0) ; 

		var domComparator = VWO.DOMComparator.create({
		elA : el1, 
		elB : el2 
		}) ; 

		var ret = domComparator.compare().toJqueryCode() ;
		var output = ret.outerHTML.toString().split('</him')[0].split('DOMComparisonResult">')[1]
		expect(output).toEqual(el2.outerHTML) ; 


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

		var ret = domComparator.compare().toJqueryCode() ;
		var output = ret.outerHTML.toString().split('</him')[0].split('DOMComparisonResult">')[1]
		expect(output).toEqual(el2.outerHTML) ; 
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
		var ret = domComparator.compare().toJqueryCode() ;
		var output = ret.outerHTML.toString().split('</him')[0].split('DOMComparisonResult">')[1]
		expect(output).toEqual(el2.outerHTML) ; 

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

		var ret = domComparator.compare().toJqueryCode() ;
		var output = ret.outerHTML.toString().split('</him')[0].split('DOMComparisonResult">')[1]
		expect(output).toEqual(el2.outerHTML) ; 
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

		var ret = domComparator.compare().toJqueryCode() ;
		var output = ret.outerHTML.toString().split('</him')[0].split('DOMComparisonResult">')[1]
		expect(output).toEqual(el2.outerHTML) ; 

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

		expect(domComparator.compare()).toEqual();
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


		var ret = domComparator.compare().toJqueryCode() ;
		var output = ret.outerHTML.toString().split('</him')[0].split('DOMComparisonResult">')[1]
		expect(output).toEqual(el2.outerHTML) ; 
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


		var ret = domComparator.compare().toJqueryCode() ;
		var output = ret.outerHTML.toString().split('</him')[0].split('DOMComparisonResult">')[1]
		expect(output).toEqual(el2.outerHTML) ; 
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


		var ret = domComparator.compare().toJqueryCode() ;
		var output = ret.outerHTML.toString().split('</him')[0].split('DOMComparisonResult">')[1]
		expect(output).toEqual(el2.outerHTML) ; 
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
		
		var ret = domComparator.compare().toJqueryCode() ;
		var output = ret.outerHTML.toString().split('</him')[0].split('DOMComparisonResult">')[1]
		expect(output).toEqual(el2.outerHTML) ; 
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

		expect(domComparator.compare()).toEqual();
			
		});
	});




		describe('method: Compare', function () {
			it('case 13:compares the dom trees and outputs the final result', function () {


		var el1 = $('<ul class="features-list"><li class="testingfl"><div class="titlemediumbold">Testing</div><div class="text">Easily run A/B tests on your website</div></li><li class="heatmapsfr"><div class="titlemediumbold">Heatmaps</div><div class="text">Track visitors click behavior</div></li><div class="clr"></div><li class="personalizationfl"><div class="titlemediumbold">Personalization</div><div class="text">Show targeted offers to visitors</div></li><li class="user-insightsfr"><div class="titlemediumbold">User Insights</div><div class="text">Get feedback from people on your website</div></li><div class="clr"></div></ul>').get(null) ; 
		var el2 = $('<ul class="features-list"><li class="testingfl"><div class="titlemediumbold">Testing</div><div class="text">Easily run A/B tests on your website</div></li><li class="heatmapsfr"><div class="titlemediumbold">Heatmaps</div><div class="text">Track visitors click behavior</div></li><div class="clr"></div><li class="personalizationfl"><div class="titlemediumbold">Personalization</div><div class="text">Show targeted offers to visitors</div></li><li class="user-insightsfr"><div class="text">Get feedback from people on your website</div><div class="titlemediumbold">User Insights</div></li><div class="clr"></div></ul>').get(null) ; 

		var domComparator = VWO.DOMComparator.create({
		elA : el1, 
		elB : el2 
		}) ; 

		expect(domComparator.compare()).toEqual();
			
		});
	});

/*

		describe('method: Compare', function () {
			it('case :compares the dom trees and outputs the final result', function () {


		var el1 = $('<div id="block-menu-menu-global-footer" class="block block-menu first odd" role="navigation"><ul class="menu"><li class="menu__item is-expanded first expanded"><strong>About us</strong><ul class="menu"><li class="menu__item is-leaf first leaf"><a href="/about-us/our-mission" class="menu__link">Who we are</a></li><li class="menu__item is-leaf leaf"><a href="/about-us/our-mission/about-our-ratings" class="menu__link">How we rate and review</a></li><li class="menu__item is-leaf leaf"><a href="/about-us/supporters" class="menu__link">Our supporters</a></li><li class="menu__item is-leaf leaf"><a href="/about-us/press-room/common-sense-media-news" class="menu__link">Press room</a></li><li class="menu__item is-leaf leaf"><a href="/about-us/jobs" class="menu__link">Join our team</a></li><li class="menu__item is-leaf leaf"><a href="/getinvolved" class="menu__link">Donate</a></li><li class="menu__item is-leaf leaf"><a href="/espanol" class="menu__link">Sitio en español</a></li><li class="menu__item is-leaf last leaf"><a href="/contact" class="menu__link">Contact us</a></li></ul><div class="clear"></div></li><li class="menu__item is-expanded expanded"><strong>Our properties and programs</strong><ul class="menu"><li class="menu__item is-leaf first leaf"><a href="http://www.commonsensemedia.org" class="menu__link">Common Sense Media</a></li><li class="menu__item is-leaf leaf"><a href="/educators" class="menu__link">Common Sense Education</a></li><li class="menu__item is-leaf leaf"><a href="/about-us/policy-advocacy/policy-priorities" class="menu__link">Common Sense Advocacy</a></li><li class="menu__item is-leaf leaf"><a href="http://www.graphite.org" class="menu__link">Graphite™ by Common Sense Media</a></li><li class="menu__item is-leaf leaf"><a href="https://www.digitalpassport.org/" class="menu__link">Digital Passport™ by Common Sense Media</a></li><li class="menu__item is-leaf last leaf"><a href="/research" class="menu__link">Program for the Study of Children and Media</a></li></ul><div class="clear"></div></li><li class="menu__item is-expanded last expanded"><strong>Our policies</strong><ul class="menu"><li class="menu__item is-leaf first leaf"><a href="/about-us/our-mission/privacy-policy" class="menu__link">Privacy policy</a></li><li class="menu__item is-leaf leaf"><a href="/about-us/our-mission/site-terms-use" class="menu__link">Terms of use</a></li><li class="menu__item is-leaf last leaf"><a href="/about-us/our-mission/community-guidelines" class="menu__link">Community guidelines</a></li></ul><div class="clear"></div></li></ul><div class="clear"></div></div>').get(0) ; 
		var el2 = $('<ul class="menu"><li class="menu__item is-expanded first expanded"><strong>About us</strong><ul class="menu"><li class="menu__item is-leaf first leaf"><a href="/about-us/our-mission" class="menu__link">Who we are</a></li><li class="menu__item is-leaf leaf"><a href="/about-us/our-mission/about-our-ratings" class="menu__link">How we rate and review</a></li><li class="menu__item is-leaf leaf"><a href="/about-us/supporters" class="menu__link">Our supporters</a></li><li class="menu__item is-leaf leaf"><a href="/about-us/press-room/common-sense-media-news" class="menu__link">Press room</a></li><li class="menu__item is-leaf leaf"><a href="/about-us/jobs" class="menu__link">Join our team</a></li><li class="menu__item is-leaf leaf"><a href="/getinvolved" class="menu__link">Donate</a></li><li class="menu__item is-leaf leaf"><a href="/espanol" class="menu__link">Sitio en español</a></li><li class="menu__item is-leaf last leaf"><a href="/contact" class="menu__link">Contact us</a></li></ul><div class="clear"></div></li><li class="menu__item is-expanded expanded"><strong>Our properties and programs</strong><ul class="menu"><li class="menu__item is-leaf first leaf"><a href="http://www.commonsensemedia.org" class="menu__link">Common Sense Media</a></li><li class="menu__item is-leaf leaf"><a href="/educators" class="menu__link">Common Sense Education</a></li><li class="menu__item is-leaf leaf"><a href="/about-us/policy-advocacy/policy-priorities" class="menu__link">Common Sense Advocacy</a></li><li class="menu__item is-leaf leaf"><a href="http://www.graphite.org" class="menu__link">Graphite™ by Common Sense Media</a></li><li class="menu__item is-leaf leaf"><a href="https://www.digitalpassport.org/" class="menu__link">Digital Passport™ by Common Sense Media</a></li><li class="menu__item is-leaf last leaf"><a href="/research" class="menu__link">Program for the Study of Children and Media</a></li></ul><div class="clear"></div></li><li class="menu__item is-expanded last expanded"><strong>Our policies</strong><ul class="menu"><li class="menu__item is-leaf first leaf"><a href="/about-us/our-mission/privacy-policy" class="menu__link">Privacy policy</a></li><li class="menu__item is-leaf last leaf"><a href="/about-us/our-mission/community-guidelines" class="menu__link">Community guidelines</a></li><li class="menu__item is-leaf leaf"><a href="/about-us/our-mission/site-terms-use" class="menu__link">Terms of use</a></li></ul><div class="clear"></div></li></ul>').get(0) ; 

		var domComparator = VWO.DOMComparator.create({
		elA : el1, 
		elB : el2 
		}) ; 


		expect(domComparator.compare()).toEqual();
		});
	});


*/


		describe('method: Compare', function () {
			it('case 1:compares the dom trees and outputs the final result', function () {


		var el1 = $('<ul><li>IT1</li><li>IT12</li></ul>').get(0) ; 

		var el2 = $('<ul><li>IT12</li><li>IT1</li></ul>').get(0) ; 

		var domComparator = VWO.DOMComparator.create({
		elA : el1, 
		elB : el2 
		}) ; 
		var domComparator = VWO.DOMComparator.create({
		elA : el1, 
		elB : el2 
		}) ; 


		expect(domComparator.compare()).toEqual();
		});
	});



		describe('method: Compare', function () {
			it('case 2:compares the dom trees and outputs the final result', function () {


		var el1 = $('<div><p>IT1</p><span>IT12</span></div>').get(0) ; 

		var el2 = $('<div><span>IT12</span><p>IT1</p></div>').get(0) ; 

		var domComparator = VWO.DOMComparator.create({
		elA : el1, 
		elB : el2 
		}) ; 


		expect(domComparator.compare()).toEqual();
		});
	});

	/*	
		describe('method: Compare', function () {
			it('case 3:compares the dom trees and outputs the final result', function () {


		var el1 = $('<ul><li class="menu__item is-leaf first leaf"><a href="/about-us/our-mission/privacy-policy" class="menu__link">Privacy policy</a></li><li class="menu__item is-leaf leaf"><a href="/about-us/our-mission/site-terms-use" class="menu__link">Terms of use</a></li><li class="menu__item is-leaf last leaf"><a href="/about-us/our-mission/community-guidelines" class="menu__link">Co</a></li></ul>').get(null) ;

		var el2 = $('<ul><li class="menu__item is-leaf first leaf"><a href="/about-us/our-mission/privacy-policy" class="menu__link">Privacy policy</a></li><li class="menu__item is-leaf last leaf"><a href="/about-us/our-mission/community-guidelines" class="menu__link">Co</a></li><li class="menu__item is-leaf leaf"><a href="/about-us/our-mission/site-terms-use" class="menu__link">Terms of use</a></li></ul>').get(null) ; 

		var domComparator = VWO.DOMComparator.create({
		elA : el1, 
		elB : el2 
		}) ; 

		expect(domComparator.compare()).toEqual();
			
		});
	});


		describe('method: Compare', function () {
			it('case :compares the dom trees and outputs the final result', function () {


		var el1 = $('').get(0) ; 
		var el2 = $('').get(0) ; 

		var domComparator = VWO.DOMComparator.create({
		elA : el1, 
		elB : el2 
		}) ; 


		expect(domComparator.compare()).toEqual();
		var ret = domComparator.compare().toJqueryCode() ;
		var output = ret.outerHTML.toString().split('</him')[0].split('DOMComparisonResult">')[1]
		expect(output).toEqual(el2.outerHTML) ; 
		});
	});


*/

})
