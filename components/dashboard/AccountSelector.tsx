"use client"

import type React from "react"
import { useState, useEffect, useRef } from "react"
import {
  StyleSheet,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  ActivityIndicator,
  Modal,
  Keyboard,
} from "react-native"
import { Ionicons } from "@expo/vector-icons"

// Bank type definition
interface Bank {
  code: string
  name: string
}

// Props for the component
interface RecipientAccountSelectorProps {
  onAccountSelected?: (accountNumber: string, bank: Bank) => void
}

// List of banks from the provided data
const BANKS: Bank[] = [
  { code: "000001", name: "Sterling Bank" },
  { code: "000002", name: "Keystone Bank" },
  { code: "000003", name: "FCMB" },
  { code: "000004", name: "United Bank for Africa" },
  { code: "000005", name: "Diamond Bank" },
  { code: "000006", name: "JAIZ Bank" },
  { code: "000007", name: "Fidelity Bank" },
  { code: "000008", name: "Polaris Bank" },
  { code: "000009", name: "Citi Bank" },
  { code: "000010", name: "Ecobank Bank" },
  { code: "000011", name: "Unity Bank" },
  { code: "000012", name: "StanbicIBTC Bank" },
  { code: "000013", name: "GTBank Plc" },
  { code: "000014", name: "Access Bank" },
  { code: "000015", name: "Zenith Bank Plc" },
  { code: "000016", name: "First Bank of Nigeria" },
  { code: "000017", name: "Wema Bank" },
  { code: "000018", name: "Union Bank" },
  { code: "000019", name: "Enterprise Bank" },
  { code: "000020", name: "Heritage" },
  { code: "000021", name: "Standard Chartered" },
  { code: "000022", name: "Suntrust Bank" },
  { code: "000023", name: "Providus Bank" },
  { code: "000024", name: "Rand Merchant Bank" },
  { code: "000025", name: "Titan Trust Bank" },
  { code: "000026", name: "Taj Bank" },
  { code: "000027", name: "Globus Bank" },
  { code: "000028", name: "Central Bank of Nigeria" },
  { code: "000029", name: "Lotus Bank" },
  { code: "000031", name: "Premium Trust Bank" },
  { code: "000033", name: "eNaira" },
  { code: "000034", name: "Signature Bank" },
  { code: "000036", name: "Optimus Bank" },
]

