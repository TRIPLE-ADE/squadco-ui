import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  Animated,
} from 'react-native';
import { router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, FONT, SIZES, SHADOWS } from '@/constants/theme';
import Button from '@/components/common/Button';

const { width, height } = Dimensions.get('window');

// Dummy data
const MONTHLY_RECAP = {
  month: 'March',
  year: 2024,
  totalSpent: 125000,
  totalSaved: 75000,
  savingsGoals: [
    {
      id: '1',
      title: 'Laptop Fund',
      progress: 70,
    },
    {
      id: '2',
      title: 'Emergency Fund',
      progress: 100,
    },
  ],
  topCategories: [
    {
      category: 'Food',
      amount: 45000,
      percentage: 36,
    },
    {
      category: 'Transport',
      amount: 30000,
      percentage: 24,
    },
    {
      category: 'Education',
      amount: 25000,
      percentage: 20,
    },
    {
      category: 'Entertainment',
      amount: 15000,
      percentage: 12,
    },
  ],
  insights: [
    {
      id: '1',
      type: 'saving',
      message: 'You saved 20% more than last month! Keep it up! 🎉',
      importance: 'high',
    },
    {
      id: '2',
      type: 'spending',
      message: 'Your food expenses increased by 15%. Consider meal planning to save more.',
      importance: 'medium',
    },
  ],
};

const SLIDES = [
  {
    id: 'intro',
    type: 'intro',
  },
  {
    id: 'spending',
    type: 'spending',
  },
  {
    id: 'savings',
    type: 'savings',
  },
  {
    id: 'categories',
    type: 'categories',
  },
  {
    id: 'insights',
    type: 'insights',
  },
  {
    id: 'summary',
    type: 'summary',
  },
];

