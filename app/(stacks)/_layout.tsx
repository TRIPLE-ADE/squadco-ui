import { COLORS } from "@/constants/theme";
import { Stack } from "expo-router";

export default function StacksLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen
        name="savings/new"
        options={{
          title: "Create Savings Plan",
          headerShown: true,
          headerShadowVisible: true,
          headerTitleAlign: "center",
          headerTitleStyle: {
            fontWeight: "bold",
            fontSize: 20,
          },
        }}
      />
    </Stack>
  );
}
