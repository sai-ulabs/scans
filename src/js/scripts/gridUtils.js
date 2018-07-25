// Utilities for grid.js
window.tethers = []


var GridUtils = {
    safeMethods: {
        // Methods are debounced to take care of continuous API calls
        startScanning: null,
        stopScanning: null
    },
    attachFloatingTitle: function (props) {
        $(`[data-name='${props.title}']`).remove();
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
    clearFlotingTitles: function () {
        $(".floating-tags").empty();
    },
    startScanning: function () {

        GridUtils.clearFlotingTitles();
        if (window.mapInterval) {
            clearInterval(window.mapInterval);
        }

        Grid.updateMap();
        window.mapInterval = setInterval(function () {
            Grid.updateMap();
        }, window.interval * 60 * 1000);

        $("#startScanning").prop("disabled", true);
        $("#stopScanning").prop("disabled", false);


        console.log("Scanning Started");

    },
    stopScanning: function () {
        console.log("Checking if scanning exists");

        if (window.mapInterval) {
            clearInterval(window.mapInterval);
            console.log("Clear mapInterval");

            $("#stopScanning").prop("disabled", true);
            $("#startScanning").prop("disabled", false);

            console.log("Scanning Stopped");
        }
    },
    getSafeStartScanning: function () {
        if (!GridUtils.safeMethods.startScanning) {
            GridUtils.safeMethods.startScanning = _.debounce(GridUtils.startScanning, 500, { leading: false, trailing: true });
        }
        return GridUtils.safeMethods.startScanning;
    },
    getSafeStopScanning: function () {
        if (!GridUtils.safeMethods.stopScanning) {
            GridUtils.safeMethods.stopScanning = _.debounce(GridUtils.stopScanning, 500, { leading: false, trailing: true });
        }
        return GridUtils.safeMethods.stopScanning;

    }
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

