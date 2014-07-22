---------------------------DOM Comparator------------------------------- 

## Synopsis
DOM-comparator is a JavaScript library that observes changes to the DOM(Document Object Model) which are just lightweight JavaScript objects. 
It tells how the document is different now from how it was, in a very fast manner. 
So given two nodes as input say nodeA(original) and nodeB(Modified), this API shows the minimal number of steps required to transform nodeA 
to nodeB. The steps are given in nice Jquery format(human readable). 

Supported Operations :
1. insertNode
2. deleteNode
3. rearrange 
4. textChange
5. css 
6. removeCss 
7. attr
8. removeAtrr


## Motivation
* Naive approach for DOM-Comparison is to replace new node directly with the old one, but this makes the dynamic content in old dom to become static. 
* To find the rearranges of the nodes within the DOM, so as to keep the references of nodes intact. 
* Considering DOM as a tree, transforming a tree to another is a complex problem and takes O(n^4) computations. This library implements algorithm which have complexity of O(n^2) in worst case, with some assumptions: 
	1. The elements in a DOM are not too similar and can be assigned as unique keys. 
	2. DOM size is not too big (<=1000 elements).
In practice, these assumptions are very negligible for almost all practical use cases.

## Installation
* To install all the dependencies run "npm install" 
* Then run "bower install" for 'jasmine', 'jquery' and 'underscore' library dependencies. 
* Install grunt which is a Javascript Task Runner 
  	"npm install -g grunt-cli"
	
## To run Tests

* For testing Jasmine is used which is behavior-driven development framework for testing JavaScript code. 
* Tests are written in test/unit folder. Each file in DOM/src have different test cases files and final cases can be seen in dom-comparator.spec.js file . 
* For running tests, run "grunt ; testem server" (from home folder... (DOM/)) 
* To see the final outputs open "http://localhost:7357/" in browser, open console and see final_results array. 


## Cases which doesn't work 
* If there are multiple occurrences of a node in the DOM. 
Example: 
nodeA : 
<div style="display: block;">
<ul class="navigation vwo_1405423029796" style="cursor: auto; display: block;">
</ul>
<div class="clr">ORIGINAL TEXT</div>
</div>

nodeB: 
<div class="clr">ORIGINAL TEXT</div>
<div style="display: block;">
<ul class="navigation vwo_1405423029796" style="cursor: auto; display: INLINE;">
</ul>
<div class="clr">ORIGINAL TEXT</div>
</div>

Here, since there are 2 occurrences of "<div class="clr">ORIGINAL TEXT</div>", in nodeB, exact match of it could not be found in nodeA and hence the resulted output is not as expected.


* Wrapping of the original node is changed
Example: 
nodeA: 
<div style="display: block;">
<div class="clr">ORIGINAL TEXT</div>
</div>

nodeB: 
<div>
<div style="display: block;">
<div class="clr">ORIGINAL TEXT</div>
</div>
</div>

Here, since wrapping of nodeB is changed(wrapped by<div> ... </div>), whole content in nodeB would be considered as inserted(Because matching heirchy is top to bottom).



## License

