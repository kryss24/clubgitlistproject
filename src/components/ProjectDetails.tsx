import React from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { CheckSquare, Square, ArrowLeft, Trash2 } from 'lucide-react';
import { useProject } from '../hooks/useProject';
import { supabase } from '../lib/supabase';

export const ProjectDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { project, loading, mutate } = useProject(id!);
  const navigate = useNavigate();

  const toggleTask = async (taskId: string, completed: boolean) => {
    try {
      const { error } = await supabase
        .from('tasks')
        .update({ completed: !completed })
        .eq('id', taskId);

      if (error) throw error;

      // Mettre à jour le projet localement
      if (project) {
        const updatedTasks = project.tasks.map(task =>
          task.id === taskId ? { ...task, completed: !completed } : task
        );
        
        // Calculer la nouvelle progression
        const completedTasks = updatedTasks.filter(task => task.completed).length;
        const progress = Math.round((completedTasks / updatedTasks.length) * 100);

        // Mettre à jour la progression du projet
        await supabase
          .from('projects')
          .update({ progress })
          .eq('id', project.id);

        mutate({
          ...project,
          progress,
          tasks: updatedTasks
        });
      }
    } catch (error) {
      console.error('Error toggling task:', error);
    }
  };

  const deleteProject = async () => {
    try {
      const { error } = await supabase
        .from('projects')
        .delete()
        .eq('id', id);

      if (error) throw error;

      navigate('/');
    } catch (error) {
      console.error('Error deleting project:', error);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600" />
      </div>
    );
  }

  if (!project) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-semibold text-gray-800">Projet non trouvé</h2>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <Link to="/" className="inline-flex items-center text-blue-600 hover:text-blue-700 mb-6">
        <ArrowLeft className="w-5 h-5 mr-2" />
        Retour aux projets
      </Link>

      <div className="flex justify-between items-center mb-4">
        <h1 className="text-3xl font-bold text-gray-900">{project.name}</h1>
        <button
          onClick={deleteProject}
          className="text-red-500 hover:text-red-700"
        >
          <Trash2 className="w-6 h-6" />
        </button>
      </div>
      <p className="text-gray-600 mb-8">{project.description}</p>

      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">Progression globale</h2>
        <div className="space-y-2">
          <div className="flex justify-between text-sm text-gray-500">
            <span>Avancement</span>
            <span>{project.progress}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-4">
            <div
              className="bg-blue-600 rounded-full h-4 transition-all duration-300"
              style={{ width: `${project.progress}%` }}
            />
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">Tâches</h2>
        <div className="space-y-4">
          {project.tasks.map((task) => (
            <button
              key={task.id}
              onClick={() => toggleTask(task.id, task.completed)}
              className="flex items-center space-x-3 w-full text-left hover:bg-gray-50 p-2 rounded-md transition-colors"
            >
              {task.completed ? (
                <CheckSquare className="w-6 h-6 text-green-500 flex-shrink-0" />
              ) : (
                <Square className="w-6 h-6 text-gray-400 flex-shrink-0" />
              )}
              <span className={task.completed ? 'line-through text-gray-500' : 'text-gray-800'}>
                {task.title}
              </span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};