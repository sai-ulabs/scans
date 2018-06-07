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
  }
};
