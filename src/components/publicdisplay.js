import React from 'react';
import { XCircle } from 'lucide-react';

const PublicDisplay = ({ 
  currentCompetition, 
  runs = [], 
  activeRun, 
  switchMode 
}) => {
  // Tri des passages par temps final (sans élimination)
  const sortedRuns = [...runs]
    .filter(run => !run.isEliminated)
    .sort((a, b) => {
      if (a.finalTime === null) return 1;
      if (b.finalTime === null) return -1;
      return a.finalTime - b.finalTime;
    });

  return (
    <div className="h-full flex flex-col bg-blue-600 text-white">
      {/* En-tête */}
      <header className="bg-blue-700 p-4 flex justify-between items-center">
        <h1 className="text-2xl font-bold">
          {currentCompetition ? currentCompetition.name : 'Aucune compétition en cours'}
        </h1>
        <button 
          className="px-3 py-1 bg-blue-800 hover:bg-blue-900 rounded"
          onClick={switchMode}
        >
          Changer de mode
        </button>
      </header>

      {/* Passage actuel */}
      <div className="p-4 bg-blue-500">
        <h2 className="text-xl font-semibold">Passage en cours</h2>
        {activeRun ? (
          <div className="flex justify-between items-center">
            <div>
              <p className="text-lg">
                {activeRun.riderName} sur {activeRun.ponyName}
              </p>
            </div>
          </div>
        ) : (
          <p className="text-gray-200">Aucun passage en cours</p>
        )}
      </div>

      {/* Liste des passages */}
      <div className="flex-1 overflow-auto p-4">
        <h2 className="text-2xl font-bold mb-4">Résultats</h2>
        {sortedRuns.length === 0 ? (
          <p className="text-gray-300">Aucun résultat enregistré</p>
        ) : (
          <table className="w-full text-left">
            <thead>
              <tr className="bg-blue-700">
                <th className="p-2">Classement</th>
                <th className="p-2">Cavalier</th>
                <th className="p-2">Poney</th>
                <th className="p-2">Temps</th>
                <th className="p-2">Pénalités</th>
              </tr>
            </thead>
            <tbody>
              {sortedRuns.map((run, index) => (
                <tr 
                  key={run.id} 
                  className={`border-b border-blue-500 ${index === 0 ? 'bg-yellow-500 text-blue-900' : ''}`}
                >
                  <td className="p-2">{index + 1}</td>
                  <td className="p-2">{run.riderName}</td>
                  <td className="p-2">{run.ponyName}</td>
                  <td className="p-2">
                    {run.finalTime 
                      ? formatTime(run.finalTime) 
                      : 'Éliminé'}
                  </td>
                  <td className="p-2">
                    {run.penalties 
                      ? `${run.penalties.reduce((total, p) => total + p.time, 0)} s` 
                      : '0 s'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Pied de page */}
      <footer className="bg-blue-700 p-4 text-center">
        <p>Application Equifun - Résultats en direct</p>
      </footer>
    </div>
  );
};

// Fonction utilitaire pour formater le temps
const formatTime = (time) => {
  const minutes = Math.floor(time / 60000);
  const seconds = Math.floor((time % 60000) / 1000);
  const centiseconds = Math.floor((time % 1000) / 10);
  
  return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}.${centiseconds.toString().padStart(2, '0')}`;
};

export default PublicDisplay;