import React from 'react';
import { Link } from 'react-router-dom';
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
          <Link to="/booking" className="modal-action-btn online-book-btn" onClick={onClose}>
            <Calendar size={20} />
            <div>
              <span className="action-title">Book Online Form</span>
              <span className="action-sub">Choose date, service & details</span>
            </div>
          </Link>

          <a href="tel:7786370025" className="modal-action-btn">
            <Phone size={20} />
            <div>
              <span className="action-title">Call to Book</span>
              <span className="action-sub">(778) 637-0025</span>
            </div>
          </a>

          <a href="mailto:primefinisha@gmail.com" className="modal-action-btn">
            <Calendar size={20} />
            <div>
              <span className="action-title">Email Us</span>
              <span className="action-sub">primefinisha@gmail.com</span>
            </div>
          </a>

          <div className="modal-action-btn">
            <MapPin size={20} />
            <div>
              <span className="action-title">Service Area</span>
              <span className="action-sub">Surrey, B.C. · Lower Mainland</span>
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
