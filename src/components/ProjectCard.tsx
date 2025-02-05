import React from 'react';
import { CheckCircle2, Circle, Clock } from 'lucide-react';
import { Project } from '../types';
import { Link } from 'react-router-dom';

interface ProjectCardProps {
  project: Project;
}

export const ProjectCard: React.FC<ProjectCardProps> = ({ project }) => {
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

  return (
    <Link to={`/project/${project.id}`}>
      <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-semibold text-gray-800">{project.name}</h3>
          {getStatusIcon()}
        </div>
        <p className="text-gray-600 mb-4 line-clamp-2">{project.description}</p>
        <div className="space-y-2">
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
        </div>
      </div>
    </Link>
  );
}