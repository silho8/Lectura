import React from 'react';
import { FiBell, FiSearch } from 'react-icons/fi';

const Header = ({ title, userName }) => {
  return (
    <header className="flex items-center justify-between p-4 bg-white border-b border-gray-200">
      <h1 className="text-2xl font-bold text-gray-800">{title}</h1>
      <div className="flex items-center space-x-4">
        <button className="p-2 rounded-full hover:bg-gray-100">
          <FiSearch size={20} className="text-gray-600" />
        </button>
        <button className="p-2 rounded-full hover:bg-gray-100">
          <FiBell size={20} className="text-gray-600" />
        </button>
        <div className="flex items-center">
          <img
            src={`https://ui-avatars.com/api/?name=${userName}&background=0D6EFD&color=fff`}
            alt="User Avatar"
            className="w-10 h-10 rounded-full"
          />
          <div className="ml-3 hidden md:block">
            <p className="font-semibold text-gray-800">{userName}</p>
            <p className="text-sm text-gray-500">Student</p>
          </div>
        </div>
      </div>
    </header>
  );
};

Header.defaultProps = {
    title: "Dashboard",
    userName: "Guest"
}

export default Header;
