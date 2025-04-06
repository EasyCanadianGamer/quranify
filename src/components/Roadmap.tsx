// src/components/Roadmap.tsx
import { useState } from 'react';

type RoadmapItem = {
  id: number;
  title: string;
  description: string;
  status: 'planned' | 'in-progress' | 'completed';
  targetDate?: string;
  completedDate?: string;
};
//setRoadmapItems
const Roadmap = () => {
  const [roadmapItems] = useState<RoadmapItem[]>([
    {
      id: 1,
      title: 'Implement Sidebar Navigation',
      description: 'Add a mobile-friendly sidebar with surah list',
      status: 'completed',
      completedDate: '2023-10-15'
    },
    {
      id: 2,
      title: 'Add Search Functionality',
      description: 'Enable searching across surahs and verses',
      status: 'completed',
      targetDate: '2023-11-30'
    },
    {
      id: 3,
      title: 'Authentication',
      description: 'add a authentication system',
      status: 'in-progress',
    },
    {
        id: 4,
        title: 'Bookmark featture',
        description: 'Implement a bookmark feature',
        status: 'planned'
      },
      {
        id: 5,
        title: 'Dark Mode Support',
        description: 'Implement dark/light theme toggle',
        status: 'planned'
      },
  ]);

  const statusStyles = {
    planned: 'bg-gray-100 text-gray-800',
    'in-progress': 'bg-blue-100 text-blue-800',
    completed: 'bg-green-100 text-green-800'
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-8 text-center">Website Roadmap</h1>
      
      <div className="mb-8 p-6 bg-white rounded-lg shadow-md">
        <h2 className="text-xl font-semibold mb-4">Current Version: 1.0.0</h2>
        <p className="text-gray-600">Last updated: {new Date().toLocaleDateString()}</p>
      </div>

      <div className="space-y-8">
        {['completed', 'in-progress', 'planned'].map((status) => (
          <div key={status}>
            <h2 className="text-2xl font-semibold mb-4 capitalize">
              {status.replace('-', ' ')} ({roadmapItems.filter(item => item.status === status).length})
            </h2>
            
            <div className="space-y-4">
              {roadmapItems
                .filter(item => item.status === status)
                .map(item => (
                  <div key={item.id} className="p-6 bg-white rounded-lg shadow-sm border-l-4 border-blue-500">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="text-lg font-medium">{item.title}</h3>
                        <p className="text-gray-600 mt-1">{item.description}</p>
                      </div>
                      <span className={`px-3 py-1 rounded-full text-sm font-medium ${statusStyles[item.status]}`}>
                        {item.status.replace('-', ' ')}
                      </span>
                    </div>
                    
                    <div className="mt-4 flex flex-wrap gap-4 text-sm text-gray-500">
                      {item.targetDate && (
                        <span>Target: {new Date(item.targetDate).toLocaleDateString()}</span>
                      )}
                      {item.completedDate && (
                        <span>Completed: {new Date(item.completedDate).toLocaleDateString()}</span>
                      )}
                    </div>
                  </div>
                ))}
            </div>
          </div>
        ))}
      </div>

      <div className="mt-12 p-6 bg-blue-50 rounded-lg">
        <h2 className="text-xl font-semibold mb-4">Suggest a Feature</h2>
        <p className="mb-4">Have an idea for improving Quranify? We'd love to hear it!</p>
        <button className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition">
          Submit Feature Request
        </button>
      </div>
    </div>
  );
};

export default Roadmap;