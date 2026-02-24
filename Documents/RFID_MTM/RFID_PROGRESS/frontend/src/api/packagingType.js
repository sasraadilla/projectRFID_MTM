import api from "./axios";

export const getPackagingTypes = () => api.get("/packaging-types");
export const createPackagingType = (data) => api.post("/packaging-types", data);
export const updatePackagingType = (id, data) =>
  api.put(`/packaging-types/${id}`, data);
export const deletePackagingType = (id) =>
  api.delete(`/packaging-types/${id}`);
