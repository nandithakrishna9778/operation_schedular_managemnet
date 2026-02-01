import {
  collection,
  getDocs,
  query,
  where,
  orderBy
} from "https://www.gstatic.com/firebasejs/12.8.0/firebase-firestore.js";

import { db } from "../config/firebase-config.js";
import { logInfo, logError } from "../logs/logger.js";

const schedulesCollection = collection(db, "schedules");

/**
 * Admin Efficiency Reports Service
 * Analyzes OT activity using scheduled operation data.
 */

/**
 * OT Utilization (Planned) Report
 * Returns daily and weekly utilization per OT based on number of scheduled surgeries.
 */
export async function getOTUtilizationReport(startDate, endDate) {
  try {
    logInfo("Generating OT Utilization Report", { startDate, endDate });
    const schedules = await fetchSchedulesInRange(startDate, endDate);
    
    const utilization = {
      daily: {},
      weekly: {},
      totalSurgeriesPerOT: {}
    };

    schedules.forEach(schedule => {
      const ot = schedule.operatingTheater || "Unknown OT";
      const date = schedule.operationDate.split('T')[0];
      const week = getWeekNumber(new Date(date));

      // Daily
      if (!utilization.daily[date]) utilization.daily[date] = {};
      utilization.daily[date][ot] = (utilization.daily[date][ot] || 0) + 1;

      // Weekly
      if (!utilization.weekly[week]) utilization.weekly[week] = {};
      utilization.weekly[week][ot] = (utilization.weekly[week][ot] || 0) + 1;

      // Total per OT
      utilization.totalSurgeriesPerOT[ot] = (utilization.totalSurgeriesPerOT[ot] || 0) + 1;
    });

    return utilization;
  } catch (error) {
    logError("Error generating OT Utilization Report", error);
    throw error;
  }
}

/**
 * Surgery Distribution Report
 * Total surgeries per day, doctor, and OT.
 */
export async function getSurgeryDistributionReport(startDate, endDate) {
  try {
    logInfo("Generating Surgery Distribution Report", { startDate, endDate });
    const schedules = await fetchSchedulesInRange(startDate, endDate);

    const distribution = {
      perDay: {},
      perDoctor: {},
      perOT: {}
    };

    schedules.forEach(schedule => {
      const date = schedule.operationDate.split('T')[0];
      const doctor = schedule.doctorName || "Unknown Doctor";
      const ot = schedule.operatingTheater || "Unknown OT";

      distribution.perDay[date] = (distribution.perDay[date] || 0) + 1;
      distribution.perDoctor[doctor] = (distribution.perDoctor[doctor] || 0) + 1;
      distribution.perOT[ot] = (distribution.perOT[ot] || 0) + 1;
    });

    return distribution;
  } catch (error) {
    logError("Error generating Surgery Distribution Report", error);
    throw error;
  }
}

/**
 * Resource Demand Summary Report
 * Aggregate usage count for drugs, instruments, and special materials.
 */
export async function getResourceDemandReport(startDate, endDate) {
  try {
    logInfo("Generating Resource Demand Report", { startDate, endDate });
    const schedules = await fetchSchedulesInRange(startDate, endDate);

    const demand = {
      drugs: {},
      instruments: {},
      specialMaterials: {}
    };

    schedules.forEach(schedule => {
      (schedule.requiredDrugs || []).forEach(item => {
        demand.drugs[item] = (demand.drugs[item] || 0) + 1;
      });
      (schedule.requiredInstruments || []).forEach(item => {
        demand.instruments[item] = (demand.instruments[item] || 0) + 1;
      });
      (schedule.specialMaterials || []).forEach(item => {
        demand.specialMaterials[item] = (demand.specialMaterials[item] || 0) + 1;
      });
    });

    return demand;
  } catch (error) {
    logError("Error generating Resource Demand Report", error);
    throw error;
  }
}

/**
 * Schedule Volatility Report
 * Counts for cancelled, emergency, and postponed surgeries.
 */
export async function getScheduleVolatilityReport(startDate, endDate) {
  try {
    logInfo("Generating Schedule Volatility Report", { startDate, endDate });
    const schedules = await fetchSchedulesInRange(startDate, endDate);

    const volatility = {
      cancelled: 0,
      emergency: 0,
      postponed: 0
    };

    schedules.forEach(schedule => {
      const status = (schedule.status || "").toLowerCase();
      const remarks = (schedule.doctorRemarks || "").toLowerCase();

      if (status === "cancelled" || remarks.includes("cancel")) volatility.cancelled++;
      if (status === "postponed" || remarks.includes("postpone")) volatility.postponed++;
      if (remarks.includes("emergency") || remarks.includes("urgent")) volatility.emergency++;
    });

    return volatility;
  } catch (error) {
    logError("Error generating Schedule Volatility Report", error);
    throw error;
  }
}

/**
 * Helper: Fetch schedules within a date range
 */
async function fetchSchedulesInRange(startDate, endDate) {
  // Simplification: Fetching and filtering in JS for flexibility with string dates
  // In production, use Firestore range queries if operationDate is a Timestamp
  const snapshot = await getDocs(schedulesCollection);
  return snapshot.docs
    .map(doc => ({ id: doc.id, ...doc.data() }))
    .filter(s => {
      if (!s.operationDate) return false;
      const date = s.operationDate.split('T')[0];
      return date >= startDate && date <= endDate;
    });
}

/**
 * Helper: Get week number of a date
 */
function getWeekNumber(d) {
  d = new Date(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()));
  d.setUTCDate(d.getUTCDate() + 4 - (d.getUTCDay() || 7));
  const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
  const weekNo = Math.ceil((((d - yearStart) / 86400000) + 1) / 7);
  return `${d.getUTCFullYear()}-W${weekNo}`;
}
