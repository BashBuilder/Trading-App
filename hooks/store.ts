import { configureStore } from "@reduxjs/toolkit";
// import authReducer from "./processes/auth-reducer";
import { authReducer } from "./processes/auth-reducer";

const store = configureStore({
  reducer: {
    auth: authReducer,
  },
  // middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(thunk),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export default store;
