describe('module: DomNode-match-finder', function () {
  describe('case:1 method: nodeName', function () {
    it('gets the name of the node', function () {

      var domNode = VWO.DOMNodeStringPointer.create({
        haystack: '<div class="chapter"><div class="prev"><a class="chapter" href="/default.asp" style=color:red>W3Schools Home</a></div><h2>Tutorial</h2></div>'
      });

      expect(domNode.allNodePointers()[1].index).toBe(21); // <div class = "prev"....
      expect(domNode.allNodePointers()[2].index).toBe(39); // <a ....

      expect(domNode.nodeType()).toBe(1); // DIV element
      expect(domNode.nodeName()).toBe('DIV'); // <a ....
      expect(domNode.pointsToClosingTag()).toBe(false);

      expect(domNode.pointsToEmptyTag()).toBe(false);
    });
  });


  describe('method: Previous Pointer', function () {
    it('returns pointer for last index of < , > , <!-- , <![CDATA[ sections ', function () {

      var domNode = VWO.DOMNodeStringPointer.create({
        haystack: '<div class="chapter"><div class="prev"><a class="chapter" href="/default.asp" style=color:red>W3Schools Home</a></div><h2>Tutorial</h2></div>'
      });

      expect(domNode.allNodePointers()[1].previousPointer().index).toBe(20); // pointer of last closing tag <


    });
  });


  describe('method: previousSiblingPointer', function () {
    it('returns pointer for last index of < , > , <!-- , <![CDATA[ sections of previous sibling', function () {

      var domNode = VWO.DOMNodeStringPointer.create({
        haystack: '<div class="chapter"></div><div class="b"></div>'
      });

      expect(domNode.allNodePointers()[2].previousSiblingPointer().index).toBe(26); //  pointing to pointer before <div class="b"
      expect(domNode.allNodePointers()[3].previousSiblingPointer().index).toBe(26); //  pointing to pointer before <div class="b"


    });
  });


  describe('method: nextPointer', function () {
    it('Pointing to the next pointer', function () {

      var domNode = VWO.DOMNodeStringPointer.create({
        haystack: '<div class="chapter"><div class="prev"><a class="chapter" href="/default.asp" style=color:red>W3Schools Home</a></div><h2>Tutorial</h2></div>'
      });

      expect(domNode.allNodePointers()[1].nextPointer().index).toBe(39); // Pointing to <a class="chapter"

    });
  });

  describe('method: nextSiblingPointer', function () {
    it('Pointer Pointing to next node dom sibling ', function () {

      var domNode = VWO.DOMNodeStringPointer.create({
        haystack: '<div class="chapter"></div><div class="b"></div>'
      });
      expect(domNode.allNodePointers()[0].nextSiblingPointer().index).toBe(27); // Pointing to ....<div class="b"
      expect(domNode.allNodePointers()[1].nextSiblingPointer().index).toBe(27); // Pointing to ....<div class="b"

    });
  });


  describe('method: parentPointer()', function () {
    it('gives the pointer to the parent node', function () {

      var domNode = VWO.DOMNodeStringPointer.create({
        haystack: '<div class="chapter"><div class="prev"><a class="chapter">HI Hello </a></div><h2>Tutorial</h2></div>'
      });

      expect(domNode.allNodePointers()[1].parentPointer().index).toBe(20); // just before 21 <div class="prev"

    });
  });


  describe('method: MasterIndex', function () {
    it(' Returns a colon delimited master index of node at the current index', function () {

      var domNode = VWO.DOMNodeStringPointer.create({
        haystack: '<div class="chapter"><div class="prev"><a class="chapter" href="/default.asp" style=color:red>W3Schools Home</a></div><h2>Tutorial</h2></div>'
      });

      expect(domNode.masterIndex()).toBe('0');
      expect(domNode.allNodePointers()[1].masterIndex()).toBe('0:0');
      expect(domNode.allNodePointers()[2].masterIndex()).toBe('0:0:0');
      expect(domNode.allNodePointers()[3].masterIndex()).toBe('0:0:0:0');
      expect(domNode.allNodePointers()[6].masterIndex()).toBe('0:1'); // 1 for div completion
      expect(domNode.allNodePointers()[7].masterIndex()).toBe('0:1:0'); // 1 for div completion
      expect(domNode.allNodePointers()[8].masterIndex()).toBe('0:1');

      var domNode1 = VWO.DOMNodeStringPointer.create({
        haystack: '<div class="chapter"></div><div class="b"></div>'
      });
      expect(domNode.masterIndex()).toBe('0');
      expect(domNode.allNodePointers()[1].masterIndex()).toBe('0:0');
      expect(domNode.allNodePointers()[2].masterIndex()).toBe('0:0:0');
      expect(domNode.allNodePointers()[3].masterIndex()).toBe('0:0:0:0');

    });
  });

})