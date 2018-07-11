function generateComputersList() {
  var computers = DB.getUnassignedComputerList();

  // var list = $("<div class='btn-group-vertical' role='group'></div>");

  // computers.forEach(function(computer, index) {
  //   function assignComputer() {
  //     console.log("here");

  //     DB.db("computers")
  //       .find({ id: computer.id })
  //       .assign({ assigned: true });
  //     console.log(`${computer.name} is assigned`);
  //   }

  //   var computerButton = $(
  //     `<button class='btn btn-default'>${computer.name}</button>`
  //   );

  //   computerButton.on('click')

  //   list.append(computerButton);
  // });

  // return list[0].outerHTML;

  var computerIdName = {};

  computers.forEach(function(computer, i) {
    if (!computerIdName.hasOwnProperty(computer.id)) {
      computerIdName[computer.id] = computer.name;
    }
  });

  return computerIdName;
}

var Alerts = {
  error: function(err) {
    swal({
      type: "error",
      title: err
    });
  },
  inputRoom: function() {
    var dfd = $.Deferred();
    swal({
      title: "Enter the room name",
      input: "text"
    }).then(function(result) {
      if (result.value) {
        dfd.resolve(result.value);
      } else {
        dfd.reject("Room name not entered");
      }
    });

    return dfd.promise();
  },
  assignOrDeleteComputer: function() {
    var dfd = $.Deferred();

    swal({
      title: "Assign Computer",
      input: "select",
      inputOptions: generateComputersList(),
      inputPlaceholder: "Select Computer",
      showCancelButton: true,
      cancelButtonText: "Delete Computer",
      cancelButtonColor: "#d33"
    }).then(function(result) {
      if (result.value) {
        dfd.resolve(result.value);
      }
    });

    return dfd.promise();
  }
};

// $(document).ready(function() {
//   $.contextMenu({
//     selector: ".computer",
//     callback: function(key, options) {
//       if (key === computerDelete) {

//       }

//     },
//     items: {
//       computerDelete: { name: "Delete" }
//     }
//   });

//   $(".computer").on("click", function(e) {
//     console.log("clicked", this);
//   });
// });
