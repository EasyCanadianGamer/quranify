// src/components/SurahDetail.tsx
import { useEffect, useState, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { fetchSurah, fetchReciters, fetchVerseAudio, fetchChapterAudio } from '../utils/api';
import CustomAudioPlayer from './AudioPlayer';
import { FaPlay, FaPause, FaArrowLeft } from 'react-icons/fa';
import '../css/surah.css';

const SurahDetail = () => {
  const { surahNumber } = useParams<{ surahNumber: string }>();
  const navigate = useNavigate();
  const [surah, setSurah] = useState<any>(null);
  const [reciters, setReciters] = useState<{ [key: string]: string }>({});
  const [selectedReciter, setSelectedReciter] = useState<string>('1'); // Default reciter: Mishary Rashid Al-Afasy
  const [chapterAudio, setChapterAudio] = useState<{ [key: string]: { reciter: string; url: string; originalUrl: string } }>({});
  const [currentVerseIndex, setCurrentVerseIndex] = useState<number | null>(null); // Track the currently playing verse index
  const [isPlaying, setIsPlaying] = useState(false); // Track play/pause state
  const audioRef = useRef<HTMLAudioElement | null>(null); // Ref to store the Audio object
  const [isChapterPlaying, setIsChapterPlaying] = useState(false);

  useEffect(() => {
    const loadSurah = async () => {
      try {
        const data = await fetchSurah(Number(surahNumber));
        setSurah(data);
      } catch (error) {
        console.error('Error fetching Surah:', error);
      }
    };
    loadSurah();

    const loadReciters = async () => {
      try {
        const data = await fetchReciters();
        setReciters(data);
      } catch (error) {
        console.error('Error fetching reciters:', error);
      }
    };
    loadReciters();

    const loadChapterAudio = async () => {
      try {
        const data = await fetchChapterAudio(Number(surahNumber));
        setChapterAudio(data);
      } catch (error) {
        console.error('Error fetching chapter audio:', error);
      }
    };
    loadChapterAudio();
  }, [surahNumber]);

  // Function to handle next Surah
  const handleNextSurah = () => {
    const nextSurahNumber = Number(surahNumber) + 1;
    if (nextSurahNumber <= 114) { // There are 114 Surahs in the Quran
      navigate(`/surah/${nextSurahNumber}`);
    }
  };

  const convertToArabicNumerals = (num: number): string => {
    const arabicNumerals = ['٠', '١', '٢', '٣', '٤', '٥', '٦', '٧', '٨', '٩'];
    return num.toString().split('').map(digit => arabicNumerals[parseInt(digit)]).join('');
  };


  // Add this function to your SurahDetail component
const stopAllAudio = () => {
  // Stop verse audio if playing
  if (audioRef.current) {
    audioRef.current.pause();
    audioRef.current = null;
  }
  setIsPlaying(false);
  setCurrentVerseIndex(null);
  
  // Stop chapter audio if playing (we'll need to modify CustomAudioPlayer to expose this)
};

// Modify your handleVerseAudio function:
const handleVerseAudio = (index: number) => {
  const audioUrl = fetchVerseAudio(selectedReciter, surah.surahNo, index + 1);

  if (currentVerseIndex === index && isPlaying) {
    // Pause the currently playing audio
    stopAllAudio();
  } else {
    // Stop all audio first
    stopAllAudio();
    
    // Create a new Audio object and play it
    const audio = new Audio(audioUrl);
    audioRef.current = audio;
    audio.play();

    // Update state
    setCurrentVerseIndex(index);
    setIsPlaying(true);

    // Handle when the audio ends
    audio.onended = () => {
      setIsPlaying(false);
      setCurrentVerseIndex(null);
      audioRef.current = null;
    };
  }
};
  // Show loading state if surah is not yet loaded
  if (!surah) return <div>Loading...</div>;

  return (
    <div className="p-4 pb-24"> {/* Add padding-bottom to prevent content from being hidden behind the floating player */}
      <button onClick={() => navigate(-1)} className="p-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600">
        <FaArrowLeft size={20} />
      </button>

      <h1 className="text-2xl font-bold">{surah.surahName}</h1>
      <h2 className="text-xl text-gray-700">{surah.surahNameArabic}</h2>

      {/* Reciter Selection */}
      <div className="mt-4">
        <label htmlFor="reciter" className="block text-sm font-medium text-gray-700">
          Select Reciter
        </label>
        <select
          id="reciter"
          value={selectedReciter}
          onChange={(e) => setSelectedReciter(e.target.value)}
          className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
        >
          {Object.entries(reciters).map(([id, name]) => (
            <option key={id} value={id}>
              {name}
            </option>
          ))}
        </select>
      </div>

      {/* Ayahs */}
      <div className="mt-4 space-y-4">
        {surah.arabic1.map((ayah: string, index: number) => (
          <div key={index} className="p-4 bg-white rounded-lg shadow-md flex items-center justify-between">
            <div className="flex-1">
            <div className="flex items-start gap-4">
  <span className="text-2xl font-arabic ">{index + 1}.</span>
  <p className="text-2xl text-right font-arabic leading-loose whitespace-normal break-words flex-1">
    {ayah}
    <span className="mx-2">{" "}</span> {/* This adds consistent space */}
    .{convertToArabicNumerals(index + 1)}
  </p>
</div>            <p className="text-lg text-gray-700">{surah.english[index]}</p>
            </div>
            {/* Verse Audio Button */}
            <button
              onClick={() => handleVerseAudio(index)}
              className="ml-4 p-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
            >
              {currentVerseIndex === index && isPlaying ? (
                <FaPause size={20} />
              ) : (
                <FaPlay size={20} />
              )}
            </button>
          </div>
        ))}
      </div>

      {/* Floating Chapter Audio Player */}
      <div className="fixed bottom-0 left-0 right-0 bg-white shadow-lg p-4">
        <h3 className="text-lg font-semibold">Chapter Audio</h3>
        <div className="mt-2">
          <CustomAudioPlayer
            audioUrl={
              chapterAudio[selectedReciter]?.originalUrl || chapterAudio[selectedReciter]?.url
            }
            onNext={handleNextSurah}
            title={`Surah ${surah.surahName} - ${surah.surahNameArabic}`} 
            onPlay={() => {
              stopAllAudio(); // Stop any verse audio first
              setIsChapterPlaying(true);
            }}// Add title

            onPause={() => setIsChapterPlaying(false)}
            onEnded={() => setIsChapterPlaying(false)}          
          />
        </div>
      </div>
    </div>
  );
};

export default SurahDetail;