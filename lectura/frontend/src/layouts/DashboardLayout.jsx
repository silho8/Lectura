import React from 'react';
import Header from '../components/Header';
import { Toaster } from 'react-hot-toast';

const DashboardLayout = ({ children }) => {
  return (
    <div className="flex flex-col min-h-screen bg-base-100 font-sans">
      <Header />
      <main className="flex-1 w-full max-w-7xl mx-auto px-4 py-8">
        {children}
      </main>
      <Toaster
        position="bottom-right"
        toastOptions={{
          style: {
            background: '#2C2C2C', // base-200
            color: '#E0E0E0', // text-light
            border: '2px solid #444444', // base-300
            fontFamily: '"Pixelify Sans", sans-serif',
          },
          success: {
            iconTheme: {
              primary: '#00FF00', // success
              secondary: '#1A1A1A', // base-100
            },
          },
          error: {
            iconTheme: {
              primary: '#FF0000', // error
              secondary: '#1A1A1A', // base-100
            },
          },
        }}
      />
    </div>
  );
};

export default DashboardLayout;