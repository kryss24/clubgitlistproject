import React, { useState } from 'react';
import { CheckCircle2, Circle, Clock } from 'lucide-react';
import { Project } from '../types';
import { Link } from 'react-router-dom';
import { supabase } from '../lib/supabase';

interface ProjectCardProps {
  project: Project;
}

export const ProjectCard: React.FC<ProjectCardProps> = ({ project }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [email, setEmail] = useState('');

  const getStatusIcon = () => {
    switch (project.status) {
      case 'completed':
        return <CheckCircle2 className="w-6 h-6 text-green-500" />;
      case 'in_progress':
        return <Clock className="w-6 h-6 text-yellow-500" />;
      default:
        return <Circle className="w-6 h-6 text-gray-500" />;
    }
  };

  const formatDate = (dateString: string | null) => {
    if (!dateString) return 'coming soon';
    const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  return (
    <Link to={`/project/${project.id}`}>
      <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow h-[250px] flex flex-col">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-semibold text-gray-800 line-clamp-1">{project.name}</h3>
          {getStatusIcon()}
        </div>
        <p className="text-gray-600 mb-4 flex-grow line-clamp-3">{project.description}</p>
        <div className="mt-auto space-y-2">
          <div className="flex justify-between text-sm text-gray-500">
            <span>Progression</span>
            <span>{project.progress}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-blue-600 rounded-full h-2 transition-all duration-300"
              style={{ width: `${project.progress}%` }}
            />
          </div>
          <div className="text-sm text-gray-500 mt-2">
            <span>Debut de réalisation : {formatDate(project.realization_date)}</span>
          </div>
        </div>
      </div>
    </Link>
  );
}