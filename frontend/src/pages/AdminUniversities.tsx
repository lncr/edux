import React, { useState, useEffect } from 'react';
import { University } from '../types';
import { universitiesAPI } from '../services/api';

const AdminUniversities: React.FC = () => {
  const [universities, setUniversities] = useState<University[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isCreating, setIsCreating] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    location: '',
    description: '',
    ranking: '',
    website: ''
  });

  useEffect(() => {
    fetchUniversities();
  }, []);

  const fetchUniversities = async () => {
    try {
      const data = await universitiesAPI.getAll();
      setUniversities(data);
    } catch (err: any) {
      setError('Failed to fetch universities');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    try {
      const universityData = {
        name: formData.name,
        location: formData.location,
        description: formData.description || undefined,
        ranking: formData.ranking ? parseInt(formData.ranking) : undefined,
        website: formData.website || undefined,
      };

      if (editingId) {
        await universitiesAPI.update(editingId, universityData);
      } else {
        await universitiesAPI.create(universityData);
      }

      resetForm();
      fetchUniversities();
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Failed to save university');
    }
  };

  const handleEdit = (university: University) => {
    setEditingId(university.id);
    setFormData({
      name: university.name,
      location: university.location,
      description: university.description || '',
      ranking: university.ranking?.toString() || '',
      website: university.website || ''
    });
    setIsCreating(true);
  };

  const handleDelete = async (id: number) => {
    if (window.confirm('Are you sure you want to delete this university?')) {
      try {
        await universitiesAPI.delete(id);
        fetchUniversities();
      } catch (err: any) {
        setError('Failed to delete university');
      }
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      location: '',
      description: '',
      ranking: '',
      website: ''
    });
    setIsCreating(false);
    setEditingId(null);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const formStyle = {
    border: '1px solid #ddd',
    borderRadius: '8px',
    padding: '1.5rem',
    marginBottom: '2rem',
    backgroundColor: '#f8f9fa',
  };

  const inputStyle = {
    width: '100%',
    padding: '0.5rem',
    marginBottom: '1rem',
    border: '1px solid #ddd',
    borderRadius: '4px',
  };

  const buttonStyle = {
    padding: '0.5rem 1rem',
    marginRight: '0.5rem',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
  };

  const cardStyle = {
    border: '1px solid #ddd',
    borderRadius: '8px',
    padding: '1.5rem',
    marginBottom: '1rem',
    backgroundColor: '#fff',
  };

  if (loading) return <div style={{ padding: '2rem', textAlign: 'center' }}>Loading...</div>;

  return (
    <div style={{ padding: '2rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <h1>Manage Universities</h1>
        <button
          onClick={() => setIsCreating(!isCreating)}
          style={{ ...buttonStyle, backgroundColor: '#27ae60', color: 'white' }}
        >
          {isCreating ? 'Cancel' : 'Add New University'}
        </button>
      </div>

      {error && (
        <div style={{ color: 'red', marginBottom: '1rem', textAlign: 'center' }}>
          {error}
        </div>
      )}

      {isCreating && (
        <form onSubmit={handleSubmit} style={formStyle}>
          <h3>{editingId ? 'Edit University' : 'Add New University'}</h3>
          
          <input
            type="text"
            name="name"
            placeholder="University Name"
            value={formData.name}
            onChange={handleChange}
            required
            style={inputStyle}
          />
          
          <input
            type="text"
            name="location"
            placeholder="Location"
            value={formData.location}
            onChange={handleChange}
            required
            style={inputStyle}
          />
          
          <textarea
            name="description"
            placeholder="Description"
            value={formData.description}
            onChange={handleChange}
            rows={3}
            style={inputStyle}
          />
          
          <input
            type="number"
            name="ranking"
            placeholder="Ranking (optional)"
            value={formData.ranking}
            onChange={handleChange}
            style={inputStyle}
          />
          
          <input
            type="url"
            name="website"
            placeholder="Website URL (optional)"
            value={formData.website}
            onChange={handleChange}
            style={inputStyle}
          />
          
          <div>
            <button
              type="submit"
              style={{ ...buttonStyle, backgroundColor: '#3498db', color: 'white' }}
            >
              {editingId ? 'Update' : 'Create'} University
            </button>
            <button
              type="button"
              onClick={resetForm}
              style={{ ...buttonStyle, backgroundColor: '#95a5a6', color: 'white' }}
            >
              Cancel
            </button>
          </div>
        </form>
      )}

      <div>
        {universities.length === 0 ? (
          <div style={{ textAlign: 'center', color: '#666' }}>
            No universities found. Create the first one!
          </div>
        ) : (
          universities.map((university) => (
            <div key={university.id} style={cardStyle}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
                <div style={{ flex: 1 }}>
                  <h3 style={{ color: '#2c3e50', marginBottom: '0.5rem' }}>
                    {university.name}
                  </h3>
                  <p style={{ color: '#7f8c8d', marginBottom: '0.5rem' }}>
                    📍 {university.location}
                  </p>
                  {university.description && (
                    <p style={{ marginBottom: '0.5rem' }}>{university.description}</p>
                  )}
                  {university.ranking && (
                    <p style={{ color: '#e67e22', fontWeight: 'bold' }}>
                      Ranking: #{university.ranking}
                    </p>
                  )}
                  {university.website && (
                    <p>
                      <a 
                        href={university.website} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        style={{ color: '#3498db' }}
                      >
                        Visit Website
                      </a>
                    </p>
                  )}
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                  <button
                    onClick={() => handleEdit(university)}
                    style={{ ...buttonStyle, backgroundColor: '#f39c12', color: 'white' }}
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(university.id)}
                    style={{ ...buttonStyle, backgroundColor: '#e74c3c', color: 'white' }}
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default AdminUniversities;