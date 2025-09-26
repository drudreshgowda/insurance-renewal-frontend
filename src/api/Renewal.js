const API_URL = "http://13.233.6.207:8000/api/channels";
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

      const response = await fetch(`${API_URL}/create_channel/`, {
        method: "POST",
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
      console.error("CreateChannel API failed:", error);
      return { success: false, message: error.message || "Request failed" };
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