const RecipientAccountSelector: React.FC<RecipientAccountSelectorProps> = ({ onAccountSelected }) => {
  const [accountNumber, setAccountNumber] = useState("")
  const [selectedBank, setSelectedBank] = useState<Bank | null>(null)
  const [showBankModal, setShowBankModal] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [filteredBanks, setFilteredBanks] = useState<Bank[]>(BANKS)
  const [isValidating, setIsValidating] = useState(false)
  const [accountError, setAccountError] = useState("")
  const searchInputRef = useRef<TextInput>(null)

  // Filter banks based on search query
  useEffect(() => {
    if (searchQuery.trim() === "") {
      setFilteredBanks(BANKS)
    } else {
      const query = searchQuery.toLowerCase()
      const filtered = BANKS.filter((bank) => bank.name.toLowerCase().includes(query))
      setFilteredBanks(filtered)
    }
  }, [searchQuery])

  // Handle account number change
  const handleAccountNumberChange = (text: string) => {
    // Only allow digits and limit to 10 characters
    const numericValue = text.replace(/[^0-9]/g, "").slice(0, 10)
    setAccountNumber(numericValue)

    // Clear error when user is typing
    if (accountError) {
      setAccountError("")
    }
  }

  // Validate account number
  const validateAccountNumber = () => {
    if (accountNumber.length !== 10) {
      setAccountError("Account number must be 10 digits")
      return false
    }
    setAccountError("")
    return true
  }

  // Handle bank selection
  const handleBankSelect = (bank: Bank) => {
    setSelectedBank(bank)
    setShowBankModal(false)

    // If account number is already entered and valid, notify parent
    if (validateAccountNumber() && onAccountSelected) {
      onAccountSelected(accountNumber, bank)
    }
  }

  // Mock account validation (in a real app, this would call an API)
  const validateAccount = () => {
    if (!validateAccountNumber()) {
      return
    }

    if (!selectedBank) {
      setAccountError("Please select a bank")
      return
    }

    setIsValidating(true)

    // Simulate API call to validate account
    setTimeout(() => {
      setIsValidating(false)

      // In a real app, you would validate the account with the bank
      // and return the account holder's name

      // For now, we'll just notify the parent component
      if (onAccountSelected) {
        onAccountSelected(accountNumber, selectedBank)
      }
    }, 1500)
  }

  // Render bank item for the FlatList
  const renderBankItem = ({ item }: { item: Bank }) => (
    <TouchableOpacity style={styles.bankItem} onPress={() => handleBankSelect(item)}>
      <Text style={styles.bankName}>{item.name}</Text>
      <Text style={styles.bankCode}>{item.code}</Text>
    </TouchableOpacity>
  )

  return (
    <View style={styles.container}>
      {/* Account Number Input */}
      <View style={styles.inputContainer}>
        <Text style={styles.label}>Account Number</Text>
        <TextInput
          style={[styles.input, accountError ? styles.inputError : null]}
          placeholder="Enter 10-digit account number"
          keyboardType="numeric"
          value={accountNumber}
          onChangeText={handleAccountNumberChange}
          onBlur={validateAccountNumber}
          maxLength={10}
        />
        {accountError ? <Text style={styles.errorText}>{accountError}</Text> : null}
      </View>

      {/* Bank Selection */}
      <View style={styles.inputContainer}>
        <Text style={styles.label}>Select Bank</Text>
        <TouchableOpacity
          style={[styles.bankSelector, !selectedBank ? styles.placeholderSelector : null]}
          onPress={() => setShowBankModal(true)}
        >
          {selectedBank ? (
            <Text style={styles.selectedBankText}>{selectedBank.name}</Text>
          ) : (
            <Text style={styles.placeholderText}>Select a bank</Text>
          )}
          <Ionicons name="chevron-down" size={20} color="#666" />
        </TouchableOpacity>
      </View>

      {/* Validate Button */}
      <TouchableOpacity
        style={[styles.validateButton, !accountNumber || !selectedBank || isValidating ? styles.disabledButton : null]}
        onPress={validateAccount}
        disabled={!accountNumber || !selectedBank || isValidating}
      >
        {isValidating ? (
          <ActivityIndicator color="#fff" size="small" />
        ) : (
          <Text style={styles.validateButtonText}>Validate Account</Text>
        )}
      </TouchableOpacity>

      {/* Bank Selection Modal */}
      <Modal
        visible={showBankModal}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setShowBankModal(false)}
      >
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => {
            Keyboard.dismiss()
            setShowBankModal(false)
          }}
        >
          <View style={styles.modalContent} onStartShouldSetResponder={() => true}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Select Bank</Text>
              <TouchableOpacity onPress={() => setShowBankModal(false)}>
                <Ionicons name="close" size={24} color="#333" />
              </TouchableOpacity>
            </View>

            {/* Search Input */}
            <View style={styles.searchContainer}>
              <Ionicons name="search" size={20} color="#666" style={styles.searchIcon} />
              <TextInput
                ref={searchInputRef}
                style={styles.searchInput}
                placeholder="Search for bank"
                value={searchQuery}
                onChangeText={setSearchQuery}
                autoFocus={true}
              />
              {searchQuery ? (
                <TouchableOpacity onPress={() => setSearchQuery("")}>
                  <Ionicons name="close-circle" size={20} color="#666" />
                </TouchableOpacity>
              ) : null}
            </View>

            {/* Banks List */}
            {filteredBanks.length > 0 ? (
              <FlatList
                data={filteredBanks}
                renderItem={renderBankItem}
                keyExtractor={(item) => item.code}
                style={styles.banksList}
                showsVerticalScrollIndicator={true}
                initialNumToRender={15}
                maxToRenderPerBatch={20}
                windowSize={10}
              />
            ) : (
              <View style={styles.noResultsContainer}>
                <Text style={styles.noResultsText}>No banks found</Text>
              </View>
            )}
          </View>
        </TouchableOpacity>
      </Modal>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: "#fff",
    borderRadius: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
    marginBottom: 16,
  },
  inputContainer: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: "600",
    color: "#333",
    marginBottom: 8,
  },
  input: {
    height: 50,
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    paddingHorizontal: 12,
    fontSize: 16,
    backgroundColor: "#f9f9f9",
  },
  inputError: {
    borderColor: "#ff3b30",
  },
  errorText: {
    color: "#ff3b30",
    fontSize: 12,
    marginTop: 4,
  },
  bankSelector: {
    height: 50,
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    paddingHorizontal: 12,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#f9f9f9",
  },
  placeholderSelector: {
    borderStyle: "dashed",
  },
  selectedBankText: {
    fontSize: 16,
    color: "#333",
  },
  placeholderText: {
    fontSize: 16,
    color: "#999",
  },
  validateButton: {
    backgroundColor: "#5B37B7",
    height: 50,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 8,
  },
  disabledButton: {
    backgroundColor: "#c4b6e0",
  },
  validateButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "flex-end",
  },
  modalContent: {
    backgroundColor: "#fff",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    height: "80%",
    padding: 16,
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f5f5f5",
    borderRadius: 8,
    paddingHorizontal: 12,
    marginBottom: 16,
    height: 50,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    height: 50,
    fontSize: 16,
  },
  banksList: {
    flex: 1,
  },
  bankItem: {
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  bankName: {
    fontSize: 16,
    color: "#333",
    fontWeight: "500",
  },
  bankCode: {
    fontSize: 12,
    color: "#666",
    marginTop: 4,
  },
  noResultsContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 20,
  },
  noResultsText: {
    fontSize: 16,
    color: "#666",
  },
})

export default RecipientAccountSelector

