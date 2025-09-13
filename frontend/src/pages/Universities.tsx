import React, { useState, useEffect } from 'react';
import { University } from '../types';
import { universitiesAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';

const Universities: React.FC = () => {
  const [universities, setUniversities] = useState<University[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { user } = useAuth();

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

  const cardStyle = {
    border: '1px solid #ddd',
    borderRadius: '8px',
    padding: '1.5rem',
    marginBottom: '1rem',
    backgroundColor: '#fff',
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
  };

  const headerStyle = {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '2rem',
  };

  if (loading) return <div style={{ padding: '2rem', textAlign: 'center' }}>Loading universities...</div>;
  if (error) return <div style={{ padding: '2rem', color: 'red', textAlign: 'center' }}>{error}</div>;

  return (
    <div style={{ padding: '2rem' }}>
      <div style={headerStyle}>
        <h1>Universities</h1>
        {user?.is_staff && (
          <span style={{ fontSize: '0.9rem', color: '#666' }}>
            To manage universities, visit the <a href="/admin-universities">admin panel</a>
          </span>
        )}
      </div>
      
      {universities.length === 0 ? (
        <div style={{ textAlign: 'center', color: '#666' }}>
          No universities available yet.
        </div>
      ) : (
        <div style={{ display: 'grid', gap: '1rem' }}>
          {universities.map((university) => (
            <div key={university.id} style={cardStyle}>
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
          ))}
        </div>
      )}
    </div>
  );
};

export default Universities;