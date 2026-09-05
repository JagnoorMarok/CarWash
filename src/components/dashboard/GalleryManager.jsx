import React, { useState, useEffect } from 'react';
import { 
  collection, 
  query, 
  orderBy, 
  onSnapshot, 
  addDoc, 
  deleteDoc, 
  doc, 
  serverTimestamp 
} from 'firebase/firestore';
import { db } from '../../firebase';
import { Image, Plus, Trash2, Link as LinkIcon, UploadCloud, Eye } from 'lucide-react';
import './GalleryManager.css';

const defaultSeedImages = [
  { id: 'seed-1', src: '/assets/gallery1.jpg', label: 'Exterior Detail', isDefault: true },
  { id: 'seed-2', src: '/assets/gallery2.jpg', label: 'Interior Cleaning', isDefault: true },
  { id: 'seed-3', src: '/assets/gallery3.jpg', label: 'Full Body Polish', isDefault: true },
  { id: 'seed-4', src: '/assets/gallery4.jpg', label: 'Ceramic Coating', isDefault: true },
  { id: 'seed-5', src: '/assets/gallery5.jpg', label: 'Interior Restoration', isDefault: true },
  { id: 'seed-6', src: '/assets/team.jpg', label: 'Our Team', isDefault: true },
];

const GalleryManager = () => {
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [uploadMode, setUploadMode] = useState('file'); // 'file' or 'url'
  
  const [label, setLabel] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [fileBase64, setFileBase64] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const q = query(collection(db, 'gallery'), orderBy('createdAt', 'desc'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const liveImages = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setImages(liveImages);
      setLoading(false);
    }, (error) => {
      console.warn("Firestore gallery listener:", error);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 1048576) { // 1MB check for Firestore doc limit
        alert("Please choose an image under 1MB for optimal loading performance.");
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setFileBase64(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAddImage = async (e) => {
    e.preventDefault();
    const finalSrc = uploadMode === 'file' ? fileBase64 : imageUrl.trim();

    if (!finalSrc) {
      alert("Please provide an image file or direct image URL.");
      return;
    }

    setSaving(true);
    try {
      await addDoc(collection(db, 'gallery'), {
        src: finalSrc,
        label: label.trim() || 'Detailing Showcase',
        createdAt: serverTimestamp()
      });
      setShowAddModal(false);
      setLabel('');
      setImageUrl('');
      setFileBase64('');
    } catch (err) {
      console.error("Error adding gallery image:", err);
      alert("Failed to add image. Please check your image format or URL.");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Remove this image from the gallery?")) {
      try {
        await deleteDoc(doc(db, 'gallery', id));
      } catch (err) {
        console.error("Error deleting image:", err);
        alert("Failed to delete image.");
      }
    }
  };

  return (
    <div className="gallery-manager">
      <div className="gm-header">
        <div>
          <h2>Gallery Management</h2>
          <p>Add new showcase photos or remove existing images from the website gallery.</p>
        </div>
        <button className="btn-primary gm-add-btn" onClick={() => setShowAddModal(true)}>
          <Plus size={18} />
          <span>Add New Photo</span>
        </button>
      </div>

      {showAddModal && (
        <div className="gm-modal-backdrop" onClick={() => setShowAddModal(false)}>
          <div className="gm-modal-card" onClick={(e) => e.stopPropagation()}>
            <div className="gm-modal-header">
              <h3>Upload Gallery Photo</h3>
              <button className="gm-close-btn" onClick={() => setShowAddModal(false)}>×</button>
            </div>

            <form onSubmit={handleAddImage} className="gm-form">
              <div className="gm-mode-toggle">
                <button 
                  type="button" 
                  className={uploadMode === 'file' ? 'active' : ''} 
                  onClick={() => setUploadMode('file')}
                >
                  <UploadCloud size={16} />
                  <span>Upload File</span>
                </button>
                <button 
                  type="button" 
                  className={uploadMode === 'url' ? 'active' : ''} 
                  onClick={() => setUploadMode('url')}
                >
                  <LinkIcon size={16} />
                  <span>Image URL</span>
                </button>
              </div>

              {uploadMode === 'file' ? (
                <div className="gm-input-group">
                  <label>Select Photo from Computer (Max 1MB)</label>
                  <input 
                    type="file" 
                    accept="image/*" 
                    required={!fileBase64} 
                    onChange={handleFileChange} 
                  />
                  {fileBase64 && (
                    <div className="gm-preview-box">
                      <img src={fileBase64} alt="Preview" />
                    </div>
                  )}
                </div>
              ) : (
                <div className="gm-input-group">
                  <label>Direct Image URL</label>
                  <input 
                    type="url" 
                    placeholder="https://example.com/photo.jpg" 
                    required 
                    value={imageUrl} 
                    onChange={(e) => setImageUrl(e.target.value)} 
                  />
                  {imageUrl && (
                    <div className="gm-preview-box">
                      <img src={imageUrl} alt="Preview" onError={(e) => { e.target.style.display = 'none'; }} />
                    </div>
                  )}
                </div>
              )}

              <div className="gm-input-group">
                <label>Caption / Label</label>
                <input 
                  type="text" 
                  placeholder="e.g. Paint Correction, Ceramic Gloss" 
                  value={label} 
                  onChange={(e) => setLabel(e.target.value)} 
                />
              </div>

              <div className="gm-modal-actions">
                <button type="button" className="btn-action cancel" onClick={() => setShowAddModal(false)}>
                  Cancel
                </button>
                <button type="submit" disabled={saving} className="btn-primary">
                  {saving ? 'Publishing...' : 'Add to Gallery'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {loading ? (
        <div className="gm-loading">Loading gallery photos...</div>
      ) : (
        <div className="gm-sections">
          {/* Live Dynamic Images */}
          <div className="gm-group">
            <h3 className="gm-group-title">
              Custom Uploaded Images ({images.length})
            </h3>
            {images.length === 0 ? (
              <div className="gm-empty">
                <Image size={40} />
                <p>No custom photos uploaded yet. Click <strong>Add New Photo</strong> above to upload work directly to your website!</p>
              </div>
            ) : (
              <div className="gm-grid">
                {images.map((img) => (
                  <div key={img.id} className="gm-card">
                    <div className="gm-img-wrap">
                      <img src={img.src} alt={img.label} />
                      <div className="gm-img-overlay">
                        <button 
                          className="gm-delete-btn" 
                          title="Delete from Gallery" 
                          onClick={() => handleDelete(img.id)}
                        >
                          <Trash2 size={16} />
                          <span>Delete</span>
                        </button>
                      </div>
                    </div>
                    <div className="gm-card-info">
                      <strong>{img.label}</strong>
                      <span>Uploaded {img.createdAt?.toDate ? img.createdAt.toDate().toLocaleDateString() : 'Just now'}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Built-in Seed Images */}
          <div className="gm-group default-group">
            <h3 className="gm-group-title">Default Portfolio Assets ({defaultSeedImages.length})</h3>
            <div className="gm-grid">
              {defaultSeedImages.map((img) => (
                <div key={img.id} className="gm-card default-card">
                  <div className="gm-img-wrap">
                    <img src={img.src} alt={img.label} />
                    <span className="default-badge">Built-in</span>
                  </div>
                  <div className="gm-card-info">
                    <strong>{img.label}</strong>
                    <span>Permanent Asset</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default GalleryManager;
