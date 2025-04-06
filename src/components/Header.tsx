// // src/components/Header.tsx
// import { Link } from 'react-router-dom';
// import word from "../assets/Quranify(word).png";
// const Header = () => {
//   return (
//     <header className="bg-white shadow-md">
//       <div className="container mx-auto p-4">
//         <Link to="/" className="text-2xl font-bold text-blue-600">
//         <img src={word}  style={{ height: '100px', width: 'auto' }}  alt= "Quranify" />

//         </Link>
//       </div>
//     </header>
//   );
// };

// export default Header;

// src/components/Header.tsx
import { Link } from 'react-router-dom';
import { RxHamburgerMenu } from "react-icons/rx";
import word from "../assets/Quranify(word).png";

interface HeaderProps {
  toggleSidebar: () => void;
}

const Header = ({ toggleSidebar }: HeaderProps) => {
  
  return (
    <header className="bg-white shadow-md">
      <div className="container mx-auto p-4 flex items-center justify-between">
        <button 
          onClick={toggleSidebar} 
          className=" text-gray-600 hover:text-gray-900"
        >
          <RxHamburgerMenu size={24} />
        </button>
        <Link to="/" className="text-2xl font-bold text-blue-600">
          <img src={word} style={{ height: '100px', width: 'auto' }} alt="Quranify" />
        </Link>
        <div className=" w-6"></div> {/* Spacer for alignment */}
      </div>
    </header>
  );
};

export default Header;