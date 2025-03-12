import { useState } from "react"
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  TextInput,
  Modal,
  FlatList,
} from "react-native"
import { useRouter } from "expo-router"
import { useForm, Controller } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Ionicons } from "@expo/vector-icons"
import DateTimePicker, { DateTimePickerEvent } from "@react-native-community/datetimepicker"
import { COLORS, FONT } from "@/constants/theme"
import { formatAmount, parseFormattedAmount } from "@/utils/helper"

// Mock data for schools
const schools = [
  { id: "1", name: "State University", isMerchant: true },
  { id: "2", name: "City College", isMerchant: true },
  { id: "3", name: "Technical Institute", isMerchant: false },
  { id: "4", name: "Community College", isMerchant: false },
  { id: "5", name: "Private Academy", isMerchant: true },
]

// Payment purpose options
const paymentPurposes = [
  { id: "tuition", name: "Tuition Fees" },
  { id: "handouts", name: "Handouts & Materials" },
  { id: "hostel", name: "Hostel Accommodation" },
  { id: "exam", name: "Examination Fees" },
  { id: "library", name: "Library Fees" },
  { id: "sports", name: "Sports & Recreation" },
  { id: "other", name: "Other Fees" },
]

// Mock payment history data
const paymentHistoryData: PaymentHistoryItem[] = [
  {
    id: "1",
    schoolName: "State University",
    purpose: "Tuition Fees",
    amount: "150000",
    formattedAmount: "150,000.00",
    date: "2023-05-15T10:30:00",
    status: "completed",
  },
  {
    id: "2",
    schoolName: "City College",
    purpose: "Hostel Accommodation",
    amount: "75000",
    formattedAmount: "75,000.00",
    date: "2023-06-01T14:00:00",
    status: "upcoming",
  },
  {
    id: "3",
    schoolName: "State University",
    purpose: "Library Fees",
    amount: "25000",
    formattedAmount: "25,000.00",
    date: "2023-04-10T09:15:00",
    status: "completed",
  },
  {
    id: "4",
    schoolName: "Technical Institute",
    purpose: "Examination Fees",
    amount: "35000",
    formattedAmount: "35,000.00",
    date: "2023-07-20T11:00:00",
    status: "upcoming",
  },
]

// Define the form schema with Zod
const formSchema = z.object({
  schoolId: z.string().min(1, "Please select a school"),
  paymentPurpose: z.string().min(1, "Please select a payment purpose"),
  amount: z
    .string()
    .min(1, "Amount is required")
    .refine((val) => !isNaN(Number(parseFormattedAmount(val))) && Number(parseFormattedAmount(val)) > 0, {
      message: "Amount must be a positive number",
    }),
  isRecurring: z.boolean(),
  accountName: z.string().optional(),
  accountNumber: z.string().optional(),
  paymentDateTime: z.date(),
})

// TypeScript type for the form data
type FormData = z.infer<typeof formSchema>

// Payment history item type
type PaymentHistoryItem = {
  id: string
  schoolName: string
  purpose: string
  amount: string
  formattedAmount: string
  date: string
  status: "completed" | "upcoming"
}

