// app/_layout.tsx
import axios from "@/config/axios";
import { useAppDispatch } from "@/hooks/hooks";
import { updateUser } from "@/hooks/processes/auth-reducer";
import { getToken } from "@/services/token.service";
import { Stack, useRouter, useSegments } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { useEffect, useState } from "react";

// Keep splash screen visible until auth check completes
SplashScreen.preventAutoHideAsync();

function AuthGate() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const segments = useSegments();
  const [isReady, setIsReady] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const token = await getToken();
        if (!token) {
          setIsAuthenticated(false);
          return;
        }
        // console.log("Token found, verifying...", token);

        // Verify token is still valid with your API
        const user = await axios.get("auth/user", {
          headers: { Authorization: `Bearer ${token}` },
        });

        dispatch(updateUser(user.data));
        // console.log("Token valid, user data:", user);
        setIsAuthenticated(true);
      } catch (error) {
        setIsAuthenticated(false);
      } finally {
        setIsReady(true);
        await SplashScreen.hideAsync(); // hide splash only after check
      }
    };
    checkAuth();
  }, []);

  useEffect(() => {
    if (!isReady) return;

    const inAuthGroup = segments[0] === "(auth)";

    if (isAuthenticated && inAuthGroup) {
      router.replace("/dashboard");
    }
    // else if (!isAuthenticated && !inAuthGroup) {
    //   router.replace("/(auth)/login");
    // }
  }, [isReady, isAuthenticated, segments]);

  return null; // this component only handles routing logic
}

export default function RootLayout() {
  return (
    <>
      <Stack screenOptions={{ headerShown: false }} />
      <AuthGate />
    </>
  );
}
