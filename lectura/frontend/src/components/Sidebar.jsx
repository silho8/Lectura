import React from 'react';
import { NavLink } from 'react-router-dom';
import { FiHome, FiFileText, FiCpu, FiUser, FiLogOut, FiShield } from 'react-icons/fi';
import { useAuth } from '../context/AuthContext';

const Sidebar = () => {
  const { user, logout } = useAuth();
  const navLinkClasses = ({ isActive }) =>
    `flex items-center px-4 py-3 text-gray-700 hover:bg-brand-blue/10 hover:text-brand-blue rounded-lg transition-colors duration-200 ${
      isActive ? 'bg-brand-blue/10 text-brand-blue font-semibold' : 'font-medium'
    }`;

  return (
    // On mobile (sm), this will be a bottom bar. On medium and up (md), it's a sidebar.
    <aside className="fixed bottom-0 left-0 z-20 w-full bg-white shadow-lg md:relative md:w-64 md:h-screen md:shadow-none md:border-r border-gray-200">
      <div className="hidden md:flex items-center justify-center p-6 border-b border-gray-200">
        <h1 className="text-2xl font-bold text-brand-blue">Lectura</h1>
      </div>

      {/* Mobile bottom nav */}
      <nav className="md:hidden">
        <ul className="flex justify-around items-center h-16">
          <li>
            <NavLink to="/dashboard" className={navLinkClasses}>
              <FiHome size={24} />
            </NavLink>
          </li>
          <li>
            <NavLink to="/notes" className={navLinkClasses}>
              <FiFileText size={24} />
            </NavLink>
          </li>
          <li>
            <NavLink to="/cgpa" className={navLinkClasses}>
              <FiCpu size={24} />
            </NavLink>
          </li>
          <li>
            <NavLink to="/profile" className={navLinkClasses}>
              <FiUser size={24} />
            </NavLink>
          </li>
        </ul>
      </nav>

      {/* Desktop sidebar nav */}
      <nav className="hidden md:block p-4">
        <ul className="space-y-2">
          <li>
            <NavLink to="/dashboard" className={navLinkClasses}>
              <FiHome className="mr-3" size={20} />
              <span>Dashboard</span>
            </NavLink>
          </li>
          <li>
            <NavLink to="/notes" className={navLinkClasses}>
              <FiFileText className="mr-3" size={20} />
              <span>Notes</span>
            </NavLink>
          </li>
          <li>
            <NavLink to="/cgpa" className={navLinkClasses}>
              <FiCpu className="mr-3" size={20} />
              <span>CGPA Calculator</span>
            </NavLink>
          </li>
          <li>
            <NavLink to="/profile" className={navLinkClasses}>
              <FiUser className="mr-3" size={20} />
              <span>Profile</span>
            </NavLink>
          </li>
          {user?.role === 'admin' && (
            <li>
              <NavLink to="/admin" className={navLinkClasses}>
                <FiShield className="mr-3" size={20} />
                <span>Admin</span>
              </NavLink>
            </li>
          )}
        </ul>
        <div className="absolute bottom-0 left-0 w-full p-4">
           <button onClick={logout} className={`${navLinkClasses({isActive: false})} w-full !text-red-500 hover:!bg-red-500/10`}>
              <FiLogOut className="mr-3" size={20} />
              <span>Logout</span>
            </button>
        </div>
      </nav>
    </aside>
  );
};

export default Sidebar;
