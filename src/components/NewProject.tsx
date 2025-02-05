import React, { useState } from 'react';
import { PlusCircle, X } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useNavigate } from 'react-router-dom';

export const NewProject: React.FC = () => {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [tasks, setTasks] = useState<string[]>(['']);

  const handleAddTask = () => {
    setTasks([...tasks, '']);
  };

  const handleTaskChange = (index: number, value: string) => {
    const newTasks = [...tasks];
    newTasks[index] = value;
    setTasks(newTasks);
  };

  const handleRemoveTask = (index: number) => {
    const newTasks = tasks.filter((_, i) => i !== index);
    setTasks(newTasks);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      // Créer le projet
      const { data: project, error: projectError } = await supabase
        .from('projects')
        .insert([
          {
            name,
            description,
            status: 'not_started',
            progress: 0
          }
        ])
        .select()
        .single();

      if (projectError) throw projectError;

      // Créer les tâches
      const validTasks = tasks.filter(task => task.trim() !== '');
      if (validTasks.length > 0) {
        const { error: tasksError } = await supabase
          .from('tasks')
          .insert(
            validTasks.map(title => ({
              project_id: project.id,
              title,
              completed: false
            }))
          );

        if (tasksError) throw tasksError;
      }

      setIsOpen(false);
      navigate(`/project/${project.id}`);
    } catch (error) {
      console.error('Error creating project:', error);
    }
  };

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-8 right-8 bg-blue-600 text-white rounded-full p-4 shadow-lg hover:bg-blue-700 transition-colors"
      >
        <PlusCircle className="w-6 h-6" />
      </button>

      {isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg w-full max-w-2xl">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold">Nouveau Projet</h2>
                <button onClick={() => setIsOpen(false)} className="text-gray-500 hover:text-gray-700">
                  <X className="w-6 h-6" />
                </button>
              </div>

              <form onSubmit={handleSubmit}>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Nom du projet
                    </label>
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Description
                    </label>
                    <textarea
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                      rows={3}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Tâches
                    </label>
                    <div className="space-y-2">
                      {tasks.map((task, index) => (
                        <div key={index} className="flex gap-2">
                          <input
                            type="text"
                            value={task}
                            onChange={(e) => handleTaskChange(index, e.target.value)}
                            placeholder="Description de la tâche"
                            className="flex-1 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                          />
                          {tasks.length > 1 && (
                            <button
                              type="button"
                              onClick={() => handleRemoveTask(index)}
                              className="text-red-500 hover:text-red-700"
                            >
                              <X className="w-5 h-5" />
                            </button>
                          )}
                        </div>
                      ))}
                    </div>
                    <button
                      type="button"
                      onClick={handleAddTask}
                      className="mt-2 text-sm text-blue-600 hover:text-blue-700"
                    >
                      + Ajouter une tâche
                    </button>
                  </div>
                </div>

                <div className="mt-6 flex justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => setIsOpen(false)}
                    className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-500"
                  >
                    Annuler
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700"
                  >
                    Créer le projet
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </>
  );
};