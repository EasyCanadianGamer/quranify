// src/components/Sidebar.tsx
import { AiOutlineClose } from "react-icons/ai";
interface SidebarProps {
  isOpen: boolean;
  toggleSidebar: () => void;
}


const Sidebar = ({ isOpen, toggleSidebar }: SidebarProps) => {
  
  return (
    <>
      {/* Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 backdrop-blur-xs  z-40"
          onClick={toggleSidebar}
        />
      )}

      {/* Sidebar */}
      <div
        className={`fixed top-0 left-0 h-full w-64 bg-white shadow-lg z-50 transform transition-transform duration-300 ease-in-out ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="p-4 flex justify-between items-center border-b">
          <h2 className="text-xl font-bold">Menu</h2>
          <button onClick={toggleSidebar} className="text-gray-500 hover:text-gray-700">
            <AiOutlineClose size={24} />
          </button>
        </div>
        <nav className="p-4">
          <ul className="space-y-2">
            <li>
              <a href="/" className="block p-2 hover:bg-gray-100 rounded">
                Home
              </a>
            </li>
            <li>
              <a href="dua" className="block p-2 hover:bg-gray-100 rounded">
                Duas
              </a>
            </li>
            <li>
              <a href="roadmap" className="block p-2 hover:bg-gray-100 rounded">
                Roadmap
              </a>
            </li>
          </ul>
        </nav>
      </div>
    </>
  );
};

export default Sidebar;