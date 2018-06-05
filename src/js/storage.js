var Storage = {
  saveMapToStorage: function() {
    var layout = $("#savable-map")
      .clone()
      .html();
    localStorage.setItem("gkhub-map-computers", JSON.stringify(DATA.computers));
    localStorage.setItem("gkhub-map", layout);
  },

  loadMapFromStorage: function() {
    var layout = localStorage.getItem("gkhub-map");
    $("#savable-map").html(layout);
    DragDrop.init();
    $(".map-grid").selectable({
      stop: function() {
        ids = "";
      }
    });

    DragDrop.reloadDraggability("[data-item-type=computer]");
    DragDrop.init();
    $("[data-item-type=computer]").each(function() {
      modalUtils.computerElement = $(this);
      // console.log("Test: " + $(this).attr("data-computer"));
      // console.log("Test: " + modalUtils.computerElement);

      $(this).on("click", function(e) {
        modalUtils.showComputerModalOnClick($(this));
      });
      if ($(this).attr("data-computer")) {
        modalUtils.assignComputer($(this), $(this).attr("data-computer"));
      }
    });
  },

  clearMapDataInStorage: function() {
    localStorage.removeItem("gkhub-map");
  }
};
