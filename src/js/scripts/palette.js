$("button#btnCreateRoom").on("click", function (e) {
  Grid.createRoomFromSelection();
});

$("button#btnRemoveBorders").on("click", function (e) {
  Grid.createDivisionFromSelection();
});

$("input#hasImageCheck").on("click", function (e) {
  function recreate() {
    Grid.init();
    DragDrop.init();
  }
  if ($(this).is(":checked")) {
    $(".map-grid-container *").remove();
    Grid.floorHasImage = true;
    recreate();
  } else {
    $(".map-grid-container *").remove();
    Grid.floorHasImage = false;
    recreate();
  }
});

$("button#animage").on("click", function () {
  TweenMax.to(".person", 1, { x: 100, yoyo: true, repeat: 1 });
})



$(document).ready(function () { });


