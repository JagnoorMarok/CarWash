import React from 'react';
import { Star, Clock } from 'lucide-react';
import './ProfileCard.css';

const ProfileCard = () => {
  return (
    <div className="profile-card page-section">
      <div className="profile-image">
        <img src="/assets/logo.png" alt="Prime Finish Auto Spa" style={{ width: '100%', height: '100%', objectFit: 'contain', padding: '4px' }} />
      </div>
      <div className="profile-info">
        <h1>Prime Finish Auto Spa</h1>
        <div className="rating">
          <span className="score">5.0</span>
          <div className="stars">
            <Star size={14} fill="#000" />
            <Star size={14} fill="#000" />
            <Star size={14} fill="#000" />
            <Star size={14} fill="#000" />
            <Star size={14} fill="#000" />
          </div>
          <span className="review-count">(43)</span>
        </div>
        <div className="hours">
          <Clock size={14} />
          <span>Open · Closes at 10 PM</span>
        </div>
      </div>
    </div>
  );
};

export default ProfileCard;
