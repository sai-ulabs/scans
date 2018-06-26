$("button#btnCreateRoom").on("click", function(e) {
  Grid.createRoomFromSelection();
});

$("button#btnRemoveBorders").on("click", function(e) {
  Grid.createDivisionFromSelection();
});

$("input#hasImageCheck").on("click", function(e) {
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
