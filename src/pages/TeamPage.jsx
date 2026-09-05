import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Award, Clock, Shield, Sparkles } from 'lucide-react';
import { collection, query, orderBy, onSnapshot } from 'firebase/firestore';
import { db } from '../firebase';
import './TeamPage.css';

const defaultSeedMembers = [
  {
    id: 'seed-1',
    name: 'Arjun P.',
    role: 'Founder & Lead Detailer',
    photo: '/assets/team1.jpg',
    bio: 'With over 8 years of experience in auto detailing, Arjun founded Prime Finish Auto Spa with a mission to deliver showroom-quality finishes for every vehicle. Certified in ceramic coating and paint correction.',
    specialties: ['Ceramic Coating', 'Paint Correction', 'Customer Relations'],
  },
  {
    id: 'seed-2',
    name: 'Marcus D.',
    role: 'Senior Detailer',
    photo: '/assets/team2.jpg',
    bio: 'Marcus brings 5 years of detailing expertise with a particular focus on interior restoration and leather care. His meticulous eye for detail ensures every cabin looks and smells brand new.',
    specialties: ['Interior Detailing', 'Leather Restoration', 'Steam Cleaning'],
  },
  {
    id: 'seed-3',
    name: 'Prime Finish Team',
    role: 'The Crew',
    photo: '/assets/team.jpg',
    bio: 'Our dedicated team works together to deliver exceptional results on every project. From sedans to SUVs, we treat every vehicle like it\'s our own — because your satisfaction drives us.',
    specialties: ['Full Detailing', 'Exterior Wash', 'Quality Assurance'],
  },
];

const values = [
  { icon: <Sparkles size={24} />, title: 'Premium Quality', desc: 'We use only the best professional-grade products and tools.' },
  { icon: <Shield size={24} />, title: 'Trusted Service', desc: '5.0 rating with customer satisfaction guarantee.' },
  { icon: <Clock size={24} />, title: 'Reliable Schedule', desc: 'On-time service with flexible booking options.' },
  { icon: <Award size={24} />, title: 'Certified Experts', desc: 'Trained and certified in the latest detailing techniques.' },
];

const TeamPage = () => {
  const [customMembers, setCustomMembers] = useState([]);

  useEffect(() => {
    const q = query(collection(db, 'team'), orderBy('createdAt', 'asc'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const live = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setCustomMembers(live);
    }, (err) => console.warn("Team listener error:", err));

    return () => unsubscribe();
  }, []);

  // If user configured custom team members, show them; otherwise fallback to default seed team
  const displayMembers = customMembers.length > 0 ? customMembers : defaultSeedMembers;
  return (
    <div className="team-page">
      <header className="team-page-header">
        <Link to="/" className="back-btn">
          <ArrowLeft size={20} />
          <span>Back</span>
        </Link>
        <h1>Our Team</h1>
      </header>

      {/* Hero Banner */}
      <div className="tp-hero">
        <img src="/assets/gallery4.jpg" alt="Team at work" className="tp-hero-img" />
        <div className="tp-hero-overlay">
          <h2>Meet the People Behind the Shine</h2>
          <p>Passionate professionals dedicated to making your vehicle look its absolute best.</p>
        </div>
      </div>

      <div className="tp-content">
        {/* Team Members */}
        <section className="tp-members">
          {displayMembers.map((member, i) => (
            <div className="tp-member-card" key={member.id || i}>
              <div className="tp-member-photo">
                <img src={member.photo || '/assets/team.jpg'} alt={member.name} />
              </div>
              <div className="tp-member-info">
                <h3>{member.name}</h3>
                <span className="tp-role">{member.role}</span>
                <p className="tp-bio">{member.bio}</p>
                {member.specialties?.length > 0 && (
                  <div className="tp-specialties">
                    {member.specialties.map((s, j) => (
                      <span className="tp-tag" key={j}>{s}</span>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ))}
        </section>

        {/* Values */}
        <section className="tp-values">
          <h2 className="tp-values-title">Why Choose Us</h2>
          <div className="tp-values-grid">
            {values.map((v, i) => (
              <div className="tp-value-card" key={i}>
                <div className="tp-value-icon">{v.icon}</div>
                <h4>{v.title}</h4>
                <p>{v.desc}</p>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
};

export default TeamPage;
