// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getDatabase, ref, set, onValue, off } from 'firebase/database';

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyB86-3VjsjHqO8s8T_kOkEHp9W4SvtOWGI",
  authDomain: "equifun-app.firebaseapp.com",
  databaseURL: "https://equifun-app-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "equifun-app",
  storageBucket: "equifun-app.firebasestorage.app",
  messagingSenderId: "1020551467434",
  appId: "1:1020551467434:web:c8c1197d6dddb409a99bd3"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const database = getDatabase(app);

// Fonction pour sauvegarder les données de l'application
export const saveAppData = (data) => {
  set(ref(database, 'appData'), data);
};

// Fonction pour écouter les modifications des données
export const listenToAppData = (callback) => {
  const appDataRef = ref(database, 'appData');
  onValue(appDataRef, (snapshot) => {
    const data = snapshot.val();
    if (data) {
      callback(data);
    }
  });
  
  // Retourne une fonction pour arrêter l'écoute
  return () => off(appDataRef);
};

// Fonction pour sauvegarder le passage en cours
export const saveActiveRun = (activeRun) => {
  set(ref(database, 'activeRun'), activeRun);
};

// Fonction pour écouter les modifications du passage en cours
export const listenToActiveRun = (callback) => {
  const activeRunRef = ref(database, 'activeRun');
  onValue(activeRunRef, (snapshot) => {
    const data = snapshot.val();
    if (data) {
      callback(data);
    }
  });
  
  // Retourne une fonction pour arrêter l'écoute
  return () => off(activeRunRef);
};

// Fonction pour sauvegarder les runs (passages)
export const saveRuns = (runs) => {
  set(ref(database, 'runs'), runs);
};

// Fonction pour écouter les modifications des runs
export const listenToRuns = (callback) => {
  const runsRef = ref(database, 'runs');
  onValue(runsRef, (snapshot) => {
    const data = snapshot.val();
    if (data) {
      callback(data);
    }
  });
  
  // Retourne une fonction pour arrêter l'écoute
  return () => off(runsRef);
};

// Fonction pour sauvegarder la compétition actuelle
export const saveCurrentCompetition = (competition) => {
  set(ref(database, 'currentCompetition'), competition);
};

// Fonction pour écouter les modifications de la compétition actuelle
export const listenToCurrentCompetition = (callback) => {
  const competitionRef = ref(database, 'currentCompetition');
  onValue(competitionRef, (snapshot) => {
    const data = snapshot.val();
    if (data) {
      callback(data);
    }
  });
  
  // Retourne une fonction pour arrêter l'écoute
  return () => off(competitionRef);
};

export default database;