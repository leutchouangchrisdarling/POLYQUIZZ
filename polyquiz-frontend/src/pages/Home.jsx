import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../context/UserContext';

function Home() {
  const [valeur, setValeur] = useState('');
  const { setPseudo, setBestScore } = useUser();
  const navigate = useNavigate();

  const handleStart = async () => {
    if (!valeur.trim()) return;
    const res = await fetch('http://localhost:5001/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ pseudo: valeur })
    });
    const data = await res.json();
    localStorage.setItem('polyquiz_token', data.token);
    setPseudo(data.pseudo);
    navigate('/quiz');
  };

  return (
    <div>
      <h1>PolyQuiz</h1>
      <input value={valeur} onChange={e => setValeur(e.target.value)} placeholder="Ton pseudo" />
      <button onClick={handleStart}>Démarrer</button>
      <p>Leutchouang Chris Darling · L3 Sécurité & Cryptographie · ENSPM-INFOTEL</p>
    </div>
  );
}

export default Home;