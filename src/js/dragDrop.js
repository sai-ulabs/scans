var DragDrop = {
  currentDraggingItem: "",
  itemIds: [],
  counter: 0,

  assignedComputerList: [],

  // You can clone only from the palette, once dropped inside tiles
  isInsideTile: false,

  createDraggableCopy: function(copy) {
    copy.each(function(index) {
      $(this).draggable({
        // helper: "clone",
        containment: ".droppable",
        cancel: false,
        scope: "grid",
        revert: true,
        revertDuration: 10,
        drag: function(ev, ui) {
          DragDrop.isInsideTile = true;
        }
      });
    });

    return copy;
  },

  getClone: function(ui) {
    var copy = $(ui.draggable).clone();
    var currentComputer = DragDrop.counter++;
    var currentComputerId = "computer-" + currentComputer;
    copy.attr("id", currentComputerId);
    copy.attr("data-item-type", "computer");
    copy.attr("data-toggle", "modal");
    copy.attr("data-target", "#computerModal");
    copy.addClass("deletable");

    copy.on("click", function(e) {
      modalUtils.showComputerModalOnClick(copy);
    });

    // Even the dropped item should be draggable
    copy = DragDrop.createDraggableCopy(copy);

    return copy;
  },

  reloadDraggability: function(selector) {
    DragDrop.createDraggableCopy($(selector));
  },
  createDraggable: function(selector) {
    $(selector).draggable({
      helper: "clone",
      containment: ".droppable",
      cancel: false,
      scope: "grid",
      revert: true,
      revertDuration: 10,
      drag: function(ev, ui) {
        DragDrop.isInsideTile = false;
      }
    });
  },
  createDroppable: function(selector) {
    $(selector).droppable({
      greedy: true,
      // accept: "#rectCopy",
      scope: "grid",
      classes: {
        "ui-droppable-active": "ui-state-active",
        "ui-droppable-hover": "ui-state-hover"
      },
      drop: function(ev, ui) {
        ev.preventDefault();
        var coordinates = $(this).attr("data-coordinates");

        // Cloning should be done only when dragging from the item palette
        if (!DragDrop.isInsideTile) {
          var copy = DragDrop.getClone(ui);
          copy.attr("data-coordinates", coordinates);
          $(this)
            // .css("z-index", 1)
            .append(copy);

          // Show computer modal after dropping first
          modalUtils.showComputerModal(copy);
        } else {
          ui.draggable.attr("data-coordinates", coordinates);
          $(this).append(ui.draggable);
        }
        Storage.saveMapToStorage();
      }
    });
  },
  init: function() {
    DragDrop.createDraggable(".palette-computer");
    DragDrop.createDroppable(".droppable-tile");
  }
};

$(document).ready(function() {
  DragDrop.init();
});
