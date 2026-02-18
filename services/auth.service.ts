import axios from "../config/axios";
export const login = async (email: string, password: string) => {
  try {
    // const
    const response = await axios.post("/auth/login", {
      email,
      password,
    });

    return response.data;
  } catch (error: any) {
    throw new Error(error?.response?.data?.message || "Login failed");
  }
};
