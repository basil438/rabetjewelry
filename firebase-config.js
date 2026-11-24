import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { getAuth, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";
import {
    getFirestore,
    collection,
    addDoc,
    getDocs,
    serverTimestamp
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyCcVt5b4ynabq9V4LtofnZhkjNW90tfBsQ",
  authDomain: "rabet-jewelry.firebaseapp.com",
  databaseURL: "https://rabet-jewelry-default-rtdb.firebaseio.com",
  projectId: "rabet-jewelry",
  storageBucket: "rabet-jewelry.firebasestorage.app",
  messagingSenderId: "397884522585",
  appId: "1:397884522585:web:89120dce170d2efa057148",
  measurementId: "G-19M2CSZM7N"
};

export const ADMIN_EMAIL = "basilosieko@gmail.com";

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);

export async function logStoreActivity(actionType, description, userEmail = "Guest") {
    try {
        await addDoc(collection(db, "activity_logs"), {
            actionType,
            description,
            userEmail,
            timestamp: serverTimestamp()
        });
    } catch (error) {
        console.error("Failed to write activity log:", error);
    }
}

export async function seedDefaultProductsIfEmpty() {
    const snap = await getDocs(collection(db,"products"));
    if (snap.empty) {
        const defaults = [
            {
                code: "JWL-101",
                name: "18k Gold Plated Herringbone Chain",
                category: "Necklaces",
                price: 4500,
                stock: 2,
                image: "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=formart&fit=crop&q=80"
            }
        ];

        for (const item of defaults) {
            await addDoc(collection(db, "products"), item);
        }
    }
}

onAuthStateChanged(auth, (user) => {
    const badge = document.getElementById("sidebar-user");
    if (badge) {
        if (user) {
            const roleTag = user.email === ADMIN_EMAIL ? ` <span class="badge">ADMIN</span>` : "";
            badge.innerHTML = `Signed in as:${roleTag}<br><strong style="color:#d4af37;">${user.email}</strong>`;
        } else {
            badge.innerHTML = `Status: <strong>Guest Visitor</strong><br><a href="profile.html" style="color:#d4af37; text-decoration:none;">Sign In / Create Profile -></a>`;
        }
    }
});