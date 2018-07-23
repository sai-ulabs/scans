var mouse = {}

var rect = $("<div></div>").css({
  position: "absolute",
  backgroundColor: "rgba(57, 70, 78, 0.8)",
  zIndex: 2
});

var canvas = $(".canvas").css({
  boxSizing: "border-box",
  margin: 0,
  padding: 0
});

var canvasPosition = canvas.get(0).getBoundingClientRect();

var roomProperties = {

}



function createRectangle() {
  var block = rect.last().clone();

  var rectLeft = mouse.startX - canvasPosition.left;
  var rectTop = mouse.startY - canvasPosition.top;

  if (mouse.startX > mouse.endX) {
    // This means rectangle is drawn to left
    rectLeft = mouse.endX - canvasPosition.left;

  }
  if (mouse.startY > mouse.endY) {
    // This means reactangle is drawn from bottom
    rectTop = mouse.endY - canvasPosition.top;

  }


  var rectWidth = Math.abs(mouse.endX - mouse.startX);
  var rectHeight = Math.abs(mouse.endY - mouse.startY);

  block.css({
    left: rectLeft,
    top: rectTop,
    width: rectWidth,
    height: rectHeight,
    cursor: "move"
  })
    .draggable({
      containment: "parent",

    })
    .resizable({
      containment: "parent",
      handles: "n, e, s, w, nw, ne, se, sw"
    });
  canvas.append(block);
}

$(function () {

  canvas.selectable({
    start: function (e) {
      mouse.startX = e.clientX;
      mouse.startY = e.clientY;
    },
    stop: function (e) {
      mouse.endX = e.clientX;
      mouse.endY = e.clientY;
      createRectangle();
    }
  });


  $("body").mousedown(function (e) {
    console.log(e.clientX, e.clientY);
  })


})
