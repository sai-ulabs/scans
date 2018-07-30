window.personIndex = 0;
window.roomId = 0;
window.personColor = "";
var Grid = {
  gridContainer: $(".map-grid-container"),
  floorHasImage: false,
  // rooms: {},

  createPersonShape: function (person) {
    var color = API.getRandomColor(window.personIndex++);
    window.personColor = color;
    var personDiv = $("<i class='fa fa-user fa-2x'></i>")
      .attr("data-type", "person")
      .attr("data-person", person)
      .attr("data-toggle", "tooltip")
      .attr("title", person)
      .css({ color: color })
      .addClass("faa-burst animated person")
      // .addClass("person")
      .clone();



    var legendRect = $("<div></div>").css({
      display: "inline-block",
      height: 20,
      width: 20,
      borderRadius: "50%",
      background: color,
      marginRight: 10
    });

    var name = $("<span></span>")
      .text(person)
      .css({
        color: color
      });

    $(".people-legend").append(
      $("<p></p>")
        .append(legendRect)
        .append(name)
    );

    // return circle.clone().append(personDiv);

    return personDiv;
  },
  removeSelectedBorders: function () {
    $(".ui-selected").css("border", "none");
  },

  createBlockFromDb: function (blockData, blockType) {
    var roomId = window.roomId++;
    var bldg = $("[data-building='" + blockData.buildingId + "']");
    var floor = bldg.find("[data-floor='" + blockData.floorId + "']");
    var blockCoordinates = blockData.coordinates;
    blockCoordinates.forEach(function (blockPart, i) {
      var rows = parseInt(blockPart.x3 - blockPart.x0);
      var cols = parseInt(blockPart.y3 - blockPart.y0);
      for (var i = blockPart.x0; i <= blockPart.x3; i++) {
        for (var j = blockPart.y0; j <= blockPart.y3; j++) {
          var block = floor.find("[data-tile='" + i + "x" + j + "']").css({
            border: "none",
            background: "white"
          });
          if (blockType === "division") {
            // Add properties to block if it is a division
            // block.css("background", "gray");
          } else if (blockType === "room") {
            block.attr("data-tile-type", "room").attr("data-room-id", roomId);
          }
        }
      }
    });
  },
  createRoomFromDb: function (roomData) {
    Grid.createBlockFromDb(roomData, "room");
  },

  createDivisionFromDb: function (divisionData) {
    Grid.createBlockFromDb(divisionData, "division");
  },
  createBlockFromSelection: function (blockType = null) {
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
      .filter(function () {
        // Check if its a row and filter it out
        var attr = $(this).attr("data-row");
        return typeof attr === typeof undefined || attr === false;
      })
      .each(function () {
        var tile = $(this);
        if (blockType === "room") {
          tile.attr("data-tile-type", "room");
        }
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
      .css("border", "none")
      .css("background", "white");

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

  createDivisionFromSelection: function () {
    var newDivision = Object.assign({}, Grid.createBlockFromSelection());
    DB.db
      .get("divisions")
      .push(newDivision)
      .write();
  },
  createRoomFromSelection: function () {
    var newRoom = Object.assign({}, Grid.createBlockFromSelection("room"));

    Alerts.inputRoom()
      .done(function (roomName) {
        var roomId = roomName
          .toLowerCase()
          .replace(/\s/g, "-")
          .replace(/[^\w-]+/g, "");

        newRoom.id = roomId;
        newRoom.name = roomName;

        // Push to config json after room is created

        DB.addRoomToDb(newRoom);
      })
      .catch(function (err) {
        Alerts.error(err);
      });
  },
  getBuildings: function () {
    var buildings = DB.db.get("buildings").value();

    buildings.forEach(function (building, index) {
      // Add building to builder page's building selector
      $("#building-selector").append(
        $("<option>", {
          value: building.id,
          text: building.name
        })
      );
    });
  },
  createTile: function (i, j, tileHeight, tileWidth) {
    var d = $(`<div></div>`);
    d.attr("data-tile", i + "x" + j)
      .attr("data-tile-type", "wall")
      .css({ width: tileWidth, height: tileHeight })
      .addClass("ui-widget-content droppable-tile");

    // $(`#row-${i}`).append(d);
    return d;
  },
  createRow: function (i, rowHeight, rowWidth) {
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
  createGridForBuilding: function (buildingId) {
    var building = DB.db
      .get("buildings")
      .filter({ id: buildingId })
      .value()[0];
    var floorsInBuilding = DB.db
      .get("floors")
      .filter({ buildingId: buildingId })
      .value();

    // Add buliding to the container
    var buildingDiv = $("<div></div>").attr("data-building", building.id);
    Grid.gridContainer.append(buildingDiv);

    // Now in the building build the floors
    floorsInBuilding.forEach(function (floor, index) {
      // Start Floor Buliding
      var floorDiv = Grid.createGridForFloor(building, floor, buildingDiv);

      floorDiv.css({
        marginBottom: "10px"
      });

      // Add floor to the building
      buildingDiv.append(floorDiv);

      // Create Rooms for this floor

      Grid.createRoomsForFloor(building, floor);

      // Create divisions for this floor
      Grid.createDivisionsForFloor(building, floor);

      // Add existing computers for this floor

      Grid.addComputersToFloor(building, floor);

      // End Floor Buliding
    });

    //   // Make Grids selectable
    $(".map-grid").selectable({
      filter: ".droppable-tile"
    });
  },
  createGridForFloor: function (building, floor) {
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
        tile
          .attr(
            "data-location",
            JSON.stringify({
              buildingId: building.id,
              floorId: floor.id,
              x: row,
              y: col
            })
          )
          .css("background", "grey");

        if (hasBackgroundImg) {
          tile.css({ background: "transparent", border: "none" });
        }

        rowDiv.append(tile);
      }
    }

    return floorDiv;
  },
  createRoomsForFloor: function (building, floor) {
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
  createDivisionsForFloor: function (building, floor) {
    var divisions = DB.db
      .get("divisions")
      .filter({ buildingId: building.id, floorId: floor.id });

    for (var division = 0; division < divisions.value().length; division++) {
      var divisionData = divisions.value()[division];
      Grid.createDivisionFromDb(divisionData);
    }
  },
  getTile: function (buildingId, floorId, coordinates) {
    var building = $(`[data-building='${buildingId}']`);

    var floor = building.find(`[data-floor='${floorId}']`);

    var tile = floor.find(`[data-tile='${coordinates.x}x${coordinates.y}']`);

    return tile;
  },
  addComputersToFloor: function (building, floor) {
    DragDrop.init();

    var computersInFloor = DB.db
      .get("computers")
      .filter({ buildingId: building.id, floorId: floor.id })
      .value();

    // Add computer in tile at computer's coordinates
    for (var comp = 0; comp < computersInFloor.length; comp++) {
      let computer = computersInFloor[comp];
      let coordinates = computer.coordinates;
      let tile = Grid.getTile(building.id, floor.id, coordinates);

      let droppableComputer = $(".palette-item-starter")
        .last()
        .clone()
        .css("display", "")
        .attr("data-location", tile.attr("data-location"));
      let copy = DragDrop.createPaletteItemCopy(droppableComputer);
      copy.attr("data-toggle", "tooltip").attr("title", computer.name);
      tile.append(copy);
    }
  },
  getEmptyTileAroundComputer: function (computer) {
    var computer = _.find(DB.db.get("computers").value(), {
      name: computer
    });

    var coords = computer["coordinates"];
    var roomId = computer["roomId"];

    // var roomId =

    // Just in case if all surroundings are occupied, return the last one
    var maxX = coords.x;
    var maxY = coords.y;

    var computerOccupied = DB.db.get("occupiedTiles").value();

    var wallOccupied = [];
    $(`[data-tile-type='wall']`).each(function () {
      var tile = $(this);
      var tileLocation = JSON.parse(tile.attr("data-location"));
      wallOccupied.push({ x: tileLocation.x, y: tileLocation.y });
    });

    var maxSearch = 9;
    for (let i = 0; i < 1000; i++) {
      var radius = Math.random() * 5 + 1;
      var theta = Math.random() * 2 * Math.PI;
      //}
      //for (let radius = 3; radius < maxSearch; radius += 3) {
      //for (let theta = 0; theta < Math.PI * 2; theta += Math.PI / 4) {
      var x = Math.round(Math.cos(theta) * radius + coords.x);
      var y = Math.round(Math.sin(theta) * radius + coords.y);

      var allOccupied = computerOccupied.concat(wallOccupied);
      var isOccupied = _.find(allOccupied, { x: x, y: y });

      if (!isOccupied && x > 0 && y > 0 && x < 19 && y < 19) {
        var domRoomID = $(`[data-tile='${x}x${y}']`).attr("data-room-id");
        if (Number(domRoomID) === Number(roomId)) {
          return { x: x, y: y };
        }
      } else {
        maxX = x;
        maxY = y;
      }
      //}
    }

    return { x: maxX, y: maxY };
  },
  clearPreviousPeopleFromMap: function () {
    $("[data-type='person'").remove();
    $(".people-legend").empty();
    $(".floating-tags").empty();

    window.personIndex = 0;

    DB.db.set("occupiedTiles", []).write();
    DB.db.set("occupiedTiles", DB.defaultOccupiedTiles.slice()).write();
  },
  updateMap: function () {
    // Remove previous people and occupied titles
    var endDate = $("#endDate").val();
    // var debouncedAPICall = _.debounce(API.getPeopleLatestLocation, 500);
    API.getPeopleLatestLocation(endDate).done(function (data) {
      Grid.clearPreviousPeopleFromMap();
      _.map(data, function (person, i) {
        var computer = person.computerName;
        var emptyTile = Grid.getEmptyTileAroundComputer(computer);

        // console.log(emptyTile);

        // Add to occupied tiles before adding person

        DB.db
          .get("occupiedTiles")
          .push(emptyTile)
          .write();

        var invalidUsers = ["TestUser", "TestUser0", "TestUser1", "TestUser2", "TestUser3", "TestUser4", "TestUser5"];

        if (!invalidUsers.includes(person.userName)) {
          var personIcon = Grid.createPersonShape(person.userName);

          var dataTile = `${emptyTile.x}x${emptyTile.y}`;


          var personTileSelector = `[data-tile='${dataTile}']`;
          var personTile = $(personTileSelector);
          personTile.append(personIcon);

          GridUtils.attachFloatingTitle({
            title: person.userName,
            element: personTile,
            color: window.personColor
          });
        }



        // var cX = $(personTile);
        // var cY = personTile.clientY;
      });
    });
  },
  getSafeUpdateMap: function () {
    return _.debounce(Grid.updateMap, 500)
  },
  addPeopleToFloor: function () {
    // For Demo using the hardcoded names
    $("#startScanning").on("click", function () {
      GridUtils.startScanning();
    });
  },
  init: function () {
    Grid.getBuildings();

    // Add change listener for the building to create that building
    $("#building-selector").on("change", function (e) {
      // Clear the center building container when building is changed
      $("#building-title").text($("#building-selector option:selected").text());
      Grid.gridContainer.empty();

      var buildingId = $(this).val();

      Grid.createGridForBuilding(buildingId);
    });

    $("#building-title").text($("#building-selector option:selected").text());

    // Create building for the default building
    Grid.createGridForBuilding($("#building-selector").val());

    // Grid.createGrid();
    // Grid.addComputersToGrid();

    Grid.addPeopleToFloor();
  }
};

$(document).ready(function () {
  Grid.init();


  $("#stopScanning").prop("disabled", true);
  $("#startScanning").prop("disabled", false);
  Grid.clearPreviousPeopleFromMap();

  GridUtils.startScanning();

});
