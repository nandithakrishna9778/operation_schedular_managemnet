import {
  getAllSchedules,
  updateSchedule,
  deleteSchedule
} from "../services/schedule-service.js";

import { protectAdminPage } from "../utils/auth-guard.js";
import { logInfo, logError } from "../logs/logger.js";

protectAdminPage();

document.addEventListener("DOMContentLoaded", async () => {
  const schedulesTableBody = document.getElementById("schedulesTableBody");

  if (!schedulesTableBody) return;

  async function loadSchedules() {
    try {
      const schedules = await getAllSchedules();
      schedulesTableBody.innerHTML = "";

      schedules.forEach((schedule) => {
        const row = document.createElement("tr");
        row.innerHTML = `
          <td>${schedule.patientName || "-"}</td>
          <td>${schedule.doctorName || "-"}</td>
          <td>${schedule.operationType || "-"}</td>
          <td>${schedule.operationDate || "-"}</td>
          <td>${schedule.status || "-"}</td>
          <td>
            <button data-id="${schedule.id}" class="approve-btn">Approve</button>
            <button data-id="${schedule.id}" class="cancel-btn">Cancel</button>
            <button data-id="${schedule.id}" class="delete-btn">Delete</button>
          </td>
        `;
        schedulesTableBody.appendChild(row);
      });

      logInfo("Schedules loaded", { count: schedules.length });
    } catch (error) {
      logError("Failed to load schedules", error);
      alert("Failed to load schedules.");
    }
  }

  schedulesTableBody.addEventListener("click", async (e) => {
    const btn = e.target.closest("button");
    if (!btn) return;

    const id = btn.dataset.id;
    if (!id) return;

    try {
      if (btn.classList.contains("approve-btn")) {
        await updateSchedule(id, { status: "approved" });
        logInfo("Schedule approved", { id });
      }

      if (btn.classList.contains("cancel-btn")) {
        await updateSchedule(id, { status: "cancelled" });
        logInfo("Schedule cancelled", { id });
      }

      if (btn.classList.contains("delete-btn")) {
        if (!confirm("Delete this schedule?")) return;
        await deleteSchedule(id);
        logInfo("Schedule deleted", { id });
      }

      loadSchedules();
    } catch (error) {
      logError("Failed to update schedule", error);
      alert("Failed to update schedule.");
    }
  });

  loadSchedules();
});
