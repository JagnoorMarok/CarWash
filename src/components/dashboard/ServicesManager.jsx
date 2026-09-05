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
import { Sparkles, Plus, Edit2, Trash2, CheckCircle2, Tag } from 'lucide-react';
import './ServicesManager.css';

export const extractPrice = (priceVal) => {
  if (typeof priceVal === 'number') return priceVal;
  if (!priceVal) return 0;
  // Match digits with optional decimal (e.g. "$79", "79", "$149.50", "Starting at $169")
  const match = String(priceVal).match(/\$?\s*([0-9]+(?:\.[0-9]{1,2})?)/);
  return match ? parseFloat(match[1]) : 0;
};

export const defaultSeedServices = [
  {
    id: 'seed-1',
    title: 'Exterior Wash',
    price: '$79',
    numericPrice: 79,
    description: 'Professional exterior hand washing, rim and tire detailing, streak-free window cleaning, and high-gloss protective finish.',
    features: [
      'Exterior hand wash & foam bath',
      'Wheel & tire deep cleaning',
      'Streak-free exterior window finish',
      'High-gloss spray protection'
    ],
    order: 1,
    isDefault: true
  },
  {
    id: 'seed-2',
    title: 'Interior Cleaning',
    price: '$99',
    numericPrice: 99,
    description: 'Thorough interior deep cleaning, complete vacuuming, detailed surface wipe-down, dash and console rejuvenation, and clean door jambs.',
    features: [
      'Thorough cabin & trunk vacuuming',
      'Detailed surface & vent cleaning',
      'Dashboard & console rejuvenation',
      'Door jambs & glass cleaned'
    ],
    order: 2,
    isDefault: true
  },
  {
    id: 'seed-3',
    title: 'Exterior and Interior',
    price: '$169',
    numericPrice: 169,
    description: 'Includes a thorough exterior wash and interior cleaning, including detailed steaming of seats and interior surfaces.',
    features: [
      'Thorough exterior hand wash & rim cleaning',
      'Complete interior deep cleaning & vacuuming',
      'Detailed steaming of seats and interior surfaces',
      'Steam disinfection & stain removal treatment',
      'Interior shampooing & surface conditioning'
    ],
    order: 3,
    isDefault: true
  },
  {
    id: 'seed-4',
    title: 'Packages',
    price: '$249',
    numericPrice: 249,
    description: 'Comprehensive detailing packages designed to restore and maintain your vehicle in showroom condition with long-lasting protection.',
    features: [
      'Full vehicle restoration & deep steam detailing',
      'Steam disinfection & odor neutralization',
      'Protective finishes for interior & exterior',
      'Custom packages tailored to your vehicle'
    ],
    order: 4,
    isDefault: true
  }
];

