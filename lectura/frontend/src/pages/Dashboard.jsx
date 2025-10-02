import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import DashboardLayout from '../layouts/DashboardLayout';

const DashboardCard = ({ to, iconUrl, title, description, color }) => {
  const colorClasses = {
    primary: 'hover:shadow-pixel-sm-primary hover:border-primary',
    secondary: 'hover:shadow-pixel-sm-secondary hover:border-secondary',
    accent: 'hover:shadow-pixel-sm-accent hover:border-accent',
  };

  return (
    <Link
      to={to}
      className={`
        block bg-base-200 p-6 border-2 border-base-300
        shadow-pixel-sm transition-all duration-200 ease-out
        hover:-translate-y-1 group ${colorClasses[color]}
      `}
    >
      <div className="flex items-center mb-4">
        <img src={iconUrl} alt={`${title} icon`} className="w-10 h-10 mr-4" />
        <h3 className="text-3xl font-pixel text-primary group-hover:text-secondary truncate">
          {title}
        </h3>
      </div>
      <p className="text-text-light font-sans">{description}</p>
    </Link>
  );
};

const Dashboard = () => {
    const { user } = useAuth();

    return (
        <DashboardLayout>
            <div className="mb-12">
                <h1 className="text-5xl font-pixel text-accent mb-2">
                    Welcome, {user?.username || 'Gamer'}!
                </h1>
                <p className="text-text-light text-lg">
                    Ready to conquer your courses? Let's get started.
                </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-8">
                <DashboardCard
                    to="/notes"
                    iconUrl="/icons/notes.svg"
                    title="Notes"
                    description="Browse and manage all shared study materials."
                    color="primary"
                />
                <DashboardCard
                    to="/upload"
                    iconUrl="/icons/upload.svg"
                    title="Upload"
                    description="Share a new note, document, or image with the class."
                    color="secondary"
                />
                <DashboardCard
                    to="/cgpa"
                    iconUrl="/icons/calculator.svg"
                    title="CGPA Calc"
                    description="Calculate your GPA and track your academic progress."
                    color="accent"
                />
                <DashboardCard
                    to="/profile"
                    iconUrl="/icons/profile.svg"
                    title="Profile"
                    description="Manage your account settings and public profile."
                    color="primary"
                />
            </div>
        </DashboardLayout>
    );
};

export default Dashboard;