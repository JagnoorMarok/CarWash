import React, { useState } from 'react';
import { Mail, Phone, MapPin, Calendar } from 'lucide-react';
import './About.css';

const About = () => {
  const [showMore, setShowMore] = useState(false);

  return (
    <div className="about-section">
      <p className="welcome-text">
        Welcome to Prime Finish Auto Spa — “Detailing Done Right. Every Time.”
      </p>
      <div className="about-desc">
        <p>
          At Prime Finish Auto Spa, we are committed to delivering high-quality auto detailing services that leave your vehicle looking fresh, clean, and refreshed. Proudly serving the Lower Mainland, we specialize in premium interior and exterior vehicle care, with attention to every detail.
        </p>
        {showMore && (
          <>
            <p style={{ marginTop: '12px' }}>
              Our services include exterior hand washing, interior deep cleaning, seat and upholstery steam cleaning, detailed surface cleaning, thorough vacuuming, and professional finishing. We also offer steam disinfection, stain removal and interior shampooing, to help restore your vehicle’s interior and maintain a clean, comfortable environment.
            </p>
            <p style={{ marginTop: '12px' }}>
              We take pride in treating every vehicle with the same care and attention we would give our own. Our goal is simple: to provide exceptional results and ensure every customer drives away satisfied. Call to book a service today!
            </p>
          </>
        )}
        <button className="show-more-btn" onClick={() => setShowMore(!showMore)}>
          {showMore ? 'Show less' : '... Show more'}
        </button>
      </div>

      <div className="about-grid">
        <div className="info-block">
          <h3 className="block-title">Contact us</h3>
          <a href="tel:7786370025" className="info-item">
            <Phone size={18} />
            <span>(778) 637-0025</span>
          </a>
          <a href="mailto:primefinisha@gmail.com" className="info-item">
            <Mail size={18} />
            <span>primefinisha@gmail.com</span>
          </a>
          <div className="info-item">
            <MapPin size={18} />
            <span>Surrey, B.C. · Serving Lower Mainland</span>
          </div>
        </div>

        <div className="info-block">
          <h3 className="block-title">Good to know</h3>
          <div className="info-item">
            <Calendar size={18} />
            <span>Booking policy</span>
          </div>
          <div className="info-item">
            <MapPin size={18} />
            <span>Mobile & In-Studio Services Available</span>
          </div>
        </div>

        <div className="info-block">
          <h3 className="block-title">Methods of payment accepted</h3>
          <div className="payment-methods">
            <span className="pay-badge">Debit</span>
            <span className="pay-badge">Mastercard</span>
            <span className="pay-badge">E-Transfer</span>
            <span className="pay-badge">Amex</span>
            <span className="pay-badge">Visa</span>
          </div>
        </div>

        <div className="info-block">
          <h3 className="block-title">Social media</h3>
          <a href="#" className="social-link" aria-label="Instagram">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-instagram"><rect width="20" height="20" x="2" y="2" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/></svg>
          </a>
        </div>
      </div>
    </div>
  );
};

export default About;
