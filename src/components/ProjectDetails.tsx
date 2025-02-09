import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { CheckSquare, Square, ArrowLeft, Trash2, Edit3, PlusCircle, UserPlus, UserMinus, Star } from 'lucide-react';
import { useProject } from '../hooks/useProject';
import { supabase } from '../lib/supabase';

export const ProjectDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { project, loading, mutate } = useProject(id!);
  const navigate = useNavigate();
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [editingTask, setEditingTask] = useState<string | null>(null);
  const [editingTaskTitle, setEditingTaskTitle] = useState('');
  const [newCollaboratorEmail, setNewCollaboratorEmail] = useState('');
  const [collaborators, setCollaborators] = useState<any[]>([]);
  const [user, setUser] = useState<any>(null);
  const [rating, setRating] = useState(0);
  const [userEmail, setUserEmail] = useState('');
  const [averageRating, setAverageRating] = useState(0);
  const [isAlreadyRegistered, setIsAlreadyRegistered] = useState(false);
  const [hasAlreadyRated, setHasAlreadyRated] = useState(false);

  useEffect(() => {
    const fetchSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setUser(session?.user ?? null);
    };

    fetchSession();

    const { data: authListener } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => {
      authListener?.subscription.unsubscribe();
    };
  }, []);

  useEffect(() => {
    const fetchCollaborators = async () => {
      const { data, error } = await supabase
        .from('collaborators')
        .select('*')
        .eq('project_id', id);

      if (error) {
        console.error('Error fetching collaborators:', error);
      } else {
        setCollaborators(data || []);
      }
    };

    const fetchRatings = async () => {
      const { data, error } = await supabase
        .from('ratings')
        .select('*')
        .eq('project_id', id);

      if (error) {
        console.error('Error fetching ratings:', error);
      } else {
        const totalRating = data.reduce((acc, rating) => acc + rating.rating, 0);
        const average = data.length ? totalRating / data.length : 0;
        setAverageRating(average);
      }
    };

    fetchCollaborators();
    fetchRatings();
  }, [id]);

  const checkAuth = async () => {
    const { data: session } = await supabase.auth.getSession();
    if (!session.session) {
      navigate('/');
      return false;
    }
    return true;
  };

  const toggleTask = async (taskId: string, completed: boolean) => {
    if (!(await checkAuth())) return;

    try {
      const { error } = await supabase
        .from('tasks')
        .update({ completed: !completed })
        .eq('id', taskId);

      if (error) throw error;

      if (project) {
        const updatedTasks = project.tasks.map(task =>
          task.id === taskId ? { ...task, completed: !completed } : task
        );
        
        const completedTasks = updatedTasks.filter(task => task.completed).length;
        const progress = Math.round((completedTasks / updatedTasks.length) * 100);

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

  const addTask = async () => {
    if (!(await checkAuth()) || !newTaskTitle.trim()) return;

    try {
      const { data, error } = await supabase
        .from('tasks')
        .insert([{ title: newTaskTitle, project_id: id }])
        .select()
        .single();

      if (error) throw error;

      if (project && data) {
        mutate({
          ...project,
          tasks: [...project.tasks, data]
        });
      }

      setNewTaskTitle('');
    } catch (error) {
      console.error('Error adding task:', error);
    }
  };

  const deleteTask = async (taskId: string) => {
    if (!(await checkAuth())) return;

    try {
      const { error } = await supabase
        .from('tasks')
        .delete()
        .eq('id', taskId);

      if (error) throw error;

      if (project) {
        const updatedTasks = project.tasks.filter(task => task.id !== taskId);
        const completedTasks = updatedTasks.filter(task => task.completed).length;
        const progress = updatedTasks.length ? Math.round((completedTasks / updatedTasks.length) * 100) : 0;

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
      console.error('Error deleting task:', error);
    }
  };

  const editTask = async (taskId: string) => {
    if (!(await checkAuth()) || !editingTaskTitle.trim()) return;

    try {
      const { error } = await supabase
        .from('tasks')
        .update({ title: editingTaskTitle })
        .eq('id', taskId);

      if (error) throw error;

      if (project) {
        mutate({
          ...project,
          tasks: project.tasks.map(task =>
            task.id === taskId ? { ...task, title: editingTaskTitle } : task
          )
        });
      }

      setEditingTask(null);
      setEditingTaskTitle('');
    } catch (error) {
      console.error('Error editing task:', error);
    }
  };

  const deleteProject = async () => {
    if (!(await checkAuth())) return;

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

  const addCollaborator = async () => {
    if (!newCollaboratorEmail.trim()) return;

    try {
      const { data: existingCollaborator, error: fetchError } = await supabase
        .from('collaborators')
        .select('*')
        .eq('project_id', id)
        .eq('email', newCollaboratorEmail)
        .single();

      if (fetchError && fetchError.code !== 'PGRST116') {
        throw fetchError;
      }

      if (existingCollaborator) {
        setIsAlreadyRegistered(true);
        return;
      }

      const { data, error } = await supabase
        .from('collaborators')
        .insert([{ email: newCollaboratorEmail, project_id: id }])
        .single();

      if (error) throw error;

      setCollaborators([...collaborators, data]);
      setNewCollaboratorEmail('');
    } catch (error) {
      console.error('Error adding collaborator:', error);
    }
  };

  const deleteCollaborator = async (collaboratorId: string) => {
    if (!(await checkAuth())) return;

    try {
      const { error } = await supabase
        .from('collaborators')
        .delete()
        .eq('id', collaboratorId);

      if (error) throw error;

      setCollaborators(collaborators.filter(collaborator => collaborator.id !== collaboratorId));
    } catch (error) {
      console.error('Error deleting collaborator:', error);
    }
  };

  const addRating = async () => {
    if (!userEmail.trim() || rating === 0) return;

    try {
      const { data: existingRating, error: fetchError } = await supabase
        .from('ratings')
        .select('*')
        .eq('project_id', id)
        .eq('email', userEmail)
        .single();

      if (fetchError && fetchError.code !== 'PGRST116') {
        throw fetchError;
      }

      if (existingRating) {
        setHasAlreadyRated(true);
        return;
      }

      const { data, error } = await supabase
        .from('ratings')
        .insert([{ email: userEmail, rating, project_id: id }])
        .single();

      if (error) throw error;

      const newAverageRating = (averageRating * collaborators.length + rating) / (collaborators.length + 1);
      setAverageRating(newAverageRating);
      setUserEmail('');
      setRating(0);
    } catch (error) {
      console.error('Error adding rating:', error);
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
        {user && (
          <button
            onClick={deleteProject}
            className="text-red-500 hover:text-red-700"
          >
            <Trash2 className="w-6 h-6" />
          </button>
        )}
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

      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">Collaborateurs</h2>
        <div className="space-y-4">
          {collaborators.map((collaborator) => (
            <div key={collaborator.id} className="flex items-center justify-between">
              <span className="text-gray-800">{collaborator.email}</span>
              {user && (
                <button onClick={() => deleteCollaborator(collaborator.id)} className="text-red-500 hover:text-red-700">
                  <UserMinus className="w-5 h-5" />
                </button>
              )}
            </div>
          ))}
        </div>
        <div className="mt-4 flex">
          <input
            type="email"
            value={newCollaboratorEmail}
            onChange={(e) => setNewCollaboratorEmail(e.target.value)}
            className="flex-grow p-2 border rounded-md"
            placeholder="Email du collaborateur"
          />
          <button onClick={addCollaborator} className="ml-2 p-2 bg-blue-500 text-white rounded-md hover:bg-blue-700">
            Participer
          </button>
        </div>
      </div>

      {isAlreadyRegistered && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <h2 className="text-2xl font-semibold mb-4">Déjà enregistré</h2>
            <p className="text-gray-600 mb-4">Vous êtes déjà enregistré en tant que collaborateur pour ce projet.</p>
            <button
              onClick={() => setIsAlreadyRegistered(false)}
              className="p-2 bg-blue-500 text-white rounded-md hover:bg-blue-700"
            >
              OK
            </button>
          </div>
        </div>
      )}

      {hasAlreadyRated && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <h2 className="text-2xl font-semibold mb-4">Déjà noté</h2>
            <p className="text-gray-600 mb-4">Vous avez déjà noté ce projet.</p>
            <button
              onClick={() => setHasAlreadyRated(false)}
              className="p-2 bg-blue-500 text-white rounded-md hover:bg-blue-700"
            >
              OK
            </button>
          </div>
        </div>
      )}

      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">Notation</h2>
        <div className="flex items-center mb-4">
          <span className="text-gray-800 mr-2">Moyenne des notes :</span>
          <span className="text-yellow-500">{averageRating.toFixed(1)} / 5</span>
        </div>
        <div className="flex items-center space-x-2">
          {[1, 2, 3, 4, 5].map((star) => (
            <Star
              key={star}
              className={`w-6 h-6 cursor-pointer ${rating >= star ? 'text-yellow-500' : 'text-gray-400'}`}
              onClick={() => setRating(star)}
            />
          ))}
        </div>
        <div className="mt-4 flex">
          <input
            type="email"
            value={userEmail}
            onChange={(e) => setUserEmail(e.target.value)}
            className="flex-grow p-2 border rounded-md"
            placeholder="Votre email"
          />
          <button onClick={addRating} className="ml-2 p-2 bg-blue-500 text-white rounded-md hover:bg-blue-700">
            Noter
          </button>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">Tâches</h2>
        <div className="space-y-4">
          {project.tasks.map((task) => (
            <div key={task.id} className="flex items-center space-x-3 w-full text-left hover:bg-gray-50 p-2 rounded-md transition-colors">
              <button onClick={() => toggleTask(task.id, task.completed)}>
                {task.completed ? (
                  <CheckSquare className="w-6 h-6 text-green-500 flex-shrink-0" />
                ) : (
                  <Square className="w-6 h-6 text-gray-400 flex-shrink-0" />
                )}
              </button>
              {editingTask === task.id ? (
                <input
                  type="text"
                  value={editingTaskTitle}
                  onChange={(e) => setEditingTaskTitle(e.target.value)}
                  className="flex-grow p-2 border rounded-md"
                />
              ) : (
                <span className={task.completed ? 'line-through text-gray-500' : 'text-gray-800'}>
                  {task.title}
                </span>
              )}
              {user && (
                <>
                  {editingTask === task.id ? (
                    <button onClick={() => editTask(task.id)} className="text-blue-500 hover:text-blue-700">
                      Save
                    </button>
                  ) : (
                    <button onClick={() => { setEditingTask(task.id); setEditingTaskTitle(task.title); }} className="text-gray-500 hover:text-gray-700">
                      <Edit3 className="w-5 h-5" />
                    </button>
                  )}
                  <button onClick={() => deleteTask(task.id)} className="text-red-500 hover:text-red-700">
                    <Trash2 className="w-5 h-5" />
                  </button>
                </>
              )}
            </div>
          ))}
        </div>
        {user && (
          <div className="mt-4 flex">
            <input
              type="text"
              value={newTaskTitle}
              onChange={(e) => setNewTaskTitle(e.target.value)}
              className="flex-grow p-2 border rounded-md"
              placeholder="Nouvelle tâche"
            />
            <button onClick={addTask} className="ml-2 p-2 bg-blue-500 text-white rounded-md hover:bg-blue-700">
              <PlusCircle className="w-5 h-5" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};