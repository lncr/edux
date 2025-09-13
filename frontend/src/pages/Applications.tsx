import React, { useState, useEffect } from 'react';
import { Application, University } from '../types';
import { applicationsAPI, universitiesAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';

const Applications: React.FC = () => {
  const [applications, setApplications] = useState<Application[]>([]);
  const [universities, setUniversities] = useState<University[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isCreating, setIsCreating] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [formData, setFormData] = useState({
    university: '',
    status: 'pending' as Application['status'],
    notes: '',
    documents: ''
  });
  const { user } = useAuth();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [appsData, universitiesData] = await Promise.all([
        applicationsAPI.getAll(),
        universitiesAPI.getAll()
      ]);
      setApplications(appsData);
      setUniversities(universitiesData);
    } catch (err: any) {
      setError('Failed to fetch data');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!user) return;

    try {
      const applicationData = {
        user: user.id,
        university: parseInt(formData.university),
        status: formData.status,
        application_date: new Date().toISOString(),
        notes: formData.notes || undefined,
        documents: formData.documents || undefined,
      };

      if (editingId) {
        await applicationsAPI.update(editingId, applicationData);
      } else {
        await applicationsAPI.create(applicationData);
      }

      resetForm();
      fetchData();
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Failed to save application');
    }
  };

  const handleEdit = (application: Application) => {
    setEditingId(application.id);
    setFormData({
      university: application.university.toString(),
      status: application.status,
      notes: application.notes || '',
      documents: application.documents || ''
    });
    setIsCreating(true);
  };

  const handleDelete = async (id: number) => {
    if (window.confirm('Are you sure you want to delete this application?')) {
      try {
        await applicationsAPI.delete(id);
        fetchData();
      } catch (err: any) {
        setError('Failed to delete application');
      }
    }
  };

  const resetForm = () => {
    setFormData({
      university: '',
      status: 'pending',
      notes: '',
      documents: ''
    });
    setIsCreating(false);
    setEditingId(null);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const getUniversityName = (universityId: number) => {
    const university = universities.find(u => u.id === universityId);
    return university?.name || 'Unknown University';
  };

  const getStatusColor = (status: Application['status']) => {
    switch (status) {
      case 'accepted': return '#27ae60';
      case 'rejected': return '#e74c3c';
      case 'submitted': return '#3498db';
      default: return '#f39c12';
    }
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

  if (loading) return <div style={{ padding: '2rem', textAlign: 'center' }}>Loading applications...</div>;

  return (
    <div style={{ padding: '2rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <h1>My Applications</h1>
        <button
          onClick={() => setIsCreating(!isCreating)}
          style={{ ...buttonStyle, backgroundColor: '#27ae60', color: 'white' }}
        >
          {isCreating ? 'Cancel' : 'New Application'}
        </button>
      </div>

      {error && (
        <div style={{ color: 'red', marginBottom: '1rem', textAlign: 'center' }}>
          {error}
        </div>
      )}

      {isCreating && (
        <form onSubmit={handleSubmit} style={formStyle}>
          <h3>{editingId ? 'Edit Application' : 'New Application'}</h3>
          
          <label style={{ display: 'block', marginBottom: '0.5rem' }}>University:</label>
          <select
            name="university"
            value={formData.university}
            onChange={handleChange}
            required
            style={inputStyle}
          >
            <option value="">Select a university</option>
            {universities.map((university) => (
              <option key={university.id} value={university.id}>
                {university.name} - {university.location}
              </option>
            ))}
          </select>
          
          <label style={{ display: 'block', marginBottom: '0.5rem' }}>Status:</label>
          <select
            name="status"
            value={formData.status}
            onChange={handleChange}
            style={inputStyle}
          >
            <option value="pending">Pending</option>
            <option value="submitted">Submitted</option>
            <option value="accepted">Accepted</option>
            <option value="rejected">Rejected</option>
          </select>
          
          <label style={{ display: 'block', marginBottom: '0.5rem' }}>Notes:</label>
          <textarea
            name="notes"
            placeholder="Application notes..."
            value={formData.notes}
            onChange={handleChange}
            rows={3}
            style={inputStyle}
          />
          
          <label style={{ display: 'block', marginBottom: '0.5rem' }}>Documents:</label>
          <input
            type="text"
            name="documents"
            placeholder="Document links or references"
            value={formData.documents}
            onChange={handleChange}
            style={inputStyle}
          />
          
          <div>
            <button
              type="submit"
              style={{ ...buttonStyle, backgroundColor: '#3498db', color: 'white' }}
            >
              {editingId ? 'Update' : 'Create'} Application
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
        {applications.length === 0 ? (
          <div style={{ textAlign: 'center', color: '#666' }}>
            No applications yet. Create your first application!
          </div>
        ) : (
          applications.map((application) => (
            <div key={application.id} style={cardStyle}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
                <div style={{ flex: 1 }}>
                  <h3 style={{ color: '#2c3e50', marginBottom: '0.5rem' }}>
                    {getUniversityName(application.university)}
                  </h3>
                  <p style={{ 
                    color: getStatusColor(application.status), 
                    fontWeight: 'bold',
                    marginBottom: '0.5rem',
                    textTransform: 'capitalize'
                  }}>
                    Status: {application.status}
                  </p>
                  <p style={{ color: '#7f8c8d', marginBottom: '0.5rem' }}>
                    Applied: {new Date(application.application_date).toLocaleDateString()}
                  </p>
                  {application.notes && (
                    <p style={{ marginBottom: '0.5rem' }}>
                      <strong>Notes:</strong> {application.notes}
                    </p>
                  )}
                  {application.documents && (
                    <p style={{ marginBottom: '0.5rem' }}>
                      <strong>Documents:</strong> {application.documents}
                    </p>
                  )}
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                  <button
                    onClick={() => handleEdit(application)}
                    style={{ ...buttonStyle, backgroundColor: '#f39c12', color: 'white' }}
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(application.id)}
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

export default Applications;