import API from "./axiosInstance";

export const updateProfileApi = async (data) => {
  const res = await API.put("/api/profile/update", data);
  return res.data;
};
