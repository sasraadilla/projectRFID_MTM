import api from "./axios";

export const getAssets = () => api.get("/assets");
export const createAsset = (data) => api.post("/assets", data);
export const getAssetById = (id) => api.get(`/assets/${id}`);
export const updateAsset = (id, data) =>
  api.put(`/assets/${id}`, data);
export const deleteAsset = (id) => api.delete(`/assets/${id}`);
