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
      title: "",
      confirmButtonText: "Delete Computer",
      confirmButtonColor: "#d33"
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
