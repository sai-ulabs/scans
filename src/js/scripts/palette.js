$(".palette button#btnCreateRoom").on("click", function(e) {
  Grid.createRoomFromSelection();
});

$(".palette button#btnRemoveBorders").on("click", function(e) {
  Grid.createDivisionFromSelection();
});
