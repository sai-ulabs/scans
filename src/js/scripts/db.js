var DB = {
  db: null,
  init: function(db) {
    DB.db = db;
    db.defaults({
      userId: "0000",
      buildings: [
        {
          id: "building-0",
          name: "Building-0"
        },
        {
          id: "building-1",
          name: "Building-1"
        }
      ],
      floors: [
        {
          id: "floor-0",
          name: "Floor 0",
          buildingId: "building-0",
          rows: 20,
          cols: 10,
          height: 500,
          width: 500,
          floorMap: ""
        },
        {
          id: "floor-1",
          name: "Floor 1",
          buildingId: "building-0",
          rows: 20,
          cols: 30,
          height: 500,
          width: 1000,
          floorMap: ""
        },
        {
          id: "floor-1",
          name: "Floor 1",
          buildingId: "building-1",
          rows: 20,
          cols: 30,
          height: 500,
          width: 1000
        }
      ],
      rooms: [
        {
          id: "room-0",
          name: "Room 0",
          buildingId: "building-0",
          floorId: "floor-0",
          coordinates: [{ x0: 2, y0: 1, x3: 5, y3: 3 }]
        }
      ],
      divisions: [],
      computers: [
        {
          id: "computer-1",
          name: "Computer 1",
          buildingId: "building-0",
          floorId: "floor-0",
          coordinates: {
            x: 4,
            y: 2
          }
        },
        {
          id: "computer-2",
          name: "Computer 2",
          buildingId: "building-1",
          floorId: "floor-1",
          coordinates: {
            x: 8,
            y: 5
          }
        }
      ]
    }).write();
  }
};

$(document).ready(function() {
  localStorage.removeItem("db");
  var adapter = new LocalStorage("db");
  var db = low(adapter);
  DB.init(db);

  // Defaults if there is no file saved
});
