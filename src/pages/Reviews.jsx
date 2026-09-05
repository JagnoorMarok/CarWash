import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Star } from 'lucide-react';
import { collection, query, where, onSnapshot } from 'firebase/firestore';
import { db } from '../firebase';
import './Reviews.css';

// 8 baseline 5-star seed reviews
const SEED_RATINGS = [5, 5, 5, 5, 5, 5, 5, 5];

const Reviews = () => {
  const [ratings, setRatings] = useState(SEED_RATINGS);

  useEffect(() => {
    const q = query(collection(db, 'reviews'), where('approved', '==', true));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const liveRatings = snapshot.docs.map(doc => Number(doc.data().rating) || 5);
      setRatings(liveRatings.length > 0 ? liveRatings : SEED_RATINGS);
    }, (err) => console.warn("Reviews count error:", err));

    return () => unsubscribe();
  }, []);

  const totalReviews = ratings.length;
  const avgRating = (ratings.reduce((sum, r) => sum + r, 0) / totalReviews).toFixed(1);

  // Count per star (5, 4, 3, 2, 1)
  const starCounts = {
    5: ratings.filter(r => r === 5).length,
    4: ratings.filter(r => r === 4).length,
    3: ratings.filter(r => r === 3).length,
    2: ratings.filter(r => r === 2).length,
    1: ratings.filter(r => r === 1).length,
  };

  return (
    <div className="reviews-section">
      <div className="reviews-header">
        <h2 className="section-title">Reviews</h2>
        <Link to="/reviews" className="sort-btn">
          See all reviews
        </Link>
      </div>

      <div className="reviews-layout">
        <div className="review-summary-container">
          <div className="review-summary-card">
            <div className="rating-big">
              <span className="big-score">{avgRating}</span>
              <div className="stars-big">
                {[...Array(5)].map((_, i) => (
                  <Star 
                    key={i} 
                    size={18} 
                    fill={i < Math.round(Number(avgRating)) ? "#000" : "none"} 
                    color="#000" 
                  />
                ))}
              </div>
              <span className="review-count">{totalReviews} reviews</span>
            </div>
            <Link to="/reviews" className="btn-outline write-btn">Write a review</Link>
          </div>
        </div>

        <div className="rating-bars">
          {[5, 4, 3, 2, 1].map((stars) => {
            const count = starCounts[stars] || 0;
            const percentage = totalReviews > 0 ? (count / totalReviews) * 100 : 0;
            return (
              <div className="rating-row" key={stars}>
                <div className="stars-small">
                  {[...Array(5)].map((_, i) => (
                    <Star 
                      key={i} 
                      size={12} 
                      fill={i < stars ? "#000" : "none"} 
                      color={i < stars ? "#000" : "var(--border-color)"} 
                    />
                  ))}
                </div>
                <div className="bar-container">
                  <div 
                    className="bar-fill" 
                    style={{ width: `${percentage}%` }}
                  ></div>
                </div>
                <span className="row-count">{count}</span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Reviews;
