// src/components/Header.tsx
import { Link } from 'react-router-dom';
import word from "../assets/Quranify(word).png";
const Header = () => {
  return (
    <header className="bg-white shadow-md">
      <div className="container mx-auto p-4">
        <Link to="/" className="text-2xl font-bold text-blue-600">
        <img src={word}  style={{ height: '100px', width: 'auto' }}  alt= "Quranify" />

        </Link>
      </div>
    </header>
  );
};

export default Header;