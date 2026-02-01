import {
  addDoctor,
  getAllDoctors,
  updateDoctor,
  deleteDoctor
} from "../services/doctor-service.js";

import { protectAdminPage } from "../utils/auth-guard.js";
import { logInfo, logError } from "../logs/logger.js";

protectAdminPage();

document.addEventListener("DOMContentLoaded", async () => {
  const doctorForm = document.getElementById("doctorForm");
  const doctorsTableBody = document.getElementById("doctorsTableBody");

  if (!doctorsTableBody) return;

  async function loadDoctors() {
    try {
      const doctors = await getAllDoctors();
      doctorsTableBody.innerHTML = "";

      doctors.forEach((doctor) => {
        const row = document.createElement("tr");
        row.innerHTML = `
          <td>${doctor.name}</td>
          <td>${doctor.specialization}</td>
          <td>${doctor.phone || "-"}</td>
          <td>
            <button data-id="${doctor.id}" class="edit-btn">Edit</button>
            <button data-id="${doctor.id}" class="delete-btn">Delete</button>
          </td>
        `;
        doctorsTableBody.appendChild(row);
      });

      logInfo("Doctors loaded", { count: doctors.length });
    } catch (error) {
      logError("Failed to load doctors", error);
      alert("Failed to load doctors list.");
    }
  }

  if (doctorForm) {
    doctorForm.addEventListener("submit", async (e) => {
      e.preventDefault();

      const name = doctorForm.name.value.trim();
      const specialization = doctorForm.specialization.value.trim();
      const phone = doctorForm.phone.value.trim();

      try {
        await addDoctor({ name, specialization, phone });
        logInfo("Doctor added", { name });
        doctorForm.reset();
        loadDoctors();
      } catch (error) {
        logError("Failed to add doctor", error);
        alert("Failed to add doctor.");
      }
    });
  }

  doctorsTableBody.addEventListener("click", async (e) => {
    const btn = e.target.closest("button");
    if (!btn) return;

    const id = btn.dataset.id;
    if (!id) return;

    if (btn.classList.contains("delete-btn")) {
      if (!confirm("Delete this doctor?")) return;

      try {
        await deleteDoctor(id);
        logInfo("Doctor deleted", { id });
        loadDoctors();
      } catch (error) {
        logError("Failed to delete doctor", error);
        alert("Failed to delete doctor.");
      }
    }

    if (btn.classList.contains("edit-btn")) {
      const newName = prompt("Enter new doctor name:");
      if (!newName) return;

      try {
        await updateDoctor(id, { name: newName });
        logInfo("Doctor updated", { id });
        loadDoctors();
      } catch (error) {
        logError("Failed to update doctor", error);
        alert("Failed to update doctor.");
      }
    }
  });

  loadDoctors();
});
