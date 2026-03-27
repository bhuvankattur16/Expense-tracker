import React, { useState, useEffect } from 'react';
import { TrendingUp, TrendingDown, Wallet } from 'lucide-react';
import { formatCurrency } from '../utils/formatters';

const SummaryCard = ({ title, amount, icon: Icon, variant, className }) => {
  const [displayAmount, setDisplayAmount] = useState(0);

  useEffect(() => {
    // Simple animation logic
    const duration = 700;
    const start = displayAmount;
    const end = amount;
    const startTime = performance.now();

    const animate = (now) => {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const ease = 1 - Math.pow(1 - progress, 3);
      const current = start + (end - start) * ease;
      
      setDisplayAmount(current);
      
      if (progress < 1) {
        requestAnimationFrame(animate);
      } else {
        setDisplayAmount(end);
      }
    };

    requestAnimationFrame(animate);
  }, [amount]);

  const amountColorClass = variant === 'balance' 
    ? (amount > 0 ? 'balance-positive' : amount < 0 ? 'balance-negative' : '') 
    : '';

  return (
    <div className={`summary-card card-${variant} ${className || ''}`}>
      <div className={`card-icon-wrap ${variant}-icon`}>
        <Icon size={24} />
      </div>
      <div className="card-body">
        <p className="card-label">{title}</p>
        <p className={`card-amount ${amountColorClass}`}>
          {formatCurrency(displayAmount)}
        </p>
      </div>
    </div>
  );
};

const SummaryCards = ({ transactions }) => {
  const totals = transactions.reduce((acc, t) => {
    if (t.type === 'income') acc.income += t.amount;
    else acc.expense += t.amount;
    return acc;
  }, { income: 0, expense: 0 });

  const balance = totals.income - totals.expense;

  return (
    <section className="summary-section" aria-label="Financial Summary">
      <SummaryCard 
        title="Total Income" 
        amount={totals.income} 
        variant="income" 
        icon={TrendingUp} 
      />
      <SummaryCard 
        title="Total Expenses" 
        amount={totals.expense} 
        variant="expense" 
        icon={TrendingDown} 
      />
      <SummaryCard 
        title="Net Balance" 
        amount={balance} 
        variant="balance" 
        icon={Wallet} 
      />
    </section>
  );
};

export default SummaryCards;
