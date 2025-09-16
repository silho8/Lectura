import React, { useState, useEffect } from 'react';
import { Link, useSearchParams, useNavigate } from 'react-router-dom';
import authService from '../services/authService';
import FormInput from '../components/forms/FormInput';
import FormButton from '../components/forms/FormButton';

const ResetPasswordPage = () => {
    const [searchParams] = useSearchParams();
    const [token, setToken] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const tokenFromUrl = searchParams.get('token');
        if (tokenFromUrl) {
            setToken(tokenFromUrl);
        }
    }, [searchParams]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setMessage('');
        setLoading(true);
        try {
            const data = await authService.resetPassword({ token, new_password: newPassword });
            setMessage(data.message + " You will be redirected to login shortly.");
            setTimeout(() => navigate('/login'), 3000);
        } catch (err) {
            setError(err.response?.data?.message || 'An error occurred.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-brand-background px-4">
            <div className="max-w-md w-full bg-white p-8 rounded-2xl shadow-lg">
                <div className="text-center mb-8">
                    <h1 className="text-3xl font-bold text-gray-800">Reset Password</h1>
                    <p className="text-gray-500 mt-2">Enter your token and a new password.</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <FormInput
                        id="token"
                        label="Reset Token"
                        type="text"
                        value={token}
                        onChange={(e) => setToken(e.target.value)}
                        placeholder="Paste your token here"
                        required
                    />
                    <FormInput
                        id="newPassword"
                        label="New Password"
                        type="password"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        placeholder="••••••••"
                        required
                    />

                    {error && <p className="text-red-500 text-sm text-center">{error}</p>}
                    {message && <p className="text-green-600 text-sm text-center">{message}</p>}

                    <FormButton isLoading={loading}>
                        Reset Password
                    </FormButton>
                </form>

                 <p className="text-center text-sm text-gray-600 mt-8">
                    <Link to="/login" className="font-medium text-brand-blue hover:underline">
                        Back to Sign In
                    </Link>
                </p>
            </div>
        </div>
    );
};

export default ResetPasswordPage;
