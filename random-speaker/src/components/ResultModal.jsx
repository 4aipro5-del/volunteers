import React from 'react';
import { motion } from 'framer-motion';
import { X } from 'lucide-react';
import './ResultModal.css';

export default function ResultModal({ student, onClose }) {
  return (
    <div className="modal-overlay" onClick={onClose}>
      <motion.div 
        className="modal-content"
        initial={{ scale: 0, rotate: -180 }}
        animate={{ scale: 1, rotate: 0 }}
        exit={{ scale: 0, rotate: 180 }}
        transition={{ type: "spring", damping: 12, stiffness: 100 }}
        onClick={(e) => e.stopPropagation()}
      >
        <button className="close-btn" onClick={onClose}>
          <X size={24} />
        </button>
        <h2 className="congrats-text">🎉 당첨! 🎉</h2>
        <div className="winner-name">{student}</div>
        <p className="sub-text">앞으로 나와서 발표해주세요!</p>
      </motion.div>
    </div>
  );
}
