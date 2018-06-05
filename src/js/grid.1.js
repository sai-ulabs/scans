$(document).ready(function() {
  var x = 20;
  var y = 20;
  var containerWidth = 1000;
  var containerHeight = 500;
  var tileWidth = containerWidth / x;
  var tileHeight = containerHeight / x;

  // ---- End of Variable definitions

  // ---- Start Function definitions

  var Grid = {
    getTile: function(i, j) {
      return $("#" + i + "x" + j);
    },
    createGrid: function() {
      (function createGridContainer() {
        $("#map-grid-container")
          .addClass("droppable map-grid")
          .css({
            display: "flex",
            "flex-direction": "column",
            height: containerHeight,
            width: containerWidth,
            // background is added for testing, when tiles don't fit the container, it'll show red
            background: "red"
          });
      })();

      function addTileToRow(i, j) {
        var d = $(`<div></div>`);
        d
          .attr("id", "tile-" + i + "x" + j)
          .css({ width: tileWidth, height: tileHeight })
          .data("coordinates", { x: i, y: j })
          .data("location", { room: "", floor: "", building: "" })
          .addClass("ui-widget-content droppable-tile bg-white");

        $(`#row-${i}`).append(d);
      }

      function addRowToGrid(i) {
        var row = $(`<div></div>`);
        row.attr("id", `row-${i}`).css({
          display: "flex",
          height: containerHeight / y,
          width: containerWidth
        });
        $("#map-grid-container").append(row);
      }

      for (var i = 0; i < x; i++) {
        addRowToGrid(i);
        for (var j = 0; j < y; j++) {
          addTileToRow(i, j);
        }
      }
    },
    createTrash: function() {
      // Remove Item from trash
      function deleteItemFromTrash(item) {
        if (item.is(".item")) {
          if (item.data().computer) {
            DATA.addComputerBack(item.data().computer);
            console.log("Added computer " + item.data().computer + " back");
          } else {
            console.log("No computer assigned to the item");
          }

          item.fadeOut(function() {
            item.remove();
          });
        }
      }
      $("#map-trash").droppable({
        greedy: true,
        scope: "grid",
        // classes: {
        //   "ui-droppable-active": "map-trash-state-active",
        //   "ui-droppable-hover": "map-trash-state-hover"
        // },
        activate: function(ev, ui) {
          if ($(ui.draggable).hasClass("deletable")) {
            $(this).addClass("map-trash-state-active");
          }
        },
        deactivate: function(ev, ui) {
          if ($(ui.draggable).hasClass("deletable")) {
            $(this).removeClass("map-trash-state-active");
            $(this).removeClass("map-trash-state-hover");
          }
        },
        over: function(ev, ui) {
          if ($(ui.draggable).hasClass("deletable")) {
            $(this).addClass("map-trash-state-hover");
          }
        },
        out: function(ev, ui) {
          if ($(ui.draggable).hasClass("deletable")) {
            $(this).removeClass("map-trash-state-hover");
          }
        },
        drop: function(ev, ui) {
          if ($(ui.draggable).hasClass("deletable")) {
            deleteItemFromTrash(ui.draggable);
          }
        }
      });
    }
  };

  // ---- End of Function definitions

  // 1... Create Grid
  Grid.createGrid();
  // 2... Create Trash
  Grid.createTrash();
});
