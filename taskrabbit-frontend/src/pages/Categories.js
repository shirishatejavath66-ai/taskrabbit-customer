import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../services/api';
import Header from '../components/Header';

function Categories() {

    const navigate = useNavigate();

    const [categories, setCategories] = useState([]);

    useEffect(() => {
        fetchCategories();
    }, []);

    const fetchCategories = async () => {

        try {

            const response = await API.get('/categories');

            setCategories(response.data.data);

        } catch (error) {

            console.log('API Error:', error);

        }

    };

    return (
        <>
            <Header />

            <div style={{ padding: '20px' }}>

                <h1>Categories</h1>

                <p>Total Categories: {categories.length}</p>

                {
                    categories.map((category) => (

                        <div
                            key={category.category_id}
                            onClick={() =>
                                navigate(`/subcategories/${category.category_id}`)
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

                            <h3>{category.category_name}</h3>

                        </div>

                    ))
                }

            </div>
        </>
    );

}

export default Categories;