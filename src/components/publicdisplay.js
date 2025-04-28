import React, { useState, useEffect } from 'react';
import { Clock, ArrowLeftCircle, Maximize } from 'lucide-react';
import CATEGORIES from '../data/categories';

const PublicDisplay = ({ currentCompetition, runs, activeRun, switchMode }) => {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [isFullscreen, setIsFullscreen] = useState(false);
  
  // Mettre à jour l'heure actuelle toutes les secondes
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    
    return () => {
      clearInterval(timer);
    };
  }, []);
  
  // Surveiller les changements de mode plein écran
  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    
    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
    };
  }, []);
  
  // Basculer le mode plein écran
  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(err => {
        console.error(`Erreur lors du passage en plein écran: ${err.message}`);
      });
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      }
    }
  };
  
  // Formater le temps (ms -> mm:ss.cc)
  const formatTime = (time) => {
    if (!time) return '--:--:--';
    
    const minutes = Math.floor(time / 60000);
    const seconds = Math.floor((time % 60000) / 1000);
    const centiseconds = Math.floor((time % 1000) / 10);
    
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}.${centiseconds.toString().padStart(2, '0')}`;
  };
  
  // Filtrer les runs pertinents et les trier
  const competitionRuns = currentCompetition 
    ? runs
        .filter(run => run.competitionId === currentCompetition.id && !run.isEliminated)
        .sort((a, b) => a.finalTime - b.finalTime)
    : [];
    
  // Trouver la catégorie actuelle
  const currentCategory = currentCompetition
    ? CATEGORIES.find(c => c.id === currentCompetition.category)
    : null;

  return (
    <div className="flex flex-col h-screen bg-gray-100">
      {/* En-tête */}
      <header className="bg-blue-600 text-white p-4 flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Résultats Equifun en Direct</h1>
          {currentCompetition && (
            <h2 className="text-xl">{currentCompetition.name} - {currentCategory?.name}</h2>
          )}
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center">
            <Clock size={24} className="mr-2" />
            <span className="text-xl">{currentTime.toLocaleTimeString()}</span>
          </div>
          
          <button 
            className="p-2 bg-blue-700 hover:bg-blue-800 rounded flex items-center"
            onClick={toggleFullscreen}
            title={isFullscreen ? "Quitter le plein écran" : "Plein écran"}
          >
            <Maximize size={20} />
          </button>
          
          <button 
            className="p-2 bg-blue-700 hover:bg-blue-800 rounded flex items-center"
            onClick={switchMode}
            title="Passer en mode administration"
          >
            <ArrowLeftCircle size={20} />
          </button>
        </div>
      </header>
      
      {/* Passage en cours */}
      {activeRun && (
        <div className="bg-yellow-100 p-4 border-l-4 border-yellow-500">
          <h2 className="text-2xl font-bold mb-2">Passage en cours</h2>
          <div className="flex justify-between items-center">
            <div>
              <p className="text-xl font-medium">{activeRun.riderName || 'Cavalier'}</p>
              <p className="text-lg">Poney/Cheval: {activeRun.ponyName || '-'}</p>
            </div>
            <div className="text-5xl font-mono">
              {formatTime(activeRun.time)}
            </div>
          </div>
        </div>
      )}
      
      {/* Classement */}
      <div className="flex-1 p-4 overflow-auto">
        <h2 className="text-2xl font-bold mb-4">Classement Provisoire</h2>
        
        {competitionRuns.length === 0 ? (
          <p className="text-gray-500 text-center text-xl italic my-8">
            Aucun résultat disponible pour le moment
          </p>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white border">
              <thead className="bg-blue-500 text-white">
                <tr>
                  <th className="px-4 py-3 text-left text-lg">Position</th>
                  <th className="px-4 py-3 text-left text-lg">Cavalier</th>
                  <th className="px-4 py-3 text-left text-lg">Poney/Cheval</th>
                  <th className="px-4 py-3 text-left text-lg">Temps</th>
                  <th className="px-4 py-3 text-left text-lg">Pénalités</th>
                  <th className="px-4 py-3 text-left text-lg">Temps final</th>
                </tr>
              </thead>
              <tbody>
                {competitionRuns.map((run, index) => (
                  <tr key={run.id} className={`border-t ${index < 3 ? 'bg-yellow-50' : ''} ${index === 0 ? 'bg-yellow-100 font-bold' : ''}`}>
                    <td className="px-4 py-3 text-lg">
                      {index + 1}
                    </td>
                    <td className="px-4 py-3 text-lg">{run.riderName || 'Inconnu'}</td>
                    <td className="px-4 py-3 text-lg">{run.ponyName || 'Inconnu'}</td>
                    <td className="px-4 py-3 font-mono text-lg">{formatTime(run.time)}</td>
                    <td className="px-4 py-3 text-lg">
                      {run.penalties.length > 0 
                        ? `+${run.penalties.reduce((sum, p) => sum + p.time, 0)}s` 
                        : 'Aucune'}
                    </td>
                    <td className="px-4 py-3 font-mono text-lg font-bold">{formatTime(run.finalTime)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
      
      {/* Pied de page */}
      <footer className="bg-gray-800 text-white p-3 text-center">
        <p className="text-lg">Centre Équestre - Affichage Public - {new Date().getFullYear()}</p>
      </footer>
    </div>
  );
};

export default PublicDisplay;