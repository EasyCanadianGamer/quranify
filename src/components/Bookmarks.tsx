import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import supabase  from '../utils/supbase';
import { FaBookmark, FaArrowLeft, FaQuran } from 'react-icons/fa';
import CustomAudioPlayer from './AudioPlayer';

type Bookmark = {
  id: string;
  verse_id: string;
  created_at: string;
};

const Bookmarks = () => {
  const [bookmarks, setBookmarks] = useState<Bookmark[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedReciter, setSelectedReciter] = useState('1'); // Default reciter
  const navigate = useNavigate();

  // Fetch bookmarks based on user/guest status
  useEffect(() => {
    const fetchBookmarks = async () => {
      setLoading(true);
      try {
        const { data: { session } } = await supabase.auth.getSession();
        const user = session?.user;

        let query = supabase
          .from('bookmarks')
          .select('id, verse_id, created_at')
          .order('created_at', { ascending: false });

        if (user) {
          // Fetch user's bookmarks
          query = query.eq('user_id', user.id);
        } else {
          // Fetch guest bookmarks
          const guestId = localStorage.getItem('guest_session_id');
          if (guestId) {
            query = query.eq('guest_session_id', guestId);
          } else {
            setBookmarks([]);
            setLoading(false);
            return;
          }
        }

        const { data, error } = await query;

        if (error) throw error;
        setBookmarks(data || []);
      } catch (error) {
        console.error('Error fetching bookmarks:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchBookmarks();
  }, []);

  // Extract surah and ayah number from verse_id (format: "surah:ayah")
  const parseVerseId = (verseId: string) => {
    const [surahNumber, ayahNumber] = verseId.split(':');
    return { surahNumber: parseInt(surahNumber), ayahNumber: parseInt(ayahNumber) };
  };

  // Navigate to the surah and scroll to the bookmarked ayah
  const navigateToVerse = (verseId: string) => {
    const { surahNumber, ayahNumber } = parseVerseId(verseId);
    navigate(`/surah/${surahNumber}#ayah-${ayahNumber}`);
  };

  // Remove a bookmark
  const removeBookmark = async (bookmarkId: string) => {
    try {
      const { error } = await supabase
        .from('bookmarks')
        .delete()
        .eq('id', bookmarkId);

      if (error) throw error;
      
      setBookmarks(prev => prev.filter(b => b.id !== bookmarkId));
    } catch (error) {
      console.error('Error removing bookmark:', error);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="p-4 pb-24">
      <div className="flex items-center justify-between mb-6">
        <button 
          onClick={() => navigate(-1)} 
          className="p-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
        >
          <FaArrowLeft size={20} />
        </button>
        <h1 className="text-2xl font-bold text-center">Your Bookmarks</h1>
        <div className="w-10"></div> {/* Spacer for alignment */}
      </div>

      {bookmarks.length === 0 ? (
        <div className="text-center mt-10">
          <FaQuran className="mx-auto text-5xl text-gray-400 mb-4" />
          <p className="text-xl text-gray-600">No bookmarks yet</p>
          <p className="text-gray-500">Bookmark verses by clicking the bookmark icon in Surah view</p>
        </div>
      ) : (
        <div className="space-y-4">
          {bookmarks.map((bookmark) => {
            const { surahNumber, ayahNumber } = parseVerseId(bookmark.verse_id);
            
            return (
              <div 
                key={bookmark.id} 
                className="p-4 bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow"
              >
                <div className="flex justify-between items-start">
                  <div>
                    <h3 
                      className="text-xl font-bold text-blue-600 hover:underline cursor-pointer"
                      onClick={() => navigateToVerse(bookmark.verse_id)}
                    >
                      Surah {surahNumber}, Ayah {ayahNumber}
                    </h3>
                    <p className="text-gray-500 text-sm">
                      Bookmarked on {new Date(bookmark.created_at).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => navigateToVerse(bookmark.verse_id)}
                      className="p-2 bg-green-500 text-white rounded-lg hover:bg-green-600"
                    >
                      Go to Verse
                    </button>
                    <button
                      onClick={() => removeBookmark(bookmark.id)}
                      className="p-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default Bookmarks;