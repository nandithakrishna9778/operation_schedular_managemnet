import { protectUserPage } from "../utils/auth-guard.js";
import { getUserProfile, updateUserProfile } from "../services/user-service.js";
import { onUserAuthStateChanged } from "../services/auth-service.js";
import { logError, logInfo } from "../logs/logger.js";

protectUserPage();

document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("profileForm");

  if (!form) return;

  onUserAuthStateChanged(async (user) => {
    if (!user) return;

    try {
      const profile = await getUserProfile(user.uid);
      if (!profile) return;

      form.name.value = profile.name || "";
      form.email.value = profile.email || "";

      form.addEventListener("submit", async (e) => {
        e.preventDefault();

        try {
          await updateUserProfile(user.uid, {
            name: form.name.value.trim()
          });

          logInfo("Profile updated");
          alert("Profile updated successfully.");
        } catch (error) {
          logError("Profile update failed", error);
          alert("Failed to update profile.");
        }
      });
    } catch (error) {
      logError("Failed to load profile", error);
    }
  });
});
