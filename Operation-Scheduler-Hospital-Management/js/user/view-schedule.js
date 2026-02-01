import { protectUserPage } from "../utils/auth-guard.js";
import { getSchedulesByUser } from "../services/schedule-service.js";
import { onUserAuthStateChanged } from "../services/auth-service.js";
import { logError } from "../logs/logger.js";

protectUserPage();

document.addEventListener("DOMContentLoaded", () => {
  const tableBody = document.getElementById("myScheduleTableBody");

  if (!tableBody) return;

  onUserAuthStateChanged(async (user) => {
    if (!user) return;

    try {
      const schedules = await getSchedulesByUser(user.uid);
      tableBody.innerHTML = "";

      schedules.forEach(s => {
        const row = document.createElement("tr");
        row.innerHTML = `
          <td>${s.doctorName || "-"}</td>
          <td>${s.operationType || "-"}</td>
          <td>${s.operationDate || "-"}</td>
          <td>${s.status || "-"}</td>
        `;
        tableBody.appendChild(row);
      });
    } catch (error) {
      logError("Failed to load my schedules", error);
      alert("Failed to load schedules.");
    }
  });
});
