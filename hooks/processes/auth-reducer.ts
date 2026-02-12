// reducers.js
import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  isAuthenticated: true,
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

export const { login, logout, signup } = mySlice.actions;
export const authReducer = mySlice.reducer;

// const rootReducer = combineReducers({
//   auth: mySlice.reducer,
// });

// export default rootReducer;
