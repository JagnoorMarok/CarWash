import React from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';
import './Team.css';

const Team = () => {
  return (
    <div className="team-section">
      <h2 className="section-title">Team</h2>
      <div className="team-grid">
        <Link to="/team" className="team-card">
          <div className="team-card-image">
            <img src="/assets/team.jpg" alt="Prime Finish Auto Spa Team" />
          </div>
          <div className="team-card-content">
            <span className="team-name">Prime Finish Auto Spa</span>
            <ChevronRight size={20} color="var(--text-secondary)" />
          </div>
        </Link>
      </div>
    </div>
  );
};

export default Team;
