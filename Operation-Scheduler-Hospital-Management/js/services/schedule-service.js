import {
  collection,
  doc,
  addDoc,
  getDocs,
  getDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  serverTimestamp
} from "https://www.gstatic.com/firebasejs/12.8.0/firebase-firestore.js";

import { db } from "../config/firebase-config.js";
import { logInfo, logError } from "../logs/logger.js";

const schedulesCollection = collection(db, "schedules");

/**
 * Creates a new operation schedule with expanded medical and logistical fields.
 * Includes validation for required medical inputs and sets default empty structures.
 */
export async function createSchedule(scheduleData) {
  try {
    // Validate mandatory medical inputs
    const requiredFields = ['patientName', 'operationType', 'operationDate', 'doctorName'];
    for (const field of requiredFields) {
      if (!scheduleData[field]) {
        throw new Error(`Missing required field: ${field}`);
      }
    }

    const expandedSchedule = {
      // Basic Info
      patientName: scheduleData.patientName,
      operationType: scheduleData.operationType,
      operationDate: scheduleData.operationDate,
      doctorName: scheduleData.doctorName,
      userId: scheduleData.userId || null,
      
      // Personnel Details
      anesthesiaType: scheduleData.anesthesiaType || "",
      anesthesiologistName: scheduleData.anesthesiologistName || "",
      assistantSurgeons: scheduleData.assistantSurgeons || [],
      otNurses: scheduleData.otNurses || [],
      
      // Medical & Resource Details
      requiredDrugs: scheduleData.requiredDrugs || [],
      requiredInstruments: scheduleData.requiredInstruments || [],
      specialMaterials: scheduleData.specialMaterials || [],
      
      // Event Tracking
      preOperativeEvents: scheduleData.preOperativeEvents || [],
      postOperativeEvents: scheduleData.postOperativeEvents || [],
      
      // Doctor Interaction
      doctorRemarks: scheduleData.doctorRemarks || "",
      
      // Surgical Reports
      attachments: scheduleData.attachments || [],
      
      // Status & Metadata
      status: "scheduled",
      createdAt: serverTimestamp()
    };

    const docRef = await addDoc(schedulesCollection, expandedSchedule);
    
    logInfo("Schedule created successfully", { scheduleId: docRef.id, patientName: expandedSchedule.patientName });
    
    return docRef.id;
  } catch (error) {
    logError("Error creating schedule", error);
    throw error;
  }
}

export async function getAllSchedules() {
  try {
    const q = query(schedulesCollection, orderBy("createdAt", "desc"));
    const snapshot = await getDocs(q);

    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
  } catch (error) {
    throw error;
  }
}

export async function getSchedulesByUser(uid) {
  try {
    const q = query(
      schedulesCollection,
      where("userId", "==", uid)
    );

    const snapshot = await getDocs(q);

    const schedules = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));

    schedules.sort((a, b) => {
      const dateA = a.createdAt?.toDate?.() || new Date(0);
      const dateB = b.createdAt?.toDate?.() || new Date(0);
      return dateB - dateA;
    });

    return schedules;
  } catch (error) {
    throw error;
  }
}

export async function updateSchedule(scheduleId, updatedData) {
  try {
    const scheduleRef = doc(schedulesCollection, scheduleId);
    await updateDoc(scheduleRef, {
      ...updatedData,
      updatedAt: serverTimestamp()
    });
  } catch (error) {
    throw error;
  }
}

export async function deleteSchedule(scheduleId) {
  try {
    const scheduleRef = doc(schedulesCollection, scheduleId);
    await deleteDoc(scheduleRef);
  } catch (error) {
    throw error;
  }
}
