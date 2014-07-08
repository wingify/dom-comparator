describe('module: DOMNode-Comparator', function () {

		describe('method: Compare', function () {
			it('case 1:compares the dom trees and outputs the final result', function () {

		var el1 = $('<div class="chapter"><h2>Tutorial</h2><div class="a" style="color:red"></div></div>').get(0) ; 
		var el2 = $('<div class="chapter"><h2>Tutorial311</h2><div class="b" style="color:red"></div></div>').get(0) ; 
	//	var inputEl = $(el1).clone() ; 
	//	var outputEl = $(el2).clone() ; 
		var domComparator = VWO.DOMComparator.create({
		elA : el1, 
		elB : el2 
		}) ; 
		$('<div></div>').append(el1);
		$('<div></div>').append(el2);
		el1 = el1.parentNode ; 
		el2 = el2.parentNode ; 
		domComparator.compare().toJqueryCode().evalForContext(el1) ;
		expect(el1.outerHTML).toEqual(el2.outerHTML) ; 

		});
	});

})
