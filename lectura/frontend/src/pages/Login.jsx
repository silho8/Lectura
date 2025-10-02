import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import FormInput from '../components/forms/FormInput';
import FormButton from '../components/forms/FormButton';
import toast from 'react-hot-toast';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);

    const { login } = useAuth();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        const toastId = toast.loading('Signing in...');
        try {
            await login(email, password);
            toast.success('Signed in successfully!', { id: toastId });
            // The AuthProvider and router will handle the redirect automatically.
        } catch (err) {
            toast.error(err.message || 'Invalid login credentials.', { id: toastId });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-base-100 p-4">
            <div className="w-full max-w-md">
                <div className="text-center mb-8">
                    <h1 className="text-6xl font-pixel text-accent animate-pulse-glow">Lectura</h1>
                    <p className="font-pixel text-xl text-primary mt-2">Log in to the Grid</p>
                </div>

                <div className="bg-base-200 p-8 border-2 border-base-300 shadow-pixel-sm">
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <FormInput
                            id="email"
                            label="Email"
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="pilot@lectura.io"
                            required
                        />
                        <FormInput
                            id="password"
                            label="Password"
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="************"
                            required
                        />
                        <div className="text-right">
                            <Link to="/forgot-password" className="text-sm font-pixel text-primary hover:text-accent hover:underline">
                                Forgot Password?
                            </Link>
                        </div>

                        <FormButton type="submit" isLoading={loading} fullWidth={true}>
                            Engage
                        </FormButton>
                    </form>
                </div>

                <p className="text-center text-md font-pixel text-text-light mt-8">
                    No account?{' '}
                    <Link to="/signup" className="font-bold text-primary hover:text-accent hover:underline">
                        Create one
                    </Link>
                </p>
            </div>
        </div>
    );
};

export default Login;