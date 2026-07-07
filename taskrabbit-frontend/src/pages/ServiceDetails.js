import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import API from '../services/api';
import Header from '../components/Header';

function ServiceDetails() {

  const { serviceId } = useParams();

  const navigate = useNavigate();

  const [service, setService] = useState(null);

  useEffect(() => {
    fetchServiceDetails();
  }, [serviceId]);

  const fetchServiceDetails = async () => {

    try {

      const response = await API.get(
        `/service/${serviceId}`
      );

      console.log('Service Details Response:', response.data);

      setService(response.data.data || response.data);

    } catch (error) {

      console.error('Error fetching service details:', error);

    }

  };

  if (!service) {
    return <p>Loading service details...</p>;
  }

  return (
    <>
      <Header />

      <div style={{ padding: '20px' }}>

        <h1>Service Details</h1>

        <div
          style={{
            padding: '20px',
            border: '1px solid #ddd',
            borderRadius: '10px',
            boxShadow: '0 2px 5px rgba(0,0,0,0.1)',
            backgroundColor: '#fff'
          }}
        >

          <h2>{service.service_name}</h2>

          <p>
            <strong>Price:</strong> ₹ {service.price}
          </p>

          <p>
            <strong>Description:</strong> {service.description}
          </p>

          <button
            onClick={() =>
              navigate(`/providers/${service.service_id}`)
            }
            style={{
              padding: '10px 20px',
              marginTop: '10px',
              cursor: 'pointer'
            }}
          >
            View Providers
          </button>

        </div>

      </div>
    </>
  );
}

export default ServiceDetails;