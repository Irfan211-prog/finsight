import { useEffect, useMemo, useState } from "react";
import type { ChangeEvent, FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import {
  BadgeIndianRupee,
  BrainCircuit,
  CalendarDays,
  Filter,
  LogOut,
  PieChart,
  Plus,
  Trash2,
  TrendingDown,
  TrendingUp,
  WalletCards,
} from "lucide-react";
import {
  Bar,
  BarChart as RechartsBarChart,
  CartesianGrid,
  Cell,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { onAuthStateChanged, signOut } from "firebase/auth";
import type { User } from "firebase/auth";
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  query,
  serverTimestamp,
  where,
} from "firebase/firestore";
import { auth, db } from "../services/firebase";
import "../styles/dashboard.css";

type TransactionType = "income" | "expense";

type TransactionForm = {
  amount: string;
  category: string;
  type: TransactionType | "";
  date: string;
  note: string;
};

type Transaction = {
  id: string;
  userId: string;
  amount: number;
  category: string;
  type: TransactionType;
  date: string;
  note?: string;
};

type ChartItem = {
  category: string;
  amount: number;
};

type InsightTone = "good" | "warning" | "danger" | "neutral";

type SmartInsight = {
  tag: string;
  title: string;
  message: string;
  tone: InsightTone;
};

const incomeCategories = ["Salary", "Freelance", "Other"];

const expenseCategories = [
  "Food",
  "Travel",
  "Shopping",
  "Bills",
  "Education",
  "Health",
  "Other",
];

const allCategories = Array.from(
  new Set([...expenseCategories, ...incomeCategories])
);

const barColors = [
  "#2563eb",
  "#06b6d4",
  "#16a34a",
  "#f97316",
  "#dc2626",
  "#9333ea",
  "#db2777",
];

function DashboardPage() {
  const navigate = useNavigate();

  const today = new Date().toISOString().split("T")[0];

  const [user, setUser] = useState<User | null>(null);
  const [userName, setUserName] = useState("");
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [formData, setFormData] = useState<TransactionForm>({
    amount: "",
    category: "",
    type: "",
    date: today,
    note: "",
  });

  const [filterCategory, setFilterCategory] = useState("All");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const selectedCategories =
    formData.type === "income"
      ? incomeCategories
      : formData.type === "expense"
      ? expenseCategories
      : [];

  const fetchUserName = async (currentUser: User) => {
    let name = currentUser.displayName || "";

    const userDoc = await getDoc(doc(db, "users", currentUser.uid));

    if (userDoc.exists()) {
      const userData = userDoc.data() as { name?: string };
      name = userData.name || name;
    }

    setUserName(name || "User");
  };

  const fetchTransactions = async (currentUser: User) => {
    const q = query(
      collection(db, "transactions"),
      where("userId", "==", currentUser.uid)
    );

    const snapshot = await getDocs(q);

    const data = snapshot.docs.map((item) => ({
      id: item.id,
      ...item.data(),
    })) as Transaction[];

    const sortedData = data.sort((a, b) => b.date.localeCompare(a.date));

    setTransactions(sortedData);
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (!currentUser) {
        navigate("/login");
        return;
      }

      setUser(currentUser);

      try {
        await fetchUserName(currentUser);
        await fetchTransactions(currentUser);
      } finally {
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, [navigate]);

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;

    if (name === "type") {
      setFormData((prev) => ({
        ...prev,
        type: value as TransactionType | "",
        category: "",
      }));

      return;
    }

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleAddTransaction = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!user) return;

    const amount = Number(formData.amount);

    if (!amount || amount <= 0) {
      alert("Please enter a valid amount.");
      return;
    }

    if (!formData.type) {
      alert("Please select transaction type.");
      return;
    }

    if (!formData.category) {
      alert("Please select category.");
      return;
    }

    try {
      setSaving(true);

      await addDoc(collection(db, "transactions"), {
        userId: user.uid,
        amount,
        category: formData.category,
        type: formData.type as TransactionType,
        date: formData.date,
        note: formData.note.trim(),
        createdAt: serverTimestamp(),
      });

      setFormData({
        amount: "",
        category: "",
        type: "",
        date: today,
        note: "",
      });

      await fetchTransactions(user);
    } catch {
      alert("Unable to add transaction. Please check Firebase rules.");
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteTransaction = async (transactionId: string) => {
    if (!user) return;

    const confirmDelete = window.confirm(
      "Are you sure you want to delete this transaction?"
    );

    if (!confirmDelete) return;

    try {
      await deleteDoc(doc(db, "transactions", transactionId));
      await fetchTransactions(user);
    } catch {
      alert("Unable to delete transaction.");
    }
  };

  const handleLogout = async () => {
    await signOut(auth);
    navigate("/login");
  };

  const filteredTransactions = useMemo(() => {
    return transactions.filter((transaction) => {
      const categoryMatch =
        filterCategory === "All" || transaction.category === filterCategory;

      const startMatch = !startDate || transaction.date >= startDate;
      const endMatch = !endDate || transaction.date <= endDate;

      return categoryMatch && startMatch && endMatch;
    });
  }, [transactions, filterCategory, startDate, endDate]);

  const summary = useMemo(() => {
    const totalIncome = transactions
      .filter((item) => item.type === "income")
      .reduce((sum, item) => sum + item.amount, 0);

    const totalExpense = transactions
      .filter((item) => item.type === "expense")
      .reduce((sum, item) => sum + item.amount, 0);

    const netBalance = totalIncome - totalExpense;

    const spendingByCategory: Record<string, number> = {};

    transactions
      .filter((item) => item.type === "expense")
      .forEach((item) => {
        spendingByCategory[item.category] =
          (spendingByCategory[item.category] || 0) + item.amount;
      });

    const topCategory =
      Object.entries(spendingByCategory).sort((a, b) => b[1] - a[1])[0]?.[0] ||
      "No expenses yet";

    return {
      totalIncome,
      totalExpense,
      netBalance,
      topCategory,
      spendingByCategory,
    };
  }, [transactions]);

  const chartData: ChartItem[] = Object.entries(summary.spendingByCategory)
    .map(([category, amount]) => ({
      category,
      amount,
    }))
    .sort((a, b) => b.amount - a.amount);

  const insight = useMemo<SmartInsight>(() => {
    const totalIncome = summary.totalIncome;
    const totalExpense = summary.totalExpense;
    const netBalance = summary.netBalance;

    const expenseTransactions = transactions.filter(
      (item) => item.type === "expense"
    );

    if (transactions.length === 0) {
      return {
        tag: "Getting Started",
        title: "No money data added yet",
        message:
          "Add your income and expenses first. Then I can show useful alerts about saving, spending, and risky categories.",
        tone: "neutral",
      };
    }

    if (totalIncome === 0 && totalExpense > 0) {
      return {
        tag: "Income Missing",
        title: "Expenses are added, but income is missing",
        message:
          "Add your income also. Without income, the dashboard cannot correctly tell whether your spending is safe or risky.",
        tone: "warning",
      };
    }

    if (totalIncome > 0 && totalExpense === 0) {
      return {
        tag: "Great Start",
        title: "Income added with no expenses yet",
        message:
          "Your balance is fully positive right now. Start adding expenses to understand where your money is going.",
        tone: "good",
      };
    }

    if (totalExpense > totalIncome) {
      const extraSpent = totalExpense - totalIncome;

      return {
        tag: "Danger Alert",
        title: "Your expenses crossed your income",
        message: `You spent ₹${extraSpent.toLocaleString(
          "en-IN"
        )} more than your income. First reduce non-essential spending like shopping, travel, or repeated small expenses.`,
        tone: "danger",
      };
    }

    const savingsRate =
      totalIncome > 0 ? Math.round((netBalance / totalIncome) * 100) : 0;

    const expenseRate =
      totalIncome > 0 ? Math.round((totalExpense / totalIncome) * 100) : 0;

    const categoryStats: Record<string, { amount: number; count: number }> = {};

    expenseTransactions.forEach((item) => {
      if (!categoryStats[item.category]) {
        categoryStats[item.category] = {
          amount: 0,
          count: 0,
        };
      }

      categoryStats[item.category].amount += item.amount;
      categoryStats[item.category].count += 1;
    });

    const categoryLimits: Record<
      string,
      {
        limit: number;
        advice: string;
      }
    > = {
      Food: {
        limit: 35,
        advice:
          "Food spending is becoming high. Try reducing outside food or unnecessary snacks.",
      },
      Shopping: {
        limit: 25,
        advice:
          "Shopping is taking a big part of your income. Try delaying non-urgent purchases.",
      },
      Travel: {
        limit: 25,
        advice:
          "Travel cost is high. Check if you can reduce repeated rides or plan cheaper travel.",
      },
      Bills: {
        limit: 40,
        advice:
          "Bills are taking a large part of income. Review subscriptions, electricity, mobile, or internet plans.",
      },
      Education: {
        limit: 35,
        advice:
          "Education spending is high, but it may be useful. Still, track it carefully and avoid unnecessary course purchases.",
      },
      Health: {
        limit: 35,
        advice:
          "Health spending is high. This may be important, but keep a record and plan a separate medical buffer.",
      },
      Other: {
        limit: 20,
        advice:
          "Other expenses are high. Try adding clearer notes so you can understand where this money is going.",
      },
    };

    const categoryWarnings = Object.entries(categoryStats)
      .map(([category, stat]) => {
        const limitInfo = categoryLimits[category] || categoryLimits.Other;

        return {
          category,
          amount: stat.amount,
          count: stat.count,
          incomeShare:
            totalIncome > 0 ? Math.round((stat.amount / totalIncome) * 100) : 0,
          limit: limitInfo.limit,
          advice: limitInfo.advice,
        };
      })
      .filter((item) => item.incomeShare >= item.limit)
      .sort((a, b) => b.incomeShare - a.incomeShare);

    const topCategoryWarning = categoryWarnings[0];

    const biggestExpense = [...expenseTransactions].sort(
      (a, b) => b.amount - a.amount
    )[0];

    const biggestExpenseShare =
      biggestExpense && totalIncome > 0
        ? Math.round((biggestExpense.amount / totalIncome) * 100)
        : 0;

    const repeatedExpense = Object.entries(categoryStats)
      .map(([category, stat]) => ({
        category,
        amount: stat.amount,
        count: stat.count,
        expenseShare:
          totalExpense > 0 ? Math.round((stat.amount / totalExpense) * 100) : 0,
      }))
      .filter((item) => item.count >= 4 && item.expenseShare >= 25)
      .sort((a, b) => b.expenseShare - a.expenseShare)[0];

    if (expenseRate >= 90) {
      return {
        tag: "Income Pressure",
        title: `You spent ${expenseRate}% of your income`,
        message:
          "Your income is covering expenses, but only a very small amount is remaining. Either reduce spending or try to increase income sources.",
        tone: "danger",
      };
    }

    if (expenseRate >= 75) {
      return {
        tag: "Low Saving Alert",
        title: `Only ${savingsRate}% of your income is remaining`,
        message:
          "Your expenses are still below income, but savings are low. Try keeping at least 20% of your income untouched.",
        tone: "warning",
      };
    }

    if (biggestExpenseShare >= 50) {
      return {
        tag: "Large Expense Alert",
        title: `${biggestExpense.category} used ${biggestExpenseShare}% of your income`,
        message: `One expense of ₹${biggestExpense.amount.toLocaleString(
          "en-IN"
        )} is very large compared to your income. Check if it is necessary or one-time spending.`,
        tone: "danger",
      };
    }

    if (topCategoryWarning) {
      const isDanger = topCategoryWarning.incomeShare >= topCategoryWarning.limit + 15;

      return {
        tag: isDanger ? "High Spending Alert" : "Spending Warning",
        title: `${topCategoryWarning.category} is using ${topCategoryWarning.incomeShare}% of your income`,
        message: `You spent ₹${topCategoryWarning.amount.toLocaleString(
          "en-IN"
        )} on ${topCategoryWarning.category}. ${topCategoryWarning.advice}`,
        tone: isDanger ? "danger" : "warning",
      };
    }

    if (repeatedExpense) {
      return {
        tag: "Repeated Spending",
        title: `${repeatedExpense.category} has many small expenses`,
        message: `You added ${repeatedExpense.count} ${repeatedExpense.category} expenses. Small repeated spending can silently reduce savings.`,
        tone: "warning",
      };
    }

    if (savingsRate >= 40) {
      return {
        tag: "Excellent Saving",
        title: `You saved ${savingsRate}% of your income`,
        message:
          "This is a strong saving rate. Keep tracking regularly and avoid unnecessary spending.",
        tone: "good",
      };
    }

    if (savingsRate >= 20) {
      return {
        tag: "Good Balance",
        title: `You saved ${savingsRate}% of your income`,
        message:
          "Your spending is under control. Try slowly improving your savings rate above 30%.",
        tone: "good",
      };
    }

    if (savingsRate >= 10) {
      return {
        tag: "Average Saving",
        title: `You saved ${savingsRate}% of your income`,
        message:
          "Your balance is positive, but savings can improve. Try reducing one unnecessary category this week.",
        tone: "neutral",
      };
    }

    return {
      tag: "Weak Saving",
      title: `Only ${savingsRate}% of income is left`,
      message:
        "Your income is not giving enough breathing space after expenses. Try reducing spending or adding another income source.",
      tone: "warning",
    };
  }, [
    transactions,
    summary.totalIncome,
    summary.totalExpense,
    summary.netBalance,
  ]);

  if (loading) {
    return (
      <main className="dash-page">
        <div className="dash-loading">Loading your dashboard...</div>
      </main>
    );
  }

  return (
    <main className="dash-page">
      <nav className="dash-navbar">
        <div className="dash-brand">
          <span className="dash-brand-mark">
            <BadgeIndianRupee size={24} />
          </span>

          <div>
            <h2>FinSight</h2>
            <p>Hi, {userName}</p>
          </div>
        </div>

        <button className="dash-logout-btn" onClick={handleLogout}>
          <LogOut size={18} />
          Logout
        </button>
      </nav>

      <section className="dash-hero">
        <div>
          <p className="dash-kicker">Personal Finance Dashboard</p>
          <h1>Track, analyze, and improve your spending.</h1>
          <p>
            Add income and expenses, view your balance, filter transactions, and
            get a simple insight from your spending data.
          </p>
        </div>

        <div className="dash-balance-card">
          <div className="balance-card-top">
            <div className="balance-icon">
              <WalletCards size={22} />
            </div>

            <span className={summary.netBalance >= 0 ? "good" : "bad"}>
              {summary.netBalance >= 0 ? "Safe" : "Alert"}
            </span>
          </div>

          <p>Total Balance</p>

          <h2>₹{summary.netBalance.toLocaleString("en-IN")}</h2>

          <small>
            Income ₹{summary.totalIncome.toLocaleString("en-IN")} − Expense ₹
            {summary.totalExpense.toLocaleString("en-IN")}
          </small>

          <div className="balance-mini-line">
            <span></span>
          </div>

          <h4>
            {summary.netBalance >= 0
              ? "Remaining money after expenses"
              : "Expenses are higher than income"}
          </h4>
        </div>
      </section>

      <section className="dash-summary-grid">
        <div className="dash-summary-card income-special-card">
          <div className="income-card-top">
            <div className="summary-icon income">
              <TrendingUp size={21} />
            </div>

            <span>Earned</span>
          </div>

          <p>Total Income</p>

          <h3>₹{summary.totalIncome.toLocaleString("en-IN")}</h3>

          <small>Money added to your account</small>
        </div>

        <div className="dash-summary-card">
          <div className="summary-icon expense">
            <TrendingDown size={22} />
          </div>
          <p>Total Expense</p>
          <h3>₹{summary.totalExpense.toLocaleString("en-IN")}</h3>
        </div>

        <div className="dash-summary-card">
          <div className="summary-icon balance">
            <WalletCards size={22} />
          </div>
          <p>Net Balance</p>
          <h3>₹{summary.netBalance.toLocaleString("en-IN")}</h3>
        </div>

        <div className="dash-summary-card">
          <div className="summary-icon top">
            <PieChart size={22} />
          </div>
          <p>Top Category</p>
          <h3>{summary.topCategory}</h3>
        </div>
      </section>

      <section className="dash-main-grid">
        <form className="transaction-form-card" onSubmit={handleAddTransaction}>
          <div className="dash-section-title">
            <div>
              <p>Add Transaction</p>
              <h2>New record</h2>
            </div>
            <Plus size={24} />
          </div>

          <div className="dash-field">
            <label>Amount</label>
            <input
              type="number"
              name="amount"
              placeholder="Enter amount"
              value={formData.amount}
              onChange={handleChange}
            />
          </div>

          <div className="dash-two-grid">
            <div className="dash-field">
              <label>Type</label>
              <select
                name="type"
                value={formData.type}
                onChange={handleChange}
              >
                <option value="">-- Select Type --</option>
                <option value="income">Income</option>
                <option value="expense">Expense</option>
              </select>
            </div>

            <div className="dash-field">
              <label>Category</label>
              <select
                name="category"
                value={formData.category}
                onChange={handleChange}
                disabled={!formData.type}
              >
                <option value="">-- Select Category --</option>

                {selectedCategories.map((category) => (
                  <option value={category} key={category}>
                    {category}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="dash-field">
            <label>Date</label>
            <input
              type="date"
              name="date"
              value={formData.date}
              onChange={handleChange}
            />
          </div>

          <div className="dash-field">
            <label>Note</label>
            <input
              type="text"
              name="note"
              placeholder="Optional note"
              value={formData.note}
              onChange={handleChange}
            />
          </div>

          <button className="dash-submit-btn" type="submit" disabled={saving}>
            {saving ? "Saving..." : "Add Transaction"}
            {!saving && <Plus size={18} />}
          </button>
        </form>

        <div className="dash-chart-card">
          <div className="dash-section-title">
            <div>
              <p>Spending Chart</p>
              <h2>Expense bars</h2>
            </div>
            <PieChart size={24} />
          </div>

          {chartData.length === 0 ? (
            <div className="empty-chart">No expense data yet.</div>
          ) : (
            <>
              <div className="bar-chart-top">
                <div>
                  <p>Total Expense</p>
                  <h3>₹{summary.totalExpense.toLocaleString("en-IN")}</h3>
                </div>

                <span>{chartData.length} categories</span>
              </div>

              <div className="bar-chart-box">
                <ResponsiveContainer width="100%" height={330}>
                  <RechartsBarChart
                    data={chartData}
                    margin={{
                      top: 18,
                      right: 16,
                      left: 0,
                      bottom: 8,
                    }}
                  >
                    <CartesianGrid strokeDasharray="4 4" vertical={false} />
                    <XAxis
                      dataKey="category"
                      tickLine={false}
                      axisLine={false}
                      tick={{ fontSize: 12, fontWeight: 700 }}
                    />
                    <YAxis
                      tickLine={false}
                      axisLine={false}
                      tick={{ fontSize: 12, fontWeight: 700 }}
                      tickFormatter={(value) =>
                        `₹${Number(value).toLocaleString("en-IN")}`
                      }
                    />
                    <Tooltip
                      cursor={{ fill: "rgba(37, 99, 235, 0.08)" }}
                      formatter={(value) => [
                        `₹${Number(value).toLocaleString("en-IN")}`,
                        "Expense",
                      ]}
                    />
                    <Bar dataKey="amount" radius={[14, 14, 6, 6]}>
                      {chartData.map((entry, index) => (
                        <Cell
                          key={entry.category}
                          fill={barColors[index % barColors.length]}
                        />
                      ))}
                    </Bar>
                  </RechartsBarChart>
                </ResponsiveContainer>
              </div>
            </>
          )}

          <div className={`insight-box ${insight.tone}`}>
            <BrainCircuit size={23} />
            <div>
              <p>{insight.tag}</p>
              <h3>{insight.title}</h3>
              <span>{insight.message}</span>
            </div>
          </div>
        </div>
      </section>

      <section className="transactions-card">
        <div className="transactions-header">
          <div className="dash-section-title">
            <div>
              <p>Transactions</p>
              <h2>History</h2>
            </div>
            <Filter size={24} />
          </div>

          <div className="filters-row">
            <select
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
            >
              <option value="All">All categories</option>

              {allCategories.map((category) => (
                <option value={category} key={category}>
                  {category}
                </option>
              ))}
            </select>

            <div className="date-filter">
              <CalendarDays size={17} />
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
              />
            </div>

            <div className="date-filter">
              <CalendarDays size={17} />
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
              />
            </div>
          </div>
        </div>

        <div className="transaction-list">
          {filteredTransactions.length === 0 ? (
            <div className="empty-transactions">
              No transactions found. Add your first record.
            </div>
          ) : (
            filteredTransactions.map((transaction) => (
              <div className="transaction-item" key={transaction.id}>
                <div>
                  <span
                    className={
                      transaction.type === "income"
                        ? "type-badge income-badge"
                        : "type-badge expense-badge"
                    }
                  >
                    {transaction.type}
                  </span>

                  <h3>{transaction.category}</h3>

                  <p>
                    {transaction.date}
                    {transaction.note ? ` • ${transaction.note}` : ""}
                  </p>
                </div>

                <div className="transaction-right">
                  <strong
                    className={
                      transaction.type === "income"
                        ? "amount-income"
                        : "amount-expense"
                    }
                  >
                    {transaction.type === "income" ? "+" : "-"}₹
                    {transaction.amount.toLocaleString("en-IN")}
                  </strong>

                  <button
                    className="delete-btn"
                    onClick={() => handleDeleteTransaction(transaction.id)}
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </section>
    </main>
  );
}

export default DashboardPage;