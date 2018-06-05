$(document).ready(function() {
  var currentDraggingItem = "";
  var itemIds = [];
  var counter = 0;

  var assignedComputerList = [];

  // You can clone only from the palette, once dropped inside tiles
  var isInsideTile = false;

  // ---- Global Variabls End ----

  // Define Functions here

  // Clone the computer/item when dragged from palette
  function getClone(ui) {
    // var copy = $(selector).clone();
    var copy = $(ui.draggable).clone();
    var currentComputer = counter++;
    var currentComputerId = "computer-" + currentComputer;
    copy.attr("id", currentComputerId);
    copy.attr("data-toggle", "modal");
    copy.attr("data-target", "#computerModal");
    copy.addClass("deletable");

    // copy.css("position", "relative");
    copy.on("click", function(e) {
      // createComputerModal(copy);
      modalUtils.showComputerModalOnClick(copy);
    });

    // Even the dropped item should be draggable
    copy.draggable({
      // helper: "clone",
      containment: ".droppable",
      cancel: false,
      scope: "grid",
      revert: true,
      revertDuration: 10,
      drag: function(ev, ui) {
        isInsideTile = true;
        currentDraggingItem = ev.target.id;
      }
    });

    return copy;
  }

  function createDraggable(selector) {
    $(selector).draggable({
      helper: "clone",
      containment: ".droppable",
      cancel: false,
      scope: "grid",
      revert: true,
      revertDuration: 10,
      drag: function(ev, ui) {
        isInsideTile = false;
        // $(this).css("z-index", 1);
        currentDraggingItem = ev.target.id;
        // console.log(currentDraggingItem);
      }
    });
  }

  // create item draggable..
  // Pass different selectors for different items

  createDraggable("#computer");

  $(".droppable-tile").droppable({
    greedy: true,
    // accept: "#rectCopy",
    scope: "grid",
    classes: {
      "ui-droppable-active": "ui-state-active",
      "ui-droppable-hover": "ui-state-hover"
    },
    drop: function(ev, ui) {
      ev.preventDefault();
      var coordinates = $(this).data("coordinates");

      // Cloning should be done only when dragging from the item palette
      if (!isInsideTile) {
        var copy = getClone(ui);
        copy.data("coordinates", coordinates);
        $(this)
          // .css("z-index", 1)
          .append(copy);

        // Show computer modal after dropping first
        modalUtils.showComputerModal(copy);
      } else {
        ui.draggable.data("coordinates", coordinates);
        $(this).append(ui.draggable);
      }
    }
  });
});
