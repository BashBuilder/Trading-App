// import store from "@/hooks/store";
// import { Stack } from "expo-router";
// import { StatusBar } from "expo-status-bar";
// import Toast from "react-native-toast-message";
// import { Provider } from "react-redux";
// import "../global.css";

// export default function RootLayout() {
//   return (
//     <>
//       <Provider store={store}>
//         <StatusBar style="light" />
//         <Stack
//           screenOptions={{
//             headerShown: false,
//           }}
//         />
//         <Toast />
//       </Provider>
//     </>
//   );
// }

import SplashScreen from "@/components/SplashScreens";
import axios from "@/config/axios";
import store from "@/hooks/store";
import { getToken } from "@/services/token.service";
import { Stack, useRouter, useSegments } from "expo-router";
import * as ExpoSplashScreen from "expo-splash-screen";
import { StatusBar } from "expo-status-bar";
import { useEffect, useState } from "react";
import Toast from "react-native-toast-message";
import { Provider } from "react-redux";
import "../global.css";

// Prevent the native splash (solid dark bg) from hiding until we're ready
ExpoSplashScreen.preventAutoHideAsync();

function AuthGate() {
  const router = useRouter();
  const segments = useSegments();
  const [isReady, setIsReady] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [showSplash, setShowSplash] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const token = await getToken();

        if (!token) {
          setIsAuthenticated(false);
          return;
        }

        await axios.get("auth/user", {
          headers: { Authorization: `Bearer ${token}` },
        });

        setIsAuthenticated(true);
      } catch {
        setIsAuthenticated(false);
      } finally {
        setIsReady(true);
        await ExpoSplashScreen.hideAsync();
      }
    };

    checkAuth();
  }, []);

  useEffect(() => {
    if (!isReady) return;

    const inAuthGroup = segments[0] === "(auth)";
    // if (isAuthenticated && inAuthGroup) {
    //   router.replace("/(app)/dashboard");
    // }
    // else if (!isAuthenticated && !inAuthGroup) {
    //   router.replace("/(auth)/login");
    // }
  }, [isReady, isAuthenticated, segments]);

  // Show our custom full-bleed splash while auth is resolving
  if (showSplash) {
    return <SplashScreen onFinish={() => setShowSplash(false)} />;
  }

  return null;
}

export default function RootLayout() {
  return (
    <Provider store={store}>
      <StatusBar style="light" />
      <Stack screenOptions={{ headerShown: false }} />
      <AuthGate />
      <Toast />
    </Provider>
  );
}
