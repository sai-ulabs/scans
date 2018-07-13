$("#endDate").datetimepicker({
  format: "MM/DD/YYYY HH:mm",
  stepping: 15,
  sideBySide: true,
  defaultDate: moment().startOf('hour').format("MM/DD/YYYY HH:mm")
  // inline: true,
});

$(".increment").on("click", function () {
  $("#endDate").val(
    moment($("#endDate").val())
      .add(15, "minutes")
      .format("MM/DD/YYYY HH:mm")
  );
  Grid.updateMap();
});

$(".decrement").on("click", function () {
  $("#endDate").val(
    moment($("#endDate").val())
      .subtract(15, "minutes")
      .format("MM/DD/YYYY HH:mm")
  );
  Grid.updateMap();
});
