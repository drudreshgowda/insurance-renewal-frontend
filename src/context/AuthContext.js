
import React, { createContext, useState, useEffect, useContext } from "react";
import { useTranslation } from "react-i18next";
import { loginAPI } from "../api/login"; // adjust path if needed

const AuthContext = createContext();
export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const { i18n } = useTranslation();

  // Apply language preference
  const applyUserLanguage = (user) => {
    if (user && user.language) {
      i18n.changeLanguage(user.language);
      localStorage.setItem("userLanguagePreference", user.language);
    }
  };

  // Load existing session
  useEffect(() => {
    const checkAuthStatus = async () => {
      try {
        const token = localStorage.getItem("authToken");
        const userEmail = localStorage.getItem("userEmail");

        if (token && userEmail) {
          // In a real app, validate token via backend
          const storedUser = JSON.parse(localStorage.getItem("userData"));
          if (storedUser) {
            setCurrentUser(storedUser);
            applyUserLanguage(storedUser);
          }
        }
      } catch (error) {
        console.error("Auth check failed:", error);
        localStorage.removeItem("authToken");
        localStorage.removeItem("refreshToken");
        localStorage.removeItem("userEmail");
        localStorage.removeItem("userData");
      } finally {
        setLoading(false);
      }
    };

    checkAuthStatus();
  }, []);

  // Live API Login
  const login = async (email, password) => {
    try {
      const response = await loginAPI.login({ email, password });

      if (!response.success) {
        return { success: false, message: response.message || "Login failed" };
      }

      const { access, refresh, user } = response.data;

      //Special case: give sahina@gmail.com full permissions
      if (user.email === "sahina@gmail.com") {
        user.permissions = [
          "dashboard", "upload", "cases", "closed-cases", "policy-timeline", "logs",
          "claims", "policy-servicing", "new-business", "medical-management", "lead-management",
          "emails", "email-dashboard", "email-analytics", "bulk-email",
          "campaigns", "templates", "feedback", "survey-designer", "whatsapp-flow",
          "renewal-email-manager", "renewal-whatsapp-manager",
          "settings", "billing", "users", "profile"
        ];
        user.role = "admin";
      }

      // Save tokens + user
      localStorage.setItem("authToken", access);
      localStorage.setItem("refreshToken", refresh);
      localStorage.setItem("userEmail", user.email);
      localStorage.setItem("userData", JSON.stringify(user));

      setCurrentUser(user);
      applyUserLanguage(user);

      return { success: true, user };
    } catch (error) {
      console.error("Login error:", error);
      return { success: false, message: "An error occurred. Please try again." };
    }
  };

  // (Optional) Verify OTP - replace with real API if you have one
  const verifyMfaOtp = async (otp) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        if (otp && otp.length === 6 && /^\d+$/.test(otp)) {
          resolve({ success: true });
        } else {
          resolve({ success: false, message: "Invalid OTP code. Please try again." });
        }
      }, 800);
    });
  };

  const logout = () => {
    localStorage.removeItem("authToken");
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("userEmail");
    localStorage.removeItem("userLanguagePreference");
    localStorage.removeItem("userData");
    setCurrentUser(null);
  };

  const value = {
    currentUser,
    login,
    logout,
    isAuthenticated: !!currentUser,
    verifyMfaOtp,
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};