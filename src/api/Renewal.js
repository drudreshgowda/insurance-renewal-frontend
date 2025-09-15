const API_URL = "http://13.233.6.207:8000/api/channels";

export const channelAPI = {

  ChannelPerformanceSummary: async () => {
    try {
      const token = localStorage.getItem("authToken");
      if (!token) {
        return { success: false, message: "No token found, please login first." };
      }
      const response = await fetch(`${API_URL}/channels/`, {
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
      console.error("Channel API failed:", error);
      return { success: false, message: "Request failed" };
    }
  },

  CreateChannel: async (payload) => {
    try {
      const token = localStorage.getItem("authToken");
      if (!token) {
        return { success: false, message: "No token found, please login first." };
      }
  
      const response = await fetch(
        "http://13.233.6.207:8000/api/channels/channels/create_channel/",
        {
          method: "POST",
          mode: "cors",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(payload),
        }
      );
  
      const data = await response.json();
  
      if (!response.ok) {
        return { success: false, message: data.message || JSON.stringify(data) };
      }
  
      return { success: true, data };
    } catch (error) {
      console.error("Channel API failed:", error);
      return { success: false, message: error.message || "Request failed" };
    }
  },

  GetChannelById: async (id) => {
    try {
      const token = localStorage.getItem("authToken");
      if (!token) {
        return { success: false, message: "No token found, please login first." };
      }
      const response = await fetch(`${API_URL}/channels/${id}/`, {
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
      console.error("Channel API failed:", error);
      return { success: false, message: "Request failed" }; 
    }
  },
  UpdateChannel: async (id, payload) => {
    try {
      const token = localStorage.getItem("authToken");
      if (!token) {
        return { success: false, message: "No token found, please login first." };
      }
  
      const response = await fetch(
        `${API_URL}/channels/edit/${id}/`,
        {
          method: "PUT",   
          mode: "cors",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(payload),
        }
      );
  
      const data = await response.json();
  
      if (!response.ok) {
        return { success: false, message: data.message || JSON.stringify(data) };
      }
  
      return { success: true, data };
    } catch (error) {
      console.error("Channel API failed:", error);
      return { success: false, message: error.message || "Request failed" };
    }
  },
  
  DeleteChannel: async (id) => {
    try {
      const token = localStorage.getItem("authToken");
      if (!token) {
        return { success: false, message: "No token found, please login first." };
      }
  
      const response = await fetch(
        `${API_URL}/channels/delete/${id}/`,
        {
          method: "DELETE",
          mode: "cors",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
  
      if (!response.ok) {
        const data = await response.json();
        return { success: false, message: data.message || `Delete failed: ${response.status}` };
      }
  
      return { success: true, message: "Channel deleted successfully" };
    } catch (error) {
      console.error("Channel API failed:", error);
      return { success: false, message: error.message || "Request failed" };
    }
  },
  
  

}; 
