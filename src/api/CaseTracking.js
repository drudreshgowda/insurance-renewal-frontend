const API_URL = "http://13.233.6.207:8000/api/case-tracking/cases/";

export const channelAPI = {

  CaseTrackingList: async () => {
    try {
      const token = localStorage.getItem("authToken");
      if (!token) {
        return { success: false, message: "No token found, please login first." };
      }
      const response = await fetch(`${API_URL}`, {
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



};