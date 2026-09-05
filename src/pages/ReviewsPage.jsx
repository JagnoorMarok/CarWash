import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Star, ThumbsUp, User } from 'lucide-react';
import { collection, addDoc, serverTimestamp, query, where, onSnapshot } from 'firebase/firestore';
import { db } from '../firebase';
import './ReviewsPage.css';

const defaultSeedReviews = [
  { id: 'seed-1', name: 'Harpreet S.', date: '2 weeks ago', rating: 5, text: 'Absolutely amazing work! My car looks brand new. The attention to detail is unmatched. Will definitely be coming back for all my detailing needs.' },
  { id: 'seed-2', name: 'Michael R.', date: '1 month ago', rating: 5, text: 'Best auto detailing service in the Lower Mainland. They took their time and made sure every inch of my vehicle was spotless. Highly recommend!' },
  { id: 'seed-3', name: 'Jessica L.', date: '1 month ago', rating: 5, text: 'I got the full detail package and ceramic coating. The results are incredible — the paint has a mirror-like finish. Worth every penny.' },
  { id: 'seed-4', name: 'David K.', date: '2 months ago', rating: 5, text: 'Very professional team. They were flexible with scheduling and the quality of work exceeded my expectations. My interior has never looked this clean.' },
  { id: 'seed-5', name: 'Amandeep G.', date: '2 months ago', rating: 5, text: 'Third time coming here and they never disappoint. Consistent quality, fair pricing, and great customer service. 10/10 would recommend.' },
  { id: 'seed-6', name: 'Sarah T.', date: '3 months ago', rating: 5, text: 'Got the interior detailing done and it was phenomenal. They removed stains I thought were permanent. The car smells amazing too!' },
  { id: 'seed-7', name: 'Chris W.', date: '3 months ago', rating: 5, text: 'Paint correction brought my car back to life. The swirl marks are completely gone. These guys really know what they\'re doing.' },
  { id: 'seed-8', name: 'Priya M.', date: '4 months ago', rating: 5, text: 'Wonderful experience from start to finish. Easy booking, friendly staff, and outstanding results. My SUV looks showroom-ready!' },
];

