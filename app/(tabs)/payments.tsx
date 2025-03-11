import React, { useState } from "react";
import {
  StyleSheet,
  View,
  Text,
  FlatList,
  TextInput,
  Button,
  TouchableOpacity,
} from "react-native";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { COLORS, SIZES } from "@/constants/theme";

// Define the Transaction type
interface Transaction {
  id: string;
  school: string;
  method: string;
  status: string;
}

const PAYMENT_METHODS = ["SquadCo", "Paystack", "USSD"];

export default function Payment() {
  const router = useRouter();
  const [selectedSchool, setSelectedSchool] = useState("");
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState("");
  const [transactionHistory, setTransactionHistory] = useState<Transaction[]>([]);
  const [receiptGenerated, setReceiptGenerated] = useState(false);

  const handlePayment = () => {
    console.log("Payment made for:", selectedSchool, selectedPaymentMethod);
    setTransactionHistory((prev) => [
      ...prev,
      { id: Date.now().toString(), school: selectedSchool, method: selectedPaymentMethod, status: "Pending" },
    ]);
  };

  const generateReceipt = () => {
    setReceiptGenerated(true);
    console.log("Receipt generated for:", selectedSchool);
  };

  const renderTransactionItem = ({ item }: { item: Transaction }) => (
    <View style={styles.transactionItem}>
      <Text>{item.school} - {item.method} - {item.status}</Text>
    </View>
  );

  return (
    <FlatList
      data={[{ key: 'payment' }]} // Dummy data to render the payment section
      renderItem={({ item }) => {
        if (item.key === 'payment') {
          return (
            <View style={styles.container}>
              <Text style={styles.title}>🔵 Payments & Transactions</Text>
              <View style={styles.paymentSection}>
                <Text style={styles.sectionTitle}>Make Payment</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Select School"
                  value={selectedSchool}
                  onChangeText={setSelectedSchool}
                />
                <View style={styles.paymentMethodContainer}>
                  {PAYMENT_METHODS.map((method) => (
                    <TouchableOpacity
                      key={method}
                      style={[
                        styles.paymentMethod,
                        selectedPaymentMethod === method && styles.selectedPaymentMethod,
                      ]}
                      onPress={() => setSelectedPaymentMethod(method)}
                    >
                      <Text style={styles.paymentMethodText}>{method}</Text>
                    </TouchableOpacity>
                  ))}
                </View>
                <Button title="Make Payment" onPress={handlePayment} />
              </View>
            </View>
          );
        }
        return null;
      }}
      keyExtractor={(item) => item.key}
      ListHeaderComponent={
        <>
          <Text style={styles.sectionTitle}>Payment Status</Text>
        </>
      }
      ListFooterComponent={
        <FlatList
          data={transactionHistory}
          renderItem={renderTransactionItem}
          keyExtractor={(item) => item.id}
          ListEmptyComponent={<Text>No transactions found.</Text>}
        />
      }
    />
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: SIZES.medium,
    backgroundColor: "#f5f5f5",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: SIZES.medium,
  },
  paymentSection: {
    marginBottom: SIZES.large,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: SIZES.small,
  },
  input: {
    borderWidth: 1,
    borderColor: COLORS.gray200,
    borderRadius: 5,
    padding: SIZES.small,
    marginBottom: SIZES.small,
  },
  paymentMethodContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: SIZES.small,
  },
  paymentMethod: {
    flex: 1,
    padding: SIZES.small,
    borderWidth: 1,
    borderColor: COLORS.gray200,
    borderRadius: 5,
    alignItems: "center",
    marginHorizontal: SIZES.small,
  },
  selectedPaymentMethod: {
    backgroundColor: COLORS.primaryLight,
  },
  paymentMethodText: {
    color: COLORS.primary,
  },
  transactionItem: {
    padding: SIZES.small,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.gray200,
  },
  receiptSection: {
    marginTop: SIZES.large,
    alignItems: "center",
  },
  receiptText: {
    marginTop: SIZES.small,
    color: COLORS.success,
  },
}); 