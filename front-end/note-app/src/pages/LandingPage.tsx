import React from 'react';
import { Link } from 'react-router-dom';

import Header from '../components/Header'

export default function LandingPage(){
    return (
        <>
        <Header />
        <div className="container-fluid bg-dark text-white vh-100 d-flex flex-column align-items-center justify-content-center">
            <div className="text-center">
                <h1 className="mb-4">Welcome to Smart Note App</h1>
                <p className="mb-4">Take smarter notes with AI-powered math solving, shape recognition, and more!</p>
                <Link to="/note" className="btn btn-primary btn-lg">
                    Get Started
                </Link>
            </div>
        </div>
        </>
    );
};

