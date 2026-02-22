
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

// Live Production Configuration
const firebaseConfig = {
  apiKey: "AIzaSyDYCZpYkXdQi_YluYeNy1hUe_ifgqmdgE4",
  authDomain: "abilities-ai.firebaseapp.com",
  projectId: "abilities-ai",
  storageBucket: "abilities-ai.firebasestorage.app",
  messagingSenderId: "864850353558",
  appId: "1:864850353558:web:845aed2b8e84de4c7e51b7",
  measurementId: "G-3GH391RRQR"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
