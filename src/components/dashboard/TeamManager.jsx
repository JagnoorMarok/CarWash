import React, { useState, useEffect } from 'react';
import { 
  collection, 
  query, 
  orderBy, 
  onSnapshot, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  doc, 
  serverTimestamp 
} from 'firebase/firestore';
import { db } from '../../firebase';
import { Users, Plus, Edit2, Trash2, UploadCloud, Link as LinkIcon, CheckCircle } from 'lucide-react';
import './TeamManager.css';

const defaultSeedTeam = [
  {
    id: 'seed-1',
    name: 'Arjun P.',
    role: 'Founder & Lead Detailer',
    photo: '/assets/team1.jpg',
    bio: 'With over 8 years of experience in auto detailing, Arjun founded Prime Finish Auto Spa with a mission to deliver showroom-quality finishes for every vehicle. Certified in ceramic coating and paint correction.',
    specialties: ['Ceramic Coating', 'Paint Correction', 'Customer Relations'],
    isDefault: true
  },
  {
    id: 'seed-2',
    name: 'Marcus D.',
    role: 'Senior Detailer',
    photo: '/assets/team2.jpg',
    bio: 'Marcus brings 5 years of detailing expertise with a particular focus on interior restoration and leather care. His meticulous eye for detail ensures every cabin looks and smells brand new.',
    specialties: ['Interior Detailing', 'Leather Restoration', 'Steam Cleaning'],
    isDefault: true
  },
  {
    id: 'seed-3',
    name: 'Prime Finish Team',
    role: 'The Crew',
    photo: '/assets/team.jpg',
    bio: 'Our dedicated team works together to deliver exceptional results on every project. From sedans to SUVs, we treat every vehicle like it\'s our own — because your satisfaction drives us.',
    specialties: ['Full Detailing', 'Exterior Wash', 'Quality Assurance'],
    isDefault: true
  }
];

