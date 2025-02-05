import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { ProjectList } from './components/ProjectList';
import { ProjectDetails } from './components/ProjectDetails';
import { NewProject } from './components/NewProject';
import { Layout } from 'lucide-react';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-100">
        <nav className="bg-white shadow-md">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-16">
              <Link to="/" className="flex items-center space-x-3">
                <Layout className="w-8 h-8 text-blue-600" />
                <span className="text-xl font-bold text-gray-900">Suivi de Projets</span>
              </Link>
            </div>
          </div>
        </nav>

        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Routes>
            <Route path="/" element={
              <>
                <h1 className="text-3xl font-bold text-gray-900 mb-8">Mes Projets</h1>
                <ProjectList />
                <NewProject />
              </>
            } />
            <Route path="/project/:id" element={<ProjectDetails />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;