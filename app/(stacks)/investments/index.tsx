import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
} from 'react-native';
import { router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, FONT, SIZES, SHADOWS } from '../../../constants/theme';
import Button from '../../../components/common/Button';

// Dummy data
const INVESTMENT_PORTFOLIO = {
  totalInvested: 150000,
  totalReturns: 12500,
  returnRate: 8.33,
  investments: [
    {
      id: '1',
      type: 'mutual_funds',
      name: 'Student Growth Fund',
      amount: 100000,
      returnRate: 10,
      risk: 'low',
    },
    {
      id: '2',
      type: 'stocks',
      name: 'Tech Stocks Bundle',
      amount: 50000,
      returnRate: 5,
      risk: 'medium',
    },
  ],
};

const RECOMMENDATIONS = [
  {
    id: '1',
    type: 'mutual_funds',
    name: 'Education Savings Fund',
    minAmount: 25000,
    expectedReturn: 12,
    risk: 'low',
    description: 'Low-risk fund designed for students saving for education expenses.',
    matchScore: 95,
  },
  {
    id: '2',
    type: 'bonds',
    name: 'Government Education Bonds',
    minAmount: 50000,
    expectedReturn: 8,
    risk: 'very_low',
    description: 'Government-backed bonds with tax benefits for students.',
    matchScore: 90,
  },
  {
    id: '3',
    type: 'stocks',
    name: 'Technology Growth Portfolio',
    minAmount: 10000,
    expectedReturn: 15,
    risk: 'medium',
    description: 'Curated portfolio of established tech companies with growth potential.',
    matchScore: 85,
  },
];

