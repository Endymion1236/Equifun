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
  const stopTimer = () =>