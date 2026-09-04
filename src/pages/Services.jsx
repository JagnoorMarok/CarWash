import React, { useState } from 'react';
import { ChevronDown, ChevronUp, CheckCircle2 } from 'lucide-react';
import './Services.css';

const servicesData = [
  {
    id: 'EXTERIOR WASH',
    title: 'Exterior Wash',
    description: 'Professional exterior hand washing, rim and tire detailing, streak-free window cleaning, and high-gloss protective finish.',
    features: [
      'Exterior hand wash & foam bath',
      'Wheel & tire deep cleaning',
      'Streak-free exterior window finish',
      'High-gloss spray protection'
    ]
  },
  {
    id: 'INTERIOR CLEANING',
    title: 'Interior Cleaning',
    description: 'Thorough interior deep cleaning, complete vacuuming, detailed surface wipe-down, dash and console rejuvenation, and clean door jambs.',
    features: [
      'Thorough cabin & trunk vacuuming',
      'Detailed surface & vent cleaning',
      'Dashboard & console rejuvenation',
      'Door jambs & glass cleaned'
    ]
  },
  {
    id: 'EXTERIOR AND INTERIOR',
    title: 'Exterior and Interior',
    description: 'Includes a thorough exterior wash and interior cleaning, including detailed steaming of seats and interior surfaces.',
    features: [
      'Thorough exterior hand wash & rim cleaning',
      'Complete interior deep cleaning & vacuuming',
      'Detailed steaming of seats and interior surfaces',
      'Steam disinfection & stain removal treatment',
      'Interior shampooing & surface conditioning'
    ]
  },
  {
    id: 'PACKAGES',
    title: 'Packages',
    description: 'Comprehensive detailing packages designed to restore and maintain your vehicle in showroom condition with long-lasting protection.',
    features: [
      'Full vehicle restoration & deep steam detailing',
      'Steam disinfection & odor neutralization',
      'Protective finishes for interior & exterior',
      'Custom packages tailored to your vehicle'
    ]
  }
];

const Services = () => {
  const [openSection, setOpenSection] = useState('EXTERIOR AND INTERIOR');

  const toggleSection = (section) => {
    setOpenSection(openSection === section ? null : section);
  };

  return (
    <div className="services-layout">
      <div className="services-section">
        <h2 className="section-title">Services</h2>
        
        <div className="accordion">
          {servicesData.map((service) => (
            <div className="accordion-item" key={service.id}>
              <button 
                className="accordion-header"
                onClick={() => toggleSection(service.id)}
              >
                <span>{service.title}</span>
                {openSection === service.id ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
              </button>
              {openSection === service.id && (
                <div className="accordion-content">
                  <p className="service-desc">{service.description}</p>
                  <ul className="service-features">
                    {service.features.map((feat, idx) => (
                      <li key={idx} className="service-feature-item">
                        <CheckCircle2 size={16} className="feature-icon" />
                        <span>{feat}</span>
                      </li>
                    ))}
                  </ul>
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
