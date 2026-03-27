import React, { useState, useEffect, useCallback } from 'react';
import Header from './components/Header';
import SummaryCards from './components/SummaryCards';
import ExpenseChart from './components/ExpenseChart';
import TransactionHistory from './components/TransactionHistory';
import TransactionFormModal from './components/TransactionFormModal';
import DeleteModal from './components/DeleteModal';
import Toast from './components/Toast';
import { dbGetAll, dbAdd, dbUpdate, dbDelete, openDB } from './services/db';

const App = () => {
  const [transactions, setTransactions] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTransaction, setEditingTransaction] = useState(null);
  const [deleteTargetId, setDeleteTargetId] = useState(null);
  const [toast, setToast] = useState({ message: '', type: 'info', isVisible: false });

  // Initial load
  useEffect(() => {
    const initApp = async () => {
      try {
        await openDB();
        const data = await dbGetAll();
        setTransactions(data.sort((a, b) => b.id - a.id));
      } catch (err) {
        console.error('Failed to initialize database:', err);
        showToast('Failed to load data from database.', 'error');
      }
    };
    initApp();
  }, []);

  const showToast = useCallback((message, type = 'info') => {
    setToast({ message, type, isVisible: true });
  }, []);

  const hideToast = useCallback(() => {
    setToast(prev => ({ ...prev, isVisible: false }));
  }, []);

  const handleOpenModal = (tx = null) => {
    setEditingTransaction(tx);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingTransaction(null);
  };

  const handleFormSubmit = async (formData) => {
    try {
      if (formData.id) {
        // Update
        const updatedTx = { ...formData, updatedAt: new Date().toISOString() };
        await dbUpdate(updatedTx);
        setTransactions(prev => prev.map(t => t.id === formData.id ? updatedTx : t));
        showToast('Transaction updated ✓', 'success');
      } else {
        // Add
        const newTx = { ...formData, createdAt: new Date().toISOString() };
        const id = await dbAdd(newTx);
        newTx.id = id;
        setTransactions(prev => [newTx, ...prev]);
        showToast('Transaction added ✓', 'success');
      }
      handleCloseModal();
    } catch (err) {
      console.error('Storage error:', err);
      showToast('Something went wrong. Please try again.', 'error');
    }
  };

  const handleDeleteConfirm = async () => {
    if (deleteTargetId == null) return;
    try {
      await dbDelete(deleteTargetId);
      setTransactions(prev => prev.filter(t => t.id !== deleteTargetId));
      setDeleteTargetId(null);
      showToast('Transaction deleted.', 'info');
    } catch (err) {
      console.error('Delete error:', err);
      showToast('Failed to delete. Try again.', 'error');
    }
  };

  return (
    <div className="app-container">
      <Header onOpenModal={() => handleOpenModal()} />
      
      <main className="main">
        <SummaryCards transactions={transactions} />
        
        <div className="dashboard-grid">
          <ExpenseChart transactions={transactions} />
          
          <TransactionHistory 
            transactions={transactions} 
            onEdit={handleOpenModal} 
            onDelete={setDeleteTargetId}
            onOpenModal={() => handleOpenModal()}
          />
        </div>
      </main>

      <TransactionFormModal 
        isOpen={isModalOpen} 
        onClose={handleCloseModal} 
        onSubmit={handleFormSubmit}
        editingTransaction={editingTransaction}
      />

      <DeleteModal 
        isOpen={deleteTargetId !== null} 
        onClose={() => setDeleteTargetId(null)} 
        onConfirm={handleDeleteConfirm} 
      />

      <Toast 
        message={toast.message} 
        type={toast.type} 
        isVisible={toast.isVisible} 
        onHide={hideToast} 
      />
    </div>
  );
};

export default App;
