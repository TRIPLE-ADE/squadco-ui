import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  TextInput,
  ActivityIndicator,
  Alert,
  Clipboard,
} from "react-native";
import { StatusBar } from "expo-status-bar";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import Animated, { FadeInDown } from "react-native-reanimated";
import { useAuth } from "@/context/auth-context";
import api from "@/services/api";

// Payment method types
type PaymentMethod = "bank" | "card" | "ussd";

// Mock bank account details
const BANK_DETAILS = {
  accountName: "FinApp Virtual Wallet",
  accountNumber: "0123456789",
  bankName: "GT Bank",
};

export default function TopUpWallet() {
  const router = useRouter();
  const { user, updateUserProfile } = useAuth();
  const [amount, setAmount] = useState("");
  const [selectedMethod, setSelectedMethod] = useState<PaymentMethod>("bank");
  const [referenceId, setReferenceId] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [isTopUpComplete, setIsTopUpComplete] = useState(false);
  const [walletId] = useState(
    "FINW-" + Math.random().toString(36).substring(2, 10).toUpperCase()
  );

  // Generate a reference ID when the component mounts
  useEffect(() => {
    generateReferenceId();
  }, []);

  // Generate a unique reference ID
  const generateReferenceId = () => {
    const timestamp = new Date().getTime();
    const random = Math.floor(Math.random() * 1000);
    setReferenceId(`FIN-${timestamp}-${random}`);
  };

  // Handle amount input change
  const handleAmountChange = (text: string) => {
    // Only allow numbers
    const numericValue = text.replace(/[^0-9]/g, "");
    setAmount(numericValue);
  };

  // Format amount with commas
  const formatAmount = (value: string) => {
    if (!value) return "";
    return parseInt(value).toLocaleString();
  };

  // Copy text to clipboard
  const copyToClipboard = (text: string, label: string) => {
    Clipboard.setString(text);
    Alert.alert(`${label} copied to clipboard`);
  };

  // Process the top-up request
  const processTopUp = async () => {
    if (!amount || parseInt(amount) <= 0) {
      Alert.alert("Invalid Amount", "Please enter a valid amount to top up");
      return;
    }
    setIsProcessing(true);

    try {
      const response = await api.post("/pay", {
        amount: amount,
        virtual_account_number: user?.wallet?.virtual_account_number,
      });

      setIsProcessing(false);
      setIsTopUpComplete(true);

      console.log(response.data);

      if(response.status === 200){ 

        // Update the user's wallet balance
        const newBalance = response.data.new_balance; // Assuming this is the new balance returned from the API
        // Call updateUserProfile to update the wallet balance
        await updateUserProfile({
          wallet: {
            virtual_account_number: user?.wallet?.virtual_account_number || "", 
            balance: newBalance,
          },
        });
        
        Alert.alert(
          "Top-Up Initiated",
          `Your top-up request of ₦${formatAmount(
            amount
          )} has been initiated. It will be processed shortly.`,
          [
            {
              text: "OK",
              onPress: () => {
                // Reset form and generate new reference ID
                setAmount("");
                generateReferenceId();
                setIsTopUpComplete(false);
              },
            },
          ]
        );
      } 
    } catch (error) {
      console.log(error);
    } finally {
      setIsProcessing(false);
    }
  };

  // Navigate back
  const goBack = () => {
    router.back();
  };

  return (
    <View style={styles.container}>
      <StatusBar style="dark" />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={goBack} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#333" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Top-Up Wallet</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
      >
        {/* Wallet Balance Card */}
        <Animated.View
          entering={FadeInDown.delay(100).duration(500)}
          style={styles.balanceCard}
        >
          <Text style={styles.balanceLabel}>Current Balance</Text>
          <Text style={styles.balanceAmount}>₦{formatAmount(user?.wallet?.balance?.toString() || "0")}</Text>
          <View style={styles.walletIdContainer}>
            <Text style={styles.walletIdLabel}>Wallet ID:</Text>
            <Text style={styles.walletId}>{walletId}</Text>
            <TouchableOpacity
              onPress={() => copyToClipboard(walletId, "Wallet ID")}
            >
              <Ionicons name="copy-outline" size={18} color="#fff" />
            </TouchableOpacity>
          </View>
        </Animated.View>

        {/* Top-Up Description */}
        <Animated.View
          entering={FadeInDown.delay(200).duration(500)}
          style={styles.descriptionContainer}
        >
          <Text style={styles.descriptionTitle}>
            Top-Up Your Virtual Wallet
          </Text>
          <Text style={styles.descriptionText}>
            Easily add funds to your virtual wallet and manage your transactions
            securely. Choose from multiple payment options and get instant
            top-ups.
          </Text>
        </Animated.View>

        {/* Amount Input */}
        <Animated.View
          entering={FadeInDown.delay(300).duration(500)}
          style={styles.amountContainer}
        >
          <Text style={styles.sectionTitle}>Enter Amount</Text>
          <View style={styles.amountInputContainer}>
            <Text style={styles.currencySymbol}>₦</Text>
            <TextInput
              style={styles.amountInput}
              placeholder="0.00"
              keyboardType="numeric"
              value={amount}
              onChangeText={handleAmountChange}
            />
          </View>
          {amount ? (
            <Text style={styles.amountInWords}>
              {`Nigerian Naira ${formatAmount(amount)} only`}
            </Text>
          ) : null}
        </Animated.View>

        {/* Payment Methods */}
        <Animated.View
          entering={FadeInDown.delay(400).duration(500)}
          style={styles.methodsContainer}
        >
          <Text style={styles.sectionTitle}>Select Payment Method</Text>
          <View style={styles.methodsGrid}>
            <TouchableOpacity
              style={[
                styles.methodCard,
                selectedMethod === "bank" && styles.selectedMethodCard,
              ]}
              onPress={() => setSelectedMethod("bank")}
            >
              <Ionicons
                name="business-outline"
                size={24}
                color={selectedMethod === "bank" ? "#5B37B7" : "#666"}
              />
              <Text
                style={[
                  styles.methodText,
                  selectedMethod === "bank" && styles.selectedMethodText,
                ]}
              >
                Bank Transfer
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.methodCard,
                selectedMethod === "ussd" && styles.selectedMethodCard,
              ]}
              onPress={() => setSelectedMethod("ussd")}
            >
              <MaterialCommunityIcons
                name="cellphone-key"
                size={24}
                color={selectedMethod === "ussd" ? "#5B37B7" : "#666"}
              />
              <Text
                style={[
                  styles.methodText,
                  selectedMethod === "ussd" && styles.selectedMethodText,
                ]}
              >
                USSD
              </Text>
            </TouchableOpacity>
          </View>
        </Animated.View>

        {/* Payment Method Details */}
        <Animated.View
          entering={FadeInDown.delay(500).duration(500)}
          style={styles.detailsContainer}
        >
          {selectedMethod === "bank" && (
            <View style={styles.bankDetails}>
              <Text style={styles.detailsTitle}>Bank Transfer Details</Text>

              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Account Name:</Text>
                <View style={styles.detailValueContainer}>
                  <Text style={styles.detailValue}>
                    {user?.user.first_name} {user?.user.last_name}
                  </Text>
                  <TouchableOpacity
                    onPress={() =>
                      copyToClipboard(
                        user?.user.first_name + " " + user?.user.last_name,
                        "Account Name"
                      )
                    }
                  >
                    <Ionicons name="copy-outline" size={18} color="#5B37B7" />
                  </TouchableOpacity>
                </View>
              </View>

              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Account Number:</Text>
                <View style={styles.detailValueContainer}>
                  <Text style={styles.detailValue}>
                    {user?.wallet?.virtual_account_number}
                  </Text>
                  <TouchableOpacity
                    onPress={() =>
                      copyToClipboard(
                        BANK_DETAILS.accountNumber,
                        "Account Number"
                      )
                    }
                  >
                    <Ionicons name="copy-outline" size={18} color="#5B37B7" />
                  </TouchableOpacity>
                </View>
              </View>

              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Bank:</Text>
                <Text style={styles.detailValue}>{BANK_DETAILS.bankName}</Text>
              </View>

              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Reference:</Text>
                <View style={styles.detailValueContainer}>
                  <Text style={styles.detailValue}>{referenceId}</Text>
                  <TouchableOpacity
                    onPress={() => copyToClipboard(referenceId, "Reference ID")}
                  >
                    <Ionicons name="copy-outline" size={18} color="#5B37B7" />
                  </TouchableOpacity>
                </View>
              </View>

              <View style={styles.noteContainer}>
                <Ionicons
                  name="information-circle-outline"
                  size={18}
                  color="#666"
                />
                <Text style={styles.noteText}>
                  Please use the reference ID as your payment narration when
                  making the transfer.
                </Text>
              </View>
            </View>
          )}

          {selectedMethod === "card" && (
            <View style={styles.cardDetails}>
              <Text style={styles.detailsTitle}>Card Payment</Text>
              <Text style={styles.cardInstructions}>
                You'll be redirected to our secure payment gateway to complete
                your card payment.
              </Text>
              <View style={styles.noteContainer}>
                <Ionicons
                  name="information-circle-outline"
                  size={18}
                  color="#666"
                />
                <Text style={styles.noteText}>
                  Your card details are securely processed and not stored on our
                  servers.
                </Text>
              </View>
            </View>
          )}

          {selectedMethod === "ussd" && (
            <View style={styles.ussdDetails}>
              <Text style={styles.detailsTitle}>USSD Payment</Text>

              <View style={styles.ussdCodeContainer}>
                <Text style={styles.ussdCode}>
                  *919*4*{BANK_DETAILS.accountNumber}*{amount || "AMOUNT"}#
                </Text>
                <TouchableOpacity
                  onPress={() =>
                    copyToClipboard(
                      `*919*4*${BANK_DETAILS.accountNumber}*${amount}#`,
                      "USSD Code"
                    )
                  }
                  disabled={!amount}
                >
                  <Ionicons name="copy-outline" size={18} color="#5B37B7" />
                </TouchableOpacity>
              </View>

              <Text style={styles.ussdInstructions}>
                Dial the USSD code above on your phone to complete the payment.
              </Text>

              <View style={styles.noteContainer}>
                <Ionicons
                  name="information-circle-outline"
                  size={18}
                  color="#666"
                />
                <Text style={styles.noteText}>
                  USSD code shown is for First Bank. Codes may vary for other
                  banks.
                </Text>
              </View>
            </View>
          )}
        </Animated.View>

        {/* Processing Time */}
        <Animated.View
          entering={FadeInDown.delay(600).duration(500)}
          style={styles.processingContainer}
        >
          <Text style={styles.processingTitle}>Processing Time</Text>
          <View style={styles.processingRow}>
            <Ionicons name="time-outline" size={18} color="#666" />
            <Text style={styles.processingText}>
              {selectedMethod === "bank"
                ? "Bank transfers typically reflect within 5-30 minutes."
                : selectedMethod === "card"
                ? "Card payments are processed instantly."
                : "USSD payments typically reflect within 5 minutes."}
            </Text>
          </View>
        </Animated.View>

        {/* Action Button */}
        <Animated.View
          entering={FadeInDown.delay(700).duration(500)}
          style={styles.actionContainer}
        >
          <TouchableOpacity
            style={[
              styles.actionButton,
              (!amount || isProcessing) && styles.disabledButton,
            ]}
            onPress={processTopUp}
            disabled={!amount || isProcessing}
          >
            {isProcessing ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.actionButtonText}>
                {selectedMethod === "bank"
                  ? "I've Made The Transfer"
                  : selectedMethod === "card"
                  ? "Proceed To Card Payment"
                  : "Confirm USSD Payment"}
              </Text>
            )}
          </TouchableOpacity>
        </Animated.View>
      </ScrollView>
    </View>
  );
}

