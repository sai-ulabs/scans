var Grid = {
  gridContainer: $(".map-grid-container"),
  floorHasImage: false,
  removeSelectedBorders: function() {
    $(".ui-selected").css("border", "none");
  },

  createBlockFromDb: function(blockData, blockType) {
    var bldg = $("[data-building='" + blockData.buildingId + "']");
    var floor = bldg.find("[data-floor='" + blockData.floorId + "']");
    var blockCoordinates = blockData.coordinates;
    blockCoordinates.forEach(function(blockPart, i) {
      var rows = parseInt(blockPart.x3 - blockPart.x0);
      var cols = parseInt(blockPart.y3 - blockPart.y0);
      for (var i = blockPart.x0; i <= blockPart.x3; i++) {
        for (var j = blockPart.y0; j <= blockPart.y3; j++) {
          var block = floor.find("[data-tile='" + i + "x" + j + "']").css({
            border: "none"
          });
          if (blockType === "division") {
            // Add properties to block if it is a division
            // block.css("background", "gray");
          }
        }
      }
    });
  },
  createRoomFromDb: function(roomData) {
    Grid.createBlockFromDb(roomData, "room");
  },

  createDivisionFromDb: function(divisionData) {
    Grid.createBlockFromDb(divisionData, "division");
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
    var newRoom = Object.assign({}, Grid.createBlockFromSelection());

    Alerts.inputRoom()
      .done(function(roomName) {
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
      })
      .catch(function(err) {
        Alerts.error(err);
      });
  },
  getBuildings: function() {
    var buildings = DB.db.get("buildings").value();

    buildings.forEach(function(building, index) {
      // Add building to builder page's building selector
      $("#building-selector").append(
        $("<option>", {
          value: building.id,
          text: building.name
        })
      );
    });
  },
  createTile: function(i, j, tileHeight, tileWidth) {
    var d = $(`<div></div>`);
    d.attr("data-tile", i + "x" + j)
      .css({ width: tileWidth, height: tileHeight })
      .addClass("ui-widget-content droppable-tile");

    // $(`#row-${i}`).append(d);
    return d;
  },
  createRow: function(i, rowHeight, rowWidth) {
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
  },
  createGridForBuilding: function(buildingId) {
    var building = DB.db
      .get("buildings")
      .filter({
        id: buildingId
      })
      .value()[0];
    var floorsInBuilding = DB.db
      .get("floors")
      .filter({
        buildingId: buildingId
      })
      .value();

    // Add buliding to the container
    var buildingDiv = $("<div></div>").attr("data-building", building.id);
    Grid.gridContainer.append(buildingDiv);

    // Now in the building build the floors
    floorsInBuilding.forEach(function(floor, index) {
      // Start Floor Buliding
      var floorDiv = Grid.createGridForFloor(building, floor);

      floorDiv.css({
        marginBottom: "10px"
      });
      // Add floor to the building
      buildingDiv.append(floorDiv);

      // End Floor Buliding
    });
  },
  addRoomsToGrid: function() {},
  createGridForFloor: function(building, floor) {
    // for (var flr = 0; flr < floors.value().length; flr++) {
    //   var floor = floors.value()[flr];
    var floorName = floor.name;
    var rows = floor.rows;
    var cols = floor.cols;
    var floorWidth = floor.width;
    var floorHeight = floor.height;
    var tileWidth = floorWidth / cols;
    var tileHeight = floorHeight / rows;

    var rowHeight = tileHeight;
    var rowWidth = floorWidth;

    // Make it true if the user wants their own floor map
    var hasBackgroundImg = Grid.floorHasImage;
    // Create floor grid to gridContainer
    var floorDiv = $("<div></div>").attr("data-floor", floor.id);

    hasBackgroundImg
      ? floorDiv.addClass("floor-container droppable")
      : floorDiv.addClass("floor-container droppable map-grid");

    // Add width and height to the floorDiv
    floorDiv.addClass("ui-widget-content").css({
      height: floorHeight,
      width: floorWidth,
      background: "lightgreen"
      // margin: "10px",
      // border: "2px solid gray"
    });

    if (hasBackgroundImg) {
      floorDiv.css({
        background: hasBackgroundImg
          ? `url('/src/img/demo-room.png')`
          : // `url('https://picsum.photos/200/100/?random')`
            "white",
        "background-repeat": "no-repeat",
        // "background-size": "cover",
        "background-position": "center"
      });
    }

    for (var row = 0; row < rows; row++) {
      // Row container width = floorWidth
      // Row height = floorHeight / rows
      // var rowHeight = floorHeight / rows;
      var rowDiv = Grid.createRow(row, rowHeight, rowWidth);
      floorDiv.append(rowDiv);

      for (var col = 0; col < cols; col++) {
        var tile = Grid.createTile(row, col, tileHeight, tileWidth);
        tile.attr(
          "data-location",
          JSON.stringify({
            buildingId: building.id,
            floorId: floor.id,
            x: row,
            y: col
          })
        );

        if (hasBackgroundImg) {
          tile.css({ background: "transparent", border: "none" });
        }

        rowDiv.append(tile);
      }
    }

    // Create Rooms for this floor

    Grid.createRoomsForFloor(building, floor);

    // Create divisions for this floor
    Grid.createDivisionsForFloor(building, floor);

    // // Get rooms in the floor on this buliding
    // var rooms = DB.db
    //   .get("rooms")
    //   .filter({ buildingId: building.id, floorId: floor.id });

    // for (var room = 0; room < rooms.value().length; room++) {
    //   var roomData = rooms.value()[room];
    //   Grid.createRoomFromDb(roomData);
    // }

    // Get divisons in the floor on this building
    // var divisions = DB.db
    //   .get("divisions")
    //   .filter({ buildingId: building.id, floorId: floor.id });

    // for (var division = 0; division < divisions.value().length; division++) {
    //   var divisionData = divisions.value()[division];
    //   Grid.createDivisionFromDb(divisionData);
    // }
    return floorDiv;
  },
  createRoomsForFloor: function(building, floor) {
    // Get rooms in the floor on this buliding
    var rooms = DB.db.get("rooms").filter({
      buildingId: building.id,
      floorId: floor.id
    });

    for (var room = 0; room < rooms.value().length; room++) {
      var roomData = rooms.value()[room];
      Grid.createRoomFromDb(roomData);
    }
  },
  createDivisionsForFloor: function(building, floor) {
    var divisions = DB.db
      .get("divisions")
      .filter({ buildingId: building.id, floorId: floor.id });

    for (var division = 0; division < divisions.value().length; division++) {
      var divisionData = divisions.value()[division];
      Grid.createDivisionFromDb(divisionData);
    }
  },
  // createGrid: function() {
  //   var buildings = DB.db.get("buildings");

  //   // // Utility functions for buliding grid
  //   // function createTile(i, j, tileHeight, tileWidth) {
  //   //   var d = $(`<div></div>`);
  //   //   d.attr("data-tile", i + "x" + j)
  //   //     .css({ width: tileWidth, height: tileHeight })
  //   //     .addClass("ui-widget-content droppable-tile");

  //   //   // $(`#row-${i}`).append(d);
  //   //   return d;
  //   // }

  //   // function createRow(i, rowHeight, rowWidth) {
  //   //   var row = $(`<div></div>`);
  //   //   row
  //   //     .attr("id", `row-${i}`)
  //   //     .attr("data-row", `row-${i}`)
  //   //     .css({
  //   //       display: "flex",
  //   //       height: rowHeight,
  //   //       width: rowWidth
  //   //     });
  //   //   // $(".map-grid-container").append(row);
  //   //   return row;
  //   // }

  //   // Loop through all the bulidings
  //   for (var bldg = 0; bldg < buildings.value().length; bldg++) {
  //     var building = buildings.value()[bldg];

  //     // // Temporary to show only building that is shown
  //     // if (building.id !== $("#building-selector").val()) {
  //     //   continue;
  //     // }

  //     var buildingDiv = $("<div></div>").attr("data-building", building.id);

  //     // Add building to grid

  //     Grid.gridContainer.append(buildingDiv);

  //     var floors = DB.db.get("floors").filter({ buildingId: building.id });

  //     // Loop through all the floors in the building
  //     for (var flr = 0; flr < floors.value().length; flr++) {
  //       var floor = floors.value()[flr];
  //       var floorName = floor.name;
  //       var rows = floor.rows;
  //       var cols = floor.cols;
  //       var floorWidth = floor.width;
  //       var floorHeight = floor.height;
  //       var tileWidth = floorWidth / cols;
  //       var tileHeight = floorHeight / rows;

  //       var rowHeight = tileHeight;
  //       var rowWidth = floorWidth;

  //       // Make it true if the user wants their own floor map
  //       var hasBackgroundImg = Grid.floorHasImage;
  //       // Create floor grid to gridContainer
  //       var floorDiv = $("<div></div>").attr("data-floor", floor.id);

  //       hasBackgroundImg
  //         ? floorDiv.addClass("floor-container droppable")
  //         : floorDiv.addClass("floor-container droppable map-grid");

  //       // Add width and height to the floorDiv
  //       floorDiv.addClass("ui-widget-content").css({
  //         height: floorHeight,
  //         width: floorWidth,
  //         background: "lightgreen"
  //         // margin: "10px",
  //         // border: "2px solid gray"
  //       });

  //       if (hasBackgroundImg) {
  //         floorDiv.css({
  //           background: hasBackgroundImg
  //             ? `url('/src/img/demo-room.png')`
  //             : // `url('https://picsum.photos/200/100/?random')`
  //               "white",
  //           "background-repeat": "no-repeat",
  //           // "background-size": "cover",
  //           "background-position": "center"
  //         });
  //       }

  //       for (var row = 0; row < rows; row++) {
  //         // Row container width = floorWidth
  //         // Row height = floorHeight / rows
  //         // var rowHeight = floorHeight / rows;
  //         var rowDiv = Grid.createRow(row, rowHeight, rowWidth);
  //         floorDiv.append(rowDiv);

  //         for (var col = 0; col < cols; col++) {
  //           var tile = Grid.createTile(row, col, tileHeight, tileWidth);
  //           tile.attr(
  //             "data-location",
  //             JSON.stringify({
  //               buildingId: building.id,
  //               floorId: floor.id,
  //               x: row,
  //               y: col
  //             })
  //           );

  //           if (hasBackgroundImg) {
  //             tile.css({ background: "transparent", border: "none" });
  //           }

  //           rowDiv.append(tile);
  //         }
  //       }

  //       // Append floor div to map-grid-container
  //       buildingDiv.append(floorDiv);

  //       // Get rooms in the floor on this buliding
  //       var rooms = DB.db
  //         .get("rooms")
  //         .filter({ buildingId: building.id, floorId: floor.id });

  //       for (var room = 0; room < rooms.value().length; room++) {
  //         var roomData = rooms.value()[room];
  //         Grid.createRoomFromDb(roomData);
  //       }

  //       // Get divisons in the floor on this building
  //       var divisions = DB.db
  //         .get("divisions")
  //         .filter({ buildingId: building.id, floorId: floor.id });

  //       for (
  //         var division = 0;
  //         division < divisions.value().length;
  //         division++
  //       ) {
  //         var divisionData = divisions.value()[division];
  //         Grid.createDivisionFromDb(divisionData);
  //       }
  //     }

  //     // Add building to Grid
  //     Grid.gridContainer.append(buildingDiv);
  //   }

  //   // Make Grids selectable
  //   $(".map-grid").selectable({
  //     filter: ".droppable-tile"
  //   });
  // },

  getTile: function(buildingId, floorId, coordinates) {
    var building = $(`[data-building='${buildingId}']`);
    var floor = building.find(`[data-floor='${floorId}']`);
    var tile = floor.find(`[data-tile='${coordinates.x}x${coordinates.y}']`);
    return tile;
  },
  // addComputersToGrid: function() {
  //   DragDrop.init();
  //   var buildings = DB.db.get("buildings");
  //   for (var bldg = 0; bldg < buildings.value().length; bldg++) {
  //     var building = buildings.value()[bldg];
  //     var floors = DB.db.get("floors").filter({ buildingId: building.id });

  //     for (var flr = 0; flr < floors.value().length; flr++) {
  //       var floor = floors.value()[flr];

  //       var computersInFloor = DB.db
  //         .get("computers")
  //         .filter({ buildingId: building.id, floorId: floor.id })
  //         .value();

  //       // Add computer in tile at computer's coordinates
  //       for (var comp = 0; comp < computersInFloor.length; comp++) {
  //         let computer = computersInFloor[comp];
  //         let coordinates = computer.coordinates;
  //         let tile = Grid.getTile(building.id, floor.id, coordinates);
  //         let droppableComputer = $(".palette-item");
  //         let copy = DragDrop.createPaletteItemCopy(droppableComputer);

  //         tile.append(copy);
  //       }
  //     }
  //   }
  // },
  addComputersToBuilding: function(building) {},
  addComputersToFloor: function(building, floor) {},
  addComputersToGrid: function() {
    DragDrop.init();
    var buildings = DB.db.get("buildings");
    for (var bldg = 0; bldg < buildings.value().length; bldg++) {
      var building = buildings.value()[bldg];
      var floors = DB.db.get("floors").filter({ buildingId: building.id });

      for (var flr = 0; flr < floors.value().length; flr++) {
        var floor = floors.value()[flr];

        var computersInFloor = DB.db
          .get("computers")
          .filter({ buildingId: building.id, floorId: floor.id })
          .value();

        // Add computer in tile at computer's coordinates
        for (var comp = 0; comp < computersInFloor.length; comp++) {
          let computer = computersInFloor[comp];
          let coordinates = computer.coordinates;
          let tile = Grid.getTile(building.id, floor.id, coordinates);
          let droppableComputer = $(".palette-item");
          let copy = DragDrop.createPaletteItemCopy(droppableComputer);

          tile.append(copy);
        }
      }
    }
  },
  init: function() {
    Grid.getBuildings();

    // Add change listener for the building to create that building
    $("#building-selector").on("change", function(e) {
      // Clear the center building container when building is changed

      Grid.gridContainer.empty();

      var buildingId = $(this).val();

      Grid.createGridForBuilding(buildingId);
    });

    // Create building for the default building
    Grid.createGridForBuilding($("#building-selector").val());

    // Grid.createGrid();
    Grid.addComputersToGrid();
  }
};

$(document).ready(function() {
  Grid.init();
});
