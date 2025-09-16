import React from 'react';
import { FiFileText, FiCpu, FiUsers, FiSettings } from 'react-icons/fi';
import DashboardLayout from '../layouts/DashboardLayout';
import Header from '../components/Header';

const DashboardCard = ({ icon, title, description, color }) => {
    const IconComponent = icon;
    return (
        <div className="bg-white p-6 rounded-xl shadow-sm hover:shadow-lg transition-shadow duration-300">
            <div className={`w-12 h-12 flex items-center justify-center rounded-full bg-${color}-100 mb-4`}>
                <IconComponent size={24} className={`text-${color}-600`} />
            </div>
            <h3 className="text-xl font-bold text-gray-800 mb-1">{title}</h3>
            <p className="text-gray-500">{description}</p>
        </div>
    );
};

const Dashboard = () => {
    // This would come from auth context in a real app
    const user = { fullName: "Jane Doe" };

    return (
        <DashboardLayout>
            <Header title="Dashboard" userName={user.fullName} />
            <main className="flex-1 overflow-x-hidden overflow-y-auto bg-brand-background p-4 md:p-8">
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-800">Welcome, {user.fullName}!</h1>
                    <p className="text-gray-600 mt-1">Here's a summary of your activities.</p>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    <DashboardCard
                        icon={FiFileText}
                        title="Notes"
                        description="Upload and share lecture notes easily."
                        color="blue"
                    />
                    <DashboardCard
                        icon={FiCpu}
                        title="CGPA"
                        description="Track and calculate your GPA seamlessly."
                        color="green"
                    />
                    <DashboardCard
                        icon={FiUsers}
                        title="Community"
                        description="Connect with fellow students."
                        color="purple"
                    />
                    <DashboardCard
                        icon={FiSettings}
                        title="Settings"
                        description="Manage your profile and preferences."
                        color="gray"
                    />
                </div>
            </main>
        </DashboardLayout>
    );
};

export default Dashboard;
