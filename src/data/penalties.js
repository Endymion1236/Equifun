// src/data/penalties.js
const PENALTIES = [
  { id: 1, desc: '1 faute sur un dispositif', time: 20 },
  { id: 2, desc: '2ème faute et suivantes sur le même dispositif', time: 5 },
  { id: 3, desc: 'Dispositif détruit lors de la 1ère tentative et infranchissable', time: 40 },
  { id: 4, desc: 'Dispositif détruit lors de la 2ème tentative ou plus et infranchissable', time: 20 },
  { id: 5, desc: 'Dispositif non réalisé lors de la 1ère tentative et non recommencé', time: 40 },
  { id: 6, desc: 'Dispositif non réalisé après 2 tentatives et non recommencé', time: 20 },
  { id: 7, desc: 'Non franchissement d\'une porte d\'entrée', time: 20 },
  { id: 8, desc: 'Non franchissement d\'une porte de sortie', time: 20 },
  { id: 9, desc: 'Aides de complaisances', time: 10 }
];

export default PENALTIES;