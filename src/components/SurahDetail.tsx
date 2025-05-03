// src/components/SurahDetail.tsx
import { useEffect, useState, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { fetchSurah, fetchReciters, fetchVerseAudio, fetchChapterAudio } from '../utils/api';
import CustomAudioPlayer, { AudioPlayerRef } from './AudioPlayer';
import { FaPlay, FaPause, FaArrowLeft,FaRegBookmark, FaBookmark } from 'react-icons/fa';
import supabase  from '../utils/supbase';
import '../css/surah.css';

const SurahDetail = () => {
  const [bookmarks, setBookmarks] = useState<Set<string>>(new Set()); // Track bookmarked verses
  const { surahNumber } = useParams<{ surahNumber: string }>();
  const navigate = useNavigate();
  const [surah, setSurah] = useState<any>(null);
  const [reciters, setReciters] = useState<{ [key: string]: string }>({});
  const [selectedReciter, setSelectedReciter] = useState<string>('1'); // Default reciter: Mishary Rashid Al-Afasy
  const [chapterAudio, setChapterAudio] = useState<{ [key: string]: { reciter: string; url: string; originalUrl: string } }>({});
  const [currentVerseIndex, setCurrentVerseIndex] = useState<number | null>(null); // Track the currently playing verse index
  const [isPlaying, setIsPlaying] = useState(false); // Track play/pause state
  const audioRef = useRef<HTMLAudioElement | null>(null); // Ref to store the Audio object
  const chapterAudioPlayerRef = useRef<AudioPlayerRef>(null);
// Helper function to get or create guest session ID


const getGuestSessionId = () => {
  let guestId = localStorage.getItem('guest_session_id');
  if (!guestId) {
    guestId = crypto.randomUUID(); // or use a UUID generator if crypto isn't available
    localStorage.setItem('guest_session_id', guestId);
  }
  return guestId;
};
    // Fetch bookmarks on load (for logged-in users or guests)
    useEffect(() => {
      const loadBookmarks = async () => {
        // Get session (must await!)
        const { data: { session } } = await supabase.auth.getSession();
        const user = session?.user ?? null;
        let fetchedBookmarks = new Set<string>();
    
        if (user) {
          // Fetch user's bookmarks
          const { data } = await supabase
            .from('bookmarks')
            .select('verse_id')
            .eq('user_id', user.id); // Use user.id directly
          if (data) data.forEach((b) => fetchedBookmarks.add(b.verse_id));
        } else {
          // Fetch guest bookmarks
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


  // Toggle bookmark for a verse (e.g., "2:255")
  const toggleBookmark = async (verseId: string) => {
  try {
    // Get current session properly
    const { data: { session } } = await supabase.auth.getSession();
    const user = session?.user ?? null;
    const isBookmarked = bookmarks.has(verseId);

    if (isBookmarked) {
      // Remove bookmark
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
      // Add bookmark
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
    // Optionally show error to user (e.g., using a toast notification)
  }
};
  // // Helper: Generate a verse ID like "5:32" (surah:ayah)
 
  // const getVerseId = (ayahIndex: number) => {
  //   return `${surah.surahNo}:${ayahIndex + 1}`;
  // };
    
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
    
    // Stop chapter audio if playing
    if (chapterAudioPlayerRef.current?.isPlaying) {
      chapterAudioPlayerRef.current.pause();
    }
  };

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


//   // Show loading state if surah is not yet loaded
//   if (!surah) return <div>Loading...</div>;

//   return (
//     <div className="p-4 pb-24"> {/* Add padding-bottom to prevent content from being hidden behind the floating player */}
//       <button onClick={() => navigate(-1)} className="p-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600">
//         <FaArrowLeft size={20} />
//       </button>

//       <h1 className="text-2xl font-bold">{surah.surahName}</h1>
//       <h2 className="text-xl text-gray-700">{surah.surahNameArabic}</h2>

//       {/* Reciter Selection */}
//       <div className="mt-4">
//         <label htmlFor="reciter" className="block text-sm font-medium text-gray-700">
//           Select Reciter
//         </label>
//         <select
//           id="reciter"
//           value={selectedReciter}
//           onChange={(e) => setSelectedReciter(e.target.value)}
//           className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
//         >
//           {Object.entries(reciters).map(([id, name]) => (
//             <option key={id} value={id}>
//               {name}
//             </option>
//           ))}
//         </select>
//       </div>

//       {/* Ayahs */}
//       <div className="mt-4 space-y-4">
//         {surah.arabic1.map((ayah: string, index: number) => (
//           <div key={index} className="p-4 bg-white rounded-lg shadow-md flex items-center justify-between">
//             <div className="flex-1">
//             <div className="flex items-start gap-4">
//             <FaRegBookmark/>
//   <span className="text-2xl font-arabic ">{index + 1}.</span>
//   <p className="text-2xl text-right font-arabic leading-loose whitespace-normal break-words flex-1">
//     {ayah}
//     <span className="mx-2">{" "}</span> {/* This adds consistent space */}
//     .{convertToArabicNumerals(index + 1)}
//   </p>
// </div>            <p className="text-lg text-gray-700">{surah.english[index]}</p>
//             </div>
//             {/* Verse Audio Button */}
//             <button
//               onClick={() => handleVerseAudio(index)}
//               className="ml-4 p-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
//             >
//               {currentVerseIndex === index && isPlaying ? (
//                 <FaPause size={20} />
//               ) : (
//                 <FaPlay size={20} />
//               )}
//             </button>
//           </div>
//         ))}
//       </div>

//       {/* Floating Chapter Audio Player */}
//       <div className="fixed bottom-0 left-0 right-0 bg-white shadow-lg p-4">
//         <h3 className="text-lg font-semibold">Chapter Audio</h3>
//         <div className="mt-2">
//         <CustomAudioPlayer
//             ref={chapterAudioPlayerRef}
//             audioUrl={
//               chapterAudio[selectedReciter]?.originalUrl || chapterAudio[selectedReciter]?.url
//             }
//             onNext={handleNextSurah}
//             title={`Surah ${surah.surahName} - ${surah.surahNameArabic}`}
//             onPlay={() => {
//               stopAllAudio(); // Stop any verse audio first
//             }}
//             onPause={() => {}}
//             onEnded={() => {}}
//           />
//         </div>
//       </div>
//     </div>
//   );
// };


// Show loading state if surah is not yet loaded
if (!surah) return <div>Loading...</div>;

// Helper function to generate verse ID (e.g., "1:1" for Surah 1, Ayah 1)
const getVerseId = (index: number) => `${surah.surahNo}:${index + 1}`;

return (
  <div className="p-4 pb-24">
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
                <p className="text-2xl text-right font-arabic leading-loose whitespace-normal break-words flex-1">
                  {ayah}
                  <span className="mx-2">{" "}</span>
                  .{convertToArabicNumerals(index + 1)}
                </p>
              </div>
              <p className="text-lg text-gray-700">{surah.english[index]}</p>
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
          onNext={handleNextSurah}
          title={`Surah ${surah.surahName} - ${surah.surahNameArabic}`}
          onPlay={() => {
            stopAllAudio(); // Stop any verse audio first
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