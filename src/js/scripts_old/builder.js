var Builder = {
  init: function() {
    var dfd = $.Deferred;
    swal
      .mixin({
        input: "text",
        confirmButtonText: "Next &rarr;",
        showCancelButton: true,
        progressSteps: ["1", "2", "3"]
      })
      .queue([
        {
          title: "Buildings",
          text: "How many buildings do you have ?"
        },
        {
          title: "Buildings",
          text: "How many buildings do you have ?"
        },
        {
          title: "Buildings",
          text: "How many buildings do you have ?"
        }
      ])
      .then(result => {
        if (result.value) {
          swal({
            title: "Almost done!",
            html:
              "Your answers: <pre>" + JSON.stringify(result.value) + "</pre>",
            confirmButtonText: "Let's build the maps!"
          });
          dfd.resolve(result.value);
        } else {
          dfd.reject("Please check your answers");
        }
      });
    return dfd.promise();
  }
};
