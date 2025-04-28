import React from 'react';
import { AlertTriangle, Award, CheckCircle } from 'lucide-react';
import CATEGORIES from '../data/categories';

const ResultsTab = ({ currentCompetition, riders, ponies, runs, teams }) => {
  // Fonction pour formater le temps (ms -> mm:ss.cc)
  const formatTime = (time) => {
    if (!time) return '--:--:--';
    
    const minutes = Math.floor(time / 60000);
    const seconds = Math.floor((time % 60000) / 1000);
    const centiseconds = Math.floor((time % 1000) / 10);
    
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}.${centiseconds.toString().padStart(2, '0')}`;
  };

  return (
    <div className="space-y-6">
      <div className="bg-white p-4 rounded shadow">
        <h2 className="text-xl font-bold mb-4">Résultats</h2>
        
        {!currentCompetition ? (
          <div className="bg-yellow-50 border border-yellow-200 p-4 rounded">
            <p className="flex items-center text-yellow-700">
              <AlertTriangle size={20} className="mr-2" />
              Veuillez sélectionner une compétition dans l'onglet "Compétitions"
            </p>
          </div>
        ) : (
          <>
            <div className="mb-4">
              <h3 className="font-bold text-lg">{currentCompetition.name}</h3>
              <p className="text-gray-600">
                {CATEGORIES.find(c => c.id === currentCompetition.category)?.name} - 
                {currentCompetition.type === 'individual' ? ' Individuel' : ' Par équipe'}
              </p>
            </div>
            
            {currentCompetition.type === 'individual' ? (
              <div className="overflow-x-auto">
                <table className="min-w-full">
                  <thead className="bg-gray-100">
                    <tr>
                      <th className="px-4 py-2 text-left">Position</th>
                      <th className="px-4 py-2 text-left">Cavalier</th>
                      <th className="px-4 py-2 text-left">Poney/Cheval</th>
                      <th className="px-4 py-2 text-left">Temps</th>
                      <th className="px-4 py-2 text-left">Pénalités</th>
                      <th className="px-4 py-2 text-left">Temps final</th>
                    </tr>
                  </thead>
                  <tbody>
                    {runs
                      .filter(run => run.competitionId === currentCompetition.id && !run.isEliminated)
                      .sort((a, b) => a.finalTime - b.finalTime)
                      .map((run, index) => (
                        <tr key={run.id} className={`border-t ${index < 3 ? 'bg-yellow-50' : ''}`}>
                          <td className="px-4 py-2">
                            {index === 0 ? (
                              <div className="flex items-center">
                                <Award size={20} className="mr-1 text-yellow-500" />
                                1er
                              </div>
                            ) : index + 1}
                          </td>
                          <td className="px-4 py-2">{run.riderName || 'Inconnu'}</td>
                          <td className="px-4 py-2">{run.ponyName || 'Inconnu'}</td>
                          <td className="px-4 py-2 font-mono">{formatTime(run.time)}</td>
                          <td className="px-4 py-2">
                            {run.penalties.length > 0 ? (
                              <span>
                                +{run.penalties.reduce((sum, p) => sum + p.time, 0)}s
                              </span>
                            ) : (
                              <span className="text-green-600 flex items-center">
                                <CheckCircle size={16} className="mr-1" /> Aucune
                              </span>
                            )}
                          </td>
                          <td className="px-4 py-2 font-mono font-bold">{formatTime(run.finalTime)}</td>
                        </tr>
                      ))}
                  </tbody>
                </table>
                
                <h3 className="font-bold mt-6 mb-2">Cavaliers éliminés</h3>
                <table className="min-w-full">
                  <thead className="bg-gray-100">
                    <tr>
                      <th className="px-4 py-2 text-left">Cavalier</th>
                      <th className="px-4 py-2 text-left">Poney/Cheval</th>
                      <th className="px-4 py-2 text-left">Raison de l'élimination</th>
                      <th className="px-4 py-2 text-left">Temps lors de l'élimination</th>
                    </tr>
                  </thead>
                  <tbody>
                    {runs
                      .filter(run => run.competitionId === currentCompetition.id && run.isEliminated)
                      .map(run => (
                        <tr key={run.id} className="border-t">
                          <td className="px-4 py-2">{run.riderName || 'Inconnu'}</td>
                          <td className="px-4 py-2">{run.ponyName || 'Inconnu'}</td>
                          <td className="px-4 py-2 text-red-600">{run.eliminationReason}</td>
                          <td className="px-4 py-2 font-mono">{formatTime(run.time)}</td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div>
                <h3 className="font-bold mb-2">Classement par équipe</h3>
                {/* Affichage des résultats par équipe */}
                <p className="text-gray-500 italic">Fonctionnalité en cours de développement</p>
              </div>
            )}
          </>
        )}
      </div>
      
      <div className="bg-white p-4 rounded shadow">
        <h2 className="text-xl font-bold mb-4">Exporter les résultats</h2>
        <div className="flex space-x-4">
          <button className="px-4 py-2 bg-green-600 text-white rounded">
            Exporter en PDF
          </button>
          <button className="px-4 py-2 bg-blue-600 text-white rounded">
            Exporter en CSV
          </button>
        </div>
      </div>
    </div>
  );
};

export default ResultsTab;