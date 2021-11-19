AFRAME.registerComponent("create_buttons", {
    init: function () {
        // Create the Order button
        var button_1 = document.createElement("button");
        button_1.innerHTML = "ORDER NOW";
        button_1.setAttribute("id", "order-button");
        button_1.setAttribute("class", "btn btn-danger ml-3 mr-3");

        // Create the Bill button
        var button_2 = document.createElement("button");
        button_2.innerHTML = "ORDER SUMMARY";
        button_2.setAttribute("id", "order-summary-button");
        button_2.setAttribute("class", "btn btn-danger ml-3");

        // Create the Rating button
        var button_3 = document.createElement("button");
        button_3.innerHTML = "RATE NOW";
        button_3.setAttribute("id", "rating-button");
        button_3.setAttribute("class", "btn btn-danger ml-3 mr-3");

        // Append
        var button_div = document.getElementById("button-div");
        button_div.appendChild(button_2);
        button_div.appendChild(button_1);
        button_div.appendChild(button_3);
    }
});
