var DB = {
  db: null,
  defaultOccupiedTiles: [
    { x: 9, y: 1 },
    { x: 4, y: 1 },
    { x: 4, y: 9 },
    { x: 2, y: 18 },
    { x: 11, y: 18 },
    { x: 11, y: 10 },
    { x: 18, y: 18 }
  ],
  init: function (db) {
    DB.db = db;
    db.defaults({
      userId: "0000",
      occupiedTiles: DB.defaultOccupiedTiles.slice(),
      buildings: [
        {
          id: "building-0",
          name: "Building-0"
        }
        // {
        //   id: "building-1",
        //   name: "Building-1"
        // }
      ],
      floors: [
        {
          id: "floor-0",
          name: "Floor 0",
          buildingId: "building-0",
          rows: 20,
          cols: 20,
          height: 700,
          width: 700,
          floorMap: ""
        }
        // {
        //   id: "floor-1",
        //   name: "Floor 1",
        //   buildingId: "building-0",
        //   rows: 20,
        //   cols: 30,
        //   height: 500,
        //   width: 1000,
        //   floorMap: ""
        // },
        // {
        //   id: "floor-1",
        //   name: "Floor 1",
        //   buildingId: "building-1",
        //   rows: 20,
        //   cols: 30,
        //   height: 500,
        //   width: 1000
        // }
      ],
      rooms: [
        // {
        //   id: "room-0",
        //   name: "Room 0",
        //   buildingId: "building-0",
        //   floorId: "floor-0",
        //   coordinates: [{ x0: 2, y0: 1, x3: 5, y3: 3 }]
        // }
      ],
      divisions: [],
      computers: [
        {
          name: "UL-LAPTOP-07",
          buildingId: "building-0",
          floorId: "floor-0",
          roomId: 0,
          coordinates: {
            x: 9,
            y: 1
          },
          places: [{ x: 9, y: 3 }, { x: 8, y: 4 }]
        },
        {
          name: "DESKTOP-C3PEVEC",
          buildingId: "building-0",
          floorId: "floor-0",
          roomId: 0,
          coordinates: {
            x: 4,
            y: 1
          },
          places: { x: 4, y: 3 }
        },
        {
          name: "UL-BLACK-04",
          buildingId: "building-0",
          floorId: "floor-0",
          roomId: 0,
          coordinates: {
            x: 4,
            y: 9
          },
          places: { x: 4, y: 7 }
        },
        // {
        //   buildingId: "building-0",
        //   floorId: "floor-0",
        //   coordinates: {
        //     x: 4,
        //     y: 10
        //   }
        // },
        {
          name: "COOLCAD-SLIM-03",
          buildingId: "building-0",
          floorId: "floor-0",
          roomId: 0,
          coordinates: {
            x: 2,
            y: 18
          },
          places: { x: 3, y: 16 }
        },
        {
          name: "UL-BLACK-05",
          buildingId: "building-0",
          floorId: "floor-0",
          roomId: 1,
          coordinates: {
            x: 11,
            y: 18
          },
          places: { x: 12, y: 16 }
        },
        {
          name: "UL-LAPTOP-06",
          buildingId: "building-0",
          floorId: "floor-0",
          roomId: 1,

          coordinates: {
            x: 11,
            y: 10
          },
          places: { x: 13, y: 10 }
        },
        // {
        //   buildingId: "building-0",
        //   floorId: "floor-0",
        //   coordinates: {
        //     x: 18,
        //     y: 11
        //   }
        // },
        // {
        //   buildingId: "building-0",
        //   floorId: "floor-0",
        //   coordinates: {
        //     x: 18,
        //     y: 1
        //   }
        // },
        {
          name: "SVP-DESKTOP",
          buildingId: "building-0",
          floorId: "floor-0",
          roomId: 1,

          coordinates: {
            x: 18,
            y: 18
          },
          places: { x: 16, y: 16 }
        }
      ]
    }).write();
  },
  addRoomToDb: function (room) {
    DB.db
      .get("rooms")
      .push(room)
      .write();
  },
  addComputerToDb: function (oldLocation, newLocation) {
    var computers = DB.db.get("computers");

    var newCoordinates = {
      x: newLocation.x,
      y: newLocation.y
    };

    if (computers.find({ coordinates: newCoordinates }).value()) {
      // Update
      alert("Only one computer per a tile");
      console.log("Computer Already exists");
    } else {
      // If old location is null, it's a new computer

      if (oldLocation) {
        var oldCoordinates = { x: oldLocation.x, y: oldLocation.y };
        // Remove in old location
        // console.log(oldCoordinates);
        // console.log("Removing");

        computers.remove({ coordinates: oldCoordinates }).write();
      }

      var newComputer = {
        buildingId: newLocation.buildingId,
        floorId: newLocation.floorId,
        coordinates: newCoordinates
      };
      computers.push(newComputer).write();
    }
  },
  getUnassignedComputerList: function () {
    var computers = DB.db
      .get("computers")
      // .filter({ assigned: false })
      .value();
    return computers;
  }
};

$(document).ready(function () {
  localStorage.removeItem("db");
  var adapter = new LocalStorage("db");
  var db = low(adapter);
  DB.init(db);

  // Defaults if there is no file saved
});
