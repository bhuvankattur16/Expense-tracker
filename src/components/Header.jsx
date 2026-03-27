import React from 'react';
import { Plus } from 'lucide-react';

const Header = ({ onOpenModal }) => {
  return (
    <header className="header">
      <div className="header-content">
        <div className="logo">
          <div className="logo-icon">₹</div>
          <div>
            <h1 className="logo-title">WealthTrack</h1>
            <p className="logo-subtitle">Personal Finance Manager</p>
          </div>
        </div>
        <button 
          className="btn-add" 
          onClick={onOpenModal}
          aria-label="Add new transaction"
        >
          <Plus size={20} strokeWidth={2.5} />
          <span>Add Transaction</span>
        </button>
      </div>
    </header>
  );
};

export default Header;
