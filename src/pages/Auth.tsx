import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import UserProfile from '../components/UserProfile';
import * as constants from '../components/constants';


const Auth = () => {
    const navigate = useNavigate();
    // Simulating a session check. In a real app, this would come from a Context or Redux
    const [isLoggedIn, setIsLoggedIn] = useState(!!UserProfile.getName());
    const [isLoginView, setIsLoginView] = useState(true);
    const [formData, setFormData] = useState({
        name: '',
        password: ''
    });
    const [error, setError] = useState('');


    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        if (e.target.name === 'name') {
            if (value.toLowerCase() === 'dev' || value.toLowerCase() === 'admin') {
                UserProfile.setRole(true);
            } else {
                UserProfile.setRole(false);
            }
        }
        setFormData({
            ...formData,
            [e.target.name]: value
        });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        const endpoint = isLoginView ? 'api/login' : 'api/register';
        const url = `${constants.SERVER_URL}${endpoint}`;

        try {
            const response = await fetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });

            const data = await response.json();

            if (response.ok) {
                if (isLoginView) {
                    if (data.success) {
                        UserProfile.setName(data.user.name);
                        if (data.user.name.toLowerCase() === 'admin' || data.user.name.toLowerCase() === 'dev') {
                            UserProfile.setRole(true);
                        } else {
                            UserProfile.setRole(false);
                        }
                        setIsLoggedIn(true);
                        // console.log('Login successful:', data.user);
                        navigate('/');
                    } else {
                        setError(data.message || 'Login failed');
                    }
                } else {
                    // console.log('Registration successful:', data);
                    setIsLoginView(true); // Switch to login after successful registration
                    alert('Registration successful! Please login.');
                }
            } else {
                setError(data.message || 'Something went wrong');
            }
        } catch (err) {
            console.error('Error:', err);
            setError('Could not connect to the server');
        }
    };

    if (isLoggedIn) {
        return (
            <div className="flex flex-col items-center justify-center h-screen bg-gray-100">
                <main className="p-8 bg-white shadow-md rounded-lg text-center">
                    <h2 className="text-2xl font-bold mb-4">Welcome Back!</h2>
                    <p className="mb-6 text-gray-600">You are currently logged into your session.</p>
                    <button
                        onClick={() => {

                            UserProfile.setName('');
                            UserProfile.setRole(false);
                            navigate('/');
                            setIsLoggedIn(false);
                        }}
                        className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 transition"
                    >
                        Logout
                    </button>
                </main>
            </div>
        );
    }

    return (
        <div className="flex items-center justify-center min-h-screen bg-[#1A365D]">
            <main className="bg-white p-8 rounded-lg shadow-xl w-full max-w-md">
                <h2 className="text-2xl font-bold text-center text-[#1A365D] mb-4">
                    {isLoginView ? 'Login to IGU' : 'Register for IGU'}
                </h2>

                <div className="mb-6 text-sm text-gray-700 bg-blue-50 p-4 rounded-md border border-blue-100">
                    <p className="mb-1"><em>Your username is the exact name of your profile.</em></p>
                    <p>If you forgot your password, please contact the <em>UCC</em>.</p>
                </div>

                {error && <p className="text-red-500 text-sm text-center mb-4">{error}</p>}

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Full Name</label>
                        <input
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700">Password</label>
                        <input
                            type="password"
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500"
                            required
                        />
                    </div>

                    <button
                        type="submit"
                        className="w-full bg-[#1A365D] text-white font-bold py-2 px-4 rounded hover:bg-blue-800 transition duration-200"

                    >
                        {isLoginView ? 'Sign In' : 'Create Account'}
                    </button>
                </form>



                <div className="mt-4 text-center">
                    <a href="/" className="text-xs text-gray-400 hover:text-gray-600">
                        &larr; Back to Home
                    </a>
                </div>
            </main>
        </div>
    );
};

export default Auth;