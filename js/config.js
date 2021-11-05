var firebase_config = {
    apiKey: "AIzaSyCUQGxygVyAPifIQJjxFFOQXqEIIWizdAM",
    authDomain: "ar-toy-store-6b8cf.firebaseapp.com",
    projectId: "ar-toy-store-6b8cf",
    storageBucket: "ar-toy-store-6b8cf.appspot.com",
    messagingSenderId: "999396501600",
    appId: "1:999396501600:web:6f454a8563886058e8fb05"
};

if (!firebase.apps.length) {
    firebase.initializeApp(firebase_config);
} else {
    firebase.app();
}
