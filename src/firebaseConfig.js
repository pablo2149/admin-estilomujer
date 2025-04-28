import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyA0GVvOw1bGH439KZM7jYrEAs50BLMv1oU",
  authDomain: "estilo-mujer-app.firebaseapp.com",
  projectId: "estilo-mujer-app",
  storageBucket: "estilo-mujer-app.firebasestorage.app",
  messagingSenderId: "423907635937",
  appId: "1:423907635937:web:ab3ad89eafb05f3b847da0"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export { db };
