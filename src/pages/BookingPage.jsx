import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Phone, Mail, MapPin, Clock, CheckCircle } from 'lucide-react';
import './BookingPage.css';

const serviceOptions = [
  { id: 'interior', name: 'Interior Detailing', price: 'From $120' },
  { id: 'exterior', name: 'Exterior Detailing', price: 'From $100' },
  { id: 'full', name: 'Full Detail Package', price: 'From $200' },
  { id: 'ceramic', name: 'Ceramic Coating', price: 'From $300' },
  { id: 'paint', name: 'Paint Correction', price: 'From $250' },
];

const BookingPage = () => {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    service: '',
    date: '',
    time: '',
    notes: '',
  });
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <div className="booking-page">
        <div className="booking-success">
          <CheckCircle size={64} color="var(--primary-color)" />
          <h2>Booking Request Sent!</h2>
          <p>Thank you, {formData.name}! We'll contact you shortly to confirm your appointment.</p>
          <Link to="/" className="btn-primary booking-back-btn">Back to Home</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="booking-page">
      <header className="booking-page-header">
        <Link to="/" className="back-btn">
          <ArrowLeft size={20} />
          <span>Back</span>
        </Link>
        <h1>Book an Appointment</h1>
      </header>

      <div className="booking-layout">
        <form className="booking-form" onSubmit={handleSubmit}>
          <div className="form-section">
            <h3>Your Information</h3>
            <div className="form-group">
              <label htmlFor="name">Full Name *</label>
              <input 
                type="text" id="name" name="name" 
                value={formData.name} onChange={handleChange} 
                required placeholder="John Doe"
              />
            </div>
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="phone">Phone *</label>
                <input 
                  type="tel" id="phone" name="phone" 
                  value={formData.phone} onChange={handleChange} 
                  required placeholder="(604) 555-0000"
                />
              </div>
              <div className="form-group">
                <label htmlFor="email">Email</label>
                <input 
                  type="email" id="email" name="email" 
                  value={formData.email} onChange={handleChange} 
                  placeholder="john@example.com"
                />
              </div>
            </div>
          </div>

          <div className="form-section">
            <h3>Service Details</h3>
            <div className="form-group">
              <label htmlFor="service">Select Service *</label>
              <select id="service" name="service" value={formData.service} onChange={handleChange} required>
                <option value="">Choose a service...</option>
                {serviceOptions.map((s) => (
                  <option key={s.id} value={s.id}>{s.name} — {s.price}</option>
                ))}
              </select>
            </div>
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="date">Preferred Date *</label>
                <input 
                  type="date" id="date" name="date" 
                  value={formData.date} onChange={handleChange} 
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="time">Preferred Time</label>
                <select id="time" name="time" value={formData.time} onChange={handleChange}>
                  <option value="">Any time</option>
                  <option value="morning">Morning (9AM–12PM)</option>
                  <option value="afternoon">Afternoon (12PM–4PM)</option>
                  <option value="evening">Evening (4PM–8PM)</option>
                </select>
              </div>
            </div>
            <div className="form-group">
              <label htmlFor="notes">Additional Notes</label>
              <textarea 
                id="notes" name="notes" rows="3"
                value={formData.notes} onChange={handleChange} 
                placeholder="Any special requests or details about your vehicle..."
              />
            </div>
          </div>

          <button type="submit" className="btn-primary submit-btn">Submit Booking Request</button>
        </form>

        <aside className="booking-sidebar">
          <div className="booking-info-card">
            <img src="/assets/logo.png" alt="Prime Finish Auto Spa" className="booking-logo" />
            <h3>Prime Finish Auto Spa</h3>
            <div className="booking-info-item">
              <Phone size={16} />
              <a href="tel:6043665373">(604) 366-5373</a>
            </div>
            <div className="booking-info-item">
              <Mail size={16} />
              <a href="mailto:pristinedetailing604@gmail.com">pristinedetailing604@gmail.com</a>
            </div>
            <div className="booking-info-item">
              <MapPin size={16} />
              <span>Lower Mainland, BC</span>
            </div>
            <div className="booking-info-item">
              <Clock size={16} />
              <span>Open · Closes at 10 PM</span>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
};

export default BookingPage;
