var DragDrop = {
  // A flag variable to disable clone if dragging inside grid
  isInsideTile: false,
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

    copy.draggable({
      containment: ".droppable",
      cancel: false,
      scope: "grid",
      revert: true,
      revertDuration: 10,
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
        if (!DragDrop.isInsideTile) {
          var copy = DragDrop.createPaletteItemCopy(ui.draggable);
          $(this).append(copy);
        } else {
          $(this).append(ui.draggable);
        }
      }
    });
  },
  // createContextMenu: function(selector, type) {
  //   $.contextMenu({
  //     selector: ".computer",
  //     callback: function(key, options) {
  //       if (key === computerDelete) {
  //       }
  //     },
  //     items: {
  //       computerDelete: { name: "Delete" }
  //     }
  //   });
  // },
  init: function() {
    DragDrop.createDraggablePaletteItem(".palette-item");
    DragDrop.createDroppableTile(".droppable-tile");
    // DragDrop.createContextMenu(".computer", "computer");
  }
};

$(document).ready(function() {
  DragDrop.init();
});
