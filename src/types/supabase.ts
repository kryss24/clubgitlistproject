export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      projects: {
        Row: {
          id: string
          name: string
          description: string | null
          status: 'not_started' | 'in_progress' | 'completed'
          progress: number
          created_at: string
        }
        Insert: {
          id?: string
          name: string
          description?: string | null
          status?: 'not_started' | 'in_progress' | 'completed'
          progress?: number
          created_at?: string
        }
        Update: {
          id?: string
          name?: string
          description?: string | null
          status?: 'not_started' | 'in_progress' | 'completed'
          progress?: number
          created_at?: string
        }
      }
      tasks: {
        Row: {
          id: string
          project_id: string
          title: string
          completed: boolean
          created_at: string
        }
        Insert: {
          id?: string
          project_id: string
          title: string
          completed?: boolean
          created_at?: string
        }
        Update: {
          id?: string
          project_id?: string
          title?: string
          completed?: boolean
          created_at?: string
        }
      }
    }
  }
}