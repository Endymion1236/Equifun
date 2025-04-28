import React, { useState } from 'react';
import { Plus, Trash2, Link } from 'lucide-react';

const ParticipantsTab = ({ riders, setRiders, ponies, setPonies, couples, setCouples }) => {
  const [newRiderName, setNewRiderName] = useState('');
  const [newRiderAge, setNewRiderAge] = useState('');
  const [newRiderGalop, setNewRiderGalop] = useState('');
  
  const [newPonyName, setNewPonyName] = useState('');
  const [newPonyCategory, setNewPonyCategory] = useState('');
  const [newPonyAge, setNewPonyAge] = useState('');
  
  // États pour les couples cavalier/poney
  const [selectedRider, setSelectedRider] = useState('');
  const [selectedPony, setSelectedPony] = useState('');

  // Fonction pour ajouter un nouveau cavalier
  const addRider = () => {
    if (newRiderName.trim() === '') return;
    
    const newRider = {
      id: Date.now(),
      name: newRiderName,
      age: newRiderAge || 'Non spécifié',
      galopLevel: newRiderGalop || 'Non spécifié'
    };
    
    setRiders([...riders, newRider]);
    setNewRiderName('');
    setNewRiderAge('');
    setNewRiderGalop('');
  };

  // Fonction pour ajouter un nouveau poney
  const addPony = () => {
    if (newPonyName.trim() === '') return;
    
    const newPony = {
      id: Date.now(),
      name: newPonyName,
      category: newPonyCategory || 'Non spécifié',
      age: newPonyAge || 'Non spécifié'
    };
    
    setPonies([...ponies, newPony]);
    setNewPonyName('');
    setNewPonyCategory('');
    setNewPonyAge('');
  };

  // Fonction pour associer un cavalier et un poney
  const addCouple = () => {
    if (!selectedRider || !selectedPony) return;
    
    const rider = riders.find(r => r.id.toString() === selectedRider);
    const pony = ponies.find(p => p.id.toString() === selectedPony);
    
    if (!rider || !pony) return;
    
    // Vérifier si ce couple existe déjà
    const existingCouple = couples.find(
      c => c.riderId.toString() === selectedRider && c.ponyId.toString() === selectedPony
    );
    
    if (existingCouple) {
      alert('Ce couple cavalier/poney existe déjà!');
      return;
    }
    
    const newCouple = {
      id: Date.now(),
      riderId: rider.id,
      ponyId: pony.id,
      riderName: rider.name,
      ponyName: pony.name
    };
    
    setCouples([...couples, newCouple]);
    setSelectedRider('');
    setSelectedPony('');
  };

  // Fonction pour supprimer un cavalier
  const deleteRider = (riderId) => {
    setRiders(riders.filter(rider => rider.id !== riderId));
    
    // Supprimer aussi tous les couples associés à ce cavalier
    setCouples(couples.filter(couple => couple.riderId !== riderId));
  };

  // Fonction pour supprimer un poney
  const deletePony = (ponyId) => {
    setPonies(ponies.filter(pony => pony.id !== ponyId));
    
    // Supprimer aussi tous les couples associés à ce poney
    setCouples(couples.filter(couple => couple.ponyId !== ponyId));
  };

  // Fonction pour supprimer un couple
  const deleteCouple = (coupleId) => {
    setCouples(couples.filter(c => c.id !== coupleId));
  };

  // Obtenir les associations pour un cavalier
  const getRiderPonies = (riderId) => {
    return couples
      .filter(couple => couple.riderId === riderId)
      .map(couple => {
        const pony = ponies.find(p => p.id === couple.ponyId);
        return pony ? pony.name : 'Inconnu';
      });
  };
  
  // Obtenir les associations pour un poney
  const getPonyRiders = (ponyId) => {
    return couples
      .filter(couple => couple.ponyId === ponyId)
      .map(couple => {
        const rider = riders.find(r => r.id === couple.riderId);
        return rider ? rider.name : 'Inconnu';
      });
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-4 rounded shadow">
          <h2 className="text-xl font-bold mb-4">Cavaliers</h2>
          <div className="mb-4 border-b pb-4">
            <h3 className="font-bold mb-2">Ajouter un cavalier</h3>
            <div className="flex flex-col space-y-2">
              <input
                type="text"
                placeholder="Nom du cavalier"
                className="px-3 py-2 border rounded"
                value={newRiderName}
                onChange={(e) => setNewRiderName(e.target.value)}
              />
              <div className="flex space-x-2">
                <input
                  type="number"
                  placeholder="Âge"
                  className="px-3 py-2 border rounded w-24"
                  value={newRiderAge}
                  onChange={(e) => setNewRiderAge(e.target.value)}
                />
                <select 
                  className="px-3 py-2 border rounded flex-1"
                  value={newRiderGalop}
                  onChange={(e) => setNewRiderGalop(e.target.value)}
                >
                  <option value="">Niveau Galop</option>
                  <option value="bronze">Galop de Bronze</option>
                  <option value="argent">Galop d'Argent</option>
                  <option value="or">Galop d'Or</option>
                  <option value="Galop 1">Galop 1</option>
                  <option value="Galop 2">Galop 2</option>
                  <option value="Galop 3">Galop 3</option>
                  <option value="Galop 4">Galop 4</option>
                  <option value="Galop 5">Galop 5</option>
                  <option value="Galop 6">Galop 6</option>
                  <option value="Galop 7">Galop 7</option>
                </select>
              </div>
              <button 
                className="px-4 py-2 bg-blue-600 text-white rounded flex items-center self-start"
                onClick={addRider}
              >
                <Plus size={18} className="mr-2" /> Ajouter
              </button>
            </div>
          </div>
          
          <h3 className="font-bold mb-2">Liste des cavaliers</h3>
          {riders.length === 0 ? (
            <p className="text-gray-500 italic">Aucun cavalier enregistré</p>
          ) : (
            <div className="space-y-2 max-h-96 overflow-y-auto">
              {riders.map(rider => {
                const riderPonies = getRiderPonies(rider.id);
                return (
                  <div key={rider.id} className="p-2 border rounded flex justify-between items-center">
                    <div>
                      <p className="font-medium">{rider.name}</p>
                      <p className="text-sm text-gray-600">{rider.age} ans - {rider.galopLevel}</p>
                      {riderPonies.length > 0 && (
                        <p className="text-xs text-blue-600">
                          Avec {riderPonies.join(', ')}
                        </p>
                      )}
                    </div>
                    <button 
                      className="text-red-500"
                      onClick={() => deleteRider(rider.id)}
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                );
              })}
            </div>
          )}
        </div>
        
        <div className="bg-white p-4 rounded shadow">
          <h2 className="text-xl font-bold mb-4">Poneys/Chevaux</h2>
          <div className="mb-4 border-b pb-4">
            <h3 className="font-bold mb-2">Ajouter un poney/cheval</h3>
            <div className="flex flex-col space-y-2">
              <input
                type="text"
                placeholder="Nom du poney/cheval"
                className="px-3 py-2 border rounded"
                value={newPonyName}
                onChange={(e) => setNewPonyName(e.target.value)}
              />
              <div className="flex space-x-2">
                <select 
                  className="px-3 py-2 border rounded flex-1"
                  value={newPonyCategory}
                  onChange={(e) => setNewPonyCategory(e.target.value)}
                >
                  <option value="">Catégorie</option>
                  <option value="A">A</option>
                  <option value="B">B</option>
                  <option value="C">C</option>
                  <option value="D">D</option>
                  <option value="E">E</option>
                  <option value="F">F</option>
                </select>
                <input
                  type="number"
                  placeholder="Âge"
                  className="px-3 py-2 border rounded w-24"
                  value={newPonyAge}
                  onChange={(e) => setNewPonyAge(e.target.value)}
                />
              </div>
              <button 
                className="px-4 py-2 bg-blue-600 text-white rounded flex items-center self-start"
                onClick={addPony}
              >
                <Plus size={18} className="mr-2" /> Ajouter
              </button>
            </div>
          </div>
          
          <h3 className="font-bold mb-2">Liste des poneys/chevaux</h3>
          {ponies.length === 0 ? (
            <p className="text-gray-500 italic">Aucun poney/cheval enregistré</p>
          ) : (
            <div className="space-y-2 max-h-96 overflow-y-auto">
              {ponies.map(pony => {
                const ponyRiders = getPonyRiders(pony.id);
                return (
                  <div key={pony.id} className="p-2 border rounded flex justify-between items-center">
                    <div>
                      <p className="font-medium">{pony.name}</p>
                      <p className="text-sm text-gray-600">Catégorie {pony.category} - {pony.age} ans</p>
                      {ponyRiders.length > 0 && (
                        <p className="text-xs text-blue-600">
                          Monté par: {ponyRiders.join(', ')}
                        </p>
                      )}
                    </div>
                    <button 
                      className="text-red-500"
                      onClick={() => deletePony(pony.id)}
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
      
      {/* Section pour associer cavaliers et poneys */}
      <div className="bg-white p-4 rounded shadow">
        <h2 className="text-xl font-bold mb-4 flex items-center">
          <Link size={20} className="mr-2 text-blue-600" />
          Créer un couple cavalier/poney
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Cavalier</label>
            <select
              className="w-full px-3 py-2 border rounded"
              value={selectedRider}
              onChange={(e) => setSelectedRider(e.target.value)}
            >
              <option value="">Sélectionner un cavalier</option>
              {riders.map(rider => (
                <option key={rider.id} value={rider.id}>
                  {rider.name}
                </option>
              ))}
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Poney/Cheval</label>
            <select
              className="w-full px-3 py-2 border rounded"
              value={selectedPony}
              onChange={(e) => setSelectedPony(e.target.value)}
            >
              <option value="">Sélectionner un poney/cheval</option>
              {ponies.map(pony => (
                <option key={pony.id} value={pony.id}>
                  {pony.name} (Cat. {pony.category})
                </option>
              ))}
            </select>
          </div>
          
          <div className="flex items-end">
            <button
              className="w-full px-4 py-2 bg-blue-600 text-white rounded flex items-center justify-center"
              onClick={addCouple}
              disabled={!selectedRider || !selectedPony}
            >
              <Plus size={18} className="mr-2" /> Associer
            </button>
          </div>
        </div>
        
        <h3 className="font-bold mb-2">Couples cavalier/poney</h3>
        {couples.length === 0 ? (
          <p className="text-gray-500 italic">Aucun couple enregistré</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead className="bg-gray-100">
                <tr>
                  <th className="px-4 py-2 text-left">Cavalier</th>
                  <th className="px-4 py-2 text-left">Poney/Cheval</th>
                  <th className="px-4 py-2 text-left">Actions</th>
                </tr>
              </thead>
              <tbody>
                {couples.map(couple => (
                  <tr key={couple.id} className="border-t">
                    <td className="px-4 py-2">{couple.riderName}</td>
                    <td className="px-4 py-2">{couple.ponyName}</td>
                    <td className="px-4 py-2">
                      <button
                        className="text-red-500"
                        onClick={() => deleteCouple(couple.id)}
                      >
                        <Trash2 size={18} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default ParticipantsTab;