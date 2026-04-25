import axios from "axios";
import { Platform } from "react-native";

const defaultBaseUrl = Platform.OS === "android" ? "http://10.0.2.2:4000" : "http://localhost:4000";
const BASE_URL = process.env.EXPO_PUBLIC_API_URL || defaultBaseUrl;

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

export default api;
