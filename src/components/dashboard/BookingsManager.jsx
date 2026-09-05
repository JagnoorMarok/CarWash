import React, { useState, useEffect } from 'react';
import { 
  collection, 
  query, 
  orderBy, 
  onSnapshot, 
  doc, 
  updateDoc, 
  deleteDoc 
} from 'firebase/firestore';
import { db } from '../../firebase';
import { 
  CheckCircle, 
  Clock, 
  XCircle, 
  Trash2, 
  Calendar, 
  Phone, 
  Mail, 
  Car, 
  Search, 
  Filter 
} from 'lucide-react';
import './BookingsManager.css';

const BookingsManager = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const q = query(collection(db, 'bookings'), orderBy('createdAt', 'desc'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const bookingsData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setBookings(bookingsData);
      setLoading(false);
    }, (error) => {
      console.error("Error fetching bookings:", error);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const handleStatusChange = async (id, newStatus) => {
    try {
      const bookingRef = doc(db, 'bookings', id);
      await updateDoc(bookingRef, { status: newStatus });
    } catch (error) {
      console.error("Error updating status:", error);
      alert("Failed to update status");
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this booking record?")) {
      try {
        await deleteDoc(doc(db, 'bookings', id));
      } catch (error) {
        console.error("Error deleting booking:", error);
        alert("Failed to delete booking");
      }
    }
  };

  const filteredBookings = bookings.filter(booking => {
    const matchesStatus = filterStatus === 'all' || (booking.status || 'pending') === filterStatus;
    const nameMatch = (booking.name || '').toLowerCase().includes(searchTerm.toLowerCase());
    const emailMatch = (booking.email || '').toLowerCase().includes(searchTerm.toLowerCase());
    const phoneMatch = (booking.phone || '').includes(searchTerm);
    return matchesStatus && (nameMatch || emailMatch || phoneMatch);
  });

  return (
    <div className="bookings-manager">
      <div className="bm-header">
        <div>
          <h2>Bookings Management</h2>
          <p>Review customer appointments, update statuses, and coordinate service times.</p>
        </div>
      </div>

      <div className="bm-controls">
        <div className="bm-search">
          <Search size={18} />
          <input 
            type="text" 
            placeholder="Search by customer name, phone, or email..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="bm-filter">
          <Filter size={18} />
          <select 
            value={filterStatus} 
            onChange={(e) => setFilterStatus(e.target.value)}
          >
            <option value="all">All Bookings ({bookings.length})</option>
            <option value="pending">Pending</option>
            <option value="confirmed">Confirmed</option>
            <option value="completed">Completed</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </div>
      </div>

      {loading ? (
        <div className="bm-loading">Loading bookings from Firestore...</div>
      ) : filteredBookings.length === 0 ? (
        <div className="bm-empty">
          <Calendar size={48} />
          <h3>No bookings found</h3>
          <p>When clients book via your website, their requests will appear here in real-time.</p>
        </div>
      ) : (
        <div className="bm-table-container">
          <table className="bm-table">
            <thead>
              <tr>
                <th>Customer</th>
                <th>Service & Vehicle</th>
                <th>Preferred Time</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredBookings.map((b) => {
                const status = b.status || 'pending';
                return (
                  <tr key={b.id} className={`status-row-${status}`}>
                    <td>
                      <div className="customer-info">
                        <strong>{b.name || 'Unknown'}</strong>
                        {b.phone && (
                          <a href={`tel:${b.phone.replace(/[^0-9+]/g, '')}`} className="contact-line phone-link" title="Call customer">
                            <Phone size={13} /> <span>{b.phone}</span>
                          </a>
                        )}
                        {b.email && (
                          <a href={`mailto:${b.email}`} className="contact-line email-link" title="Email customer">
                            <Mail size={13} /> <span>{b.email}</span>
                          </a>
                        )}
                      </div>
                    </td>
                    <td>
                      <div className="service-info">
                        <span className="service-badge">{b.serviceName || b.service || 'Service'}</span>
                        {b.totalAmount !== undefined && (
                          <div style={{ fontWeight: '800', color: 'var(--primary-color)', fontSize: '0.9rem', marginTop: '4px' }}>
                            ${Number(b.totalAmount).toFixed(2)} CAD
                          </div>
                        )}
                        {b.vehicle && (
                          <div style={{ display: 'flex', alignItems: 'center', gap: '5px', fontSize: '0.8rem', color: 'var(--text-secondary)', marginTop: '3px' }}>
                            <Car size={13} />
                            <span>{b.vehicle} {b.vehicleType ? `(${b.vehicleType})` : ''}</span>
                          </div>
                        )}
                        {b.notes && <p className="notes-snippet">“{b.notes}”</p>}
                      </div>
                    </td>
                    <td>
                      <div className="date-info">
                        <strong>{b.date || 'Any Date'}</strong>
                        <span className="time-badge">{b.time || 'Flexible'}</span>
                      </div>
                    </td>
                    <td>
                      <span className={`status-pill pill-${status}`}>
                        {status.toUpperCase()}
                      </span>
                    </td>
                    <td>
                      <div className="action-buttons">
                        {status !== 'confirmed' && (
                          <button 
                            className="btn-action confirm" 
                            title="Confirm Booking"
                            onClick={() => handleStatusChange(b.id, 'confirmed')}
                          >
                            <CheckCircle size={16} />
                            <span className="action-btn-text">Confirm</span>
                          </button>
                        )}
                        {status !== 'completed' && status === 'confirmed' && (
                          <button 
                            className="btn-action complete" 
                            title="Mark as Completed"
                            onClick={() => handleStatusChange(b.id, 'completed')}
                          >
                            <Clock size={16} />
                            <span className="action-btn-text">Complete</span>
                          </button>
                        )}
                        {status !== 'cancelled' && (
                          <button 
                            className="btn-action cancel" 
                            title="Cancel Booking"
                            onClick={() => handleStatusChange(b.id, 'cancelled')}
                          >
                            <XCircle size={16} />
                            <span className="action-btn-text">Cancel</span>
                          </button>
                        )}
                        <button 
                          className="btn-action delete" 
                          title="Delete Record"
                          onClick={() => handleDelete(b.id)}
                        >
                          <Trash2 size={16} />
                          <span className="action-btn-text">Delete</span>
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default BookingsManager;
