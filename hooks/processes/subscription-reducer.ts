import { Subscription } from "@/services/subscription.service";
import { createSlice } from "@reduxjs/toolkit";

export interface SubscriptionState {
  subscription: Subscription | null;
  loading: boolean;
  error: string | null;
}

const initialState: SubscriptionState = {
  subscription: null,
  loading: false,
  error: null,
};

const subscriptionSlice = createSlice({
  name: "subscription",
  initialState,
  reducers: {
    updateSubscription(state, action) {
      const subscriptionInfo = action.payload;
      state.subscription = subscriptionInfo;
    },
    clearSubscription(state) {
      state.subscription = null;
    },
  },
});

export const { updateSubscription, clearSubscription } =
  subscriptionSlice.actions;

export const subscriptionReducer = subscriptionSlice.reducer;
