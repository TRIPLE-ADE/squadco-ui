import React, { useState, useEffect } from "react"
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from "react-native"
import { StatusBar } from "expo-status-bar"
import { router } from "expo-router"
import DateTimePicker from "@react-native-community/datetimepicker"
import AsyncStorage from "@react-native-async-storage/async-storage"
import { Ionicons } from "@expo/vector-icons"
import { useAuth } from "@/context/auth-context"
import { COLORS } from "@/constants/theme"

// Mock API call for verification
const verifyUserIdentity = async (userData: {
  fullName: string
  dateOfBirth: string
  bvn: string
}): Promise<{ success: boolean; message: string }> => {
  // Simulate API call delay
  await new Promise((resolve) => setTimeout(resolve, 2000))

  // For demo purposes, we'll validate the BVN format and return success
  if (userData.bvn.length !== 11 || isNaN(Number(userData.bvn))) {
    return { success: false, message: "Invalid BVN format" }
  }

  return { success: true, message: "Verification successful" }
}

export default function ProfileSetupScreen() {
  const { user } = useAuth()
  const [fullName, setFullName] = useState("")
  const [dateOfBirth, setDateOfBirth] = useState<Date | null>(null)
  const [bvn, setBvn] = useState("")
  const [showDatePicker, setShowDatePicker] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [errors, setErrors] = useState<{
    fullName?: string
    dateOfBirth?: string
    bvn?: string
  }>({})
  const [showPinSetup, setShowPinSetup] = useState(false)

  // Load saved form data if available
  useEffect(() => {
    const loadSavedData = async () => {
      try {
        const savedData = await AsyncStorage.getItem("profileSetupData")
        if (savedData) {
          const parsedData = JSON.parse(savedData)
          setFullName(parsedData.fullName || "")
          setDateOfBirth(parsedData.dateOfBirth ? new Date(parsedData.dateOfBirth) : null)
          setBvn(parsedData.bvn || "")
        }
      } catch (error) {
        console.error("Error loading saved data:", error)
      }
    }

    loadSavedData()
  }, [])

  // Save form data to AsyncStorage
  const saveFormData = async () => {
    try {
      const dataToSave = {
        fullName,
        dateOfBirth: dateOfBirth?.toISOString(),
        bvn,
      }
      await AsyncStorage.setItem("profileSetupData", JSON.stringify(dataToSave))
    } catch (error) {
      console.error("Error saving form data:", error)
    }
  }

  // Validate form fields
  const validateForm = () => {
    const newErrors: {
      fullName?: string
      dateOfBirth?: string
      bvn?: string
    } = {}

    if (!fullName.trim()) {
      newErrors.fullName = "Full name is required"
    }

    if (!dateOfBirth) {
      newErrors.dateOfBirth = "Date of birth is required"
    } else {
      // Check if user is at least 18 years old
      const today = new Date()
      const birthDate = new Date(dateOfBirth)
      let age = today.getFullYear() - birthDate.getFullYear()
      const monthDiff = today.getMonth() - birthDate.getMonth()
      if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
        age--
      }

      if (age < 18) {
        newErrors.dateOfBirth = "You must be at least 18 years old"
      }
    }

    if (!bvn.trim()) {
      newErrors.bvn = "BVN is required"
    } else if (bvn.length !== 11 || !/^\d+$/.test(bvn)) {
      newErrors.bvn = "BVN must be 11 digits"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleDateChange = (event: any, selectedDate?: Date) => {
    setShowDatePicker(false)
    if (selectedDate) {
      setDateOfBirth(selectedDate)
    }
  }

  const handleSubmit = async () => {
    if (!validateForm()) {
      return
    }

    // Save form data before submission
    await saveFormData()

    setIsLoading(true)
    try {
      const response = await verifyUserIdentity({
        fullName,
        dateOfBirth: dateOfBirth?.toISOString() || "",
        bvn,
      })

      if (response.success) {
        // Show PIN setup modal
        setShowPinSetup(true)
      } else {
        Alert.alert("Verification Failed", response.message)
      }
    } catch (error) {
      Alert.alert("Error", "An unexpected error occurred. Please try again.")
      console.error("Verification error:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const formatDate = (date: Date | null) => {
    if (!date) return ""
    return `${date.getDate().toString().padStart(2, "0")}/${(date.getMonth() + 1).toString().padStart(2, "0")}/${date.getFullYear()}`
  }

  return (
    <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === "ios" ? "padding" : "height"}>
      <StatusBar style="dark" />
      <ScrollView style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>Complete Your Profile</Text>
          <Text style={styles.subtitle}>We need to verify your identity before you can access the app</Text>
        </View>

        <View style={styles.form}>
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Full Name (as per BVN)</Text>
            <TextInput
              style={[styles.input, errors.fullName ? styles.inputError : null]}
              placeholder="Enter your full name"
              value={fullName}
              onChangeText={setFullName}
              autoCapitalize="words"
            />
            {errors.fullName ? <Text style={styles.errorText}>{errors.fullName}</Text> : null}
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>Date of Birth</Text>
            <TouchableOpacity
              style={[styles.input, styles.dateInput, errors.dateOfBirth ? styles.inputError : null]}
              onPress={() => setShowDatePicker(true)}
            >
              <Text style={[styles.dateText, !dateOfBirth && styles.placeholderText]}>
                {dateOfBirth ? formatDate(dateOfBirth) : "Select your date of birth"}
              </Text>
              <Ionicons name="calendar-outline" size={20} color={COLORS.gray500} />
            </TouchableOpacity>
            {errors.dateOfBirth ? <Text style={styles.errorText}>{errors.dateOfBirth}</Text> : null}
            {showDatePicker && (
              <DateTimePicker
                value={dateOfBirth || new Date()}
                mode="date"
                display="default"
                onChange={handleDateChange}
                maximumDate={new Date()}
              />
            )}
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>BVN (Bank Verification Number)</Text>
            <TextInput
              style={[styles.input, errors.bvn ? styles.inputError : null]}
              placeholder="Enter your 11-digit BVN"
              value={bvn}
              onChangeText={(text) => {
                // Only allow digits
                if (/^\d*$/.test(text)) {
                  setBvn(text)
                }
              }}
              keyboardType="numeric"
              maxLength={11}
            />
            {errors.bvn ? <Text style={styles.errorText}>{errors.bvn}</Text> : null}
            <Text style={styles.helperText}>
              Your BVN is a unique 11-digit number that identifies you in the Nigerian banking system
            </Text>
          </View>

          <TouchableOpacity
            style={[styles.button, isLoading && styles.buttonDisabled]}
            onPress={handleSubmit}
            disabled={isLoading}
          >
            {isLoading ? <ActivityIndicator color={COLORS.white} /> : <Text style={styles.buttonText}>Verify Identity</Text>}
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* Transaction PIN Setup Modal */}
      {showPinSetup && (
        <TransactionPinSetup
          onClose={() => setShowPinSetup(false)}
          onComplete={() => {
            // Clear saved form data after successful verification
            AsyncStorage.removeItem("profileSetupData")
            // Navigate to dashboard
            router.replace("/(tabs)")
          }}
        />
      )}
    </KeyboardAvoidingView>
  )
}

// Transaction PIN Setup Component
function TransactionPinSetup({ onClose, onComplete }: { onClose: () => void, onComplete: () => void }) {
  const [pin, setPin] = useState("")
  const [confirmPin, setConfirmPin] = useState("")
  const [pinError, setPinError] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [step, setStep] = useState(1) // 1 = enter pin, 2 = confirm pin

  const handlePinChange = (text: string) => {
    // Only allow digits
    if (/^\d*$/.test(text) && text.length <= 6) {
      setPin(text)
      setPinError("")
    }
  }

  const handleConfirmPinChange = (text: string) => {
    // Only allow digits
    if (/^\d*$/.test(text) && text.length <= 6) {
      setConfirmPin(text)
      setPinError("")
    }
  }

  const handleContinue = () => {
    if (pin.length < 4) {
      setPinError("PIN must be at least 4 digits")
      return
    }
    setStep(2)
  }

  const handleSubmit = async () => {
    if (pin !== confirmPin) {
      setPinError("PINs do not match")
      return
    }

    setIsLoading(true)
    try {
      // Save PIN securely
      await AsyncStorage.setItem("transactionPin", pin)

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1500))

      // Complete setup
      onComplete()
    } catch (error) {
      console.error("Error saving PIN:", error)
      Alert.alert("Error", "Failed to save your PIN. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <View style={styles.modalContainer}>
      <View style={styles.modalContent}>
        <View style={styles.modalHeader}>
          <TouchableOpacity onPress={onClose}>
            <Ionicons name="close-outline" size={24} color={COLORS.gray500} />
          </TouchableOpacity>
          <View style={styles.modalTitleContainer}>
            <Text style={styles.modalTitle}>{step === 1 ? "Set Transaction PIN" : "Confirm Transaction PIN"}</Text> 
            <Ionicons name="lock-closed-outline" size={24} color={COLORS.primary} />
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
              {pinError ? <Text style={styles.errorText}>{pinError}</Text> : null}

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
              {pinError ? <Text style={styles.errorText}>{pinError}</Text> : null}

              <View style={styles.buttonRow}>
                <TouchableOpacity
                  style={[styles.secondaryButton]}
                  onPress={() => {
                    setStep(1)
                    setConfirmPin("")
                  }}
                >
                  <Text style={styles.secondaryButtonText}>Back</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[
                    styles.button,
                    styles.primaryButton,
                    (confirmPin.length < 4 || isLoading) && styles.buttonDisabled,
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
  )
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
  },
  inputContainer: {
    marginBottom: 24,
  },
  label: {
    fontSize: 16,
    fontWeight: "500",
    color: "#333",
    marginBottom: 8,
  },
  input: {
    backgroundColor: COLORS.white,
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    padding: 16,
    fontSize: 16,
  },
  inputError: {
    borderColor: "#e53935",
  },
  dateInput: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  dateText: {
    fontSize: 16,
    color: "#333",
  },
  placeholderText: {
    color: "#999",
  },
  errorText: {
    color: "#e53935",
    fontSize: 14,
    marginTop: 4,
  },
  helperText: {
    fontSize: 12,
    color: COLORS.gray500,
    marginTop: 4,
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
  modalTitleContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: COLORS.gray500,
  },
  modalSubtitle: {
    fontSize: 14,
    color: COLORS.gray500,
  },
  pinContainer: {
    width: "100%",
  },
  pinInput: {
    backgroundColor: "#f5f5f5",
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    padding: 16,
    fontSize: 18,
    letterSpacing: 8,
    textAlign: "center",
  },
  buttonRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 16,
  },
  secondaryButton: {
    backgroundColor: "#f5f5f5",
    borderRadius: 8,
    padding: 16,
    alignItems: "center",
    flex: 1,
    marginRight: 8,
  },
  secondaryButtonText: {
    color: "#333",
    fontSize: 16,
    fontWeight: "600",
  },
  primaryButton: {
    flex: 2,
    marginLeft: 8,
  },
})

