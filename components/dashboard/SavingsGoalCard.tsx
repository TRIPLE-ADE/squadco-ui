import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, FONT, SIZES, SHADOWS } from '../../constants/theme';

interface SavingsGoalCardProps {
  title: string;
  targetAmount: number;
  currentAmount: number;
  deadline: Date;
  onPress: () => void;
}

const SavingsGoalCard: React.FC<SavingsGoalCardProps> = ({
  title,
  targetAmount,
  currentAmount,
  deadline,
  onPress,
}) => {
  const progress = (currentAmount / targetAmount) * 100;
  const daysLeft = Math.ceil((deadline.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.daysLeft}>{daysLeft} days left</Text>
      </View>

      <View style={styles.amountContainer}>
        <Text style={styles.currentAmount}>
          ₦{currentAmount.toLocaleString('en-NG')}
        </Text>
        <Text style={styles.targetAmount}>
          of ₦{targetAmount.toLocaleString('en-NG')}
        </Text>
      </View>

      <View style={styles.progressContainer}>
        <View style={styles.progressBackground}>
          <View
            style={[
              styles.progressFill,
              { width: `${Math.min(progress, 100)}%` },
            ]}
          />
        </View>
        <Text style={styles.progressText}>{Math.round(progress)}%</Text>
      </View>

      <View style={styles.footer}>
        <View style={styles.iconContainer}>
          <Ionicons
            name="trending-up"
            size={16}
            color={progress >= 100 ? COLORS.success : COLORS.primary}
          />
          <Text style={[
            styles.status,
            { color: progress >= 100 ? COLORS.success : COLORS.primary }
          ]}>
            {progress >= 100 ? 'Goal Achieved!' : 'On Track'}
          </Text>
        </View>
        <TouchableOpacity
          style={styles.addButton}
          onPress={(e) => {
            e.stopPropagation();
            // TODO: Handle add funds
          }}
        >
          <Ionicons name="add-circle" size={24} color={COLORS.primary} />
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
    ...SHADOWS.medium,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SIZES.medium,
  },
  title: {
    fontFamily: FONT.medium,
    fontSize: SIZES.medium,
    color: COLORS.text,
  },
  daysLeft: {
    fontFamily: FONT.regular,
    fontSize: SIZES.small,
    color: COLORS.gray500,
  },
  amountContainer: {
    flexDirection: 'row',
    alignItems: 'baseline',
    marginBottom: SIZES.medium,
  },
  currentAmount: {
    fontFamily: FONT.bold,
    fontSize: SIZES.large,
    color: COLORS.text,
    marginRight: SIZES.small,
  },
  targetAmount: {
    fontFamily: FONT.regular,
    fontSize: SIZES.medium,
    color: COLORS.gray500,
  },
  progressContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SIZES.medium,
  },
  progressBackground: {
    flex: 1,
    height: 8,
    backgroundColor: COLORS.gray200,
    borderRadius: 4,
    marginRight: SIZES.small,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: COLORS.primary,
    borderRadius: 4,
  },
  progressText: {
    fontFamily: FONT.medium,
    fontSize: SIZES.small,
    color: COLORS.gray500,
    minWidth: 40,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  iconContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  status: {
    fontFamily: FONT.medium,
    fontSize: SIZES.small,
    marginLeft: SIZES.small,
  },
  addButton: {
    padding: SIZES.small,
  },
});

export default SavingsGoalCard; 