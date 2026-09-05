import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import AnalyticsOverview from '../components/dashboard/AnalyticsOverview';
import BookingsManager from '../components/dashboard/BookingsManager';
import ReviewsManager from '../components/dashboard/ReviewsManager';
import GalleryManager from '../components/dashboard/GalleryManager';
import TeamManager from '../components/dashboard/TeamManager';
import ServicesManager from '../components/dashboard/ServicesManager';
import { 
  BarChart3, 
  Calendar, 
  MessageSquare, 
  Image, 
  Users, 
  Sparkles, 
  LogOut, 
  LayoutDashboard, 
  ExternalLink,
  Menu,
  X
} from 'lucide-react';
import './Dashboard.css';

const Dashboard = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();

  // Close mobile drawer on resize to desktop
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 992) {
        setMobileMenuOpen(false);
      }
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login');
    } catch (error) {
      console.error('Failed to log out:', error);
    }
  };

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    setMobileMenuOpen(false);
  };

  return (
    <div className="dashboard-layout">
      {/* Mobile Backdrop Overlay */}
      {mobileMenuOpen && (
        <div 
          className="sidebar-backdrop" 
          onClick={() => setMobileMenuOpen(false)}
          aria-hidden="true"
        />
      )}

      {/* Sidebar Navigation */}
      <aside className={`dashboard-sidebar ${mobileMenuOpen ? 'mobile-open' : ''}`}>
        <div className="sidebar-brand">
          <img src="/assets/logo.png" alt="Prime Finish" className="sidebar-logo" />
          <div className="sidebar-brand-text">
            <h3>Admin Portal</h3>
            <span>Prime Finish Auto Spa</span>
          </div>
          <button 
            className="sidebar-close-btn" 
            onClick={() => setMobileMenuOpen(false)}
            aria-label="Close menu"
          >
            <X size={20} />
          </button>
        </div>

        <nav className="sidebar-nav">
          <button 
            className={`nav-item ${activeTab === 'overview' ? 'active' : ''}`}
            onClick={() => handleTabChange('overview')}
          >
            <BarChart3 size={18} />
            <span>Overview & KPIs</span>
          </button>

          <button 
            className={`nav-item ${activeTab === 'bookings' ? 'active' : ''}`}
            onClick={() => handleTabChange('bookings')}
          >
            <Calendar size={18} />
            <span>Bookings</span>
          </button>

          <button 
            className={`nav-item ${activeTab === 'reviews' ? 'active' : ''}`}
            onClick={() => handleTabChange('reviews')}
          >
            <MessageSquare size={18} />
            <span>Reviews</span>
          </button>

          <button 
            className={`nav-item ${activeTab === 'services' ? 'active' : ''}`}
            onClick={() => handleTabChange('services')}
          >
            <Sparkles size={18} />
            <span>Services & Pricing</span>
          </button>

          <button 
            className={`nav-item ${activeTab === 'gallery' ? 'active' : ''}`}
            onClick={() => handleTabChange('gallery')}
          >
            <Image size={18} />
            <span>Gallery Photos</span>
          </button>

          <button 
            className={`nav-item ${activeTab === 'team' ? 'active' : ''}`}
            onClick={() => handleTabChange('team')}
          >
            <Users size={18} />
            <span>Team Members</span>
          </button>
        </nav>

        <div className="sidebar-footer">
          <a href="/" target="_blank" rel="noreferrer" className="nav-item view-site">
            <ExternalLink size={18} />
            <span>View Website</span>
          </a>
          <div className="user-profile-bar">
            <span className="user-email" title={currentUser?.email}>{currentUser?.email}</span>
            <button onClick={handleLogout} className="logout-btn" title="Sign Out">
              <LogOut size={16} />
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="dashboard-main">
        <header className="dashboard-topbar">
          <div className="topbar-left">
            <button 
              className="mobile-menu-toggle"
              onClick={() => setMobileMenuOpen(true)}
              aria-label="Open staff navigation menu"
            >
              <Menu size={22} />
            </button>
            <div className="topbar-title">
              <LayoutDashboard size={20} className="topbar-icon" />
              <h1>
                {activeTab === 'overview' && 'Executive Overview & KPIs'}
                {activeTab === 'bookings' && 'Appointments & Bookings'}
                {activeTab === 'reviews' && 'Customer Reviews'}
                {activeTab === 'services' && 'Services & Pricing'}
                {activeTab === 'gallery' && 'Gallery Photos'}
                {activeTab === 'team' && 'Team Profiles'}
              </h1>
            </div>
          </div>

          <div className="topbar-right">
            <a href="/" target="_blank" rel="noreferrer" className="topbar-site-link" title="Open public website">
              <span>View Site</span>
              <ExternalLink size={14} />
            </a>
          </div>
        </header>

        <div className="dashboard-content">
          {activeTab === 'overview' && (
            <AnalyticsOverview onNavigateTab={handleTabChange} />
          )}
          {activeTab === 'bookings' && <BookingsManager />}
          {activeTab === 'reviews' && <ReviewsManager />}
          {activeTab === 'services' && <ServicesManager />}
          {activeTab === 'gallery' && <GalleryManager />}
          {activeTab === 'team' && <TeamManager />}
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
