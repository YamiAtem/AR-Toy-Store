AFRAME.registerComponent("marker_handler", {
    init: async function () {
        var toys = await this.get_toys();

        this.el.addEventListener("markerFound", () => {
            var markerId = this.el.id;
            this.handle_marker_found(toys, markerId);
        });

        this.el.addEventListener("markerLost", () => {
            this.handle_marker_lost();
        });
    },
    handle_marker_found: function (toys, markerId) {
        // Changing button div visibility
        var button_div = document.getElementById("button-div");
        button_div.style.display = "flex";

        var order_buttton = document.getElementById("order-button");
        var order_summary_buttton = document.getElementById("order-summary-button");

        // Handling Click Events
        order_buttton.addEventListener("click", () => {
            swal({
                icon: "https://i.imgur.com/4NZ6uLY.jpg",
                title: "Thanks For Order!",
                text: "  ",
                timer: 2000,
                buttons: false
            });
        });

        order_summary_buttton.addEventListener("click", () => {
            swal({
                icon: "warning",
                title: "Order Summary",
                text: "Work In Progress"
            });
        });

        // Changing Model scale to initial scale
        var toy = toys.filter(toy => toy.id === markerId)[0];

        var model = document.querySelector(`#model-${toy.id}`);
        model.setAttribute("position", toy.model_geometry.position);
        model.setAttribute("rotation", toy.model_geometry.rotation);
        model.setAttribute("scale", toy.model_geometry.scale);
    },
    get_toys: async function () {
        return await firebase
            .firestore()
            .collection("toys")
            .get()
            .then(snap => {
                return snap.docs.map(doc => doc.data());
            });
    },
    handle_marker_lost: function () {
        // Changing button div visibility
        var button_div = document.getElementById("button-div");
        button_div.style.display = "none";
    }
});