const TeamManager = () => {
  const [teamMembers, setTeamMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState(null);

  const [formData, setFormData] = useState({
    name: '',
    role: '',
    photo: '',
    bio: '',
    specialties: ''
  });
  const [photoMode, setPhotoMode] = useState('url'); // 'url' or 'file'
  const [fileBase64, setFileBase64] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const q = query(collection(db, 'team'), orderBy('createdAt', 'asc'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map(d => ({
        id: d.id,
        ...d.data()
      }));
      setTeamMembers(data);
      setLoading(false);
    }, (err) => {
      console.warn("Team listener error:", err);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const openAddModal = () => {
    setEditingId(null);
    setFormData({ name: '', role: '', photo: '', bio: '', specialties: '' });
    setFileBase64('');
    setShowModal(true);
  };

  const openEditModal = (member) => {
    setEditingId(member.id);
    setFormData({
      name: member.name || '',
      role: member.role || '',
      photo: member.photo || '',
      bio: member.bio || '',
      specialties: Array.isArray(member.specialties) ? member.specialties.join(', ') : (member.specialties || '')
    });
    setFileBase64('');
    setPhotoMode(member.photo?.startsWith('data:') ? 'file' : 'url');
    setShowModal(true);
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 1048576) {
        alert("Please choose a photo under 1MB.");
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setFileBase64(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const finalPhoto = photoMode === 'file' ? (fileBase64 || formData.photo) : formData.photo.trim();

    if (!formData.name.trim() || !formData.role.trim()) {
      alert("Please provide member name and role.");
      return;
    }

    setSaving(true);
    const specialtiesArray = formData.specialties
      ? formData.specialties.split(',').map(s => s.trim()).filter(Boolean)
      : [];

    try {
      if (editingId) {
        // Update existing in Firestore
        await updateDoc(doc(db, 'team', editingId), {
          name: formData.name.trim(),
          role: formData.role.trim(),
          photo: finalPhoto || '/assets/team.jpg',
          bio: formData.bio.trim(),
          specialties: specialtiesArray,
          updatedAt: serverTimestamp()
        });
      } else {
        // Add new to Firestore
        await addDoc(collection(db, 'team'), {
          name: formData.name.trim(),
          role: formData.role.trim(),
          photo: finalPhoto || '/assets/team.jpg',
          bio: formData.bio.trim(),
          specialties: specialtiesArray,
          createdAt: serverTimestamp()
        });
      }

      setShowModal(false);
      setEditingId(null);
    } catch (err) {
      console.error("Error saving team member:", err);
      alert("Failed to save team member details.");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Delete this team member from the website?")) {
      try {
        await deleteDoc(doc(db, 'team', id));
      } catch (err) {
        console.error("Error deleting team member:", err);
        alert("Failed to delete member.");
      }
    }
  };

  return (
    <div className="team-manager">
      <div className="tm-header">
        <div>
          <h2>Team Members Management</h2>
          <p>Add new staff members, edit bios and specialties, or remove profiles displayed on the team page.</p>
        </div>
        <button className="btn-primary tm-add-btn" onClick={openAddModal}>
          <Plus size={18} />
          <span>Add Team Member</span>
        </button>
      </div>

      {showModal && (
        <div className="tm-modal-backdrop" onClick={() => setShowModal(false)}>
          <div className="tm-modal-card" onClick={(e) => e.stopPropagation()}>
            <div className="tm-modal-header">
              <h3>{editingId ? 'Edit Team Member' : 'Add New Team Member'}</h3>
              <button className="tm-close-btn" onClick={() => setShowModal(false)}>×</button>
            </div>

            <form onSubmit={handleSubmit} className="tm-form">
              <div className="tm-form-scrollable">
                <div className="tm-row">
                  <div className="tm-input-group">
                    <label htmlFor="tm-name">Full Name *</label>
                    <input 
                      id="tm-name"
                      type="text" 
                      required 
                      placeholder="e.g. Jason V."
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    />
                  </div>
                  <div className="tm-input-group">
                    <label htmlFor="tm-role">Role / Position *</label>
                    <input 
                      id="tm-role"
                      type="text" 
                      required 
                      placeholder="e.g. Paint Correction Specialist"
                      value={formData.role}
                      onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                    />
                  </div>
                </div>

                {/* Photo Selection */}
                <div className="tm-input-group">
                  <label>Profile Picture</label>
                  <div className="tm-mode-toggle">
                    <button 
                      type="button" 
                      className={photoMode === 'url' ? 'active' : ''} 
                      onClick={() => setPhotoMode('url')}
                    >
                      <LinkIcon size={14} /> <span>Image URL</span>
                    </button>
                    <button 
                      type="button" 
                      className={photoMode === 'file' ? 'active' : ''} 
                      onClick={() => setPhotoMode('file')}
                    >
                      <UploadCloud size={14} /> <span>Upload File</span>
                    </button>
                  </div>

                  <div className="tm-photo-picker-row">
                    <div className="tm-photo-input-col">
                      {photoMode === 'url' ? (
                        <input 
                          type="url" 
                          placeholder="https://example.com/photo.jpg or /assets/team1.jpg"
                          value={formData.photo}
                          onChange={(e) => setFormData({ ...formData, photo: e.target.value })}
                        />
                      ) : (
                        <div className="tm-file-dropzone">
                          <input 
                            type="file" 
                            accept="image/*"
                            onChange={handleFileChange}
                          />
                          <span className="file-hint">Choose an image under 1MB</span>
                        </div>
                      )}
                    </div>

                    <div className="tm-preview-container">
                      <div className="tm-preview-circle">
                        <img 
                          src={fileBase64 || formData.photo || '/assets/team.jpg'} 
                          alt="Preview" 
                          onError={(e) => { e.target.src = '/assets/team.jpg'; }}
                        />
                      </div>
                      <span className="tm-preview-text">Preview</span>
                    </div>
                  </div>
                </div>

                <div className="tm-input-group">
                  <label htmlFor="tm-bio">Biography</label>
                  <textarea 
                    id="tm-bio"
                    rows="3" 
                    placeholder="Tell clients about their detailing experience, craft, and background..."
                    value={formData.bio}
                    onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                  />
                </div>

                <div className="tm-input-group">
                  <label htmlFor="tm-specialties">Specialties (comma-separated)</label>
                  <input 
                    id="tm-specialties"
                    type="text" 
                    placeholder="Ceramic Coating, Leather Care, Paint Correction"
                    value={formData.specialties}
                    onChange={(e) => setFormData({ ...formData, specialties: e.target.value })}
                  />
                  <span className="input-hint">Tags will appear as rounded badges on the team member card</span>
                </div>
              </div>

              <div className="tm-modal-footer">
                <button type="button" className="btn-action cancel" onClick={() => setShowModal(false)}>
                  Cancel
                </button>
                <button type="submit" disabled={saving} className="btn-primary tm-submit-btn">
                  {saving ? 'Saving...' : editingId ? 'Update Member' : 'Add Member'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {loading ? (
        <div className="tm-loading">Loading team members...</div>
      ) : (
        <div className="tm-sections">
          {/* Custom Firestore Team Members */}
          <div className="tm-group">
            <h3 className="tm-group-title">Active Team Members ({teamMembers.length})</h3>
            {teamMembers.length === 0 ? (
              <div className="tm-empty">
                <Users size={40} />
                <p>No custom team members added yet. Click <strong>Add Team Member</strong> above to publish team profiles.</p>
              </div>
            ) : (
              <div className="tm-grid">
                {teamMembers.map((m) => (
                  <div key={m.id} className="tm-card">
                    <div className="tm-card-photo">
                      <img src={m.photo || '/assets/team.jpg'} alt={m.name} />
                    </div>
                    <div className="tm-card-body">
                      <div className="tm-card-main">
                        <strong>{m.name}</strong>
                        <span className="tm-role-tag">{m.role}</span>
                        <p className="tm-bio-text">{m.bio}</p>
                        {m.specialties?.length > 0 && (
                          <div className="tm-tags">
                            {m.specialties.map((s, idx) => (
                              <span key={idx} className="tm-tag">{s}</span>
                            ))}
                          </div>
                        )}
                      </div>
                      <div className="tm-card-actions">
                        <button className="btn-action edit" onClick={() => openEditModal(m)} title="Edit profile">
                          <Edit2 size={16} />
                          <span>Edit</span>
                        </button>
                        <button className="btn-action delete" onClick={() => handleDelete(m.id)} title="Delete member">
                          <Trash2 size={16} />
                          <span>Delete</span>
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Built-in default members notice (Only shown when no custom members configured yet) */}
          {teamMembers.length === 0 && (
            <div className="tm-group default-group">
              <h3 className="tm-group-title">Starter Baseline Profiles ({defaultSeedTeam.length})</h3>
              <p className="tm-group-subtitle">These baseline profiles show automatically until you add custom members above.</p>
              <div className="tm-grid">
                {defaultSeedTeam.map((m) => (
                  <div key={m.id} className="tm-card default-card">
                    <div className="tm-card-photo">
                      <img src={m.photo} alt={m.name} />
                    </div>
                    <div className="tm-card-body">
                      <div className="tm-card-main">
                        <strong>{m.name}</strong>
                        <span className="tm-role-tag">{m.role}</span>
                        <p className="tm-bio-text">{m.bio}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default TeamManager;
