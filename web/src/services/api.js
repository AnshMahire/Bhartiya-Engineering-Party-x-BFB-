import axios from "axios";

const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:4000";

const api = axios.create({
  baseURL: BASE_URL,
  timeout: 12000
});

export const createEmergency = async (payload) => {
  const { data } = await api.post("/emergency", payload);
  return data.emergency;
};

export const getTracking = async () => {
  const { data } = await api.get("/tracking");
  return data.emergency;
};

export const getAmbulanceRequest = async () => {
  const { data } = await api.get("/ambulance-request");
  return data.emergency;
};

export const acceptAmbulance = async () => {
  const { data } = await api.patch("/ambulance/accept");
  return data.emergency;
};

export const pickupPatient = async () => {
  const { data } = await api.patch("/ambulance/pickup");
  return data.emergency;
};

export const getHospitalAlert = async () => {
  const { data } = await api.get("/hospital-alert");
  return data.emergency;
};

export const confirmHospital = async () => {
  const { data } = await api.patch("/hospital/confirm");
  return data.emergency;
};

export const resetEmergency = async () => {
  const { data } = await api.post("/emergency/reset");
  return data.emergency;
};

export default api;
