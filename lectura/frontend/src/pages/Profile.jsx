import React, { useState, useEffect } from 'react';
import DashboardLayout from '../layouts/DashboardLayout';
import Header from '../components/Header';
import FormInput from '../components/forms/FormInput';
import FormButton from '../components/forms/FormButton';
import { useAuth } from '../context/AuthContext';
import userService from '../services/userService';

const ProfilePage = () => {
    const { user, loading: authLoading } = useAuth();

    const [fullName, setFullName] = useState('');
    const [university, setUniversity] = useState('');
    const [matricNumber, setMatricNumber] = useState('');
    const [theme, setTheme] = useState('light');

    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('');

    useEffect(() => {
        if (user) {
            setFullName(user.full_name || '');
            setUniversity(user.university || '');
            setMatricNumber(user.matric_number || '');
            setTheme(user.theme_preference || 'light');
        }
    }, [user]);

    useEffect(() => {
        document.documentElement.classList.toggle('dark', theme === 'dark');
    }, [theme]);

    const handleProfileUpdate = async (e) => {
        e.preventDefault();
        setLoading(true);
        setMessage('');
        try {
            await userService.updateUserProfile({
                full_name: fullName,
                university,
                matric_number: matricNumber,
            });
            setMessage('Profile updated successfully!');
        } catch (error) {
            setMessage('Failed to update profile.');
        } finally {
            setLoading(false);
        }
    };

    const handleThemeChange = async (newTheme) => {
        setTheme(newTheme);
        try {
            await userService.updateUserTheme(newTheme);
        } catch (error) {
            // Revert on failure
            setTheme(theme);
            console.error("Failed to save theme preference.");
        }
    }

    if (authLoading) return <div>Loading...</div>;

    return (
        <DashboardLayout>
            <Header title="My Profile" />
            <main className="flex-1 overflow-x-hidden overflow-y-auto bg-brand-background p-4 md:p-8">
                <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
                    {/* Left Column: Avatar */}
                    <div className="md:col-span-1">
                         <div className="bg-white p-6 rounded-xl shadow-sm text-center">
                            <img
                                src={`https://ui-avatars.com/api/?name=${user?.full_name}&background=0D6EFD&color=fff&size=128`}
                                alt="User Avatar"
                                className="w-32 h-32 rounded-full mx-auto mb-4"
                            />
                            <h2 className="text-2xl font-bold">{user?.full_name}</h2>
                            <p className="text-gray-500">{user?.email}</p>
                            <button className="mt-4 w-full bg-gray-200 text-gray-800 font-semibold py-2 rounded-lg hover:bg-gray-300">
                                Change Avatar
                            </button>
                        </div>
                    </div>

                    {/* Right Column: Forms */}
                    <div className="md:col-span-2 space-y-8">
                        <div className="bg-white p-8 rounded-xl shadow-sm">
                            <h3 className="text-xl font-bold mb-6">Profile Information</h3>
                            <form onSubmit={handleProfileUpdate} className="space-y-4">
                                <FormInput id="fullName" label="Full Name" value={fullName} onChange={e => setFullName(e.target.value)} />
                                <FormInput id="university" label="University" value={university} onChange={e => setUniversity(e.target.value)} />
                                <FormInput id="matricNumber" label="Matriculation Number" value={matricNumber} onChange={e => setMatricNumber(e.target.value)} />
                                <div className="text-right">
                                    <FormButton isLoading={loading} type="submit" fullWidth={false}>Save Changes</FormButton>
                                </div>
                            </form>
                        </div>

                        <div className="bg-white p-8 rounded-xl shadow-sm">
                             <h3 className="text-xl font-bold mb-6">Theme Preference</h3>
                             <div className="flex space-x-4">
                                <button onClick={() => handleThemeChange('light')} className={`px-6 py-2 rounded-lg font-semibold ${theme === 'light' ? 'bg-brand-blue text-white' : 'bg-gray-200'}`}>
                                    Light
                                </button>
                                <button onClick={() => handleThemeChange('dark')} className={`px-6 py-2 rounded-lg font-semibold ${theme === 'dark' ? 'bg-brand-blue text-white' : 'bg-gray-200'}`}>
                                    Dark
                                </button>
                             </div>
                        </div>

                        {message && <p className="text-center text-green-600">{message}</p>}
                    </div>
                </div>
            </main>
        </DashboardLayout>
    );
};

export default ProfilePage;
