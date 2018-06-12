$(document).ready(function() {
  $("#btnZoomFloor").on("click", function(e) {
    console.log("clicking");
    $(".floor-container").resizable({
      alsoResize: "#" + $(this).attr("class") + " *"
    });
  });
});
