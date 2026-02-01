import { loginUser } from "../js/services/auth-service.js";
import { getUserProfile } from "../js/services/user-service.js";
import { logInfo, logError } from "../js/logs/logger.js";

document.addEventListener("DOMContentLoaded", () => {
  const loginForm = document.getElementById("loginForm");

  if (!loginForm) return;

  loginForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const email = loginForm.email.value.trim();
    const password = loginForm.password.value;

    try {
      const user = await loginUser(email, password);
      logInfo("User logged in", { uid: user.uid });

      const profile = await getUserProfile(user.uid);

      if (profile?.role === "admin") {
        window.location.href = "../admin/dashboard.html";
      } else {
        window.location.href = "../user/dashboard.html";
      }
    } catch (error) {
      logError("Login failed", error);
      alert("Invalid email or password.");
    }
  });
});
