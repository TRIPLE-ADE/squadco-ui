import React from "react";
import { Redirect, Stack } from "expo-router";

// Context
import { useAuth } from "@/context/auth-context";

export default function AuthRoutesLayout() {
  const { isAuthenticated } = useAuth();

  if (isAuthenticated) return <Redirect href="/(tabs)" />;

  return (
    <Stack
      screenOptions={{
        ...(process.env.EXPO_OS !== "ios"
          ? {
              headerShadowVisible: true,
              headerTitleAlign: "center",
              headerTitleStyle: { fontWeight: "bold", fontSize: 20 },
            }
          : {
              headerLargeTitle: true,
              headerTransparent: true,
              headerBlurEffect: "systemChromeMaterial",
              headerLargeTitleShadowVisible: false,
              headerShadowVisible: true,
              headerLargeStyle: { backgroundColor: "transparent" },
            }),
      }}
    >
      <Stack.Screen name="index" options={{ headerShown: false }} />
      <Stack.Screen name="login" options={{ headerTitle: "Sign In" }} />
      <Stack.Screen name="signup" options={{ headerTitle: "Sign Up" }} />
    </Stack>
  );
}
