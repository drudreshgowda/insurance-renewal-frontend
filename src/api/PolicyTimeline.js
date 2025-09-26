const API_URL = "http://13.233.6.207:8000/api/policy-timeline/complete-api/";

export const policyTimelineAPI = {
  getPolicyTimeline: async (policyId) => {
    try {
      const token = localStorage.getItem("authToken");
      if (!token) {
        return { success: false, message: "No token found, please login first." };
      }

      const response = await fetch(`${API_URL}${policyId}/`, {
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
      console.log("Policy Timeline API Response:", data);

      if (data.success && data.data) {
        return { success: true, data: data.data };
      } else {
        return { success: false, message: "No policy timeline data found" };
      }
    } catch (error) {
      console.error("Policy Timeline API failed:", error);
      return { success: false, message: "Request failed" };
    }
  },
};
