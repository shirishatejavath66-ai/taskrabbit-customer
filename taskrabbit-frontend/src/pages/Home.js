import React from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';

function Home() {

    const navigate = useNavigate();

    return (
        <>
            <Header />

            <div>
                <h1>FixItNow</h1>

                <h3>Welcome Guest User</h3>

                <p>Find trusted professionals for your home services.</p>

                <button
                    onClick={() => navigate('/categories')}
                >
                    Browse Services
                </button>
            </div>
        </>
    );
}

export default Home;