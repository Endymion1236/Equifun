import React from 'react';

const ModeSelector = ({ setMode }) => {
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
          <p className="text-gray-600 text-center">Utilisez ce mode sur l'appareil principal pour gérer les compétitions et le chronométrage</p>
        </button>
        
        <button 
          className="bg-white text-blue-700 rounded-lg p-8 shadow-lg hover:bg-blue-100 flex flex-col items-center"
          onClick={() => setMode('display')}
        >
          <span className="text-2xl mb-4">Mode Affichage Public</span>
          <p className="text-gray-600 text-center">Utilisez ce mode sur un écran secondaire pour afficher les résultats en temps réel</p>
        </button>
      </div>
    </div>
  );
};

export default ModeSelector;