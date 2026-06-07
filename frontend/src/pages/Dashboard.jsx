import { useState, useEffect } from 'react';
import { getExpenses, addExpense, deleteExpense, getBudget, setBudget } from '../services/api';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts';
import Navbar from '../components/Navbar';
import { useTheme } from '../context/ThemeContext';

const COLORS = ['#E24B4A', '#378ADD', '#7F77DD', '#1D9E75', '#EF9F27', '#F472B6', '#34D399', '#FB923C', '#60A5FA', '#A78BFA'];

const CATEGORY_ICONS = {
  'Food': '🍽️', 'Transport': '🚌', 'Mobile Recharge': '📱',
  'Shopping': '👕', 'Entertainment': '🎬', 'Medical': '💊',
  'Education': '📚', 'Grocery': '🛒', 'Room Rent': '🏠', 'Others': '💰'
};

function Dashboard() {
  const theme = useTheme();
  const [expenses, setExpenses] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [budget, setBudgetState] = useState(0);
  const [budgetInput, setBudgetInput] = useState('');
  const [showBudgetForm, setShowBudgetForm] = useState(false);
  const [filter, setFilter] = useState('month');
  const [form, setForm] = useState({
    title: '', amount: '', category: 'Food', note: '', date: ''
  });

  const categories = [
    'Food', 'Transport', 'Mobile Recharge', 'Shopping',
    'Entertainment', 'Medical', 'Education', 'Grocery', 'Room Rent', 'Others'
  ];

  useEffect(() => {
    fetchExpenses();
    fetchBudget();
  }, []);

  const fetchExpenses = async () => {
    const res = await getExpenses();
    setExpenses(res.data);
  };

  const fetchBudget = async () => {
    const res = await getBudget();
    setBudgetState(res.data.amount);
    setBudgetInput(res.data.amount);
  };

  const handleBudgetSave = async () => {
    await setBudget(parseFloat(budgetInput));
    setBudgetState(parseFloat(budgetInput));
    setShowBudgetForm(false);
  };

  const handleSubmit = async () => {
    if (!form.title || !form.amount || !form.date) {
      alert('Please fill all required fields!');
      return;
    }
    await addExpense(form);
    setForm({ title: '', amount: '', category: 'Food', note: '', date: '' });
    setShowForm(false);
    fetchExpenses();
  };

  const handleDelete = async (id) => {
    await deleteExpense(id);
    fetchExpenses();
  };

  const getFilteredExpenses = () => {
    const now = new Date();
    return expenses.filter(e => {
      const expDate = new Date(e.date);
      if (filter === 'day') return expDate.toDateString() === now.toDateString();
      if (filter === 'month') return expDate.getMonth() === now.getMonth() && expDate.getFullYear() === now.getFullYear();
      if (filter === 'year') return expDate.getFullYear() === now.getFullYear();
      return true;
    });
  };

  const filteredExpenses = getFilteredExpenses();

  const exportToCSV = () => {
    const headers = ['Title', 'Amount', 'Category', 'Date', 'Note'];
    const rows = filteredExpenses.map(e => [e.title, e.amount, e.category, e.date, e.note || '']);
    const csvContent = [headers, ...rows].map(r => r.join(',')).join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `expenses_${filter}.csv`;
    a.click();
  };

  const totalSpent = filteredExpenses.reduce((sum, e) => sum + parseFloat(e.amount), 0);
  const saved = budget - totalSpent;
  const budgetUsedPercent = budget > 0 ? (totalSpent / budget) * 100 : 0;

  const categoryData = categories.map(cat => ({
    name: cat,
    amount: filteredExpenses.filter(e => e.category === cat).reduce((sum, e) => sum + parseFloat(e.amount), 0)
  })).filter(c => c.amount > 0);

  const getDateWiseData = () => {
    const dateMap = {};
    filteredExpenses.forEach(e => {
      dateMap[e.date] = (dateMap[e.date] || 0) + parseFloat(e.amount);
    });
    return Object.keys(dateMap).sort().map(date => ({ date, amount: dateMap[date] }));
  };

  const getMonthWiseData = () => {
    const monthMap = {};
    filteredExpenses.forEach(e => {
      const m = new Date(e.date).toLocaleString('default', { month: 'short' });
      monthMap[m] = (monthMap[m] || 0) + parseFloat(e.amount);
    });
    return Object.keys(monthMap).map(month => ({ month, amount: monthMap[month] }));
  };

  const dateWiseData = getDateWiseData();
  const monthWiseData = getMonthWiseData();
  const maxAmount = Math.max(...(filter === 'month' ? dateWiseData : monthWiseData).map(d => d.amount || 0), 1);

  const now = new Date();
  const monthName = now.toLocaleString('default', { month: 'long', year: 'numeric' });

  return (
    <div style={{ background: theme.bg, minHeight: '100vh', fontFamily: 'sans-serif', transition: 'background 0.3s' }}>
      <Navbar />
      <div style={{ padding: '20px', maxWidth: '900px', margin: '0 auto' }}>

        {/* Budget Alert */}
        {budgetUsedPercent >= 80 && budget > 0 && (
          <div style={{ background: 'rgba(226,75,74,0.15)', border: '0.5px solid #E24B4A', borderRadius: '12px', padding: '15px', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '10px' }}>
            <span style={{ fontSize: '20px' }}>⚠️</span>
            <p style={{ color: '#E24B4A', margin: 0, fontWeight: 500 }}>
              Warning! You have used {budgetUsedPercent.toFixed(0)}% of your budget!
            </p>
          </div>
        )}

        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <h2 style={{ color: theme.text, margin: 0 }}>Dashboard</h2>
          <span style={{ color: theme.textSecondary, fontSize: '14px' }}>{monthName}</span>
        </div>

        {/* Filter + Export */}
        <div style={{ display: 'flex', gap: '10px', marginBottom: '20px', alignItems: 'center' }}>
          {['day', 'month', 'year', 'all'].map(f => (
            <button key={f} onClick={() => setFilter(f)} style={{
              padding: '8px 16px', borderRadius: '8px', border: 'none', cursor: 'pointer',
              background: filter === f ? '#E24B4A' : theme.card,
              color: filter === f ? '#fff' : theme.textSecondary,
              fontWeight: filter === f ? 'bold' : 'normal', fontSize: '13px',
              border: `0.5px solid ${theme.border}`
            }}>
              {f === 'all' ? 'All Time' : `This ${f.charAt(0).toUpperCase() + f.slice(1)}`}
            </button>
          ))}
          <button onClick={exportToCSV} style={{
            marginLeft: 'auto', padding: '8px 16px', borderRadius: '8px',
            border: '0.5px solid #1D9E75', background: 'rgba(29,158,117,0.15)',
            color: '#1D9E75', cursor: 'pointer', fontSize: '13px', fontWeight: 500
          }}>
            ⬇️ Export CSV
          </button>
        </div>

        {/* Stats Cards */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '15px', marginBottom: '20px' }}>
          <div style={{ background: theme.card, borderRadius: '12px', padding: '20px', border: `0.5px solid ${theme.border}` }}>
            <p style={{ color: theme.textSecondary, margin: '0 0 8px', fontSize: '13px' }}>Total Spent</p>
            <h2 style={{ color: '#E24B4A', margin: 0, fontSize: '28px' }}>₹{totalSpent.toFixed(0)}</h2>
          </div>
          <div onClick={() => setShowBudgetForm(!showBudgetForm)}
            style={{ background: theme.card, borderRadius: '12px', padding: '20px', border: `0.5px solid ${theme.border}`, cursor: 'pointer' }}>
            <p style={{ color: theme.textSecondary, margin: '0 0 8px', fontSize: '13px' }}>Budget ✏️</p>
            <h2 style={{ color: theme.text, margin: 0, fontSize: '28px' }}>₹{budget.toLocaleString()}</h2>
          </div>
          <div style={{ background: theme.card, borderRadius: '12px', padding: '20px', border: `0.5px solid ${theme.border}` }}>
            <p style={{ color: theme.textSecondary, margin: '0 0 8px', fontSize: '13px' }}>Saved</p>
            <h2 style={{ color: saved >= 0 ? '#1D9E75' : '#E24B4A', margin: 0, fontSize: '28px' }}>₹{saved.toFixed(0)}</h2>
          </div>
        </div>

        {/* Budget Progress Bar */}
        {budget > 0 && (
          <div style={{ background: theme.card, borderRadius: '12px', padding: '15px', border: `0.5px solid ${theme.border}`, marginBottom: '20px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
              <span style={{ color: theme.textSecondary, fontSize: '13px' }}>Budget Used</span>
              <span style={{ color: budgetUsedPercent >= 80 ? '#E24B4A' : '#1D9E75', fontSize: '13px', fontWeight: 'bold' }}>{budgetUsedPercent.toFixed(0)}%</span>
            </div>
            <div style={{ height: '8px', background: theme.input, borderRadius: '4px' }}>
              <div style={{
                height: '100%', borderRadius: '4px',
                background: budgetUsedPercent >= 80 ? '#E24B4A' : '#1D9E75',
                width: `${Math.min(budgetUsedPercent, 100)}%`,
                transition: 'width 0.3s ease'
              }} />
            </div>
          </div>
        )}

        {/* Budget Edit Form */}
        {showBudgetForm && (
          <div style={{ background: theme.card, borderRadius: '12px', padding: '20px', border: `0.5px solid ${theme.border}`, marginBottom: '20px', display: 'flex', gap: '10px' }}>
            <input type="number" placeholder="Enter budget amount" value={budgetInput}
              onChange={(e) => setBudgetInput(e.target.value)}
              style={{ flex: 1, padding: '10px', borderRadius: '8px', border: `0.5px solid ${theme.inputBorder}`, background: theme.input, color: theme.text }} />
            <button onClick={handleBudgetSave}
              style={{ padding: '10px 20px', background: '#1D9E75', color: '#fff', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold' }}>
              Save Budget
            </button>
          </div>
        )}

        {/* Charts */}
        {filteredExpenses.length > 0 && (
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px', marginBottom: '20px' }}>
            <div style={{ background: theme.card, borderRadius: '12px', padding: '20px', border: `0.5px solid ${theme.border}` }}>
              <p style={{ color: theme.textSecondary, fontSize: '12px', margin: '0 0 15px', textTransform: 'uppercase', letterSpacing: '1px' }}>
                {filter === 'month' ? 'Date Wise' : filter === 'year' ? 'Month Wise' : 'Category Wise'}
              </p>
              {(filter === 'day' || filter === 'all') && categoryData.map((cat, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '10px' }}>
                  <span style={{ color: theme.textSecondary, fontSize: '12px', width: '80px', flexShrink: 0 }}>{cat.name}</span>
                  <div style={{ flex: 1, height: '6px', background: theme.input, borderRadius: '3px' }}>
                    <div style={{ height: '100%', borderRadius: '3px', background: COLORS[i % COLORS.length], width: `${(cat.amount / totalSpent) * 100}%` }} />
                  </div>
                  <span style={{ color: theme.text, fontSize: '12px', width: '55px', textAlign: 'right' }}>₹{cat.amount}</span>
                </div>
              ))}
              {filter === 'month' && dateWiseData.map((item, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '10px' }}>
                  <span style={{ color: theme.textSecondary, fontSize: '12px', width: '80px', flexShrink: 0 }}>
                    {new Date(item.date).getDate()} {new Date(item.date).toLocaleString('default', { month: 'short' })}
                  </span>
                  <div style={{ flex: 1, height: '6px', background: theme.input, borderRadius: '3px' }}>
                    <div style={{ height: '100%', borderRadius: '3px', background: '#378ADD', width: `${(item.amount / maxAmount) * 100}%` }} />
                  </div>
                  <span style={{ color: theme.text, fontSize: '12px', width: '55px', textAlign: 'right' }}>₹{item.amount}</span>
                </div>
              ))}
              {filter === 'year' && monthWiseData.map((item, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '10px' }}>
                  <span style={{ color: theme.textSecondary, fontSize: '12px', width: '80px', flexShrink: 0 }}>{item.month}</span>
                  <div style={{ flex: 1, height: '6px', background: theme.input, borderRadius: '3px' }}>
                    <div style={{ height: '100%', borderRadius: '3px', background: '#7F77DD', width: `${(item.amount / maxAmount) * 100}%` }} />
                  </div>
                  <span style={{ color: theme.text, fontSize: '12px', width: '55px', textAlign: 'right' }}>₹{item.amount}</span>
                </div>
              ))}
            </div>

            <div style={{ background: theme.card, borderRadius: '12px', padding: '20px', border: `0.5px solid ${theme.border}` }}>
              <p style={{ color: theme.textSecondary, fontSize: '12px', margin: '0 0 15px', textTransform: 'uppercase', letterSpacing: '1px' }}>Breakdown</p>
              <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                <ResponsiveContainer width={120} height={120}>
                  <PieChart>
                    <Pie data={categoryData} cx={55} cy={55} innerRadius={35} outerRadius={55} dataKey="amount">
                      {categoryData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                    </Pie>
                    <Tooltip formatter={(val) => `₹${val}`} />
                  </PieChart>
                </ResponsiveContainer>
                <div>
                  {categoryData.map((cat, i) => (
                    <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '5px' }}>
                      <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: COLORS[i % COLORS.length], flexShrink: 0 }} />
                      <span style={{ color: theme.textSecondary, fontSize: '11px' }}>
                        {cat.name} {((cat.amount / totalSpent) * 100).toFixed(0)}%
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Add Expense Button */}
        <button onClick={() => setShowForm(!showForm)} style={{ width: '100%', padding: '15px', background: theme.card, color: theme.text, border: `0.5px solid ${theme.border}`, borderRadius: '12px', cursor: 'pointer', fontSize: '15px', fontWeight: 500, marginBottom: '15px' }}>
          + Add New Expense
        </button>

        {/* Add Expense Form */}
        {showForm && (
          <div style={{ background: theme.card, borderRadius: '12px', padding: '20px', border: `0.5px solid ${theme.border}`, marginBottom: '15px' }}>
            <h3 style={{ color: theme.text, marginTop: 0 }}>Add New Expense</h3>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
              <input type="text" placeholder="Title" value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
                style={{ padding: '10px', borderRadius: '8px', border: `0.5px solid ${theme.inputBorder}`, background: theme.input, color: theme.text }} />
              <input type="number" placeholder="Amount" value={form.amount}
                onChange={(e) => setForm({ ...form, amount: e.target.value })}
                style={{ padding: '10px', borderRadius: '8px', border: `0.5px solid ${theme.inputBorder}`, background: theme.input, color: theme.text }} />
              <select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })}
                style={{ padding: '10px', borderRadius: '8px', border: `0.5px solid ${theme.inputBorder}`, background: theme.card, color: theme.text }}>
                {categories.map(cat => <option key={cat} value={cat}>{CATEGORY_ICONS[cat]} {cat}</option>)}
              </select>
              <input type="date" value={form.date}
                onChange={(e) => setForm({ ...form, date: e.target.value })}
                style={{ padding: '10px', borderRadius: '8px', border: `0.5px solid ${theme.inputBorder}`, background: theme.input, color: theme.text }} />
              <input type="text" placeholder="Note (optional)" value={form.note}
                onChange={(e) => setForm({ ...form, note: e.target.value })}
                style={{ padding: '10px', borderRadius: '8px', border: `0.5px solid ${theme.inputBorder}`, background: theme.input, color: theme.text }} />
              <button onClick={handleSubmit}
                style={{ padding: '10px', background: '#E24B4A', color: '#fff', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold' }}>
                + Add Expense
              </button>
            </div>
          </div>
        )}

        {/* Recent Transactions */}
        <div style={{ background: theme.card, borderRadius: '12px', padding: '20px', border: `0.5px solid ${theme.border}` }}>
          <p style={{ color: theme.textSecondary, fontSize: '12px', margin: '0 0 15px', textTransform: 'uppercase', letterSpacing: '1px' }}>
            Recent Transactions ({filteredExpenses.length})
          </p>
          {filteredExpenses.length === 0 ? (
            <p style={{ color: theme.textSecondary, textAlign: 'center', padding: '20px 0' }}>No expenses found!</p>
          ) : (
            filteredExpenses.map(expense => (
              <div key={expense.id} style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '12px 0', borderBottom: `0.5px solid ${theme.border}` }}>
                <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: theme.input, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '18px', flexShrink: 0 }}>
                  {CATEGORY_ICONS[expense.category] || '💰'}
                </div>
                <div style={{ flex: 1 }}>
                  <p style={{ margin: 0, color: theme.text, fontWeight: 500 }}>{expense.title}</p>
                  <p style={{ margin: 0, color: theme.textSecondary, fontSize: '12px' }}>{expense.category} • {expense.date}</p>
                </div>
                <span style={{ color: '#E24B4A', fontWeight: 'bold', marginRight: '10px' }}>−₹{expense.amount}</span>
                <button onClick={() => handleDelete(expense.id)} style={{ background: 'rgba(226,75,74,0.15)', color: '#E24B4A', border: 'none', borderRadius: '6px', padding: '5px 10px', cursor: 'pointer', fontSize: '12px' }}>
                  Delete
                </button>
              </div>
            ))
          )}
        </div>

      </div>
    </div>
  );
}

export default Dashboard;