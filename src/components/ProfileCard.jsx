import React, { useState, useEffect } from 'react';
import { Star, Clock } from 'lucide-react';
import { collection, query, where, onSnapshot } from 'firebase/firestore';
import { db } from '../firebase';
import './ProfileCard.css';

const SEED_RATINGS = [5, 5, 5, 5, 5, 5, 5, 5];

const ProfileCard = () => {
  const [ratings, setRatings] = useState(SEED_RATINGS);

  useEffect(() => {
    const q = query(collection(db, 'reviews'), where('approved', '==', true));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const liveRatings = snapshot.docs.map(doc => Number(doc.data().rating) || 5);
      setRatings(liveRatings.length > 0 ? liveRatings : SEED_RATINGS);
    }, (err) => console.warn("ProfileCard reviews count error:", err));

    return () => unsubscribe();
  }, []);

  const totalCount = ratings.length;
  const avgRating = (ratings.reduce((sum, r) => sum + r, 0) / (totalCount || 1)).toFixed(1);

  return (
    <div className="profile-card page-section">
      <div className="profile-image">
        <img src="/assets/logo.png" alt="Prime Finish Auto Spa" style={{ width: '100%', height: '100%', objectFit: 'contain', padding: '4px' }} />
      </div>
      <div className="profile-info">
        <h1>Prime Finish Auto Spa</h1>
        <div className="rating">
          <span className="score">{avgRating}</span>
          <div className="stars">
            {[...Array(5)].map((_, i) => (
              <Star 
                key={i} 
                size={14} 
                fill={i < Math.round(Number(avgRating)) ? "#000" : "none"} 
                color="#000" 
              />
            ))}
          </div>
          <span className="review-count">({totalCount})</span>
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
