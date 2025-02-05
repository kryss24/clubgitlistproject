import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../lib/supabase';
import { Project } from '../types';

export const useProject = (id: string) => {
  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchProject = useCallback(async () => {
    try {
      const { data, error } = await supabase
        .from('projects')
        .select(`
          *,
          tasks (*)
        `)
        .eq('id', id)
        .single();

      if (error) throw error;
      setProject(data);
    } catch (error) {
      console.error('Error fetching project:', error);
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchProject();
  }, [fetchProject]);

  const mutate = (newData: Project) => {
    setProject(newData);
  };

  return { project, loading, mutate };
};