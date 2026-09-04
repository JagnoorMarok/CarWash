import React from 'react';
import { Link } from 'react-router-dom';
import './Gallery.css';

const Gallery = () => {
  return (
    <div className="gallery-section">
        <h2 className="section-title">Gallery</h2>
        
        <div className="gallery-grid">
          <div className="gallery-item large">
            <img src="/assets/gallery1.jpg" alt="Prime Finish Auto Spa Exterior" />
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
