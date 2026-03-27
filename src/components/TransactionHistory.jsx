import React, { useState, useMemo } from 'react';
import { Edit2, Trash2, Wallet } from 'lucide-react';
import { formatCurrency, formatDate } from '../utils/formatters';
import { CATEGORIES } from '../constants';

const TransactionHistory = ({ transactions, onEdit, onDelete, onOpenModal }) => {
  const [filterType, setFilterType] = useState('all');
  const [filterCategory, setFilterCategory] = useState('all');

  const filteredTransactions = useMemo(() => {
    return transactions.filter(t => {
      if (filterType !== 'all' && t.type !== filterType) return false;
      if (filterCategory !== 'all' && t.category !== filterCategory) return false;
      return true;
    });
  }, [transactions, filterType, filterCategory]);

  const allCategoryOptions = useMemo(() => {
    const cats = [...CATEGORIES.income, ...CATEGORIES.expense];
    // Unique categories by name
    return Array.from(new Set(cats.map(c => c.name))).map(name => {
      return cats.find(c => c.name === name);
    });
  }, []);

  const getEmoji = (type, category) => {
    const list = CATEGORIES[type] || [];
    const cat = list.find(c => c.name === category);
    return cat ? cat.emoji : '💳';
  };

  return (
    <div className="panel history-panel">
      <div className="panel-header">
        <h2 className="panel-title">Transaction History</h2>
        <span className="tx-count">{transactions.length} {transactions.length === 1 ? 'entry' : 'entries'}</span>
      </div>

      <div className="filter-bar">
        <select 
          className="filter-select" 
          value={filterType} 
          onChange={(e) => setFilterType(e.target.value)}
          aria-label="Filter by type"
        >
          <option value="all">All Types</option>
          <option value="income">Income</option>
          <option value="expense">Expense</option>
        </select>
        <select 
          className="filter-select" 
          value={filterCategory} 
          onChange={(e) => setFilterCategory(e.target.value)}
          aria-label="Filter by category"
        >
          <option value="all">All Categories</option>
          {allCategoryOptions.map(cat => (
            <option key={cat.name} value={cat.name}>{cat.name}</option>
          ))}
        </select>
      </div>

      {transactions.length === 0 ? (
        <div className="empty-state">
          <div className="empty-illustration">
             <Wallet size={80} strokeWidth={1.2} opacity={0.4} />
          </div>
          <h3>No transactions yet</h3>
          <p>Get started by adding your first transaction!</p>
          <button className="btn-add btn-empty-cta" onClick={onOpenModal}>
            Add Transaction
          </button>
        </div>
      ) : (
        <ul className="tx-list" aria-live="polite" aria-label="Transaction list">
          {filteredTransactions.map(tx => {
            const isInc = tx.type === 'income';
            return (
              <li key={tx.id} className="tx-item">
                <div 
                  className="tx-cat-icon" 
                  style={{ background: isInc ? 'rgba(34,211,160,0.12)' : 'rgba(240,98,146,0.12)' }}
                >
                  {getEmoji(tx.type, tx.category)}
                </div>
                <div className="tx-info">
                  <div className="tx-title" title={tx.title}>{tx.title}</div>
                  <div className="tx-meta">
                    {tx.category}
                    {tx.date && ` · ${formatDate(tx.date)}`}
                    {tx.note && ` · ${tx.note}`}
                  </div>
                </div>
                <div className="tx-right">
                  <span className={`tx-amount ${tx.type}`}>
                    {isInc ? '+' : '−'}{formatCurrency(tx.amount)}
                  </span>
                  <div className="tx-actions">
                    <button 
                      className="tx-action-btn edit" 
                      onClick={() => onEdit(tx)}
                      title="Edit transaction"
                    >
                      <Edit2 size={14} />
                    </button>
                    <button 
                      className="tx-action-btn delete" 
                      onClick={() => onDelete(tx.id)}
                      title="Delete transaction"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
};

export default TransactionHistory;
