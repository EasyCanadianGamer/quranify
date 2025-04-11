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
  


// // utils/api.ts
// import { createClient } from './supbase';

// const supabase = createClient();

// export const getUserDetails = async () => {
//   const { data, error } = await supabase.auth.getUser();
//   if (error || !data.user) return null;
//   return data.user;
// };

// export const getUserProfile = async (userId: string) => {
//   const { data, error } = await supabase
//     .from('profiles')
//     .select('*')
//     .eq('id', userId)
//     .single();

//   if (error) {
//     console.error('Error fetching user profile:', error.message);
//     return null;
//   }

//   return data;
// };


// utils/api.ts
import { createClient } from './supbase';

const supabase = createClient();

export const getUserDetails = async () => {
  const { data: userData, error: userError } = await supabase.auth.getUser();
  if (userError || !userData.user) return null;

  const userId = userData.user.id; // Get the user ID from the auth data

  // Fetch the user profile
  const { data: profileData, error: profileError } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .single();

  if (profileError) {
    console.error('Error fetching user profile:', profileError.message);
    return null;
  }

  // Combine user data and profile data
  return {
    ...userData.user,
    avatar_url: profileData.avatar_url, // Include avatar_url from profile
    updated_at: profileData.updated_at, // Include updated_at if needed
  };
};

export const getUserProfile = async (userId: string) => {
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .single();

  if (error) {
    console.error('Error fetching user profile:', error.message);
    return null;
  }

  return data;
};