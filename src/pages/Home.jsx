import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../context/UserContext';

function Home() {
  const [valeur, setValeur] = useState('');
  const { setPseudo, bestScore } = useUser();
  const navigate = useNavigate();

  const handleStart = () => {
    if (!valeur.trim()) return;
    setPseudo(valeur.trim());
    setTimeout(() => navigate('/quiz'), 0);
  };

  return (
    <div className="container">
      <h1>PolyQuizz</h1>
      <p style={{ textAlign: 'center', color: '#555' }}>Meilleur score : <strong>{bestScore}</strong></p>
      
      <input 
        value={valeur} 
        onChange={e => setValeur(e.target.value)} 
        placeholder="Ton pseudo" 
        onKeyDown={e => {
          if (e.key === 'Enter') handleStart();
        }}
      />
      
      <button onClick={handleStart}>Démarrer</button>
      
      <div className="footer">
        Leutchouang Chris Darling · L3 Sécurité & Cryptographie · ENSPM-INFOTEL
      </div>
    </div>
  );
}

export default Home;
