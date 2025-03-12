import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams } from "expo-router";
import { COLORS, SIZES } from "@/constants/theme";

const TRANSACTION_TYPES: Record<string, string> = {
  income: "Deposit",
  expense: "Withdraw",
  fees: "Pay Fees",
  savings: "Savings",
};

const TransactionDetails = () => {
  const { type, title, date, amount, description, method, status, id } =
    useLocalSearchParams() as Record<string, string>;

  const transactionTypeText = TRANSACTION_TYPES[type] || "Unknown";

  return (
    <View style={styles.container}>
      {/* Transaction Icon */}
      <View style={styles.iconContainer}>
        <Ionicons
          name={
            type === "income"
              ? "arrow-down-circle"
              : type === "expense"
              ? "arrow-up-circle"
              : "wallet"
          }
          size={50}
          color={type === "income" ? COLORS.success : COLORS.error}
        />
      </View>

      {/* Transaction Type */}
      <Text style={styles.transactionType}>{transactionTypeText}</Text>

      {/* Transaction Info */}
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.date}>{date}</Text>

      {/* Amount */}
      <Text
        style={[
          styles.amount,
          { color: type === "income" ? COLORS.success : COLORS.error },
        ]}
      >
        {type === "income" ? "+" : "-"}${amount}
      </Text>

      {/* Additional Details */}
      <View style={styles.detailsContainer}>
        <Text style={styles.detailText}>
          <Text style={styles.label}>Transaction ID:</Text> {id}
        </Text>
        <Text style={styles.detailText}>
          <Text style={styles.label}>Payment Method:</Text> {method || "N/A"}
        </Text>
        <Text style={styles.detailText}>
          <Text style={styles.label}>Status:</Text>{" "}
          <Text
            style={[
              styles.status,
              {
                color:
                  status === "Completed"
                    ? COLORS.success
                    : status === "Pending"
                    ? COLORS.warning
                    : COLORS.error,
              },
            ]}
          >
            {status}
          </Text>
        </Text>
      </View>

      {/* Description */}
      <Text style={styles.description}>{description}</Text>

      {/* Action Button */}
      <TouchableOpacity style={styles.actionButton}>
        <Text style={styles.actionText}>Download Receipt</Text>
      </TouchableOpacity>
    </View>
  );
};

export default TransactionDetails;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: SIZES.large,
    backgroundColor: COLORS.white,
  },
  iconContainer: {
    marginBottom: SIZES.large,
    backgroundColor: COLORS.gray100,
    padding: SIZES.medium,
    borderRadius: 50,
  },
  transactionType: {
    fontSize: SIZES.large,
    fontWeight: "bold",
    color: COLORS.primary,
    marginBottom: SIZES.small,
  },
  title: {
    fontSize: SIZES.large,
    fontWeight: "bold",
    color: COLORS.black,
  },
  date: {
    fontSize: SIZES.medium,
    color: COLORS.gray500,
    marginVertical: SIZES.small,
  },
  amount: {
    fontSize: SIZES.xLarge,
    fontWeight: "bold",
    marginVertical: SIZES.small,
  },
  detailsContainer: {
    marginVertical: SIZES.medium,
    width: "100%",
    paddingHorizontal: SIZES.medium,
  },
  detailText: {
    fontSize: SIZES.medium,
    color: COLORS.gray500,
    marginBottom: SIZES.small,
  },
  label: {
    fontWeight: "bold",
    color: COLORS.black,
  },
  status: {
    fontWeight: "bold",
    color: COLORS.gray500,
  },
  description: {
    fontSize: SIZES.medium,
    textAlign: "center",
    color: COLORS.gray500,
    marginVertical: SIZES.medium,
    paddingHorizontal: SIZES.medium,
  },
  actionButton: {
    backgroundColor: COLORS.primary,
    paddingVertical: SIZES.medium,
    paddingHorizontal: SIZES.xLarge,
    borderRadius: SIZES.small,
    marginTop: SIZES.large,
  },
  actionText: {
    fontSize: SIZES.medium,
    color: COLORS.white,
    fontWeight: "bold",
  },
});