const MonthlyRecapScreen = () => {
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
  const slideAnim = useRef(new Animated.Value(0)).current;
  const fadeAnim = useRef(new Animated.Value(1)).current;
  const scaleAnim = useRef(new Animated.Value(1)).current;

  const animateTransition = (forward = true) => {
    Animated.sequence([
      // Fade out and scale down current slide
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.timing(scaleAnim, {
          toValue: 0.8,
          duration: 300,
          useNativeDriver: true,
        }),
      ]),
      // Change slide
      Animated.timing(slideAnim, {
        toValue: forward ? currentSlideIndex + 1 : currentSlideIndex - 1,
        duration: 0,
        useNativeDriver: true,
      }),
      // Fade in and scale up new slide
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.timing(scaleAnim, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
      ]),
    ]).start();
  };

  const handleNext = () => {
    if (currentSlideIndex < SLIDES.length - 1) {
      animateTransition(true);
      setCurrentSlideIndex(currentSlideIndex + 1);
    } else {
      router.back();
    }
  };

  const handlePrevious = () => {
    if (currentSlideIndex > 0) {
      animateTransition(false);
      setCurrentSlideIndex(currentSlideIndex - 1);
    }
  };

  const renderSlide = () => {
    const currentSlide = SLIDES[currentSlideIndex];

    switch (currentSlide.type) {
      case 'intro':
        return (
          <View style={styles.slideContent}>
            <Text style={styles.monthYear}>
              {MONTHLY_RECAP.month} {MONTHLY_RECAP.year}
            </Text>
            <Text style={styles.title}>Your Financial Recap</Text>
            <Text style={styles.subtitle}>
              Let's see how you managed your money this month
            </Text>
            <Ionicons name="bar-chart" size={64} color={COLORS.primary} />
          </View>
        );

      case 'spending':
        return (
          <View style={styles.slideContent}>
            <Text style={styles.title}>Total Spending</Text>
            <Text style={styles.amount}>
              ₦{MONTHLY_RECAP.totalSpent.toLocaleString('en-NG')}
            </Text>
            <View style={styles.comparisonContainer}>
              <Ionicons name="trending-down" size={24} color={COLORS.error} />
              <Text style={[styles.comparisonText, { color: COLORS.error }]}>
                15% less than last month
              </Text>
            </View>
          </View>
        );

      case 'savings':
        return (
          <View style={styles.slideContent}>
            <Text style={styles.title}>Total Savings</Text>
            <Text style={styles.amount}>
              ₦{MONTHLY_RECAP.totalSaved.toLocaleString('en-NG')}
            </Text>
            <View style={styles.comparisonContainer}>
              <Ionicons name="trending-up" size={24} color={COLORS.success} />
              <Text style={[styles.comparisonText, { color: COLORS.success }]}>
                20% more than last month
              </Text>
            </View>
            <View style={styles.goalsContainer}>
              {MONTHLY_RECAP.savingsGoals.map((goal) => (
                <View key={goal.id} style={styles.goalItem}>
                  <Text style={styles.goalTitle}>{goal.title}</Text>
                  <View style={styles.progressContainer}>
                    <View style={styles.progressBackground}>
                      <View
                        style={[
                          styles.progressFill,
                          { width: `${goal.progress}%` },
                        ]}
                      />
                    </View>
                    <Text style={styles.progressText}>{goal.progress}%</Text>
                  </View>
                </View>
              ))}
            </View>
          </View>
        );

      case 'categories':
        return (
          <View style={styles.slideContent}>
            <Text style={styles.title}>Top Spending Categories</Text>
            {MONTHLY_RECAP.topCategories.map((category, index) => (
              <View key={category.category} style={styles.categoryItem}>
                <View style={styles.categoryHeader}>
                  <Text style={styles.categoryRank}>#{index + 1}</Text>
                  <Text style={styles.categoryName}>{category.category}</Text>
                  <Text style={styles.categoryAmount}>
                    ₦{category.amount.toLocaleString('en-NG')}
                  </Text>
                </View>
                <View style={styles.categoryProgressContainer}>
                  <View style={styles.categoryProgressBackground}>
                    <View
                      style={[
                        styles.categoryProgressFill,
                        { width: `${category.percentage}%` },
                      ]}
                    />
                  </View>
                  <Text style={styles.categoryPercentage}>
                    {category.percentage}%
                  </Text>
                </View>
              </View>
            ))}
          </View>
        );

      case 'insights':
        return (
          <View style={styles.slideContent}>
            <Text style={styles.title}>AI Financial Insights</Text>
            {MONTHLY_RECAP.insights.map((insight) => (
              <View
                key={insight.id}
                style={[
                  styles.insightCard,
                  {
                    borderLeftColor:
                      insight.importance === 'high'
                        ? COLORS.primary
                        : insight.type === 'saving'
                        ? COLORS.success
                        : COLORS.warning,
                  },
                ]}
              >
                <Text style={styles.insightMessage}>{insight.message}</Text>
              </View>
            ))}
          </View>
        );

      case 'summary':
        return (
          <View style={styles.slideContent}>
            <Text style={styles.title}>Great Job!</Text>
            <Text style={styles.subtitle}>
              Keep tracking your finances and working towards your goals
            </Text>
            <Ionicons name="trophy" size={64} color={COLORS.warning} />
            <Button
              title="View Detailed Report"
              onPress={() => router.push('/dashboard/reports')}
              style={styles.reportButton}
            />
          </View>
        );

      default:
        return null;
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar style="light" />

      {/* Close Button */}
      <TouchableOpacity
        style={styles.closeButton}
        onPress={() => router.back()}
      >
        <Ionicons name="close" size={24} color={COLORS.white} />
      </TouchableOpacity>

      {/* Progress Bar */}
      <View style={styles.progressBar}>
        {SLIDES.map((_, index) => (
          <View
            key={index}
            style={[
              styles.progressDot,
              index === currentSlideIndex && styles.progressDotActive,
            ]}
          />
        ))}
      </View>

      {/* Slide Content */}
      <Animated.View
        style={[
          styles.slide,
          {
            opacity: fadeAnim,
            transform: [{ scale: scaleAnim }],
          },
        ]}
      >
        {renderSlide()}
      </Animated.View>

      {/* Navigation */}
      <View style={styles.navigation}>
        {currentSlideIndex > 0 && (
          <TouchableOpacity
            style={styles.navButton}
            onPress={handlePrevious}
          >
            <Ionicons name="chevron-back" size={24} color={COLORS.white} />
          </TouchableOpacity>
        )}
        <TouchableOpacity
          style={styles.navButton}
          onPress={handleNext}
        >
          <Ionicons
            name={
              currentSlideIndex === SLIDES.length - 1
                ? 'checkmark'
                : 'chevron-forward'
            }
            size={24}
            color={COLORS.white}
          />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  closeButton: {
    position: 'absolute',
    top: SIZES.xxLarge,
    right: SIZES.large,
    zIndex: 1,
    padding: SIZES.small,
  },
  progressBar: {
    flexDirection: 'row',
    justifyContent: 'center',
    paddingTop: SIZES.xxLarge + SIZES.large,
    paddingBottom: SIZES.medium,
  },
  progressDot: {
    width: width / SLIDES.length - 8,
    height: 4,
    borderRadius: 2,
    backgroundColor: COLORS.gray300,
    marginHorizontal: 2,
  },
  progressDotActive: {
    backgroundColor: COLORS.primary,
  },
  slide: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: SIZES.large,
  },
  slideContent: {
    alignItems: 'center',
    width: '100%',
  },
  monthYear: {
    fontFamily: FONT.bold,
    fontSize: SIZES.large,
    color: COLORS.primary,
    marginBottom: SIZES.medium,
  },
  title: {
    fontFamily: FONT.bold,
    fontSize: SIZES.xxLarge,
    color: COLORS.text,
    textAlign: 'center',
    marginBottom: SIZES.medium,
  },
  subtitle: {
    fontFamily: FONT.regular,
    fontSize: SIZES.medium,
    color: COLORS.gray500,
    textAlign: 'center',
    marginBottom: SIZES.large,
  },
  amount: {
    fontFamily: FONT.bold,
    fontSize: 48,
    color: COLORS.text,
    marginBottom: SIZES.medium,
  },
  comparisonContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SIZES.large,
  },
  comparisonText: {
    fontFamily: FONT.medium,
    fontSize: SIZES.medium,
    marginLeft: SIZES.small,
  },
  goalsContainer: {
    width: '100%',
    marginTop: SIZES.large,
  },
  goalItem: {
    marginBottom: SIZES.medium,
  },
  goalTitle: {
    fontFamily: FONT.medium,
    fontSize: SIZES.medium,
    color: COLORS.text,
    marginBottom: SIZES.small,
  },
  progressContainer: {
    flexDirection: 'row',
    alignItems: 'center',
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
  categoryItem: {
    width: '100%',
    marginBottom: SIZES.medium,
  },
  categoryHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SIZES.small,
  },
  categoryRank: {
    fontFamily: FONT.bold,
    fontSize: SIZES.medium,
    color: COLORS.primary,
    marginRight: SIZES.medium,
  },
  categoryName: {
    flex: 1,
    fontFamily: FONT.medium,
    fontSize: SIZES.medium,
    color: COLORS.text,
  },
  categoryAmount: {
    fontFamily: FONT.medium,
    fontSize: SIZES.medium,
    color: COLORS.text,
  },
  categoryProgressContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  categoryProgressBackground: {
    flex: 1,
    height: 8,
    backgroundColor: COLORS.gray200,
    borderRadius: 4,
    marginRight: SIZES.small,
    overflow: 'hidden',
  },
  categoryProgressFill: {
    height: '100%',
    backgroundColor: COLORS.primary,
    borderRadius: 4,
  },
  categoryPercentage: {
    fontFamily: FONT.medium,
    fontSize: SIZES.small,
    color: COLORS.gray500,
    minWidth: 40,
  },
  insightCard: {
    width: '100%',
    backgroundColor: COLORS.white,
    borderRadius: SIZES.medium,
    padding: SIZES.large,
    marginBottom: SIZES.medium,
    borderLeftWidth: 4,
    ...SHADOWS.small,
  },
  insightMessage: {
    fontFamily: FONT.medium,
    fontSize: SIZES.medium,
    color: COLORS.text,
    lineHeight: 24,
  },
  reportButton: {
    marginTop: SIZES.large,
  },
  navigation: {
    flexDirection: 'row',
    justifyContent: 'center',
    padding: SIZES.large,
  },
  navButton: {
    backgroundColor: COLORS.primary,
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: SIZES.medium,
    ...SHADOWS.small,
  },
});

export default MonthlyRecapScreen; 