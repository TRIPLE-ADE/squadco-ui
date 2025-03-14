import AnimatedIcon from "@/components/animations/AnimatedIcon";
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
      <Stack.Screen name="savings/new" options={{
          title: 'Create Savings Plan', headerShown: true
        }} 
        />
      <Stack.Screen name="payments/confirmation" options={{ title: "Payment Confirmation" }} />
      <Stack.Screen name="transaction/details" options={{ title: "Transaction Details" }} />
      <Stack.Screen name="wallet/topup" options={{ title: "Top Up Wallet", headerShown: false }} />
      <Stack.Screen name="wallet/transfer" options={{ title: "Transfer", headerShown: false }} />
      <Stack.Screen name="ai/chat" options={{ title: "Chat", headerShown: false }} />
    </Stack>
  );
}
