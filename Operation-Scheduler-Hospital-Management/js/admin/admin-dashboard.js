import { protectAdminPage } from "../utils/auth-guard.js";
import { getAllDoctors } from "../services/doctor-service.js";
import { getAllSchedules } from "../services/schedule-service.js";
import { logInfo, logError } from "../logs/logger.js";

protectAdminPage();

document.addEventListener("DOMContentLoaded", async () => {
  const summaryDiv = document.getElementById("userSummary");
  
  try {
    const doctors = await getAllDoctors();
    const schedules = await getAllSchedules();

    logInfo("Admin dashboard loaded", { doctorsCount: doctors.length, schedulesCount: schedules.length });

    if (summaryDiv) {
      summaryDiv.innerHTML = `
        <p>Total Doctors: ${doctors.length}</p>
        <p>Total Schedules: ${schedules.length}</p>
      `;
    }
  } catch (error) {
    logError("Failed to load admin dashboard data", error);
    alert("Failed to load dashboard data.");
  }
});
