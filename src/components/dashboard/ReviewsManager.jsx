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
import { Star, CheckCircle, Trash2, MessageSquare, AlertCircle } from 'lucide-react';
import './ReviewsManager.css';

const ReviewsManager = () => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const q = query(collection(db, 'reviews'), orderBy('createdAt', 'desc'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setReviews(data);
      setLoading(false);
    }, (err) => {
      console.error("Error fetching reviews:", err);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const handleToggleApprove = async (id, currentStatus) => {
    try {
      await updateDoc(doc(db, 'reviews', id), {
        approved: !currentStatus
      });
    } catch (err) {
      console.error("Error updating review:", err);
      alert("Failed to update status");
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this customer review?")) {
      try {
        await deleteDoc(doc(db, 'reviews', id));
      } catch (err) {
        console.error("Error deleting review:", err);
        alert("Failed to delete review");
      }
    }
  };

  return (
    <div className="reviews-manager">
      <div className="rm-header">
        <div>
          <h2>Reviews Management</h2>
          <p>Moderate customer feedback, approve ratings to display on the site, or delete inappropriate submissions.</p>
        </div>
      </div>

      {loading ? (
        <div className="rm-loading">Loading reviews...</div>
      ) : reviews.length === 0 ? (
        <div className="rm-empty">
          <MessageSquare size={48} />
          <h3>No Reviews Yet</h3>
          <p>Customer reviews submitted on the Reviews page will appear here for your approval.</p>
        </div>
      ) : (
        <div className="rm-grid">
          {reviews.map((r) => (
            <div key={r.id} className={`rm-card ${r.approved ? 'approved' : 'pending'}`}>
              <div className="rm-card-top">
                <div>
                  <strong>{r.name || 'Anonymous'}</strong>
                  <div className="rm-stars">
                    {[...Array(5)].map((_, i) => (
                      <Star 
                        key={i} 
                        size={14} 
                        fill={i < (r.rating || 5) ? "#eab308" : "none"} 
                        color="#eab308" 
                      />
                    ))}
                  </div>
                </div>
                <span className={`status-pill ${r.approved ? 'pill-completed' : 'pill-pending'}`}>
                  {r.approved ? 'LIVE' : 'PENDING'}
                </span>
              </div>

              <p className="rm-text">"{r.text}"</p>

              <div className="rm-footer">
                <span className="rm-date">
                  {r.createdAt?.toDate ? r.createdAt.toDate().toLocaleDateString() : 'Recent'}
                </span>
                <div className="rm-actions">
                  <button 
                    className={`btn-action ${r.approved ? 'cancel' : 'complete'}`}
                    onClick={() => handleToggleApprove(r.id, r.approved)}
                    title={r.approved ? 'Unpublish from website' : 'Approve & display on website'}
                  >
                    <CheckCircle size={16} />
                    <span>{r.approved ? 'Hide' : 'Approve'}</span>
                  </button>
                  <button 
                    className="btn-action delete"
                    onClick={() => handleDelete(r.id)}
                    title="Delete review permanently"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ReviewsManager;
