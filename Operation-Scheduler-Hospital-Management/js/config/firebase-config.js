import { initializeApp } from "https://www.gstatic.com/firebasejs/12.8.0/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/12.8.0/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/12.8.0/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyC-UsJDb1QUOL3NQD2YIjAarTO7b7lUoV0",
  authDomain: "hospital-web-app-e747f.firebaseapp.com",
  projectId: "hospital-web-app-e747f",
  storageBucket: "hospital-web-app-e747f.firebasestorage.app",
  messagingSenderId: "12500159929",
  appId: "1:12500159929:web:e7f1747679dab79ca63a68",
  measurementId: "G-96GDK0MMGL"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

export { auth, db };
