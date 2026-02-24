import api from "./axios";

export const getPackagings = () => api.get("/packagings");
export const getPackagingById = (id) => api.get(`/packagings/${id}`);
export const createPackaging = (data) => api.post("/packagings", data);
export const updatePackaging = (id, data) => api.put(`/packagings/${id}`, data);
export const deletePackaging = (id) => api.delete(`/packagings/${id}`);
