import { getAllUsers } from "../services/user-service.js";
import { protectAdminPage } from "../utils/auth-guard.js";
import { logInfo, logError } from "../logs/logger.js";

protectAdminPage();

document.addEventListener("DOMContentLoaded", async () => {
  const patientsTableBody = document.getElementById("patientsTableBody");

  if (!patientsTableBody) return;

  try {
    const users = await getAllUsers();

    patientsTableBody.innerHTML = "";

    users.forEach(user => {
      const row = document.createElement("tr");
      row.innerHTML = `
        <td>${user.name || "-"}</td>
        <td>${user.email || "-"}</td>
        <td>${user.role || "user"}</td>
      `;
      patientsTableBody.appendChild(row);
    });

    logInfo("Patients loaded", { count: users.length });
  } catch (error) {
    logError("Failed to load patients", error);
    alert("Failed to load patients.");
  }
});
