// src/components/SurahList.tsx
import { useEffect, useState } from 'react';
import { fetchSurahs } from '../utils/api';

const SurahList = () => {
  const [surahs, setSurahs] = useState<any[]>([]);

  useEffect(() => {
    const loadSurahs = async () => {
      const data = await fetchSurahs();
      setSurahs(data);
    };
    loadSurahs();
  }, []);

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Surahs</h1>
      <ul className="space-y-2">
        {surahs.map((surah) => (
          <li key={surah.number} className="p-2 bg-white rounded-lg shadow-md">
            <a
              href={`/surah/${surah.number}`}
              className="text-blue-500 hover:underline"
            >
{surah.number}. {surah.surahName} ({surah.surahNameArabic}) - {surah.surahNameTranslation}            </a>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default SurahList;