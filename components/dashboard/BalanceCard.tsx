import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, FONT, SIZES, SHADOWS } from '../../constants/theme';

interface BalanceCardProps {
  balance: number;
  onAddMoney: () => void;
  onSendMoney: () => void;
  onViewTransactions: () => void;
}

const BalanceCard: React.FC<BalanceCardProps> = ({
  balance,
  onAddMoney,
  onSendMoney,
  onViewTransactions,
}) => {
  return (
    <View style={styles.container}>
      <View style={styles.balanceContainer}>
        <Text style={styles.label}>Total Balance</Text>
        <Text style={styles.balance}>
          ₦{balance.toLocaleString('en-NG', { minimumFractionDigits: 2 })}
        </Text>
      </View>

      <View style={styles.actionsContainer}>
        <TouchableOpacity style={styles.action} onPress={onAddMoney}>
          <View style={[styles.actionIcon, { backgroundColor: COLORS.primary }]}>
            <Ionicons name="add" size={24} color={COLORS.white} />
          </View>
          <Text style={styles.actionText}>Add Money</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.action} onPress={onSendMoney}>
          <View style={[styles.actionIcon, { backgroundColor: COLORS.secondary }]}>
            <Ionicons name="send" size={24} color={COLORS.white} />
          </View>
          <Text style={styles.actionText}>Send Money</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.action} onPress={onViewTransactions}>
          <View style={[styles.actionIcon, { backgroundColor: COLORS.tertiary }]}>
            <Ionicons name="list" size={24} color={COLORS.white} />
          </View>
          <Text style={styles.actionText}>History</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: COLORS.white,
    borderRadius: SIZES.medium,
    padding: SIZES.large,
    marginHorizontal: SIZES.medium,
    marginVertical: SIZES.small,
    ...SHADOWS.medium,
  },
  balanceContainer: {
    alignItems: 'center',
    marginBottom: SIZES.large,
  },
  label: {
    fontFamily: FONT.regular,
    fontSize: SIZES.medium,
    color: COLORS.gray500,
    marginBottom: SIZES.small,
  },
  balance: {
    fontFamily: FONT.bold,
    fontSize: SIZES.xxLarge,
    color: COLORS.text,
  },
  actionsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: SIZES.medium,
  },
  action: {
    alignItems: 'center',
  },
  actionIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: SIZES.small,
  },
  actionText: {
    fontFamily: FONT.medium,
    fontSize: SIZES.small,
    color: COLORS.gray500,
  },
});

export default BalanceCard; 