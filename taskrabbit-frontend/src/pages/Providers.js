import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import API from '../services/api';
import Header from '../components/Header';

function Providers() {

  const { serviceId } = useParams();

  const [providers, setProviders] = useState([]);

  useEffect(() => {
    fetchProviders();
  }, [serviceId]);

  const fetchProviders = async () => {

    try {

      const response = await API.get(
        `/providers/${serviceId}`
      );

      console.log('Providers API Response:', response.data);

      setProviders(response.data.data || response.data);

    } catch (error) {

      console.error('Error fetching providers:', error);

    }

  };

  return (
    <>
      <Header />

      <div style={{ padding: '20px' }}>

        <h1>Service Providers</h1>

        <h3>Total Providers: {providers.length}</h3>

        {
          providers.map((provider) => (

            <div
              key={provider.provider_id}
              style={{
                padding: '20px',
                border: '1px solid #ddd',
                margin: '15px',
                borderRadius: '10px',
                boxShadow: '0 2px 5px rgba(0,0,0,0.1)',
                backgroundColor: '#fff'
              }}
            >

              <h3>{provider.name}</h3>

              <p>
                📞 {provider.phone}
              </p>

              <p>
                ✉️ {provider.email}
              </p>

              <p>
                ⭐ Rating: {provider.rating}
              </p>

              <p>
                🛠 Experience: {provider.experience} Years
              </p>

            </div>

          ))
        }

      </div>
    </>
  );
}

export default Providers;