import React, { useState } from 'react';
import { Mail, Phone, Calendar } from 'lucide-react';
import './About.css';

const About = () => {
  const [showMore, setShowMore] = useState(false);

  return (
      <div className="about-section">
        <p className="welcome-text">
          Welcome to Prime Finish Auto Spa... Where Clean Meets Perfection!
        </p>
        <p className="about-desc">
          At Prime Finish Auto Spa, we believe every vehicle deserves to look and feel brand new. Proudly serving the Lower Mainland, we specialize in premium auto care services that go beyond the surface. Whether you're looking for a
          {showMore && (
            <span> deep interior clean, paint correction, ceramic coating, or a full detail — we've got you covered. Our team of trained professionals uses only the best products and techniques to ensure your ride leaves looking flawless every time. We treat every vehicle like it's our own.</span>
          )}
          {!showMore ? '...' : ''}
          <button className="show-more-btn" onClick={() => setShowMore(!showMore)}>
            {showMore ? 'Show less' : 'Show more'}
          </button>
        </p>

        <div className="about-grid">
          <div className="info-block">
            <h3 className="block-title">Contact us</h3>
            <a href="tel:6043665373" className="info-item">
              <Phone size={18} />
              <span>(604) 366-5373</span>
            </a>
            <a href="mailto:pristinedetailing604@gmail.com" className="info-item">
              <Mail size={18} />
              <span>pristinedetailing604@gmail.com</span>
            </a>
          </div>

          <div className="info-block">
            <h3 className="block-title">Good to know</h3>
            <div className="info-item">
              <Calendar size={18} />
              <span>Booking policy</span>
            </div>
          </div>

          <div className="info-block">
            <h3 className="block-title">Pay online</h3>
            <div className="payment-methods">
              <span className="pay-icon">VISA</span>
              <span className="pay-icon">mc</span>
              <span className="pay-icon">Apple Pay</span>
              <span className="pay-icon">G Pay</span>
            </div>
          </div>

          <div className="info-block">
            <h3 className="block-title">Social media</h3>
            <a href="#" className="social-link">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-instagram"><rect width="20" height="20" x="2" y="2" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/></svg>
            </a>
          </div>
        </div>
    </div>
  );
};

export default About;
