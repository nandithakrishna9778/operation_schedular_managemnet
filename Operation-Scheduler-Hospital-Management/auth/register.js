import { registerUser } from "../js/services/auth-service.js";
import { createUserProfile } from "../js/services/user-service.js";
import { logInfo, logError } from "../js/logs/logger.js";

document.addEventListener("DOMContentLoaded", () => {
  const registerForm = document.getElementById("registerForm");

  if (!registerForm) return;

  registerForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const name = registerForm.name.value.trim();
    const email = registerForm.email.value.trim();
    const password = registerForm.password.value;

    try {
      const user = await registerUser(email, password);
      
      await createUserProfile(user.uid, {
        name: name,
        email: email,
        role: "user"
      });

      logInfo("User registered", { uid: user.uid });
      alert("Registration successful! Please login.");
      window.location.href = "/auth/login.html";
    } catch (error) {
      logError("Registration failed", error);
      alert("Registration failed: " + error.message);
    }
  });
});
