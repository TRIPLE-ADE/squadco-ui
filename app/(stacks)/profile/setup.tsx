import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  Alert,
  TextInput,
} from "react-native";
import { StatusBar } from "expo-status-bar";
import { router } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Ionicons } from "@expo/vector-icons";
import { useAuth } from "@/context/auth-context";
import { COLORS } from "@/constants/theme";
import { z } from "zod";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Input from "@/components/common/Input";
import api from "@/services/api";
import { Toast } from "toastify-react-native";

// Define the form schema with Zod
const profileSetupSchema = z.object({
  email: z.string().email("Invalid email address"),
  phone: z.string().min(10, "Phone number must be at least 10 digits"),
  bvn: z.string().length(11, "BVN must be 11 digits"),
  dob: z.string().min(1, "Date of birth is required"),
  address: z.string().min(5, "Address is required"),
  gender: z.enum(["0", "1"], {
    errorMap: () => ({ message: "Please select 0 for female or 1 for male" }),
  }),
});

type ProfileFormData = z.infer<typeof profileSetupSchema>;

export default function ProfileSetupScreen() {
  const { user, updateUserProfile } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [showPinSetup, setShowPinSetup] = useState(false);

  // Initialize React Hook Form
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<ProfileFormData>({
    resolver: zodResolver(profileSetupSchema),
    defaultValues: {
      email: user?.user.email || "",
      phone: "",
      bvn: "",
      dob: "",
      address: "",
      gender: "1",
    },
  });

  // Handle form submission
  const onSubmit = async (data: ProfileFormData) => {
    setIsLoading(true);
    try {
      const response = await api.post("users/kyc/", data);
      console.log(response.data);
      if (response.data) {
        // Show PIN setup modal
        Toast.success("Verification successful");
        setShowPinSetup(true);
      } else {
        Toast.error("Verification Failed Please try again later");
      }
    } catch (error) {
      Toast.error("Verification Failed Please try again later");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <StatusBar style="dark" />
      <ScrollView style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>Complete Your Profile</Text>
          <Text style={styles.subtitle}>
            We need to verify your identity before you can access the app.
            Ensure that your Date of Birth (DOB) matches the one on your BVN.
            You will also need to provide a valid phone number.
          </Text>
        </View>

        <View style={styles.form}>
          {/* Email */}
          <Controller
            control={control}
            name="email"
            render={({ field }) => (
              <Input
                label="Email"
                placeholder="Enter your email"
                value={field.value}
                onChangeText={field.onChange}
                error={errors.email?.message}
                keyboardType="email-address"
              />
            )}
          />

          {/* Phone */}
          <Controller
            control={control}
            name="phone"
            render={({ field }) => (
              <Input
                label="Phone Number"
                placeholder="Enter your phone number"
                value={field.value}
                onChangeText={(text) => {
                  // Only allow digits
                  if (/^\d*$/.test(text)) {
                    field.onChange(text);
                  }
                }}
                error={errors.phone?.message}
                keyboardType="phone-pad"
              />
            )}
          />

          {/* BVN */}
          <Controller
            control={control}
            name="bvn"
            render={({ field }) => (
              <Input
                label="BVN (Bank Verification Number)"
                placeholder="Enter your 11-digit BVN"
                value={field.value}
                onChangeText={(text) => {
                  // Only allow digits
                  if (/^\d*$/.test(text)) {
                    field.onChange(text);
                  }
                }}
                error={errors.bvn?.message}
                keyboardType="numeric"
              />
            )}
          />

          {/* Date of Birth */}
          <Controller
            control={control}
            name="dob"
            render={({ field }) => (
              <Input
                label="Date of Birth"
                placeholder="YYYY-MM-DD"
                value={field.value}
                onChangeText={field.onChange}
                error={errors.dob?.message}
              />
            )}
          />

          {/* Address */}
          <Controller
            control={control}
            name="address"
            render={({ field }) => (
              <Input
                label="Address"
                placeholder="Enter your address"
                value={field.value}
                onChangeText={field.onChange}
                error={errors.address?.message}
              />
            )}
          />

          {/* Gender */}
          <Controller
            control={control}
            name="gender"
            render={({ field }) => (
              <View style={styles.genderContainer}>
                <Text style={styles.label}>Gender</Text>
                <View style={styles.genderOptions}>
                  <TouchableOpacity
                    style={[
                      styles.genderOption,
                      field.value === "1" && styles.genderOptionSelected,
                    ]}
                    onPress={() => field.onChange("1")}
                  >
                    <Text
                      style={[
                        styles.genderText,
                        field.value === "1" && styles.genderTextSelected,
                      ]}
                    >
                      Male
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[
                      styles.genderOption,
                      field.value === "0" && styles.genderOptionSelected,
                    ]}
                    onPress={() => field.onChange("0")}
                  >
                    <Text
                      style={[
                        styles.genderText,
                        field.value === "0" && styles.genderTextSelected,
                      ]}
                    >
                      Female
                    </Text>
                  </TouchableOpacity>
                </View>
                {errors.gender && (
                  <Text style={styles.errorText}>{errors.gender.message}</Text>
                )}
              </View>
            )}
          />

          <View style={styles.helperTextContainer}>
            <Ionicons
              name="information-circle-outline"
              size={16}
              color={COLORS.gray500}
            />
            <Text style={styles.helperText}>
              Your BVN is a unique 11-digit number that identifies you in the
              Nigerian banking system
            </Text>
          </View>

          <TouchableOpacity
            style={[styles.button, isLoading && styles.buttonDisabled]}
            onPress={handleSubmit(onSubmit)}
            disabled={isLoading}
          >
            {isLoading ? (
              <ActivityIndicator color={COLORS.white} />
            ) : (
              <Text style={styles.buttonText}>Verify Identity</Text>
            )}
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* Transaction PIN Setup Modal */}
      {showPinSetup && (
        <TransactionPinSetup
          onClose={() => setShowPinSetup(false)}
          onComplete={() => {
            // Update user profile as verified
            updateUserProfile({ is_verified: true });
            // Navigate to dashboard
            router.replace("/(tabs)");
          }}
        />
      )}
    </KeyboardAvoidingView>
  );
}

