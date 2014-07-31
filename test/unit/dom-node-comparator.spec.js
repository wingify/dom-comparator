describe('module: DOMNode-Comparator', function () {
  describe('method: nodeName', function () {
    it('compares how closely doms are related', function () {
      var domNode = VWO.DOMNodeComparator.create({
        nodeA: VWO.DOMNode.create({
          el: $('<div class="chapter 1">   <div class="prev"><a class="chapter" href="/default.asp" style=color:blue>W3Schools Home</a></div>       <h2>Tutorial</h2>          <h3> Hello </h3>         </div>').get(0)
        }),
        nodeB: VWO.DOMNode.create({
          el: $('<div class="chapter">   <h2>Tutorial311</h2>    <div class="prev"><a class="chapter12" href="/default.asp" style=color:red>W3Schools Home</a></div>       <h2>Tutorial</h2>   </div>').get(0)
        })
      });

      expect(domNode.indexScore()).toBe(1);
      expect(domNode.nodeTypeScore()).toBe(1);
      expect(domNode.innerTextScore()).toBe(0); // inner text dont match
      expect(domNode.innerHTMLScore()).toBe(0);
      expect(domNode.nodeNameScore()).toBe(1);
      expect(domNode.parentScore()).toBe(0);
      expect(domNode.nextSiblingScore()).toBe(1);
      expect(domNode.previousSiblingScore()).toBe(1);


      // For Node A ... Children details
      expect(domNode.nodeA.children().length).toBe(3);
      expect(domNode.nodeA.children()[2].outerHTML()).toBe('<h3> Hello </h3>');


      expect(domNode.childrenScore()).toEqual(0.6666666666666666);

      // Attributes score
      expect(domNode.attributeScore()).toEqual(0); // <class = chapter 1>  vs <class = chapter>
      expect(domNode.addedAttributes()).toEqual({});
      expect(domNode.changedAttributes()).toEqual({
        class: 'chapter'
      });
      expect(domNode.removedAttributes()).toEqual({});

      expect(domNode.styleScore()).toEqual(1);

      // Based on criteria
      expect(domNode.finalScore()).toEqual(0.13333333333333333);


    });
  });
})