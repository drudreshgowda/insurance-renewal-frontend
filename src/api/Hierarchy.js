export const hierarchyAPI = {
    CreateUnit: async (payload) => {
      try {
        const token = localStorage.getItem("authToken");
        if (!token) {
          return { success: false, message: "No token found, please login first." };
        }
    
        const response = await fetch(
          "http://13.233.6.207:8000/api/hierarchy/api/units/",
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
        console.error("Hierarchy API failed:", error);
        return { success: false, message: error.message || "Request failed" };
      }
    },
  };
  
  