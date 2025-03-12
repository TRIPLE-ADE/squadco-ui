import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, FONT, SIZES, SHADOWS } from '@/constants/theme';
import Button from '@/components/common/Button';

// Dummy data
const SCHOOL_FEES = {
  semester: '2024 Spring',
  totalAmount: 750000,
  paidAmount: 250000,
  dueDate: new Date('2024-05-15'),
  installments: [
    {
      id: '1',
      amount: 250000,
      dueDate: new Date('2024-03-15'),
      status: 'paid',
    },
    {
      id: '2',
      amount: 250000,
      dueDate: new Date('2024-04-15'),
      status: 'pending',
    },
    {
      id: '3',
      amount: 250000,
      dueDate: new Date('2024-05-15'),
      status: 'pending',
    },
  ],
};

const SchoolFeesScreen = () => {
  const [loading, setLoading] = useState(false);

  const progress = (SCHOOL_FEES.paidAmount / SCHOOL_FEES.totalAmount) * 100;
  const remainingAmount = SCHOOL_FEES.totalAmount - SCHOOL_FEES.paidAmount;
  const daysLeft = Math.ceil(
    (SCHOOL_FEES.dueDate.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)
  );

  const handlePayment = async () => {
    setLoading(true);
    try {
      // TODO: Implement actual payment logic
      await new Promise(resolve => setTimeout(resolve, 1500));
      router.push('/dashboard/school-fees/payment');
    } catch (error) {
      console.error('Payment error:', error);
      // Handle error appropriately
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar style="light" />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <Ionicons name="arrow-back" size={24} color={COLORS.white} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>School Fees</Text>
        <TouchableOpacity
          style={styles.historyButton}
          onPress={() => router.push('/dashboard/school-fees/history')}
        >
          <Ionicons name="time" size={24} color={COLORS.white} />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Overview Card */}
        <View style={styles.overviewCard}>
          <Text style={styles.semester}>{SCHOOL_FEES.semester}</Text>
          
          <View style={styles.amountContainer}>
            <Text style={styles.paidAmount}>
              ₦{SCHOOL_FEES.paidAmount.toLocaleString('en-NG')}
            </Text>
            <Text style={styles.totalAmount}>
              of ₦{SCHOOL_FEES.totalAmount.toLocaleString('en-NG')}
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
            <Text style={styles.progressText}>{Math.round(progress)}% paid</Text>
          </View>

          <View style={styles.statsContainer}>
            <View style={styles.statItem}>
              <Text style={styles.statLabel}>Remaining</Text>
              <Text style={styles.statValue}>
                ₦{remainingAmount.toLocaleString('en-NG')}
              </Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <Text style={styles.statLabel}>Days Left</Text>
              <Text style={styles.statValue}>{daysLeft}</Text>
            </View>
          </View>
        </View>

        {/* Installments */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Payment Schedule</Text>

          {SCHOOL_FEES.installments.map((installment, index) => (
            <View key={installment.id} style={styles.installmentCard}>
              <View style={styles.installmentHeader}>
                <Text style={styles.installmentTitle}>
                  Installment {index + 1}
                </Text>
                <View
                  style={[
                    styles.statusBadge,
                    {
                      backgroundColor:
                        installment.status === 'paid'
                          ? COLORS.success
                          : COLORS.warning,
                    },
                  ]}
                >
                  <Text style={styles.statusText}>
                    {installment.status === 'paid' ? 'Paid' : 'Pending'}
                  </Text>
                </View>
              </View>

              <View style={styles.installmentDetails}>
                <View>
                  <Text style={styles.detailLabel}>Amount</Text>
                  <Text style={styles.detailValue}>
                    ₦{installment.amount.toLocaleString('en-NG')}
                  </Text>
                </View>
                <View>
                  <Text style={styles.detailLabel}>Due Date</Text>
                  <Text style={styles.detailValue}>
                    {installment.dueDate.toLocaleDateString()}
                  </Text>
                </View>
              </View>

              {installment.status === 'pending' && (
                <Button
                  title="Pay Now"
                  onPress={handlePayment}
                  loading={loading}
                  style={styles.payButton}
                />
              )}
            </View>
          ))}
        </View>

        {/* Payment History Link */}
        <TouchableOpacity
          style={styles.historyLink}
          onPress={() => router.push('/dashboard/school-fees/history')}
        >
          <Text style={styles.historyText}>View Payment History</Text>
          <Ionicons name="chevron-forward" size={20} color={COLORS.primary} />
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  header: {
    backgroundColor: COLORS.primary,
    padding: SIZES.large,
    paddingTop: SIZES.xxLarge + SIZES.medium,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  backButton: {
    padding: SIZES.small,
  },
  headerTitle: {
    fontFamily: FONT.bold,
    fontSize: SIZES.large,
    color: COLORS.white,
  },
  historyButton: {
    padding: SIZES.small,
  },
  content: {
    flex: 1,
  },
  overviewCard: {
    backgroundColor: COLORS.white,
    borderRadius: SIZES.medium,
    padding: SIZES.large,
    margin: SIZES.medium,
    ...SHADOWS.medium,
  },
  semester: {
    fontFamily: FONT.bold,
    fontSize: SIZES.large,
    color: COLORS.text,
    marginBottom: SIZES.medium,
  },
  amountContainer: {
    flexDirection: 'row',
    alignItems: 'baseline',
    marginBottom: SIZES.medium,
  },
  paidAmount: {
    fontFamily: FONT.bold,
    fontSize: SIZES.xxLarge,
    color: COLORS.text,
    marginRight: SIZES.small,
  },
  totalAmount: {
    fontFamily: FONT.regular,
    fontSize: SIZES.medium,
    color: COLORS.gray500,
  },
  progressContainer: {
    marginBottom: SIZES.large,
  },
  progressBackground: {
    height: 8,
    backgroundColor: COLORS.gray200,
    borderRadius: 4,
    marginBottom: SIZES.small,
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
  },
  statsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    paddingTop: SIZES.medium,
    borderTopWidth: 1,
    borderTopColor: COLORS.gray200,
  },
  statItem: {
    alignItems: 'center',
  },
  statLabel: {
    fontFamily: FONT.regular,
    fontSize: SIZES.small,
    color: COLORS.gray500,
    marginBottom: 4,
  },
  statValue: {
    fontFamily: FONT.bold,
    fontSize: SIZES.large,
    color: COLORS.text,
  },
  statDivider: {
    width: 1,
    height: '100%',
    backgroundColor: COLORS.gray200,
  },
  section: {
    marginVertical: SIZES.medium,
    paddingHorizontal: SIZES.medium,
  },
  sectionTitle: {
    fontFamily: FONT.bold,
    fontSize: SIZES.large,
    color: COLORS.text,
    marginBottom: SIZES.medium,
  },
  installmentCard: {
    backgroundColor: COLORS.white,
    borderRadius: SIZES.medium,
    padding: SIZES.large,
    marginBottom: SIZES.medium,
    ...SHADOWS.small,
  },
  installmentHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SIZES.medium,
  },
  installmentTitle: {
    fontFamily: FONT.medium,
    fontSize: SIZES.medium,
    color: COLORS.text,
  },
  statusBadge: {
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: SIZES.small,
  },
  statusText: {
    fontFamily: FONT.medium,
    fontSize: SIZES.small,
    color: COLORS.white,
  },
  installmentDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: SIZES.medium,
  },
  detailLabel: {
    fontFamily: FONT.regular,
    fontSize: SIZES.small,
    color: COLORS.gray500,
    marginBottom: 4,
  },
  detailValue: {
    fontFamily: FONT.medium,
    fontSize: SIZES.medium,
    color: COLORS.text,
  },
  payButton: {
    marginTop: SIZES.small,
  },
  historyLink: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: SIZES.medium,
    marginBottom: SIZES.large,
  },
  historyText: {
    fontFamily: FONT.medium,
    fontSize: SIZES.medium,
    color: COLORS.primary,
    marginRight: SIZES.small,
  },
});

export default SchoolFeesScreen; 