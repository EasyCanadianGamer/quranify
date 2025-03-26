// import { BrowserRouter, Routes, Route } from 'react-router-dom';
// import SurahList from './components/SurahList';
// import SurahDetail from './components/SurahDetail';
// import Header from './components/Header';
// import Footer from './components/Footer';
// import GoogleAd from "./components/GoogleAd";

// const App = () => {
//   return (
//     <BrowserRouter>
//       <div className="min-h-screen bg-gray-50 flex">

        
//         {/* Header */}
//         <Header />

//         {/* Main Content */}
//         <main className="container mx-auto p-4">
//           <Routes>
//             {/* Home Page - List of Surahs */}
//             <Route path="/" element={<SurahList />} />

//             {/* Surah Detail Page */}
//             <Route path="/surah/:surahNumber" element={<SurahDetail />} />
//           </Routes>
//         </main>

//         <aside className="w-1/4 ml-4">
//             <div className="sticky top-4">
//               <GoogleAd adSlot="1234567890" style={{ height: 300, width: '100%' }} />
//               <div className="mt-4">
//                 <GoogleAd adSlot="0987654321" style={{ height: 300, width: '100%' }} />
//               </div>
//             </div>
//           </aside>
//         <Footer/>

//       </div>
//     </BrowserRouter>
//   );
// };

// export default App;

import Header from "./components/Header";
import Footer from "./components/Footer";
// import Sidebar from "./components/Sidebar";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import SurahList from "./components/SurahList";
import SurahDetail from "./components/SurahDetail";

const App = () => {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-gray-50 flex">
        {/* Sidebar
        <Sidebar /> */}

        <div className="flex-1 flex flex-col">
          {/* Header */}
          <Header />

          {/* Main Content */}
          <main className="container mx-auto p-4 flex-grow">
            <Routes>
              <Route path="/" element={<SurahList />} />
              <Route path="/surah/:surahNumber" element={<SurahDetail />} />
            </Routes>
          </main>

          {/* Footer */}
          <Footer />
        </div>
      </div>
    </BrowserRouter>
  );
};

export default App;
