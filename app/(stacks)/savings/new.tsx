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
  Modal,
} from "react-native";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { COLORS, SIZES } from "@/constants/theme";
import DateTimePicker, {
  DateTimePickerEvent,
} from "@react-native-community/datetimepicker";
import { BodyScrollView } from "@/components/BodyScrollView";
import { FlatList } from "react-native";

const schools = [
  { id: "1", name: "State University", isMerchant: true },
  { id: "2", name: "City College", isMerchant: true },
  { id: "3", name: "Technical Institute", isMerchant: false },
  { id: "4", name: "Community College", isMerchant: false },
  { id: "5", name: "Private Academy", isMerchant: true },
];

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
  const [dropdownVisible, setDropdownVisible] = useState(false);
  const [selectedSchool, setSelectedSchool] = useState<string | null>(null);

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
    router.replace("/savings"); // Navigate back to the savings list
  };

  const handleSelectSchool = (school: any) => {
    setSelectedSchool(school);
    setDropdownVisible(false);
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.container}
    >
        {/* Header */}
      {/* <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#333" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>New Savings Plan</Text>
        <View style={{ width: 24 }} />
      </View> */}
      <BodyScrollView contentContainerStyle={styles.scrollContent}>
        <Text style={styles.title}>
          Set Up Your Savings Plan for Future Goals
        </Text>

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
            <TouchableOpacity
              style={styles.dropdown}
              onPress={() => setDropdownVisible(true)}
            >
              <Text
                style={
                  selectedSchool
                    ? styles.dropdownText
                    : styles.dropdownPlaceholder
                }
              >
                {selectedSchool ? selectedSchool.name : "Select a school"}
              </Text>
              <Ionicons name="chevron-down" size={20} color={COLORS.gray500} />
            </TouchableOpacity>

            {/* Dropdown Modal */}
            <Modal
              visible={dropdownVisible}
              transparent={true}
              animationType="slide"
              onRequestClose={() => setDropdownVisible(false)}
            >
              <TouchableOpacity
                style={styles.modalOverlay}
                activeOpacity={1}
                onPress={() => setDropdownVisible(false)}
              >
                <View style={styles.modalContent}>
                  <View style={styles.modalHeader}>
                    <Text style={styles.modalTitle}>Select School</Text>
                    <TouchableOpacity onPress={() => setDropdownVisible(false)}>
                      <Ionicons name="close" size={24} color={COLORS.text} />
                    </TouchableOpacity>
                  </View>
                  <FlatList
                    data={schools}
                    keyExtractor={(item) => item.id}
                    renderItem={({ item }) => (
                      <TouchableOpacity
                        style={styles.schoolItem}
                        onPress={() => handleSelectSchool(item)}
                      >
                        <Text style={styles.schoolName}>{item.name}</Text>
                      </TouchableOpacity>
                    )}
                    ItemSeparatorComponent={() => (
                      <View style={styles.separator} />
                    )}
                  />
                </View>
              </TouchableOpacity>
            </Modal>
            <View style={styles.inputContainer}>
              <Text style={styles.label}>Amount:</Text>
              <TextInput
                style={styles.input}
                placeholder="Enter amount"
                value={amount}
                onChangeText={setAmount}
                keyboardType="numeric"
              />
            </View>

            {/* <View style={styles.switchContainer}>
              <Text style={styles.label}>Auto-Payment:</Text>
              <Switch
                value={autoPayment}
                onValueChange={setAutoPayment}
                trackColor={{ false: COLORS.gray300, true: COLORS.primary }}
                thumbColor={autoPayment ? COLORS.white : COLORS.gray100}
              />
            </View> */}
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
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 20,
    backgroundColor: "#fff",
  },
  backButton: {
    padding: 5,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
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
  dropdown: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderWidth: 1,
    borderColor: COLORS.gray300,
    borderRadius: 8,
    padding: 12,
    backgroundColor: COLORS.white,
  },
  dropdownText: {
    fontSize: 16,
    color: COLORS.text,
  },
  dropdownPlaceholder: {
    fontSize: 16,
    color: COLORS.gray500,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "flex-end",
  },
  modalContent: {
    backgroundColor: COLORS.white,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    maxHeight: "70%",
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.gray200,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: COLORS.text,
  },
  schoolItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 16,
  },
  schoolName: {
    fontSize: 16,
    color: COLORS.text,
  },
  merchantBadge: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  merchantText: {
    fontSize: 12,
    color: COLORS.white,
    fontWeight: "bold",
  },
  separator: {
    height: 1,
    backgroundColor: COLORS.gray200,
  },
  accountDetailsContainer: {
    marginTop: 16,
    padding: 16,
    backgroundColor: COLORS.primary,
    borderRadius: 8,
  },
  accountDetailsTitle: {
    fontSize: 14,
    color: COLORS.white,
    marginBottom: 12,
  },
});

export default NewSavings;
