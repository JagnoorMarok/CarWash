import { NavLink } from 'react-router-dom';
import { Phone, Smartphone } from 'lucide-react';
import './Header.css';

const Header = () => {
  return (
    <header className="site-header">
      <div className="top-bar">
        <button className="top-bar-btn">
          <Smartphone size={16} />
          <span>Get our app</span>
        </button>
        <a href="tel:6043665373" className="top-bar-link">
          <Phone size={16} />
          <span>Call us <strong>(604) 366-5373</strong></span>
        </a>
      </div>
      
      <nav className="nav-tabs">
        <NavLink to="/services" className={({ isActive }) => isActive || window.location.pathname === '/' ? 'nav-tab active' : 'nav-tab'}>Services</NavLink>
        <NavLink to="/team" className={({ isActive }) => isActive ? 'nav-tab active' : 'nav-tab'}>Team</NavLink>
        <NavLink to="/about" className={({ isActive }) => isActive ? 'nav-tab active' : 'nav-tab'}>About</NavLink>
        <NavLink to="/gallery" className={({ isActive }) => isActive ? 'nav-tab active' : 'nav-tab'}>Gallery</NavLink>
        <NavLink to="/reviews" className={({ isActive }) => isActive ? 'nav-tab active' : 'nav-tab'}>Reviews</NavLink>
      </nav>
    </header>
  );
};

export default Header;
