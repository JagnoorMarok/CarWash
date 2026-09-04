import React from 'react';
import { X, Phone, Calendar, MapPin } from 'lucide-react';
import './BookingModal.css';

const BookingModal = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose}>
          <X size={24} />
        </button>
        
        <div className="modal-header">
          <img src="/assets/logo.png" alt="Prime Finish Auto Spa" className="modal-logo" />
          <h2>Book an Appointment</h2>
          <p>Schedule your next detailing session</p>
        </div>

        <div className="modal-body">
          <a href="tel:6043665373" className="modal-action-btn">
            <Phone size={20} />
            <div>
              <span className="action-title">Call to Book</span>
              <span className="action-sub">(604) 366-5373</span>
            </div>
          </a>

          <a href="https://www.instagram.com" target="_blank" rel="noopener noreferrer" className="modal-action-btn">
            <Calendar size={20} />
            <div>
              <span className="action-title">Book Online</span>
              <span className="action-sub">Schedule via DM</span>
            </div>
          </a>

          <div className="modal-action-btn">
            <MapPin size={20} />
            <div>
              <span className="action-title">Visit Us</span>
              <span className="action-sub">Lower Mainland, BC</span>
            </div>
          </div>
        </div>

        <div className="modal-footer">
          <p>Open · Closes at 10 PM</p>
        </div>
      </div>
    </div>
  );
};

export default BookingModal;
