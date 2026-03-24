import { configureStore } from "@reduxjs/toolkit";
import { authReducer } from "./processes/auth-reducer";
import { subscriptionReducer } from "./processes/subscription-reducer";

const store = configureStore({
  reducer: {
    auth: authReducer,
    subscription: subscriptionReducer,
  },
  // middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(thunk),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export default store;
