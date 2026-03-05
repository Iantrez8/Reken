// public/js/firebase-config.js
const firebaseConfig = {
    apiKey: "AIzaSyD9c2UE7UaAA0t4XkZb2AEySLRy_s5yw44",
    authDomain: "reken-co.firebaseapp.com",
    projectId: "reken-co",
    storageBucket: "reken-co.firebasestorage.app",
    messagingSenderId: "576620907702",
    appId: "1:576620907702:web:7081de346089904543aa17"
};

// Initialize Firebase
if (!firebase.apps.length) {
    firebase.initializeApp(firebaseConfig);
}

const auth = firebase.auth();
const db = firebase.firestore();
