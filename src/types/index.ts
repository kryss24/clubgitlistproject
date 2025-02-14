export interface Project {
  realization_date: string | null;
  id: string;
  name: string;
  description: string;
  status: 'not_started' | 'in_progress' | 'completed';
  progress: number;
  tasks: Task[];
  created_at: string;
}

export interface Task {
  id: string;
  project_id: string;
  title: string;
  completed: boolean;
  created_at: string;
}