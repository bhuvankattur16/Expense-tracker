import React from 'react';
import { Trash2 } from 'lucide-react';

const DeleteModal = ({ isOpen, onClose, onConfirm }) => {
  if (!isOpen) return null;

  return (
    <div className={`modal-overlay open`} onClick={(e) => e.target === e.currentTarget && onClose()} role="alertdialog" aria-modal="true">
      <div className="modal delete-modal">
        <div className="delete-icon-wrap">
          <Trash2 size={32} />
        </div>
        <h3 className="modal-title">Delete Transaction?</h3>
        <p className="delete-msg">This action cannot be undone.</p>
        <div className="modal-actions">
          <button className="btn-cancel" onClick={onClose}>Cancel</button>
          <button className="btn-delete-confirm" onClick={onConfirm}>Delete</button>
        </div>
      </div>
    </div>
  );
};

export default DeleteModal;
