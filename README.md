# DOM Comparator

DOM Comparator is a library that, simply put, compares two strings of DOM nodes (which are called `stringA` and `stringB`), and returns an output containing the minimal number of steps that must be taken (like attribute changes, style changes, text changes and DOM manimpulation) to convert `stringA` into `stringB`.

The output returned by DOM Comparator is an array of `VWO.Operation` objects, which can also be expressed as jQuery code. Here's a simple example:

```js
var stringA = '<ul><li class="active">list item 1</li><li>list item 2</li></ul>';
var stringB = '<ul><li>list item 1</li><li>list item 2</li></ul>';

// Compare the two strings
var result = VWO.DOMComparator.create({
	stringA: stringA,
	stringB: stringB
});

// Expect an array of VWO.Operation objects to be returned.
expect(result).toEqual(jasmine.any(Array));
expect(result[0]).toEqual(jasmine.any(VWO.Operation));

// Expect the first operation to be a 'removeAttr' operation.
expect(result[0].name).toEqual('removeAttr');

// The operation is on an element identified by the following selector path
expect(result[0].selectorPath).toEqual('UL:first-child > LI:first-child');

// With below content
expect(result[0].content).toEqual({class: 'active'});
```

## Setting Up

### Installation

* To install all the dependencies run `npm install`.
* Then run `bower install` for `jasmine`, `jquery` and `underscore` library dependencies.
* Install grunt globally, which is a Javascript Task Runner `npm install -g grunt-cli`.

### Downloads

* [Development version](https://github.com/wingify/dom-comparator/blob/master/dist/dom-comparator.js) (unminified with comments)
* [Production version](https://github.com/wingify/dom-comparator/blob/master/dist/dom-comparator.min.js) (minified)
* [Source map](https://github.com/wingify/dom-comparator/blob/master/dist/dom-comparator.min.js.map)

### Live Demo

A live demo can be found here: http://engineering.wingify.com/dom-comparator/live-demo.html

### Running Tests

* For testing, we use Jasmine.
* Tests are written in the `test/unit` folder. Each file in the `src` directory have different test cases files associataed with them in the `test/unit` directory. The majority of the test cases that test the library as a black box are in `dom-comparator.spec.js`.
* To run tests, run `grunt; testem server;` (from the root directory of the repository)
* To see the final outputs open http://localhost:7357/ in the browser, open the JavaScript console and look for the `final_results` array.

### Cases which don't work
* If there are multiple occurrences of a node in the DOM. For example:

> `nodeA`:
```html
<div style="display: block;">
	<ul class="navigation vwo_1405423029796" style="cursor: auto; display: block;">
	</ul>
	<div class="clr">ORIGINAL TEXT</div>
</div>
```

> `nodeB`:
```html
<div class="clr">ORIGINAL TEXT</div>
<div style="display: block;">
	<ul class="navigation vwo_1405423029796" style="cursor: auto; display: INLINE;">
	</ul>
	<div class="clr">ORIGINAL TEXT</div>
</div>
```

> Here, since there are 2 occurrences of `<div class="clr">ORIGINAL TEXT</div>` in `nodeB`, the exact match of it cannot be found in `nodeA`, due to which the resulted output is not as expected.

* When the wrapping of the original node is changed. For example:

> `nodeA`:
```html
<div style="display: block;">
	<div class="clr">ORIGINAL TEXT</div>
</div>
```

> `nodeB`:
```html
<div>
	<div style="display: block;">
		<div class="clr">ORIGINAL TEXT</div>
	</div>
</div>
```

> Here, since the wrapping of `nodeB` is changed (wrapped by `<div> ... </div>`), the whole content in `nodeB` would be considered as inserted (because matching heirarchy is top to bottom).

## Documentation

The general usage documentation can be found on http://engineering.wingify.com/dom-comparator/

## Authors

* Himanshu Kapoor ([@fleon](http://github.com/fleon))
* Himanshu Kela ([@himanshukela](http://github.com/himanshukela))

## License

[The MIT License](http://opensource.org/licenses/MIT)

Copyright (c) 2014-16 Wingify Software Pvt. Ltd.