const InvestmentsScreen = () => {
  const [loading, setLoading] = useState(false);

  const handleInvest = async (recommendationId: string) => {
    setLoading(true);
    try {
      // TODO: Implement actual investment logic
      await new Promise(resolve => setTimeout(resolve, 1500));
      router.push('/(stacks)/investments/new');
    } catch (error) {
      console.error('Investment error:', error);
      // Handle error appropriately
    } finally {
      setLoading(false);
    }
  };

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case 'very_low':
        return COLORS.success;
      case 'low':
        return COLORS.info;
      case 'medium':
        return COLORS.warning;
      case 'high':
        return COLORS.error;
      default:
        return COLORS.gray500;
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar style="light" />


      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <Ionicons name="arrow-back" size={24} color={COLORS.white} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Investments</Text>
        <TouchableOpacity
          style={styles.historyButton}
          onPress={() => router.push('/dashboard/investments/history')}
        >
          <Ionicons name="time" size={24} color={COLORS.white} />
        </TouchableOpacity>
      </View>
        {/* Portfolio Overview */}
        <View style={styles.overviewCard}>
          <View style={styles.overviewHeader}>
            <Text style={styles.overviewTitle}>Your Portfolio</Text>
            <TouchableOpacity
              onPress={() => router.push('/dashboard/investments/portfolio')}
            >
              <Text style={styles.seeAll}>See Details</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.statsContainer}>
            <View style={styles.statItem}>
              <Text style={styles.statLabel}>Total Invested</Text>
              <Text style={styles.statValue}>
                ₦{INVESTMENT_PORTFOLIO.totalInvested.toLocaleString('en-NG')}
              </Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <Text style={styles.statLabel}>Total Returns</Text>
              <Text style={[styles.statValue, { color: COLORS.success }]}>
                +₦{INVESTMENT_PORTFOLIO.totalReturns.toLocaleString('en-NG')}
              </Text>
              <Text style={styles.returnRate}>
                +{INVESTMENT_PORTFOLIO.returnRate}%
              </Text>
            </View>
          </View>
        </View>

        {/* AI Recommendations */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Recommended for You</Text>
          <Text style={styles.sectionSubtitle}>
            Based on your financial goals and risk profile
          </Text>

          {RECOMMENDATIONS.map((recommendation) => (
            <View key={recommendation.id} style={styles.recommendationCard}>
              <View style={styles.recommendationHeader}>
                <View style={styles.recommendationInfo}>
                  <View style={styles.matchScoreContainer}>
                    <Ionicons name="star" size={16} color={COLORS.warning} />
                    <Text style={styles.matchScore}>{recommendation.matchScore}% Match</Text>
                  </View>
                  <Text style={styles.recommendationName}>
                    {recommendation.name}
                  </Text>
                  <View style={styles.recommendationType}>
                    <Ionicons
                      name={
                        recommendation.type === 'mutual_funds'
                          ? 'pie-chart'
                          : recommendation.type === 'bonds'
                          ? 'shield'
                          : 'trending-up'
                      }
                      size={16}
                      color={COLORS.gray500}
                    />
                    <Text style={styles.recommendationTypeText}>
                      {recommendation.type.split('_').map(word => 
                        word.charAt(0).toUpperCase() + word.slice(1)
                      ).join(' ')}
                    </Text>
                  </View>
                </View>
              </View>

              <Text style={styles.recommendationDescription}>
                {recommendation.description}
              </Text>

              <View style={styles.recommendationDetails}>
                <View style={styles.detailItem}>
                  <Text style={styles.detailLabel}>Min. Investment</Text>
                  <Text style={styles.detailValue}>
                    ₦{recommendation.minAmount.toLocaleString('en-NG')}
                  </Text>
                </View>
                <View style={styles.detailItem}>
                  <Text style={styles.detailLabel}>Expected Return</Text>
                  <Text style={[styles.detailValue, { color: COLORS.success }]}>
                    {recommendation.expectedReturn}% / year
                  </Text>
                </View>
                <View style={styles.detailItem}>
                  <Text style={styles.detailLabel}>Risk Level</Text>
                  <Text
                    style={[
                      styles.detailValue,
                      { color: getRiskColor(recommendation.risk) },
                    ]}
                  >
                    {recommendation.risk.split('_').map(word => 
                      word.charAt(0).toUpperCase() + word.slice(1)
                    ).join(' ')}
                  </Text>
                </View>
              </View>

              <Button
                title="Invest Now"
                onPress={() => handleInvest(recommendation.id)}
                loading={loading}
                style={styles.investButton}
              />
            </View>
          ))}
        </View>

        {/* Educational Content */}
        <TouchableOpacity
          style={styles.educationCard}
          onPress={() => router.push('/dashboard/investments/learn')}
        >
          <View style={styles.educationContent}>
            <Ionicons name="school" size={32} color={COLORS.primary} />
            <View style={styles.educationText}>
              <Text style={styles.educationTitle}>Learn About Investing</Text>
              <Text style={styles.educationSubtitle}>
                Free courses designed for student investors
              </Text>
            </View>
          </View>
          <Ionicons name="chevron-forward" size={24} color={COLORS.gray500} />
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
  overviewHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SIZES.medium,
  },
  overviewTitle: {
    fontFamily: FONT.bold,
    fontSize: SIZES.large,
    color: COLORS.text,
  },
  seeAll: {
    fontFamily: FONT.medium,
    fontSize: SIZES.medium,
    color: COLORS.primary,
  },
  statsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
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
  returnRate: {
    fontFamily: FONT.medium,
    fontSize: SIZES.small,
    color: COLORS.success,
    marginTop: 2,
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
    marginBottom: SIZES.small,
  },
  sectionSubtitle: {
    fontFamily: FONT.regular,
    fontSize: SIZES.small,
    color: COLORS.gray500,
    marginBottom: SIZES.medium,
  },
  recommendationCard: {
    backgroundColor: COLORS.white,
    borderRadius: SIZES.medium,
    padding: SIZES.large,
    marginBottom: SIZES.medium,
    ...SHADOWS.small,
  },
  recommendationHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: SIZES.medium,
  },
  recommendationInfo: {
    flex: 1,
  },
  matchScoreContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  matchScore: {
    fontFamily: FONT.medium,
    fontSize: SIZES.small,
    color: COLORS.warning,
    marginLeft: 4,
  },
  recommendationName: {
    fontFamily: FONT.bold,
    fontSize: SIZES.medium,
    color: COLORS.text,
    marginBottom: 4,
  },
  recommendationType: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  recommendationTypeText: {
    fontFamily: FONT.regular,
    fontSize: SIZES.small,
    color: COLORS.gray500,
    marginLeft: 4,
  },
  recommendationDescription: {
    fontFamily: FONT.regular,
    fontSize: SIZES.small,
    color: COLORS.gray500,
    marginBottom: SIZES.medium,
    lineHeight: 20,
  },
  recommendationDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: SIZES.medium,
  },
  detailItem: {
    flex: 1,
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
  investButton: {
    marginTop: SIZES.small,
  },
  educationCard: {
    backgroundColor: COLORS.white,
    borderRadius: SIZES.medium,
    padding: SIZES.large,
    margin: SIZES.medium,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    ...SHADOWS.medium,
  },
  educationContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  educationText: {
    marginLeft: SIZES.medium,
  },
  educationTitle: {
    fontFamily: FONT.bold,
    fontSize: SIZES.medium,
    color: COLORS.text,
    marginBottom: 4,
  },
  educationSubtitle: {
    fontFamily: FONT.regular,
    fontSize: SIZES.small,
    color: COLORS.gray500,
  },
});

export default InvestmentsScreen; 