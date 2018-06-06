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
        }
      ],
      floors: [
        {
          id: "floor-0",
          name: "Floor 0",
          buildingId: "building-0",
          rows: 20,
          cols: 20,
          width: 1000,
          height: 500
        }
      ],
      rooms: [
        {
          id: "room-0",
          name: "Room 0",
          buildingId: "building-0",
          floorId: "floor-0",
          coordinates: [
            // Is array of objects because rooms can be non-rectangular. Then it'll be split into parts of rectangles
            {
              x0: 5,
              y0: 1,
              x1: 5,
              y1: 4,
              x2: 10,
              y2: 0,
              x3: 10,
              y3: 4
            }
          ]
        }
      ],
      computers: []
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
