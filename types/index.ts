export interface User {
  id: string;
  email: string;
  fullName: string;
  profileImage?: string;
  createdAt: Date;
}

export interface SavingsGoal {
  id: string;
  userId: string;
  title: string;
  targetAmount: number;
  currentAmount: number;
  deadline: Date;
  category: string;
  createdAt: Date;
}

export interface Investment {
  id: string;
  userId: string;
  type: 'stocks' | 'bonds' | 'crypto' | 'mutual_funds';
  amount: number;
  returnRate: number;
  startDate: Date;
  status: 'active' | 'pending' | 'completed';
}

export interface SchoolPayment {
  id: string;
  userId: string;
  semester: string;
  totalAmount: number;
  paidAmount: number;
  dueDate: Date;
  installments: PaymentInstallment[];
  status: 'pending' | 'partial' | 'completed';
}

export interface PaymentInstallment {
  id: string;
  amount: number;
  dueDate: Date;
  status: 'pending' | 'paid';
}

export interface Transaction {
  id: string;
  userId: string;
  type: 'income' | 'expense';
  category: string;
  amount: number;
  description: string;
  date: Date;
}

export interface FinancialInsight {
  id: string;
  userId: string;
  type: 'saving' | 'spending' | 'investment';
  message: string;
  importance: 'low' | 'medium' | 'high';
  createdAt: Date;
}

export interface MonthlyRecap {
  month: number;
  year: number;
  totalSpent: number;
  totalSaved: number;
  topCategories: {
    category: string;
    amount: number;
  }[];
  savingsProgress: {
    goalId: string;
    progress: number;
  }[];
  insights: FinancialInsight[];
} 