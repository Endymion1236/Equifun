import React, { useState, useEffect } from 'react';
import { PlayCircle, PauseCircle, RefreshCw, Save, AlertTriangle, XCircle } from 'lucide-react';
import CATEGORIES from '../data/categories';
import PENALTIES from '../data/penalties';
import ELIMINATIONS from '../data/eliminations';

const ChronoTab = ({ 
  currentCompetition, 
  riders, 
  ponies,
  couples,
  runs, 
  setRuns,
  setActiveRun
}) => {
  const [selectedCoupleId, setSelectedCoupleId] = useState('');
  const [currentCouple, setCurrentCouple] = useState(null);
  const [isRunning, setIsRunning] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [timerInterval, setTimerInterval] = useState(null);
  const [activePenalties, setActivePenalties] = useState([]);
  const [isEliminated, setIsEliminated] = useState(false);
  const [eliminationReason, setEliminationReason] = useState('');

  // Effet pour mettre à jour le couple courant quand la sélection change
  useEffect(() => {
    if (!selectedCoupleId) {
      setCurrentCouple(null);
      return;
    }
    
    const couple = couples.find(c => c.id.toString() === selectedCoupleId.toString());
    setCurrentCouple(couple || null);
  }, [selectedCoupleId, couples]);

  // Fonction pour démarrer le chronomètre
  const startTimer = () => {
    if (isRunning) return;
    
    setIsRunning(true);
    setActiveRun({
      riderName: currentCouple?.riderName || 'Concurrent',
      ponyName: currentCouple?.ponyName || '',
      time: 0
    });
    const interval = setInterval(() => {
      setCurrentTime(prevTime => {
        // Arrêt automatique à 6 minutes (360000 ms) conformément au règlement
        if (prevTime >= 360000) {
          clearInterval(interval);
          setIsRunning(false);
          setIsEliminated(true);
          setEliminationReason('Franchissement de la ligne en 6 minutes ou plus');
          return prevTime;
        }
        return prevTime + 10;
      });
    }, 10);
    
    setTimerInterval(interval);
  };

  // Fonction pour arrêter le chronomètre
  const stopTimer = () => {
    if (!isRunning) return;
    
    clearInterval(timerInterval);
    setIsRunning(false);
  };

  // Fonction pour réinitialiser le chronomètre
  const resetTimer = () => {
    clearInterval(timerInterval);
    setIsRunning(false);
    setCurrentTime(0);
    setActivePenalties([]);
    setIsEliminated(false);
    setEliminationReason('');
  };

  // Fonction pour ajouter une pénalité
  const addPenalty = (penaltyId) => {
    console.log("Ajout de pénalité:", penaltyId);
    const penalty = PENALTIES.find(p => p.id === penaltyId);
    if (penalty) {
      setActivePenalties(prevPenalties => [...prevPenalties, penalty]);
      console.log("Pénalité ajoutée:", penalty.desc, "+", penalty.time, "s");
    }
  };

  // Fonction pour éliminer un concurrent
  const eliminateParticipant = (reason) => {
    stopTimer();
    setIsEliminated(true);
    setEliminationReason(reason);
  };

  // Fonction pour calculer le temps final (avec pénalités)
  const calculateFinalTime = () => {
    const penaltiesTime = activePenalties.reduce((total, penalty) => total + penalty.time, 0);
    return currentTime + (penaltiesTime * 1000); // Conversion des pénalités en ms
  };

  // Fonction pour formater le temps (ms -> mm:ss.cc)
  const formatTime = (time) => {
    const minutes = Math.floor(time / 60000);
    const seconds = Math.floor((time % 60000) / 1000);
    const centiseconds = Math.floor((time % 1000) / 10);
    
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}.${centiseconds.toString().padStart(2, '0')}`;
  };

  // Fonction pour sauvegarder un passage
  const saveRun = () => {
    if (!currentCouple) return;
    
    const newRun = {
      id: Date.now(),
      competitionId: currentCompetition?.id,
      coupleId: currentCouple.id,
      riderId: currentCouple.riderId,
      ponyId: currentCouple.ponyId,
      riderName: currentCouple.riderName,
      ponyName: currentCouple.ponyName,
      time: currentTime,
      penalties: activePenalties,
      finalTime: isEliminated ? null : calculateFinalTime(),
      isEliminated,
      eliminationReason,
      date: new Date().toISOString()
    };
    
    setRuns([...runs, newRun]);
    resetTimer();
    setSelectedCoupleId('');
    setCurrentCouple(null);
  };
  
  // Effet pour nettoyer le timer quand le composant est démonté
  useEffect(() => {
    return () => {
      if (timerInterval) {
        clearInterval(timerInterval);
      }
    };
  }, [timerInterval]);

  // Obtenir le poney associé au cavalier sélectionné
  const getPonyInfo = () => {
    if (!currentCouple) return null;
    
    // Trouver le poney dans la liste
    const pony = ponies.find(p => p.id === currentCouple.ponyId);
    if (!pony) return null;
    
    // Retourner les informations du poney
    return {
      name: pony.name,
      category: pony.category,
      age: pony.age
    };
  };

  // Informations du poney
  const ponyInfo = getPonyInfo();

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <div className="md:col-span-2 space-y-6">
        <div className="bg-white p-4 rounded shadow">
          <h2 className="text-xl font-bold mb-4">
            {currentCompetition ? `Chronomètre - ${currentCompetition.name}` : 'Chronomètre'}
          </h2>
          {!currentCompetition ? (
            <div className="bg-yellow-50 border border-yellow-200 p-4 rounded">
              <p className="flex items-center text-yellow-700">
                <AlertTriangle size={20} className="mr-2" />
                Veuillez sélectionner une compétition dans l'onglet "Compétitions"
              </p>
            </div>
          ) : (
            <>
              <div className="flex justify-between items-center mb-4">
                <div>
                  <p className="text-sm text-gray-600">
                    Catégorie: {CATEGORIES.find(c => c.id === currentCompetition.category)?.name}
                  </p>
                  <p className="text-sm text-gray-600">
                    Type: {currentCompetition.type === 'individual' ? 'Individuel' : 'Par équipe'}
                  </p>
                </div>
                <div className="flex flex-col space-y-2">
                  <select 
                    className="px-3 py-2 border rounded"
                    value={selectedCoupleId}
                    onChange={(e) => {
                      setSelectedCoupleId(e.target.value);
                      resetTimer();
                    }}
                  >
                    <option value="">Sélectionner un couple cavalier/poney</option>
                    {couples.map(couple => (
                      <option key={couple.id} value={couple.id}>
                        {couple.riderName} (avec {couple.ponyName})
                      </option>
                    ))}
                  </select>
                  
                  {ponyInfo && (
                    <div className="px-3 py-2 border rounded bg-blue-50 text-sm">
                      Poney: <strong>{currentCouple.ponyName}</strong> (Cat. {ponyInfo.category})
                    </div>
                  )}
                </div>
              </div>
              
              <div className={`mb-6 p-4 rounded flex items-center justify-center text-5xl font-mono ${isEliminated ? 'bg-red-100 text-red-800' : 'bg-gray-100'}`}>
                {isEliminated ? 'ÉLIMINÉ' : formatTime(currentTime)}
              </div>
              
              <div className="flex justify-center space-x-4 mb-6">
                <button 
                  className={`px-6 py-3 rounded flex items-center ${isRunning ? 'bg-gray-300 cursor-not-allowed' : 'bg-green-600 text-white'}`}
                  onClick={startTimer}
                  disabled={isRunning || isEliminated || !currentCouple}
                >
                  <PlayCircle size={20} className="mr-2" /> Démarrer
                </button>
                <button 
                  className={`px-6 py-3 rounded flex items-center ${!isRunning ? 'bg-gray-300 cursor-not-allowed' : 'bg-red-600 text-white'}`}
                  onClick={stopTimer}
                  disabled={!isRunning || isEliminated}
                >
                  <PauseCircle size={20} className="mr-2" /> Arrêter
                </button>
                <button 
                  className="px-6 py-3 bg-gray-600 text-white rounded flex items-center"
                  onClick={resetTimer}
                >
                  <RefreshCw size={20} className="mr-2" /> Réinitialiser
                </button>
              </div>
              
              {isEliminated ? (
                <div className="bg-red-50 border border-red-200 p-4 rounded mb-4">
                  <p className="font-bold text-red-700">Éliminé: {eliminationReason}</p>
                </div>
              ) : (
                <div className="space-y-2 mb-4">
                  <p className="font-bold">Temps final (avec pénalités): {formatTime(calculateFinalTime())}</p>
                  {activePenalties.length > 0 && (
                    <div>
                      <p className="text-gray-600">Pénalités: {activePenalties.reduce((total, p) => total + p.time, 0)} secondes</p>
                      <ul className="list-disc pl-6 text-sm text-gray-600">
                        {activePenalties.map((penalty, index) => (
                          <li key={index}>{penalty.desc} (+{penalty.time}s)</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              )}
              
              <button 
                className="w-full px-4 py-2 bg-blue-600 text-white rounded flex items-center justify-center"
                onClick={saveRun}
                disabled={!currentCouple}
              >
                <Save size={20} className="mr-2" /> Sauvegarder ce passage
              </button>
            </>
          )}
        </div>
      </div>
      
      <div className="space-y-6">
        <div className="bg-white p-4 rounded shadow">
          <h2 className="text-xl font-bold mb-4">Pénalités</h2>
          <div className="space-y-2 max-h-96 overflow-y-auto">
            {PENALTIES.map(penalty => (
              <button
                key={penalty.id}
                className="w-full p-2 border rounded text-left flex justify-between items-center hover:bg-gray-50"
                onClick={() => addPenalty(penalty.id)}
                disabled={isEliminated} // Permet l'ajout même quand le chrono est arrêté
              >
                <span>{penalty.desc}</span>
                <span className="font-mono bg-red-100 px-2 py-1 rounded">+{penalty.time}s</span>
              </button>
            ))}
          </div>
        </div>
        
        <div className="bg-white p-4 rounded shadow">
          <h2 className="text-xl font-bold mb-4">Élimination</h2>
          <div className="space-y-2">
            {ELIMINATIONS.map(elimination => (
              <button
                key={elimination.id}
                className="w-full p-2 border border-red-200 rounded text-left flex justify-between items-center hover:bg-red-50"
                onClick={() => eliminateParticipant(elimination.desc)}
                disabled={