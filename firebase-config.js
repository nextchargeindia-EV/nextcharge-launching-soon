// ============================================================
// Firebase Configuration for NextCharge Blog
// ============================================================
// HOW TO SET UP:
// 1. Go to https://console.firebase.google.com/
// 2. Create a new project (or use an existing one)
// 3. Go to Project Settings > General > Your apps > Add web app
// 4. Copy the firebaseConfig object and paste below
// 5. Enable these services in Firebase Console:
//    - Authentication > Sign-in method > Email/Password (enable it)
//    - Firestore Database > Create database (start in test mode)
//    - Storage > Get started (start in test mode)
// 6. Create your admin account:
//    - Authentication > Users > Add user > enter your email & password
// ============================================================

const firebaseConfig = {
    apiKey: "AIzaSyBHsa7JX80OazGBcsuMae8i8CcvoJzWxcg",
    authDomain: "nextcharge-24553.firebaseapp.com",
    projectId: "nextcharge-24553",
    storageBucket: "nextcharge-24553.firebasestorage.app",
    messagingSenderId: "440815481837",
    appId: "1:440815481837:web:49585a360f82a7a67d2de4",
    measurementId: "G-8SYNEYWQZ5"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);

// Initialize services (conditionally — blog page only loads Firestore)
const db = firebase.firestore();
const auth = typeof firebase.auth === 'function' ? firebase.auth() : null;
const storage = typeof firebase.storage === 'function' ? firebase.storage() : null;