const PaymentScreen = () => {
  const router = useRouter()
  const [showDatePicker, setShowDatePicker] = useState(false)
  const [showTimePicker, setShowTimePicker] = useState(false)
  const [dropdownVisible, setDropdownVisible] = useState(false)
  const [selectedSchool, setSelectedSchool] = useState<(typeof schools)[0] | null>(null)
  const [purposeDropdownVisible, setPurposeDropdownVisible] = useState(false)
  const [selectedPurpose, setSelectedPurpose] = useState<(typeof paymentPurposes)[0] | null>(null)
  const [paymentHistory, setPaymentHistory] = useState<PaymentHistoryItem[]>(paymentHistoryData)
  const [activeFilter, setActiveFilter] = useState<"all" | "completed" | "upcoming">("all")

  // Add these new state variables after the existing state declarations
  const [editModalVisible, setEditModalVisible] = useState(false)
  const [paymentToEdit, setPaymentToEdit] = useState<PaymentHistoryItem | null>(null)
  // Add these new state variables for the edit modal pickers
  const [editPurposeDropdownVisible, setEditPurposeDropdownVisible] = useState(false)
  const [editDatePickerVisible, setEditDatePickerVisible] = useState(false)
  const [editTimePickerVisible, setEditTimePickerVisible] = useState(false)

  // Initialize form with react-hook-form and zod validation
  const {
    control,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
    getValues,
  } = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      schoolId: "",
      paymentPurpose: "",
      amount: "",
      isRecurring: false,
      accountName: "",
      accountNumber: "",
      paymentDateTime: new Date(),
    },
  })

  const isRecurring = watch("isRecurring");

  // Handle school selection
  const handleSelectSchool = (school: (typeof schools)[0]) => {
    setSelectedSchool(school)
    setValue("schoolId", school.id)
    setDropdownVisible(false)
  }

  const handleSelectPurpose = (purpose: (typeof paymentPurposes)[0]) => {
    setSelectedPurpose(purpose)
    setValue("paymentPurpose", purpose.id)
    setPurposeDropdownVisible(false)
  }

  // Handle date change
  const handleDateChange = (_event: any, selectedDate?: Date) => {
    setShowDatePicker(false)
    if (selectedDate) {
      // Preserve the time from the current value
      const currentDateTime = getValues("paymentDateTime")
      selectedDate.setHours(currentDateTime.getHours())
      selectedDate.setMinutes(currentDateTime.getMinutes())
      setValue("paymentDateTime", selectedDate)
    }
  }

  // Handle time change
  const handleTimeChange = (_event: any, selectedTime?: Date) => {
    setShowTimePicker(false)
    if (selectedTime) {
      // Preserve the date from the current value
      const currentDateTime = getValues("paymentDateTime")
      const newDateTime = new Date(currentDateTime)
      newDateTime.setHours(selectedTime.getHours())
      newDateTime.setMinutes(selectedTime.getMinutes())
      setValue("paymentDateTime", newDateTime)
    }
  }

  // Format the time for display
  const formatTime = (date: Date): string => {
    return date.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    })
  }

  // Handle form submission
  const onSubmit = (data: FormData) => {
    // Find the selected school object
    const school = schools.find((s) => s.id === data.schoolId)
    const purpose = paymentPurposes.find((p) => p.id === data.paymentPurpose)

    if (!school || !purpose) {
      return
    }

    // Parse the formatted amount back to a number string
    const rawAmount = parseFormattedAmount(data.amount)

    // Prepare data to pass to confirmation screen
    const paymentDetails = {
      schoolId: data.schoolId,
      schoolName: school.name,
      isMerchant: school.isMerchant.toString(),
      paymentPurpose: data.paymentPurpose,
      purposeName: purpose.name,
      amount: rawAmount,
      formattedAmount: formatAmount(rawAmount),
      isRecurring: data.isRecurring.toString(),
      accountName: data.accountName || "",
      accountNumber: data.accountNumber || "",
      paymentDateTime: data.paymentDateTime.toISOString(),
    }

    // Navigate to confirmation screen with payment details
    router.push({
      pathname: "/payments/confirmation",
      params: paymentDetails,
    })
  }

  // Add this function to filter the payment history
  const getFilteredPaymentHistory = () => {
    switch (activeFilter) {
      case "completed":
        return paymentHistory.filter((payment) => payment.status === "completed")
      case "upcoming":
        return paymentHistory.filter((payment) => payment.status === "upcoming")
      default:
        return paymentHistory
    }
  }

  // Add this function to handle opening the edit modal
  const handleEditPayment = (payment: PaymentHistoryItem) => {
    setPaymentToEdit(payment)
    setEditModalVisible(true)
  }

  // Add this function to handle saving edited payment
  const handleSaveEdit = (editedPayment: PaymentHistoryItem) => {
    // Update the payment in the history
    const updatedHistory = paymentHistory.map((payment) => (payment.id === editedPayment.id ? editedPayment : payment))

    setPaymentHistory(updatedHistory)
    setEditModalVisible(false)
    setPaymentToEdit(null)
  }

  // Add these handler functions for the edit modal

  // Handle purpose selection in edit modal
  const handleEditSelectPurpose = (purpose: { id?: string; name: any }) => {
    if (paymentToEdit) {
      const updatedPayment = {
        ...paymentToEdit,
        purpose: purpose.name,
      }
      setPaymentToEdit(updatedPayment)
    }
    setEditPurposeDropdownVisible(false)
  }
  // Handle date change in edit modal
  const handleEditDateChange = (event: DateTimePickerEvent, selectedDate: Date | undefined) => {
    setEditDatePickerVisible(false);
    if (selectedDate && paymentToEdit) {
      const currentDate = new Date(paymentToEdit.date);
      // Preserve the time from the current value
      selectedDate.setHours(currentDate.getHours());
      selectedDate.setMinutes(currentDate.getMinutes());

      const updatedPayment = {
        ...paymentToEdit,
        date: selectedDate.toISOString(),
      };
      setPaymentToEdit(updatedPayment);
    }
  }
  // Handle time change in edit modal
  const handleEditTimeChange = (event: DateTimePickerEvent, selectedTime: Date | undefined) => {
    setEditTimePickerVisible(false);
    if (selectedTime && paymentToEdit) {
      const currentDate = new Date(paymentToEdit.date);
      // Preserve the date from the current value
      const newDateTime = new Date(currentDate);
      newDateTime.setHours(selectedTime.getHours());
      newDateTime.setMinutes(selectedTime.getMinutes());

      const updatedPayment = {
        ...paymentToEdit,
        date: newDateTime.toISOString(),
      };
      setPaymentToEdit(updatedPayment);
    }
  }

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      keyboardVerticalOffset={100}
    >
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Schedule Fee Payment</Text>
      </View>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.formContainer}>
          {/* School Selection */}
          <Text style={styles.label}>Select School</Text>
          <TouchableOpacity style={styles.dropdown} onPress={() => setDropdownVisible(true)}>
            <Text style={selectedSchool ? styles.dropdownText : styles.dropdownPlaceholder}>
              {selectedSchool ? selectedSchool.name : "Select a school"}
            </Text>
            <Ionicons name="chevron-down" size={20} color={COLORS.gray500} />
          </TouchableOpacity>
          {errors.schoolId && <Text style={styles.errorText}>{errors.schoolId.message}</Text>}

          {/* Dropdown Modal */}
          <Modal
            visible={dropdownVisible}
            transparent={true}
            animationType="slide"
            onRequestClose={() => setDropdownVisible(false)}
          >
            <TouchableOpacity style={styles.modalOverlay} activeOpacity={1} onPress={() => setDropdownVisible(false)}>
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
                    <TouchableOpacity style={styles.schoolItem} onPress={() => handleSelectSchool(item)}>
                      <Text style={styles.schoolName}>{item.name}</Text>
                      {item.isMerchant && (
                        <View style={styles.merchantBadge}>
                          <Text style={styles.merchantText}>Merchant</Text>
                        </View>
                      )}
                    </TouchableOpacity>
                  )}
                  ItemSeparatorComponent={() => <View style={styles.separator} />}
                />
              </View>
            </TouchableOpacity>
          </Modal>

          {/* Payment Purpose Selection */}
          <Text style={styles.label}>Payment Purpose</Text>
          <TouchableOpacity style={styles.dropdown} onPress={() => setPurposeDropdownVisible(true)}>
            <Text style={selectedPurpose ? styles.dropdownText : styles.dropdownPlaceholder}>
              {selectedPurpose ? selectedPurpose.name : "Select payment purpose"}
            </Text>
            <Ionicons name="chevron-down" size={20} color={COLORS.gray500} />
          </TouchableOpacity>
          {errors.paymentPurpose && <Text style={styles.errorText}>{errors.paymentPurpose.message}</Text>}

          {/* Dropdown Modal for Payment Purposes */}
          <Modal
            visible={purposeDropdownVisible}
            transparent={true}
            animationType="slide"
            onRequestClose={() => setPurposeDropdownVisible(false)}
          >
            <TouchableOpacity
              style={styles.modalOverlay}
              activeOpacity={1}
              onPress={() => setPurposeDropdownVisible(false)}
            >
              <View style={styles.modalContent}>
                <View style={styles.modalHeader}>
                  <Text style={styles.modalTitle}>Select Payment Purpose</Text>
                  <TouchableOpacity onPress={() => setPurposeDropdownVisible(false)}>
                    <Ionicons name="close" size={24} color={COLORS.text} />
                  </TouchableOpacity>
                </View>
                <FlatList
                  data={paymentPurposes}
                  keyExtractor={(item) => item.id}
                  renderItem={({ item }) => (
                    <TouchableOpacity style={styles.schoolItem} onPress={() => handleSelectPurpose(item)}>
                      <Text style={styles.schoolName}>{item.name}</Text>
                    </TouchableOpacity>
                  )}
                  ItemSeparatorComponent={() => <View style={styles.separator} />}
                />
              </View>
            </TouchableOpacity>
          </Modal>

          {/* Account Details (only if not a merchant) */}
          {selectedSchool && !selectedSchool.isMerchant && (
            <View style={styles.accountDetailsContainer}>
              <Text style={styles.accountDetailsTitle}>
                This school is not a registered merchant. Please enter their account details:
              </Text>

              <Controller
                control={control}
                name="accountName"
                rules={{ required: "Account name is required" }}
                render={({ field: { onChange, onBlur, value } }) => (
                  <View style={styles.inputContainer}>
                    <Text style={styles.inputLabel}>Account Name</Text>
                    <TextInput
                      style={styles.input}
                      placeholder="Enter account name"
                      value={value}
                      onChangeText={onChange}
                      onBlur={onBlur}
                    />
                  </View>
                )}
              />
              {errors.accountName && <Text style={styles.errorText}>{errors.accountName.message}</Text>}

              <Controller
                control={control}
                name="accountNumber"
                rules={{ required: "Account number is required" }}
                render={({ field: { onChange, onBlur, value } }) => (
                  <View style={styles.inputContainer}>
                    <Text style={styles.inputLabel}>Account Number</Text>
                    <TextInput
                      style={styles.input}
                      placeholder="Enter account number"
                      value={value}
                      onChangeText={onChange}
                      onBlur={onBlur}
                      keyboardType="numeric"
                    />
                  </View>
                )}
              />
              {errors.accountNumber && <Text style={styles.errorText}>{errors.accountNumber.message}</Text>}
            </View>
          )}

          {/* Payment Amount */}
          <Text style={styles.label}>Payment Amount</Text>
          <Controller
            control={control}
            name="amount"
            render={({ field: { onChange, onBlur, value } }) => (
              <View style={styles.amountInputContainer}>
                <Text style={styles.currencySymbol}>₦</Text>
                <TextInput
                  style={styles.amountInput}
                  placeholder="0.00"
                  value={value}
                  onChangeText={(text) => {
                    // Format the amount as the user types
                    const formattedValue = formatAmount(text)
                    onChange(formattedValue)
                  }}
                  onBlur={onBlur}
                  keyboardType="numeric"
                />
              </View>
            )}
          />
          {errors.amount && <Text style={styles.errorText}>{errors.amount.message}</Text>}

          {/* Payment Date and Time */}
          <Text style={styles.label}>Payment Date</Text>
          <Controller
            control={control}
            name="paymentDateTime"
            render={({ field: { value } }) => (
              <TouchableOpacity style={styles.datePickerButton} onPress={() => setShowDatePicker(true)}>
                <Ionicons name="calendar-outline" size={20} color={COLORS.primary} style={styles.dateIcon} />
                <Text style={styles.dateText}>{value.toDateString()}</Text>
              </TouchableOpacity>
            )}
          />

          <Text style={styles.label}>Payment Time</Text>
          <Controller
            control={control}
            name="paymentDateTime"
            render={({ field: { value } }) => (
              <TouchableOpacity style={styles.datePickerButton} onPress={() => setShowTimePicker(true)}>
                <Ionicons name="time-outline" size={20} color={COLORS.primary} style={styles.dateIcon} />
                <Text style={styles.dateText}>{formatTime(value)}</Text>
              </TouchableOpacity>
            )}
          />

          {showDatePicker && (
            <DateTimePicker
              value={watch("paymentDateTime")}
              mode="date"
              display="default"
              onChange={handleDateChange}
              minimumDate={new Date()}
            />
          )}

          {showTimePicker && (
            <DateTimePicker
              value={watch("paymentDateTime")}
              mode="time"
              display="default"
              onChange={handleTimeChange}
            />
          )}

          {/* Recurring Payment Toggle */}
          <View style={styles.switchContainer}>
            <View>
              <Text style={styles.label}>Recurring Payment</Text>
              <Text style={styles.switchDescription}>Enable to automatically pay this fee monthly</Text>
            </View>
            <Controller
              control={control}
              name="isRecurring"
              render={({ field: { onChange, value } }) => (
                <TouchableOpacity
                  style={[styles.toggleButton, value ? styles.toggleActive : styles.toggleInactive]}
                  onPress={() => onChange(!value)}
                  activeOpacity={0.8}
                >
                  <View
                    style={[styles.toggleCircle, value ? styles.toggleCircleActive : styles.toggleCircleInactive]}
                  />
                </TouchableOpacity>
              )}
            />
          </View>

          {isRecurring && (
            <View style={styles.infoBox}>
              <Ionicons name="information-circle-outline" size={20} color={COLORS.white} />
              <Text style={styles.infoText}>
                Your payment will be automatically processed on the same date each month until you cancel.
              </Text>
            </View>
          )}

          <View style={styles.divider} />

          {/* Submit Button */}
          <TouchableOpacity
            style={[styles.submitButton, !selectedSchool && styles.submitButtonDisabled]}
            onPress={handleSubmit(onSubmit)}
            disabled={!selectedSchool}
          >
            <Text style={styles.submitButtonText}>Schedule Payment</Text>
          </TouchableOpacity>
        </View>

        {/* Payment History Section */}
        <View style={styles.paymentHistoryContainer}>
          <Text style={styles.historyTitle}>Payment History</Text>

          {/* Tabs for filtering */}
          <View style={styles.historyTabs}>
            <TouchableOpacity
              style={[styles.historyTab, activeFilter === "all" && styles.historyTabActive]}
              onPress={() => setActiveFilter("all")}
            >
              <Text style={activeFilter === "all" ? styles.historyTabTextActive : styles.historyTabText}>All</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.historyTab, activeFilter === "completed" && styles.historyTabActive]}
              onPress={() => setActiveFilter("completed")}
            >
              <Text style={activeFilter === "completed" ? styles.historyTabTextActive : styles.historyTabText}>
                Completed
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.historyTab, activeFilter === "upcoming" && styles.historyTabActive]}
              onPress={() => setActiveFilter("upcoming")}
            >
              <Text style={activeFilter === "upcoming" ? styles.historyTabTextActive : styles.historyTabText}>
                Upcoming
              </Text>
            </TouchableOpacity>
          </View>

          {/* Payment History List */}
          {getFilteredPaymentHistory().length > 0 ? (
            <View style={styles.historyList}>
              {getFilteredPaymentHistory().map((payment) => {
                const paymentDate = new Date(payment.date)
                return (
                  <View
                    key={payment.id}
                    style={[styles.historyItem, payment.status === "upcoming" && styles.historyItemUpcoming]}
                  >
                    <View style={styles.historyItemHeader}>
                      <Text style={styles.historySchoolName}>{payment.schoolName}</Text>
                      <View
                        style={[
                          styles.historyStatusBadge,
                          payment.status === "completed" ? styles.historyStatusCompleted : styles.historyStatusUpcoming,
                        ]}
                      >
                        <Text style={styles.historyStatusText}>
                          {payment.status === "completed" ? "Completed" : "Upcoming"}
                        </Text>
                      </View>
                    </View>

                    <View style={styles.historyItemDetails}>
                      <View style={styles.historyDetailRow}>
                        <Text style={styles.historyDetailLabel}>Purpose:</Text>
                        <Text style={styles.historyDetailValue}>{payment.purpose}</Text>
                      </View>

                      <View style={styles.historyDetailRow}>
                        <Text style={styles.historyDetailLabel}>Amount:</Text>
                        <Text style={[styles.historyDetailValue, styles.historyAmount]}>
                          ₦{payment.formattedAmount}
                        </Text>
                      </View>

                      <View style={styles.historyDetailRow}>
                        <Text style={styles.historyDetailLabel}>Date:</Text>
                        <Text style={styles.historyDetailValue}>
                          {paymentDate.toLocaleDateString("en-NG", {
                            year: "numeric",
                            month: "short",
                            day: "numeric",
                          })}
                        </Text>
                      </View>

                      <View style={styles.historyDetailRow}>
                        <Text style={styles.historyDetailLabel}>Time:</Text>
                        <Text style={styles.historyDetailValue}>
                          {paymentDate.toLocaleTimeString("en-US", {
                            hour: "2-digit",
                            minute: "2-digit",
                            hour12: true,
                          })}
                        </Text>
                      </View>
                    </View>

                    {payment.status === "upcoming" && (
                      <View style={styles.historyItemActions}>
                        <TouchableOpacity style={styles.historyActionButton} onPress={() => handleEditPayment(payment)}>
                          <Text style={styles.historyActionButtonText}>Edit</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={[styles.historyActionButton, styles.historyActionButtonCancel]}>
                          <Text style={styles.historyActionButtonTextCancel}>Cancel</Text>
                        </TouchableOpacity>
                      </View>
                    )}
                  </View>
                )
              })}
            </View>
          ) : (
            <View style={styles.emptyHistoryContainer}>
              <Ionicons name="document-text-outline" size={48} color={COLORS.gray300} />
              <Text style={styles.emptyHistoryText}>
                {activeFilter === "all"
                  ? "No payment history yet"
                  : activeFilter === "completed"
                    ? "No completed payments yet"
                    : "No upcoming payments scheduled"}
              </Text>
            </View>
          )}
        </View>
      </ScrollView>

      {/* Edit Payment Modal */}
      <Modal
        visible={editModalVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setEditModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.editModalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Edit Payment</Text>
              <TouchableOpacity onPress={() => setEditModalVisible(false)}>
                <Ionicons name="close" size={24} color={COLORS.text} />
              </TouchableOpacity>
            </View>

            {paymentToEdit && (
              <ScrollView style={styles.editModalScrollContent}>
                {/* School Name (non-editable) */}
                <View style={styles.editFormGroup}>
                  <Text style={styles.editLabel}>School</Text>
                  <View style={styles.editNonEditableField}>
                    <Text style={styles.editNonEditableText}>{paymentToEdit.schoolName}</Text>
                  </View>
                </View>

                {/* Payment Purpose */}
                <View style={styles.editFormGroup}>
                  <Text style={styles.editLabel}>Payment Purpose</Text>
                  <TouchableOpacity style={styles.dropdown} onPress={() => setEditPurposeDropdownVisible(true)}>
                    <Text style={styles.dropdownText}>{paymentToEdit.purpose}</Text>
                    <Ionicons name="chevron-down" size={20} color={COLORS.gray500} />
                  </TouchableOpacity>
                </View>

                {/* Add the dropdown modal for payment purposes in edit mode */}
                <Modal
                  visible={editPurposeDropdownVisible}
                  transparent={true}
                  animationType="slide"
                  onRequestClose={() => setEditPurposeDropdownVisible(false)}
                >
                  <TouchableOpacity
                    style={styles.modalOverlay}
                    activeOpacity={1}
                    onPress={() => setEditPurposeDropdownVisible(false)}
                  >
                    <View style={styles.modalContent}>
                      <View style={styles.modalHeader}>
                        <Text style={styles.modalTitle}>Select Payment Purpose</Text>
                        <TouchableOpacity onPress={() => setEditPurposeDropdownVisible(false)}>
                          <Ionicons name="close" size={24} color={COLORS.text} />
                        </TouchableOpacity>
                      </View>
                      <FlatList
                        data={paymentPurposes}
                        keyExtractor={(item) => item.id}
                        renderItem={({ item }) => (
                          <TouchableOpacity style={styles.schoolItem} onPress={() => handleEditSelectPurpose(item)}>
                            <Text style={styles.schoolName}>{item.name}</Text>
                          </TouchableOpacity>
                        )}
                        ItemSeparatorComponent={() => <View style={styles.separator} />}
                      />
                    </View>
                  </TouchableOpacity>
                </Modal>

                {/* Payment Amount */}
                <View style={styles.editFormGroup}>
                  <Text style={styles.editLabel}>Payment Amount</Text>
                  <View style={styles.amountInputContainer}>
                    <Text style={styles.currencySymbol}>₦</Text>
                    <TextInput
                      style={styles.amountInput}
                      value={paymentToEdit.formattedAmount}
                      onChangeText={(text) => {
                        // Format the amount as the user types
                        const formattedValue = formatAmount(text)
                        const updatedPayment = {
                          ...paymentToEdit,
                          amount: parseFormattedAmount(formattedValue),
                          formattedAmount: formattedValue,
                        }
                        setPaymentToEdit(updatedPayment)
                      }}
                      keyboardType="numeric"
                    />
                  </View>
                </View>

                {/* Payment Date */}
                <View style={styles.editFormGroup}>
                  <Text style={styles.editLabel}>Payment Date</Text>
                  <TouchableOpacity style={styles.datePickerButton} onPress={() => setEditDatePickerVisible(true)}>
                    <Ionicons name="calendar-outline" size={20} color={COLORS.primary} style={styles.dateIcon} />
                    <Text style={styles.dateText}>
                      {new Date(paymentToEdit.date).toLocaleDateString("en-NG", {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                      })}
                    </Text>
                  </TouchableOpacity>
                </View>

                {/* Add the date picker for edit mode */}
                {editDatePickerVisible && (
                  <DateTimePicker
                    value={new Date(paymentToEdit.date)}
                    mode="date"
                    display="default"
                    onChange={handleEditDateChange}
                    minimumDate={new Date()}
                  />
                )}

                {/* Payment Time */}
                <View style={styles.editFormGroup}>
                  <Text style={styles.editLabel}>Payment Time</Text>
                  <TouchableOpacity style={styles.datePickerButton} onPress={() => setEditTimePickerVisible(true)}>
                    <Ionicons name="time-outline" size={20} color={COLORS.primary} style={styles.dateIcon} />
                    <Text style={styles.dateText}>
                      {new Date(paymentToEdit.date).toLocaleTimeString("en-US", {
                        hour: "2-digit",
                        minute: "2-digit",
                        hour12: true,
                      })}
                    </Text>
                  </TouchableOpacity>
                </View>

                {/* Add the time picker for edit mode */}
                {editTimePickerVisible && (
                  <DateTimePicker
                    value={new Date(paymentToEdit.date)}
                    mode="time"
                    display="default"
                    onChange={handleEditTimeChange}
                  />
                )}

                <TouchableOpacity style={styles.saveButton} onPress={() => handleSaveEdit(paymentToEdit)}>
                  <Text style={styles.saveButtonText}>Save Changes</Text>
                </TouchableOpacity>
              </ScrollView>
            )}
          </View>
        </View>
      </Modal>
    </KeyboardAvoidingView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  scrollContent: {
    flexGrow: 1,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingTop: 60,
    paddingBottom: 20,
    backgroundColor: COLORS.white,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.gray200,
  },
  headerTitle: {
    fontFamily: FONT.bold,
    fontSize: 24,
    color: COLORS.black,
    fontWeight: "bold",
  },
  formContainer: {
    padding: 16,
  },
  label: {
    fontSize: 16,
    fontWeight: "bold",
    color: COLORS.text,
    marginTop: 16,
    marginBottom: 8,
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
  inputContainer: {
    marginBottom: 12,
  },
  inputLabel: {
    fontSize: 14,
    color: COLORS.white,
    marginBottom: 4,
  },
  input: {
    borderWidth: 1,
    borderColor: COLORS.gray300,
    borderRadius: 8,
    padding: 12,
    backgroundColor: COLORS.white,
    fontSize: 16,
  },
  errorText: {
    color: COLORS.warning,
    fontSize: 12,
    marginTop: 4,
    marginBottom: 8,
  },
  amountInputContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: COLORS.gray300,
    borderRadius: 8,
    backgroundColor: COLORS.white,
    paddingHorizontal: 12,
  },
  currencySymbol: {
    fontSize: 18,
    fontWeight: "bold",
    color: COLORS.text,
    marginRight: 8,
    fontFamily: Platform.OS === "ios" ? "System" : "normal",
  },
  amountInput: {
    flex: 1,
    padding: 12,
    fontSize: 16,
  },
  datePickerButton: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: COLORS.gray300,
    borderRadius: 8,
    padding: 12,
    backgroundColor: COLORS.white,
  },
  dateIcon: {
    marginRight: 8,
  },
  dateText: {
    fontSize: 16,
    color: COLORS.text,
  },
  switchContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: 24,
    marginBottom: 8,
  },
  switchDescription: {
    fontSize: 14,
    color: COLORS.gray500,
    marginTop: 4,
  },
  toggleButton: {
    width: 50,
    height: 30,
    borderRadius: 15,
    padding: 2,
    justifyContent: "center",
  },
  toggleActive: {
    backgroundColor: COLORS.primary,
  },
  toggleInactive: {
    backgroundColor: COLORS.gray300,
  },
  toggleCircle: {
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: COLORS.white,
  },
  toggleCircleActive: {
    alignSelf: "flex-end",
  },
  toggleCircleInactive: {
    alignSelf: "flex-start",
  },
  infoBox: {
    flexDirection: "row",
    backgroundColor: COLORS.primary,
    borderRadius: 8,
    padding: 12,
    marginTop: 8,
  },
  infoText: {
    flex: 1,
    fontSize: 14,
    color: COLORS.white,
    marginLeft: 8,
  },
  divider: {
    height: 1,
    backgroundColor: COLORS.gray200,
    marginVertical: 24,
  },
  submitButton: {
    backgroundColor: COLORS.primary,
    borderRadius: 8,
    padding: 16,
    alignItems: "center",
    justifyContent: "center",
  },
  submitButtonDisabled: {
    backgroundColor: COLORS.gray300,
  },
  submitButtonText: {
    color: COLORS.white,
    fontSize: 16,
    fontWeight: "bold",
  },
  paymentHistoryContainer: {
    marginTop: 20,
    padding: 16,
    backgroundColor: COLORS.white,
    borderRadius: 12,
    shadowColor: COLORS.gray100,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
    marginHorizontal: 16,
    marginBottom: 20,
  },
  historyTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: COLORS.text,
    marginBottom: 16,
  },
  historyTabs: {
    flexDirection: "row",
    marginBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.gray200,
  },
  historyTab: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    marginRight: 8,
  },
  historyTabActive: {
    borderBottomWidth: 2,
    borderBottomColor: COLORS.primary,
  },
  historyTabText: {
    color: COLORS.gray500,
    fontSize: 14,
  },
  historyTabTextActive: {
    color: COLORS.primary,
    fontWeight: "bold",
    fontSize: 14,
  },
  historyList: {
    marginTop: 8,
  },
  historyItem: {
    backgroundColor: COLORS.white,
    borderRadius: 8,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: COLORS.gray200,
  },
  historyItemUpcoming: {
    borderLeftWidth: 4,
    borderLeftColor: COLORS.primary,
  },
  historyItemHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  historySchoolName: {
    fontSize: 16,
    fontWeight: "bold",
    color: COLORS.text,
  },
  historyStatusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  historyStatusCompleted: {
    backgroundColor: COLORS.success + "20",
  },
  historyStatusUpcoming: {
    backgroundColor: COLORS.primary + "20",
  },
  historyStatusText: {
    fontSize: 12,
    fontWeight: "bold",
    color: COLORS.text,
  },
  historyItemDetails: {
    marginBottom: 12,
  },
  historyDetailRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  historyDetailLabel: {
    fontSize: 14,
    color: COLORS.gray500,
  },
  historyDetailValue: {
    fontSize: 14,
    color: COLORS.text,
    fontWeight: "500",
  },
  historyAmount: {
    color: COLORS.primary,
    fontWeight: "bold",
  },
  historyItemActions: {
    flexDirection: "row",
    justifyContent: "flex-end",
    marginTop: 8,
  },
  historyActionButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 4,
    backgroundColor: COLORS.primary,
    marginLeft: 8,
  },
  historyActionButtonCancel: {
    backgroundColor: COLORS.warning + "20",
    borderWidth: 1,
    borderColor: COLORS.warning,
  },
  historyActionButtonText: {
    color: COLORS.white,
    fontSize: 12,
    fontWeight: "bold",
  },
  historyActionButtonTextCancel: {
    color: COLORS.warning,
    fontSize: 12,
    fontWeight: "bold",
  },
  emptyHistoryContainer: {
    alignItems: "center",
    justifyContent: "center",
    padding: 32,
  },
  emptyHistoryText: {
    marginTop: 16,
    fontSize: 16,
    color: COLORS.gray500,
  },
  editModalContent: {
    backgroundColor: COLORS.white,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    maxHeight: "80%",
    width: "100%",
  },
  editModalScrollContent: {
    padding: 16,
  },
  editFormGroup: {
    marginBottom: 16,
  },
  editLabel: {
    fontSize: 16,
    fontWeight: "bold",
    color: COLORS.text,
    marginBottom: 8,
  },
  editNonEditableField: {
    backgroundColor: COLORS.gray100,
    borderRadius: 8,
    padding: 12,
    borderWidth: 1,
    borderColor: COLORS.gray200,
  },
  editNonEditableText: {
    fontSize: 16,
    color: COLORS.gray500,
  },
  saveButton: {
    backgroundColor: COLORS.primary,
    borderRadius: 8,
    padding: 16,
    alignItems: "center",
    marginTop: 16,
    marginBottom: 32,
  },
  saveButtonText: {
    color: COLORS.white,
    fontSize: 16,
    fontWeight: "bold",
  },
})

export default PaymentScreen

