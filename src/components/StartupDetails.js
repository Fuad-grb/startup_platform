import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

function StartupDetail() {
  const [startup, setStartup] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { id } = useParams();

  useEffect(() => {
    axios.get(`http://localhost:8000/api/startups/${id}/`)
      .then(response => {
        setStartup(response.data);
        setLoading(false);
      })
      .catch(error => {
        console.error('Error fetching startup details:', error);
        setError('Error fetching startup details');
        setLoading(false);
      });
  }, [id]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;
  if (!startup) return <div>Startup not found</div>;

  return (
    <div>
      <h2>{startup.name}</h2>
      <p><strong>Industry:</strong> {startup.industry}</p>
      <p><strong>Description:</strong> {startup.description}</p>
      <p><strong>Founded:</strong> {startup.founded_date}</p>
      {/* for future */}
    </div>
  );
}

export default StartupDetail;