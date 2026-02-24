import api from "./axios";

// GET ALL PART
export const getParts = () => api.get("/parts");

// GET PART BY ID
export const getPartById = (id) => api.get(`/parts/${id}`);

// ADD PART
export const createPart = (data) => api.post("/parts", data);

// UPDATE PART
export const updatePart = (id, data) => api.put(`/parts/${id}`, data);

// DELETE PART
export const deletePart = (id) => api.delete(`/parts/${id}`);
