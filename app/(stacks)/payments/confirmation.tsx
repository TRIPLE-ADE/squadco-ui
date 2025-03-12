import React from "react"
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from "react-native"
import { useRouter, useLocalSearchParams } from "expo-router"
import { Ionicons } from "@expo/vector-icons"
import { COLORS } from "@/constants/theme"
import { formatAmount, formatDate, formatTime } from "@/utils/helper"



// Update the PaymentParams type to include formattedAmount
type PaymentParams = {
  schoolId: string
  schoolName: string
  isMerchant: string // Will be "true" or "false" as a string
  paymentPurpose: string
  purposeName: string
  amount: string
  formattedAmount: string
  isRecurring: string // Will be "true" or "false" as a string
  accountName: string
  accountNumber: string
  paymentDateTime: string
}

const PaymentConfirmationScreen = () => {
  const router = useRouter()
  const params = useLocalSearchParams<PaymentParams>()

  // Update the paymentDetails object to include formattedAmount
  const paymentDetails = {
    schoolId: params.schoolId || "",
    schoolName: params.schoolName || "",
    isMerchant: params.isMerchant === "true",
    paymentPurpose: params.paymentPurpose || "",
    purposeName: params.purposeName || "",
    amount: params.amount || "",
    formattedAmount: params.formattedAmount || formatAmount(params.amount || "0"),
    isRecurring: params.isRecurring === "true",
    accountName: params.accountName || "",
    accountNumber: params.accountNumber || "",
    paymentDateTime: params.paymentDateTime ? new Date(params.paymentDateTime) : new Date(),
  }

  const handleEditSchedule = () => {
    router.back()
  }

  const handleConfirmPayment = () => {
    // In a real app, this would submit the payment to a backend
    // For now, we'll just navigate back to the dashboard
    router.push("/(tabs)")
  }

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <Ionicons name="school-outline" size={24} color={COLORS.primary} />
            <Text style={styles.cardTitle}>Payment Details</Text>
          </View>

          <View style={styles.cardContent}>
            {/* Update the Amount detail row */}
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Amount:</Text>
              <Text style={styles.detailValue}>₦{paymentDetails.formattedAmount}</Text>
            </View>

            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Purpose:</Text>
              <Text style={styles.detailValue}>{paymentDetails.purposeName}</Text>
            </View>

            {/* Update the Payment Date detail row */}
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Payment Date:</Text>
              <Text style={styles.detailValue}>{formatDate(paymentDetails.paymentDateTime)}</Text>
            </View>

            {/* Add Payment Time detail row */}
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Payment Time:</Text>
              <Text style={styles.detailValue}>{formatTime(paymentDetails.paymentDateTime)}</Text>
            </View>

            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Payment Type:</Text>
              <Text style={styles.detailValue}>
                {paymentDetails.isRecurring ? "Recurring Monthly" : "One-time Payment"}
              </Text>
            </View>

            {!paymentDetails.isMerchant && (
              <>
                <View style={styles.divider} />
                <Text style={styles.sectionTitle}>School Account Details</Text>

                <View style={styles.detailRow}>
                  <Text style={styles.detailLabel}>Account Name:</Text>
                  <Text style={styles.detailValue}>{paymentDetails.accountName}</Text>
                </View>

                <View style={styles.detailRow}>
                  <Text style={styles.detailLabel}>Account Number:</Text>
                  <Text style={styles.detailValue}>{paymentDetails.accountNumber}</Text>
                </View>
              </>
            )}

            <View style={styles.divider} />

            {paymentDetails.isRecurring && (
              <View style={styles.infoBox}>
                <Ionicons name="information-circle-outline" size={20} color={COLORS.info} />
                <Text style={styles.infoText}>
                  This payment will be automatically processed on the same date each month until you cancel.
                </Text>
              </View>
            )}

            {/* Update the Summary Box */}
            <View style={styles.summaryBox}>
              <Text style={styles.summaryTitle}>Payment Summary</Text>
              <View style={styles.summaryRow}>
                <Text style={styles.summaryLabel}>Amount:</Text>
                <Text style={styles.summaryValue}>₦{paymentDetails.formattedAmount}</Text>
              </View>
              <View style={styles.summaryRow}>
                <Text style={styles.summaryLabel}>Processing Fee:</Text>
                <Text style={styles.summaryValue}>₦0.00</Text>
              </View>
              <View style={styles.summaryDivider} />
              <View style={styles.summaryRow}>
                <Text style={styles.totalLabel}>Total:</Text>
                <Text style={styles.totalValue}>₦{paymentDetails.formattedAmount}</Text>
              </View>
            </View>
          </View>
        </View>

        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.editButton} onPress={handleEditSchedule}>
            <Text style={styles.editButtonText}>Edit Schedule</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.confirmButton} onPress={handleConfirmPayment}>
            <Text style={styles.confirmButtonText}>Confirm Payment</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
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
  backButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: COLORS.text,
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 40,
  },
  card: {
    marginBottom: 24,
    backgroundColor: COLORS.white,
    borderRadius: 12,
    shadowColor: COLORS.gray100,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
    overflow: "hidden",
  },
  cardHeader: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.gray200,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: COLORS.text,
    marginLeft: 8,
  },
  cardContent: {
    padding: 16,
  },
  detailRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 12,
  },
  detailLabel: {
    fontSize: 16,
    color: COLORS.gray500,
  },
  detailValue: {
    fontSize: 16,
    fontWeight: "bold",
    color: COLORS.text,
  },
  divider: {
    height: 1,
    backgroundColor: COLORS.gray200,
    marginVertical: 16,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: COLORS.text,
    marginBottom: 12,
  },
  infoBox: {
    flexDirection: "row",
    backgroundColor: COLORS.primary,
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
  },
  infoText: {
    flex: 1,
    fontSize: 14,
    color: COLORS.white,
    marginLeft: 8,
  },
  summaryBox: {
    backgroundColor: COLORS.gray100,
    borderRadius: 8,
    padding: 16,
  },
  summaryTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: COLORS.text,
    marginBottom: 12,
  },
  summaryRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  summaryLabel: {
    fontSize: 14,
    color: COLORS.gray500,
  },
  summaryValue: {
    fontSize: 14,
    color: COLORS.text,
  },
  summaryDivider: {
    height: 1,
    backgroundColor: COLORS.gray300,
    marginVertical: 8,
  },
  totalLabel: {
    fontSize: 16,
    fontWeight: "bold",
    color: COLORS.text,
  },
  totalValue: {
    fontSize: 16,
    fontWeight: "bold",
    color: COLORS.primary,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  editButton: {
    flex: 1,
    marginRight: 8,
    borderWidth: 1,
    borderColor: COLORS.primary,
    borderRadius: 8,
    padding: 16,
    alignItems: "center",
    justifyContent: "center",
  },
  editButtonText: {
    color: COLORS.primary,
    fontSize: 16,
    fontWeight: "bold",
  },
  confirmButton: {
    flex: 1,
    marginLeft: 8,
    backgroundColor: COLORS.primary,
    borderRadius: 8,
    padding: 16,
    alignItems: "center",
    justifyContent: "center",
  },
  confirmButtonText: {
    color: COLORS.white,
    fontSize: 16,
    fontWeight: "bold",
  },
})

export default PaymentConfirmationScreen

