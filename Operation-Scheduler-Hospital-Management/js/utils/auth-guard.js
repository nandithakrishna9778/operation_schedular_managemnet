import { onUserAuthStateChanged } from "../services/auth-service.js";
import { getUserProfile } from "../services/user-service.js";

export function protectAdminPage() {
  onUserAuthStateChanged(async (user) => {
    if (!user) {
      window.location.href = "/auth/login.html";
      return;
    }

    const profile = await getUserProfile(user.uid);

    if (!profile || profile.role !== "admin") {
      alert("Access denied. Admins only.");
      window.location.href = "/index.html";
    }
  });
}

export function protectUserPage() {
  onUserAuthStateChanged(async (user) => {
    if (!user) {
      window.location.href = "/auth/login.html";
      return;
    }

    const profile = await getUserProfile(user.uid);

    if (!profile) {
      window.location.href = "/index.html";
    }
  });
}
