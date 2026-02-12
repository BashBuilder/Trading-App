// reducers.js
import { createSlice } from "@reduxjs/toolkit";
import { combineReducers } from "redux";

const initialState = {
  isAuthenticated: false,
};

const mySlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    login: (state) => {
      state.isAuthenticated = true;
    },
    logout: (state) => {
      state.isAuthenticated = false;
    },
    signup: (state) => {
      state.isAuthenticated = true;
    },
    // Define your actions and reducers here
  },
});

const rootReducer = combineReducers({
  authReducer: mySlice.reducer,
  login: mySlice.actions.login,
  logout: mySlice.actions.logout,
  signup: mySlice.actions.signup,
  // Add more slices as needed
});

export default rootReducer;
