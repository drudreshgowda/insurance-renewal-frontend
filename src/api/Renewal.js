const API_URL = "http://13.233.6.207:8000/api/channels/channels";
const DASHBOARD_URL = "http://13.233.6.207:8000/api/dashboard";

export const channelAPI = {

  GetCountsCases: async () => {
    try {
      const token = localStorage.getItem("authToken");
      if (!token) {
        return { success: false, message: "No token found, please login first." };
      }

      const response = await fetch(`${DASHBOARD_URL}/summary/`, {
        method: "GET",
        mode: "cors",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.status === 401) {
        return { success: false, message: "Token expired, please login again." };
      }

      if (!response.ok) {
        throw new Error(`Request failed: ${response.status}`);
      }

      const data = await response.json();
      return { success: true, data };
    } catch (error) {
      console.error("GetCountsCases API failed:", error);
      return { success: false, message: error.message || "Request failed" };
    }
  },

  ChannelPerformanceSummary: async () => {
    try {
      const token = localStorage.getItem("authToken");
      if (!token) {
        return { success: false, message: "No token found, please login first." };
      }

      const response = await fetch(`${API_URL}/`, {
        method: "GET",
        mode: "cors",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error(`Request failed: ${response.status}`);
      }

      const data = await response.json();
      return { success: true, data };
    } catch (error) {
      console.error("ChannelPerformanceSummary API failed:", error);
      return { success: false, message: error.message || "Request failed" };
    }
  },

  CreateChannel: async (payload) => {
    try {
      const token = localStorage.getItem("authToken");
      if (!token) {
        return { success: false, message: "No token found, please login first." };
      }

      // eslint-disable-next-line no-console
      console.log("API Request:", {
        url: `${API_URL}/`,
        method: "POST",
        payload
      });

      // Log the full request details
      console.log("Making API request to:", `${API_URL}/create_channel/`);
      console.log("Request headers:", {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token.substring(0, 10)}...` // Only log part of the token for security
      });

      const response = await fetch(`${API_URL}/create_channel/`, {
        method: "POST",
        mode: "cors",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      // Log response details
      console.log("Response status:", response.status);
      console.log("Response headers:", Object.fromEntries([...response.headers.entries()]));

      let responseData;
      try {
        responseData = await response.text();
        // Try to parse as JSON if possible
        try {
          responseData = JSON.parse(responseData);
        } catch (e) {
          // Keep as text if not JSON
        }
      } catch (e) {
        responseData = null;
      }

      // eslint-disable-next-line no-console
      console.log("API Response:", {
        status: response.status,
        data: responseData
      });

      if (!response.ok) {
        if (response.status === 401) {
          return { success: false, message: "Authentication failed. Please login again." };
        }
        
        if (response.status === 404) {
          return { success: false, message: "API endpoint not found" };
        }

        if (typeof responseData === 'object' && responseData !== null) {
          return { 
            success: false, 
            message: responseData.message || responseData.detail || "Server error occurred"
          };
        }

        return { 
          success: false, 
          message: responseData || "Server error occurred"
        };
      }

      return { 
        success: true, 
        data: typeof responseData === 'object' ? responseData : { message: "Channel created successfully" }
      };
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error("CreateChannel API failed:", error);
      return { 
        success: false, 
        message: error.message || "Network error occurred" 
      };
    }
  },

  GetChannelById: async (id) => {
    try {
      const token = localStorage.getItem("authToken");
      if (!token) {
        return { success: false, message: "No token found, please login first." };
      }

      const response = await fetch(`${API_URL}/${id}/`, {
        method: "GET",
        mode: "cors",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error(`Request failed: ${response.status}`);
      }

      const data = await response.json();
      return { success: true, data };
    } catch (error) {
      console.error("GetChannelById API failed:", error);
      return { success: false, message: error.message || "Request failed" };
    }
  },

  UpdateChannel: async (id, payload) => {
    try {
      const token = localStorage.getItem("authToken");
      if (!token) {
        return { success: false, message: "No token found, please login first." };
      }

      const response = await fetch(`${API_URL}/edit/${id}/`, {
        method: "PUT",
        mode: "cors",
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
      console.error("UpdateChannel API failed:", error);
      return { success: false, message: error.message || "Request failed" };
    }
  },

  DeleteChannel: async (id) => {
    try {
      const token = localStorage.getItem("authToken");
      if (!token) {
        return { success: false, message: "No token found, please login first." };
      }

      const response = await fetch(`${API_URL}/delete/${id}/`, {
        method: "DELETE",
        mode: "cors",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        const data = await response.json();
        return { success: false, message: data.message || `Delete failed: ${response.status}` };
      }

      return { success: true, message: "Channel deleted successfully" };
    } catch (error) {
      console.error("DeleteChannel API failed:", error);
      return { success: false, message: error.message || "Request failed" };
    }
  },

};




