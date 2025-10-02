import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import FormInput from '../components/forms/FormInput';
import FormButton from '../components/forms/FormButton';
import toast from 'react-hot-toast';

const Signup = () => {
    const [fullName, setFullName] = useState('');
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [repeatPassword, setRepeatPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [isSubmitted, setIsSubmitted] = useState(false);

    const { signup } = useAuth();

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (password !== repeatPassword) {
            toast.error("Passwords do not match.");
            return;
        }
        if (password.length < 6) {
            toast.error("Password must be at least 6 characters.");
            return;
        }
        setLoading(true);
        const toastId = toast.loading('Creating account...');
        try {
            await signup(email, password, fullName, username);
            toast.success('Account created! Check your email for verification.', { id: toastId });
            setIsSubmitted(true);
        } catch (err) {
            toast.error(err.message || 'Failed to sign up.', { id: toastId });
        } finally {
            setLoading(false);
        }
    };

    if (isSubmitted) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center bg-base-100 p-4">
                 <div className="w-full max-w-md text-center">
                    <h1 className="text-5xl font-pixel text-accent mb-4">Verify Your Email</h1>
                    <div className="bg-base-200 p-8 border-2 border-primary shadow-pixel-sm-primary">
                        <p className="text-text-light text-lg mb-4">
                            A confirmation link has been sent to <strong className="text-accent">{email}</strong>. Please click the link to activate your account.
                        </p>
                        <Link to="/login" className="font-pixel text-xl text-primary hover:text-accent hover:underline">
                            Return to Login
                        </Link>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-base-100 p-4">
            <div className="w-full max-w-md">
                <div className="text-center mb-8">
                    <h1 className="text-6xl font-pixel text-accent animate-pulse-glow">Lectura</h1>
                    <p className="font-pixel text-xl text-primary mt-2">Create a New Pilot Profile</p>
                </div>

                <div className="bg-base-200 p-8 border-2 border-base-300 shadow-pixel-sm">
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <FormInput id="fullName" label="Full Name" type="text" value={fullName} onChange={(e) => setFullName(e.target.value)} placeholder="e.g., Jane Doe" required />
                        <FormInput id="username" label="Username" type="text" value={username} onChange={(e) => setUsername(e.target.value)} placeholder="e.g., janedoe" required />
                        <FormInput id="email" label="Email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="pilot@lectura.io" required />
                        <FormInput id="password" label="Password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Min. 6 characters" required />
                        <FormInput id="repeatPassword" label="Repeat Password" type="password" value={repeatPassword} onChange={(e) => setRepeatPassword(e.target.value)} placeholder="Confirm your password" required />

                        <FormButton type="submit" isLoading={loading} fullWidth={true}>
                            Register
                        </FormButton>
                    </form>
                </div>

                <p className="text-center text-md font-pixel text-text-light mt-8">
                    Already have an account?{' '}
                    <Link to="/login" className="font-bold text-primary hover:text-accent hover:underline">
                        Log In
                    </Link>
                </p>
            </div>
        </div>
    );
};

export default Signup;