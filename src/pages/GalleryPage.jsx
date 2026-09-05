import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, X } from 'lucide-react';
import { collection, query, orderBy, onSnapshot } from 'firebase/firestore';
import { db } from '../firebase';
import './GalleryPage.css';

const defaultImages = [
  { src: '/assets/gallery1.jpg', label: 'Exterior Detail' },
  { src: '/assets/gallery2.jpg', label: 'Interior Cleaning' },
  { src: '/assets/gallery3.jpg', label: 'Full Body Polish' },
  { src: '/assets/gallery4.jpg', label: 'Ceramic Coating' },
  { src: '/assets/gallery5.jpg', label: 'Interior Restoration' },
  { src: '/assets/team.jpg', label: 'Our Team' },
];

const GalleryPage = () => {
  const [lightbox, setLightbox] = useState(null);
  const [customImages, setCustomImages] = useState([]);

  useEffect(() => {
    const q = query(collection(db, 'gallery'), orderBy('createdAt', 'desc'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const live = snapshot.docs.map(doc => ({
        id: doc.id,
        src: doc.data().src,
        label: doc.data().label || 'Auto Detailing'
      }));
      setCustomImages(live);
    }, (error) => {
      console.warn("Gallery listener error:", error);
    });

    return () => unsubscribe();
  }, []);

  // Show custom images if user added any in Firestore, otherwise fallback to default templates
  const allImages = customImages.length > 0 ? customImages : defaultImages;

  return (
    <div className="gallery-page">
      <header className="gallery-page-header">
        <Link to="/" className="back-btn">
          <ArrowLeft size={20} />
          <span>Back</span>
        </Link>
        <h1>Gallery</h1>
        <span className="photo-count">{allImages.length} photos</span>
      </header>

      <div className="gallery-page-grid">
        {allImages.map((img, i) => (
          <div className="gallery-page-item" key={img.id || i} onClick={() => setLightbox(i)}>
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
            src={allImages[lightbox].src} 
            alt={allImages[lightbox].label} 
            className="lightbox-img"
            onClick={(e) => e.stopPropagation()}
          />
          <p className="lightbox-label">{allImages[lightbox].label}</p>
          <div className="lightbox-nav">
            <button 
              disabled={lightbox === 0} 
              onClick={(e) => { e.stopPropagation(); setLightbox(lightbox - 1); }}
            >
              ←
            </button>
            <span>{lightbox + 1} / {allImages.length}</span>
            <button 
              disabled={lightbox === allImages.length - 1} 
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
