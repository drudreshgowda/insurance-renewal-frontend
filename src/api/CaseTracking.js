const API_URL = "http://13.233.6.207:8000/api/case-tracking/cases/";

export const channelAPI = {

  CaseTrackingList: async () => {
    try {
      const token = localStorage.getItem("authToken");
      if (!token) {
        return { success: false, message: "No token found, please login first." };
      }
      
      // First, try to get all records with a simple approach
      try {
        // Try with limit/offset parameters
        const params = new URLSearchParams({
          limit: 1000,
          offset: 0
        });
        
        const response = await fetch(`${API_URL}?${params}`, {
          method: "GET",
          mode: "cors",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`, 
          },
        });
        
        if (response.ok) {
          const data = await response.json();
          console.log("API Response with limit/offset:", data);
          
          // Handle different response formats
          let records = [];
          if (data.results && Array.isArray(data.results)) {
            records = data.results;
          } else if (Array.isArray(data)) {
            records = data;
          } else {
            records = data.data || data;
          }
          
          if (records.length > 0) {
            return { success: true, data: records };
          }
        }
      } catch (error) {
        console.log("Limit/offset approach failed, trying pagination:", error);
      }
      
      // If limit/offset doesn't work, try pagination
      let allRecords = [];
      let currentPage = 1;
      let hasMorePages = true;
      
      while (hasMorePages) {
        const params = new URLSearchParams({
          page: currentPage,
          page_size: 100,
        });
        
        const response = await fetch(`${API_URL}?${params}`, {
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
        console.log(`Page ${currentPage} response:`, data);
        
        // Handle different response formats
        let records = [];
        if (data.results && Array.isArray(data.results)) {
          records = data.results;
          hasMorePages = data.next !== null && data.next !== undefined;
        } else if (Array.isArray(data)) {
          records = data;
          hasMorePages = false;
        } else {
          records = data.data || data;
          hasMorePages = false;
        }
        
        allRecords = allRecords.concat(records);
        
        // If we got fewer records than requested, we've reached the end
        if (records.length < 100) {
          hasMorePages = false;
        }
        
        currentPage++;
        
        // Safety check to prevent infinite loops
        if (currentPage > 50) {
          console.warn("Reached maximum page limit, stopping pagination");
          hasMorePages = false;
        }
      }
      
      console.log("Total records fetched:", allRecords.length);
      return { success: true, data: allRecords };
    } catch (error) {
      console.error("Channel API failed:", error);
      return { success: false, message: "Request failed" };
    }
  }
};
