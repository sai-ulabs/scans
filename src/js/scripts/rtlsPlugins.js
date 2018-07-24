// jQuery Plugins


(function ($) {

  $.fn.absoluteBoundingRect = function () {
    var doc = document;
    var win = window;
    var body = doc.body;
    var el = $(this)[0];

    // pageXOffset and pageYOffset work everywhere except IE <9
    var offsetX = win.pageXOffset !== undefined ? win.pageXOffset : (doc.documentElement || body.parentNode || body).scrollLeft;
    var offsetY = win.pageYOffset !== undefined ? win.pageYOffset : (doc.documentElement || body.parentNode || body).scrollTop
    var rect = el.getBoundingClientRect()

    if (el !== body) {
      var parent = el.parentNode;

      // The element's rect will be affected by the scroll positions of
      // *all* of its scrollable parents, not just the window, so we have
      // to walk up the tree and collect every scroll offset. Good times.
      while (parent !== body) {
        offsetX += parent.scrollLeft;
        offsetY += parent.scrollTop;
        parent = parent.parentNode;
      }
    }

    return {
      bottom: rect.bottom + offsetY,
      height: rect.height,
      left: rect.left + offsetX,
      right: rect.right + offsetX,
      top: rect.top + offsetY,
      width: rect.width
    };
  };

}(jQuery));



// jQuery UI Plugins