const ReviewsPage = () => {
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({ name: '', rating: 5, text: '' });
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [firestoreReviews, setFirestoreReviews] = useState([]);
  const [helpfulMap, setHelpfulMap] = useState(() => {
    try {
      const saved = localStorage.getItem('primefinish_helpful_reviews');
      return saved ? JSON.parse(saved) : {};
    } catch {
      return {};
    }
  });

  const toggleHelpful = (reviewId) => {
    setHelpfulMap(prev => {
      const currentCount = prev[reviewId]?.count || 0;
      const isLiked = prev[reviewId]?.liked || false;
      const updated = {
        ...prev,
        [reviewId]: {
          liked: !isLiked,
          count: isLiked ? Math.max(0, currentCount - 1) : currentCount + 1
        }
      };
      try {
        localStorage.setItem('primefinish_helpful_reviews', JSON.stringify(updated));
      } catch (e) {
        console.warn("Could not save to localStorage", e);
      }
      return updated;
    });
  };

  useEffect(() => {
    // Listen for approved reviews from Firestore
    const q = query(collection(db, 'reviews'), where('approved', '==', true));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const liveReviews = snapshot.docs.map(doc => {
        const data = doc.data();
        return {
          id: doc.id,
          name: data.name,
          rating: data.rating,
          text: data.text,
          date: data.createdAt?.toDate ? data.createdAt.toDate().toLocaleDateString() : 'Recent'
        };
      });
      setFirestoreReviews(liveReviews);
    }, (error) => {
      console.warn("Firestore reviews listener:", error);
    });

    return () => unsubscribe();
  }, []);

  // If custom approved reviews exist in Firestore, show them; otherwise fallback to default seed reviews
  const allReviews = firestoreReviews.length > 0 ? firestoreReviews : defaultSeedReviews;
  const totalReviews = allReviews.length;
  const avgRating = (allReviews.reduce((sum, r) => sum + (Number(r.rating) || 5), 0) / (totalReviews || 1)).toFixed(1);

  const starCounts = {
    5: allReviews.filter(r => (Number(r.rating) || 5) === 5).length,
    4: allReviews.filter(r => (Number(r.rating) || 5) === 4).length,
    3: allReviews.filter(r => (Number(r.rating) || 5) === 3).length,
    2: allReviews.filter(r => (Number(r.rating) || 5) === 2).length,
    1: allReviews.filter(r => (Number(r.rating) || 5) === 1).length,
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await addDoc(collection(db, 'reviews'), {
        name: formData.name,
        rating: Number(formData.rating) || 5,
        text: formData.text,
        approved: false, // Moderated by default, admin can approve from Dashboard
        createdAt: serverTimestamp()
      });
      setSubmitted(true);
      setShowForm(false);
      setFormData({ name: '', rating: 5, text: '' });
    } catch (err) {
      console.error("Error submitting review:", err);
      alert("Failed to submit review. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="reviews-page">
      <header className="reviews-page-header">
        <Link to="/" className="back-btn">
          <ArrowLeft size={20} />
          <span>Back</span>
        </Link>
        <h1>Reviews</h1>
        <span className="review-total">{totalReviews} reviews</span>
      </header>

      {/* Summary Section */}
      <div className="reviews-page-content">
        <div className="rp-summary">
          <div className="rp-summary-left">
            <span className="rp-big-score">{avgRating}</span>
            <div className="rp-stars-row">
              {[...Array(5)].map((_, i) => (
                <Star 
                  key={i} 
                  size={20} 
                  fill={i < Math.round(Number(avgRating)) ? "#000" : "none"} 
                  color="#000" 
                />
              ))}
            </div>
            <span className="rp-total-text">Based on {totalReviews} reviews</span>
          </div>
          <div className="rp-bars">
            {[5, 4, 3, 2, 1].map((stars) => {
              const count = starCounts[stars] || 0;
              const pct = totalReviews > 0 ? (count / totalReviews) * 100 : 0;
              return (
                <div className="rp-bar-row" key={stars}>
                  <span className="rp-bar-label">{stars}</span>
                  <Star size={12} fill="#000" />
                  <div className="rp-bar-track">
                    <div className="rp-bar-fill" style={{ width: `${pct}%` }} />
                  </div>
                  <span className="rp-bar-count">{count}</span>
                </div>
              );
            })}
          </div>
        </div>

        <button className="btn-primary rp-write-btn" onClick={() => setShowForm(!showForm)}>
          {showForm ? 'Cancel' : 'Write a Review'}
        </button>

        {/* Write Review Form */}
        {showForm && (
          <form className="rp-form" onSubmit={handleSubmit}>
            <div className="rp-form-group">
              <label>Your Name</label>
              <input 
                type="text" required placeholder="Your name"
                value={formData.name} 
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              />
            </div>
            <div className="rp-form-group">
              <label>Rating</label>
              <div className="rp-star-picker">
                {[1, 2, 3, 4, 5].map((s) => (
                  <Star 
                    key={s} size={28} 
                    fill={s <= formData.rating ? '#000' : 'none'}
                    color="#000"
                    style={{ cursor: 'pointer' }}
                    onClick={() => setFormData({ ...formData, rating: s })}
                  />
                ))}
              </div>
            </div>
            <div className="rp-form-group">
              <label>Your Review</label>
              <textarea 
                rows="4" required placeholder="Tell us about your experience..."
                value={formData.text}
                onChange={(e) => setFormData({ ...formData, text: e.target.value })}
              />
            </div>
            <button type="submit" disabled={submitting} className="btn-primary rp-submit-btn">
              {submitting ? 'Submitting...' : 'Submit Review'}
            </button>
          </form>
        )}

        {/* Success message */}
        {submitted && (
          <div className="rp-success">
            ✓ Thank you for your review! It will appear on the website once approved by our team.
          </div>
        )}

        {/* Reviews List */}
        <div className="rp-list">
          {allReviews.map((review) => (
            <div className="rp-card" key={review.id}>
              <div className="rp-card-header">
                <div className="rp-avatar">
                  <User size={20} />
                </div>
                <div className="rp-card-meta">
                  <span className="rp-card-name">{review.name}</span>
                  <span className="rp-card-date">{review.date}</span>
                </div>
                <div className="rp-card-stars">
                  {[...Array(review.rating || 5)].map((_, i) => (
                    <Star key={i} size={12} fill="#000" />
                  ))}
                </div>
              </div>
              <p className="rp-card-text">{review.text}</p>
              <button 
                className={`rp-helpful-btn ${helpfulMap[review.id]?.liked ? 'active' : ''}`}
                onClick={() => toggleHelpful(review.id)}
                aria-label="Mark review as helpful"
              >
                <ThumbsUp 
                  size={14} 
                  fill={helpfulMap[review.id]?.liked ? "currentColor" : "none"} 
                />
                <span>
                  {helpfulMap[review.id]?.liked ? 'Helpful' : 'Helpful'}
                  {helpfulMap[review.id]?.count > 0 ? ` (${helpfulMap[review.id].count})` : ''}
                </span>
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ReviewsPage;
