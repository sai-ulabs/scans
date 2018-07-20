$("#endDate").datetimepicker({
  format: "MM/DD/YYYY HH:mm",
  stepping: window.interval,
  sideBySide: true,
  defaultDate: moment().startOf('hour').format("MM/DD/YYYY HH:mm")
  // inline: true,
});

$(".increment").on("click", function () {
  $("#endDate").val(
    moment($("#endDate").val())
      .add(window.interval, "minutes")
      .format("MM/DD/YYYY HH:mm")
  );
  Grid.updateMap();
});

$(".decrement").on("click", function () {
  $("#endDate").val(
    moment($("#endDate").val())
      .subtract(window.interval, "minutes")
      .format("MM/DD/YYYY HH:mm")
  );
  Grid.updateMap();
});





$("#stopScanning").on("click", function () {
  if (window.mapInterval) {
    clearInterval(window.mapInterval);
    $("#stopScanning").prop("disabled", true);
    $("#startScanning").prop("disabled", false);

    console.log("Scanning Stopped");

  }
})