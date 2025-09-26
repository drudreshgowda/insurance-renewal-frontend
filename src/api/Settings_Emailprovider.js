const EMAIL_PROVIDER_URL = "http://13.233.6.207:8000/api/email-provider/providers/";

export const emailProviderAPI = {
  CreateProvider: async (payload) => {
    try {
      const token = localStorage.getItem("authToken");
      if (!token) {
        return { success: false, message: "No token found, please login first." };
      }

      console.log('API Request - URL:', EMAIL_PROVIDER_URL);
      console.log('API Request - Payload:', JSON.stringify(payload, null, 2));
      
      const response = await fetch(EMAIL_PROVIDER_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json();
      console.log('API Response - Status:', response.status);
      console.log('API Response - Data:', JSON.stringify(data, null, 2));

      if (!response.ok) {
        return { success: false, message: data.message || JSON.stringify(data) };
      }

      return { success: true, data };
    } catch (error) {
      console.error("CreateProvider API failed:", error);
      return { success: false, message: error.message || "Request failed" };
    }
  },

  GetProviders: async () => {
    try {
      const token = localStorage.getItem("authToken");
      if (!token) {
        return { success: false, message: "No token found, please login first." };
      }

      const response = await fetch(EMAIL_PROVIDER_URL, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (!response.ok) {
        return { success: false, message: data.message || JSON.stringify(data) };
      }

      return { success: true, data };
    } catch (error) {
      console.error("GetProviders API failed:", error);
      return { success: false, message: error.message || "Request failed" };
    }
  },

  UpdateProvider: async (providerId, payload) => {
    try {
      const token = localStorage.getItem("authToken");
      if (!token) {
        return { success: false, message: "No token found, please login first." };
      }

      const response = await fetch(`${EMAIL_PROVIDER_URL}${providerId}/`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (!response.ok) {
        return { success: false, message: data.message || JSON.stringify(data) };
      }

      return { success: true, data };
    } catch (error) {
      console.error("UpdateProvider API failed:", error);
      return { success: false, message: error.message || "Request failed" };
    }
  },

  DeleteProvider: async (providerId) => {
    try {
      const token = localStorage.getItem("authToken");
      if (!token) {
        return { success: false, message: "No token found, please login first." };
      }

      const response = await fetch(`${EMAIL_PROVIDER_URL}${providerId}/`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        const data = await response.json();
        return { success: false, message: data.message || JSON.stringify(data) };
      }

      return { success: true };
    } catch (error) {
      console.error("DeleteProvider API failed:", error);
      return { success: false, message: error.message || "Request failed" };
    }
  },
};