const COLORS = {
  primary: "#5B37B7",
  primaryLight: "#F0EBFA",
  success: "#4CD964",
  danger: "#FF3B30",
  text: "#333",
  gray500: "#666",
  gray300: "#999",
  gray200: "#eee",
  gray100: "#f5f5f5",
  white: "#fff",
  shadow: "#000",
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
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
  scrollView: {
    flex: 1,
  },
  balanceCard: {
    backgroundColor: COLORS.primary,
    borderRadius: 20,
    padding: 20,
    margin: 20,
    marginTop: 20,
    marginBottom: 15,
  },
  balanceLabel: {
    fontSize: 14,
    color: "#fff",
    opacity: 0.8,
  },
  balanceAmount: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#fff",
    marginVertical: 10,
  },
  walletIdContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 10,
  },
  walletIdLabel: {
    fontSize: 14,
    color: "#fff",
    opacity: 0.8,
    marginRight: 5,
  },
  walletId: {
    fontSize: 14,
    color: "#fff",
    fontWeight: "bold",
    marginRight: 10,
  },
  descriptionContainer: {
    padding: 20,
    paddingTop: 0,
    paddingBottom: 10,
  },
  descriptionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: COLORS.text,
    marginBottom: 8,
  },
  descriptionText: {
    fontSize: 14,
    color: COLORS.gray500,
    lineHeight: 20,
  },
  amountContainer: {
    padding: 20,
    paddingTop: 10,
    paddingBottom: 15,
    backgroundColor: COLORS.white,
    borderRadius: 15,
    marginHorizontal: 20,
    marginBottom: 15,
    shadowColor: COLORS.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: COLORS.text,
    marginBottom: 15,
  },
  amountInputContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: COLORS.gray200,
    borderRadius: 10,
    paddingHorizontal: 15,
    height: 60,
  },
  currencySymbol: {
    fontSize: 24,
    fontWeight: "bold",
    color: COLORS.text,
    marginRight: 10,
  },
  amountInput: {
    flex: 1,
    fontSize: 24,
    color: COLORS.text,
    height: 60,
  },
  amountInWords: {
    fontSize: 12,
    color: COLORS.gray500,
    marginTop: 10,
    fontStyle: "italic",
  },
  methodsContainer: {
    padding: 20,
    paddingTop: 10,
    paddingBottom: 15,
    backgroundColor: COLORS.white,
    borderRadius: 15,
    marginHorizontal: 20,
    marginBottom: 15,
    shadowColor: COLORS.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  methodsGrid: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  methodCard: {
    width: "45%",
    padding: 15,
    borderRadius: 10,
    backgroundColor: COLORS.gray100,
    alignItems: "center",
    justifyContent: "center",
  },
  selectedMethodCard: {
    backgroundColor: COLORS.primaryLight,
    borderWidth: 1,
    borderColor: COLORS.primary,
  },
  methodText: {
    fontSize: 12,
    color: COLORS.gray500,
    marginTop: 8,
    textAlign: "center",
  },
  selectedMethodText: {
    color: COLORS.primary,
    fontWeight: "bold",
  },
  detailsContainer: {
    padding: 20,
    paddingTop: 10,
    paddingBottom: 15,
    backgroundColor: COLORS.white,
    borderRadius: 15,
    marginHorizontal: 20,
    marginBottom: 15,
    shadowColor: COLORS.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  bankDetails: {},
  detailsTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: COLORS.text,
    marginBottom: 15,
  },
  detailRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.gray200,
  },
  detailLabel: {
    fontSize: 14,
    color: COLORS.gray500,
  },
  detailValueContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  detailValue: {
    fontSize: 14,
    fontWeight: "bold",
    color: COLORS.text,
    marginRight: 10,
  },
  noteContainer: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginTop: 15,
    padding: 10,
    backgroundColor: COLORS.gray100,
    borderRadius: 10,
  },
  noteText: {
    fontSize: 12,
    color: COLORS.gray500,
    marginLeft: 8,
    flex: 1,
    lineHeight: 18,
  },
  cardDetails: {},
  cardInstructions: {
    fontSize: 14,
    color: COLORS.gray500,
    marginBottom: 15,
    lineHeight: 20,
  },
  ussdDetails: {},
  ussdCodeContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: COLORS.primaryLight,
    padding: 15,
    borderRadius: 10,
    marginBottom: 15,
  },
  ussdCode: {
    fontSize: 18,
    fontWeight: "bold",
    color: COLORS.primary,
    marginRight: 10,
  },
  ussdInstructions: {
    fontSize: 14,
    color: COLORS.gray500,
    marginBottom: 15,
    lineHeight: 20,
  },
  processingContainer: {
    padding: 20,
    paddingTop: 10,
    paddingBottom: 15,
    backgroundColor: COLORS.white,
    borderRadius: 15,
    marginHorizontal: 20,
    marginBottom: 20,
    shadowColor: COLORS.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  processingTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: COLORS.text,
    marginBottom: 10,
  },
  processingRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  processingText: {
    fontSize: 14,
    color: COLORS.gray500,
    marginLeft: 10,
    lineHeight: 20,
  },
  actionContainer: {
    padding: 20,
    paddingTop: 0,
    paddingBottom: 30,
  },
  actionButton: {
    backgroundColor: COLORS.primary,
    borderRadius: 10,
    padding: 18,
    alignItems: "center",
  },
  disabledButton: {
    backgroundColor: COLORS.gray300,
  },
  actionButtonText: {
    color: COLORS.white,
    fontSize: 16,
    fontWeight: "bold",
  },
});
