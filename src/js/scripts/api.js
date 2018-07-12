var API = {
  scans: {},
  getAllScans: function() {
    var dfd = $.Deferred();
    $.get(
      `http://localhost:50045/computers/Getscans?startDate=07/11/2018 17:55&endDate=07/11/2018 20:35&recordCount=5000`
    )
      .done(function(data) {
        dfd.resolve(data);
      })
      .fail(function(msg) {
        dfd.reject(msg);
      });

    return dfd.promise();
  },

  getRandomColor: function() {
    var letters = "0123456789ABCDEF";
    var color = "#";
    for (var i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
  },
  getPeopleLatestLocation: function() {
    var dfd = $.Deferred();
    API.getAllScans().done(function(data) {
      // console.log(data);
      var computersInOffice = [
        "SVP-DESKTOP",
        "UL-BLACK-04",
        "UL-LAPTOP-06",
        "UL-LAPTOP-07",
        "DESKTOP-C3PEVEC",
        "UL-BLACK-05",
        "COOLCAD-SLIM-03"
      ];

      var scansByNames = _
        .chain(data)
        // .filter({ decision: "Near" })
        .groupBy("userName")
        .value();

      var latestScans = {};

      // var forPerson = "Jamel Lugg";
      // var personData = {
      //   Far: [],
      //   Near: []
      // };

      // console.log(scansByNames["Jamel Lugg"]);

      Object.keys(scansByNames).forEach(function(key, i) {
        var values = scansByNames[key];

        // var lastValue = values[0];
        // console.log(key, lastValue);

        // latestScans[key] =
        //   lastValue.decision === "Near" &&
        //   computersInOffice.includes(lastValue.computerName)
        //     ? lastValue
        //     : null;

        var dataWithOfficeComputers =
          values.filter(function(scan) {
            return computersInOffice.includes(scan.computerName);
          }) || null;

        if (key === "Siddharth Potbhare") {
          console.log(dataWithOfficeComputers);
        }

        // If the data has atleast one in-office computer
        if (dataWithOfficeComputers) {
          var computersFarBefore = [];
          for (let i = 0; i < dataWithOfficeComputers.length; i++) {
            const scan = dataWithOfficeComputers[i];
            if (scan.decision === "Near") {
              if (computersFarBefore.includes(scan.computerName)) {
                console.log(scan.userName + " has left the office");
              } else {
                latestScans[key] = scan;
              }
              break;
            } else {
              !computersFarBefore.includes(scan.computerName) &&
                computersFarBefore.push(scan.computerName);
            }
          }
        } else {
          latestScans[key] = null;
        }

        // latestScans[key] =
        //   values.filter(function(scan) {
        //     return computersInOffice.includes(scan.computerName);
        //   }) || null;
      });

      var peopleInOffice = {};

      Object.keys(latestScans).forEach(function(key, i) {
        if (latestScans[key] !== null) {
          peopleInOffice[key] = latestScans[key];
        }
      });

      console.log(latestScans);
      // console.log(peopleInOffice);

      dfd.resolve(peopleInOffice);
    });
    return dfd.promise();
  },
  getComputerList: function() {
    var dfd = $.Deferred();
    $.get("http://localhost:50045/Computers/GetAllComputers", {
      dataType: "json"
    })
      .done(function(data) {
        dfd.resolve(data);
      })
      .fail(function(msg) {
        dfd.reject(msg);
      });

    return dfd.promise();
  }
};

$(document).ready(function() {
  API.getComputerList();
});
