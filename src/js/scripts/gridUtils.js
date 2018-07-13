// Utilities for grid.js
window.tethers = []


var GridUtils = {
    attachFloatingTitle: function (props) {
        var tetherTag = $(`<div>${props.title}</div>`).css({
            height: 10,
            display: "block",
            color: props.color
        }).attr("data-name", props.title)

        $(".floating-tags").append(tetherTag.clone())

        var titleTether = new Tether({
            element: $(`[data-name='${props.title}']`),
            target: props.element,
            attachment: 'top right',
            targetAttachment: 'top left',
        });

        window.tethers.push(titleTether);
    },
    startScanning: function () {

        Grid.updateMap();
        window.mapInterval = setInterval(function () {
            Grid.updateMap();
        }, 15 * 60 * 1000);

        $("#startScanning").prop("disabled", true);
        $("#stopScanning").prop("disabled", false);


        console.log("Scanning Started");

    },
    stopScanning: function () {
        if (window.mapInterval) {
            clearInterval(window.mapInterval);
            $("#stopScanning").prop("disabled", true);
            $("#startScanning").prop("disabled", false);

            console.log("Scanning Stopped");
        }
    },
}




$("#toggleNames").on('click', function () {
    var isChecked = this.checked;

    window.tethers.forEach(function (tether) {
        if (isChecked) {
            if (!tether.enabled) {
                $(".floating-tags").show();
                tether.enable();
            }
        } else {
            if (tether.enabled) {
                tether.disable();
                $(".floating-tags").hide();
            }
        }
    })
})

