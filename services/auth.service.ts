import { users } from "@/constants/constants";

export const login = async (email: string, password: string) => {
  try {
    await new Promise((res) => setTimeout(res, 1000)); // simulate delay

    const user = users.find(
      (u) => u.email === email && u.password === password,
    );

    if (!user) {
      throw new Error("Invalid credentials");
    }

    return {
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
      },
      token: `fake-jwt-token-${user.id}`,
    };
  } catch (error: any) {
    throw new Error(error?.response?.data?.message || "Login failed");
  }
};

export const register = async (
  email: string,
  password: string,
  name: string,
) => {
  try {
    await new Promise((res) => setTimeout(res, 1000)); // simulate delay

    const existingUser = users.find((u) => u.email === email);
    if (existingUser) {
      throw new Error("Email already in use");
    }

    const newUser = {
      id: Date.now(),
      name,
      email,
      password,
    };

    users.push(newUser);

    return {
      user: {
        id: newUser.id,
        email: newUser.email,
        name: newUser.name,
      },
      token: `fake-jwt-token-${newUser.id}`,
    };
  } catch (error: any) {
    throw new Error(error?.response?.data?.message || "Registration failed");
  }
};
