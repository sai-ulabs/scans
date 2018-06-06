var Grid = {
  gridContainer: $(".map-grid-container"),
  removeSelectedBorders: function() {
    $(".ui-selected").css("border", "none");
  },
  createRoomFromDb: function(roomData) {
    var bldg = $("[data-building='" + roomData.buildingId + "']");
    var floor = bldg.find("[data-floor='" + roomData.floorId + "']");
    var roomCoordinates = roomData.coordinates;
    roomCoordinates.forEach(function(roomPart, i) {
      var rows = parseInt(roomPart.x3 - roomPart.x0);
      var cols = parseInt(roomPart.y3 - roomPart.y0);
      for (var i = roomPart.x0; i <= roomPart.x3; i++) {
        for (var j = roomPart.y0; j <= roomPart.y3; j++) {
          floor.find("[data-tile='" + i + "x" + j + "']").css({
            border: "none"
          });
        }
      }
    });
  },

  createBlockFromSelection: function() {
    var newBlock = {};
    var newBlockCoordinates = {
      x0: 0,
      y0: 0,
      x3: 0,
      y3: 0
    };

    var buildingId = null;
    var floorId = null;

    var selectedBlockTiles = [];
    // Get coordinates of selected including floor and building
    $(".ui-selected")
      .filter(function() {
        // Check if its a row and filter it out
        var attr = $(this).attr("data-row");
        return typeof attr === typeof undefined || attr === false;
      })
      .each(function() {
        var tile = $(this);
        var tileLocation = JSON.parse(tile.attr("data-location"));
        // console.log(tileLocation);
        selectedBlockTiles.push({ x: tileLocation.x, y: tileLocation.y });
        if (buildingId === null) {
          buildingId = tileLocation.buildingId;
        }
        if (floorId === null) {
          floorId = tileLocation.floorId;
        }
      })
      .css("border", "none");

    var tileCount = selectedBlockTiles.length;
    newBlockCoordinates.x0 = selectedBlockTiles[0].x;
    newBlockCoordinates.y0 = selectedBlockTiles[0].y;
    newBlockCoordinates.x3 = selectedBlockTiles[tileCount - 1].x;
    newBlockCoordinates.y3 = selectedBlockTiles[tileCount - 1].y;

    newBlock.buildingId = buildingId;
    newBlock.floorId = floorId;
    newBlock.coordinates = [newBlockCoordinates];

    return newBlock;
  },

  createDivisionFromSelection: function() {
    var newDivision = Object.assign({}, Grid.createBlockFromSelection());
    DB.db
      .get("divisions")
      .push(newDivision)
      .write();
  },
  createRoomFromSelection: function() {
    // var newRoom = {};
    // var newRoomCoordinates = {
    //   x0: 0,
    //   y0: 0,
    //   x3: 0,
    //   y3: 0
    // };

    // var buildingId = null;
    // var floorId = null;

    // var selectedRoomTiles = [];
    // // Get coordinates of selected including floor and building
    // $(".ui-selected")
    //   .filter(function() {
    //     // Check if its a row and filter it out
    //     var attr = $(this).attr("data-row");
    //     return typeof attr === typeof undefined || attr === false;
    //   })
    //   .each(function() {
    //     var tile = $(this);
    //     var tileLocation = JSON.parse(tile.attr("data-location"));
    //     // console.log(tileLocation);
    //     selectedRoomTiles.push({ x: tileLocation.x, y: tileLocation.y });
    //     if (buildingId === null) {
    //       buildingId = tileLocation.buildingId;
    //     }
    //     if (floorId === null) {
    //       floorId = tileLocation.floorId;
    //     }
    //   })
    //   .css("border", "none");

    // var tileCount = selectedRoomTiles.length;
    // newRoomCoordinates.x0 = selectedRoomTiles[0].x;
    // newRoomCoordinates.y0 = selectedRoomTiles[0].y;
    // newRoomCoordinates.x3 = selectedRoomTiles[tileCount - 1].x;
    // newRoomCoordinates.y3 = selectedRoomTiles[tileCount - 1].y;

    // newRoom.buildingId = buildingId;
    // newRoom.floorId = floorId;
    // newRoom.coordinates = [newRoomCoordinates];

    var newRoom = Object.assign({}, Grid.createBlockFromSelection());

    var roomName = prompt("Enter unique room name: ");
    var roomId = roomName
      .toLowerCase()
      .replace(/\s/g, "-")
      .replace(/[^\w-]+/g, "");

    newRoom.id = roomId;
    newRoom.name = roomName;

    // Push to config json after room is created

    DB.db
      .get("rooms")
      .push(newRoom)
      .write();
  },
  createGrid: function() {
    var buildings = DB.db.get("buildings");

    // Utility functions for buliding grid
    function createTile(i, j, tileHeight, tileWidth) {
      var d = $(`<div></div>`);
      d.attr("data-tile", i + "x" + j)
        .css({ width: tileWidth, height: tileHeight })
        .addClass("ui-widget-content droppable-tile");

      // $(`#row-${i}`).append(d);
      return d;
    }

    function createRow(i, rowHeight, rowWidth) {
      var row = $(`<div></div>`);
      row
        .attr("id", `row-${i}`)
        .attr("data-row", `row-${i}`)
        .css({
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

      var buildingDiv = $("<div></div>").attr("data-building", building.id);
      // Add building to grid

      Grid.gridContainer.append(buildingDiv);

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
        var floorDiv = $("<div></div>").attr("data-floor", floor.id);
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
        buildingDiv.append(floorDiv);

        // Get rooms in the floor on this buliding
        var rooms = DB.db
          .get("rooms")
          .filter({ buildingId: building.id, floorId: floor.id });

        for (var room = 0; room < rooms.value().length; room++) {
          var roomData = rooms.value()[room];
          Grid.createRoomFromDb(roomData);
        }
      }

      // Add building to Grid
      Grid.gridContainer.append(buildingDiv);
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
