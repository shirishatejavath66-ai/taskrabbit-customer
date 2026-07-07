import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import API from '../services/api';
import Header from '../components/Header';

function Subcategories() {

    const { categoryId } = useParams();

    const navigate = useNavigate();

    const [subcategories, setSubcategories] = useState([]);

    useEffect(() => {
        fetchSubcategories();
    }, []);

    const fetchSubcategories = async () => {

        try {

            const response = await API.get(
                `/subcategories/${categoryId}`
            );

            console.log(response.data);

            setSubcategories(response.data.data);

        } catch (error) {

            console.log(error);

        }

    };

    return (
        <>
            <Header />

            <div style={{ padding: '20px' }}>

                <h1>Subcategories</h1>

                <h3>Category ID: {categoryId}</h3>

                <h3>Total Subcategories: {subcategories.length}</h3>

                {
                    subcategories.map((sub) => (

                        <div
                            key={sub.subcategory_id}
                            onClick={() =>
                                navigate(`/services/${sub.subcategory_id}`)
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

                            <h3>{sub.subcategory_name}</h3>

                        </div>

                    ))
                }

            </div>
        </>
    );
}

export default Subcategories;