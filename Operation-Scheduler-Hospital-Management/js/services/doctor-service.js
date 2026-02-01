import {
  collection,
  doc,
  addDoc,
  getDocs,
  getDoc,
  updateDoc,
  deleteDoc,
  serverTimestamp
} from "https://www.gstatic.com/firebasejs/12.8.0/firebase-firestore.js";

import { db } from "../config/firebase-config.js";

const doctorsCollection = collection(db, "doctors");

export async function addDoctor(doctorData) {
  try {
    const docRef = await addDoc(doctorsCollection, {
      ...doctorData,
      createdAt: serverTimestamp()
    });
    return docRef.id;
  } catch (error) {
    throw error;
  }
}

export async function getAllDoctors() {
  try {
    const snapshot = await getDocs(doctorsCollection);
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
  } catch (error) {
    throw error;
  }
}

export async function getDoctorById(doctorId) {
  try {
    const doctorRef = doc(doctorsCollection, doctorId);
    const doctorSnap = await getDoc(doctorRef);

    if (doctorSnap.exists()) {
      return {
        id: doctorSnap.id,
        ...doctorSnap.data()
      };
    } else {
      return null;
    }
  } catch (error) {
    throw error;
  }
}

export async function updateDoctor(doctorId, updatedData) {
  try {
    const doctorRef = doc(doctorsCollection, doctorId);
    await updateDoc(doctorRef, {
      ...updatedData,
      updatedAt: serverTimestamp()
    });
  } catch (error) {
    throw error;
  }
}

export async function deleteDoctor(doctorId) {
  try {
    const doctorRef = doc(doctorsCollection, doctorId);
    await deleteDoc(doctorRef);
  } catch (error) {
    throw error;
  }
}
