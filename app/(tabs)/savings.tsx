import { useCallback, useState } from "react";
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Alert,
  RefreshControl,
} from "react-native";
import { useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { Ionicons } from "@expo/vector-icons";
import Animated, { FadeInDown } from "react-native-reanimated";
import { PieChart, ProgressChart } from "react-native-chart-kit";
import { Dimensions } from "react-native";
import { COLORS, FONT, SIZES } from "@/constants/theme";

const { width } = Dimensions.get("window");

export default function Savings() {
  const router = useRouter();
  const [goalName, setGoalName] = useState("");
  const [goalAmount, setGoalAmount] = useState("");
  const [goalDate, setGoalDate] = useState("");
  const [refreshing, setRefreshing] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState("all");
  const [savingsGoals, setSavingsGoals] = useState([
    {
      id: "1",
      name: "Laptop Fund",
      currentAmount: 750,
      targetAmount: 1000,
      deadline: "2025-12-31",
      progress: 0.75,
    },
    {
      id: "2",
      name: "Spring Break Trip",
      currentAmount: 300,
      targetAmount: 600,
      deadline: "2025-03-15",
      progress: 0.5,
    },
    {
      id: "3",
      name: "Emergency Fund",
      currentAmount: 450,
      targetAmount: 1500,
      deadline: "2025-06-10",
      progress: 0.3,
    },
    {
      id: "4",
      name: "Vacation Fund",
      currentAmount: 2000,
      targetAmount: 2000,
      deadline: "2025-09-15",
      progress: 1,
    },
  ]);

  const totalSaved = savingsGoals.reduce(
    (sum, goal) => sum + goal.currentAmount,
    0
  );
  const totalTarget = savingsGoals.reduce(
    (sum, goal) => sum + goal.targetAmount,
    0
  );
  const daysLeft = savingsGoals.map((goal) =>
    Math.ceil(
      (new Date(goal.deadline).getTime() - new Date().getTime()) /
        (1000 * 60 * 60 * 24)
    )
  );

  const filteredGoals = savingsGoals.filter((goal) => {
    if (selectedFilter === "completed") {
      return goal.currentAmount >= goal.targetAmount;
    }
    if (selectedFilter === "active") {
      return goal.currentAmount < goal.targetAmount;
    }
    return true; 
  });

  const chartConfig = {
    backgroundGradientFrom: "#fff",
    backgroundGradientTo: "#fff",
    color: (opacity = 1) => `rgba(91, 55, 183, ${opacity})`,
    strokeWidth: 2,
    barPercentage: 0.5,
    useShadowColorFromDataset: false,
  };

  const handleAddGoal = () => {
    if (!goalName || !goalAmount || !goalDate) {
      Alert.alert("Error", "Please fill in all fields");
      return;
    }

    const newGoal = {
      id: Date.now().toString(),
      name: goalName,
      currentAmount: 0,
      targetAmount: Number.parseFloat(goalAmount),
      deadline: goalDate,
      progress: 0,
    };

    setSavingsGoals([...savingsGoals, newGoal]);
    setGoalName("");
    setGoalAmount("");
    setGoalDate("");
  };

  const colors = [
    "#FF6384",
    "#36A2EB",
    "#FFCE56",
    "#4BC0C0",
    "#9966FF",
    "#FF9F40",
  ];

  const chartData = filteredGoals.map((goal, index) => {
    return {
      name: goal.name,
      amount: goal.currentAmount,
      color: colors[index % colors.length],
      legendFontColor: "#7F7F7F",
      legendFontSize: 12,
    };
  });

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await new Promise((resolve) => setTimeout(resolve, 1500));
    setRefreshing(false);
  }, []);

  return (
    <View style={styles.container}>
      <StatusBar style="dark" />
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Savings Goals</Text>
        <TouchableOpacity
          style={styles.addButton}
          onPress={() => router.push('/(stacks)/savings/new')}
          accessibilityLabel="Add Savings Goal"
          accessibilityHint="Opens a form to add a new savings goal"
        >
          <Ionicons name="add" size={24} color={COLORS.white} />
        </TouchableOpacity>
      </View>

      <View style={styles.filters}>
        {["all", "active", "completed"].map((filter) => (
          <TouchableOpacity
            key={filter}
            style={[
              styles.filterButton,
              selectedFilter === filter && styles.filterButtonActive,
            ]}
            onPress={() => setSelectedFilter(filter)}
          >
            <Text
              style={[
                styles.filterText,
                selectedFilter === filter && styles.filterTextActive,
              ]}
            >
              {filter.charAt(0).toUpperCase() + filter.slice(1)} Goals
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={COLORS.primary}
            colors={[COLORS.primary]}
            progressBackgroundColor={COLORS.white}
          />
        }
      >
        <Animated.View
          entering={FadeInDown.delay(100).duration(500)}
          style={styles.overviewCard}
        >
          <Text style={styles.overviewTitle}>Total Savings</Text>
          <Text style={styles.overviewAmount}>N{totalSaved.toFixed(2)}</Text>
          <View style={styles.overviewDetails}>
            <View style={styles.overviewItem}>
              <Text style={styles.overviewItemLabel}>Goals</Text>
              <Text style={styles.overviewItemValue}>
                {filteredGoals.length}
              </Text>
            </View>
            <View style={styles.overviewItem}>
              <Text style={styles.overviewItemLabel}>Avg. Progress</Text>
              <Text style={styles.overviewItemValue}>
                {Math.round(
                  (filteredGoals.reduce((acc, goal) => acc + goal.progress, 0) /
                    filteredGoals.length) *
                    100
                )}
                %
              </Text>
            </View>
          </View>
          <View style={styles.progressBarContainer}>
            <View
              style={[
                styles.progressBar,
                styles.overviewProgressBar,
                {
                  width: `${Math.min((totalSaved / totalTarget) * 100, 100)}%`,
                },
              ]}
            />
          </View>
          <Text style={styles.summarySubtitle}>
            ${totalSaved.toFixed(2)} of ${totalTarget.toFixed(2)} saved
          </Text>
        </Animated.View>

        <Animated.View
          entering={FadeInDown.delay(300).duration(500)}
          style={styles.chartCard}
        >
          <Text style={styles.chartTitle}>Savings Breakdown</Text>
          <View style={styles.chartContainer}>
            <PieChart
              data={chartData}
              width={width - 60}
              height={200}
              chartConfig={{
                color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
              }}
              accessor="amount"
              backgroundColor="transparent"
              paddingLeft="15"
              absolute
            />
          </View>
        </Animated.View>

        <View style={styles.goalsSection}>
          <Text style={styles.sectionTitle}>Your Goals</Text>
          {filteredGoals.map((goal, index) => (
            <Animated.View
              key={goal.id}
              entering={FadeInDown.delay(200 + index * 100).duration(500)}
              style={styles.goalCard}
            >
              <View style={styles.goalHeader}>
                <Text style={styles.goalName}>{goal.name}</Text>

                <View style={styles.goalActions}>
                  <TouchableOpacity>
                    <Ionicons
                      name="create-outline"
                      size={16}
                      color={COLORS.gray500}
                    />
                  </TouchableOpacity>
                </View>
              </View>
              <View style={styles.goalProgress}>
                <View style={styles.progressInfo}>
                  <Text style={styles.currentAmount}>
                    ${goal.currentAmount.toFixed(2)}
                  </Text>
                  <Text style={styles.targetAmount}>
                    of ${goal.targetAmount.toFixed(2)}
                  </Text>
                </View>
                <View style={styles.progressBarContainer}>
                  <View
                    style={[
                      styles.progressBar,
                      { width: `${goal.progress * 100}%` },
                    ]}
                  />
                </View>
              </View>
              <View style={styles.goalActions}>
                <View style={styles.chartContainer}>
                  <ProgressChart
                    data={{
                      data: [goal.progress],
                    }}
                    width={80}
                    height={80}
                    strokeWidth={10}
                    radius={30}
                    chartConfig={chartConfig}
                    hideLegend={true}
                  />
                  <Text style={styles.progressPercentage}>
                    {Math.round(goal.progress * 100)}%
                  </Text>
                </View>
                <TouchableOpacity style={styles.addFundsButton}>
                  <Text style={styles.addFundsButtonText}>Add Funds</Text>
                </TouchableOpacity>
              </View>
              <Text style={styles.goalDeadline}>
                Due: {new Intl.DateTimeFormat('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                }).format(new Date(goal.deadline))} - {" "}
                {daysLeft[savingsGoals.findIndex((g) => g.id === goal.id)]} days
                left
              </Text>
              <View style={styles.iconContainer}>
                <Ionicons
                  name="trending-up"
                  size={16}
                  color={goal.progress >= 1 ? COLORS.success : COLORS.primary}
                />
                <Text
                  style={[
                    styles.status,
                    {
                      color:
                        goal.progress >= 1 ? COLORS.success : COLORS.primary,
                    },
                  ]}
                >
                  {goal.progress >= 1 ? "Goal Achieved!" : "On Track"}
                </Text>
              </View>
            </Animated.View>
          ))}
        </View>

        <Animated.View
          entering={FadeInDown.delay(500).duration(500)}
          style={styles.tipsCard}
        >
          <View style={styles.tipsHeader}>
            <Ionicons name="bulb-outline" size={24} color="#5B37B7" />
            <Text style={styles.tipsTitle}>Savings Tips</Text>
          </View>
          <Text style={styles.tipsText}>
            Try the 50/30/20 rule: Allocate 50% of your income to needs, 30% to
            wants, and 20% to savings and debt repayment.
          </Text>
        </Animated.View>
      </ScrollView>
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
  backButton: {
    padding: 5,
  },
  headerTitle: {
    fontFamily: FONT.bold,
    fontSize: 24,
    color: COLORS.black,
    fontWeight: "bold",
  },
  addButton: {
    backgroundColor: COLORS.primary,
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  scrollView: {
    flex: 1,
  },
  overviewCard: {
    backgroundColor: "#5B37B7",
    borderRadius: 20,
    padding: 20,
    margin: 20,
    marginTop: 20,
    marginBottom: 10,
  },
  overviewTitle: {
    fontSize: 16,
    color: "#fff",
    opacity: 0.8,
    marginBottom: 10,
  },
  overviewAmount: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#fff",
    marginBottom: 15,
  },
  overviewDetails: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 10,
  },
  overviewItem: {
    alignItems: "center",
  },
  overviewItemLabel: {
    fontSize: 14,
    color: "#fff",
    opacity: 0.8,
    marginBottom: 5,
  },
  overviewItemValue: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#fff",
  },
  goalsSection: {
    padding: 20,
    paddingTop: 10,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 15,
  },
  goalCard: {
    backgroundColor: "#fff",
    borderRadius: 15,
    padding: 15,
    marginBottom: 15,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  goalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 15,
  },
  goalName: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
  },
  goalDeadline: {
    fontSize: 14,
    color: "#666",
  },
  iconContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  status: {
    fontFamily: FONT.medium,
    fontSize: SIZES.small,
    marginLeft: SIZES.small,
  },
  goalProgress: {
    marginBottom: 15,
  },
  progressInfo: {
    flexDirection: "row",
    alignItems: "baseline",
    marginBottom: 8,
  },
  currentAmount: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
  },
  targetAmount: {
    fontSize: 14,
    color: "#666",
    marginLeft: 5,
  },
  progressBarContainer: {
    height: 10,
    backgroundColor: "#E0E0E0",
    borderRadius: 5,
  },
  progressBar: {
    height: 10,
    backgroundColor: "#5B37B7",
    borderRadius: 5,
  },
  overviewProgressBar: {
    backgroundColor: "#7D5FFF",
  },
  summarySubtitle: {
    marginTop: 10,
    fontFamily: FONT.regular,
    fontSize: 14,
    color: COLORS.white,
  },
  goalActions: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  chartCard: {
    backgroundColor: COLORS.white,
    borderRadius: 16,
    padding: 20,
    marginHorizontal: 20,
    marginTop: 20,
    shadowColor: COLORS.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  chartTitle: {
    fontFamily: FONT.medium,
    fontSize: 16,
    color: COLORS.black,
    marginBottom: 16,
  },
  chartContainer: {
    position: "relative",
    alignItems: "center",
    justifyContent: "center",
  },
  progressPercentage: {
    position: "absolute",
    fontSize: 14,
    fontWeight: "bold",
    color: "#5B37B7",
  },
  addFundsButton: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  addFundsButtonText: {
    fontFamily: FONT.medium,
    fontSize: 12,
    color: COLORS.white,
  },
  detailsButton: {
    backgroundColor: "#F0EBFA",
    borderRadius: 10,
    padding: 12,
    alignItems: "center",
  },
  detailsButtonText: {
    color: "#5B37B7",
    fontSize: 14,
    fontWeight: "bold",
  },
  tipsCard: {
    backgroundColor: "#fff",
    borderRadius: 15,
    padding: 15,
    margin: 20,
    marginTop: 10,
    marginBottom: 30,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  tipsHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  tipsTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
    marginLeft: 10,
  },
  tipsText: {
    fontSize: 14,
    color: "#666",
    lineHeight: 20,
  },
  filters: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: SIZES.medium,
    marginVertical: SIZES.xSmall,
  },
  filterButton: {
    paddingVertical: SIZES.small,
    paddingHorizontal: SIZES.medium,
    borderRadius: SIZES.small,
    marginRight: SIZES.small,
    backgroundColor: COLORS.gray100,
  },
  filterButtonActive: {
    backgroundColor: COLORS.primary,
  },
  filterText: {
    fontFamily: FONT.medium,
    fontSize: SIZES.small,
    color: COLORS.gray500,
  },
  filterTextActive: {
    color: COLORS.white,
  },
});
