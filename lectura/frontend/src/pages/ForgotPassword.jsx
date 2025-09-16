import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import authService from '../services/authService';
import FormInput from '../components/forms/FormInput';
import FormButton from '../components/forms/FormButton';

const ForgotPasswordPage = () => {
    const [email, setEmail] = useState('');
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [resetToken, setResetToken] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setMessage('');
        setResetToken('');
        setLoading(true);
        try {
            const data = await authService.forgotPassword(email);
            setMessage(data.message);
            if (data.resetToken) {
                setResetToken(data.resetToken);
            }
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
                    <h1 className="text-3xl font-bold text-gray-800">Forgot Password</h1>
                    <p className="text-gray-500 mt-2">Enter your email to receive a reset token.</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <FormInput
                        id="email"
                        label="Email"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="you@example.com"
                        required
                    />

                    {error && <p className="text-red-500 text-sm text-center">{error}</p>}
                    {message && <p className="text-green-600 text-sm text-center">{message}</p>}

                    {resetToken && (
                        <div className="p-4 bg-yellow-100 border border-yellow-300 rounded-lg">
                            <p className="text-sm text-yellow-800">
                                <strong>Dev Mode Only:</strong> Your reset token is:
                            </p>
                            <p className="text-xs text-yellow-700 break-all mt-2">{resetToken}</p>
                        </div>
                    )}


                    <FormButton isLoading={loading}>
                        Send Reset Token
                    </FormButton>
                </form>

                <p className="text-center text-sm text-gray-600 mt-8">
                    Remembered your password?{' '}
                    <Link to="/login" className="font-medium text-brand-blue hover:underline">
                        Sign In
                    </Link>
                </p>
            </div>
        </div>
    );
};

export default ForgotPasswordPage;
