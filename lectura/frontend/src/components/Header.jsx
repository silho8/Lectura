import React, { useState } from 'react';
import { NavLink, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

// --- Local SVG Icon Components ---
const LogoutIcon = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="M10 2 L18 2 L18 22 L10 22 Z" strokeWidth="2"/>
    <path d="M14 12 L2 12" strokeWidth="3" />
    <path d="M6 8 L2 12 L6 16" strokeWidth="3" />
  </svg>
);

const MenuIcon = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="M2 6 L22 6" strokeWidth="4" />
    <path d="M2 12 L22 12" strokeWidth="4" />
    <path d="M2 18 L22 18" strokeWidth="4" />
  </svg>
);

const CloseIcon = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="M4 4 L20 20" />
    <path d="M20 4 L4 20" />
  </svg>
);

// --- Main Components ---
const Avatar = ({ user }) => {
  const initial = user?.username ? user.username[0].toUpperCase() : '?';
  return (
    <div className="w-10 h-10 bg-base-300 border-2 border-primary flex items-center justify-center cursor-pointer hover:border-accent transition-colors">
      <span className="font-pixel text-2xl text-accent">{initial}</span>
    </div>
  );
};

const NavItem = ({ to, children }) => (
  <NavLink
    to={to}
    className={({ isActive }) =>
      `font-pixel text-xl uppercase tracking-widest transition-colors duration-200 ` +
      (isActive ? 'text-secondary' : 'text-primary hover:text-accent')
    }
  >
    {children}
  </NavLink>
);

const Header = () => {
  const { user, logout } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);

  const handleLogout = async () => {
    await logout();
  };

  const navLinks = (
    <>
      <NavItem to="/dashboard">Dashboard</NavItem>
      <NavItem to="/notes">Notes</NavItem>
      <NavItem to="/upload">Upload</NavItem>
      <NavItem to="/cgpa">CGPA</NavItem>
    </>
  );

  return (
    <>
      <header className="bg-base-200 border-b-4 border-base-300">
        <div className="w-full max-w-7xl mx-auto px-4">
          <div className="flex justify-between items-center h-20">
            <Link to="/dashboard">
              <img src="/logo.svg" alt="Lectura Logo" className="h-8" />
            </Link>

            <nav className="hidden md:flex items-center space-x-8">{navLinks}</nav>

            <div className="flex items-center space-x-4">
              {user && (
                <div className="relative">
                  <button onClick={() => setProfileMenuOpen(!profileMenuOpen)} className="focus:outline-none">
                    <Avatar user={user} />
                  </button>
                  {profileMenuOpen && (
                    <div className="absolute right-0 mt-2 w-48 bg-base-300 border-2 border-primary shadow-pixel-sm-primary z-20">
                      <Link
                        to="/profile"
                        className="block w-full text-left px-4 py-3 font-pixel text-primary hover:bg-primary hover:text-text-dark"
                        onClick={() => setProfileMenuOpen(false)}
                      >
                        Profile
                      </Link>
                      <button
                        onClick={handleLogout}
                        className="flex items-center w-full text-left px-4 py-3 font-pixel text-primary hover:bg-primary hover:text-text-dark"
                      >
                        <LogoutIcon className="w-5 h-5 mr-2" /> Logout
                      </button>
                    </div>
                  )}
                </div>
              )}

              <div className="md:hidden">
                <button onClick={() => setMenuOpen(!menuOpen)} className="focus:outline-none">
                  <MenuIcon className="w-8 h-8 text-primary" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </header>

      {menuOpen && (
        <div className="fixed inset-0 bg-base-100 bg-opacity-95 z-50 flex flex-col items-center justify-center md:hidden">
          <button onClick={() => setMenuOpen(false)} className="absolute top-6 right-6 focus:outline-none">
            <CloseIcon className="w-10 h-10 text-primary" />
          </button>
          <nav className="flex flex-col items-center space-y-8">
            {React.Children.map(navLinks.props.children, child => (
              <div onClick={() => setMenuOpen(false)}>{child}</div>
            ))}
          </nav>
        </div>
      )}
    </>
  );
};

export default Header;