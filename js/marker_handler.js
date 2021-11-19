var uid = null;

AFRAME.registerComponent("marker_handler", {
    init: async function () {
        var toys = await this.get_toys();

        if (uid === null) {
            this.ask_user_id();
        }

        this.el.addEventListener("markerFound", () => {
            var marker_id = this.el.id;
            this.handle_marker_found(toys, marker_id);
        });

        this.el.addEventListener("markerLost", () => {
            this.handle_marker_lost();
        });
    },
    ask_user_id: function () {
        var icon_url =
            "https://raw.githubusercontent.com/whitehatjr/ar-toy-store-assets/master/toy-shop.png";

        swal({
            title: "Welcome to Toy Shop!!",
            icon: icon_url,
            content: {
                element: "input",
                attributes: {
                    placeholder: "Type your uid Ex:( U01 )"
                }
            }
        }).then(input_value => {
            uid = input_value;
        });
    },
    handle_marker_found: function (toys, marker_id) {
        var toy = toys.filter(toy => toy.id === marker_id)[0];
        if (toy.is_out_of_stock) {
            swal({
                icon: "warning",
                title: toy.toy_name.toUpperCase(),
                text: "This toy is out of stock!!!",
                timer: 2500,
                buttons: false
            });
        } else {
            var model = document.querySelector(`#model-${toy.id}`);
            model.setAttribute("position", toy.model_geometry.position);
            model.setAttribute("rotation", toy.model_geometry.rotation);
            model.setAttribute("scale", toy.model_geometry.scale);

            // make model visible
            var model = document.querySelector(`#model-${toy.id}`);
            model.setAttribute("visible", true);

            // Changing button div visibility
            var button_div = document.getElementById("button-div");
            button_div.style.display = "flex";

            var order_buttton = document.getElementById("order-button");
            var order_summary_buttton = document.getElementById("order-summary-button");
            var pay_button = document.getElementById("pay-button");
            var rating_button = document.getElementById("rating-button");

            // Handling Click Events
            order_buttton.addEventListener("click", () => {
                uid = uid.toUpperCase();
                this.handle_order(uid, toy);
                
                swal({
                    icon: "https://i.imgur.com/4NZ6uLY.jpg",
                    title: "Thanks For Order!",
                    text: "  ",
                    timer: 2000,
                    buttons: false
                });
            });

            order_summary_buttton.addEventListener("click", () => {
                this.handle_order_summary()
            });

            pay_button.addEventListener("click", () => this.handle_payment());
            rating_button.addEventListener("click", () => this.handle_ratings(toy));
        }
    },
    handle_order: function (uid, toy) {
        // Reading current UID order details
        firebase.firestore()
            .collection("users")
            .doc(uid)
            .get()
            .then(doc => {
                var details = doc.data();

                if (details["current_orders"][toy.id]) {
                    // Increasing Current Quantity
                    details["current_orders"][toy.id]["quantity"] += 1;

                    //Calculating Subtotal of item
                    var current_quantity = details["current_orders"][toy.id]["quantity"];

                    details["current_orders"][toy.id]["subtotal"] =
                        current_quantity * toy.price;
                } else {
                    details["current_orders"][toy.id] = {
                        item: toy.toy_name,
                        price: toy.price,
                        quantity: 1,
                        subtotal: toy.price * 1
                    };
                }

                details.total_bill += toy.price;

                // Updating Db
                firebase.firestore()
                    .collection("users")
                    .doc(doc.id)
                    .update(details);
            });
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
    get_order_summary: async function (uid) {
        return await firebase.firestore()
            .collection("users")
            .doc(uid)
            .get()
            .then(doc => doc.data());
    },
    handle_order_summary: async function () {
        // Changing modal div visibility
        var modal_div = document.getElementById("modal-div");
        modal_div.style.display = "flex";
        // Getting UID
        uid = uid.toUpperCase();

        // Getting Order summary from database
        var order_summary = await this.get_order_summary(uid);

        var table_body_tag = document.getElementById("bill-table-body");
        // Removing old tr data
        table_body_tag.innerHTML = "";

        var current_orders = Object.keys(order_summary.current_orders);
        current_orders.map(i => {
            var tr = document.createElement("tr");
            var item = document.createElement("td");
            var price = document.createElement("td");
            var quantity = document.createElement("td");
            var subtotal = document.createElement("td");

            item.innerHTML = order_summary.current_orders[i].item;
            price.innerHTML = "$" + order_summary.current_orders[i].price;
            price.setAttribute("class", "text-center");

            quantity.innerHTML = order_summary.current_orders[i].quantity;
            quantity.setAttribute("class", "text-center");

            subtotal.innerHTML = "$" + order_summary.current_orders[i].subtotal;
            subtotal.setAttribute("class", "text-center");

            tr.appendChild(item);
            tr.appendChild(price);
            tr.appendChild(quantity);
            tr.appendChild(subtotal);
            table_body_tag.appendChild(tr);
        });

        var total_tr = document.createElement("tr");

        var td1 = document.createElement("td");
        td1.setAttribute("class", "no-line");

        var td2 = document.createElement("td");
        td1.setAttribute("class", "no-line");

        var td3 = document.createElement("td");
        td1.setAttribute("class", "no-line text-cente");

        var strong_tag = document.createElement("strong");
        strong_tag.innerHTML = "Total";
        td3.appendChild(strong_tag);

        var td4 = document.createElement("td");
        td1.setAttribute("class", "no-line text-right");
        td4.innerHTML = "$" + order_summary.total_bill;

        total_tr.appendChild(td1);
        total_tr.appendChild(td2);
        total_tr.appendChild(td3);
        total_tr.appendChild(td4);

        table_body_tag.appendChild(total_tr);
    },
    handle_payment: function () {
        // Close Modal
        document.getElementById("modal-div").style.display = "none";

        // Getting UID
        uid = uid.toUpperCase();

        // Reseting current orders and total bill
        firebase.firestore()
            .collection("users")
            .doc(uid)
            .update({
                current_orders: {},
                total_bill: 0
            })
            .then(() => {
                swal({
                    icon: "success",
                    title: "Thanks For Paying !",
                    text: "We Hope You Like Your Toy !!",
                    timer: 2500,
                    buttons: false
                });
            });
    },
    handle_ratings: function (toy) {
        // Close Modal
        document.getElementById("rating-modal-div").style.display = "flex";
        document.getElementById("rating-input").value = "0";

        var save_rating_button = document.getElementById("save-rating-button");
        save_rating_button.addEventListener("click", () => {
            document.getElementById("rating-modal-div").style.display = "none";
            var rating = document.getElementById("rating-input").value;

            firebase
                .firestore()
                .collection("toys")
                .doc(toy.id)
                .update({
                    rating: rating
                })
                .then(() => {
                    swal({
                        icon: "success",
                        title: "Thanks For Rating!",
                        text: "We Hope You Like Toy !!",
                        timer: 2500,
                        buttons: false
                    });
                });
        });
    },
    handle_marker_lost: function () {
        // Changing button div visibility
        var button_div = document.getElementById("button-div");
        button_div.style.display = "none";
    }
});
