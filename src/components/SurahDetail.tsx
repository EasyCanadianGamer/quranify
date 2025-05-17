// src/components/SurahDetail.tsx
import { useEffect, useState, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { fetchSurah, fetchReciters, fetchVerseAudio, fetchChapterAudio } from '../utils/api';
import CustomAudioPlayer, { AudioPlayerRef } from './AudioPlayer';
import { FaPlay, FaPause, FaArrowLeft, FaRegBookmark, FaBookmark, FaCog } from 'react-icons/fa';
import supabase from '../utils/supbase';
import '../css/surah.css';

const SurahDetail = () => {
  const [bookmarks, setBookmarks] = useState<Set<string>>(new Set());
  const { surahNumber } = useParams<{ surahNumber: string }>();
  const navigate = useNavigate();
  const [surah, setSurah] = useState<any>(null);
  const [reciters, setReciters] = useState<{ [key: string]: string }>({});
  const [selectedReciter, setSelectedReciter] = useState<string>('1');
  const [chapterAudio, setChapterAudio] = useState<{ [key: string]: { reciter: string; url: string; originalUrl: string } }>({});
  const [currentVerseIndex, setCurrentVerseIndex] = useState<number | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [fontSize, setFontSize] = useState<number>(2); // Default to medium size (2xl)
  const [repeatCount, setRepeatCount] = useState<number>(1); // Default to no repeat
  const [currentRepeat, setCurrentRepeat] = useState<number>(0); // Track current repeat iteration
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const chapterAudioPlayerRef = useRef<AudioPlayerRef>(null);

  // Font size options with labels
  const fontSizes = [
    { value: 1, label: 'Small' },
    { value: 2, label: 'Medium' },
    { value: 3, label: 'Large' },
    { value: 4, label: 'X-Large' }
  ];

  // Repeat options
  const repeatOptions = [
    { value: 1, label: 'No repeat' },
    { value: 2, label: '2 times' },
    { value: 3, label: '3 times' },
    { value: 5, label: '5 times' },
    { value: 10, label: '10 times' }
  ];

  const getGuestSessionId = () => {
    let guestId = localStorage.getItem('guest_session_id');
    if (!guestId) {
      guestId = crypto.randomUUID();
      localStorage.setItem('guest_session_id', guestId);
    }
    return guestId;
  };

  // Fetch bookmarks on load
  useEffect(() => {
    const loadBookmarks = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      const user = session?.user ?? null;
      let fetchedBookmarks = new Set<string>();

      if (user) {
        const { data } = await supabase
          .from('bookmarks')
          .select('verse_id')
          .eq('user_id', user.id);
        if (data) data.forEach((b) => fetchedBookmarks.add(b.verse_id));
      } else {
        const guestId = localStorage.getItem('guest_session_id');
        if (guestId) {
          const { data } = await supabase
            .from('bookmarks')
            .select('verse_id')
            .eq('guest_session_id', guestId);
          if (data) data.forEach((b) => fetchedBookmarks.add(b.verse_id));
        }
      }

      setBookmarks(fetchedBookmarks);
    };

    loadBookmarks();
  }, [surahNumber]);

  const toggleBookmark = async (verseId: string) => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      const user = session?.user ?? null;
      const isBookmarked = bookmarks.has(verseId);

      if (isBookmarked) {
        if (user) {
          const { error } = await supabase
            .from('bookmarks')
            .delete()
            .eq('user_id', user.id)
            .eq('verse_id', verseId);
          if (error) throw error;
        } else {
          const guestId = localStorage.getItem('guest_session_id');
          if (guestId) {
            const { error } = await supabase
              .from('bookmarks')
              .delete()
              .eq('guest_session_id', guestId)
              .eq('verse_id', verseId);
            if (error) throw error;
          }
        }
        setBookmarks(prev => {
          const newSet = new Set(prev);
          newSet.delete(verseId);
          return newSet;
        });
      } else {
        if (user) {
          const { error } = await supabase
            .from('bookmarks')
            .upsert({ 
              user_id: user.id, 
              verse_id: verseId,
              created_at: new Date().toISOString()
            });
          if (error) throw error;
        } else {
          const guestId = getGuestSessionId();
          const { error } = await supabase
            .from('bookmarks')
            .upsert({
              guest_session_id: guestId,
              verse_id: verseId,
              created_at: new Date().toISOString()
            });
          if (error) throw error;
        }
        setBookmarks(prev => new Set(prev).add(verseId));
      }
    } catch (error) {
      console.error("Failed to toggle bookmark:", error);
    }
  };
    
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

  const handleNextSurah = () => {
    const nextSurahNumber = Number(surahNumber) + 1;
    if (nextSurahNumber <= 114) {
      navigate(`/surah/${nextSurahNumber}`);
    }
  };

  const convertToArabicNumerals = (num: number): string => {
    const arabicNumerals = ['٠', '١', '٢', '٣', '٤', '٥', '٦', '٧', '٨', '٩'];
    return num.toString().split('').map(digit => arabicNumerals[parseInt(digit)]).join('');
  };

  const stopAllAudio = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current = null;
    }
    setIsPlaying(false);
    setCurrentVerseIndex(null);
    setCurrentRepeat(0);
    
    if (chapterAudioPlayerRef.current?.isPlaying) {
      chapterAudioPlayerRef.current.pause();
    }
  };

  const handleVerseAudio = (index: number) => {
    const audioUrl = fetchVerseAudio(selectedReciter, surah.surahNo, index + 1);

    if (currentVerseIndex === index && isPlaying) {
      stopAllAudio();
    } else {
      stopAllAudio();
      
      const audio = new Audio(audioUrl);
      audioRef.current = audio;
      audio.play();

      setCurrentVerseIndex(index);
      setIsPlaying(true);
      setCurrentRepeat(1);

      audio.onended = () => {
        if (currentRepeat < repeatCount) {
          // If we need to repeat again
          setCurrentRepeat(prev => prev + 1);
          audio.currentTime = 0;
          audio.play();
        } else {
          // If we're done with repeats
          setIsPlaying(false);
          setCurrentVerseIndex(null);
          setCurrentRepeat(0);
          audioRef.current = null;
        }
      };
    }
  };

  const getVerseId = (index: number) => `${surah.surahNo}:${index + 1}`;

  // Get font size class based on selected value
  const getFontSizeClass = (size: number) => {
    switch(size) {
      case 1: return 'text-xl';
      case 2: return 'text-2xl';
      case 3: return 'text-3xl';
      case 4: return 'text-4xl';
      default: return 'text-2xl';
    }
  };

  if (!surah) return <div>Loading...</div>;

  return (
    <div className="p-4 pb-24 relative">
      <div className="flex justify-between items-center mb-4">
        <div className="flex gap-2">
          <button 
            onClick={() => navigate(-1)} 
            className="p-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 flex items-center gap-1"
          >
            <FaArrowLeft size={16} />
            <span>Back</span>
          </button>
          {Number(surahNumber) < 114 && (
            <button 
              onClick={handleNextSurah} 
              className="p-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 flex items-center gap-1"
            >
              <span>Next</span>
              <FaArrowLeft size={16} className="transform rotate-180" />
            </button>
          )}
        </div>
        
        {/* Settings Button */}
        <button 
          onClick={() => setShowSettings(!showSettings)}
          className="p-2 bg-gray-200 rounded-lg hover:bg-gray-300"
          aria-label="Settings"
        >
          <FaCog size={20} />
        </button>
      </div>

      {/* Settings Panel */}
      {showSettings && (
        <div className="absolute right-4 top-16 bg-white p-4 rounded-lg shadow-lg z-10 w-72 border border-gray-200">
          <div className="flex justify-between items-center mb-3">
            <h3 className="font-bold text-lg">Settings</h3>
            <button 
              onClick={() => setShowSettings(false)}
              className="text-gray-500 hover:text-gray-700"
              aria-label="Close settings"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </button>
          </div>
          
          <div className="mb-4">
            <label className="block text-sm font-medium mb-2 text-gray-700">Arabic Font Size</label>
            <div className="grid grid-cols-2 gap-2">
              {fontSizes.map((size) => (
                <button
                  key={size.value}
                  onClick={() => setFontSize(size.value)}
                  className={`px-3 py-2 rounded-md text-sm ${
                    fontSize === size.value 
                      ? 'bg-blue-500 text-white' 
                      : 'bg-gray-100 hover:bg-gray-200'
                  }`}
                >
                  {size.label}
                </button>
              ))}
            </div>
          </div>
          
          <div className="mb-4">
            <label className="block text-sm font-medium mb-2 text-gray-700">Verse Repeat</label>
            <select
              value={repeatCount}
              onChange={(e) => setRepeatCount(Number(e.target.value))}
              className="w-full p-2 border border-gray-300 rounded-md text-sm bg-white"
            >
              {repeatOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
          
          <div>
            <label htmlFor="reciter" className="block text-sm font-medium mb-2 text-gray-700">
              Reciter
            </label>
            <select
              id="reciter"
              value={selectedReciter}
              onChange={(e) => setSelectedReciter(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-md text-sm bg-white"
            >
              {Object.entries(reciters).map(([id, name]) => (
                <option key={id} value={id}>
                  {name}
                </option>
              ))}
            </select>
          </div>
        </div>
      )}

      <h1 className="text-2xl font-bold">{surah.surahName}</h1>
      <h2 className="text-xl text-gray-700">{surah.surahNameArabic}</h2>

      {/* Ayahs with Bookmark Support */}
      <div className="mt-4 space-y-4">
        {surah.arabic1.map((ayah: string, index: number) => {
          const verseId = getVerseId(index);
          const isBookmarked = bookmarks.has(verseId);

          return (
            <div key={index} className="p-4 bg-white rounded-lg shadow-md flex items-center justify-between">
              <div className="flex-1">
                <div className="flex items-start gap-4">
                  <button 
                    onClick={() => toggleBookmark(verseId)}
                    className="text-xl hover:text-yellow-500"
                    aria-label={isBookmarked ? "Remove bookmark" : "Add bookmark"}
                  >
                    {isBookmarked ? (
                      <FaBookmark className="text-yellow-500" />
                    ) : (
                      <FaRegBookmark />
                    )}
                  </button>
                  <span className="text-2xl font-arabic">{index + 1}.</span>
                  <p className={`${getFontSizeClass(fontSize)} text-right font-arabic leading-loose whitespace-normal break-words flex-1`}>
                    {ayah}
                    <span className="mx-2">{" "}</span>
                    .{convertToArabicNumerals(index + 1)}
                  </p>
                </div>
                <p className="text-lg text-gray-700">{surah.english[index]}</p>
              </div>
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
          );
        })}
      </div>

      {/* Floating Chapter Audio Player */}
      <div className="fixed bottom-0 left-0 right-0 bg-white shadow-lg p-4">
        <h3 className="text-lg font-semibold">Chapter Audio</h3>
        <div className="mt-2">
          <CustomAudioPlayer
            ref={chapterAudioPlayerRef}
            audioUrl={
              chapterAudio[selectedReciter]?.originalUrl || chapterAudio[selectedReciter]?.url
            }
            title={`Surah ${surah.surahName} - ${surah.surahNameArabic}`}
            onPlay={() => {
              stopAllAudio();
            }}
            onPause={() => {}}
            onEnded={() => {}}
          />
        </div>
      </div>
    </div>
  );
};

export default SurahDetail;