// reducers.js
import axios from "@/config/axios";
import { clearToken, getToken, isTokenExpired } from "@/services/token.service";
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
      const { data } = await axios.post("auth/login", {
        email,
        password,
      });
      return data as any;
    } catch (error: any) {
      return rejectWithValue(
        error?.response?.data?.errors?.[0] ||
          error?.response?.data?.message ||
          error?.message ||
          "Error signing in, try again",
      );
    }
  },
);

export const registerRequest = createAsyncThunk(
  "auth/register",
  async (
    {
      email,
      password,
      firstName,
      lastName,
    }: { email: string; password: string; firstName: string; lastName: string },
    { rejectWithValue },
  ) => {
    try {
      const { data } = await axios.post("auth/register", {
        email,
        password,
        firstName,
        lastName,
      });
      return data as any;
    } catch (error: any) {
      return rejectWithValue(
        error?.response?.data?.errors?.[0] ||
          error?.response?.data?.message ||
          error?.message ||
          "Error during registration",
      );
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
      // state.isAuthenticated = true;
      // state.loading = false;
      // saveToken(action.payload.token, 3600); // Save token with 1 hour expiration
    });
    builder.addCase(loginRequest.rejected, (state, action) => {
      state.error = action.payload as string;
      state.loading = false;
    });
    builder.addCase(registerRequest.fulfilled, (state, action) => {
      state.loading = false;
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
