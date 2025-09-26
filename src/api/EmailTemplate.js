export const templateAPI = {

  GetTemplates: async () => {
    try {
      const token = localStorage.getItem("authToken");
      if (!token) {
        return { success: false, message: "No token found, please login first." };
      }

      const response = await fetch(
        "http://13.233.6.207:8000/api/templates/templates/",
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
      console.error("Get Templates API failed:", error);
      return { success: false, message: error.message || "Request failed" };
    }
  },

  CreateTemplate: async (templateData) => {
    try {
      const token = localStorage.getItem("authToken");
      if (!token) {
        return { success: false, message: "No token found, please login first." };
      }
  
      // Debugging log
      console.log("Sending template data:", templateData);
  
      const response = await fetch("http://13.233.6.207:8000/api/templates/templates/", {
        method: "POST",
        mode: "cors",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`, // ✅ Make sure backend expects Bearer token
        },
        body: JSON.stringify({
          name: templateData.name,
          template_type: templateData.template_type || templateData.type || 'email',
          channel: templateData.channel || 'email',
          category: templateData.category || 'general',
          subject: templateData.subject || '',
          content: templateData.content,
        }),
      });
  
      // Handle expired token
      if (response.status === 401) {
        return { success: false, message: "Token expired, please login again." };
      }
  
      // Handle validation / bad request
      if (!response.ok) {
        const errorData = await response.json().catch(() => null);
        console.error("API Error Response:", errorData);
  
        let errorMessage = `Request failed with status ${response.status}`;
        if (errorData) {
          if (errorData.detail) errorMessage = errorData.detail;
          else if (errorData.message) errorMessage = errorData.message;
          else if (typeof errorData === "object") {
            errorMessage = Object.entries(errorData)
              .map(([field, errors]) => `${field}: ${Array.isArray(errors) ? errors.join(", ") : errors}`)
              .join("; ");
          }
        }
  
        return { success: false, message: errorMessage };
      }
  
      const data = await response.json();
      console.log("Template created successfully:", data);
      return { success: true, data };
    } catch (error) {
      console.error("Create Template API failed:", error);
      return { success: false, message: error.message || "Request failed" };
    }
  },

  EditTemplate: async (id, payload) => {
    try {
      const token = localStorage.getItem("authToken");
      if (!token) {
        return { success: false, message: "No token found, please login first." };
      }

      console.log("Editing template with ID:", id, "Payload:", payload);

      const response = await fetch(`http://13.233.6.207:8000/api/templates/templates/${id}/`, {
        method: "PUT",
        mode: "cors",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      if (response.status === 401) {
        return { success: false, message: "Token expired, please login again." };
      }

      const data = await response.json();

      if (!response.ok) {
        console.error("EditTemplate API Error Response:", data);
        let errorMessage = `Request failed with status ${response.status}`;
        if (data.detail) {
          errorMessage = data.detail;
        } else if (data.message) {
          errorMessage = data.message;
        } else if (typeof data === "object") {
          errorMessage = Object.entries(data)
            .map(([field, errors]) => `${field}: ${Array.isArray(errors) ? errors.join(", ") : errors}`)
            .join("; ");
        }
        return { success: false, message: errorMessage };
      }

      console.log("Template updated successfully:", data);
      return { success: true, data: data };
    } catch (error) {
      console.error("EditTemplate API failed:", error);
      return { success: false, message: error.message || "Request failed" };
    }
  },

  DeleteTemplate: async (id) => {
    try {
      const token = localStorage.getItem("authToken");
      if (!token) {
        return { success: false, message: "No token found, please login first." };
      }

      console.log("Deleting template with ID:", id);

      const response = await fetch(`http://13.233.6.207:8000/api/templates/templates/${id}/`, {
        method: "DELETE",
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
        const errorData = await response.json().catch(() => null);
        console.error("DeleteTemplate API Error Response:", errorData);
        let errorMessage = `Delete failed with status ${response.status}`;
        if (errorData && errorData.detail) {
          errorMessage = errorData.detail;
        } else if (errorData && errorData.message) {
          errorMessage = errorData.message;
        }
        return { success: false, message: errorMessage };
      }

      // For DELETE requests, the response might be empty
      let data = null;
      try {
        data = await response.json();
      } catch (e) {
        // Response is empty, which is normal for DELETE
        data = { message: "Template deleted successfully" };
      }

      console.log("Template deleted successfully:", data);
      return { success: true, message: data.message || "Template deleted successfully" };
    } catch (error) {
      console.error("DeleteTemplate API failed:", error);
      return { success: false, message: error.message || "Request failed" };
    }
  }
};

  