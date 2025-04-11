import { useState } from "react";
import Header from "./components/Headers";
import Footer from "./components/Footer";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import SurahList from "./components/SurahList";
import SurahDetail from "./components/SurahDetail";
import AdBanner from "./components/AdBanner";
// import AdBanner160x600 from "./components/AdBanner160x600";
import AdBanner728x90 from "./components/AdBanner728x90";
import AdBanner320x50 from "./components/AdBanner320x50";
import ConversionTracker from "./components/ConversionTracker";
import Sidebar from "./components/Sidebar";
import Roadmap from "./components/Roadmap";
import DuaList from "./components/DuaList";
import About from "./components/About";
import Privacy from "./components/Privacy";
import Login from "./components/Login";
import Settings from "./components/Settings";
const App = () => {

  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <BrowserRouter>
      <div className="min-h-screen bg-gray-50 flex">
      <Sidebar isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />
     
        {/* Left Sidebar - Vertical Ad */}
        {/* <div className="hidden md:block sticky top-0 h-screen">
          <div className="p-4">
            <AdBanner160x600 />
          </div>
        </div> */}

        {/* Main Content */}
        
        <div className="flex-1 flex flex-col">
          {/* Top Leaderboard Ad */}
          <div className="w-full">
            <div className="hidden sm:block">
              <AdBanner728x90 />
            </div>
            <div className="sm:hidden">
              <AdBanner320x50 />
            </div>
          </div>

          <Header toggleSidebar={toggleSidebar} />

          <main className="container mx-auto p-4 flex-grow">
            <Routes>
              <Route path="/" element={<SurahList />} />
              <Route path="/surah/:surahNumber" element={<SurahDetail />} />
              <Route path="/roadmap" element={<Roadmap />} />
              <Route path="/dua" element={<DuaList />} />
              <Route path="/about" element={<About />} />
              <Route path="/privacy" element={<Privacy />} />
              <Route path="/login" element={<Login />} />
              <Route path="/settings" element={<Settings />} />
            </Routes>

            {/* Bottom Rectangle Ad */}
            <div className="max-w-[300px] mx-auto my-8">
              <AdBanner/>
            </div>
          </main>

          <Footer />
        </div>
      </div>

      <ConversionTracker />
    </BrowserRouter>
  );
};

export default App;