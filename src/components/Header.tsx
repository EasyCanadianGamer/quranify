import { Link } from 'react-router-dom';
import { RxHamburgerMenu } from "react-icons/rx";
import { FaUserCircle, FaCog, FaBookmark, FaSignOutAlt, FaUserPlus } from "react-icons/fa";
import word from "../assets/Quranify(word).png";
import { useState, useEffect, useRef } from 'react';
import  supabase  from '../utils/supbase';
import { toast } from 'react-toastify';
import ProfilePicture from './ProfilePicture';

interface HeaderProps {
  toggleSidebar: () => void;
}

const Header = ({ toggleSidebar }: HeaderProps) => {
  const [user, setUser] = useState<any>(null);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Handle auth state changes
  useEffect(() => {
    const getSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setUser(session?.user ?? null);
    };

    getSession();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      toast.error(error.message);
    } else {
      toast.success('Logged out successfully');
      setUser(null);
      setIsDropdownOpen(false);
    }
  };

  const getInitial = () => user?.email?.charAt(0).toUpperCase() || '';

  return (
    <header className="bg-white shadow-md relative">
  <div className="container mx-auto p-4 flex items-center">
    {/* Left-aligned hamburger menu */}
    <button 
      onClick={toggleSidebar} 
      className="text-gray-600 hover:text-gray-900 mr-4"
      aria-label="Toggle sidebar"
    >
      <RxHamburgerMenu size={24} />
    </button>

    {/* Centered logo with flex-grow */}
    <div className="flex-1 flex justify-center">
    <Link to="/" className="text-2xl font-bold text-blue-600">
      <img src={word} style={{ height: '100px', width: 'auto' }} alt="Quranify" />
    </Link>
  </div>

    {/* Right-aligned auth section */}
    <div className="w-24 flex justify-end" ref={dropdownRef}>
      {user ? (
        <div className="flex items-center">
          <button
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            className="relative flex items-center justify-center group"
            aria-label="User menu"
          >
            {isDropdownOpen && (
              <div className="absolute -inset-1.5 border-2 border-white rounded-full animate-ping opacity-75"></div>
            )}
            
            <ProfilePicture 
              userId={user.id}
              size="md"
              className="rounded-full border-2 border-white group-hover:border-blue-200 transition-all"
              initial={getInitial()}
            />
          </button>

          {/* Dropdown menu remains the same */}
          {isDropdownOpen && (
            <div className="absolute right-0 top-full mt-2 w-56 bg-white rounded-md shadow-lg ring-1 ring-black ring-opacity-5 divide-y divide-gray-100 z-50">
              <div className="absolute -top-1.5 right-3 w-3 h-3 bg-white transform rotate-45 border-t border-r border-gray-200"></div>
              <div className="px-4 py-3">
                <p className="text-sm font-medium text-gray-900 truncate">{user.email}</p>
              </div>
              
              <div className="py-1">
                <Link
                  to="/settings"
                  className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  onClick={() => setIsDropdownOpen(false)}
                >
                  <FaCog className="mr-3 text-gray-400" />
                  Settings
                </Link>
                <Link
                  to="/bookmarks"
                  className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  onClick={() => setIsDropdownOpen(false)}
                >
                  <FaBookmark className="mr-3 text-gray-400" />
                  Bookmarks
                </Link>
              </div>
              
              <div className="py-1">
                <button
                  onClick={handleLogout}
                  className="flex w-full items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                >
                  <FaSignOutAlt className="mr-3 text-gray-400" />
                  Logout
                </button>
              </div>
            </div>
          )}
        </div>
      ) : (
        <div className="flex items-center space-x-2">
        <Link
          to="/login"
          className="inline-flex items-center px-3 py-2 text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
        >
          <FaUserCircle className="mr-2" />
          Login
        </Link>
        <Link
          to="/signup"
          className="inline-flex items-center px-3 py-2 text-sm font-medium rounded-md text-blue-700 bg-blue-100 hover:bg-blue-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
        >
          <FaUserPlus className="mr-2" />
          Sign Up
        </Link>
      </div>
      )}
    </div>
  </div>
</header>
  );
};

export default Header;