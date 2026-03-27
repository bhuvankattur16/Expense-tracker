import React, { useEffect } from 'react';

const Toast = ({ message, type, isVisible, onHide }) => {
  useEffect(() => {
    if (isVisible) {
      const timer = setTimeout(() => {
        onHide();
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [isVisible, onHide]);

  if (!isVisible) return null;

  return (
    <div className={`toast ${type} show`} role="status" aria-live="polite">
      {message}
    </div>
  );
};

export default Toast;
