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
    cover_letter: '',
    prior_highest_education: 'NO EDUCATION' as Application['prior_highest_education'],
    certificate: ''
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
  if (!user) return;

  try {
    const formPayload = new FormData();
    formPayload.append('user', user.id.toString());
    formPayload.append('university', formData.university);
    formPayload.append('cover_letter', formData.cover_letter);
    formPayload.append('prior_highest_education', formData.prior_highest_education);

    if (formData.certificate instanceof File) {
      formPayload.append('certificate', formData.certificate);
    }

    if (editingId) {
      await applicationsAPI.update(editingId, formPayload, true); // pass flag to handle multipart
    } else {
      await applicationsAPI.create(formPayload, true);
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
      cover_letter: application.cover_letter || '',
      prior_highest_education: application.prior_highest_education,
      certificate: application.certificate || ''
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
      cover_letter: '',
      prior_highest_education: 'NO EDUCATION',
      certificate: ''
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

  if (loading) return <div style={{ padding: '2rem', textAlign: 'center' }}>Loading applications...</div>;

  return (
    <div style={{ padding: '2rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <h1>My Applications</h1>
        <button
          onClick={() => setIsCreating(!isCreating)}
          style={{ padding: '0.5rem 1rem', borderRadius: '4px', border: 'none', backgroundColor: '#27ae60', color: 'white' }}
        >
          {isCreating ? 'Cancel' : 'New Application'}
        </button>
      </div>

      {error && <div style={{ color: 'red', marginBottom: '1rem', textAlign: 'center' }}>{error}</div>}

      {isCreating && (
        <form onSubmit={handleSubmit} style={{ border: '1px solid #ddd', borderRadius: '8px', padding: '1.5rem', marginBottom: '2rem', backgroundColor: '#f8f9fa' }}>
          <h3>{editingId ? 'Edit Application' : 'New Application'}</h3>

          <label>University:</label>
          <select name="university" value={formData.university} onChange={handleChange} required style={{ width: '100%', padding: '0.5rem', marginBottom: '1rem' }}>
            <option value="">Select a university</option>
            {universities.map(u => <option key={u.id} value={u.id}>{u.name}</option>)}
          </select>

          <label>Highest Education:</label>
          <select name="prior_highest_education" value={formData.prior_highest_education} onChange={handleChange} style={{ width: '100%', padding: '0.5rem', marginBottom: '1rem' }}>
            <option value="NO EDUCATION">No Education</option>
            <option value="HIGH SCHOOL">High School</option>
            <option value="BACHELORS">Bachelors</option>
            <option value="MASTERS">Masters</option>
            <option value="PHD">PhD</option>
          </select>

          <label>Cover Letter:</label>
          <textarea name="cover_letter" value={formData.cover_letter} onChange={handleChange} rows={3} style={{ width: '100%', padding: '0.5rem', marginBottom: '1rem' }} />

          <label>Certificate:</label>
            <input
              type="file"
              name="certificate"
              onChange={(e) => {
                if (e.target.files && e.target.files[0]) {
                  setFormData({
                    ...formData,
                    certificate: e.target.files[0], // store the File object
                  });
                }
              }}
              style={{ width: '100%', padding: '0.5rem', marginBottom: '1rem' }}
            />
          <button type="submit" style={{ padding: '0.5rem 1rem', marginRight: '0.5rem', backgroundColor: '#3498db', color: 'white', border: 'none', borderRadius: '4px' }}>
            {editingId ? 'Update' : 'Create'}
          </button>
          <button type="button" onClick={resetForm} style={{ padding: '0.5rem 1rem', backgroundColor: '#95a5a6', color: 'white', border: 'none', borderRadius: '4px' }}>Cancel</button>
        </form>
      )}

      <div>
        {applications.length === 0 ? (
          <div style={{ textAlign: 'center', color: '#666' }}>No applications yet.</div>
        ) : (
          applications.map(app => (
            <div key={app.id} style={{ border: '1px solid #ddd', borderRadius: '8px', padding: '1.5rem', marginBottom: '1rem', backgroundColor: '#fff' }}>
              <h3>{getUniversityName(app.university)}</h3>
              <p><strong>Highest Education:</strong> {app.prior_highest_education}</p>
              {app.cover_letter && (
                  <p>
                    <strong>Cover Letter:</strong>{" "}
                    {app.cover_letter.split(" ").slice(0, 20).join(" ")}
                    {app.cover_letter.split(" ").length > 20 && " ..."}
                  </p>
                )}
              {app.certificate && (
                  <div>
                    <strong>Certificate:</strong>
                    <img
                      src={app.certificate}
                      alt="Certificate"
                      style={{ maxWidth: "200px", marginTop: "0.5rem", borderRadius: "8px" }}
                    />
                  </div>
                )}
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Applications;
