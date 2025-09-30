// components/Dropdown.jsx
import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown } from 'lucide-react';
import { Link } from 'react-router-dom';

const Dropdown = ({ title, items = [], iconColor = '#f4a52c' }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={dropdownRef} onMouseLeave={() => setIsOpen(false)}>
      <button
        type="button"
        className=" flex items-center font-bold"
        onMouseEnter={() => setIsOpen(true)}
        onClick={() => setIsOpen(!isOpen)}
      >
        {title}
        <ChevronDown className={`ml-1 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} color={iconColor} />
      </button>

      {isOpen && (
        <div className="absolute left-0 mt-0 bg-white border border-gray-200 rounded-lg shadow-lg py-2 z-50 min-w-[180px]">
          {items.map(({ name, to }) => (
            <Link
              key={name}
              to={to}
              className="block px-4 py-2 text-gray-700 hover:bg-gray-100"
              onClick={() => setIsOpen(false)}
            >
              {name}
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};

export default Dropdown;
