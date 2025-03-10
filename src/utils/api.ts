// src/utils/api.ts
import axios from 'axios';

const BASE_URL = import.meta.env.VITE_API_BASE_URL;
const AUDIO_URL = import.meta.env.VITE_API_AUDIO_URL;


// Fetch all Surahs
// Fetch all Surahs
export const fetchSurahs = async () => {
    const response = await axios.get(`${BASE_URL}/surah.json`);
    // Add a `number` field to each Surah based on its index
    const surahs = response.data.map((surah: any, index: number) => ({
      ...surah,
      number: index + 1, // Surah numbers start from 1
    }));
    return surahs;
  };

// Fetch a specific Surah
// src/utils/api.ts
export const fetchSurah = async (surahNumber: number) => {
    const response = await axios.get(`${BASE_URL}/${surahNumber}.json`);
    return response.data;
  };

// Fetch a specific Ayah
// src/utils/api.ts
export const fetchAyah = async (surahNumber: number, ayahNumber: number) => {
    const response = await axios.get(`${BASE_URL}/${surahNumber}/${ayahNumber}.json`);
    return response.data;
  };

// Fetch reciters
// src/utils/api.ts
export const fetchReciters = async () => {
    const response = await axios.get(`${BASE_URL}/reciters.json`);
    return response.data;
  };
// src/utils/api.ts
export const fetchVerseAudio = (reciterNumber: string, surahNumber: number, ayahNumber: number) => {
    return `${AUDIO_URL}/${reciterNumber}/${surahNumber}_${ayahNumber}.mp3`;
  };

  // src/utils/api.ts
export const fetchChapterAudio = async (surahNumber: number) => {
    const response = await axios.get(`${BASE_URL}/audio/${surahNumber}.json`);
    console.log(response);
    return response.data;
  };
  