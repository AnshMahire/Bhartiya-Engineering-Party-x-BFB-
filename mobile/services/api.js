import axios from "axios";
import { NativeModules, Platform } from "react-native";

function getMetroHost() {
  const scriptURL = NativeModules.SourceCode?.scriptURL || "";
  const match = scriptURL.match(/https?:\/\/([^/:]+)/);
  return match ? match[1] : null;
}

const metroHost = getMetroHost();
const defaultBaseUrl = (() => {
  if (metroHost) {
    return `http://${metroHost}:4000`;
  }

  if (Platform.OS === "android") {
    return "http://10.0.2.2:4000";
  }

  return "http://localhost:4000";
})();

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
