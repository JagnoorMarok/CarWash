import React, { useState, useEffect } from 'react';
import { 
  collection, 
  query, 
  orderBy, 
  onSnapshot 
} from 'firebase/firestore';
import { db } from '../../firebase';
import { 
  Calendar, 
  Clock, 
  CheckCircle, 
  AlertCircle, 
  TrendingUp, 
  DollarSign, 
  Star, 
  Image, 
  Sparkles, 
  Users, 
  Car, 
  ArrowUpRight, 
  Phone, 
  ChevronRight,
  ShieldCheck,
  Package
} from 'lucide-react';
import './AnalyticsOverview.css';

const AnalyticsOverview = ({ onNavigateTab }) => {
  const [bookings, setBookings] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [services, setServices] = useState([]);
  const [galleryCount, setGalleryCount] = useState(0);
  const [loading, setLoading] = useState(true);

  // Live listeners for all four key entities
  useEffect(() => {
    // 1. Bookings listener
    const qBookings = query(collection(db, 'bookings'), orderBy('createdAt', 'desc'));
    const unsubBookings = onSnapshot(qBookings, (snapshot) => {
      setBookings(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    }, (err) => console.warn("Analytics bookings error:", err));

    // 2. Reviews listener
    const qReviews = query(collection(db, 'reviews'), orderBy('createdAt', 'desc'));
    const unsubReviews = onSnapshot(qReviews, (snapshot) => {
      setReviews(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    }, (err) => console.warn("Analytics reviews error:", err));

    // 3. Services listener
    const qServices = query(collection(db, 'services'), orderBy('order', 'asc'));
    const unsubServices = onSnapshot(qServices, (snapshot) => {
      setServices(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    }, (err) => console.warn("Analytics services error:", err));

    // 4. Gallery listener
    const qGallery = query(collection(db, 'gallery'));
    const unsubGallery = onSnapshot(qGallery, (snapshot) => {
      setGalleryCount(snapshot.size);
      setLoading(false);
    }, (err) => {
      console.warn("Analytics gallery error:", err);
      setLoading(false);
    });

    return () => {
      unsubBookings();
      unsubReviews();
      unsubServices();
      unsubGallery();
    };
  }, []);

  // Compute KPI metrics
  const pendingBookings = bookings.filter(b => (b.status || 'pending') === 'pending');
  const confirmedBookings = bookings.filter(b => b.status === 'confirmed');
  const completedBookings = bookings.filter(b => b.status === 'completed');
  const cancelledBookings = bookings.filter(b => b.status === 'cancelled');

  // Revenue computations
  const totalCompletedRevenue = completedBookings.reduce((sum, b) => sum + (Number(b.totalAmount) || 0), 0);
  const confirmedPipelineRevenue = confirmedBookings.reduce((sum, b) => sum + (Number(b.totalAmount) || 0), 0);
  const pendingPipelineRevenue = pendingBookings.reduce((sum, b) => sum + (Number(b.totalAmount) || 0), 0);

  // Today and Upcoming Schedule
  const todayStr = new Date().toISOString().split('T')[0];
  const nextWeekDate = new Date();
  nextWeekDate.setDate(nextWeekDate.getDate() + 7);
  const nextWeekStr = nextWeekDate.toISOString().split('T')[0];

  const todayBookings = bookings.filter(b => b.date === todayStr);
  const upcomingWeekBookings = bookings.filter(b => b.date && b.date >= todayStr && b.date <= nextWeekStr);

  // Reviews Metrics
  const approvedReviews = reviews.filter(r => r.approved);
  const pendingReviews = reviews.filter(r => !r.approved);
  const totalApproved = approvedReviews.length;
  const avgRating = totalApproved > 0 
    ? (approvedReviews.reduce((sum, r) => sum + (Number(r.rating) || 5), 0) / totalApproved).toFixed(1)
    : '5.0';

  // Popular Services Distribution
  const servicePopularityMap = {};
  bookings.forEach(b => {
    const sName = b.serviceName || b.service || 'Detailing Service';
    servicePopularityMap[sName] = (servicePopularityMap[sName] || 0) + 1;
  });

  const popularServicesList = Object.entries(servicePopularityMap)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5);

  const totalBookingsCount = bookings.length || 1;

  if (loading) {
    return (
      <div className="analytics-loading">
        <div className="spinner"></div>
        <p>Loading real-time business performance analytics...</p>
      </div>
    );
  }

  return (
    <div className="analytics-dashboard">
      {/* Top Banner & Quick Summary */}
      <div className="analytics-hero-banner">
        <div className="hero-text-col">
          <h2>Business Performance & Operations Overview</h2>
          <p>Real-time telemetry of appointment inquiries, estimated revenue pipeline, customer feedback, and active inventory.</p>
        </div>
        <div className="hero-action-buttons">
          <button 
            className="btn-hero-action primary"
            onClick={() => onNavigateTab('bookings')}
          >
            <Calendar size={16} />
            <span>Manage Appointments ({pendingBookings.length} Pending)</span>
          </button>
          <button 
            className="btn-hero-action secondary"
            onClick={() => onNavigateTab('services')}
          >
            <Sparkles size={16} />
            <span>Update Services & Pricing</span>
          </button>
        </div>
      </div>

      {/* Primary KPI Cards Grid */}
      <div className="kpi-grid">
        {/* KPI 1: Pending Bookings */}
        <div 
          className="kpi-card pending-card"
          onClick={() => onNavigateTab('bookings')}
          role="button"
          tabIndex={0}
        >
          <div className="kpi-top">
            <span className="kpi-label">Pending Inquiries</span>
            <div className="kpi-icon-badge warning">
              <Clock size={20} />
            </div>
          </div>
          <div className="kpi-value-row">
            <span className="kpi-main-val">{pendingBookings.length}</span>
            {pendingBookings.length > 0 ? (
              <span className="kpi-alert-pill">Action Required</span>
            ) : (
              <span className="kpi-success-pill">All Caught Up</span>
            )}
          </div>
          <div className="kpi-footer">
            <span>Potential pipeline: <strong>${pendingPipelineRevenue.toFixed(2)} CAD</strong></span>
            <ArrowUpRight size={16} className="kpi-link-arrow" />
          </div>
        </div>

        {/* KPI 2: Today & Upcoming Appointments */}
        <div 
          className="kpi-card schedule-card"
          onClick={() => onNavigateTab('bookings')}
          role="button"
          tabIndex={0}
        >
          <div className="kpi-top">
            <span className="kpi-label">Next 7 Days Schedule</span>
            <div className="kpi-icon-badge info">
              <Calendar size={20} />
            </div>
          </div>
          <div className="kpi-value-row">
            <span className="kpi-main-val">{upcomingWeekBookings.length}</span>
            <span className="kpi-today-count">{todayBookings.length} Today</span>
          </div>
          <div className="kpi-footer">
            <span>Confirmed pipeline: <strong>${confirmedPipelineRevenue.toFixed(2)} CAD</strong></span>
            <ArrowUpRight size={16} className="kpi-link-arrow" />
          </div>
        </div>

        {/* KPI 3: Completed Revenue & Volume */}
        <div 
          className="kpi-card revenue-card"
          onClick={() => onNavigateTab('bookings')}
          role="button"
          tabIndex={0}
        >
          <div className="kpi-top">
            <span className="kpi-label">Completed Jobs Revenue</span>
            <div className="kpi-icon-badge success">
              <DollarSign size={20} />
            </div>
          </div>
          <div className="kpi-value-row">
            <span className="kpi-main-val">${totalCompletedRevenue.toFixed(2)}</span>
            <span className="kpi-tag success">{completedBookings.length} Done</span>
          </div>
          <div className="kpi-footer">
            <span>Total bookings logged: <strong>{bookings.length}</strong></span>
            <TrendingUp size={16} className="kpi-link-arrow" />
          </div>
        </div>

        {/* KPI 4: Customer Satisfaction & Reviews */}
        <div 
          className="kpi-card rating-card"
          onClick={() => onNavigateTab('reviews')}
          role="button"
          tabIndex={0}
        >
          <div className="kpi-top">
            <span className="kpi-label">Customer Satisfaction</span>
            <div className="kpi-icon-badge rating">
              <Star size={20} fill="#f59e0b" color="#f59e0b" />
            </div>
          </div>
          <div className="kpi-value-row">
            <span className="kpi-main-val">{avgRating} / 5.0</span>
            {pendingReviews.length > 0 && (
              <span className="kpi-alert-pill">{pendingReviews.length} To Review</span>
            )}
          </div>
          <div className="kpi-footer">
            <span><strong>{totalApproved}</strong> published reviews</span>
            <ArrowUpRight size={16} className="kpi-link-arrow" />
          </div>
        </div>
      </div>

      {/* Operations Breakdown & Charts Section */}
      <div className="analytics-two-col">
        {/* Left Column: Bookings Status Breakdown & Popular Services */}
        <div className="analytics-card">
          <div className="card-header-clean">
            <div>
              <h3>Booking Pipeline Breakdown</h3>
              <p>Current distribution across appointment status lifecycles.</p>
            </div>
            <span className="header-total-badge">{bookings.length} Total</span>
          </div>

          {/* Status Progress Bar Stack */}
          <div className="pipeline-stack-bar">
            <div 
              className="stack-segment pending" 
              style={{ width: `${(pendingBookings.length / totalBookingsCount) * 100}%` }}
              title={`Pending: ${pendingBookings.length}`}
            />
            <div 
              className="stack-segment confirmed" 
              style={{ width: `${(confirmedBookings.length / totalBookingsCount) * 100}%` }}
              title={`Confirmed: ${confirmedBookings.length}`}
            />
            <div 
              className="stack-segment completed" 
              style={{ width: `${(completedBookings.length / totalBookingsCount) * 100}%` }}
              title={`Completed: ${completedBookings.length}`}
            />
            <div 
              className="stack-segment cancelled" 
              style={{ width: `${(cancelledBookings.length / totalBookingsCount) * 100}%` }}
              title={`Cancelled: ${cancelledBookings.length}`}
            />
          </div>

          {/* Status Legend & Counts */}
          <div className="status-legend-grid">
            <div className="legend-item" onClick={() => onNavigateTab('bookings')}>
              <div className="legend-dot pending"></div>
              <div className="legend-info">
                <span className="legend-name">Pending</span>
                <strong>{pendingBookings.length} ({Math.round((pendingBookings.length / totalBookingsCount) * 100)}%)</strong>
              </div>
            </div>

            <div className="legend-item" onClick={() => onNavigateTab('bookings')}>
              <div className="legend-dot confirmed"></div>
              <div className="legend-info">
                <span className="legend-name">Confirmed</span>
                <strong>{confirmedBookings.length} ({Math.round((confirmedBookings.length / totalBookingsCount) * 100)}%)</strong>
              </div>
            </div>

            <div className="legend-item" onClick={() => onNavigateTab('bookings')}>
              <div className="legend-dot completed"></div>
              <div className="legend-info">
                <span className="legend-name">Completed</span>
                <strong>{completedBookings.length} ({Math.round((completedBookings.length / totalBookingsCount) * 100)}%)</strong>
              </div>
            </div>

            <div className="legend-item" onClick={() => onNavigateTab('bookings')}>
              <div className="legend-dot cancelled"></div>
              <div className="legend-info">
                <span className="legend-name">Cancelled</span>
                <strong>{cancelledBookings.length} ({Math.round((cancelledBookings.length / totalBookingsCount) * 100)}%)</strong>
              </div>
            </div>
          </div>

          {/* Popular Services Ranking */}
          <div className="popular-services-block">
            <h4>Most In-Demand Packages</h4>
            {popularServicesList.length === 0 ? (
              <p className="empty-subtext">No services booked yet. New bookings will automatically generate package analytics.</p>
            ) : (
              <div className="popular-list">
                {popularServicesList.map(([name, count], idx) => {
                  const percent = Math.round((count / totalBookingsCount) * 100);
                  return (
                    <div key={idx} className="popular-item">
                      <div className="popular-header-row">
                        <span className="pkg-name">#{idx + 1} {name}</span>
                        <span className="pkg-count">{count} {count === 1 ? 'booking' : 'bookings'}</span>
                      </div>
                      <div className="popular-bar-track">
                        <div className="popular-bar-fill" style={{ width: `${percent}%` }}></div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Next Upcoming Appointments & Quick Moderation */}
        <div className="analytics-card">
          <div className="card-header-clean">
            <div>
              <h3>Recent & Upcoming Appointments</h3>
              <p>Latest customer inquiries requiring coordination.</p>
            </div>
            <button 
              className="btn-view-all" 
              onClick={() => onNavigateTab('bookings')}
            >
              View All
              <ChevronRight size={14} />
            </button>
          </div>

          {bookings.length === 0 ? (
            <div className="empty-feed">
              <Calendar size={36} />
              <p>No bookings logged in database yet. Direct your clients to <code>/booking</code> to test real-time ingestion.</p>
            </div>
          ) : (
            <div className="appointments-feed">
              {bookings.slice(0, 5).map((b) => {
                const status = b.status || 'pending';
                return (
                  <div key={b.id} className="feed-item">
                    <div className="feed-left">
                      <div className={`status-indicator ${status}`} />
                      <div className="feed-details">
                        <div className="feed-client-name">
                          <strong>{b.name || 'Unknown Client'}</strong>
                          {b.totalAmount && (
                            <span className="feed-price-tag">${Number(b.totalAmount).toFixed(2)}</span>
                          )}
                        </div>
                        <div className="feed-meta-row">
                          <span className="feed-service">{b.serviceName || b.service || 'Detailing Package'}</span>
                          {b.vehicle && (
                            <span className="feed-vehicle">
                              <Car size={12} /> {b.vehicle}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="feed-right">
                      <span className="feed-date">{b.date || 'Flexible Date'}</span>
                      <span className={`status-badge-mini ${status}`}>
                        {status.toUpperCase()}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* Quick Operations Strip */}
          <div className="quick-stats-strip">
            <div className="strip-item" onClick={() => onNavigateTab('services')}>
              <Package size={18} />
              <div>
                <strong>{services.length}</strong>
                <span>Active Packages</span>
              </div>
            </div>

            <div className="strip-item" onClick={() => onNavigateTab('gallery')}>
              <Image size={18} />
              <div>
                <strong>{galleryCount}</strong>
                <span>Gallery Photos</span>
              </div>
            </div>

            <div className="strip-item" onClick={() => onNavigateTab('reviews')}>
              <ShieldCheck size={18} />
              <div>
                <strong>{pendingReviews.length}</strong>
                <span>Reviews to Moderate</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnalyticsOverview;
