var Grid = {
  gridContainer: $(".map-grid-container"),
  createGrid: function() {
    var buildings = DB.db.get("buildings");

    // Utility functions for buliding grid
    function createTile(i, j, tileHeight, tileWidth) {
      var d = $(`<div></div>`);
      d.attr("id", "tile-" + i + "x" + j)
        .css({ width: tileWidth, height: tileHeight })
        .addClass("ui-widget-content droppable-tile");

      // $(`#row-${i}`).append(d);
      return d;
    }

    function createRow(i, rowHeight, rowWidth) {
      var row = $(`<div></div>`);
      row.attr("id", `row-${i}`).css({
        display: "flex",
        height: rowHeight,
        width: rowWidth
      });
      // $(".map-grid-container").append(row);
      return row;
    }

    // Loop through all the bulidings
    for (var bldg = 0; bldg < buildings.value().length; bldg++) {
      var building = buildings.value()[bldg];

      var floors = DB.db.get("floors").filter({ buildingId: building.id });

      // Loop through all the floors in the building
      for (var flr = 0; flr < floors.value().length; flr++) {
        var floor = floors.value()[flr];
        var floorName = floor.name;
        var rows = floor.rows;
        var cols = floor.cols;
        var floorWidth = floor.width;
        var floorHeight = floor.height;
        var tileWidth = floorWidth / cols;
        var tileHeight = floorHeight / rows;

        var rowHeight = tileHeight;
        var rowWidth = floorWidth;

        // Create floor grid to gridContainer
        var floorDiv = $("<div></div>");
        floorDiv.addClass("floor-container droppable map-grid");

        // Add width and height to the floorDiv
        floorDiv.css({
          height: floorHeight,
          width: floorWidth,
          background: "white"
        });

        for (var row = 0; row < rows; row++) {
          // Row container width = floorWidth
          // Row height = floorHeight / rows
          // var rowHeight = floorHeight / rows;
          var rowDiv = createRow(row, rowHeight, rowWidth);
          floorDiv.append(rowDiv);

          for (var col = 0; col < cols; col++) {
            var tile = createTile(row, col, tileHeight, tileWidth);
            tile.attr(
              "data-location",
              JSON.stringify({
                buildingId: building.id,
                floorId: floor.id,
                x: row,
                y: col
              })
            );
            rowDiv.append(tile);
          }
        }

        // Append floor div to map-grid-container
        Grid.gridContainer.append(floorDiv);
      }
    }

    // Make Grids selectable
    $(".map-grid").selectable();
  },

  addRoomsToGrid: function() {},
  addComputerToTile: function() {},
  init: function() {
    Grid.createGrid();
  }
};

$(document).ready(function() {
  Grid.init();
});
