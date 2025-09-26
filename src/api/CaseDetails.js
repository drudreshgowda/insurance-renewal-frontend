const CASE_DETAILS_URL = "http://13.233.6.207:8000/api/case-details/combined-policy-data/";
const POLICY_MEMBERS_URL = "http://13.233.6.207:8000/api/policies/members/by-case/";

export const caseDetailsAPI = {

  getCaseDetails: async (caseId) => {
    try {
      const token = localStorage.getItem("authToken");
      if (!token) {
        return { success: false, message: "No token found, please login first." };
      }

      const response = await fetch(`${CASE_DETAILS_URL}${caseId}/`, {
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
        const errorData = await response.json().catch(() => ({}));
        return {
          success: false,
          message:
            errorData.message ||
            errorData.detail ||
            `Request failed with status ${response.status}`,
        };
      }

      const data = await response.json();
      const caseData = data.data || data;

      return { success: true, data: caseData };
    } catch (error) {
      console.error("Case Details API failed:", error);
      return { success: false, message: error.message || "Request failed" };
    }
  },

  getCaseOverview: async (caseId) => {
    try {
      const token = localStorage.getItem("authToken");
      if (!token) {
        return { success: false, message: "No token found, please login first." };
      }

      const response = await fetch(`${CASE_DETAILS_URL}${caseId}/`, {
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
        throw new Error(`Request failed with status ${response.status}`);
      }

      const res = await response.json();
      console.log("GetCaseOverview API response:", res);

      const caseData = res.data || res;
      console.log("Processed CaseOverview:", caseData);

      return { success: true, data: caseData };
    } catch (error) {
      console.error("Get Case Overview API failed:", error);
      return { success: false, message: error.message || "Request failed" };
    }
  },

  getPolicyMembers: async (caseId) => {
    try {
      const token = localStorage.getItem("authToken");
      if (!token) {
        return { success: false, message: "No token found, please login first." };
      }

      const url = `${POLICY_MEMBERS_URL}${caseId}/`;
      console.log("Fetching policy members from:", url);

      const response = await fetch(url, {
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
        const errorData = await response.json().catch(() => ({}));
        return {
          success: false,
          message:
            errorData.message ||
            errorData.detail ||
            `Request failed with status ${response.status}`,
        };
      }

      const data = await response.json();
      const members = data.data || data;

      return { 
        success: true, 
        data: members, 
        count: data.count || members.length || 0 
      };

    } catch (error) {
      console.error("Policy Members API failed:", error);
      return { success: false, message: error.message || "Request failed" };
    }
  },

  GetPreferences: async (caseId) => {
    try {
      const token = localStorage.getItem("authToken");
      if (!token) {
        return { success: false, message: "No token found, please login first." };
      }
  
      const response = await fetch(
        `http://13.233.6.207:8000/api/case-details/preferences-summary/${caseId}/`,
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
      console.error("Get Preferences API failed:", error);
      return { success: false, message: error.message || "Request failed" };
    }
  },

  GetOffers: async () => {
    try {
      const token = localStorage.getItem("authToken");
      if (!token) {
        return { success: false, message: "No token found, please login first." };
      }

      const response = await fetch(
        "http://13.233.6.207:8000/api/offers/offers/",
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
      console.error("Get Offers API failed:", error);
      return { success: false, message: error.message || "Request failed" };
    }
  },

  GetCaseHistoryAndPreferences: async (caseId) => {
    try {
      const token = localStorage.getItem("authToken");
      if (!token) {
        return { success: false, message: "No token found, please login first." };
      }
  
      // Fetch case timeline / history
      const caseResponse = await fetch(
        `http://13.233.6.207:8000/api/cases/${caseId}/timeline/`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
  
      if (caseResponse.status === 401) {
        return { success: false, message: "Token expired, please login again." };
      }
  
      if (!caseResponse.ok) {
        throw new Error(`Case timeline request failed with status ${caseResponse.status}`);
      }
  
      const caseData = await caseResponse.json();
  
      // Fetch preferences
      const prefResponse = await fetch(
        `http://13.233.6.207:8000/api/case-details/preferences-summary/${caseId}/`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
  
      if (prefResponse.status === 401) {
        return { success: false, message: "Token expired, please login again." };
      }
  
      if (!prefResponse.ok) {
        throw new Error(`Preferences request failed with status ${prefResponse.status}`);
      }
  
      const prefData = await prefResponse.json();
  
      // Map preferences to UI-friendly format
      const preferences = {
        email: prefData.email_preference || "not set",
        phone: prefData.phone_preference || "not set",
        whatsapp: prefData.whatsapp_preference || "not set",
        sms: prefData.sms_preference || "not set",
        ai_call: prefData.ai_call_preference || "not set",
        postal_mail: prefData.postal_mail_preference || "not set",
      };
  
      return {
        success: true,
        case: caseData.case || {},
        history: caseData.history || [],
        comments: caseData.comments || [],
        case_logs: caseData.case_logs || [],
        preferences,
      };
    } catch (error) {
      console.error("GetCaseHistoryAndPreferences API failed:", error);
      return { success: false, message: error.message || "Request failed" };
    }
  },

  AddComment: async (caseId, payload) => {
    try {
      const token = localStorage.getItem("authToken");
      if (!token) {
        return { success: false, message: "No token found, please login first." };
      }

      // Validate payload
      if (!payload || !payload.comment || !payload.comment.trim()) {
        return { success: false, message: "Comment text is required." };
      }

      // Prepare the payload for the API
      const apiPayload = {
        comment: payload.comment.trim(),
        user: payload.user || 'System',
        timestamp: payload.timestamp || new Date().toISOString(),
        type: payload.type || 'comment',
        case_id: caseId
      };

      console.log('Adding comment for case:', caseId, 'with payload:', apiPayload);
  
      const response = await fetch(
        `http://13.233.6.207:8000/api/cases/${caseId}/comments/`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(apiPayload),
        }
      );

      if (response.status === 401) {
        return { success: false, message: "Token expired, please login again." };
      }
  
      const data = await response.json();
  
      if (!response.ok) {
        console.error('AddComment API error:', data);
        return { success: false, message: data.message || data.detail || JSON.stringify(data) };
      }

      console.log('Comment added successfully:', data);
      return { success: true, data };
    } catch (error) {
      console.error("AddComment API failed:", error);
      return { success: false, message: error.message || "Request failed" };
    }
  },

  GetOutstandingSummary: async (caseId) => {
    try {
      const token = localStorage.getItem("authToken");
      if (!token) {
        return { success: false, message: "No token found, please login first." };
      }
  
      const url = `http://13.233.6.207:8000/api/case-tracking/cases/${caseId}/outstanding-amounts/summary/`;
      console.log('GetOutstandingSummary - Calling URL:', url);
      console.log('GetOutstandingSummary - Case ID:', caseId);
      console.log('GetOutstandingSummary - Token exists:', !!token);
  
      const response = await fetch(url, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
  
      console.log('GetOutstandingSummary - Response status:', response.status);
      console.log('GetOutstandingSummary - Response ok:', response.ok);
  
      if (response.status === 401) {
        return { success: false, message: "Token expired, please login again." };
      }
  
      if (!response.ok) {
        const errorText = await response.text();
        console.error('GetOutstandingSummary - Error response:', errorText);
        throw new Error(`Request failed with status ${response.status}: ${errorText}`);
      }
  
      const data = await response.json();
      console.log('GetOutstandingSummary API response:', data);
      console.log('GetOutstandingSummary - Data structure:', {
        hasSuccess: 'success' in data,
        hasData: 'data' in data,
        dataKeys: data.data ? Object.keys(data.data) : 'N/A',
        totalOutstanding: data.data?.total_outstanding,
        pendingCount: data.data?.pending_count
      });
      
      return { success: true, data: data.data || data };
    } catch (error) {
      console.error("GetOutstandingSummary API failed:", error);
      return { success: false, message: error.message || "Request failed" };
    }
  }
};

// Export GetOffers as a named export for direct access
export const GetOffers = caseDetailsAPI.GetOffers;

// Export GetPreferences as a named export for direct access
export const GetPreferences = caseDetailsAPI.GetPreferences;

// Export GetCaseHistoryAndPreferences as a named export for direct access
export const GetCaseHistoryAndPreferences = caseDetailsAPI.GetCaseHistoryAndPreferences;

// Export AddComment as a named export for direct access
export const AddComment = caseDetailsAPI.AddComment;

// Export GetOutstandingSummary as a named export for direct access
export const GetOutstandingSummary = caseDetailsAPI.GetOutstandingSummary;

