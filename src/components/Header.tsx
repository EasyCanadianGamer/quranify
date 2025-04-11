// src/components/Header.tsx
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { RxHamburgerMenu } from "react-icons/rx";
import { FiSettings, FiLogOut } from "react-icons/fi";
import { createClient } from '../utils/supbase';
import word from "../assets/Quranify(word).png";
import { CiBookmark } from "react-icons/ci";
import { getUserDetails } from '../utils/api';

const supabase = createClient();

interface HeaderProps {
  toggleSidebar: () => void;
}

const Header = ({ toggleSidebar }: HeaderProps) => {
  const [user, setUser] = useState<any>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [avatar_url, setAvatarUrl] = useState<string | null>(null);

  useEffect(() => {
    const fetchUser = async () => {
      const user = await getUserDetails();
      setUser(user);
      setAvatarUrl(user?.avatar_url || null);
    };

    fetchUser();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, session) => {
      if (session?.user) {
        const freshUser = await getUserDetails();
        setUser(freshUser);
        setAvatarUrl(freshUser?.avatar_url || null);
      } else {
        setUser(null);
        setAvatarUrl(null);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    window.location.href = '/login';
  };

  const handleBookmarksClick = () => {
    console.log('Bookmarks clicked');
  };

  return (
    <header className="bg-white shadow-md sticky top-0 z-10">
      <div className="container mx-auto p-4 flex items-center justify-between">
        <button 
          onClick={toggleSidebar} 
          className="text-gray-600 hover:text-gray-900 focus:outline-none"
          aria-label="Toggle sidebar"
        >
          <RxHamburgerMenu size={24} />
        </button>

        <Link to="/" className="text-2xl font-bold text-blue-600">
          <img 
            src={word} 
            style={{ height: '100px', width: 'auto' }} 
            alt="Quranify" 
            className="hover:opacity-90 transition-opacity"
          />
        </Link>

        <div className="relative">
          {user && (avatar_url || user.email) ? (
            <>
              <button
                onClick={() => setIsOpen(!isOpen)}
                className="flex items-center space-x-2 focus:outline-none"
                aria-label="User menu"
              >
                <div className="relative mt-1">
                  <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600">
                    {avatar_url ? (
                      <img 
                        src={avatar_url} 
                        alt="Profile" 
                        className="w-full h-full rounded-full object-cover"
                      />
                    ) : (
                      <span>{user.email?.charAt(0).toUpperCase()}</span>
                    )}
                  </div>
                  {isOpen && (
                    <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2">
                      <div className="w-4 h-4 bg-white rotate-45 transform origin-bottom-left border-t border-l border-gray-200"></div>
                    </div>
                  )}
                </div>
              </button>

              {isOpen && (
                <>
                  <div 
                    className="fixed inset-0 bg-black opacity-0 z-20"
                    onClick={() => setIsOpen(false)}
                  />

                  <div className="absolute right-0 mt-3 w-48 bg-white rounded-md shadow-lg py-1 z-30 border border-gray-200">
                    <div className="absolute -top-2 right-3 w-4 h-4 bg-white transform rotate-45 border-t border-l border-gray-200 z-10"></div>

                    <div className="px-4 py-2 border-b relative z-20 bg-white">
                      <p className="text-sm font-medium text-gray-700 truncate">{user.email}</p>
                    </div>
                    <Link
                      to="/settings"
                      className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 relative z-20"
                      onClick={() => setIsOpen(false)}
                    >
                      <FiSettings className="mr-2" />
                      Settings
                    </Link>
                    <button
                      onClick={handleBookmarksClick}
                      className="w-full text-left flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 relative z-20"
                    >
                      <CiBookmark className="mr-2" />
                      Bookmarks
                    </button>
                    <button
                      onClick={handleLogout}
                      className="w-full text-left flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 relative z-20"
                    >
                      <FiLogOut className="mr-2" />
                      Sign out
                    </button>
                  </div>
                </>
              )}
            </>
          ) : (
            <div className="flex space-x-4">
              <Link
                to="/login"
                className="px-3 py-1 text-sm bg-blue-600 text-white rounded hover:bg-blue-700"
              >
                Sign in
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
