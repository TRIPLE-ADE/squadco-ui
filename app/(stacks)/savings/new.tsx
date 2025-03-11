import { SetStateAction, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Switch,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { COLORS, SIZES } from "@/constants/theme";
import DateTimePicker, {
  DateTimePickerEvent,
} from "@react-native-community/datetimepicker";
import { BodyScrollView } from "@/components/BodyScrollView";

const NewSavings = () => {
  const router = useRouter();
  const [selectedPlan, setSelectedPlan] = useState("");
  const [school, setSchool] = useState("");
  const [autoPayment, setAutoPayment] = useState(false);
  const [deadline, setDeadline] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [goalName, setGoalName] = useState("");
  const [amount, setAmount] = useState("");
  const [vaultFunds, setVaultFunds] = useState(false);

  const handlePlanSelection = (plan: SetStateAction<string>) => {
    setSelectedPlan(plan);
  };

  const handleDateChange = (
    _event: DateTimePickerEvent,
    selectedDate: Date | undefined
  ) => {
    const currentDate = selectedDate || deadline;
    setShowDatePicker(Platform.OS === "ios");
    setDeadline(currentDate);
  };

  const handleConfirm = () => {
    // Handle confirmation logic here
    console.log("Saving plan:", {
      type: selectedPlan,
      school,
      autoPayment,
      deadline,
      goalName,
      amount,
      vaultFunds,
    });
    router.back(); // Navigate back to the savings list
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.container}
    >
      <BodyScrollView contentContainerStyle={styles.scrollContent}>
      <Text style={styles.title}>Set Up Your Savings Plan for Future Goals</Text>

        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={[
              styles.planButton,
              selectedPlan === "schoolFees" && styles.selectedButton,
            ]}
            onPress={() => handlePlanSelection("schoolFees")}
          >
            <Ionicons
              name="school-outline"
              size={24}
              color={
                selectedPlan === "schoolFees" ? COLORS.white : COLORS.primary
              }
            />
            <Text
              style={[
                styles.buttonText,
                selectedPlan === "schoolFees" && styles.selectedButtonText,
              ]}
            >
              School Fees
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.planButton,
              selectedPlan === "personalSavings" && styles.selectedButton,
            ]}
            onPress={() => handlePlanSelection("personalSavings")}
          >
            <Ionicons
              name="wallet-outline"
              size={24}
              color={
                selectedPlan === "personalSavings"
                  ? COLORS.white
                  : COLORS.primary
              }
            />
            <Text
              style={[
                styles.buttonText,
                selectedPlan === "personalSavings" && styles.selectedButtonText,
              ]}
            >
              Personal Savings
            </Text>
          </TouchableOpacity>
        </View>

        {selectedPlan === "schoolFees" && (
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Select School:</Text>
            <TextInput
              style={styles.input}
              placeholder="Search for school..."
              value={school}
              onChangeText={setSchool}
            />
            <View style={styles.switchContainer}>
              <Text style={styles.label}>Auto-Payment:</Text>
              <Switch
                value={autoPayment}
                onValueChange={setAutoPayment}
                trackColor={{ false: COLORS.gray300, true: COLORS.primary }}
                thumbColor={autoPayment ? COLORS.white : COLORS.gray100}
              />
            </View>
            <Text style={styles.label}>Deadline:</Text>
            <TouchableOpacity
              style={styles.datePickerButton}
              onPress={() => setShowDatePicker(true)}
            >
              <Text>{deadline.toDateString()}</Text>
            </TouchableOpacity>
            {showDatePicker && (
              <DateTimePicker
                value={deadline}
                mode="date"
                display="default"
                onChange={handleDateChange}
              />
            )}
            <Text style={styles.infoText}>
              Funds will be locked until the deadline.
            </Text>
          </View>
        )}

        {selectedPlan === "personalSavings" && (
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Goal Name:</Text>
            <TextInput
              style={styles.input}
              placeholder="e.g., Buy a Laptop"
              value={goalName}
              onChangeText={setGoalName}
            />
            <Text style={styles.label}>Amount:</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter amount"
              value={amount}
              onChangeText={setAmount}
              keyboardType="numeric"
            />
            <Text style={styles.label}>Deadline:</Text>
            <TouchableOpacity
              style={styles.datePickerButton}
              onPress={() => setShowDatePicker(true)}
            >
              <Text>{deadline.toDateString()}</Text>
            </TouchableOpacity>
            {showDatePicker && (
              <DateTimePicker
                value={deadline}
                mode="date"
                display="default"
                onChange={handleDateChange}
              />
            )}
            <View style={styles.switchContainer}>
              <Text style={styles.label}>Vault Funds:</Text>
              <Switch
                value={vaultFunds}
                onValueChange={setVaultFunds}
                trackColor={{ false: COLORS.gray300, true: COLORS.primary }}
                thumbColor={vaultFunds ? COLORS.white : COLORS.gray100}
              />
            </View>
          </View>
        )}

        <TouchableOpacity style={styles.confirmButton} onPress={handleConfirm}>
          <Text style={styles.confirmButtonText}>Confirm & Save</Text>
        </TouchableOpacity>
      </BodyScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  scrollContent: {
    padding: 16,
    paddingTop: 32,
    gap: 24,
  },
  title: {
    fontSize: SIZES.xLarge,
    fontWeight: "bold",
    marginBottom: SIZES.medium,
    color: COLORS.text,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: SIZES.medium,
  },
  planButton: {
    backgroundColor: COLORS.card,
    padding: SIZES.medium,
    borderRadius: SIZES.small,
    borderWidth: 1,
    borderColor: COLORS.primary,
    flex: 1,
    alignItems: "center",
    marginHorizontal: SIZES.xSmall,
    flexDirection: "row",
    justifyContent: "center",
  },
  selectedButton: {
    backgroundColor: COLORS.primary,
  },
  buttonText: {
    color: COLORS.primary,
    fontSize: SIZES.medium,
    marginLeft: SIZES.xSmall,
  },
  selectedButtonText: {
    color: COLORS.white,
  },
  inputContainer: {
    marginBottom: SIZES.medium,
  },
  label: {
    fontSize: SIZES.medium,
    color: COLORS.text,
    marginBottom: SIZES.xSmall,
  },
  input: {
    borderWidth: 1,
    borderColor: COLORS.gray200,
    borderRadius: SIZES.small,
    padding: SIZES.small,
    marginBottom: SIZES.medium,
    fontSize: SIZES.medium,
  },
  switchContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: SIZES.medium,
  },
  datePickerButton: {
    borderWidth: 1,
    borderColor: COLORS.gray200,
    borderRadius: SIZES.small,
    padding: SIZES.small,
    marginBottom: SIZES.medium,
  },
  infoText: {
    color: COLORS.gray500,
    marginTop: SIZES.small,
    fontSize: SIZES.small,
  },
  confirmButton: {
    backgroundColor: COLORS.primary,
    padding: SIZES.medium,
    borderRadius: SIZES.small,
    alignItems: "center",
    marginTop: SIZES.medium,
  },
  confirmButtonText: {
    color: COLORS.white,
    fontSize: SIZES.medium,
    fontWeight: "bold",
  },
});

export default NewSavings;
