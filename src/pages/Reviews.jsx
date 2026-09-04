import React from 'react';
import { Link } from 'react-router-dom';
import { Star } from 'lucide-react';
import './Reviews.css';

const Reviews = () => {
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
                <span className="big-score">5.0</span>
                <div className="stars-big">
                  <Star size={18} fill="#000" />
                  <Star size={18} fill="#000" />
                  <Star size={18} fill="#000" />
                  <Star size={18} fill="#000" />
                  <Star size={18} fill="#000" />
                </div>
                <span className="review-count">43 reviews</span>
              </div>
              <Link to="/reviews" className="btn-outline write-btn">Write a review</Link>
            </div>
          </div>

          <div className="rating-bars">
            {[5, 4, 3, 2, 1].map((stars) => (
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
                    style={{ width: stars === 5 ? '100%' : '0%' }}
                  ></div>
                </div>
                <span className="row-count">{stars === 5 ? '43' : '0'}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
  );
};

export default Reviews;
