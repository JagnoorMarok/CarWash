import React, { useState, useEffect } from 'react';

const FloatingBookButton = ({ onBook }) => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setVisible(window.scrollY > window.innerHeight * 0.8);
    };
    window.addEventListener('scroll', handleScroll);
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div 
      className="floating-book-container" 
      style={{ 
        opacity: visible ? 1 : 0, 
        pointerEvents: visible ? 'auto' : 'none',
        transition: 'opacity 0.3s ease' 
      }}
    >
      <button className="btn-primary" onClick={onBook}>Book Now</button>
    </div>
  );
};

export default FloatingBookButton;
