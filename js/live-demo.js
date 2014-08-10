// DOM-comparator code
function initLiveDemo() {
  if (localStorage.getItem('txt1Val')) {
    $('.txt1').val(localStorage.getItem('txt1Val'));
  }
  if (localStorage.getItem('txt2Val')) {
    $('.txt2').val(localStorage.getItem('txt2Val'));
  }
  $(".compare").click(function() {
    VWO.DOMNodePool.clear();

  /*
    window.dom1 = VWO.DOMNodePool.create({
      el: $($('.txt1').val()).get(null)
    });
    window.dom2 = VWO.DOMNodePool.create({
      el: $($('.txt2').val()).get(null)
    });
   */

    window.el1 = $($('.txt1').val()).get(null) ;
    window.el2 = $($('.txt2').val()).get(null) ;

    localStorage.setItem('txt1Val', $('.txt1').val());
    localStorage.setItem('txt2Val', $('.txt2').val());

    var domComparator = VWO.DOMComparator.create({
      elA: el1,
      elB: el2
    });

    var ret = domComparator.compare();
    document.getElementById('output').textContent = JSON.stringify(ret, null, 4);

    var res = domComparator.verifyComparison();
  });
}

