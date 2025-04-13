import { useState } from 'react';

type RoadmapStatus = 'planned' | 'in-progress' | 'completed';

type RoadmapItem = {
  id: number;
  title: string;
  description: string;
  status: RoadmapStatus;
  targetDate?: string;
  completedDate?: string;
};

// Move roadmap data to a separate config file (or keep here if preferred)
const ROADMAP_DATA: RoadmapItem[] = [
  {
    id: 1,
    title: 'Implement Sidebar Navigation',
    description: 'Add a mobile-friendly sidebar with surah list',
    status: 'completed',
    completedDate: '2025-4-6'
  },
  {
    id: 2,
    title: 'Add Search Functionality',
    description: 'Enable searching across surahs and verses',
    status: 'completed',
    completedDate: '2025-4-6'
  },
  {
    id: 3,
    title: 'Authentication',
    description: 'Add an authentication system',
    status: 'completed',
    completedDate: '2025-4-12'
  },
  {
    id: 4,
    title: 'Bookmark Feature',
    description: 'Implement a bookmark feature',
    status: 'planned'
  },
  {
    id: 5,
    title: 'Dark Mode Support',
    description: 'Implement dark/light theme toggle',
    status: 'planned'
  },
];

const STATUS_DISPLAY_ORDER: RoadmapStatus[] = ['completed', 'in-progress', 'planned'];

const Roadmap = () => {
  const [roadmapItems] = useState<RoadmapItem[]>(ROADMAP_DATA);

  const statusStyles: Record<RoadmapStatus, string> = {
    planned: 'bg-gray-100 text-gray-800',
    'in-progress': 'bg-blue-100 text-blue-800',
    completed: 'bg-green-100 text-green-800'
  };

  const statusLabels: Record<RoadmapStatus, string> = {
    planned: 'planned',
    'in-progress': 'in progress',
    completed: 'completed'
  };

  const getStatusCount = (status: RoadmapStatus) => 
    roadmapItems.filter(item => item.status === status).length;

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-8 text-center">Website Roadmap</h1>
      
      <div className="mb-8 p-6 bg-white rounded-lg shadow-md">
        <h2 className="text-xl font-semibold mb-4">Current Version: 1.2.0</h2>
        <p className="text-gray-600">Last updated: {new Date().toLocaleDateString()}</p>
      </div>

      <div className="space-y-8">
        {STATUS_DISPLAY_ORDER.map((status) => (
          <div key={status}>
            <h2 className="text-2xl font-semibold mb-4 capitalize">
              {statusLabels[status]} ({getStatusCount(status)})
            </h2>
            
            <div className="space-y-4">
              {roadmapItems
                .filter(item => item.status === status)
                .map(item => (
                  <RoadmapCard 
                    key={item.id}
                    item={item}
                    statusStyle={statusStyles[status]}
                    statusLabel={statusLabels[status]}
                  />
                ))}
            </div>
          </div>
        ))}
      </div>

      <FeatureSuggestionSection />
    </div>
  );
};

// Extracted card component for better readability
const RoadmapCard = ({ 
  item, 
  statusStyle,
  statusLabel
}: {
  item: RoadmapItem;
  statusStyle: string;
  statusLabel: string;
}) => (
  <div className="p-6 bg-white rounded-lg shadow-sm border-l-4 border-blue-500">
    <div className="flex justify-between items-start">
      <div>
        <h3 className="text-lg font-medium">{item.title}</h3>
        <p className="text-gray-600 mt-1">{item.description}</p>
      </div>
      <span className={`px-3 py-1 rounded-full text-sm font-medium ${statusStyle}`}>
        {statusLabel}
      </span>
    </div>
    
    {item.targetDate && (
      <div className="mt-4 text-sm text-gray-500">
        Target: {new Date(item.targetDate).toLocaleDateString()}
      </div>
    )}
    {item.completedDate && (
      <div className="mt-2 text-sm text-gray-500">
        Completed: {new Date(item.completedDate).toLocaleDateString()}
      </div>
    )}
  </div>
);

// Extracted suggestion section
const FeatureSuggestionSection = () => (
  <div className="mt-12 p-6 bg-blue-50 rounded-lg">
    <h2 className="text-xl font-semibold mb-4">Suggest a Feature</h2>
    <p className="mb-4">Have an idea for improving Quranify? We'd love to hear it!</p>
    <button className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition">
      Submit Feature Request
    </button>
  </div>
);

export default Roadmap;