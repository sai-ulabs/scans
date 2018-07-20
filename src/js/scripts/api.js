

var API = {
  scans: {},
  getAllScans: function (endDate) {
    var dfd = $.Deferred();

    var startDate = moment(endDate)
      .subtract(60, "minutes")
      .format("MM/DD/YYYY HH:mm");

    console.group("Scans Window: ");
    console.log("Start Time: " + startDate);
    console.log("End Time: " + endDate);
    console.groupEnd();

    $.get(
      `http://localhost:50045/computers/Getscans?startDate=${startDate}&endDate=${endDate}&recordCount=5000`
    )
      .done(function (data) {
        dfd.resolve(data);
      })
      .fail(function (msg) {
        dfd.reject(msg);
      });

    return dfd.promise();
  },

  getRandomColor: function (i) {
    var colors = [
      "maroon",
      "red",
      "orange",
      "olive",
      "green",
      "purple",
      "fuchsia",
      "lime",
      "teal",
      "aqua",
      "blue",
      "navy",
      "black"
    ];
    return colors[i];
  },
  getPeopleLatestLocation: function (
    endDate = moment().format("MM/DD/YYYY HH:mm")
  ) {
    var dfd = $.Deferred();

    API.getAllScans(endDate).done(function (data) {
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

      var peopleNotHere = [];

      Object.keys(scansByNames).forEach(function (person, i) {
        // Key: User Name
        // Value : List of scans

        var near = {};
        var far = {};
        var results = {};

        var values = scansByNames[person];
        var dataWithOfficeComputers =
          values.filter(function (scan) {
            return computersInOffice.includes(scan.computerName);
          }) || null;

        // If the data has atleast one in-office computer
        if (dataWithOfficeComputers) {
          // var computersFarBefore = [];

          for (let i = 0; i < dataWithOfficeComputers.length; i++) {
            const scan = dataWithOfficeComputers[i];
            const computerName = scan.computerName;
            const timestamp = scan.dateTime;
            const decision = scan.decision;

            if (decision === "Near") {
              if (!near.hasOwnProperty(computerName)) {
                near[computerName] = timestamp;
              }
            } else if (decision === "Far") {
              if (!far.hasOwnProperty(computerName)) {
                far[computerName] = timestamp;
              }
            }
          }

          Object.entries(near).forEach(function (nearEntry) {
            var computerName = nearEntry[0];
            var timestampForNear = nearEntry[1];

            var timestampForFar = far[computerName];

            if (
              timestampForFar &&
              moment.utc(timestampForFar).isAfter(moment.utc(timestampForNear))
            ) {
              // If there is a Far value which comes after Near value for the computer --> 0
              results[computerName] = 0;
            } else {
              // Else the person is still at the computer
              results[computerName] = 1;
            }
          });

          // Find the latest near among the 1's
          var nearComputersForPerson = _.keys(
            _.pickBy(results, function (o) {
              return o === 1;
            })
          );

          // console.log(person, nearComputersForPerson);

          for (var i = 0; i < dataWithOfficeComputers.length; i++) {
            var scan = dataWithOfficeComputers[i];
            if (
              scan.decision === "Near" &&
              nearComputersForPerson.includes(scan.computerName)
            ) {
              latestScans[person] = scan;
              break;
            }
          }
        } else {
          console.log("User wasn't near any office computers");
        }
      });

      // console.log(latestScans);

      var peopleInOffice = {};

      Object.keys(latestScans).forEach(function (key, i) {
        if (latestScans[key]) {
          peopleInOffice[key] = latestScans[key];
        }
      });

      var scansByNames = _
        .chain(data)
        // .filter({ decision: "Near" })
        .groupBy("userName")
        .value();

      // let p = "Sai";

      // for (let i = 0; i < scansByNames[p].length; i++) {
      //   const o = scansByNames[p][i];
      //   if (
      //     o.decision === "Near" &&
      //     computersInOffice.includes(o.computerName)
      //   ) {
      //     // console.log(o);
      //     break;
      //   }
      //   // console.log(o);
      // }

      dfd.resolve(peopleInOffice);
    });
    return dfd.promise();
  },
  getComputerList: function () {
    var dfd = $.Deferred();
    $.get("http://localhost:50045/Computers/GetAllComputers", {
      dataType: "json"
    })
      .done(function (data) {
        dfd.resolve(data);
      })
      .fail(function (msg) {
        dfd.reject(msg);
      });

    return dfd.promise();
  }
};

$(document).ready(function () {
  API.getComputerList();

  // $("#getLocations").on("click", function() {

  //   var endDate = $("#endDatePicker").val();
  //   API.getPeopleLatestLocation(endDate);
  // });
});
