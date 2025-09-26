export const UploadApI = {

  SelectFile: async (file) => {
    try {
      const token = localStorage.getItem("authToken");
      if (!token) {
        return { success: false, message: "No token found, please login first." };
      }

      const formData = new FormData();
      formData.append("file", file);
      formData.append("filename", file.name); // required by backend

      const response = await fetch(
        "http://13.233.6.207:8000/api/policy_data/file-uploads/",
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: formData,
        }
      );

      const data = await response.json();

      if (response.status === 401) {
        return { success: false, message: "Token expired, please login again." };
      }

      if (!response.ok) {
        return {
          success: false,
          message: data.message || JSON.stringify(data),
          errors: data.errors,
        };
      }

      return { success: true, data };
    } catch (error) {
      console.error("File Upload API failed:", error);
      return { success: false, message: error.message || "Request failed" };
    }
  },

  GetFileUploads: async () => {
    try {
      const token = localStorage.getItem("authToken");
      if (!token) {
        return { success: false, message: "No token found, please login first." };
      }

      const response = await fetch(
        "http://13.233.6.207:8000/api/files_upload/api/file-uploads/",
        {
          method: "GET",
          mode: "cors",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.status === 401) {
        return { success: false, message: "Token expired, please login again." };
      }

      if (!response.ok) {
        throw new Error(`Request failed with status ${response.status}`);
      }

      const data = await response.json();
      return { success: true, data };
    } catch (error) {
      console.error("File Uploads API failed:", error);
      return { success: false, message: error.message || "Request failed" };
    }
  },

  Createcampaigns: async (campaignData) => {
    try {
      const token = localStorage.getItem("authToken");
      if (!token) {
        return { success: false, message: "No token found, please login first." };
      }

      const response = await fetch(
        "http://13.233.6.207:8000/api/campaigns/create-from-file/",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(campaignData),
        }
      );

      const data = await response.json();

      if (response.status === 401) {
        return { success: false, message: "Token expired, please login again." };
      }

      if (!response.ok) {
        return {
          success: false,
          message: data.message || JSON.stringify(data),
          errors: data.errors,
        };
      }

      return { success: true, data };
    } catch (error) {
      console.error("Create Campaign API failed:", error);
      return { success: false, message: error.message || "Request failed" };
    }
  },

  GetTemplates: async () => {
    try {
      const token = localStorage.getItem("authToken");
      if (!token) {
        return { success: false, message: "No token found, please login first." };
      }

      const response = await fetch(
        "http://13.233.6.207:8000/api/templates/templates/get_all_templates/",
        {
          method: "GET",
          mode: "cors",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.status === 401) {
        return { success: false, message: "Token expired, please login again." };
      }

      if (!response.ok) {
        throw new Error(`Request failed with status ${response.status}`);
      }

      const data = await response.json();
      return { success: true, data };
    } catch (error) {
      console.error("Templates API failed:", error);
      return { success: false, message: error.message || "Request failed" };
    }
  },

  ActiveCampaigns: async () => {
    try {
      const token = localStorage.getItem("authToken");
      if (!token) {
        console.log("No auth token found for ActiveCampaigns API");
        return { success: false, message: "No token found, please login first." };
      }

      console.log("Calling ActiveCampaigns API with token:", token.substring(0, 10) + "...");
      
      const response = await fetch(
        "http://13.233.6.207:8000/api/campaigns/list/",
        {
          method: "GET",
          mode: "cors",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      console.log("ActiveCampaigns API response status:", response.status);

      if (response.status === 401) {
        console.log("Token expired for ActiveCampaigns API");
        return { success: false, message: "Token expired, please login again." };
      }

      if (!response.ok) {
        const errorText = await response.text();
        console.error("ActiveCampaigns API error response:", errorText);
        throw new Error(`Request failed with status ${response.status}: ${errorText}`);
      }

      const data = await response.json();
      console.log("ActiveCampaigns API response data:", data);
      return { success: true, data };
    } catch (error) {
      console.error("Active Campaigns API failed:", error);
      return { success: false, message: error.message || "Request failed" };
    }
  }
  
 
  
};

