import { getToken } from "@/services/token.service";
import axios from "axios";

const API_URL =
  process.env.PUBLIC_API_URL ||
  "https://jeniffer-unavenging-centrodorsally.ngrok-free.dev/api/v1/";

axios.defaults.baseURL = API_URL;
axios.defaults.headers.post["Content-Type"] = "application/json";

// This runs before EVERY request, awaits the token fresh each time
axios.interceptors.request.use(async (config) => {
  const token = await getToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default axios;
