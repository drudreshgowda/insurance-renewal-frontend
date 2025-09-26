const API_URL = "http://13.233.6.207:8000/api/auth";
export const loginAPI = {
  login: async (formData) => {
    try {
      const payload = {
        email: formData.email,
        password: formData.password,
      };
      const response = await fetch(`${API_URL}/login/`, {
        method: "POST",
        mode: "cors",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });
      const data = await response.json();
      return data; 
    } catch (error) {
      console.error("Login failed:", error);
      return { success: false, message: "Request failed" };
    }
  },
};
