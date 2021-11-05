AFRAME.registerComponent("create_markers", {
    init: async function () {
        var main_scene = document.querySelector("#main-scene");
        var toys = await this.get_all_toys();
        toys.map(toy => {
            var marker = document.createElement("a-marker");
            marker.setAttribute("id", toy.id);
            marker.setAttribute("type", "pattern");
            marker.setAttribute("url", toy.marker_pattern_url);
            marker.setAttribute("cursor", {
                rayOrigin: "mouse"
            });
            marker.setAttribute("marker_handler", {});
            main_scene.appendChild(marker);

            // Adding 3D model to scene
            var model = document.createElement("a-entity");
            model.setAttribute("id", `model-${toy.id}`);
            model.setAttribute("position", toy.model_geometry.position);
            model.setAttribute("rotation", toy.model_geometry.rotation);
            model.setAttribute("scale", toy.model_geometry.scale);
            model.setAttribute("gltf-model", `url(${toy.model_url})`);
            model.setAttribute("gesture-handler", {});
            model.setAttribute("animation-mixer", {});
            marker.appendChild(model);

            // description Container
            var main_plane = document.createElement("a-plane");
            main_plane.setAttribute("id", `main-plane-${toy.id}`);
            main_plane.setAttribute("position", { x: 0, y: 0, z: 0 });
            main_plane.setAttribute("rotation", { x: -90, y: 0, z: 0 });
            main_plane.setAttribute("material", {
                color: "#ffd880"
            });
            main_plane.setAttribute("width", 2.3);
            main_plane.setAttribute("height", 2.5);
            marker.appendChild(main_plane);

            // toy title background plane
            var title_plane = document.createElement("a-plane");
            title_plane.setAttribute("id", `title-plane-${toy.id}`);
            title_plane.setAttribute("position", { x: 0, y: 1.1, z: 0.1 });
            title_plane.setAttribute("rotation", { x: 0, y: 0, z: 0 });
            title_plane.setAttribute("width", 2.31);
            title_plane.setAttribute("height", 0.4);
            title_plane.setAttribute("material", { color: "#f14668" });
            main_plane.appendChild(title_plane);

            // Toy title
            var toy_title = document.createElement("a-entity");
            toy_title.setAttribute("id", `toy-title-${toy.id}`);
            toy_title.setAttribute("position", { x: 1.3, y: 0, z: 0.1 });
            toy_title.setAttribute("rotation", { x: 0, y: 0, z: 0 });
            toy_title.setAttribute("text", {
                font: "aileronsemibold",
                color: "#290149",
                width: 4.5,
                height: 3,
                align: "left",
                value: toy.toy_name.toUpperCase()
            });
            title_plane.appendChild(toy_title);

            // description List
            var description = document.createElement("a-entity");
            description.setAttribute("id", `description-${toy.id}`);
            description.setAttribute("position", { x: 0.04, y: 0, z: 0.1 });
            description.setAttribute("rotation", { x: 0, y: 0, z: 0 });
            description.setAttribute("text", {
                font: "dejavu",
                color: "#6b011f",
                width: 2,
                height: 5,
                letterSpacing: 2,
                lineHeight: 50,
                align: "left",
                value: `${toy.description}`
            });
            main_plane.appendChild(description);

            var age = document.createElement("a-entity");
            age.setAttribute("id", `age-${toy.id}`);
            age.setAttribute("position", { x: -0.75, y: -0.8, z: 0.1 });
            age.setAttribute("rotation", { x: 0, y: 0, z: 0 });
            age.setAttribute("text", {
                font: "aileronsemibold",
                color: "#290149",
                width: 2,
                height: 5,
                align: "center",
                value: `AGE : ${toy.age_group}`
            });
            main_plane.appendChild(age);
        });
    },
    get_all_toys: async function () {
        return await firebase.firestore()
            .collection("toys")
            .get()
            .then(snap => {
                return snap.docs.map(doc => doc.data());
            });
    }
});