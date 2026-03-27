import React, { useState, useMemo } from 'react';
import { 
  Chart as ChartJS, 
  ArcElement, 
  Tooltip, 
  Legend, 
  CategoryScale, 
  LinearScale, 
  BarElement,
  DoughnutController,
  BarController
} from 'chart.js';
import { Doughnut, Bar } from 'react-chartjs-2';
import { PieChart, BarChart3 } from 'lucide-react';
import { CHART_COLORS } from '../constants';
import { formatCurrency } from '../utils/formatters';

ChartJS.register(
  ArcElement, 
  Tooltip, 
  Legend, 
  CategoryScale, 
  LinearScale, 
  BarElement,
  DoughnutController,
  BarController
);

const ExpenseChart = ({ transactions }) => {
  const [chartType, setChartType] = useState('pie');

  const chartData = useMemo(() => {
    const expenseMap = {};
    transactions
      .filter(t => t.type === 'expense')
      .forEach(t => {
        expenseMap[t.category] = (expenseMap[t.category] || 0) + t.amount;
      });

    const labels = Object.keys(expenseMap);
    const data = labels.map(l => parseFloat(expenseMap[l].toFixed(2)));
    const colors = labels.map((_, i) => CHART_COLORS[i % CHART_COLORS.length]);

    return {
      labels,
      datasets: [{
        label: 'Expenses',
        data,
        backgroundColor: chartType === 'pie' ? colors.map(c => c + 'cc') : colors.map(c => c + '99'),
        borderColor: colors,
        borderWidth: 2,
        borderRadius: chartType === 'pie' ? 0 : 8,
        hoverOffset: chartType === 'pie' ? 10 : 0,
      }]
    };
  }, [transactions, chartType]);

  const hasData = chartData.datasets[0].data.length > 0;

  const options = {
    responsive: true,
    maintainAspectRatio: true,
    animation: { duration: 600, easing: 'easeInOutQuart' },
    plugins: {
      legend: {
        display: chartType === 'pie',
        position: 'bottom',
        labels: {
          padding: 14,
          boxWidth: 12,
          boxHeight: 12,
          borderRadius: 4,
          color: '#8891b4',
          font: { size: 12, weight: '500', family: "'Inter', sans-serif" },
        },
      },
      tooltip: {
        backgroundColor: '#1a1e35',
        borderColor: '#252a45',
        borderWidth: 1,
        padding: 12,
        titleFont: { size: 13, weight: '700', family: "'Inter', sans-serif" },
        bodyFont: { size: 13, family: "'Inter', sans-serif" },
        callbacks: {
          label: (context) => {
            const val = context.parsed;
            const total = context.dataset.data.reduce((a, b) => a + b, 0);
            const pct = total > 0 ? ((chartType === 'pie' ? val : val.y) / total * 100).toFixed(1) : '0.0';
            const amt = formatCurrency(chartType === 'pie' ? val : val.y);
            return `  ${amt}  (${pct}%)`;
          },
        },
      },
    },
    scales: chartType === 'pie' ? {} : {
      x: {
        grid: { color: '#252a45' },
        ticks: { color: '#8891b4', font: { size: 12, family: "'Inter', sans-serif" } },
      },
      y: {
        grid: { color: '#252a45' },
        ticks: {
          color: '#8891b4',
          font: { size: 12, family: "'Inter', sans-serif" },
          callback: (v) => formatCurrency(v),
        },
        beginAtZero: true,
      },
    },
  };

  return (
    <div className="panel chart-panel">
      <div className="panel-header">
        <h2 className="panel-title">Expense Breakdown</h2>
        <div className="chart-type-toggle">
          <button 
            className={`toggle-btn ${chartType === 'pie' ? 'active' : ''}`}
            onClick={() => setChartType('pie')}
            aria-pressed={chartType === 'pie'}
          >
            <PieChart size={14} style={{ marginRight: '6px' }} />
            Pie
          </button>
          <button 
            className={`toggle-btn ${chartType === 'bar' ? 'active' : ''}`}
            onClick={() => setChartType('bar')}
            aria-pressed={chartType === 'bar'}
          >
            <BarChart3 size={14} style={{ marginRight: '6px' }} />
            Bar
          </button>
        </div>
      </div>
      <div className="chart-container">
        {hasData ? (
          chartType === 'pie' ? (
            <Doughnut data={chartData} options={options} />
          ) : (
            <Bar data={chartData} options={options} />
          )
        ) : (
          <div className="chart-empty">
            <div className="empty-icon">📊</div>
            <p>No expense data yet</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ExpenseChart;
