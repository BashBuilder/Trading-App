import axios from "@/config/axios";
import store from "@/hooks/store";
import { getToken } from "@/services/token.service";
import { Stack, useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useEffect } from "react";
import Toast from "react-native-toast-message";
import { Provider } from "react-redux";
import "../global.css";

export default function RootLayout() {
  const router = useRouter();
  const getUser = async () => {
    const user = await axios.get("auth/user", {
      headers: {
        Authorization: `Bearer ${await getToken()}`,
      },
    });
    return user;
  };
  useEffect(() => {
    getUser().then((user) => {
      console.log("User data:", user.data);
      router.replace("/dashboard");
    });
  }, []);

  return (
    <>
      <Provider store={store}>
        <StatusBar style="dark" />
        <Stack
          screenOptions={{
            headerShown: false,
          }}
        />
        <Toast />
      </Provider>
    </>
  );
}
