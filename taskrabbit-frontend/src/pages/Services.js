import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import API from '../services/api';
import Header from '../components/Header';

function Services() {

  const { subcategoryId } = useParams();

  const navigate = useNavigate();

  const [services, setServices] = useState([]);

  useEffect(() => {
    fetchServices();
  }, [subcategoryId]);

  const fetchServices = async () => {

    try {

      const response = await API.get(
        `/services/${subcategoryId}`
      );

      console.log('Services API Response:', response.data);

      setServices(response.data.data || response.data);

    } catch (error) {

      console.error('Error fetching services:', error);

    }

  };

  return (
    <>
      <Header />

      <div style={{ padding: '20px' }}>

        <h1>Services</h1>

        <h3>Subcategory ID: {subcategoryId}</h3>

        <h3>Total Services: {services.length}</h3>

        {
          services.map((service) => (

            <div
              key={service.service_id}
              onClick={() =>
                navigate(`/service/${service.service_id}`)
              }
              style={{
                cursor: 'pointer',
                padding: '20px',
                border: '1px solid #ddd',
                margin: '15px',
                borderRadius: '10px',
                boxShadow: '0 2px 5px rgba(0,0,0,0.1)',
                backgroundColor: '#fff'
              }}
            >

              <h3>{service.service_name}</h3>

              <p>
                <strong>Price:</strong> ₹ {service.price}
              </p>

              <p>
                Click to view service details
              </p>

            </div>

          ))
        }

      </div>
    </>
  );
}

export default Services;