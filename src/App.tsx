import { BrowserRouter, Routes, Route } from 'react-router-dom';
import SurahList from './components/SurahList';
import SurahDetail from './components/SurahDetail';
import Header from './components/Header';
import Footer from './components/Footer';

const App = () => {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <Header />

        {/* Main Content */}
        <main className="container mx-auto p-4">
          <Routes>
            {/* Home Page - List of Surahs */}
            <Route path="/" element={<SurahList />} />

            {/* Surah Detail Page */}
            <Route path="/surah/:surahNumber" element={<SurahDetail />} />
          </Routes>
        </main>
        <Footer/>

      </div>
    </BrowserRouter>
  );
};

export default App;