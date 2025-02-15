import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { ThemeProvider, useTheme } from './context/ThemeContext';
import { ProjectList } from './components/ProjectList';
import { ProjectDetails } from './components/ProjectDetails';
import { NewProject } from './components/NewProject';
import { Layout, LogIn, LogOut } from 'lucide-react';
import { AuthModal } from './components/AuthModal';
import { supabase } from './lib/supabase';
import { signOut } from './lib/auth';

const ThemeToggleButton: React.FC = () => {
  const { theme, toggleTheme } = useTheme();

  return (
    <button onClick={toggleTheme} className="p-2 bg-gray-200 rounded">
      {theme === 'light' ? 'Switch to Dark Mode' : 'Switch to Light Mode'}
    </button>
  );
};

function App() {
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [session, setSession] = useState<any>(null);
  const whatsappLink = "https://wa.me/653580776?text=Bonjour,%20j'ai%20une%20idée%20de%20projet%20à%20proposer.";

  useEffect(() => {
    // Écouter les changements d'authentification
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleSignOut = async () => {
    try {
      await signOut();
    } catch (error) {
      console.error('Erreur lors de la déconnexion:', error);
    }
  };

  return (
    <ThemeProvider>
      <Router>
        <div className="min-h-screen bg-gray-100">
          <nav className="bg-white shadow-md">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex items-center justify-between h-16">
                <Link to="/" className="flex items-center space-x-3">
                  <Layout className="w-8 h-8 text-blue-600" />
                  <span className="text-xl font-bold text-gray-900">Suivi de Projets</span>
                </Link>
                <div className="flex items-center space-x-4">
                  <div>
                    {session ? (
                      <button
                        onClick={handleSignOut}
                        className="flex items-center space-x-2 text-gray-600 hover:text-gray-800"
                      >
                        <LogOut className="w-5 h-5" />
                        <span>Déconnexion</span>
                      </button>
                    ) : (
                      <button
                        onClick={() => setIsAuthModalOpen(true)}
                        className="flex items-center space-x-2 text-gray-600 hover:text-gray-800"
                      >
                        <LogIn className="w-5 h-5" />
                        <span>Connexion</span>
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </nav>

          <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <Routes>
              <Route path="/" element={
                <>
                  <h1 className="text-3xl font-bold text-gray-900 mb-8">Listes de projets</h1>
                  <ProjectList />
                  {session && <NewProject />}
                </>
              } />
              <Route path="/project/:id" element={<ProjectDetails />} />
            </Routes>
          </main>

          <AuthModal
            isOpen={isAuthModalOpen}
            onClose={() => setIsAuthModalOpen(false)}
            onSuccess={() => setIsAuthModalOpen(false)}
          />
        </div>
        <div className="container mx-auto p-6">
          <h1 className="text-3xl font-bold mb-4">Votre engagement propulse nos projets vers le succès !</h1>
          <p className="text-gray-700 mb-8">Une idée de projet ? N'attendez plus ! Soumettez-la et laissez-nous l'aider à prendre forme avec une équipe</p>

          {/* Ajout du bouton ou du lien */}
          <a
            href={whatsappLink}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block px-6 py-3 bg-green-500 text-white font-semibold rounded-md hover:bg-green-600 transition-colors"
          >
            Vous avez une idée de projet ? Proposez-le nous
          </a>
        </div>
      </Router>
    </ThemeProvider>
  );
}

export default App;