describe('module: DOMNode-Comparator', function () {

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


		var el1 = $('<ul><li>ITEM2</li><li>ITEM3</li><li>ITEM4</li><li>ITEM5</li></ul>').get(0) ; 
		var el2 = $('<ul><li>ITEM1</li><li>ITEM2</li><li>ITEM3</li><li>ITEM4</li><li>ITEM5</li></ul>').get(0) ; 

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

		/*
		describe('method: Compare', function () {
			it('case 3:compares the dom trees and outputs the final result', function () {


		var el1 = $('').get(0) ; 
		var el2 = $('').get(0) ; 

		var domComparator = VWO.DOMComparator.create({
		elA : el1, 
		elB : el2 
		}) ; 


		var ret = domComparator.compare().toJqueryCode() ;
		var output = ret.outerHTML.toString().split('</him')[0].split('DOMComparisonResult">')[1]
		expect(output).toEqual(el2.outerHTML) ; 
		});
		
	});

	*/
})
