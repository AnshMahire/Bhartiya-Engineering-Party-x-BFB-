import axios from "axios";

const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:4000";

const api = axios.create({
  baseURL: BASE_URL,
  timeout: 12000
});

export const createEmergency = async (payload) => {
  const { data } = await api.post("/emergency", payload);
  return data;
};

export const getActiveEmergency = async () => {
  const { data } = await api.get("/emergency/active");
  return data.emergency;
};

export const acceptEmergency = async (emergencyId) => {
  const { data } = await api.post(`/emergency/${emergencyId}/accept`);
  return data.emergency;
};

export const resetEmergency = async () => {
  const { data } = await api.post("/emergency/reset");
  return data;
};

export const getAmbulances = async () => {
  const { data } = await api.get("/ambulances");
  return data.ambulances;
};

export const getHospitals = async () => {
  const { data } = await api.get("/hospitals");
  return data.hospitals;
};

export default api;
