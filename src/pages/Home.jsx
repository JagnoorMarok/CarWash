import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Menu, X, Sun, Moon } from 'lucide-react';
import ProfileCard from '../components/ProfileCard';
import FloatingBookButton from '../components/FloatingBookButton';
import Services from './Services';
import Team from './Team';
import About from './About';
import Gallery from './Gallery';
import Reviews from './Reviews';
import './Home.css';

const Home = () => {
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(() => {
    if (typeof document !== 'undefined') {
      return document.body.classList.contains('dark');
    }
    return false;
  });

  const toggleTheme = () => {
    if (isDarkMode) {
      document.body.classList.remove('dark');
      setIsDarkMode(false);
    } else {
      document.body.classList.add('dark');
      setIsDarkMode(true);
    }
  };

  const scrollTo = (id) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
    setIsMenuOpen(false); // Close menu on click
  };

  const openBooking = () => {
    navigate('/booking');
    setIsMenuOpen(false);
  };

  return (
    <>
      <div className="home-container" id="home">
        {/* Transparent Header Overlay */}
        <header className="home-header">
          <div className="home-logo">
            <img src="/assets/logo.png" alt="Prime Finish Auto Spa Logo" className="nav-logo-img" />
            <span>Prime Finish Auto Spa</span>
          </div>
          
          <nav className={`home-nav ${isMenuOpen ? 'open' : ''}`}>
            <a href="#services" onClick={(e) => { e.preventDefault(); scrollTo('services'); }}>Services</a>
            <a href="#team" onClick={(e) => { e.preventDefault(); scrollTo('team'); }}>Team</a>
            <a href="#about" onClick={(e) => { e.preventDefault(); scrollTo('about'); }}>About</a>
            <a href="#gallery" onClick={(e) => { e.preventDefault(); scrollTo('gallery'); }}>Gallery</a>
            <a href="#reviews" onClick={(e) => { e.preventDefault(); scrollTo('reviews'); }}>Reviews</a>
          </nav>

          <div className="header-right">
            <button className="theme-toggle-btn" onClick={toggleTheme} aria-label="Toggle dark mode">
              {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
            </button>
            <button className="home-menu-btn" onClick={() => setIsMenuOpen(!isMenuOpen)} aria-label="Toggle navigation">
              {isMenuOpen ? <X size={24} color="#fff" /> : <Menu size={24} color="#fff" />}
            </button>
          </div>
        </header>

        {/* Video Background */}
        <video 
          className="hero-video" 
          autoPlay 
          loop 
          muted 
          playsInline
        >
          <source src="/assets/hero-bg.mp4" type="video/mp4" />
        </video>

        {/* Overlay Content */}
        <div className="hero-overlay">
          <div className="hero-content">
            <h1 className="hero-title">Premium Auto Detailing</h1>
            <p className="hero-subtitle">Experience the ultimate shine and protection for your vehicle.</p>
            
            <div className="hero-actions">
              <a href="#services" onClick={(e) => { e.preventDefault(); scrollTo('services'); }} className="hero-btn hero-btn-primary">
                View Services
              </a>
              <button className="hero-btn hero-btn-book" onClick={openBooking}>
                Book Now
              </button>
            </div>
          </div>
        </div>
      </div>
      
      {/* Two-column layout: sections left, profile card right */}
      <div className="content-layout">
        <div className="main-sections">
          <div id="services" className="page-section">
            <Services />
          </div>
          <div id="team" className="page-section">
            <Team />
          </div>
          <div id="about" className="page-section">
            <About />
          </div>
          <div id="gallery" className="page-section">
            <Gallery />
          </div>
          <div id="reviews" className="page-section">
            <Reviews />
          </div>
        </div>
        <aside className="sidebar">
          <ProfileCard />
          <div className="sidebar-book-btn">
            <FloatingBookButton onBook={openBooking} />
          </div>
        </aside>
      </div>
      
      {/* Mobile-only floating book button */}
      <div className="mobile-book-btn">
        <FloatingBookButton onBook={openBooking} />
      </div>
    </>
  );
};

export default Home;
