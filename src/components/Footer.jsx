import React from 'react';
import { Link } from 'react-router-dom';
import { Phone, Mail, MapPin, Clock } from 'lucide-react';
import './Footer.css';

const Footer = () => {
  return (
    <footer className="site-footer">
      <div className="footer-inner">
        <div className="footer-top">
          {/* Brand */}
          <div className="footer-brand">
            <div className="footer-logo-row">
              <img src="/assets/logo.png" alt="Logo" className="footer-logo" />
              <h3>Prime Finish Auto Spa</h3>
            </div>
            <p className="footer-tagline">Where Clean Meets Perfection. Premium auto detailing services in the Lower Mainland.</p>
            <div className="footer-social">
              <a href="#" aria-label="Instagram" className="footer-social-link">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="20" x="2" y="2" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/></svg>
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="footer-col">
            <h4>Quick Links</h4>
            <Link to="/">Home</Link>
            <Link to="/booking">Book Now</Link>
            <Link to="/gallery">Gallery</Link>
            <Link to="/reviews">Reviews</Link>
            <Link to="/team">Our Team</Link>
          </div>

          {/* Contact */}
          <div className="footer-col">
            <h4>Contact</h4>
            <a href="tel:6043665373" className="footer-contact-item">
              <Phone size={14} />
              <span>(604) 366-5373</span>
            </a>
            <a href="mailto:pristinedetailing604@gmail.com" className="footer-contact-item">
              <Mail size={14} />
              <span>pristinedetailing604@gmail.com</span>
            </a>
            <div className="footer-contact-item">
              <MapPin size={14} />
              <span>Lower Mainland, BC</span>
            </div>
            <div className="footer-contact-item">
              <Clock size={14} />
              <span>Open · Closes at 10 PM</span>
            </div>
          </div>
        </div>

        <div className="footer-bottom">
          <p>&copy; {new Date().getFullYear()} Prime Finish Auto Spa. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
