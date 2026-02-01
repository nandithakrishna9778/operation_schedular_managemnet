import {
  collection,
  doc,
  getDoc,
  updateDoc,
  arrayUnion,
  serverTimestamp
} from "https://www.gstatic.com/firebasejs/12.8.0/firebase-firestore.js";

import { db } from "../config/firebase-config.js";
import { logInfo, logError } from "../logs/logger.js";

/**
 * Centralized Operation Status Enum
 */
export const SCHEDULE_STATUS = {
  SCHEDULED: "scheduled",
  IN_PROGRESS: "in_progress",
  POSTPONED: "postponed",
  CANCELLED: "cancelled",
  COMPLETED: "completed",
  EMERGENCY: "emergency"
};

/**
 * Valid state transitions
 */
const VALID_TRANSITIONS = {
  [SCHEDULE_STATUS.SCHEDULED]: [
    SCHEDULE_STATUS.IN_PROGRESS,
    SCHEDULE_STATUS.POSTPONED,
    SCHEDULE_STATUS.CANCELLED,
    SCHEDULE_STATUS.EMERGENCY
  ],
  [SCHEDULE_STATUS.EMERGENCY]: [
    SCHEDULE_STATUS.IN_PROGRESS
  ],
  [SCHEDULE_STATUS.IN_PROGRESS]: [
    SCHEDULE_STATUS.COMPLETED
  ],
  [SCHEDULE_STATUS.POSTPONED]: [
    SCHEDULE_STATUS.SCHEDULED
  ],
  // Final states or states with no defined forward transitions in requirements
  [SCHEDULE_STATUS.CANCELLED]: [],
  [SCHEDULE_STATUS.COMPLETED]: []
};

/**
 * Changes schedule status with validation and history tracking
 */
export async function changeScheduleStatus(scheduleId, newStatus, changedBy, reason = "") {
  try {
    const scheduleRef = doc(collection(db, "schedules"), scheduleId);
    const scheduleSnap = await getDoc(scheduleRef);

    if (!scheduleSnap.exists()) {
      throw new Error("Schedule not found");
    }

    const currentData = scheduleSnap.data();
    const oldStatus = currentData.status;

    // 1. Validate Transition
    const allowed = VALID_TRANSITIONS[oldStatus] || [];
    const isEmergencyOverride = (newStatus === SCHEDULE_STATUS.EMERGENCY && 
                                [SCHEDULE_STATUS.SCHEDULED, SCHEDULE_STATUS.POSTPONED].includes(oldStatus));

    if (!allowed.includes(newStatus) && !isEmergencyOverride) {
      const errorMsg = `Invalid status transition from ${oldStatus} to ${newStatus}`;
      logError(errorMsg, { scheduleId, oldStatus, newStatus });
      throw new Error(errorMsg);
    }

    // 2. Emergency Override Requirements
    if (newStatus === SCHEDULE_STATUS.EMERGENCY) {
      if (!reason || reason.trim().length === 0) {
        throw new Error("Reason is mandatory for emergency status");
      }
    }

    // 3. Prepare Updates
    const historyEntry = {
      fromStatus: oldStatus,
      toStatus: newStatus,
      changedBy: changedBy,
      reason: reason,
      timestamp: new Date().toISOString()
    };

    const updates = {
      status: newStatus,
      statusHistory: arrayUnion(historyEntry),
      updatedAt: serverTimestamp()
    };

    // If emergency, we ensure it's reflected in remarks if provided
    if (newStatus === SCHEDULE_STATUS.EMERGENCY && reason) {
      updates.doctorRemarks = currentData.doctorRemarks 
        ? `${currentData.doctorRemarks}\n[EMERGENCY]: ${reason}`
        : `[EMERGENCY]: ${reason}`;
    }

    await updateDoc(scheduleRef, updates);

    logInfo("Status transition successful", {
      scheduleId,
      transition: `${oldStatus} -> ${newStatus}`,
      actor: changedBy,
      timestamp: historyEntry.timestamp
    });

    return true;
  } catch (error) {
    logError("Error in status transition", error);
    throw error;
  }
}
