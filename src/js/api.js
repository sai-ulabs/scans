var DATA = {
  computers: JSON.parse(localStorage.getItem("gkhub-map-computers")) || [],
  computerCount: 0,
  assignedComputers: [],
  defaultComputers: [
    "Computer 1",
    "Computer 2",
    "Computer 3",
    "Computer 4",
    "Computer 5",
    "SVP-DESKTOP",
    "SID-VM-WIN10",
    "SAI's COMPUTER"
  ],
  sortComputersByName: function() {
    DATA.computers.sort();
  },
  getComputerList: function() {
    DATA.computers = DATA.computers.length
      ? DATA.computers
      : DATA.defaultComputers.slice();
    DATA.sortComputersByName();
    DATA.computerCount = DATA.computers.length;
    return DATA.computers;
  },
  getComputerCount: function() {
    return computerCount;
  },
  addComputerToAssignedList: function(computer) {
    DATA.assignedComputers.push(computer);
    DATA.computers = DATA.computers.filter(function(cmp) {
      return cmp !== computer;
    });
    DATA.sortComputersByName();
  },
  addComputerBack: function(computer) {
    DATA.computers.push(computer);
    DATA.sortComputersByName();
  },
  getAssignedComputers: function() {
    return DATA.assignedComputers;
  },
  getProbabilitiesForHalberd: function(halberd) {
    var count = DATA.assignedComputers.length;
    var tempSum = 0;
    var randoms = [];
    var probs = [];
    for (var i = 0; i < count; i++) {
      var r = Math.random();
      // console.log(r);

      randoms.push(parseFloat(r));
      tempSum += parseFloat(r);
    }

    // console.log(tempSum);

    $.each(randoms, function(i, p) {
      probs.push(parseFloat(p / tempSum) * 1.0);
    });

    return probs;
  }
};
