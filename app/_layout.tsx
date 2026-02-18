import store from "@/hooks/store";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { Provider } from "react-redux";
import "../global.css";

export default function RootLayout() {
  return (
    <>
      <Provider store={store}>
        <StatusBar style="light" />
        <Stack
          screenOptions={{
            headerShown: false,
          }}
        >
          {/* <Stack.Screen name="(tabs)" /> */}
        </Stack>
      </Provider>
    </>
  );
}
