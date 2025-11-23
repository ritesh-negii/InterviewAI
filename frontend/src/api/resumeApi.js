import API from "./axiosInstance";

// ==============================
// POST - Upload Resume
// ==============================
export const uploadResumeApi = async (formData) => {
  try {
    const res = await API.post("/api/resume/upload", formData);
    return res.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

// ==============================
// GET - Fetch Logged-in User Resume
// ==============================
export const getMyResumeApi = async () => {
  try {
    const res = await API.get("/api/resume/my");
    return res.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

// ==============================
// PATCH - Confirm Resume
// ==============================
export const confirmResumeApi = async (resumeId) => {
  try {
    const res = await API.patch(`/api/resume/confirm/${resumeId}`);
    return res.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

// ==============================
// PATCH - Update Resume Details (FIXED ✅)
// ==============================
export const updateResumeApi = async (resumeId, data) => {
  try {
    const res = await API.patch(`/api/resume/${resumeId}`, data);
    return res.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};
