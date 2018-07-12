var DragDrop = {
  // A flag variable to disable clone if dragging inside grid
  isInsideTile: false,
  dragStartLocation: null,
  createPaletteItemCopy: function(element) {
    var copy = element.last().clone();
    copy.attr("data-item-type", "computer");
    copy.attr("data-toggle", "modal");
    copy.attr("data-target", "#computerModal");
    copy.addClass("deletable computer");

    // Show Modal when clicked on copy
    copy.on("click", function(e) {
      // Implement modals
      Alerts.assignOrDeleteComputer().done(
        function(value) {
          if (value) {
            $(this).remove();
          }
        }.bind(this)
      );
    });

    // Save computer in database

    copy.draggable({
      containment: ".droppable",
      cancel: false,
      scope: "grid",
      revert: true,
      revertDuration: 10,
      start: function(ev, ui) {
        var tileLocation = $(this).attr("data-location");
        DragDrop.dragStartLocation = JSON.parse(tileLocation);
      },
      drag: function(ev, ui) {
        DragDrop.isInsideTile = true;
      }
    });

    return copy;
  },
  createDraggablePaletteItem: function(selector) {
    var draggableItem = $(selector).draggable({
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
    return draggableItem;
  },
  createDroppableTile: function(selector) {
    $(selector).droppable({
      greedy: true,
      scope: "grid",
      classes: {
        "ui-droppable-active": "ui-state-active",
        "ui-droppable-hover": "ui-state-hover"
      },
      drop: function(ev, ui) {
        ev.preventDefault();

        // Clone the copy of palette-item only if dragging from palette
        var tileLocation = $(this).attr("data-location");

        if (!DragDrop.isInsideTile) {
          var copy = DragDrop.createPaletteItemCopy(ui.draggable);
          copy.attr("data-location", tileLocation);
          $(this).append(copy);
        } else {
          var draggedItem = ui.draggable;
          draggedItem.attr("data-location", tileLocation);
          $(this).append(draggedItem);
        }

        DB.addComputerToDb(
          DragDrop.dragStartLocation,
          JSON.parse(tileLocation)
        );
        // DB.db.computers.push({
        //   buildingId: tileLocation.buildingId,
        //   floorId: tileLocation.floorId,
        //   coordinates: {
        //     x: tileLocation.x,
        //     y: tileLocation.y
        //   }
        // });
      }
    });
  },

  init: function() {
    DragDrop.createDraggablePaletteItem(".palette-item");
    DragDrop.createDroppableTile(".droppable-tile");
    // DragDrop.createContextMenu(".computer", "computer");
  }
};

$(document).ready(function() {
  DragDrop.init();
});
