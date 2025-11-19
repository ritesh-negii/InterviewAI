import API from "./axiosInstance";

export const uploadResumeApi = async (formData) => {
  try {
    const res = await API.post("/api/resume/upload", formData); 
    return res.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

