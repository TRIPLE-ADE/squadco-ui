import { useCallback, useState } from "react"
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, Modal, RefreshControl } from "react-native"
import { SafeAreaView } from "react-native-safe-area-context"
import Animated, { FadeInDown } from "react-native-reanimated"
import { PieChart } from "react-native-chart-kit"
import { Dimensions } from "react-native"
import { COLORS, FONT } from "../../../constants/theme"
import AnimatedIcon from "@/components/animations/AnimatedIcon"

const { width } = Dimensions.get("window")

interface SavingsGoal {
  id: string;
  title: string;
  currentAmount: number;
  targetAmount: number;
  color: string;
}

export default function SavingsScreen() {
  const [savingsGoals, setSavingsGoals] = useState<SavingsGoal[]>([
    {
      id: "1",
      title: "Laptop Fund",
      currentAmount: 850,
      targetAmount: 1200,
      color: "#515CE6",
    },
    {
      id: "2",
      title: "Emergency Fund",
      currentAmount: 1200,
      targetAmount: 3000,
      color: "#FF8A65",
    },
    {
      id: "3",
      title: "Spring Break Trip",
      currentAmount: 400,
      targetAmount: 800,
      color: "#4CAF50",
    },
  ])

  const [modalVisible, setModalVisible] = useState(false)
  const [editingGoal, setEditingGoal] = useState<SavingsGoal | null>(null)
  const [goalTitle, setGoalTitle] = useState("")
  const [goalAmount, setGoalAmount] = useState("")
  const [refreshing, setRefreshing] = useState(false);
  const [loading, setLoading] = useState(false);

  const totalSaved = savingsGoals.reduce((sum, goal) => sum + goal.currentAmount, 0)
  const totalTarget = savingsGoals.reduce((sum, goal) => sum + goal.targetAmount, 0)

  const chartData = savingsGoals.map((goal) => {
    return {
      name: goal.title,
      amount: goal.currentAmount,
      color: goal.color,
      legendFontColor: "#7F7F7F",
      legendFontSize: 12,
    }
  })

  const handleAddGoal = () => {
    setEditingGoal(null)
    setGoalTitle("")
    setGoalAmount("")
    setModalVisible(true)
  }

  const handleEditGoal = (goal: SavingsGoal) => {
    setEditingGoal(goal)
    setGoalTitle(goal.title)
    setGoalAmount(goal.targetAmount.toString())
    setModalVisible(true)
  }

  const handleDeleteGoal = (goalId: string) => {
    setSavingsGoals(savingsGoals.filter((goal) => goal.id !== goalId))
  }

  const handleSaveGoal = () => {
    if (!goalTitle || !goalAmount) return

    if (editingGoal) {
      setSavingsGoals(
        savingsGoals.map((goal) =>
          goal.id === editingGoal.id
            ? {
                ...goal,
                title: goalTitle,
                targetAmount: Number.parseFloat(goalAmount),
              }
            : goal,
        ),
      )
    } else {
      const newGoal = {
        id: Date.now().toString(),
        title: goalTitle,
        currentAmount: 0,
        targetAmount: Number.parseFloat(goalAmount),
        color: `#${Math.floor(Math.random() * 16777215).toString(16)}`,
      }
      setSavingsGoals([...savingsGoals, newGoal])
    }

    setModalVisible(false)
  }

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    // TODO: Implement actual refresh logic
    await new Promise(resolve => setTimeout(resolve, 1500));
    setRefreshing(false);
  }, []);

  

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}
       refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={onRefresh}
          tintColor={COLORS.primary}
          colors={[COLORS.primary]}
          progressBackgroundColor={COLORS.white}
        />
      }>
        <View style={styles.header}>
          <Text style={styles.title}>Savings Goals</Text>
          <TouchableOpacity style={styles.addButton} onPress={handleAddGoal}>
            <AnimatedIcon name="add" size={24} color={COLORS.white} />
          </TouchableOpacity>
        </View>

        <Animated.View entering={FadeInDown.delay(200).duration(500)} style={styles.summaryCard}>
          <Text style={styles.summaryTitle}>Total Savings</Text>
          <Text style={styles.summaryAmount}>${totalSaved.toFixed(2)}</Text>
          <View style={styles.progressBarContainer}>
            <View style={[styles.progressBar, { width: `${Math.min((totalSaved / totalTarget) * 100, 100)}%` }]} />
          </View>
          <Text style={styles.summarySubtitle}>
            ${totalSaved.toFixed(2)} of ${totalTarget.toFixed(2)} saved
          </Text>
        </Animated.View>

        <Animated.View entering={FadeInDown.delay(300).duration(500)} style={styles.chartCard}>
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

        <Animated.View entering={FadeInDown.delay(400).duration(500)} style={styles.goalsContainer}>
          <Text style={styles.sectionTitle}>Your Goals</Text>

          {savingsGoals.map((goal) => (
            <View key={goal.id} style={styles.goalCard}>
              <View style={styles.goalHeader}>
                <Text style={styles.goalTitle}>{goal.title}</Text>
                <View style={styles.goalActions}>
                  <TouchableOpacity style={styles.actionButton} onPress={() => handleEditGoal(goal)}>
                    <AnimatedIcon name="create-outline" size={16} color={COLORS.gray500} />
                  </TouchableOpacity>
                </View>
              </View>

              <View style={styles.goalAmounts}>
                <Text style={styles.goalCurrentAmount}>${goal.currentAmount.toFixed(2)}</Text>
                <Text style={styles.goalTargetAmount}>of ${goal.targetAmount.toFixed(2)}</Text>
              </View>

              <View style={styles.goalProgressContainer}>
                <View
                  style={[
                    styles.goalProgress,
                    {
                      width: `${Math.min((goal.currentAmount / goal.targetAmount) * 100, 100)}%`,
                      backgroundColor: goal.color,
                    },
                  ]}
                />
              </View>

              <View style={styles.goalFooter}>
                <Text style={styles.goalPercentage}>{Math.round((goal.currentAmount / goal.targetAmount) * 100)}%</Text>
                <TouchableOpacity style={styles.addFundsButton}>
                  <Text style={styles.addFundsText}>Add Funds</Text>
                </TouchableOpacity>
              </View>
            </View>
          ))}
        </Animated.View>

        <Modal
          animationType="slide"
          transparent={true}
          visible={modalVisible}
          onRequestClose={() => setModalVisible(false)}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>{editingGoal ? "Edit Savings Goal" : "Add New Savings Goal"}</Text>

              <View style={styles.inputContainer}>
                <Text style={styles.inputLabel}>Goal Name</Text>
                <TextInput
                  style={styles.input}
                  placeholder="e.g., New Laptop"
                  value={goalTitle}
                  onChangeText={setGoalTitle}
                />
              </View>

              <View style={styles.inputContainer}>
                <Text style={styles.inputLabel}>Target Amount ($)</Text>
                <TextInput
                  style={styles.input}
                  placeholder="e.g., 1000"
                  keyboardType="numeric"
                  value={goalAmount}
                  onChangeText={setGoalAmount}
                />
              </View>

              <View style={styles.modalActions}>
                <TouchableOpacity
                  style={[styles.modalButton, styles.cancelButton]}
                  onPress={() => setModalVisible(false)}
                >
                  <Text style={styles.cancelButtonText}>Cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity style={[styles.modalButton, styles.saveButton]} onPress={handleSaveGoal}>
                  <Text style={styles.saveButtonText}>Save</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>
      </ScrollView>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 10,
  },
  title: {
    fontFamily: FONT.bold,
    fontSize: 24,
    color: COLORS.black,
  },
  addButton: {
    backgroundColor: COLORS.primary,
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  summaryCard: {
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
  summaryTitle: {
    fontFamily: FONT.medium,
    fontSize: 16,
    color: COLORS.gray500,
    marginBottom: 8,
  },
  summaryAmount: {
    fontFamily: FONT.bold,
    fontSize: 32,
    color: COLORS.black,
    marginBottom: 16,
  },
  progressBarContainer: {
    height: 8,
    backgroundColor: COLORS.gray200,
    borderRadius: 4,
    marginBottom: 8,
  },
  progressBar: {
    height: 8,
    backgroundColor: COLORS.primary,
    borderRadius: 4,
  },
  summarySubtitle: {
    fontFamily: FONT.regular,
    fontSize: 14,
    color: COLORS.gray500,
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
    alignItems: "center",
  },
  goalsContainer: {
    padding: 20,
    marginBottom: 20,
  },
  sectionTitle: {
    fontFamily: FONT.bold,
    fontSize: 18,
    color: COLORS.black,
    marginBottom: 16,
  },
  goalCard: {
    backgroundColor: COLORS.white,
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    shadowColor: COLORS.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  goalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  goalTitle: {
    fontFamily: FONT.medium,
    fontSize: 16,
    color: COLORS.black,
  },
  goalActions: {
    flexDirection: "row",
  },
  actionButton: {
    padding: 4,
    marginLeft: 8,
  },
  goalAmounts: {
    flexDirection: "row",
    alignItems: "baseline",
    marginBottom: 8,
  },
  goalCurrentAmount: {
    fontFamily: FONT.bold,
    fontSize: 20,
    color: COLORS.black,
  },
  goalTargetAmount: {
    fontFamily: FONT.regular,
    fontSize: 14,
    color: COLORS.gray500,
    marginLeft: 4,
  },
  goalProgressContainer: {
    height: 8,
    backgroundColor: COLORS.gray200,
    borderRadius: 4,
    marginBottom: 8,
  },
  goalProgress: {
    height: 8,
    borderRadius: 4,
  },
  goalFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  goalPercentage: {
    fontFamily: FONT.medium,
    fontSize: 14,
    color: COLORS.black,
  },
  addFundsButton: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  addFundsText: {
    fontFamily: FONT.medium,
    fontSize: 12,
    color: COLORS.white,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    backgroundColor: COLORS.white,
    borderRadius: 16,
    padding: 20,
    width: width - 40,
  },
  modalTitle: {
    fontFamily: FONT.bold,
    fontSize: 18,
    color: COLORS.black,
    marginBottom: 20,
    textAlign: "center",
  },
  inputContainer: {
    marginBottom: 16,
  },
  inputLabel: {
    fontFamily: FONT.medium,
    fontSize: 14,
    color: COLORS.black,
    marginBottom: 8,
  },
  input: {
    height: 50,
    borderWidth: 1,
    borderColor: COLORS.gray200,
    borderRadius: 8,
    paddingHorizontal: 16,
    fontSize: 16,
    fontFamily: FONT.regular,
  },
  modalActions: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 20,
  },
  modalButton: {
    flex: 1,
    height: 50,
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
  },
  cancelButton: {
    backgroundColor: COLORS.gray200,
    marginRight: 8,
  },
  cancelButtonText: {
    fontFamily: FONT.medium,
    fontSize: 16,
    color: COLORS.black,
  },
  saveButton: {
    backgroundColor: COLORS.primary,
    marginLeft: 8,
  },
  saveButtonText: {
    fontFamily: FONT.medium,
    fontSize: 16,
    color: COLORS.white,
  },
})

