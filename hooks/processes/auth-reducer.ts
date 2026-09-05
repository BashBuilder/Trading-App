// reducers.js
import axios from "@/config/axios";
import { clearToken } from "@/services/token.service";
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

function extractErrorMessage(error: any, fallback: string) {
  return (
    error?.response?.data?.errors?.[0] ||
    error?.response?.data?.message ||
    fallback
  );
}

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
      return rejectWithValue({
        message: extractErrorMessage(error, "Error signing in, try again"),
        status: error?.response?.status,
        data: error?.response?.data,
      });
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
        extractErrorMessage(error, "Error during registration"),
      );
    }
  },
);

export const verifyOtpRequest = createAsyncThunk(
  "auth/verifyOtp",
  async (
    {
      email,
      otp,
      purpose = "verify_email",
    }: { email: string; otp: string; purpose?: "verify_email" | "reset_password" },
    { rejectWithValue },
  ) => {
    try {
      const { data } = await axios.post("auth/verify-otp", {
        email,
        otp,
        purpose,
      });
      return data as any;
    } catch (error: any) {
      return rejectWithValue(extractErrorMessage(error, "Invalid code"));
    }
  },
);

export const resendOtpRequest = createAsyncThunk(
  "auth/resendOtp",
  async (
    {
      email,
      purpose = "verify_email",
    }: { email: string; purpose?: "verify_email" | "reset_password" },
    { rejectWithValue },
  ) => {
    try {
      const { data } = await axios.post("auth/resend-otp", { email, purpose });
      return data as any;
    } catch (error: any) {
      return rejectWithValue(
        extractErrorMessage(error, "Couldn't resend code, try again"),
      );
    }
  },
);

export const forgotPasswordRequest = createAsyncThunk(
  "auth/forgotPassword",
  async ({ email }: { email: string }, { rejectWithValue }) => {
    try {
      const { data } = await axios.post("auth/forgot-password", { email });
      return data as any;
    } catch (error: any) {
      return rejectWithValue(
        extractErrorMessage(error, "Couldn't send reset code, try again"),
      );
    }
  },
);

export const resetPasswordRequest = createAsyncThunk(
  "auth/resetPassword",
  async (
    {
      email,
      otp,
      newPassword,
    }: { email: string; otp: string; newPassword: string },
    { rejectWithValue },
  ) => {
    try {
      const { data } = await axios.post("auth/reset-password", {
        email,
        otp,
        newPassword,
      });
      return data as any;
    } catch (error: any) {
      return rejectWithValue(
        extractErrorMessage(error, "Couldn't reset password, try again"),
      );
    }
  },
);

export const deactivateAccountRequest = createAsyncThunk(
  "auth/deactivateAccount",
  async ({ password }: { password: string }, { rejectWithValue }) => {
    try {
      const { data } = await axios.post("auth/deactivate", { password });
      return data as any;
    } catch (error: any) {
      return rejectWithValue(
        extractErrorMessage(error, "Couldn't deactivate account, try again"),
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
    updateUser: (state, action) => {
      state.user = action.payload;
    },
    // Populates redux from an existing valid token on cold app launch — see AuthGate in
    // app/_layout.tsx. Without this, a returning already-logged-in user has no `user.uid`
    // in redux until their next fresh login, which broke RevenueCat identification.
    hydrateAuth: (state, action) => {
      state.user = action.payload.user;
      state.token = action.payload.token;
      state.isAuthenticated = true;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginRequest.fulfilled, (state, action) => {
        state.user = action.payload.user;
        state.token = action.payload.accessToken;
        state.isAuthenticated = true;
        state.error = null;
      })
      .addCase(verifyOtpRequest.fulfilled, (state, action) => {
        // Only signup verification returns tokens (auto-login);
        // a reset-password OTP check just confirms the code is valid.
        if (action.payload.accessToken) {
          state.user = action.payload.user;
          state.token = action.payload.accessToken;
          state.isAuthenticated = true;
        }
        state.error = null;
      })
      .addCase(deactivateAccountRequest.fulfilled, (state) => {
        state.user = null;
        state.token = null;
        state.isAuthenticated = false;
        clearToken();
      });
  },
});

export const { logout, updateUser, hydrateAuth } = mySlice.actions;
export const authReducer = mySlice.reducer;
