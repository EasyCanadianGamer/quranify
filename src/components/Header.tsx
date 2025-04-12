// import { Link } from 'react-router-dom';
// import { RxHamburgerMenu } from "react-icons/rx";
// import word from "../assets/Quranify(word).png";

// interface HeaderProps {
//   toggleSidebar: () => void;
// }

// const Header = ({ toggleSidebar }: HeaderProps) => {
  
//   return (
//     <header className="bg-white shadow-md">
//       <div className="container mx-auto p-4 flex items-center justify-between">
//         <button 
//           onClick={toggleSidebar} 
//           className=" text-gray-600 hover:text-gray-900"
//         >
//           <RxHamburgerMenu size={24} />
//         </button>
//         <Link to="/" className="text-2xl font-bold text-blue-600">
//           <img src={word} style={{ height: '100px', width: 'auto' }} alt="Quranify" />
//         </Link>
//         <div className=" w-6"></div> {/* Spacer for alignment */}
//       </div>
//     </header>
//   );
// };

// export default Header;
import { Link } from 'react-router-dom';
import { RxHamburgerMenu } from "react-icons/rx";
import { FaUserCircle, FaCog, FaBookmark, FaSignOutAlt } from "react-icons/fa";
import word from "../assets/Quranify(word).png";
import { useState, useEffect, useRef } from 'react';
import supabase  from '../utils/supbase';
import { toast } from 'react-toastify';

interface HeaderProps {
  toggleSidebar: () => void;
}

const Header = ({ toggleSidebar }: HeaderProps) => {
  const [user, setUser] = useState<any>(null);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Check for existing session on mount
  useEffect(() => {
    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        setUser(session.user);
      }
    };
    
    checkSession();

    const { data: authListener } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_IN' && session) {
        setUser(session.user);
      } else if (event === 'SIGNED_OUT') {
        setUser(null);
      }
    });

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
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

  const getInitial = () => {
    if (!user?.email) return '';
    return user.email.charAt(0).toUpperCase();
  };

  return (
    <header className="bg-white shadow-md relative">
      <div className="container mx-auto p-4 flex items-center justify-between">
        <button 
          onClick={toggleSidebar} 
          className="text-gray-600 hover:text-gray-900"
        >
          <RxHamburgerMenu size={24} />
        </button>
        <Link to="/" className="text-2xl font-bold text-blue-600">
          <img src={word} style={{ height: '100px', width: 'auto' }} alt="Quranify" />
        </Link>
        
        <div className="relative" ref={dropdownRef}>
          {user ? (
            <div className="flex items-center">
              <button
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className="relative flex items-center justify-center group"
              >
                {/* Animated ring when dropdown is open */}
                {isDropdownOpen && (
                  <div className="absolute -inset-1.5 border-2 border-white rounded-full animate-ping opacity-75"></div>
                )}
                
                {/* Profile picture */}
                <div className="w-10 h-10 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold text-lg group-hover:from-blue-600 group-hover:to-purple-700 transition-colors">
                  {getInitial()}
                </div>
              </button>

              {/* Dropdown menu - now properly positioned below */}
              {isDropdownOpen && (
             <div className="absolute right-0 top-full mt-2 w-56 bg-white rounded-md shadow-lg ring-1 ring-black ring-opacity-5 divide-y divide-gray-100 z-50">
             {/* Connector triangle with top/right borders */}
             <div className="absolute -top-1.5 right-3 w-3 h-3 bg-white transform rotate-45  border-r border-black border-opacity-20"></div>
                  <div className="px-4 py-3">
                    <p className="text-sm font-medium text-gray-900">{user.email}</p>
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
            <Link
              to="/login"
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              <FaUserCircle className="mr-2" />
              Login
            </Link>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;