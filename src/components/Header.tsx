// src/components/Header.tsx
import { Link } from 'react-router-dom';

const Header = () => {
  return (
    <header className="bg-white shadow-md">
      <div className="container mx-auto p-4">
        <Link to="/" className="text-2xl font-bold text-blue-600">
          Quranify
        </Link>
      </div>
    </header>
  );
};

export default Header;