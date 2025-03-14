"use client"
import { useState } from "react"
import { StyleSheet, View, Text, ScrollView, TouchableOpacity, TextInput, ActivityIndicator, Alert } from "react-native"
import { StatusBar } from "expo-status-bar"
import { Ionicons } from "@expo/vector-icons"
import { useRouter } from "expo-router"
import Animated, { FadeInDown } from "react-native-reanimated"
import RecipientAccountSelector from "@/components/dashboard/AccountSelector"

// Bank type definition
interface Bank {
  code: string
  name: string
}

export default function TransferScreen() {
  const router = useRouter()
  const [amount, setAmount] = useState("")
  const [narration, setNarration] = useState("")
  const [accountNumber, setAccountNumber] = useState("")
  const [selectedBank, setSelectedBank] = useState<Bank | null>(null)
  const [recipientName, setRecipientName] = useState("")
  const [isProcessing, setIsProcessing] = useState(false)

  // Handle amount input change
  const handleAmountChange = (text: string) => {
    // Only allow numbers
    const numericValue = text.replace(/[^0-9]/g, "")
    setAmount(numericValue)
  }

  // Format amount with commas
  const formatAmount = (value: string) => {
    if (!value) return ""
    return Number.parseInt(value).toLocaleString()
  }

  // Handle account selection
  const handleAccountSelected = (accountNum: string, bank: Bank) => {
    setAccountNumber(accountNum)
    setSelectedBank(bank)

    // In a real app, you would fetch the account name from an API
    // For demo purposes, we'll simulate a successful account name fetch
    setTimeout(() => {
      setRecipientName("John Doe")
    }, 500)
  }

  // Process the transfer
  const processTransfer = () => {
    if (!amount || Number.parseInt(amount) <= 0) {
      Alert.alert("Invalid Amount", "Please enter a valid amount to transfer")
      return
    }

    if (!accountNumber || !selectedBank) {
      Alert.alert("Invalid Account", "Please select a valid recipient account")
      return
    }

    setIsProcessing(true)

    // Simulate API call
    setTimeout(() => {
      setIsProcessing(false)

      // Navigate to confirmation page
      router.push({
        pathname: "/payments/confirmation",
        params: {
          type: "transfer",
          amount,
          recipient: recipientName,
          accountNumber,
          bankName: selectedBank?.name,
          narration: narration || "Transfer",
        },
      })
    }, 1500)
  }

  // Navigate back
  const goBack = () => {
    router.back()
  }

  return (
    <View style={styles.container}>
      <StatusBar style="dark" />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={goBack} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#333" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Transfer Funds</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Transfer Description */}
        <Animated.View entering={FadeInDown.delay(100).duration(500)} style={styles.descriptionContainer}>
          <Text style={styles.descriptionTitle}>Send Money</Text>
          <Text style={styles.descriptionText}>Transfer funds to any bank account in Nigeria instantly.</Text>
        </Animated.View>

        {/* Recipient Account Selector */}
        <Animated.View entering={FadeInDown.delay(200).duration(500)}>
          <RecipientAccountSelector onAccountSelected={handleAccountSelected} />
        </Animated.View>

        {/* Recipient Name (shows after validation) */}
        {recipientName ? (
          <Animated.View entering={FadeInDown.delay(300).duration(500)} style={styles.recipientContainer}>
            <Text style={styles.recipientLabel}>Recipient Name</Text>
            <Text style={styles.recipientName}>{recipientName}</Text>
          </Animated.View>
        ) : null}

        {/* Amount Input */}
        <Animated.View entering={FadeInDown.delay(400).duration(500)} style={styles.amountContainer}>
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
          {amount ? <Text style={styles.amountInWords}>{`Nigerian Naira ${formatAmount(amount)} only`}</Text> : null}
        </Animated.View>

        {/* Narration Input */}
        <Animated.View entering={FadeInDown.delay(500).duration(500)} style={styles.narrationContainer}>
          <Text style={styles.sectionTitle}>Narration (Optional)</Text>
          <TextInput
            style={styles.narrationInput}
            placeholder="What's this transfer for?"
            value={narration}
            onChangeText={setNarration}
            multiline={true}
            numberOfLines={3}
          />
        </Animated.View>

        {/* Action Button */}
        <Animated.View entering={FadeInDown.delay(600).duration(500)} style={styles.actionContainer}>
          <TouchableOpacity
            style={[
              styles.actionButton,
              !amount || !accountNumber || !selectedBank || !recipientName || isProcessing
                ? styles.disabledButton
                : null,
            ]}
            onPress={processTransfer}
            disabled={!amount || !accountNumber || !selectedBank || !recipientName || isProcessing}
          >
            {isProcessing ? <ActivityIndicator color="#fff" /> : <Text style={styles.actionButtonText}>Continue</Text>}
          </TouchableOpacity>
        </Animated.View>
      </ScrollView>
    </View>
  )
}

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
  descriptionContainer: {
    padding: 20,
    paddingBottom: 10,
  },
  descriptionTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 8,
  },
  descriptionText: {
    fontSize: 16,
    color: "#666",
    lineHeight: 22,
  },
  recipientContainer: {
    padding: 16,
    backgroundColor: "#e8f5e9",
    borderRadius: 12,
    marginHorizontal: 20,
    marginBottom: 16,
  },
  recipientLabel: {
    fontSize: 14,
    color: "#388e3c",
    marginBottom: 4,
  },
  recipientName: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#2e7d32",
  },
  amountContainer: {
    padding: 20,
    paddingTop: 10,
    paddingBottom: 15,
    backgroundColor: "#fff",
    borderRadius: 15,
    marginHorizontal: 20,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 15,
  },
  amountInputContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 10,
    paddingHorizontal: 15,
    height: 60,
  },
  currencySymbol: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#333",
    marginRight: 10,
  },
  amountInput: {
    flex: 1,
    fontSize: 24,
    color: "#333",
    height: 60,
  },
  amountInWords: {
    fontSize: 12,
    color: "#666",
    marginTop: 10,
    fontStyle: "italic",
  },
  narrationContainer: {
    padding: 20,
    paddingTop: 10,
    paddingBottom: 15,
    backgroundColor: "#fff",
    borderRadius: 15,
    marginHorizontal: 20,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  narrationInput: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 10,
    paddingHorizontal: 15,
    paddingVertical: 12,
    fontSize: 16,
    color: "#333",
    minHeight: 100,
    textAlignVertical: "top",
  },
  actionContainer: {
    padding: 20,
    paddingTop: 0,
    paddingBottom: 30,
  },
  actionButton: {
    backgroundColor: "#5B37B7",
    borderRadius: 10,
    padding: 18,
    alignItems: "center",
  },
  disabledButton: {
    backgroundColor: "#c4b6e0",
  },
  actionButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
})

