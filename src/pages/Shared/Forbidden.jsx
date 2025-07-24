import React from 'react';
import { Link } from 'react-router-dom';

const Forbidden = () => {
  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-gray-100">
      <h1 className="text-5xl font-bold text-yellow-600 mb-4">403</h1>
      <p className="text-xl mb-6">Access Denied. You do not have permission to view this page.</p>
      <Link to="/" className="text-blue-600 underline">Go to Home</Link>
    </div>
  );
};

export default Forbidden;
