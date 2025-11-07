
import React from 'react';

interface IdeaCardProps {
  title: string;
  icon: React.ReactNode;
  children: React.ReactNode;
}

const IdeaCard: React.FC<IdeaCardProps> = ({ title, icon, children }) => {
  return (
    <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-2xl shadow-lg p-6 transform transition-all hover:scale-[1.02] hover:shadow-purple-500/20 duration-300">
      <div className="flex items-center mb-4">
        <div className="bg-gray-700/60 p-2 rounded-full mr-4 text-purple-400">
          {icon}
        </div>
        <h3 className="text-xl font-bold text-gray-100">{title}</h3>
      </div>
      <div className="text-gray-300 space-y-2">{children}</div>
    </div>
  );
};

export default IdeaCard;
