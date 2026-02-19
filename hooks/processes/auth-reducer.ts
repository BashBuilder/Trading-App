// reducers.js
import { users } from "@/constants/constants";
import { register } from "@/services/auth.service";
import {
  clearToken,
  getToken,
  isTokenExpired,
  saveToken,
} from "@/services/token.service";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

type AuthState = {
  user: any;
  token: string | null;
  loading: boolean;
  error: string | null;
  isAuthenticated: boolean;
};

const initialState: AuthState = {
  user: null,
  token: null,
  loading: false,
  error: null,
  isAuthenticated: false,
};

export const hydrateAuth = createAsyncThunk(
  "auth/hydrate",
  async (_, { rejectWithValue }) => {
    const token = await getToken();
    if (!token) return null;
    const expired = await isTokenExpired();
    if (expired) {
      await clearToken();
      return null;
    }

    return token;
  },
);

export const loginRequest = createAsyncThunk(
  "auth/login",
  async (
    { email, password }: { email: string; password: string },
    { rejectWithValue },
  ) => {
    try {
      if (!email || !password) {
        throw new Error("Kindly fill all fields");
      }
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
    } catch (err: any) {
      return rejectWithValue(err.message || "Error signing in, try again");
    }
  },
);

export const registerRequest = createAsyncThunk(
  "auth/register",
  async (
    {
      email,
      password,
      name,
    }: { email: string; password: string; name: string },
    { rejectWithValue },
  ) => {
    try {
      const res = await register(email, password, name);
      return res;
    } catch (error: any) {
      return rejectWithValue(error?.message || "Registration failed");
    }
  },
);

const mySlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    logout: (state) => {
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
      clearToken();
    },
  },
  extraReducers: (builder) => {
    builder.addCase(loginRequest.fulfilled, (state, action) => {
      state.user = action.payload.user;
      state.token = action.payload.token;
      state.isAuthenticated = true;
      state.loading = false;
      saveToken(action.payload.token, 3600); // Save token with 1 hour expiration
    });
    builder.addCase(loginRequest.rejected, (state, action) => {
      state.error = action.payload as string;
      state.loading = false;
    });
    builder.addCase(registerRequest.fulfilled, (state, action) => {
      state.loading = false;
      state.user = action.payload.user;
      state.token = action.payload.token;
      state.isAuthenticated = true;
      saveToken(action.payload.token, 3600); // Save token with 1 hour expiration
    });
    builder.addCase(registerRequest.rejected, (state, action: any) => {
      state.loading = false;
      state.error = action.payload;
    });
    builder.addCase(hydrateAuth.fulfilled, (state, action) => {
      if (action.payload) {
        state.token = action.payload;
        state.isAuthenticated = true;
      }
    });
  },
});

export const { logout } = mySlice.actions;
export const authReducer = mySlice.reducer;
