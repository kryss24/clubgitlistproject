# Suivi de Projets

Ce projet est une application de suivi de projets qui permet aux utilisateurs de créer, modifier, supprimer et visualiser des projets et leurs tâches associées. L'application utilise Supabase pour la gestion de l'authentification et des données.

## Pages

### Page d'accueil

- **Description** : La page d'accueil affiche la liste de tous les projets.
- **Composants principaux** :
  - `ProjectList` : Affiche une grille de cartes de projets.
  - `ProjectCard` : Représente une carte de projet individuelle avec des informations de base sur le projet.

### Détails du projet

- **Description** : La page des détails du projet affiche les informations détaillées d'un projet spécifique, y compris la liste des tâches associées.
- **Composants principaux** :
  - `ProjectDetails` : Affiche les détails du projet, y compris le nom, la description, la progression et les tâches associées. Permet également de créer, modifier et supprimer des tâches si l'utilisateur est authentifié.

### Connexion

- **Description** : La page de connexion permet aux utilisateurs de se connecter à l'application.
- **Composants principaux** :
  - `AuthModal` : Affiche un formulaire de connexion pour que les utilisateurs puissent entrer leur email et mot de passe.

## Composants

### ProjectList

- **Rôle** : Affiche une grille de cartes de projets.
- **Fonctionnalités** :
  - Récupère la liste des projets à partir de Supabase.
  - Affiche chaque projet en utilisant le composant `ProjectCard`.

### ProjectCard

- **Rôle** : Représente une carte de projet individuelle.
- **Fonctionnalités** :
  - Affiche le nom, la description et un lien vers les détails du projet.
  - Tronque les descriptions trop longues avec des points de suspension.

### ProjectDetails

- **Rôle** : Affiche les détails d'un projet spécifique.
- **Fonctionnalités** :
  - Affiche le nom, la description, la progression et les tâches associées au projet.
  - Permet de créer, modifier et supprimer des tâches si l'utilisateur est authentifié.
  - Vérifie l'authentification de l'utilisateur avant d'autoriser les actions de création, modification et suppression.

### AuthModal

- **Rôle** : Affiche un formulaire de connexion.
- **Fonctionnalités** :
  - Permet aux utilisateurs de se connecter en entrant leur email et mot de passe.
  - Affiche des messages d'erreur en cas de problème de connexion.

## Fonctions

### Authentification

- **Rôle** : Gérer l'authentification des utilisateurs.
- **Fonctionnalités** :
  - `signOut` : Déconnecte l'utilisateur.
  - `checkAuth` : Vérifie si l'utilisateur est authentifié avant d'autoriser certaines actions.

### Gestion des projets et des tâches

- **Rôle** : Gérer les projets et les tâches associées.
- **Fonctionnalités** :
  - `toggleTask` : Marque une tâche comme complétée ou non complétée.
  - `addTask` : Ajoute une nouvelle tâche à un projet.
  - `deleteTask` : Supprime une tâche d'un projet.
  - `editTask` : Modifie le titre d'une tâche.
  - `deleteProject` : Supprime un projet.

## Installation

1. Clonez le dépôt :
   ```bash
   git clone https://github.com/votre-utilisateur/votre-repo.git
2. Installez les dépendances :
    cd votre-repo
    npm install
    npm install vite
3. Configurez Supabase :
    Créez un projet sur Supabase.
    Copiez les clés API et l'URL du projet dans un fichier .env à la racine du projet :
    ```
    REACT_APP_SUPABASE_URL=your-supabase-url
    REACT_APP_SUPABASE_ANON_KEY=your-supabase-anon-key
    ```
4. Démarrez l'application :
    npm run dev