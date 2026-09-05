import React, { useState, useEffect } from 'react';
import { ChevronDown, ChevronUp, CheckCircle2, Tag } from 'lucide-react';
import { collection, query, orderBy, onSnapshot } from 'firebase/firestore';
import { db } from '../firebase';
import { defaultSeedServices } from '../components/dashboard/ServicesManager';
import './Services.css';

const Services = () => {
  const [customServices, setCustomServices] = useState([]);
  const [openSection, setOpenSection] = useState(null);

  useEffect(() => {
    const q = query(collection(db, 'services'), orderBy('order', 'asc'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const live = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setCustomServices(live);
      if (live.length > 0 && !openSection) {
        setOpenSection(live[0].id);
      }
    }, (err) => {
      console.warn("Services listener error:", err);
    });

    return () => unsubscribe();
  }, []);

  const displayServices = customServices.length > 0 ? customServices : defaultSeedServices;

  // Default to first open item if not selected
  const currentOpen = openSection || displayServices[0]?.id;

  const toggleSection = (sectionId) => {
    setOpenSection(currentOpen === sectionId ? null : sectionId);
  };

  return (
    <div className="services-layout">
      <div className="services-section">
        <h2 className="section-title">Services</h2>
        
        <div className="accordion">
          {displayServices.map((service) => (
            <div className="accordion-item" key={service.id}>
              <button 
                className="accordion-header"
                onClick={() => toggleSection(service.id)}
              >
                <div className="accordion-title-col">
                  <span>{service.title}</span>
                  {service.price && <span className="service-header-price">{service.price}</span>}
                </div>
                {currentOpen === service.id ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
              </button>
              {currentOpen === service.id && (
                <div className="accordion-content">
                  <p className="service-desc">{service.description}</p>
                  {service.features?.length > 0 && (
                    <ul className="service-features">
                      {service.features.map((feat, idx) => (
                        <li key={idx} className="service-feature-item">
                          <CheckCircle2 size={16} className="feature-icon" />
                          <span>{feat}</span>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Services;
