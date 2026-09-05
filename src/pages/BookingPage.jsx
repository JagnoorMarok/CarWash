import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  ArrowLeft, 
  CheckCircle, 
  Calendar, 
  Clock, 
  Car, 
  Phone, 
  Mail, 
  MapPin, 
  Sparkles, 
  Check, 
  Plus, 
  Trash2, 
  ShieldCheck, 
  CreditCard,
  Receipt,
  AlertCircle
} from 'lucide-react';
import { collection, addDoc, serverTimestamp, query, orderBy, onSnapshot } from 'firebase/firestore';
import { db } from '../firebase';
import { defaultSeedServices, extractPrice } from '../components/dashboard/ServicesManager';
import './BookingPage.css';

const vehicleTypeOptions = [
  'Sedan',
  'SUV / Crossover',
  'Truck / Pickup',
  'Van / Minivan',
  'Coupe / Sports Car',
  'Luxury / Exotic'
];

const BookingPage = () => {
  const [customServices, setCustomServices] = useState([]);
  const [selectedServiceIds, setSelectedServiceIds] = useState([]);
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    vehicle: '',
    vehicleType: 'Sedan',
    date: '',
    time: 'morning',
    notes: '',
  });
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [submittedBooking, setSubmittedBooking] = useState(null);
  const [validationError, setValidationError] = useState('');

  // Real-time listener for Firestore services
  useEffect(() => {
    const q = query(collection(db, 'services'), orderBy('order', 'asc'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const live = snapshot.docs.map(doc => ({
        id: doc.id,
        title: doc.data().title,
        price: doc.data().price || '$99',
        description: doc.data().description || '',
        features: doc.data().features || []
      }));
      setCustomServices(live);
    }, (err) => {
      console.warn("BookingPage services listener error:", err);
    });

    return () => unsubscribe();
  }, []);

  // When custom services exist, hide template ones. Otherwise, fallback to starter default services
  const availableServices = customServices.length > 0 ? customServices : defaultSeedServices;

  // Pre-select the first service on initial load if none selected yet
  useEffect(() => {
    if (selectedServiceIds.length === 0 && availableServices.length > 0) {
      setSelectedServiceIds([availableServices[0].id]);
    }
  }, [availableServices.length]);

  // Toggle service selection
  const toggleService = (serviceId) => {
    setValidationError('');
    setSelectedServiceIds(prev => {
      if (prev.includes(serviceId)) {
        return prev.filter(id => id !== serviceId);
      } else {
        return [...prev, serviceId];
      }
    });
  };

  const removeService = (serviceId) => {
    setSelectedServiceIds(prev => prev.filter(id => id !== serviceId));
  };

  // Get selected service objects
  const selectedServices = availableServices.filter(s => selectedServiceIds.includes(s.id));

  // Bill computations
  const subtotal = selectedServices.reduce((sum, s) => sum + extractPrice(s.price), 0);
  const tax = subtotal * 0.05; // 5% B.C. GST
  const totalAmount = subtotal + tax;

  const handleChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setValidationError('');

    if (selectedServiceIds.length === 0) {
      setValidationError('Please select at least one detailing service package before continuing.');
      const serviceSection = document.getElementById('services-selection-section');
      if (serviceSection) {
        serviceSection.scrollIntoView({ behavior: 'smooth' });
      }
      return;
    }

    setLoading(true);
    try {
      const bookingData = {
        name: formData.name.trim(),
        phone: formData.phone.trim(),
        email: formData.email.trim(),
        vehicle: formData.vehicle.trim(),
        vehicleType: formData.vehicleType,
        date: formData.date,
        time: formData.time,
        notes: formData.notes.trim(),
        services: selectedServices.map(s => ({
          id: s.id,
          title: s.title,
          price: s.price,
          numericPrice: extractPrice(s.price)
        })),
        serviceName: selectedServices.map(s => s.title).join(' + '),
        subtotal: Number(subtotal.toFixed(2)),
        tax: Number(tax.toFixed(2)),
        totalAmount: Number(totalAmount.toFixed(2)),
        status: 'pending',
        createdAt: serverTimestamp()
      };

      const docRef = await addDoc(collection(db, 'bookings'), bookingData);
      setSubmittedBooking({
        ...bookingData,
        id: docRef.id
      });
      setSubmitted(true);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (err) {
      console.error("Error submitting booking:", err);
      alert("Failed to submit your booking request. Please check your network connection or give us a call at (778) 637-0025.");
    } finally {
      setLoading(false);
    }
  };

  // Get minimum date (today) for the date picker
  const todayDateString = new Date().toISOString().split('T')[0];

  if (submitted && submittedBooking) {
    return (
      <div className="booking-page">
        <div className="booking-receipt-container">
          <div className="booking-success-receipt">
            <div className="receipt-status-badge">
              <CheckCircle size={36} />
              <span>Booking Confirmed & Received!</span>
            </div>

            <div className="receipt-header-branding">
              <img src="/assets/logo.png" alt="Prime Finish Auto Spa" className="receipt-logo" />
              <h2>Prime Finish Auto Spa</h2>
              <p className="receipt-subtitle">Official Detailing Appointment Summary</p>
              <span className="receipt-id">Ref #{submittedBooking.id?.slice(0, 8).toUpperCase()}</span>
            </div>

            <div className="receipt-client-info">
              <div className="receipt-info-row">
                <span className="label">Customer:</span>
                <span className="value">{submittedBooking.name}</span>
              </div>
              <div className="receipt-info-row">
                <span className="label">Phone:</span>
                <span className="value">{submittedBooking.phone}</span>
              </div>
              {submittedBooking.email && (
                <div className="receipt-info-row">
                  <span className="label">Email:</span>
                  <span className="value">{submittedBooking.email}</span>
                </div>
              )}
              {submittedBooking.vehicle && (
                <div className="receipt-info-row">
                  <span className="label">Vehicle:</span>
                  <span className="value">{submittedBooking.vehicle} ({submittedBooking.vehicleType})</span>
                </div>
              )}
              <div className="receipt-info-row">
                <span className="label">Scheduled Date:</span>
                <span className="value">{submittedBooking.date || 'To be confirmed'}</span>
              </div>
              <div className="receipt-info-row">
                <span className="label">Time Window:</span>
                <span className="value" style={{ textTransform: 'capitalize' }}>
                  {submittedBooking.time === 'morning' ? 'Morning (9AM–12PM)' :
                   submittedBooking.time === 'afternoon' ? 'Afternoon (12PM–4PM)' :
                   submittedBooking.time === 'evening' ? 'Evening (4PM–8PM)' : 'Flexible'}
                </span>
              </div>
            </div>

            <div className="receipt-divider"></div>

            <div className="receipt-items-section">
              <h4>Selected Detailing Services</h4>
              <div className="receipt-items-list">
                {submittedBooking.services?.map((s, idx) => (
                  <div key={idx} className="receipt-item-row">
                    <span className="item-name">{s.title}</span>
                    <span className="item-price">${Number(s.numericPrice || 0).toFixed(2)}</span>
                  </div>
                ))}
              </div>

              <div className="receipt-totals-table">
                <div className="receipt-calc-row">
                  <span>Subtotal</span>
                  <span>${submittedBooking.subtotal.toFixed(2)}</span>
                </div>
                <div className="receipt-calc-row">
                  <span>Estimated GST (5%)</span>
                  <span>${submittedBooking.tax.toFixed(2)}</span>
                </div>
                <div className="receipt-calc-row total">
                  <span>Total Estimated Bill</span>
                  <span className="receipt-grand-total">${submittedBooking.totalAmount.toFixed(2)} CAD</span>
                </div>
              </div>
            </div>

            <div className="receipt-footer-notes">
              <p>✓ We will contact you at <strong>{submittedBooking.phone}</strong> to confirm your slot and address.</p>
              <p>✓ Payment is due upon completion of the service. We accept Debit, Visa, Mastercard, and E-Transfer.</p>
            </div>

            <div className="receipt-actions">
              <Link to="/" className="btn-primary receipt-home-btn">
                Back to Home
              </Link>
              <button 
                className="btn-outline receipt-again-btn"
                onClick={() => {
                  setSubmitted(false);
                  setSubmittedBooking(null);
                  setSelectedServiceIds(availableServices[0] ? [availableServices[0].id] : []);
                }}
              >
                Book Another Appointment
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="booking-page">
      <header className="booking-page-header">
        <Link to="/" className="back-btn" title="Return to home">
          <ArrowLeft size={20} />
          <span>Back</span>
        </Link>
        <div className="booking-header-title">
          <h1>Book Your Detailing Service</h1>
          <p>Select your packages, preview your live itemized bill, and reserve your appointment.</p>
        </div>
      </header>

      <div className="booking-container">
        {/* Left Column: Services Selection & Customer Info Form */}
        <div className="booking-main-content">

          {/* STEP 1: SELECT SERVICES */}
          <section id="services-selection-section" className="booking-step-card">
            <div className="step-header">
              <div className="step-badge">Step 1</div>
              <div>
                <h2>Select Services Needed</h2>
                <p>Choose one or multiple detailing packages. Your estimate updates automatically.</p>
              </div>
            </div>

            {validationError && (
              <div className="booking-alert-banner">
                <AlertCircle size={20} />
                <span>{validationError}</span>
              </div>
            )}

            <div className="services-selection-grid">
              {availableServices.map((service) => {
                const isSelected = selectedServiceIds.includes(service.id);
                const priceNum = extractPrice(service.price);

                return (
                  <div 
                    key={service.id} 
                    className={`service-select-card ${isSelected ? 'selected' : ''}`}
                    onClick={() => toggleService(service.id)}
                  >
                    <div className="card-top-row">
                      <div className="card-selection-check">
                        <div className={`checkbox-circle ${isSelected ? 'checked' : ''}`}>
                          {isSelected && <Check size={14} strokeWidth={3} />}
                        </div>
                        <span className="card-service-title">{service.title}</span>
                      </div>
                      <div className="card-price-badge">
                        ${priceNum > 0 ? priceNum.toFixed(2) : service.price}
                      </div>
                    </div>

                    {service.description && (
                      <p className="card-service-desc">{service.description}</p>
                    )}

                    {service.features && service.features.length > 0 && (
                      <ul className="card-features-list">
                        {service.features.map((feat, idx) => (
                          <li key={idx}>
                            <Sparkles size={12} className="feat-icon" />
                            <span>{feat}</span>
                          </li>
                        ))}
                      </ul>
                    )}

                    <div className="card-footer-action">
                      <button 
                        type="button" 
                        className={`btn-service-toggle ${isSelected ? 'btn-selected' : ''}`}
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleService(service.id);
                        }}
                      >
                        {isSelected ? (
                          <>
                            <Check size={15} />
                            <span>Selected</span>
                          </>
                        ) : (
                          <>
                            <Plus size={15} />
                            <span>Add to Booking</span>
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </section>

          {/* STEP 2: CUSTOMER DETAILS & SCHEDULING FORM */}
          <form className="booking-step-card booking-details-form" onSubmit={handleSubmit}>
            <div className="step-header">
              <div className="step-badge">Step 2</div>
              <div>
                <h2>Your Information & Scheduling</h2>
                <p>Provide your contact details and preferred date for service.</p>
              </div>
            </div>

            <div className="form-grid">
              <div className="form-group full-width">
                <label htmlFor="cust-name">Full Name *</label>
                <input 
                  type="text" 
                  id="cust-name" 
                  name="name" 
                  required 
                  placeholder="e.g. Harpreet Singh" 
                  value={formData.name}
                  onChange={handleChange}
                />
              </div>

              <div className="form-group">
                <label htmlFor="cust-phone">Phone Number *</label>
                <input 
                  type="tel" 
                  id="cust-phone" 
                  name="phone" 
                  required 
                  placeholder="(778) 637-0025" 
                  value={formData.phone}
                  onChange={handleChange}
                />
              </div>

              <div className="form-group">
                <label htmlFor="cust-email">Email Address</label>
                <input 
                  type="email" 
                  id="cust-email" 
                  name="email" 
                  placeholder="name@example.com" 
                  value={formData.email}
                  onChange={handleChange}
                />
              </div>

              <div className="form-group">
                <label htmlFor="cust-vehicle">Vehicle Make & Model</label>
                <input 
                  type="text" 
                  id="cust-vehicle" 
                  name="vehicle" 
                  placeholder="e.g. 2023 Tesla Model Y or Honda Civic" 
                  value={formData.vehicle}
                  onChange={handleChange}
                />
              </div>

              <div className="form-group">
                <label htmlFor="cust-vehicletype">Vehicle Type</label>
                <select 
                  id="cust-vehicletype" 
                  name="vehicleType" 
                  value={formData.vehicleType}
                  onChange={handleChange}
                >
                  {vehicleTypeOptions.map((vType, idx) => (
                    <option key={idx} value={vType}>{vType}</option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label htmlFor="cust-date">Preferred Date *</label>
                <input 
                  type="date" 
                  id="cust-date" 
                  name="date" 
                  required 
                  min={todayDateString}
                  value={formData.date}
                  onChange={handleChange}
                />
              </div>

              <div className="form-group">
                <label htmlFor="cust-time">Preferred Time Window</label>
                <select 
                  id="cust-time" 
                  name="time" 
                  value={formData.time}
                  onChange={handleChange}
                >
                  <option value="morning">Morning (9:00 AM – 12:00 PM)</option>
                  <option value="afternoon">Afternoon (12:00 PM – 4:00 PM)</option>
                  <option value="evening">Evening (4:00 PM – 8:00 PM)</option>
                  <option value="flexible">Flexible / Any Time</option>
                </select>
              </div>

              <div className="form-group full-width">
                <label htmlFor="cust-notes">Special Requests or Vehicle Condition Notes</label>
                <textarea 
                  id="cust-notes" 
                  name="notes" 
                  rows="3" 
                  placeholder="Mention pet hair, stubborn stains, paint scratches, or parking instructions..." 
                  value={formData.notes}
                  onChange={handleChange}
                />
              </div>
            </div>

            {/* Mobile / Inline Bill preview before button */}
            <div className="mobile-total-banner">
              <div className="banner-left">
                <span className="banner-label">Total Estimated Job Cost:</span>
                <span className="banner-amount">${totalAmount.toFixed(2)} CAD</span>
              </div>
              <span className="banner-count">
                {selectedServices.length} {selectedServices.length === 1 ? 'service' : 'services'} selected (incl. GST)
              </span>
            </div>

            <button 
              type="submit" 
              disabled={loading} 
              className="btn-primary booking-submit-btn"
            >
              {loading ? (
                <span>Processing Booking Request...</span>
              ) : (
                <>
                  <CheckCircle size={20} />
                  <span>Confirm & Book Appointment (${totalAmount.toFixed(2)})</span>
                </>
              )}
            </button>
            <p className="booking-guarantee-note">
              <ShieldCheck size={16} />
              <span>Zero cancellation fee · Pay after service completion</span>
            </p>
          </form>
        </div>

        {/* Right Column: Interactive Detailing Bill Checkout Receipt */}
        <aside className="booking-sidebar">
          <div className="checkout-bill-card">
            <div className="bill-card-notch"></div>
            
            <div className="bill-header">
              <div className="bill-badge">
                <Receipt size={16} />
                <span>Detailing Estimate</span>
              </div>
              <h3>Checkout Bill</h3>
              <p className="bill-date-preview">
                {formData.date ? `Scheduled for ${formData.date}` : 'Real-Time Cost Calculator'}
              </p>
            </div>

            <div className="bill-divider-dashed"></div>

            {/* Selected items breakdown */}
            <div className="bill-items-list">
              <div className="bill-items-header">
                <span>Selected Package(s)</span>
                <span>Price</span>
              </div>

              {selectedServices.length === 0 ? (
                <div className="bill-empty-state">
                  <Sparkles size={24} />
                  <p>No services selected yet. Please select at least one package from the left.</p>
                </div>
              ) : (
                selectedServices.map((service) => {
                  const pNum = extractPrice(service.price);
                  return (
                    <div key={service.id} className="bill-item-row">
                      <div className="bill-item-title-col">
                        <button 
                          type="button" 
                          className="bill-item-remove-btn" 
                          onClick={() => removeService(service.id)}
                          title="Remove service"
                        >
                          <Trash2 size={13} />
                        </button>
                        <span className="bill-item-title">{service.title}</span>
                      </div>
                      <span className="bill-item-cost">${pNum.toFixed(2)}</span>
                    </div>
                  );
                })
              )}
            </div>

            <div className="bill-divider-solid"></div>

            {/* Calculations */}
            <div className="bill-calc-summary">
              <div className="calc-row">
                <span>Subtotal</span>
                <span>${subtotal.toFixed(2)}</span>
              </div>
              <div className="calc-row">
                <span>Estimated GST (5%)</span>
                <span>${tax.toFixed(2)}</span>
              </div>
              <div className="calc-row grand-total">
                <div>
                  <strong>Total Job Cost</strong>
                  <span className="tax-included-tag">GST Included</span>
                </div>
                <strong className="grand-total-amount">${totalAmount.toFixed(2)} CAD</strong>
              </div>
            </div>

            {/* Payment & Security reassurance */}
            <div className="bill-payment-box">
              <div className="payment-box-title">
                <CreditCard size={16} />
                <span>Accepted Payment Methods</span>
              </div>
              <p className="payment-box-text">Debit, Visa, Mastercard, American Express, and Interac E-Transfer.</p>
              <div className="payment-chips">
                <span>Debit</span>
                <span>Visa</span>
                <span>Mastercard</span>
                <span>E-Transfer</span>
                <span>Amex</span>
              </div>
            </div>

            {/* Contact quick actions */}
            <div className="bill-support-footer">
              <span className="support-title">Need help or a custom quote?</span>
              <div className="support-link">
                <Phone size={14} />
                <a href="tel:7786370025">(778) 637-0025</a>
              </div>
              <div className="support-link">
                <MapPin size={14} />
                <span>Surrey & Lower Mainland</span>
              </div>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
};

export default BookingPage;
