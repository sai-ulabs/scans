var HALBERDS = {
  getTileNumberToPutHalberd: function(coordinates) {
    if (!coordinates) {
      return;
    }
    var inputX = coordinates.x;
    var inputY = coordinates.y;
    var resultX = 0;
    var resultY = 0;

    if (inputX + 1 < x) {
      if (inputY + 1 < y) {
        return { x: inputX + 1, y: inputY + 1 };
      }
    }
  },
  putTheHalberdInTile: function(coordinates) {
    for (var i = 0; i < x; i++) {
      for (var j = 0; j < y; j++) {
        $("#tile-" + i + "x" + j)
          .has(".halberd")
          .find(".halberd")
          .fadeOut();
      }
    }
    var halberd = $("<div></div>");
    halberd.addClass("halberd");
    halberd.addClass("halberd-copy");
    halberd.css("position", "absolute");
    var tile = $("#tile-" + coordinates.x + "x" + coordinates.y);

    tile
      .css("position", "relative")
      .append(halberd)
      .fadeIn();
  },
  getProbabilities: function(start = false) {
    var computers = DATA.getAssignedComputers();
    var probs = DATA.getProbabilitiesForHalberd("h1");

    var closestComputer = "";
    var closestProbability = 0;

    // console.clear();
    computers.forEach(function(c, i) {
      // console.log(c + " : " + probs[i]);

      if (probs[i] > closestProbability) {
        closestComputer = c;
        closestProbability = probs[i];
      }
    });

    // console.log("Closest Computer: " + closestComputer);
    // console.log("Closest Prob: " + closestProbability);
    // console.log("Closest Comp Id: " + getDOMIdForComputer(closestComputer));

    // var closestComputerGrid = $("#" + getDOMIdForComputer(closestComputer));
    var closestComputerGrid = $(
      "[data-computer-id=" + getDOMIdForComputer(closestComputer) + "]"
    );
    closestGridCoordinates = closestComputerGrid.attr("data-coordinates");

    var coordsForHalberd = HALBERDS.getTileNumberToPutHalberd(
      closestGridCoordinates
    );
    if (start) {
      HALBERDS.putTheHalberdInTile(coordsForHalberd);
    }
    // console.log(closestComputer + " " + closestProbability);
  },
  startRealtimeMapping: function() {
    setInterval(function() {
      HALBERDS.getProbabilities(true);
    }, 1000);
  }
};
