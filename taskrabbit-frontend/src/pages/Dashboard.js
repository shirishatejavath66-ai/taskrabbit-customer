import React, { useEffect, useState } from 'react';
import axios from 'axios';

function Dashboard() {

  const [profile, setProfile] = useState(null);

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {

    try {

      const token = localStorage.getItem('token');

      const response = await axios.get(
        'http://localhost:5000/api/customers/profile',
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      setProfile(response.data.data);

    } catch (error) {

      console.error(error);

    }
  };

  return (

    <div>

      <h1>Customer Dashboard</h1>

      {profile && (

        <div>

          <h3>Welcome {profile.name}</h3>

          <p>Email: {profile.email}</p>

          <p>Phone: {profile.phone}</p>

        </div>

      )}

    </div>

  );
}

export default Dashboard;