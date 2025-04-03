import React, { useState } from "react";
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  RefreshControl,
  Dimensions,
  FlatList,
} from "react-native";
import { useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { useAuth } from "../../context/auth-context";
import { BarChart, LineChart, PieChart } from "react-native-chart-kit";
import Animated, { FadeInDown } from "react-native-reanimated";
import { COLORS, FONT, SHADOWS, SIZES } from "@/constants/theme";
import SavingsGoalCard from "@/components/dashboard/SavingsGoalCard";
import { formatAmount } from "@/utils/helper";

const { width } = Dimensions.get("window");

// Dummy data for demonstration
const DUMMY_SAVINGS_GOALS = [
  {
    id: "2",
    title: "School Fees",
    targetAmount: 250000,
    currentAmount: 100000,
    deadline: new Date("2024-05-15"),
  },
];

export default function Dashboard() {
  const router = useRouter();
  const { user } = useAuth();
  const [refreshing, setRefreshing] = useState(false);
  const [showBalance, setShowBalance] = useState(true);
  const [notificationCount, setNotificationCount] = useState<number>(5);
  const renderTransactionItem = ({
    item,
  }: {
    item: { type: string; title: string; date: string; amount: number };
  }) => (
    <TouchableOpacity
      onPress={() =>
        router.push({
          pathname: "/transaction/details", // Navigate to the details page
          params: {
            type: item.type,
            title: item.title,
            date: item.date,
            amount: item.amount.toString(), // Convert number to string for URL safety
          },
        })
      }
      style={styles.transactionItem}
    >
      <View style={styles.transactionIcon}>
        <Ionicons
          name={
            item.type === "income"
              ? "arrow-down-circle-outline"
              : "arrow-up-circle-outline"
          }
          size={24}
          color={item.type === "income" ? COLORS.success : COLORS.error}
        />
      </View>
      <View style={styles.transactionDetails}>
        <Text style={styles.transactionTitle}>{item.title}</Text>
        <Text style={styles.transactionDate}>{item.date}</Text>
      </View>
      <Text
        style={[
          styles.transactionAmount,
          { color: item.type === "income" ? COLORS.success : COLORS.error },
        ]}
      >
        {item.type === "income" ? "+" : "-"}₦{item.amount}
      </Text>
    </TouchableOpacity>
  );

  const onRefresh = React.useCallback(async () => {
    setRefreshing(true);
    // Simulate data fetching
    await new Promise((resolve) => setTimeout(resolve, 1500));
    setRefreshing(false);
  }, []);

  const navigateTo = (path: any) => {
    router.push(path);
  };

  const toggleBalanceVisibility = () => {
    setShowBalance(!showBalance);
  };

  const expenseData = {
    labels: ["Food", "Transport", "Books", "Rent", "Others"],
    data: [0.2, 0.15, 0.25, 0.3, 0.1],
  };

  const budgetData = {
    labels: ["Food", "Transport", "Books", "Rent", "Others"],
    datasets: [
      {
        data: [300, 250, 400, 500, 200],
      },
    ],
  };

  // Add this sample data for recent transactions
  const recentTransactions = [
    {
      id: "1",
      title: "Salary Deposit",
      amount: 1000,
      type: "income",
      date: "2023-06-01",
    },
    {
      id: "2",
      title: "Grocery Shopping",
      amount: 50.75,
      type: "expense",
      date: "2023-06-02",
    },
    {
      id: "3",
      title: "Book Purchase",
      amount: 29.99,
      type: "expense",
      date: "2023-06-03",
    },
    {
      id: "4",
      title: "Freelance Payment",
      amount: 250,
      type: "income",
      date: "2023-06-04",
    },
    {
      id: "5",
      title: "Coffee Shop",
      amount: 4.5,
      type: "expense",
      date: "2023-06-05",
    },
  ];

  const chartConfig = {
    backgroundGradientFrom: "#fff",
    backgroundGradientTo: "#fff",
    color: (opacity = 1) => `rgba(91, 55, 183, ${opacity})`,
    strokeWidth: 2,
    barPercentage: 0.5,
    useShadowColorFromDataset: false,
    decimalPlaces: 0,
    labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
    style: {
      borderRadius: 16,
    },
    propsForDots: {
      r: "6",
      strokeWidth: "2",
      stroke: "#5B37B7",
    },
  };

  return (
    <View style={styles.container}>
      <StatusBar style="dark" />
      <View style={styles.header}>
        <View>
          <Text style={styles.greeting}>Hello, {user?.user.first_name || "User"}</Text>
          <Text style={styles.date}>
            {new Date().toLocaleDateString("en-US", {
              weekday: "long",
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </Text>
        </View>
        <View style={{ flexDirection: "row", gap: 10, alignItems: "center" }}>
          <TouchableOpacity
            onPress={() => navigateTo("/profile")}
            style={styles.profileIcon}
          >
            <Ionicons name="person-circle-outline" size={40} color="#5B37B7" />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => navigateTo("/notifications")}>
            <View style={styles.notificationIconContainer}>
              <Ionicons
                name="notifications-outline"
                size={30}
                color="#5B37B7"
              />
              {notificationCount > 0 && (
                <View style={styles.badge}>
                  <Text style={styles.badgeText}>{notificationCount}</Text>
                </View>
              )}
            </View>
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        <Animated.View
          entering={FadeInDown.delay(100).duration(500)}
          style={styles.balanceCard}
        >
          <View style={styles.balanceHeader}>
            <Text style={styles.balanceTitle}>Total Balance</Text>
            <TouchableOpacity onPress={toggleBalanceVisibility}>
              <MaterialCommunityIcons
                name={showBalance ? "eye-outline" : "eye-off-outline"}
                size={24}
                color="#fff"
              />
            </TouchableOpacity>
          </View>
          <Text style={styles.balanceAmount}>
            {showBalance ? `₦${formatAmount(String(user?.wallet?.balance ?? 20000))}` : "₦•••••••"}
          </Text>
          <View style={styles.balanceFooter}>
            <View style={styles.balanceChange}>
              <Ionicons name="arrow-up" size={16} color="#4CD964" />
              <Text style={styles.balanceChangeText}>+15% from last month</Text>
            </View>
          </View>
        </Animated.View>

        <Animated.View
          entering={FadeInDown.delay(200).duration(500)}
          style={styles.quickActions}
        >
          <Text style={styles.sectionTitle}>Quick Actions</Text>
          <View style={styles.actionButtons}>
            {/* Deposit */}
            {/* Top Up Wallet */}
            <TouchableOpacity
              style={styles.actionButton}
              onPress={() => navigateTo("/wallet/topup")}
            >
              <View style={[styles.actionIcon, { backgroundColor: "#E1F5FE" }]}>
                <Ionicons name="wallet-outline" size={24} color="#03A9F4" />
              </View>
              <Text style={styles.actionText}>Top Up Wallet</Text>
            </TouchableOpacity>

            {/* Withdraw */}
            <TouchableOpacity
              style={styles.actionButton}
              onPress={() => navigateTo("/wallet/transfer")}
            >
              <View style={[styles.actionIcon, { backgroundColor: "#E8F5E9" }]}>
                <Ionicons name="arrow-down-outline" size={24} color="#4CAF50" />
              </View>
              <Text style={styles.actionText}>Withdraw</Text>
            </TouchableOpacity>

            {/* Pay Fees */}
            <TouchableOpacity
              style={styles.actionButton}
              onPress={() => navigateTo("/payments")}
            >
              <View style={[styles.actionIcon, { backgroundColor: "#FFF3E0" }]}>
                <Ionicons name="card-outline" size={24} color="#FF9800" />
              </View>
              <Text style={styles.actionText}>Pay Fees</Text>
            </TouchableOpacity>

            {/* AI-Powered Smart Budgeting */}
            <TouchableOpacity
              style={styles.actionButton}
              onPress={() => navigateTo("/ai-budgeting")}
            >
              <View style={[styles.actionIcon, { backgroundColor: "#E0F7FA" }]}>
                <Ionicons name="bulb-outline" size={24} color="#00ACC1" />
              </View>
              <Text style={styles.actionText}>Smart Budgeting</Text>
            </TouchableOpacity>
          </View>
          <View style={[styles.actionButtons, { marginTop: SIZES.medium }]}>
            {/* AI Spending Insights (Keeping this one) */}
            <TouchableOpacity
              style={styles.actionButton}
              onPress={() => navigateTo("/insights")}
            >
              <View style={[styles.actionIcon, { backgroundColor: "#F3E5F5" }]}>
                <Ionicons name="analytics-outline" size={24} color="#9C27B0" />
              </View>
              <Text style={styles.actionText}>Insights</Text>
            </TouchableOpacity>
            {/* Instant Savings */}
            <TouchableOpacity
              style={styles.actionButton}
              onPress={() => navigateTo("/savings/instant")}
            >
              <View style={[styles.actionIcon, { backgroundColor: "#F1F8E9" }]}>
                <Ionicons
                  name="trending-up-outline"
                  size={24}
                  color="#689F38"
                />
              </View>
              <Text style={styles.actionText}>Instant Savings</Text>
            </TouchableOpacity>

            {/* Request Money (SquadCo P2P) */}
            <TouchableOpacity
              style={styles.actionButton}
              onPress={() => navigateTo("/request-money")}
            >
              <View style={[styles.actionIcon, { backgroundColor: "#FCE4EC" }]}>
                <Ionicons name="person-add-outline" size={24} color="#D81B60" />
              </View>
              <Text style={styles.actionText}>Request Money</Text>
            </TouchableOpacity>
            {/* Finance Buddy */}
            <TouchableOpacity
              style={styles.actionButton}
              onPress={() => navigateTo("/(stacks)/ai/chat")}
            >
              <View style={[styles.actionIcon, { backgroundColor: "#E8EAF6" }]}>
                <Ionicons
                  name="chatbubbles-outline"
                  size={24}
                  color="#3F51B5"
                />
              </View>
              <Text style={styles.actionText}>Ask AI</Text>
            </TouchableOpacity>
          </View>
        </Animated.View>

        <Animated.View entering={FadeInDown.delay(300).duration(500)}>
          <View
            style={[styles.savingsHeader, { paddingHorizontal: SIZES.large }]}
          >
            <Text style={styles.sectionTitle}>Savings Goals</Text>
            <TouchableOpacity onPress={() => navigateTo("/dashboard/savings")}>
              <Text style={styles.seeAll}>See All</Text>
            </TouchableOpacity>
          </View>
          {DUMMY_SAVINGS_GOALS.map((item) => (
            <View key={item.id} style={styles.savingsGoalWrapper}>
              <SavingsGoalCard
                title={item.title}
                targetAmount={item.targetAmount}
                currentAmount={item.currentAmount}
                deadline={item.deadline}
                onPress={() => navigateTo(`/dashboard/savings/${item.id}`)}
              />
            </View>
          ))}
        </Animated.View>

        <Animated.View
          entering={FadeInDown.delay(400).duration(500)}
          style={styles.chartSection}
        >
          <Text style={styles.sectionTitle}>Savings Growth</Text>
          <View style={styles.chartCard}>
            <LineChart
              data={{
                labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
                datasets: [
                  {
                    data: [200, 350, 500, 650, 800, 950],
                    color: (opacity = 1) => `rgba(91, 55, 183, ${opacity})`,
                    strokeWidth: 2,
                  },
                ],
                legend: ["Savings Growth"],
              }}
              width={width - 40}
              height={220}
              chartConfig={chartConfig}
              bezier
              style={styles.chart}
            />
          </View>
        </Animated.View>

        <Animated.View
          entering={FadeInDown.delay(500).duration(500)}
          style={styles.chartSection}
        >
          <Text style={styles.sectionTitle}>Expense Breakdown</Text>
          <View style={styles.chartCard}>
            <PieChart
              data={expenseData.labels.map((label, index) => ({
                name: label,
                population: expenseData.data[index] * 100,
                color: ["#5B37B7", "#FF9800", "#4CAF50", "#2196F3", "#9C27B0"][
                  index
                ],
                legendFontColor: "#7F7F7F",
                legendFontSize: 12,
              }))}
              width={width - 40}
              height={220}
              chartConfig={chartConfig}
              accessor="population"
              backgroundColor="transparent"
              paddingLeft="15"
              absolute
            />
          </View>
        </Animated.View>

        <Animated.View
          entering={FadeInDown.delay(600).duration(500)}
          style={styles.chartSection}
        >
          <Text style={styles.sectionTitle}>Monthly Budget</Text>
          <View style={styles.chartCard}>
            <BarChart
              data={budgetData}
              width={width - 40}
              height={220}
              chartConfig={chartConfig}
              style={styles.chart}
              verticalLabelRotation={0}
              yAxisLabel="₦"
              yAxisSuffix=""
            />
          </View>
        </Animated.View>

        <Animated.View
          entering={FadeInDown.delay(700).duration(500)}
          style={styles.aiInsightSection}
        >
          <Text style={styles.sectionTitle}>AI Financial Insights</Text>
          <View style={styles.insightCard}>
            <View style={styles.insightHeader}>
              <Ionicons name="bulb-outline" size={24} color="#5B37B7" />
              <Text style={styles.insightTitle}>Smart Tip</Text>
            </View>
            <Text style={styles.insightText}>
              By saving ₦1000 every day, you can save ₦365,000 in a year.
              This is a great way to save money and achieve your financial goals.
            </Text>
            <TouchableOpacity style={styles.insightButton}>
              <Text style={styles.insightButtonText}>See More Insights</Text>
            </TouchableOpacity>
          </View>
        </Animated.View>

        <Animated.View
          entering={FadeInDown.delay(800).duration(500)}
          style={styles.transactionSection}
        >
          <View
            style={[styles.savingsHeader, { paddingHorizontal: SIZES.large }]}
          >
            <Text style={styles.sectionTitle}>Recent Transactions</Text>
            <TouchableOpacity
              onPress={() => navigateTo("/dashboard/transactions")}
            >
              <Text style={styles.seeAll}>See All</Text>
            </TouchableOpacity>
          </View>
          <FlatList
            data={recentTransactions}
            renderItem={renderTransactionItem}
            keyExtractor={(item) => item.id}
            showsVerticalScrollIndicator={false}
            scrollEnabled={false}
            ListEmptyComponent={
              <Text style={styles.emptyTransactionsText}>
                No recent transactions
              </Text>
            }
          />
        </Animated.View>
        {/* Monthly Recap Card */}
        <TouchableOpacity
          style={styles.recapCard}
          onPress={() => navigateTo("/dashboard/monthly-recap")}
        >
          <View style={styles.recapContent}>
            <Ionicons name="stats-chart" size={32} color={COLORS.primary} />
            <View style={styles.recapText}>
              <Text style={styles.recapTitle}>Monthly Recap</Text>
              <Text style={styles.recapSubtitle}>
                View your financial summary for March
              </Text>
            </View>
          </View>
          <Ionicons name="chevron-forward" size={24} color={COLORS.gray500} />
        </TouchableOpacity>
      </ScrollView>
      {/* FAB for adding new savings goal */}
      <TouchableOpacity
        style={styles.fab}
        onPress={() => router.push("/savings/new")}
      >
        <Ionicons name="add" size={24} color={COLORS.white} />
      </TouchableOpacity>
    </View>
  );
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
  greeting: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#333",
  },
  date: {
    fontSize: 14,
    color: "#666",
    marginTop: 5,
  },
  profileIcon: {
    padding: 5,
  },
  scrollView: {
    flex: 1,
  },
  balanceCard: {
    backgroundColor: "#5B37B7",
    borderRadius: 20,
    padding: 20,
    margin: 20,
    marginTop: 20,
    marginBottom: 10,
  },
  balanceHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },
  balanceTitle: {
    fontSize: 16,
    color: "#fff",
    opacity: 0.8,
  },
  balanceAmount: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#fff",
    marginBottom: 10,
  },
  balanceFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  balanceChange: {
    flexDirection: "row",
    alignItems: "center",
  },
  balanceChangeText: {
    fontSize: 14,
    color: "#fff",
    marginLeft: 5,
  },
  quickActions: {
    padding: SIZES.large,
    paddingTop: 10,
    paddingBottom: SIZES.xLarge,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 15,
  },
  actionButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  actionButton: {
    alignItems: "center",
    width: "22%",
  },
  actionIcon: {
    width: 50,
    height: 50,
    borderRadius: 15,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 8,
  },
  actionText: {
    fontSize: 12,
    color: "#333",
  },
  savingsHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  seeAll: {
    fontFamily: FONT.medium,
    fontSize: SIZES.medium,
    color: COLORS.primary,
  },
  chartSection: {
    padding: 20,
    paddingTop: 10,
    paddingBottom: 10,
  },
  chartCard: {
    backgroundColor: "#fff",
    borderRadius: 15,
    padding: 15,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  chart: {
    marginVertical: 8,
    borderRadius: 16,
  },
  aiInsightSection: {
    padding: 20,
    paddingTop: 10,
    paddingBottom: 20,
  },
  insightCard: {
    backgroundColor: "#fff",
    borderRadius: 15,
    padding: 15,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  insightHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  insightTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
    marginLeft: 10,
  },
  insightText: {
    fontSize: 14,
    color: "#666",
    lineHeight: 20,
    marginBottom: 15,
  },
  insightButton: {
    backgroundColor: "#F0EBFA",
    borderRadius: 10,
    padding: 12,
    alignItems: "center",
  },
  insightButtonText: {
    color: "#5B37B7",
    fontSize: 14,
    fontWeight: "bold",
  },
  recapCard: {
    backgroundColor: COLORS.white,
    borderRadius: SIZES.medium,
    padding: SIZES.large,
    marginHorizontal: SIZES.medium,
    marginVertical: SIZES.small,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    ...SHADOWS.medium,
  },
  recapContent: {
    flexDirection: "row",
    alignItems: "center",
  },
  recapText: {
    marginLeft: SIZES.medium,
  },
  recapTitle: {
    fontFamily: FONT.bold,
    fontSize: SIZES.medium,
    color: COLORS.text,
    marginBottom: 4,
  },
  recapSubtitle: {
    fontFamily: FONT.regular,
    fontSize: SIZES.small,
    color: COLORS.gray500,
  },
  fab: {
    position: "absolute",
    right: SIZES.large,
    bottom: SIZES.large,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: COLORS.primary,
    alignItems: "center",
    justifyContent: "center",
    ...SHADOWS.medium,
  },
  savingsGoalWrapper: {
    marginTop: SIZES.small,
  },
  notificationIconContainer: {
    position: "relative",
    marginRight: 20,
  },
  badge: {
    position: "absolute",
    right: -10,
    top: -5,
    backgroundColor: "red",
    borderRadius: 10,
    width: 20,
    height: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  badgeText: {
    color: "white",
    fontSize: 12,
    fontWeight: "bold",
  },
  transactionSection: {
    padding: SIZES.large,
    paddingTop: 10,
    paddingBottom: 10,
  },
  transactionItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: SIZES.small,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.gray200,
  },
  transactionIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: COLORS.gray100,
    justifyContent: "center",
    alignItems: "center",
    marginRight: SIZES.small,
  },
  transactionDetails: {
    flex: 1,
  },
  transactionTitle: {
    fontSize: SIZES.medium,
    fontWeight: "bold",
    color: COLORS.text,
  },
  transactionDate: {
    fontSize: SIZES.small,
    color: COLORS.gray500,
  },
  transactionAmount: {
    fontSize: SIZES.medium,
    fontWeight: "bold",
  },
  viewAllButton: {
    marginTop: SIZES.medium,
    padding: SIZES.small,
    backgroundColor: COLORS.primary,
    borderRadius: SIZES.small,
    alignItems: "center",
  },
  viewAllButtonText: {
    color: COLORS.primary,
    fontWeight: "bold",
  },
  emptyTransactionsText: {
    textAlign: "center",
    color: COLORS.gray500,
    marginVertical: SIZES.medium,
  },
});
