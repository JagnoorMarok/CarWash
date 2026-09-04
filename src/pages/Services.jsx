import React, { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';
import './Services.css';

const Services = () => {
  const [openSection, setOpenSection] = useState('INTERIOR');

  const toggleSection = (section) => {
    setOpenSection(openSection === section ? null : section);
  };

  return (
    <div className="services-layout">

      <div className="services-section">
        <h2 className="section-title">Services</h2>
        
        <div className="accordion">
          {['INTERIOR', 'EXTERIOR', 'PACKAGES'].map((section) => (
            <div className="accordion-item" key={section}>
              <button 
                className="accordion-header"
                onClick={() => toggleSection(section)}
              >
                <span>{section}</span>
                {openSection === section ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
              </button>
              {openSection === section && (
                <div className="accordion-content">
                  <p>Premium {section.toLowerCase()} detailing service tailored for your vehicle.</p>
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
