import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { collection, query, orderBy, limit, onSnapshot } from 'firebase/firestore';
import { db } from '../firebase';
import './Gallery.css';

const Gallery = () => {
  const [featuredImg, setFeaturedImg] = useState('/assets/gallery1.jpg');

  useEffect(() => {
    const q = query(collection(db, 'gallery'), orderBy('createdAt', 'desc'), limit(1));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      if (!snapshot.empty) {
        const topImage = snapshot.docs[0].data();
        if (topImage?.src) {
          setFeaturedImg(topImage.src);
        }
      }
    }, (err) => console.warn("Homepage gallery error:", err));

    return () => unsubscribe();
  }, []);

  return (
    <div className="gallery-section">
      <h2 className="section-title">Gallery</h2>
      
      <div className="gallery-grid">
        <div className="gallery-item large">
          <img src={featuredImg} alt="Prime Finish Auto Spa Featured Work" />
        </div>
        <div className="gallery-item-col">
          <div className="gallery-item small">
            <img src="/assets/gallery2.jpg" alt="Prime Finish Auto Spa Interior" />
          </div>
          <div className="gallery-item small overlay-container">
            <img src="/assets/team.jpg" alt="More photos" />
            <div className="overlay">
              <Link to="/gallery" className="btn-outline white-bg">Show all photos</Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Gallery;
