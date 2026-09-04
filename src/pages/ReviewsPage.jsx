import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Star, ThumbsUp, User } from 'lucide-react';
import './ReviewsPage.css';

const existingReviews = [
  { id: 1, name: 'Harpreet S.', date: '2 weeks ago', rating: 5, text: 'Absolutely amazing work! My car looks brand new. The attention to detail is unmatched. Will definitely be coming back for all my detailing needs.' },
  { id: 2, name: 'Michael R.', date: '1 month ago', rating: 5, text: 'Best auto detailing service in the Lower Mainland. They took their time and made sure every inch of my vehicle was spotless. Highly recommend!' },
  { id: 3, name: 'Jessica L.', date: '1 month ago', rating: 5, text: 'I got the full detail package and ceramic coating. The results are incredible — the paint has a mirror-like finish. Worth every penny.' },
  { id: 4, name: 'David K.', date: '2 months ago', rating: 5, text: 'Very professional team. They were flexible with scheduling and the quality of work exceeded my expectations. My interior has never looked this clean.' },
  { id: 5, name: 'Amandeep G.', date: '2 months ago', rating: 5, text: 'Third time coming here and they never disappoint. Consistent quality, fair pricing, and great customer service. 10/10 would recommend.' },
  { id: 6, name: 'Sarah T.', date: '3 months ago', rating: 5, text: 'Got the interior detailing done and it was phenomenal. They removed stains I thought were permanent. The car smells amazing too!' },
  { id: 7, name: 'Chris W.', date: '3 months ago', rating: 5, text: 'Paint correction brought my car back to life. The swirl marks are completely gone. These guys really know what they\'re doing.' },
  { id: 8, name: 'Priya M.', date: '4 months ago', rating: 5, text: 'Wonderful experience from start to finish. Easy booking, friendly staff, and outstanding results. My SUV looks showroom-ready!' },
];

const ReviewsPage = () => {
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({ name: '', rating: 5, text: '' });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
    setShowForm(false);
  };

  return (
    <div className="reviews-page">
      <header className="reviews-page-header">
        <Link to="/" className="back-btn">
          <ArrowLeft size={20} />
          <span>Back</span>
        </Link>
        <h1>Reviews</h1>
        <span className="review-total">{existingReviews.length} reviews</span>
      </header>

      {/* Summary Section */}
      <div className="reviews-page-content">
        <div className="rp-summary">
          <div className="rp-summary-left">
            <span className="rp-big-score">5.0</span>
            <div className="rp-stars-row">
              {[...Array(5)].map((_, i) => (
                <Star key={i} size={20} fill="#000" />
              ))}
            </div>
            <span className="rp-total-text">Based on {existingReviews.length} reviews</span>
          </div>
          <div className="rp-bars">
            {[5, 4, 3, 2, 1].map((stars) => (
              <div className="rp-bar-row" key={stars}>
                <span className="rp-bar-label">{stars}</span>
                <Star size={12} fill="#000" />
                <div className="rp-bar-track">
                  <div className="rp-bar-fill" style={{ width: stars === 5 ? '100%' : '0%' }} />
                </div>
                <span className="rp-bar-count">{stars === 5 ? existingReviews.length : '0'}</span>
              </div>
            ))}
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
            <button type="submit" className="btn-primary rp-submit-btn">Submit Review</button>
          </form>
        )}

        {/* Success message */}
        {submitted && (
          <div className="rp-success">
            ✓ Thank you for your review! It will appear after moderation.
          </div>
        )}

        {/* Reviews List */}
        <div className="rp-list">
          {existingReviews.map((review) => (
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
                  {[...Array(review.rating)].map((_, i) => (
                    <Star key={i} size={12} fill="#000" />
                  ))}
                </div>
              </div>
              <p className="rp-card-text">{review.text}</p>
              <button className="rp-helpful-btn">
                <ThumbsUp size={14} />
                <span>Helpful</span>
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ReviewsPage;
