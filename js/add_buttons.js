AFRAME.registerComponent("create_buttons", {
    init: function () {
        // 1. Create the Order button
        var button_1 = document.createElement("button");
        button_1.innerHTML = "ORDER NOW";
        button_1.setAttribute("id", "order-button");
        button_1.setAttribute("class", "btn btn-danger ml-3 mr-3");

        // 2. Create the Bill button
        var button_2 = document.createElement("button");
        button_2.innerHTML = "ORDER SUMMARY";
        button_2.setAttribute("id", "order-summary-button");
        button_2.setAttribute("class", "btn btn-danger ml-3");

        // 3. Append somewhere
        var button_div = document.getElementById("button-div");
        button_div.appendChild(button_2);
        button_div.appendChild(button_1);
    }
});
