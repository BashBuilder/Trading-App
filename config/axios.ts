import axios from "axios";
import Cookies from "js-cookie";

const token = Cookies.get("qorepay-session");
const API_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000/api/v1/";

axios.defaults.baseURL = API_URL;
axios.defaults.headers.common["Authorization"] = token ? `Bearer ${token}` : "";
axios.defaults.headers.post["Content-Type"] = "application/json";

export default axios;
