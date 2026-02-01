import {
  collection,
  doc,
  setDoc,
  getDoc,
  getDocs,
  updateDoc,
  serverTimestamp
} from "https://www.gstatic.com/firebasejs/12.8.0/firebase-firestore.js";

import { db } from "../config/firebase-config.js";

const usersCollection = collection(db, "users");

export async function createUserProfile(uid, userData) {
  try {
    const userRef = doc(usersCollection, uid);
    await setDoc(userRef, {
      ...userData,
      createdAt: serverTimestamp()
    });
  } catch (error) {
    throw error;
  }
}

export async function getUserProfile(uid) {
  try {
    const userRef = doc(usersCollection, uid);
    const userSnap = await getDoc(userRef);

    if (userSnap.exists()) {
      return userSnap.data();
    } else {
      return null;
    }
  } catch (error) {
    throw error;
  }
}

export async function updateUserProfile(uid, updatedData) {
  try {
    const userRef = doc(usersCollection, uid);
    await updateDoc(userRef, {
      ...updatedData,
      updatedAt: serverTimestamp()
    });
  } catch (error) {
    throw error;
  }
}

export async function getAllUsers() {
  try {
    const snapshot = await getDocs(usersCollection);
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
  } catch (error) {
    throw error;
  }
}
