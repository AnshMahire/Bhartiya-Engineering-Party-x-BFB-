import axios from "axios";
import { NativeModules, Platform } from "react-native";

function getMetroHost() {
  const scriptURL = NativeModules.SourceCode?.scriptURL || "";
  const match = scriptURL.match(/https?:\/\/([^/:]+)/);
  return match ? match[1] : null;
}

const metroHost = getMetroHost();
const LAN_BACKEND_HOST = "10.38.13.181";
const defaultBaseUrl =
  Platform.OS === "android"
    ? `http://${LAN_BACKEND_HOST || metroHost || "10.0.2.2"}:4000`
    : `http://${LAN_BACKEND_HOST || metroHost || "localhost"}:4000`;

const BASE_URL = process.env.EXPO_PUBLIC_API_URL || defaultBaseUrl;

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

export const resetEmergency = async () => {
  const { data } = await api.post("/emergency/reset");
  return data.emergency;
};

export default api;
