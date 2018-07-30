var mouse = {}

var GridUtils = {}

function Grid() {
  this.roomPlan = $("<div></div>").css({
    position: "absolute",
    // backgroundColor: "rgba(57, 70, 78, 0.8)",
    backgroundColor: "#ccc",
    zIndex: 2
  });

  this.gridUtils = Object.assign({}, GridUtils);

  this.floorPlan = $(".canvas").css({
    boxSizing: "border-box",
    margin: 0,
    padding: 0
  });
}


Grid.prototype.getRoomCopy = function () {
  return this.roomPlan.last().clone();
}

Grid.prototype.getFloorCopy = function () {
  var self = this;
  this.floorPlan.selectable({
    start: function (e) {
      mouse.startX = e.clientX;
      mouse.startY = e.clientY;
    },
    stop: function (e) {
      mouse.endX = e.clientX;
      mouse.endY = e.clientY;
      self.createRoom();
    }
  });
  return this.floorPlan;
}

Grid.prototype.createRoom = function () {
  var floor = this.getFloorCopy();
  var block = this.getRoomCopy();

  var floorPosition = floor.absoluteBoundingRect();


  var roomLeft = mouse.startX - floorPosition.left + window.pageXOffset;
  var roomTop = mouse.startY - floorPosition.top + window.pageYOffset;

  if (mouse.startX > mouse.endX) {
    // This means room is drawn to left
    roomLeft = mouse.endX - floorPosition.left + window.pageXOffset;

  }
  if (mouse.startY > mouse.endY) {
    // This means room is drawn from bottom
    roomTop = mouse.endY - floorPosition.top + window.pageYOffset;

  }


  var roomWidth = Math.abs(mouse.endX - mouse.startX);
  var roomHeight = Math.abs(mouse.endY - mouse.startY);

  block.css({
    left: roomLeft,
    top: roomTop,
    width: roomWidth,
    height: roomHeight,
    cursor: "move"
  })
    .draggable({
      containment: "parent",
    })
    .resizable({
      containment: "parent",
      handles: "n, e, s, w, nw, ne, se, sw"
    }).rotatable();

  floor.append(block);
}

Grid.prototype.init = function () {
  // Initiate Floor functionality

  console.log("Initiating");

  this.getFloorCopy();
}



$(function () {

  var grid = new Grid();

  grid.init();


  $("body").mousedown(function (e) {
    // console.log(e.clientX, e.clientY);
  })

  $(window).on('resize', function () {
    // canvasPosition = canvas.absoluteBoundingRect();
  })


})
