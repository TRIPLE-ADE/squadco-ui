import { Stack } from "expo-router";

export default function StacksLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: true,
        headerShadowVisible: true,
        headerTitleAlign: "center",
        headerTitleStyle: {
          fontWeight: "bold",
          fontSize: 20,
        },
      }}
    >
      <Stack.Screen name="profile/setup" options={{ title: "Profile Setup" }} />
      <Stack.Screen name="savings/new" options={{ title: "Create Savings Plan" }} />
      <Stack.Screen name="payments/confirmation" options={{ title: "Payment Confirmation" }} />
      <Stack.Screen name="transaction/details" options={{ title: "Transaction Details" }} />
    </Stack>
  );
}
