$(document).ready(function() {
  $("#btnSaveLayout").on("click", function(e) {
    // var layout = $("#savable-map")
    //   .clone()
    //   .html();
    // localStorage.setItem("map", layout);
    Storage.saveMapToStorage();
  });
  $("#btnLoadLayout").on("click", function(e) {
    // var layout = localStorage.getItem("map");
    // $("#saved-map").html(layout);
    // DragDrop.init();
    // $(".map-grid").selectable({
    //   stop: function() {
    //     ids = "";
    //   }
    // });
    // DragDrop.reloadDraggability("[data-item-type=computer]");
    // $("[data-item-type=computer]").each(function() {
    //   modalUtils.computerElement = $(this);
    //   console.log("Test: " + $(this).attr("data-computer"));
    //   console.log("Test: " + modalUtils.computerElement);
    //   $(this).on("click", function(e) {
    //     modalUtils.showComputerModalOnClick($(this));
    //   });
    //   if ($(this).attr("data-computer")) {
    //     modalUtils.assignComputer($(this), $(this).attr("data-computer"));
    //   }
    // });
  });
  $("#btnStartRealTimeScans").on("click", function(e) {
    HALBERDS.startRealtimeMapping();
  });
});
