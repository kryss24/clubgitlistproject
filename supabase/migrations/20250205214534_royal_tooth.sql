/*
  # Création des tables pour la gestion de projets

  1. Nouvelles Tables
    - `projects`
      - `id` (uuid, clé primaire)
      - `name` (text)
      - `description` (text)
      - `status` (enum)
      - `progress` (integer)
      - `created_at` (timestamp)
    - `tasks`
      - `id` (uuid, clé primaire)
      - `project_id` (uuid, clé étrangère)
      - `title` (text)
      - `completed` (boolean)
      - `created_at` (timestamp)

  2. Sécurité
    - RLS activé sur les deux tables
    - Politiques de lecture publique
*/

-- Création du type enum pour le statut
CREATE TYPE project_status AS ENUM ('not_started', 'in_progress', 'completed');

-- Table des projets
CREATE TABLE projects (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  description text,
  status project_status DEFAULT 'not_started',
  progress integer DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

-- Table des tâches
CREATE TABLE tasks (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id uuid REFERENCES projects(id) ON DELETE CASCADE,
  title text NOT NULL,
  completed boolean DEFAULT false,
  created_at timestamptz DEFAULT now()
);

-- Activation de RLS
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE tasks ENABLE ROW LEVEL SECURITY;

-- Politiques de sécurité
CREATE POLICY "Allow public read access on projects"
  ON projects FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Allow public read access on tasks"
  ON tasks FOR SELECT
  TO public
  USING (true);

-- Insertion des données d'exemple
INSERT INTO projects (name, description, status, progress) VALUES
  ('Site E-commerce', 'Développement d''un site e-commerce moderne avec panier et paiement', 'in_progress', 65),
  ('Application Mobile', 'Application mobile de suivi fitness', 'completed', 100),
  ('Dashboard Analytics', 'Tableau de bord pour analyse de données', 'not_started', 0),
  ('API REST', 'Développement d''une API REST pour service client', 'in_progress', 45),
  ('Système de Chat', 'Application de messagerie en temps réel', 'in_progress', 30),
  ('Portfolio', 'Site portfolio pour designer', 'completed', 100),
  ('Blog Tech', 'Blog technique avec CMS', 'not_started', 0),
  ('Jeu 2D', 'Développement d''un jeu platformer 2D', 'in_progress', 75),
  ('Système de Réservation', 'Application de réservation pour restaurant', 'not_started', 0),
  ('App Notes', 'Application de prise de notes collaborative', 'in_progress', 25);

-- Ajout de tâches pour chaque projet
INSERT INTO tasks (project_id, title, completed) 
SELECT 
  p.id,
  unnest(ARRAY[
    'Configuration initiale',
    'Design UI/UX',
    'Développement Frontend',
    'Développement Backend',
    'Tests'
  ]) as title,
  random() < 0.5 as completed
FROM projects p;