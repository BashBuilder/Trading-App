import axios from "axios";

// const token = Cookies.get("qorepay-session");
const API_URL =
  process.env.PUBLIC_API_URL ||
  "https://jeniffer-unavenging-centrodorsally.ngrok-free.dev/api/v1/";

axios.defaults.baseURL = API_URL;
// axios.defaults.headers.common["Authorization"] = token ? `Bearer ${token}` : "";
axios.defaults.headers.post["Content-Type"] = "application/json";

export default axios;