const ServicesManager = () => {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState(null);

  const [formData, setFormData] = useState({
    title: '',
    price: '',
    description: '',
    featuresText: '',
    order: 1
  });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const q = query(collection(db, 'services'), orderBy('order', 'asc'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setServices(data);
      setLoading(false);
    }, (err) => {
      console.warn("Services listener error:", err);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const openAddModal = () => {
    setEditingId(null);
    setFormData({
      title: '',
      price: '',
      description: '',
      featuresText: '',
      order: services.length + 1
    });
    setShowModal(true);
  };

  const openEditModal = (service) => {
    setEditingId(service.id);
    setFormData({
      title: service.title || '',
      price: service.price || '',
      description: service.description || '',
      featuresText: Array.isArray(service.features) ? service.features.join('\n') : '',
      order: service.order || 1
    });
    setShowModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.title.trim()) {
      alert("Please provide a service title.");
      return;
    }

    setSaving(true);
    const featuresList = formData.featuresText
      .split('\n')
      .map(f => f.trim())
      .filter(Boolean);

    try {
      if (editingId) {
        // Update existing service
        await updateDoc(doc(db, 'services', editingId), {
          title: formData.title.trim(),
          price: formData.price.trim(),
          description: formData.description.trim(),
          features: featuresList,
          order: Number(formData.order) || 1,
          updatedAt: serverTimestamp()
        });
      } else {
        // Add new service
        await addDoc(collection(db, 'services'), {
          title: formData.title.trim(),
          price: formData.price.trim(),
          description: formData.description.trim(),
          features: featuresList,
          order: Number(formData.order) || 1,
          createdAt: serverTimestamp()
        });
      }

      setShowModal(false);
      setEditingId(null);
    } catch (err) {
      console.error("Error saving service:", err);
      alert("Failed to save service details.");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this service package?")) {
      try {
        await deleteDoc(doc(db, 'services', id));
      } catch (err) {
        console.error("Error deleting service:", err);
        alert("Failed to delete service.");
      }
    }
  };

  return (
    <div className="services-manager">
      <div className="sm-header">
        <div>
          <h2>Services & Pricing Management</h2>
          <p>Create new service packages, update pricing tags, or modify features displayed on the website.</p>
        </div>
        <button className="btn-primary sm-add-btn" onClick={openAddModal}>
          <Plus size={18} />
          <span>Add New Service</span>
        </button>
      </div>

      {showModal && (
        <div className="sm-modal-backdrop" onClick={() => setShowModal(false)}>
          <div className="sm-modal-card" onClick={(e) => e.stopPropagation()}>
            <div className="sm-modal-header">
              <h3>{editingId ? 'Edit Service Package' : 'Add New Service Package'}</h3>
              <button className="sm-close-btn" onClick={() => setShowModal(false)}>×</button>
            </div>

            <form onSubmit={handleSubmit} className="sm-form">
              <div className="sm-form-scrollable">
                <div className="sm-row">
                  <div className="sm-input-group">
                    <label htmlFor="sm-title">Service Title *</label>
                    <input 
                      id="sm-title"
                      type="text" 
                      required 
                      placeholder="e.g. Ceramic Coating Protection"
                      value={formData.title}
                      onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    />
                  </div>

                  <div className="sm-input-group">
                    <label htmlFor="sm-price">Price / Cost (e.g. $149)</label>
                    <input 
                      id="sm-price"
                      type="text" 
                      placeholder="e.g. $149 or $199"
                      value={formData.price}
                      onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                    />
                  </div>
                </div>

                <div className="sm-input-group">
                  <label htmlFor="sm-desc">Service Description</label>
                  <textarea 
                    id="sm-desc"
                    rows="2" 
                    placeholder="Brief overview explaining what this detailing package includes..."
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  />
                </div>

                <div className="sm-input-group">
                  <label htmlFor="sm-features">Package Features (One per line)</label>
                  <textarea 
                    id="sm-features"
                    rows="4" 
                    placeholder="Foam bath & hand wash&#10;Wheel & tire deep cleaning&#10;Streak-free window finish&#10;High-gloss spray protection"
                    value={formData.featuresText}
                    onChange={(e) => setFormData({ ...formData, featuresText: e.target.value })}
                  />
                  <span className="input-hint">Each line will appear as a checkmark bullet point on the website</span>
                </div>

                <div className="sm-input-group" style={{ maxWidth: '160px' }}>
                  <label htmlFor="sm-order">Display Order</label>
                  <input 
                    id="sm-order"
                    type="number" 
                    min="1" 
                    value={formData.order}
                    onChange={(e) => setFormData({ ...formData, order: e.target.value })}
                  />
                </div>
              </div>

              <div className="sm-modal-footer">
                <button type="button" className="btn-action cancel" onClick={() => setShowModal(false)}>
                  Cancel
                </button>
                <button type="submit" disabled={saving} className="btn-primary sm-submit-btn">
                  {saving ? 'Saving...' : editingId ? 'Update Service' : 'Add Service'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {loading ? (
        <div className="sm-loading">Loading services...</div>
      ) : (
        <div className="sm-sections">
          {/* Custom Active Services */}
          <div className="sm-group">
            <h3 className="sm-group-title">Active Services ({services.length})</h3>
            {services.length === 0 ? (
              <div className="sm-empty">
                <Sparkles size={40} />
                <p>No custom services created yet. Currently displaying the starter templates below. Click <strong>Add New Service</strong> above to publish custom packages!</p>
              </div>
            ) : (
              <div className="sm-grid">
                {services.map((s) => (
                  <div key={s.id} className="sm-card">
                    <div className="sm-card-header">
                      <div>
                        <strong>{s.title}</strong>
                        {s.price && (
                          <div className="sm-price-tag">
                            <Tag size={13} />
                            <span>{s.price}</span>
                          </div>
                        )}
                      </div>
                      <span className="sm-order-badge">#{s.order || 1}</span>
                    </div>

                    <p className="sm-desc-text">{s.description}</p>

                    {s.features?.length > 0 && (
                      <ul className="sm-features-list">
                        {s.features.map((f, idx) => (
                          <li key={idx}>
                            <CheckCircle2 size={14} />
                            <span>{f}</span>
                          </li>
                        ))}
                      </ul>
                    )}

                    <div className="sm-card-actions">
                      <button className="btn-action edit" onClick={() => openEditModal(s)} title="Edit package">
                        <Edit2 size={16} />
                        <span>Edit</span>
                      </button>
                      <button className="btn-action delete" onClick={() => handleDelete(s.id)} title="Delete package">
                        <Trash2 size={16} />
                        <span>Delete</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Starter Baseline Packages (Only shown when no custom services exist yet) */}
          {services.length === 0 && (
            <div className="sm-group default-group">
              <h3 className="sm-group-title">Starter Baseline Packages ({defaultSeedServices.length})</h3>
              <p className="sm-group-subtitle">These baseline packages display automatically until you create custom services above.</p>
              <div className="sm-grid">
                {defaultSeedServices.map((s) => (
                  <div key={s.id} className="sm-card default-card">
                    <div className="sm-card-header">
                      <div>
                        <strong>{s.title}</strong>
                        <div className="sm-price-tag">
                          <Tag size={13} />
                          <span>{s.price}</span>
                        </div>
                      </div>
                    </div>
                    <p className="sm-desc-text">{s.description}</p>
                    <div className="sm-card-actions">
                      <button 
                        type="button" 
                        className="btn-action edit" 
                        onClick={() => {
                          setEditingId(null);
                          setFormData({
                            title: s.title,
                            price: s.price,
                            description: s.description,
                            featuresText: Array.isArray(s.features) ? s.features.join('\n') : '',
                            order: s.order || 1
                          });
                          setShowModal(true);
                        }}
                      >
                        <Plus size={15} />
                        <span>Customize & Save</span>
                      </button>
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

export default ServicesManager;
