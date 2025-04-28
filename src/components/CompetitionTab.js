import React, { useState } from 'react';
import { Plus } from 'lucide-react';
import CATEGORIES from '../data/categories';

const CompetitionTab = ({ competitions, setCompetitions, selectCompetition, setActiveTab }) => {
  const [newCompetitionName, setNewCompetitionName] = useState('');
  const [newCompetitionCategory, setNewCompetitionCategory] = useState('club-a-moustique');
  const [newCompetitionType, setNewCompetitionType] = useState('individual');

  // Fonction pour ajouter une nouvelle compétition
  const addCompetition = () => {
    if (newCompetitionName.trim() === '') return;
    
    const newCompetition = {
      id: Date.now(),
      name: newCompetitionName,
      category: newCompetitionCategory,
      type: newCompetitionType,
      date: new Date().toISOString().slice(0, 10),
      status: 'upcoming'
    };
    
    setCompetitions([...competitions, newCompetition]);
    setNewCompetitionName('');
  };

  return (
    <div className="space-y-6">
      <div className="bg-white p-4 rounded shadow">
        <h2 className="text-xl font-bold mb-4">Créer une nouvelle compétition</h2>
        <div className="flex flex-col md:flex-row space-y-2 md:space-y-0 md:space-x-4">
          <input
            type="text"
            placeholder="Nom de la compétition"
            className="px-3 py-2 border rounded flex-1"
            value={newCompetitionName}
            onChange={(e) => setNewCompetitionName(e.target.value)}
          />
          <select 
            className="px-3 py-2 border rounded"
            value={newCompetitionCategory}
            onChange={(e) => setNewCompetitionCategory(e.target.value)}
          >
            {CATEGORIES.map(category => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>
          <select
            className="px-3 py-2 border rounded"
            value={newCompetitionType}
            onChange={(e) => setNewCompetitionType(e.target.value)}
          >
            <option value="individual">Individuel</option>
            <option value="team">Par équipe</option>
          </select>
          <button 
            className="px-4 py-2 bg-blue-600 text-white rounded flex items-center"
            onClick={addCompetition}
          >
            <Plus size={18} className="mr-2" /> Ajouter
          </button>
        </div>
      </div>
      
      <div className="bg-white p-4 rounded shadow">
        <h2 className="text-xl font-bold mb-4">Compétitions</h2>
        {competitions.length === 0 ? (
          <p className="text-gray-500 italic">Aucune compétition créée</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead className="bg-gray-100">
                <tr>
                  <th className="px-4 py-2 text-left">Nom</th>
                  <th className="px-4 py-2 text-left">Catégorie</th>
                  <th className="px-4 py-2 text-left">Type</th>
                  <th className="px-4 py-2 text-left">Date</th>
                  <th className="px-4 py-2 text-left">Statut</th>
                  <th className="px-4 py-2 text-left">Actions</th>
                </tr>
              </thead>
              <tbody>
                {competitions.map(competition => {
                  const category = CATEGORIES.find(c => c.id === competition.category);
                  return (
                    <tr key={competition.id} className="border-t">
                      <td className="px-4 py-2">{competition.name}</td>
                      <td className="px-4 py-2">{category ? category.name : competition.category}</td>
                      <td className="px-4 py-2">{competition.type === 'individual' ? 'Individuel' : 'Par équipe'}</td>
                      <td className="px-4 py-2">{competition.date}</td>
                      <td className="px-4 py-2">
                        {competition.status === 'upcoming' ? 'À venir' : 
                         competition.status === 'in_progress' ? 'En cours' : 'Terminée'}
                      </td>
                      <td className="px-4 py-2">
                        <button 
                          className="px-3 py-1 bg-green-600 text-white rounded mr-2"
                          onClick={() => {
                            selectCompetition(competition);
                            setActiveTab('chronometer');
                          }}
                        >
                          Chronométrer
                        </button>
                        <button 
                          className="px-3 py-1 bg-blue-600 text-white rounded"
                          onClick={() => {
                            selectCompetition(competition);
                            setActiveTab('results');
                          }}
                        >
                          Résultats
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default CompetitionTab;