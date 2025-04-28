import React, { useState, useEffect } from 'react';
import { saveAppData, listenToAppData, saveActiveRun, listenToActiveRun } from './firebase';
import CompetitionTab from './components/CompetitionTab';
import ParticipantsTab from './components/ParticipantsTab';
import ChronoTab from './components/ChronoTab';
import ResultsTab from './components/ResultsTab';
import PublicDisplay from './components/PublicDisplay';

function App() {
  // État pour le mode (admin ou affichage)
  const [mode, setMode] = useState(() => {
    // Récupérer le mode depuis le localStorage s'il existe
    const savedMode = localStorage.getItem('equifun-app-mode');
    return savedMode || 'selector';
  });

  // États de l'application
  const [activeTab, setActiveTab] = useState('competitions');
  const [competitions, setCompetitions] = useState([]);
  const [riders, setRiders] = useState([]);
  const [ponies, setPonies] = useState([]);
  const [couples, setCouples] = useState([]);
  const [teams, setTeams] = useState([]);
  const [runs, setRuns] = useState([]);
  const [currentCompetition, setCurrentCompetition] = useState(null);
  const [activeRun, setActiveRun] = useState(null);
  
  // Enregistrer le mode dans localStorage quand il change
  useEffect(() => {
    localStorage.setItem('equifun-app-mode', mode);
  }, [mode]);
  
  // Synchronisation du passage actif
  useEffect(() => {
    if (activeRun && mode === 'admin') {
      saveActiveRun(activeRun);
    }
  }, [activeRun, mode]);

  // Synchronisation des données si en mode affichage
  useEffect(() => {
    if (mode === 'display') {
      const unsubscribeAppData = listenToAppData((data) => {
        if (data.currentCompetition) setCurrentCompetition(data.currentCompetition);
        if (data.runs) setRuns(data.runs);
        if (data.competitions) setCompetitions(data.competitions);
        if (data.riders) setRiders(data.riders);
        if (data.ponies) setPonies(data.ponies);
        if (data.couples) setCouples(data.couples);
      });
      
      const unsubscribeActiveRun = listenToActiveRun((data) => {
        setActiveRun(data);
      });
      
      return () => {
        unsubscribeAppData();
        unsubscribeActiveRun();
      };
    }
  }, [mode]);
  
  // Synchronisation lors des changements majeurs (admin mode)
  useEffect(() => {
    if (mode === 'admin' && currentCompetition) {
      saveAppData({
        currentCompetition,
        runs,
        competitions,
        riders,
        ponies,
        couples
      });
    }
  }, [currentCompetition, runs, mode]);
  
  // Fonction pour sélectionner une compétition
  const selectCompetition = (competition) => {
    setCurrentCompetition(competition);
  };

  // Exemple de données initiales pour la démo
  useEffect(() => {
    // Seulement charger les données initiales en mode admin et si aucune compétition n'existe
    if (mode === 'admin' && competitions.length === 0) {
      // Quelques cavaliers de démonstration
      setRiders([
        { id: 1, name: 'Emma Dupont', age: 9, galopLevel: 'Galop 1' },
        { id: 2, name: 'Lucas Martin', age: 11, galopLevel: 'Galop 2' },
        { id: 3, name: 'Chloé Petit', age: 7, galopLevel: 'Galop Bronze' },
        { id: 4, name: 'Hugo Bernard', age: 13, galopLevel: 'Galop 3' },
        { id: 5, name: 'ambre', age: 7, galopLevel: 'argent' }
      ]);
      
      // Quelques poneys de démonstration
      setPonies([
        { id: 1, name: 'Caramel', category: 'A', age: 8 },
        { id: 2, name: 'Tonnerre', category: 'B', age: 12 },
        { id: 3, name: 'Étoile', category: 'A', age: 10 },
        { id: 4, name: 'Éclair', category: 'C', age: 7 }
      ]);
      
      // Couples cavalier/poney de démonstration
      setCouples([
        { id: 1, riderId: 1, ponyId: 1, riderName: 'Emma Dupont', ponyName: 'Caramel' },
        { id: 2, riderId: 2, ponyId: 4, riderName: 'Lucas Martin', ponyName: 'Éclair' },
        { id: 3, riderId: 3, ponyId: 3, riderName: 'Chloé Petit', ponyName: 'Étoile' },
        { id: 4, riderId: 5, ponyId: 1, riderName: 'ambre', ponyName: 'Caramel' },
        { id: 5, riderId: 5, ponyId: 2, riderName: 'ambre', ponyName: 'Tonnerre' },
        { id: 6, riderId: 5, ponyId: 4, riderName: 'ambre', ponyName: 'Éclair' }
      ]);
      
      // Compétition de démonstration
      setCompetitions([
        { 
          id: 1, 
          name: 'Challenge interne', 
          category: 'club', 
          type: 'individual',
          date: '2025-09-15',
          status: 'upcoming'
        }
      ]);
    }
  }, [mode, competitions.length]);

  // Sélecteur de mode
  if (mode === 'selector') {
    return (
      <div className="flex flex-col h-screen bg-blue-600 text-white justify-center items-center p-4">
        <h1 className="text-4xl font-bold mb-8">Application Equifun</h1>
        <p className="text-xl mb-8">Choisissez le mode d'utilisation :</p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <button 
            className="bg-white text-blue-700 rounded-lg p-8 shadow-lg hover:bg-blue-100 flex flex-col items-center"
            onClick={() => setMode('admin')}
          >
            <span className="text-2xl mb-4">Mode Administration</span>
            <p className="text-gray-600 text-center">Utilisez ce mode sur l'appareil principal pour gérer les compétitions, cavaliers et chronométrage</p>
          </button>
          
          <button 
            className="bg-white text-blue-700 rounded-lg p-8 shadow-lg hover:bg-blue-100 flex flex-col items-center"
            onClick={() => setMode('display')}
          >
            <span className="text-2xl mb-4">Mode Affichage Public</span>
            <p className="text-gray-600 text-center">Utilisez ce mode sur un écran secondaire pour afficher les résultats en temps réel aux spectateurs</p>
          </button>
        </div>
      </div>
    );
  }

  // Mode affichage - uniquement l'affichage public
  if (mode === 'display') {
    return (
      <div className="h-screen">
        <PublicDisplay 
          currentCompetition={currentCompetition}
          runs={runs}
          activeRun={activeRun}
          switchMode={() => setMode('selector')}
        />
      </div>
    );
  }

  // Mode admin - interface complète
  return (
    <div className="flex flex-col h-screen bg-gray-100">
      {/* En-tête */}
      <header className="bg-blue-600 text-white p-4">
        <div className="flex justify-between">
          <h1 className="text-2xl font-bold">Application de Gestion d'Equifun</h1>
          <button 
            className="px-3 py-1 bg-blue-700 hover:bg-blue-800 rounded"
            onClick={() => setMode('selector')}
          >
            Changer de mode
          </button>
        </div>
        <p className="text-sm opacity-80">Conforme au règlement FFE Equifun 2024</p>
      </header>
      
      {/* Navigation */}
      <nav className="bg-blue-800 text-white">
        <div className="flex">
          <button 
            className={`px-4 py-2 ${activeTab === 'competitions' ? 'bg-blue-700' : ''}`}
            onClick={() => setActiveTab('competitions')}
          >
            Compétitions
          </button>
          <button 
            className={`px-4 py-2 ${activeTab === 'participants' ? 'bg-blue-700' : ''}`}
            onClick={() => setActiveTab('participants')}
          >
            Cavaliers et Poneys
          </button>
          <button 
            className={`px-4 py-2 ${activeTab === 'chronometer' ? 'bg-blue-700' : ''}`}
            onClick={() => setActiveTab('chronometer')}
          >
            Chronomètre
          </button>
          <button 
            className={`px-4 py-2 ${activeTab === 'results' ? 'bg-blue-700' : ''}`}
            onClick={() => setActiveTab('results')}
          >
            Résultats
          </button>
        </div>
      </nav>
      
      {/* Contenu principal */}
      <main className="flex-1 p-4 overflow-auto">
        {/* Onglet Compétitions */}
        {activeTab === 'competitions' && (
          <CompetitionTab 
            competitions={competitions} 
            setCompetitions={setCompetitions} 
            selectCompetition={selectCompetition} 
            setActiveTab={setActiveTab} 
          />
        )}
        
        {/* Onglet Cavaliers et Poneys */}
        {activeTab === 'participants' && (
          <ParticipantsTab 
            riders={riders} 
            setRiders={setRiders} 
            ponies={ponies} 
            setPonies={setPonies}
            couples={couples}
            setCouples={setCouples}
          />
        )}
        
        {/* Onglet Chronomètre */}
        {activeTab === 'chronometer' && (
          <ChronoTab 
            currentCompetition={currentCompetition} 
            riders={riders} 
            ponies={ponies}
            couples={couples}
            runs={runs} 
            setRuns={setRuns}
            setActiveRun={setActiveRun}
          />
        )}
        
        {/* Onglet Résultats */}
        {activeTab === 'results' && (
          <ResultsTab 
            currentCompetition={currentCompetition} 
            riders={riders}
            ponies={ponies}
            runs={runs} 
            teams={teams} 
          />
        )}
      </main>
      
      {/* Pied de page */}
      <footer className="bg-gray-800 text-white p-4 text-center text-sm">
        <p>Application de Gestion d'Equifun - Conforme au règlement FFE 2024</p>
        <p className="text-gray-400 mt-1">Développé pour les centres équestres et organisateurs de compétitions</p>
      </footer>
    </div>
  );
}

export default App;