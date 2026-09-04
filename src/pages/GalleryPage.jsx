import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, X } from 'lucide-react';
import './GalleryPage.css';

const images = [
  { src: '/assets/gallery1.jpg', label: 'Exterior Detail' },
  { src: '/assets/gallery2.jpg', label: 'Interior Cleaning' },
  { src: '/assets/gallery3.jpg', label: 'Full Body Polish' },
  { src: '/assets/gallery4.jpg', label: 'Ceramic Coating' },
  { src: '/assets/gallery5.jpg', label: 'Interior Restoration' },
  { src: '/assets/team.jpg', label: 'Our Team' },
];

const GalleryPage = () => {
  const [lightbox, setLightbox] = useState(null);

  return (
    <div className="gallery-page">
      <header className="gallery-page-header">
        <Link to="/" className="back-btn">
          <ArrowLeft size={20} />
          <span>Back</span>
        </Link>
        <h1>Gallery</h1>
        <span className="photo-count">{images.length} photos</span>
      </header>

      <div className="gallery-page-grid">
        {images.map((img, i) => (
          <div className="gallery-page-item" key={i} onClick={() => setLightbox(i)}>
            <img src={img.src} alt={img.label} />
            <div className="gallery-page-label">{img.label}</div>
          </div>
        ))}
      </div>

      {/* Lightbox */}
      {lightbox !== null && (
        <div className="lightbox-backdrop" onClick={() => setLightbox(null)}>
          <button className="lightbox-close" onClick={() => setLightbox(null)}>
            <X size={28} />
          </button>
          <img 
            src={images[lightbox].src} 
            alt={images[lightbox].label} 
            className="lightbox-img"
            onClick={(e) => e.stopPropagation()}
          />
          <p className="lightbox-label">{images[lightbox].label}</p>
          <div className="lightbox-nav">
            <button 
              disabled={lightbox === 0} 
              onClick={(e) => { e.stopPropagation(); setLightbox(lightbox - 1); }}
            >
              ←
            </button>
            <span>{lightbox + 1} / {images.length}</span>
            <button 
              disabled={lightbox === images.length - 1} 
              onClick={(e) => { e.stopPropagation(); setLightbox(lightbox + 1); }}
            >
              →
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default GalleryPage;
