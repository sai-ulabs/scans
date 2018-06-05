var modalUtils = (function() {
  var computerElement = "";

  var addToolTipToComputer = function(computer) {
    var computerName = computer.attr("data-computer");

    var hasComputer = computerName && computerName.length ? true : false;
    computer.popover("dispose");
    computer.popover({
      html: true,
      placement: "right",
      trigger: "hover",
      title: `
        <h6>${hasComputer ? computerName : "No computer assigned yet"}</h6>
      `
    });
  };

  var assignComputer = function(computerElement, computerName) {
    // Check if there is already a computer assigned
    var existingComputer = computerElement.attr("data-computer");

    if (existingComputer !== undefined) {
      // console.log("Already has a computer " + existingComputer);
      // console.log("Reassigning to " + computerName);
      DATA.addComputerBack(existingComputer);
    }

    computerElement.attr("data-computer", computerName);

    var slugForComputerId = createSlug(computerName);

    computerElement.attr("data-computer-id", slugForComputerId);
    addComputerWithId(computerName, slugForComputerId);
    // console.log(computerName, computerElement.attr("id"));

    // Everytime new computer name is assigned, change the tooltip to reflect the change
    addToolTipToComputer(computerElement);
    // Close modal after assigning computer
    $("#computerModal").modal("hide");
    DATA.addComputerToAssignedList(computerName);

    Storage.saveMapToStorage();
    //TODO: Get probabilities after adding
    HALBERDS.getProbabilities();
  };

  var createComputerButton = function(computerName) {
    var newBtn = $("<button></button>");
    newBtn.text(computerName);
    newBtn.addClass("list-group-item list-group-item-action");
    newBtn.on("click", function() {
      assignComputer(computerElement, computerName);
    });

    return newBtn;
  };

  var updateComputerListOnSearch = function(searchTerm) {
    var cmpBtnContainer = $("<div></div>");
    if (searchTerm === "") {
      $.each(DATA.getComputerList(), function(i, computer) {
        var newButton = createComputerButton(computer);
        cmpBtnContainer.append(newButton);
      });
    } else {
      $.each(DATA.getComputerList(), function(i, computer) {
        if (computer.toLowerCase().includes(searchTerm.toLowerCase())) {
          var newButton = createComputerButton(computer);
          cmpBtnContainer.append(newButton);
        }
      });
    }

    $("#modalComputerList").empty();
    $("#modalComputerList").append(cmpBtnContainer);
    // return output;
  };

  var createComputerModal = function() {
    // Delete any previous DOM in modal
    $("#item-modal").empty();
    // modalDom is defined in globals.js
    $("#item-modal").append(modalDOM);

    // Build modal form without any searchTerm
    updateComputerListOnSearch("");

    var form = $("#searchComputerModalForm");

    // Automatically focus computer search input
    $("#computerModal").on("shown.bs.modal", function() {
      $("#computerInput").trigger("focus");
    });

    $("#computerInput").on("input", function(e) {
      e.preventDefault();
      var searchTerm = $("#computerInput").val();
      updateComputerListOnSearch(searchTerm);
    });

    // Computer list should narrow down upon submit (Press Enter) or on input change
    form.on("submit", function(e) {
      e.preventDefault();
      var searchTerm = $("#computerInput").val();
      updateComputerListOnSearch(searchTerm);
    });
  };

  var showComputerModal = function(computer) {
    computerElement = computer;
    createComputerModal();
    addToolTipToComputer(computer);
    $("#computerModal").modal({ show: true });
  };

  var showComputerModalOnClick = function(computer) {
    computerElement = computer;
    createComputerModal();
    addToolTipToComputer(computer);
  };

  return {
    showComputerModal: showComputerModal,
    showComputerModalOnClick: showComputerModalOnClick,
    assignComputer: assignComputer,
    computerElement: computerElement
  };
})();
