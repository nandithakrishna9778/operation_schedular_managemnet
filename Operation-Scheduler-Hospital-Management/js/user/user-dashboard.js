import { protectUserPage } from "../utils/auth-guard.js";
import { onUserAuthStateChanged } from "../services/auth-service.js";
import { getSchedulesByUser } from "../services/schedule-service.js";
import { logInfo, logError } from "../logs/logger.js";

protectUserPage();

document.addEventListener("DOMContentLoaded", () => {
  const summaryDiv = document.getElementById("userSummary");

  onUserAuthStateChanged(async (user) => {
    if (!user) return;

    try {
      const schedules = await getSchedulesByUser(user.uid);

      logInfo("User dashboard loaded", { schedulesCount: schedules.length });

      if (summaryDiv) {
        const approved = schedules.filter(s => s.status === "approved").length;
        const pending = schedules.filter(s => s.status === "scheduled").length;

        summaryDiv.innerHTML = `
          <p>Total Requests: ${schedules.length}</p>
          <p>Approved: ${approved}</p>
          <p>Pending: ${pending}</p>
        `;
      }
    } catch (error) {
      logError("Failed to load user dashboard", error);
      alert("Failed to load dashboard data.");
    }
  });
});