// Transaction PIN Setup Component
function TransactionPinSetup({
  onClose,
  onComplete,
}: {
  onClose: () => void;
  onComplete: () => void;
}) {
  const [pin, setPin] = useState("");
  const [confirmPin, setConfirmPin] = useState("");
  const [pinError, setPinError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [step, setStep] = useState(1); // 1 = enter pin, 2 = confirm pin

  const handlePinChange = async (text: string) => {
    // Only allow digits
    if (/^\d*$/.test(text) && text.length <= 6) {
      setPin(text);
      setPinError("");
    }
  };

  const handleConfirmPinChange = (text: string) => {
    // Only allow digits
    if (/^\d*$/.test(text) && text.length <= 6) {
      setConfirmPin(text);
      setPinError("");
    }
  };

  const handleContinue = () => {
    if (pin.length < 4) {
      setPinError("PIN must be at least 4 digits");
      return;
    }
    setStep(2);
  };

  const handleSubmit = async () => {
    if (pin !== confirmPin) {
      setPinError("PINs do not match");
      return;
    }

    setIsLoading(true);
    try {
      // Save PIN securely
      await AsyncStorage.setItem("transactionPin", pin);

      // Update user profile with PIN
      const response = await api.post("users/set_pin/", { pin });
      if (response.data.message) {
        // Complete setup
        Toast.success("Pin set successfully")
        onComplete();
      }
    } catch (error) {
      console.error("Error saving PIN:", error);
      Alert.alert("Error", "Failed to save your PIN. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View style={styles.modalContainer}>
      <View style={styles.modalContent}>
        <View style={styles.modalHeader}>
          <TouchableOpacity onPress={onClose} style={styles.closeButton}>
            <Ionicons name="close-outline" size={24} color={COLORS.gray500} />
          </TouchableOpacity>
          <View style={styles.modalTitleContainer}>
            <Text style={styles.modalTitle}>
              {step === 1 ? "Set Transaction PIN" : "Confirm Transaction PIN"}
            </Text>
            <Ionicons
              name="lock-closed-outline"
              size={24}
              color={COLORS.primary}
            />
          </View>

          <Text style={styles.modalSubtitle}>
            {step === 1
              ? "Create a 4-6 digit PIN for securing your transactions"
              : "Please re-enter your PIN to confirm"}
          </Text>
        </View>

        <View style={styles.pinContainer}>
          {step === 1 ? (
            <>
              <TextInput
                style={styles.pinInput}
                placeholder="Enter PIN"
                secureTextEntry
                keyboardType="numeric"
                value={pin}
                onChangeText={handlePinChange}
                maxLength={6}
              />
              {pinError ? (
                <Text style={styles.errorText}>{pinError}</Text>
              ) : null}

              <TouchableOpacity
                style={[styles.button, pin.length < 4 && styles.buttonDisabled]}
                onPress={handleContinue}
                disabled={pin.length < 4}
              >
                <Text style={styles.buttonText}>Continue</Text>
              </TouchableOpacity>
            </>
          ) : (
            <>
              <TextInput
                style={styles.pinInput}
                placeholder="Confirm PIN"
                secureTextEntry
                keyboardType="numeric"
                value={confirmPin}
                onChangeText={handleConfirmPinChange}
                maxLength={6}
              />
              {pinError ? (
                <Text style={styles.errorText}>{pinError}</Text>
              ) : null}

              <View style={styles.buttonRow}>
                <TouchableOpacity
                  style={[styles.secondaryButton]}
                  onPress={() => {
                    setStep(1);
                    setConfirmPin("");
                  }}
                >
                  <Text style={styles.secondaryButtonText}>Back</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[
                    styles.button,
                    styles.primaryButton,
                    (confirmPin.length < 4 || isLoading) &&
                      styles.buttonDisabled,
                  ]}
                  onPress={handleSubmit}
                  disabled={confirmPin.length < 4 || isLoading}
                >
                  {isLoading ? (
                    <ActivityIndicator color={COLORS.white} />
                  ) : (
                    <Text style={styles.buttonText}>Complete Setup</Text>
                  )}
                </TouchableOpacity>
              </View>
            </>
          )}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f9f9f9",
  },
  header: {
    padding: 24,
    paddingTop: 60,
    backgroundColor: COLORS.white,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: COLORS.gray500,
    lineHeight: 22,
  },
  form: {
    padding: 24,
    paddingBottom: 150,
  },
  label: {
    fontSize: 16,
    fontWeight: "500",
    color: COLORS.black,
    marginBottom: 8,
  },
  errorText: {
    color: COLORS.error || "#e53935",
    fontSize: 14,
    marginTop: 4,
  },
  helperTextContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 24,
    backgroundColor: COLORS.gray100,
    padding: 12,
    borderRadius: 8,
  },
  helperText: {
    fontSize: 14,
    color: COLORS.gray500,
    marginLeft: 8,
    flex: 1,
  },
  button: {
    backgroundColor: COLORS.primary,
    borderRadius: 8,
    padding: 16,
    alignItems: "center",
    marginTop: 16,
  },
  buttonDisabled: {
    backgroundColor: COLORS.primary + "50",
  },
  buttonText: {
    color: COLORS.white,
    fontSize: 16,
    fontWeight: "600",
  },
  // Gender selection styles
  genderContainer: {
    marginBottom: 20,
  },
  genderOptions: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  genderOption: {
    flex: 1,
    padding: 16,
    borderWidth: 1,
    borderColor: COLORS.gray300,
    borderRadius: 8,
    alignItems: "center",
    marginRight: 8,
    backgroundColor: COLORS.white,
  },
  genderOptionSelected: {
    borderColor: COLORS.primary,
    backgroundColor: COLORS.primary + "10",
  },
  genderText: {
    fontSize: 16,
    color: COLORS.black,
  },
  genderTextSelected: {
    color: COLORS.primary,
    fontWeight: "600",
  },
  // Modal styles
  modalContainer: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 1000,
  },
  modalContent: {
    backgroundColor: COLORS.white,
    borderRadius: 16,
    width: "85%",
    padding: 24,
    elevation: 5,
    shadowColor: COLORS.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  modalHeader: {
    marginBottom: 24,
  },
  closeButton: {
    alignSelf: "flex-end",
    padding: 4,
  },
  modalTitleContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginVertical: 12,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: COLORS.black,
    marginRight: 8,
  },
  modalSubtitle: {
    fontSize: 14,
    color: COLORS.gray500,
    textAlign: "center",
  },
  pinContainer: {
    width: "100%",
  },
  pinInput: {
    backgroundColor: COLORS.gray100,
    borderWidth: 1,
    borderColor: COLORS.gray300,
    borderRadius: 8,
    padding: 16,
    fontSize: 18,
    letterSpacing: 8,
    textAlign: "center",
  },
  buttonRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  secondaryButton: {
    backgroundColor: COLORS.gray100,
    borderRadius: 8,
    padding: 16,
    marginRight: 8,
    marginTop: 16,
    flex: 1,
  },
  secondaryButtonText: {
    color: COLORS.black,
    fontSize: 16,
    fontWeight: "600",
    textAlign: "center",
  },
  primaryButton: {
    flex: 2,
    marginLeft: 8,
  },
});
