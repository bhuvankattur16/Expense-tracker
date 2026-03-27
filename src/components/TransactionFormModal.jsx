import React, { useState, useEffect } from 'react';
import { X, Check } from 'lucide-react';
import { CATEGORIES } from '../constants';

const TransactionFormModal = ({ isOpen, onClose, onSubmit, editingTransaction }) => {
  const [formData, setFormData] = useState({
    id: null,
    type: 'income',
    title: '',
    amount: '',
    category: '',
    date: new Date().toISOString().split('T')[0],
    note: ''
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (editingTransaction) {
      setFormData({
        ...editingTransaction,
        amount: String(editingTransaction.amount),
        date: editingTransaction.date || '',
        note: editingTransaction.note || ''
      });
    } else {
      setFormData({
        id: null,
        type: 'income',
        title: '',
        amount: '',
        category: '',
        date: new Date().toISOString().split('T')[0],
        note: ''
      });
    }
    setErrors({});
  }, [editingTransaction, isOpen]);

  if (!isOpen) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.title.trim()) newErrors.title = 'Title is required.';
    
    const amt = parseFloat(formData.amount);
    if (!formData.amount) newErrors.amount = 'Amount is required.';
    else if (isNaN(amt) || amt <= 0) newErrors.amount = 'Enter a valid positive number.';
    
    if (!formData.category) newErrors.category = 'Please select a category.';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;
    
    onSubmit({
      ...formData,
      amount: parseFloat(parseFloat(formData.amount).toFixed(2))
    });
  };

  return (
    <div className="modal-overlay open" onClick={(e) => e.target === e.currentTarget && onClose()} role="dialog" aria-modal="true">
      <div className="modal">
        <div className="modal-header">
          <h3 className="modal-title">{editingTransaction ? 'Edit Transaction' : 'Add Transaction'}</h3>
          <button className="modal-close" onClick={onClose} aria-label="Close modal">
            <X size={20} strokeWidth={2.5} />
          </button>
        </div>

        <form className="modal-form" onSubmit={handleSubmit} novalidate>
          <div className="type-selector" role="group" aria-label="Transaction type">
            <label className="type-option">
              <input 
                type="radio" 
                name="type" 
                value="income" 
                checked={formData.type === 'income'} 
                onChange={handleChange}
              />
              <span className="type-btn income-btn">Income</span>
            </label>
            <label className="type-option">
              <input 
                type="radio" 
                name="type" 
                value="expense" 
                checked={formData.type === 'expense'} 
                onChange={handleChange}
              />
              <span className="type-btn expense-btn">Expense</span>
            </label>
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="title">Title <span className="required">*</span></label>
            <input 
              className={`form-input ${errors.title ? 'error' : ''}`}
              type="text" 
              id="title" 
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="e.g., Monthly Salary, Grocery Run" 
              maxlength="80" 
              autoComplete="off" 
              autoFocus
            />
            <p className="field-error">{errors.title}</p>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label className="form-label" htmlFor="amount">Amount (₹) <span className="required">*</span></label>
              <input 
                className={`form-input ${errors.amount ? 'error' : ''}`}
                type="number" 
                id="amount" 
                name="amount"
                value={formData.amount}
                onChange={handleChange}
                placeholder="0.00" 
                min="0.01" 
                step="0.01" 
              />
              <p className="field-error">{errors.amount}</p>
            </div>
            <div className="form-group">
              <label className="form-label" htmlFor="category">Category <span className="required">*</span></label>
              <select 
                className={`form-input form-select ${errors.category ? 'error' : ''}`}
                id="category" 
                name="category"
                value={formData.category}
                onChange={handleChange}
              >
                <option value="">Select category...</option>
                {CATEGORIES[formData.type].map(cat => (
                  <option key={cat.name} value={cat.name}>{cat.name}</option>
                ))}
              </select>
              <p className="field-error">{errors.category}</p>
            </div>
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="date">Date</label>
            <input 
              className="form-input" 
              type="date" 
              id="date" 
              name="date"
              value={formData.date}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="note">Note (optional)</label>
            <textarea 
              className="form-input form-textarea" 
              id="note" 
              name="note"
              value={formData.note}
              onChange={handleChange}
              placeholder="Add a short note..." 
              maxlength="200" 
              rows="2"
            ></textarea>
          </div>

          <div className="modal-actions">
            <button type="button" class="btn-cancel" onClick={onClose}>Cancel</button>
            <button type="submit" class="btn-submit">
              <Check size={16} strokeWidth={2.5} />
              {editingTransaction ? 'Update Transaction' : 'Save Transaction'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TransactionFormModal;
